package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	DB = SetupDatabase()

	r := mux.NewRouter()

	// Subrouter /api
	api := r.PathPrefix("/api").Subrouter()

	// APLICA CORS DIRETAMENTE NO SUBROUTER
	api.Use(dynamicCORS)

	// 🔥 Registrar OPTIONS para passar no preflight
	api.HandleFunc("/estimates", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}).Methods("OPTIONS")

	api.HandleFunc("/estimates/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}).Methods("OPTIONS")

	// Rotas reais
	api.HandleFunc("/estimates", CreateEstimateHandler).Methods("POST")
	api.HandleFunc("/estimates", ListEstimatesHandler).Methods("GET")
	api.HandleFunc("/estimates/{id}", GetEstimateHandler).Methods("GET")
	api.HandleFunc("/estimates/{id}", UpdateEstimateHandler).Methods("PUT")
	api.HandleFunc("/estimates/{id}", DeleteEstimateHandler).Methods("DELETE")

	// Porta
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on :" + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// CORS Dinâmico
func dynamicCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		allowed := map[string]bool{
			"http://localhost:5173": true,
			"https://mosaic-orcamento-front.onrender.com": true,
		}

		origin := r.Header.Get("Origin")

		if allowed[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Pré-flight OPTIONS é finalizado aqui
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
