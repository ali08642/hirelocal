#!/bin/bash

# Install dependencies
uv sync

# Start the FastAPI server
echo "Starting ServiceGPT API server..."
python main.py