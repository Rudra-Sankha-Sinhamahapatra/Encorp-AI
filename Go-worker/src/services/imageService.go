package services

import (
	"Go-worker/src/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/sashabaranov/go-openai"
)

type ImageService struct {
	client *openai.Client
}

type Presentation struct {
	Title  string  `json:"title"`
	Slides []Slide `json:"slides"`
}

type Slide struct {
	Type        string   `json:"type"`
	Title       string   `json:"title"`
	Subtitle    string   `json:"subtitle,omitempty"`
	Bullets     []string `json:"bullets,omitempty"`
	Description string   `json:"description,omitempty"`
	ImagePrompt string   `json:"imagePrompt,omitempty"`
	ImageURL    string   `json:"imageURL,omitempty"`
}

func NewImageService() (*ImageService, error) {
	if utils.AppConfig.OPENAI_API_KEY == "" {
		return nil, errors.New("OPENAI API key is required")
	}

	apiKey := utils.AppConfig.OPENAI_API_KEY

	client := openai.NewClient(apiKey)

	return &ImageService{client: client}, nil

}

func (s *ImageService) GenerateImage(ctx context.Context, prompt string) (string, error) {

	req := openai.ImageRequest{
		Model:          openai.CreateImageModelDallE3,
		Prompt:         prompt,
		Size:           openai.CreateImageSize1024x1024,
		N:              1,
		ResponseFormat: openai.CreateImageResponseFormatURL,
	}

	resp, err := s.client.CreateImage(ctx, req)

	if err != nil {
		return "", err
	}

	if len(resp.Data) > 0 {
		return resp.Data[0].URL, nil
	}

	return "", errors.New("no images received")
}

func (s *ImageService) ProcessPresentationImages(ctx context.Context, presentationJSON string) (string, error) {
	var presentation Presentation

	if err := json.Unmarshal([]byte(presentationJSON), &presentation); err != nil {
		return "", fmt.Errorf("Failed to parse presentation JSON : %w", err)
	}

	for i, slide := range presentation.Slides {
		if slide.ImagePrompt == "" {
			continue
		}

		if i > 0 {
			time.Sleep(500 * time.Millisecond)
		}

		imageURL, err := s.GenerateImage(ctx, slide.ImagePrompt)

		if err != nil {
			log.Printf("failed to generate image for slide %d : %v", i, err)
			continue
		}

		presentation.Slides[i].ImageURL = imageURL
	}

	updatedJSON, err := json.Marshal(presentation)

	if err != nil {
		return "", fmt.Errorf("failed to convert presentations into JSON : %w", err)
	}

	return string(updatedJSON), nil
}
