package controllers

import (
	"Go-worker/src/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Request struct {
	Prompt string `json:"prompt" binding:"required"`
}

type Response struct {
	Text string `json:"text"`
}

type PPTGeneratorController struct {
	geminiClient *utils.GeminiClient
}

func NewPPTGeneratorController(geminiClient *utils.GeminiClient) *PPTGeneratorController {
	return &PPTGeneratorController{
		geminiClient: geminiClient,
	}
}

func (c *PPTGeneratorController) GeneratePPT(ctx *gin.Context) {
	var req Request
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := c.geminiClient.GenerateContent(ctx, req.Prompt)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, Response{Text: result})
}
