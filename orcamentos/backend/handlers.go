package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Create
func CreateEstimateHandler(w http.ResponseWriter, r *http.Request) {
	var e Estimate
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// ensure at least one item
	if len(e.Items) == 0 {
		http.Error(w, "items required", http.StatusBadRequest)
		return
	}

	if err := DB.Create(&e).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	message := BuildEstimateMessage(&e)
	resp := map[string]any{"estimate": e, "message": message}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// List
func ListEstimatesHandler(w http.ResponseWriter, r *http.Request) {
	var list []Estimate
	DB.Preload("Items").Order("created_at desc").Find(&list)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}

// Get by id
func GetEstimateHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	iid, _ := strconv.Atoi(id)
	var e Estimate
	if err := DB.Preload("Items").First(&e, iid).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	resp := map[string]any{"estimate": e, "message": BuildEstimateMessage(&e)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Update
func UpdateEstimateHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	iid, _ := strconv.Atoi(id)

	var payload Estimate
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var existing Estimate
	if err := DB.Preload("Items").First(&existing, iid).Error; err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	// replace fields
	existing.ClientName = payload.ClientName
	existing.ProductionETA = payload.ProductionETA
	existing.PaymentMethod = payload.PaymentMethod
	existing.ValidityDays = payload.ValidityDays
	existing.LogoURL = payload.LogoURL
	// Replace items: easiest is to delete existing items and create new ones
	if err := DB.Model(&existing).Association("Items").Clear(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	existing.Items = payload.Items

	if err := DB.Save(&existing).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := map[string]any{"estimate": existing, "message": BuildEstimateMessage(&existing)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Delete
func DeleteEstimateHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	iid, _ := strconv.Atoi(id)
	if err := DB.Delete(&Estimate{}, iid).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Build text message (formato padrão)
func BuildEstimateMessage(e *Estimate) string {
	msg := "Segue proposta:\n\n"
	for i, it := range e.Items {
		msg += fmt.Sprintf("Item %d - \"%s\" - %s\n", i+1, it.Title, it.Specs)
		msg += fmt.Sprintf("%d unidades (R$ %.2f un.)\n", it.Quantity, it.UnitPrice)
		msg += fmt.Sprintf("Valor Total - R$ %.2f\n\n", it.Subtotal)
	}
	msg += "--------------------------\n"
	msg += fmt.Sprintf("Cliente: %s\n", e.ClientName)
	msg += fmt.Sprintf("Data: %s\n", e.CreatedAt.Format("02/01/2006"))
	if e.ProductionETA != "" {
		msg += fmt.Sprintf("Produção: %s\n", e.ProductionETA)
	} else {
		msg += "Produção: -\n"
	}
	msg += fmt.Sprintf("\nValor total a pagar:\nR$ %.2f\n", e.Total)
	return strings.ReplaceAll(msg, ".", ",")
}
