package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	// Inicializa o banco
	DB = SetupDatabase()

	// Router principal
	r := mux.NewRouter()

	// Preflight global (todas as rotas)
	r.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "https://mosaic-orcamento-front.onrender.com")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.WriteHeader(http.StatusOK)
	})

	// Middleware CORS
	r.Use(simpleCORS)

	// Grupo /api
	api := r.PathPrefix("/api").Subrouter()

	// Rotas da API
	api.HandleFunc("/estimates", CreateEstimateHandler).Methods("POST")
	api.HandleFunc("/estimates", ListEstimatesHandler).Methods("GET")
	api.HandleFunc("/estimates/{id}", GetEstimateHandler).Methods("GET")
	api.HandleFunc("/estimates/{id}", UpdateEstimateHandler).Methods("PUT")
	api.HandleFunc("/estimates/{id}", DeleteEstimateHandler).Methods("DELETE")

	// Porta (Render usa variável PORT)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server running on :" + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// CORS COMPLETO PARA FUNCIONAR COM REACT NO RENDER
func simpleCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Origem permitida (seu frontend)
		w.Header().Set("Access-Control-Allow-Origin", "https://mosaic-orcamento-front.onrender.com")
		w.Header().Set("Vary", "Origin")

		// Headers permitidos
		w.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Authorization, X-Requested-With")

		// Métodos permitidos
		w.Header().Set("Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS")

		// Preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
