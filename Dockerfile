# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend_python/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend_python/ ./backend_python/

# Copy frontend build (if exists)
COPY dist/ ./dist/ 2>/dev/null || echo "No dist folder found, skipping..."

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app/backend_python
ENV PORT=8000

# Run the application
CMD ["python", "backend_python/main.py"]
