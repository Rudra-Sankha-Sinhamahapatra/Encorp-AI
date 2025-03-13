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
	JobID             string `json:"job_id"`
	Prompt            string `json:"prompt"`
	NumberOfSlides    int    `json:"numberOfSlides"`
	PresentationStyle string `json:"presentationStyle"`
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
	pubsub := redisClient.Subscribe(ctx, "presentation_job_notifications")
	defer pubsub.Close()

	ch := pubsub.Channel()

	checkForExistingJobs(ctx, redisClient)

	log.Println("Worker ready to process tasks - waiting for notifications...")

	for {
		select {
		case <-ctx.Done():

			return

		case msg := <-ch:
			log.Printf("Received notification: %s, checking queue...", msg.Payload)
			processQueuedTasks(ctx, redisClient)

		case <-time.After(5 * time.Minute):
			log.Println("Performing periodic queue check...")
			processQueuedTasks(ctx, redisClient)
		}
	}
}

func checkForExistingJobs(ctx context.Context, redisClient *redis.Client) {
	log.Println("Checking for existing tasks in the queue...")

	queueLength, err := redisClient.LLen(ctx, "presentation_Task_queue").Result()
	if err != nil {
		log.Printf("Error checking queue length: %v", err)
		return
	}

	if queueLength > 0 {
		log.Printf("Found %d existing tasks in the queue", queueLength)
		processQueuedTasks(ctx, redisClient)
	} else {
		log.Println("No existing tasks found")
	}
}

func processQueuedTasks(ctx context.Context, redisClient *redis.Client) {

	for {
		result, err := redisClient.BRPop(ctx, 1*time.Second, "presentation_Task_queue").Result()
		if err != nil {
			if err == redis.Nil || err.Error() == "redis: nil" {

				return
			}
			log.Printf("Error polling Redis: %v", err)
			return
		}

		if len(result) < 2 {
			log.Println("Invalid result from Redis")
			continue
		}

		taskStr := result[1]
		log.Printf("Task received with payload: %s", taskStr)

		go processTask(ctx, redisClient, taskStr)
	}
}

func processTask(ctx context.Context, redisClient *redis.Client, taskData string) {
	var payload TaskPayload
	if err := json.Unmarshal([]byte(taskData), &payload); err != nil {
		log.Printf("Error parsing payload: %v", err)
		return
	}

	taskCtx, cancel := context.WithTimeout(ctx, 5*time.Minute)
	defer cancel()

	presentationService, err := services.NewPresentationService(utils.AppConfig.GEMINI_API_KEY)
	if err != nil {
		log.Printf("Failed to create presentation service: %v", err)
		updateJobStatus(taskCtx, redisClient, payload.JobID, "failed")
		return
	}

	updateJobStatus(taskCtx, redisClient, payload.JobID, "processing")

	log.Printf("Processing job %s with prompt: %s, slides: %d, style: %s",
		payload.JobID, payload.Prompt, payload.NumberOfSlides, payload.PresentationStyle)

	result, err := presentationService.GeneratePresentation(taskCtx, payload.Prompt, payload.NumberOfSlides, payload.PresentationStyle)
	if err != nil {
		log.Printf("Error generating presentation: %v", err)
		updateJobStatus(taskCtx, redisClient, payload.JobID, "failed")
		return
	}

	err = redisClient.Set(taskCtx, "presentation:"+payload.JobID, result, 24*time.Hour).Err()
	if err != nil {
		log.Printf("Error storing presentation: %v", err)
		updateJobStatus(taskCtx, redisClient, payload.JobID, "failed")
		return
	}

	updateJobStatus(taskCtx, redisClient, payload.JobID, "completed")
	log.Printf("Successfully processed job %s", payload.JobID)
}

func updateJobStatus(ctx context.Context, redisClient *redis.Client, jobID string, status string) {
	err := redisClient.Set(ctx, "job_status:"+jobID, status, 24*time.Hour).Err()
	if err != nil {
		log.Printf("Error updating job status for %s to %s: %v", jobID, status, err)
	} else {
		log.Printf("Updated job %s status to %s", jobID, status)
	}
}
