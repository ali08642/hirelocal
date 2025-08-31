# ServiceGPT Backend

A FastAPI-based backend service that finds local service providers using AI-powered web search.

## Prerequisites

- Python 3.11 or higher
- uv (Python package manager)

## Setup with uv

### 1. Install uv

If you don't have uv installed, install it using one of these methods:

**On macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**On Windows:**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Alternative (using pip):**
```bash
pip install uv
```

### 2. Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
uv sync
```

This will:
- Create a virtual environment automatically
- Install all dependencies from `pyproject.toml`
- Generate/update the `uv.lock` file

### 3. Environment Configuration

Create a `.env` file in the backend directory with your OpenAI API key:

```cmnd/terminal
@"
OPENAI_API_KEY=sk-your-actual-openai-key-here
GEMINI_API_KEY=your-actual-gemini-key-here
"@ | Out-File -FilePath .env -Encoding utf8
```

cd Backend; uv add requests

### 4. Run the Backend

You have several options to run the backend:

**Option 1: Using the start script**
```bash
chmod +x start.sh
./start.sh
```

**Option 2: Using uv directly**
```bash
uv run python main.py
```

**Option 3: Using uvicorn directly**
```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- Main API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

## API Endpoints

### POST /api/chat
Find service providers with structured input:
```json
{
  "service": "electrician",
  "location": "Chicago, IL",
  "count": 3
}
```

### POST /api/nlp
Process natural language queries:
```json
{
  "query": "I need a plumber in downtown Seattle"
}
```

### GET /api/health
Health check endpoint that returns service status.

## Development

### Adding Dependencies
```bash
uv add package_name
```

### Development Dependencies
```bash
uv add --dev package_name
```

### Running Tests
```bash
uv run pytest
```

### Code Formatting
```bash
uv run black .
uv run isort .
```

## Project Structure

- `main.py` - FastAPI application with API endpoints
- `config.py` - OpenAI client configuration
- `inference.py` - Core inference logic
- `pyproject.toml` - Project dependencies and configuration
- `start.sh` - Quick start script
- `uv.lock` - Locked dependency versions

## Troubleshooting

### uv sync fails
- Ensure Python 3.11+ is installed
- Check your internet connection
- Try `uv sync --refresh` to refresh the cache

### API key errors
- Verify your `.env` file contains the correct `OPENAI_API_KEY`
- Ensure the API key has the necessary permissions

### Port already in use
- Kill the process using port 8000: `lsof -ti:8000 | xargs kill -9`
- Or run on a different port: `uv run uvicorn main:app --port 8001`
