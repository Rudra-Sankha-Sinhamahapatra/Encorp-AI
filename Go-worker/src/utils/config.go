package utils

import (
	"errors"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort     int
	GEMINI_API_KEY string
}

var AppConfig Config

func LoadEnv() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env file")
		return Config{}, err
	}

	portStr := os.Getenv("PORT")
	port, err := strconv.Atoi(portStr)

	if err != nil || port <= 0 {
		port = 8900
	}

	GEMINI_API_KEY := os.Getenv("GEMINI_API_KEY")

	if GEMINI_API_KEY == "" {
		return Config{}, errors.New("GEMINI_API_KEY is required")
	}

	AppConfig = Config{
		ServerPort:     port,
		GEMINI_API_KEY: GEMINI_API_KEY,
	}

	return AppConfig, nil
}
