FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    curl \
    tesseract-ocr \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements FIRST (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download FastEmbed model during build to cache it in the image
RUN python -c "from fastembed import TextEmbedding; TextEmbedding(model_name='BAAI/bge-small-en-v1.5')"

# Copy application code
COPY app/ app/

# Create directory for LLM models
RUN mkdir -p /app/models

# Set working directory to app folder
WORKDIR /app/app

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["python", "main.py"]
