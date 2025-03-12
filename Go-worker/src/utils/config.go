package utils

import (
	"errors"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	GEMINI_API_KEY string
	REDIS_URL      string
	REDIS_ADDR     string
	REDIS_PASSWORD string
}

var AppConfig Config

func LoadEnv() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env file")
		return Config{}, err
	}

	GEMINI_API_KEY := os.Getenv("GEMINI_API_KEY")

	if GEMINI_API_KEY == "" {
		return Config{}, errors.New("GEMINI_API_KEY is required")
	}

	REDIS_URL := os.Getenv("REDIS_URL")

	if REDIS_URL == "" {
		return Config{}, errors.New("REDIS_URL is required")
	}

	REDIS_ADDR := os.Getenv("REDIS_ADDR")

	if REDIS_ADDR == "" {
		return Config{}, errors.New("REDIS_ADDR is required")
	}

	REDIS_PASSWORD := os.Getenv("REDIS_PASSWORD")

	if REDIS_PASSWORD == "" {
		return Config{}, errors.New("REDIS_PASSWORD is required")
	}

	AppConfig = Config{
		GEMINI_API_KEY: GEMINI_API_KEY,
		REDIS_URL:      REDIS_URL,
		REDIS_ADDR:     REDIS_ADDR,
		REDIS_PASSWORD: REDIS_PASSWORD,
	}

	return AppConfig, nil
}
