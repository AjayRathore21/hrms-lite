# Use a stable Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for Prisma and PostgreSQL
RUN apt-get update && apt-get install -y \
    openssl \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Generate Prisma client
# In a Docker environment, the generated client and its engine 
# are preserved in the image filesystem permanently.
RUN prisma generate

# Expose the port (Render uses 10000 by default)
EXPOSE 10000

# Start command using Gunicorn
# Note: Render provides the PORT env var, but we've hardcoded 10000 
# which matches Render's default for web services.
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:10000"]
