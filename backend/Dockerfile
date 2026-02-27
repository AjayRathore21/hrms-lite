# Use a stable Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for Prisma and PostgreSQL
RUN apt-get update && apt-get install -y \
    openssl \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Generate Prisma client and fetch the engine binary
# We explicitly copy the binary to the /app folder where Prisma will find it
RUN prisma generate && \
    prisma py fetch && \
    cp $(find /root/.cache/prisma-python -name "prisma-query-engine-*" | head -n 1) . && \
    chmod +x prisma-query-engine-*

# Expose the port (Render uses 10000 by default)
EXPOSE 10000

# Start command using Gunicorn
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:10000"]
