# Use the FastAPI-compatible Python 3.11 base image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

# Set environment variables (unbuffered output for better logging)
ENV PYTHONUNBUFFERED=1 \
    GENSIM_DATA_DIR=/app/models \
    PYTHONMEMORY=4294967296 \
    DOCKER_ENV=1

# Expose port 8000 for FastAPI
EXPOSE 8000

# Create directory for model storage
RUN mkdir -p /app/models

# Upgrade pip and install pipenv for dependency management
RUN pip install --upgrade pip
RUN pip install pipenv

# Set working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock for dependency installation
COPY Pipfile Pipfile.lock /app/
# COPY requirements.txt /app/

# Install project dependencies into the system environment
RUN pipenv install --ignore-pipfile --system
# RUN pip install -r requirements.txt

# Pre-download the GloVe model during build and save as a single file
RUN python3 -c "import gensim.downloader as api; \
    api.BASE_DIR = '/app/models'; \
    model = api.load('glove-wiki-gigaword-100'); \
    model.save('/app/models/glove-wiki-gigaword-100.kv')"

# Copy application source code into the container
COPY ./src /app/src

# Start the FastAPI app using Uvicorn with increased timeout
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "--timeout-keep-alive", "120", "main:app", "--app-dir", "src/"]
