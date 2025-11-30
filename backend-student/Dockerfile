# Stage 1: Builder - Cài đặt dependencies
FROM python:3.11.11-alpine3.20 AS builder

WORKDIR /app

# Cài đặt build dependencies
RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    python3-dev \
    libffi-dev

# Copy requirements và cài đặt dependencies vào virtual environment
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime - Image cuối cùng nhỏ gọn
FROM python:3.11.11-alpine3.20

WORKDIR /app

# Cài đặt runtime dependencies (chỉ cần những gì cần thiết để chạy)
RUN apk add --no-cache libstdc++

# Copy Python packages từ builder stage
COPY --from=builder /root/.local /root/.local

# Copy source code
COPY . .

# Đảm bảo scripts trong .local được thêm vào PATH
ENV PATH=/root/.local/bin:$PATH

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:80/docs')" || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
