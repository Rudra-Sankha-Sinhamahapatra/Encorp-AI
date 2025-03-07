package services

import (
	"Go-worker/src/utils"
	"context"
	"log"
)

type PresentationService struct {
	geminiClient *utils.GeminiClient
}

func NewPresentationService(apiKey string) (*PresentationService, error) {
	geminiClient, err := utils.NewGeminiClient(apiKey)
	if err != nil {
		return nil, err
	}

	return &PresentationService{
		geminiClient: geminiClient,
	}, nil
}

func (s *PresentationService) GeneratePresentation(ctx context.Context, topic string) (string, error) {
	systemPrompt := `Create a presentation on this topic with the following JSON structure:
    {
      "title": "Presentation Title",
      "slides": [
        {
          "type": "title",
          "title": "Main Title",
          "subtitle": "Subtitle text" 
        },
        {
          "type": "content",
          "title": "Slide Title",
          "bullets": ["Point 1", "Point 2", "Point 3"],
          "imagePrompt": "Detailed prompt to generate an image for this slide"
        }
      ]
    }
    Include 5-7 slides with compelling content and detailed imagePrompt fields for each content slide.`

	fullPrompt := systemPrompt + "\nTopic: " + topic

	result, err := s.geminiClient.GenerateContent(ctx, fullPrompt)
	if err != nil {
		return "", err
	}
	log.Printf("Successfully generated the presentation for topic: %s", topic)
	return result, nil
}
