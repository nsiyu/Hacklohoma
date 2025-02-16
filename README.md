# Codem - Technical Interview Practice Platform

A modern web application for practicing technical interviews with AI assistance, featuring real-time code execution and AI-powered question generation.

## Project Structure

```
codem/
├── frontend/          # Next.js App
└── backend/          # Agents
    └── agents/
        └── question_creator/  # AI question generation service
```

## Frontend Setup

1. Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/nsiyu/temp.git
cd temp
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a Python virtual environment:

For macOS/Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install the poetry and all dependencies from pyproject.toml

4. Create a `.env` file in the `backend/agents/question_creator` directory:
```plaintext
OPENAI_API_KEY=your_api_key_here
```
5. Start the backend server:
```bash
uvicorn question_creator.api:app --reload
```

The backend API will be available at [http://localhost:8000](http://localhost:8000)

## API Endpoints

The backend provides the following endpoints:

- `POST /create-question`
  - Creates a new coding question
  - Request body:
    ```json
    {
      "topic": "string",
      "difficulty": "string",
      "custom_requirements": "string"
    }
    ```
