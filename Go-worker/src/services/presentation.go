package services

import (
	"Go-worker/src/utils"
	"context"
	"encoding/json"
	"fmt"
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

func (s *PresentationService) GeneratePresentation(ctx context.Context, topic string, numberOfSlides int, presentationStyle string) (string, error) {

	if numberOfSlides < 5 {
		numberOfSlides = 5
	} else if numberOfSlides > 20 {
		numberOfSlides = 20
	}

	var styleInstruction string
	switch strings.ToLower(presentationStyle) {
	case "modern":
		styleInstruction = "Create a modern and minimal presentation with clean aesthetics. Use concise text, ample white space, and a straightforward approach. Focus on visual simplicity and essential information only."
	case "corporate":
		styleInstruction = "Create a corporate and professional presentation suitable for business settings. Use formal language, data-driven content, and a structured approach. Include professional terminology and focus on clear business value and actionable insights."
	case "creative":
		styleInstruction = "Create a creative and bold presentation with dynamic content. Use engaging language, unexpected analogies, and a conversational tone. Incorporate thought-provoking ideas and visually interesting concepts that challenge conventional thinking."
	case "academic":
		styleInstruction = "Create an academic and formal presentation suitable for educational settings. Use precise language, cite relevant concepts, and maintain a scholarly tone. Include thorough explanations and logical progressions of ideas with appropriate depth of analysis."
	default:
		styleInstruction = "Create a balanced presentation with clear, informative content suitable for a general audience."
	}

	systemPrompt := fmt.Sprintf(`Create a presentation on this topic with the following JSON structure:
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
    %s
    
    Include exactly %d slides total (including title and conclusion slides) with compelling content and detailed imagePrompt fields for each content slide. Each content slide should have:
    1. A clear, concise title
    2. 3-5 bullet points highlighting key information
    3. A descriptive paragraph (3-5 lines) that expands on the bullet points and provides more context
    4. A detailed imagePrompt field to generate a relevant image
    
    The first slide should be a title slide, and the last slide should be a conclusion/summary.
    
    IMPORTANT: Return ONLY the JSON without any markdown code blocks or other text.
	
	    IMPORTANT: If the topic is inappropriate, harmful, illegal, 18+ illegal content or contains explicit content, respond with a JSON 
    that has the title "Request Rejected" and a single slide explaining that the content violates the content policy.
	`, styleInstruction, numberOfSlides)

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

	// Looking for the actual JSON content - find the first '{' and last '}'
	startIdx := strings.Index(response, "{")
	endIdx := strings.LastIndex(response, "}")

	if startIdx >= 0 && endIdx > startIdx {
		// Extracting just the JSON part
		response = response[startIdx : endIdx+1]
	}

	var temp interface{}
	err := json.Unmarshal([]byte(response), &temp)

	if err != nil {
		log.Printf("Error parsing JSON response: %v", err)
		log.Printf("Original response: %s", response)

		response = strings.ReplaceAll(response, "\n", "")
		response = strings.ReplaceAll(response, "\t", "")
		response = strings.ReplaceAll(response, "\r", "")

		response = strings.ReplaceAll(response, ",]", "]")
		response = strings.ReplaceAll(response, ",}", "}")

		err = json.Unmarshal([]byte(response), &temp)
		if err != nil {
			log.Printf("Still couldn't fix JSON: %v", err)
			return `{"title":"Error Processing Presentation","slides":[{"type":"title","title":"Error Processing Presentation","subtitle":"The AI generated invalid JSON. Please try again."}]}`
		}
	}

	return response
}
