# Backend Student - Machine Learning API

API server cho các thuật toán Machine Learning: Decision Tree, KNN, Naive Bayes.

## 🚀 Quick Start

### Chạy với Docker (Recommended)

```bash
# Build image
docker build -t backend-student:latest .

# Run container
docker run -d -p 8000:80 --name backend-student backend-student:latest

# Check logs
docker logs -f backend-student

# Stop container
docker stop backend-student
docker rm backend-student
```

### Chạy local (Development)

```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📦 Multi-Stage Docker Build

Dockerfile sử dụng multi-stage build để tối ưu:

- **Stage 1 (Builder)**: Cài đặt build tools và compile dependencies
- **Stage 2 (Runtime)**: Copy chỉ những gì cần thiết, loại bỏ build tools

**Lợi ích:**

- Giảm kích thước image (loại bỏ gcc, g++, build tools)
- Tăng bảo mật (ít packages = ít vulnerabilities)
- Build nhanh hơn với Docker layer caching

## 🔧 Environment Variables

```bash
# Port (mặc định: 80)
PORT=80

# Host
HOST=0.0.0.0
```

## 📚 API Endpoints

- `GET /docs` - Swagger UI documentation
- `POST /decision-tree-c45` - Decision Tree (Entropy/Gini)
- `POST /knn-prediction` - KNN continuous data
- `POST /knn-prediction-nominal` - KNN discrete data
- `POST /naive_bayes` - Naive Bayes classifier

## 🏗️ Build với custom port

```bash
# Build
docker build -t backend-student:latest .

# Run với port khác
docker run -d -p 3000:80 backend-student:latest

# Hoặc override CMD
docker run -d -p 3000:3000 backend-student:latest \
  uvicorn main:app --host 0.0.0.0 --port 3000
```

## 🔍 Health Check

Container có built-in health check:

```bash
docker ps  # Xem health status
```

## 📊 Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- NumPy - Numerical computing
- Pandas - Data manipulation
- Pydantic - Data validation
