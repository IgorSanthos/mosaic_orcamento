package main

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase() *gorm.DB {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL not set. Defina sua string do Postgres no ambiente.")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect postgres:", err)
	}

	if err := db.AutoMigrate(&Estimate{}, &EstimateItem{}); err != nil {
		log.Fatal("migrate error:", err)
	}

	return db
}
