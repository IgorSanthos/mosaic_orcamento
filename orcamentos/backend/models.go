package main

import (
	"time"

	"gorm.io/gorm"
)

type Estimate struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	ClientName    string         `json:"client_name"`
	ProductionETA string         `json:"production_eta"` // ex: "3 a 4 dias"
	PaymentMethod string         `json:"payment_method"` // opcional
	ValidityDays   int           `json:"validity_days"`
	LogoURL       string         `json:"logo_url"` // opcional (pode ser base64 ou URL)
	Items         []EstimateItem `json:"items" gorm:"constraint:OnDelete:CASCADE;"`
	Total         float64        `json:"total"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

type EstimateItem struct {
	ID         uint    `gorm:"primaryKey" json:"id"`
	EstimateID uint    `json:"estimate_id"`
	Title      string  `json:"title"`
	Specs      string  `json:"specs"`
	Quantity   int     `json:"quantity"`
	UnitPrice  float64 `json:"unit_price"`
	Subtotal   float64 `json:"subtotal"`
}

func (e *Estimate) BeforeSave(tx *gorm.DB) (err error) {
	total := 0.0
	for i := range e.Items {
		e.Items[i].Subtotal = float64(e.Items[i].Quantity) * e.Items[i].UnitPrice
		total += e.Items[i].Subtotal
	}
	e.Total = total
	return nil
}
