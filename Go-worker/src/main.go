package main

import (
	"Go-worker/src/services"
	"Go-worker/src/utils"
	"context"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/hibiken/asynq"
	"github.com/redis/go-redis/v9"
)

const GeneratePPTTask = "generate_ppt"

type TaskPayload struct {
	JobID  string `json:"job_id"`
	Prompt string `json:"prompt"`
}

func handleGeneratePPT(ctx context.Context, t *asynq.Task, redisClient *redis.Client) error {
	// Parse payload as JSON
	var payload TaskPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return err
	}

	presentationService, err := services.NewPresentationService(utils.AppConfig.GEMINI_API_KEY)
	if err != nil {
		return err
	}

	result, err := presentationService.GeneratePresentation(ctx, payload.Prompt)
	if err != nil {
		return err
	}

	err = redisClient.Set(ctx, "presentation:"+payload.JobID, result, 24*time.Hour).Err()
	if err != nil {
		return err
	}

	err = redisClient.Set(ctx, "job_status:"+payload.JobID, "completed", 24*time.Hour).Err()
	if err != nil {
		return err
	}

	log.Printf("Successfully processed job %s", payload.JobID)
	return nil
}

func main() {
	if _, err := utils.LoadEnv(); err != nil {
		log.Fatal("Error loading env variables")
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr: utils.AppConfig.REDIS_URL,
	})
	defer redisClient.Close()

	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: utils.AppConfig.REDIS_URL},
		asynq.Config{Concurrency: 10},
	)

	mux := asynq.NewServeMux()
	mux.HandleFunc(GeneratePPTTask, func(ctx context.Context, t *asynq.Task) error {
		return handleGeneratePPT(ctx, t, redisClient)
	})

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt)
	go func() {
		<-sigs
		log.Println("Shutting down worker gracefully...")
		srv.Shutdown()
	}()

	log.Println("Worker is running...")
	if err := srv.Run(mux); err != nil {
		log.Fatalf("Worker Failed: %v", err)
	}
}
