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
		  "description": "A 3-5 line paragraph that provides additional context and information about this slide's topic. This should expand on the bullet points and provide more detailed explanation.",
          "imagePrompt": "Detailed prompt to generate an image for this slide"
        },
		        {
          "type": "conclusion",
          "title": "Conclusion",
          "bullets": ["Summary point 1", "Summary point 2", "Call to action"],
          "description": "A closing paragraph that summarizes the presentation and leaves the audience with a final thought or action item.",
          "imagePrompt": "Detailed prompt for conclusion slide image"
        }
      ]
    }
    Include 5-7 slides with compelling content and detailed imagePrompt fields for each content slide. 
	    1. A clear, concise title
    2. 3-5 bullet points highlighting key information
    3. A descriptive paragraph (3-5 lines) that expands on the bullet points and provides more context
    4. A detailed imagePrompt field to generate a relevant image
    
    The first slide should be a title slide, and the last slide should be a conclusion/summary.
    
    IMPORTANT: Return ONLY the JSON without any markdown code blocks or other text.
	
	    IMPORTANT: If the topic is inappropriate, harmful, illegal, 18+ illegal content or contains explicit content, respond with a JSON 
    that has the title "Request Rejected" and a single slide explaining that the content violates the content policy.
	`

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
