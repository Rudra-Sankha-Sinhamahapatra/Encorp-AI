# Encorp AI

Encorp AI is an AI-powered slide generator that takes user input prompts and generates structured presentations using Gemini AI. It supports both PDF and PPT export functionalities.

## Demo Video

<details>
  <summary>Click to see demo video</summary>
  <video src="./docs/videos/demo.mov" controls width="100%"></video>
</details>


## Features
- **AI-Powered Slide Generation:** Uses Gemini AI to process prompts and create structured slides.
- **Redis-Based Job Queue:** Ensures efficient task management and processing.
- **Golang Worker Service:** Polls tasks from Redis and interacts with Gemini AI.
- **Node.js Backend:** Handles authentication and API requests.
- **Export Options:** Supports PDF (via jsPDF) and PPT (via pptgenx).

## Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** (v18.0.0 or later)
- **Go** (v1.20 or later)
- **Redis** (v6.0 or later) - Get Redis URL from [Upstash](https://upstash.com/) or [Aiven](https://aiven.io/)
- **PostgreSQL** (v14 or later) for the database - Get PostgreSQL Connection URL from [Supabase](https://supabase.com/) or Just start a local postgres container
- **Git** for cloning the repository
- **Gemini API key** - Sign up at [Google AI Studio](https://makersuite.google.com) to obtain your API key

- **Environment variables**:
  - For backend: Create a `.env` file in the backend directory with:
    ```
    DATABASE_URL=postgresql://username:password@localhost:5432/db
    REDIS_URL=redis://localhost:6379
    NODE_ENV=dev
    JWT_SECRET=your_jwt_secret
    PORT=8000
    ```
  - For Go worker: Create a `.env` file in the Go-worker directory with:
    ```
    GEMINI_API_KEY=your_gemini_api_key
    REDIS_ADDR=localhost:6379
    REDIS_PASSWORD=
    ```

## Architecture

![Architecture Diagram](./docs/images/arc.png)

### Workflow
1. **User Input & Authentication**: Users input prompts through the Next.js frontend. Authentication is handled via the Node.js backend with an Auth DB.
2. **Task Queueing & Notification**: The backend pushes the prompt to a Redis queue and publishes a notification to the Redis Pub/Sub channel.
3. **Event-Driven Processing**: The Golang worker receives instant notification when new tasks arrive and processes them immediately.
4. **Gemini AI Processing**: The Golang worker calls the Gemini API, processes the response, and pushes the structured JSON output back to Redis.
5. **Status Updates**: The worker updates job status in Redis at each stage (processing, completed, failed).
6. **Polling Mechanism**: The frontend polls the backend API until the job is complete.
7. **Slide Preview**: The JSON response is used to render a preview of the slides with both bullet points and descriptive paragraphs.
8. **Export Options**: Users can export slides as:
   - **PDF** (via jsPDF)
   - **PPT** (via pptgenx)

## Future Enhancements
- **S3/Cloudinary Uploads**: Enable users to upload generated PPT files to cloud storage.
- **Image Support in PDFs**: Enhance PDF generation by including images (currently omitted due to high costs of image generation models).

## Tech Stack
- **Frontend**: Next.js (React-based)
- **Backend**: Node.js (Express.js)
- **Queue Management**: Redis
- **Worker Service**: Golang
- **AI Model**: Gemini AI
- **Storage (Upcoming Feature)**: S3/Cloudinary
- **Exports**: jsPDF, pptgenx

## Deployment
- **Frontend**: Vercel
- **Node.js Backend**: AWS EC2
- **Golang Worker**: AWS EC2 

## Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Rudra-Sankha-Sinhamahapatra/Encorp-AI
   ```
2. Install dependencies:
   ```sh
   cd backend && npm install
   cd frontend && npm install
   ```
3. Start the Redis server.
4. Run the backend:
   ```sh
   cd backend && npm run dev
   ```
5. Run the frontend:
   ```sh
   cd frontend && npm run dev
   ```
6. Run the Golang worker service:
   
   Development mode:
   ```sh
   cd Go-worker && go run ./src/main.go
   ```
   
   OR
   
   Build and run:
   ```sh
   cd Go-worker
   go mod tidy
   go build -o worker ./src/main.go
   ./worker
   ```

## System Architecture Benefits
- **Real-time Processing**: Tasks are processed immediately without polling delays
- **Resource Efficiency**: Worker remains idle until tasks arrive, reducing CPU and Redis load
- **Reliability**: Multiple safeguards ensure tasks are never lost
- **Scalability**: Multiple workers can subscribe to the same notification channel

## Contributing
Feel free to open issues and submit pull requests for new features or improvements!

## License
This project is licensed under the [MIT License](./LICENSE) - see the LICENSE file for details.

Copyright (c) 2025 Rudra Sankha Sinhamahapatra

