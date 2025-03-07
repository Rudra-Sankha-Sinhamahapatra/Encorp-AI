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

	AppConfig = Config{
		GEMINI_API_KEY: GEMINI_API_KEY,
		REDIS_URL:      REDIS_URL,
	}

	return AppConfig, nil
}
