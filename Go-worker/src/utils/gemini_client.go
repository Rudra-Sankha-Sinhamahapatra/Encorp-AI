package utils

import (
	"context"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiClient struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewGeminiClient(apiKey string) (*GeminiClient, error) {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}

	model := client.GenerativeModel("gemini-2.0-flash")

	return &GeminiClient{
		client: client,
		model:  model,
	}, nil
}

func (gc *GeminiClient) GenerateContent(ctx context.Context, prompt string) (string, error) {
	resp, err := gc.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	var result string
	for _, candidate := range resp.Candidates {
		for _, part := range candidate.Content.Parts {
			switch p := part.(type) {
			case genai.Text:
				result += string(p)
			default:

			}
		}
	}

	return result, nil
}
