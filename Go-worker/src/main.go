package main

import (
	"Go-worker/src/controllers"
	"Go-worker/src/utils"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	_, err := utils.LoadEnv()

	if err != nil {
		log.Fatal("Error loading env variables")
	}

	geminiClient, err := utils.NewGeminiClient(utils.AppConfig.GEMINI_API_KEY)
	if err != nil {
		log.Fatalf("Failed to initialize Gemini client: %v", err)
	}

	pptController := controllers.NewPPTGeneratorController(geminiClient)

	r := gin.Default()

	r.POST("/generate-ppt", pptController.GeneratePPT)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	port := fmt.Sprintf(":%d", utils.AppConfig.ServerPort)
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
