package main

import (
	"Go-worker/src/services"
	"Go-worker/src/utils"
	"context"
	"crypto/tls"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"
)

const GeneratePPTTask = "generate_ppt"

type TaskPayload struct {
	JobID  string `json:"job_id"`
	Prompt string `json:"prompt"`
}

func main() {
	_, err := utils.LoadEnv()
	if err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr:      utils.AppConfig.REDIS_ADDR,
		Username:  "default",
		Password:  utils.AppConfig.REDIS_PASSWORD,
		TLSConfig: &tls.Config{},
	})
	defer redisClient.Close()

	_, err = redisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	log.Println("Connected to Redis successfully")

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		processJobs(ctx, redisClient)
	}()

	log.Println("Worker is running... Press Ctrl+C to exit")
	<-ctx.Done()
	log.Println("Shutting down gracefully...")
	time.Sleep(1 * time.Second)
}

func processJobs(ctx context.Context, redisClient *redis.Client) {
	for {
		select {
		case <-ctx.Done():
			return
		default:

		}

		log.Println("Checking for tasks...")

		result, err := redisClient.BRPop(ctx, 5*time.Second, "presentation_Task_queue").Result()
		if err != nil {
			if err == redis.Nil || err.Error() == "redis: nil" {
				continue
			}

			select {
			case <-ctx.Done():
				return
			default:
				log.Printf("Error polling Redis: %v", err)
				time.Sleep(2 * time.Second)
				continue
			}
		}

		if len(result) < 2 {
			log.Println("Invalid result from Redis")
			continue
		}

		taskStr := result[1]
		log.Printf("Task received with payload: %s", taskStr)

		go func(taskData string) {
			var payload TaskPayload
			if err := json.Unmarshal([]byte(taskData), &payload); err != nil {
				log.Printf("Error parsing payload: %v", err)
				return
			}

			taskCtx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
			defer cancel()

			presentationService, err := services.NewPresentationService(utils.AppConfig.GEMINI_API_KEY)
			if err != nil {
				log.Printf("Failed to create presentation service: %v", err)
				return
			}

			err = redisClient.Set(taskCtx, "job_status:"+payload.JobID, "processing", 24*time.Hour).Err()
			if err != nil {
				log.Printf("Error updating job status: %v", err)
			}

			log.Printf("Processing job %s with prompt: %s", payload.JobID, payload.Prompt)
			result, err := presentationService.GeneratePresentation(taskCtx, payload.Prompt)
			if err != nil {
				log.Printf("Error generating presentation: %v", err)
				redisClient.Set(taskCtx, "job_status:"+payload.JobID, "failed", 24*time.Hour)
				return
			}

			err = redisClient.Set(taskCtx, "presentation:"+payload.JobID, result, 24*time.Hour).Err()
			if err != nil {
				log.Printf("Error storing presentation: %v", err)
				return
			}

			err = redisClient.Set(taskCtx, "job_status:"+payload.JobID, "completed", 24*time.Hour).Err()
			if err != nil {
				log.Printf("Error updating job status: %v", err)
			}

			log.Printf("Successfully processed job %s", payload.JobID)
		}(taskStr)
	}
}
