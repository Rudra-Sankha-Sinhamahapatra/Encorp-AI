package services

import (
	"Go-worker/src/utils"
	"context"
	"encoding/json"
	"log"
	"strings"
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
    Include 5-7 slides with compelling content and detailed imagePrompt fields for each content slide. 
    IMPORTANT: Return ONLY the JSON without any markdown code blocks or other text.`

	fullPrompt := systemPrompt + "\nTopic: " + topic

	result, err := s.geminiClient.GenerateContent(ctx, fullPrompt)
	if err != nil {
		return "", err
	}

	result = cleanJSONResponse(result)

	log.Printf("Successfully generated the presentation for topic: %s", topic)
	return result, nil
}

func cleanJSONResponse(response string) string {
	// Removing markdown code block indicators
	response = strings.TrimPrefix(response, "```json")
	response = strings.TrimPrefix(response, "```")
	response = strings.TrimSuffix(response, "```")

	// Removing leading/trailing whitespace
	response = strings.TrimSpace(response)

	var js map[string]interface{}
	if err := json.Unmarshal([]byte(response), &js); err != nil {
		startIdx := strings.Index(response, "{")
		endIdx := strings.LastIndex(response, "}")

		if startIdx >= 0 && endIdx > startIdx {
			response = response[startIdx : endIdx+1]
		}
	}

	return response
}
