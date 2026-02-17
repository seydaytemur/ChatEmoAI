# ChatEmo

ChatEmo is a real-time chat application with AI-powered sentiment analysis capabilities. It analyzes user messages to determine sentiment (positive, neutral, negative) and provides visual feedback.

## Project Structure

The project consists of three main components:

1.  **Frontend (`frontend/chatemo-web`)**: 
    *   Built with React, TypeScript, and Vite.
    *   Provides the user interface and chat experience.
    
2.  **Backend (`backend/ChatEmoAPI`)**: 
    *   Uses .NET 9 Web API and Entity Framework Core.
    *   Manages database operations (SQLite) and real-time communication with SignalR.

3.  **AI Service (`ai-service`)**: 
    *   Uses Python, FastAPI, and Hugging Face Transformers.
    *   A microservice that performs sentiment analysis on messages.

## Installation and Execution

To run the project, you need to start each component in separate terminals.

### 1. AI Service (Start this first)

For the sentiment analysis service to run:

```bash
cd ai-service
# Create virtual environment (optional but recommended)
python -m venv venv
# For Windows: venv\Scripts\activate
# For Mac/Linux: source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Start the service
python app.py
```

### 2. Backend API

To start the API server:

```bash
cd backend/ChatEmoAPI
dotnet run
```
*Note: Backend will attempt to access the AI service (port 7860).*

### 3. Frontend Application

To start the interface:

```bash
cd frontend/chatemo-web
npm install
npm run dev
```

The application will usually run at `http://localhost:5173`.
