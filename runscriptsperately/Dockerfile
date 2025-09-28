FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

# Expose port (FastAPI will run on 8000)
EXPOSE 8000

CMD ["bash", "-c", "python main.py & uvicorn main:app --reload --host 0.0.0.0 --port 8000"]


