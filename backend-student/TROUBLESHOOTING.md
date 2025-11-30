# Troubleshooting Docker Build

## Lỗi: TLS handshake timeout

```
failed to do request: Head "https://registry-1.docker.io/v2/library/python/manifests/3.11-alpine":
net/http: TLS handshake timeout
```

### Nguyên nhân:

- Kết nối mạng chậm hoặc không ổn định
- Docker daemon không thể kết nối tới Docker Hub
- DNS issues
- Firewall/Proxy blocking

### Giải pháp:

#### 1. Kiểm tra kết nối Docker Hub

```bash
# Test kết nối
curl -I https://registry-1.docker.io/v2/

# Ping Docker Hub
ping registry-1.docker.io
```

#### 2. Restart Docker Desktop

```bash
# macOS
killall Docker && open /Applications/Docker.app

# Hoặc restart từ Docker Desktop UI
```

#### 3. Thay đổi DNS trong Docker

Docker Desktop → Settings → Docker Engine → Edit daemon.json:

```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

#### 4. Sử dụng Docker Hub mirror (nếu ở VN)

```json
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
```

#### 5. Pull image trước

```bash
# Pull image trước khi build
docker pull python:3.11.11-alpine3.20

# Sau đó build
docker-compose build backend-student
```

#### 6. Build với timeout dài hơn

```bash
# Set timeout
export DOCKER_CLIENT_TIMEOUT=300
export COMPOSE_HTTP_TIMEOUT=300

# Build
docker-compose build
```

#### 7. Sử dụng VPN hoặc đổi mạng

Nếu đang dùng mạng công ty/trường học có firewall, thử:

- Đổi sang mạng khác (4G/5G)
- Sử dụng VPN
- Tắt proxy nếu có

#### 8. Build offline (nếu đã có image)

```bash
# List images có sẵn
docker images | grep python

# Nếu có python:3.11 hoặc tương tự, có thể sửa Dockerfile
# FROM python:3.11.11-alpine3.20
# thành
# FROM python:3.11-alpine  # hoặc version có sẵn
```

#### 9. Clear Docker cache

```bash
# Clear build cache
docker builder prune -a

# Restart Docker daemon
docker system prune -a
```

## Lỗi: version is obsolete

```
WARN[0000] the attribute `version` is obsolete
```

### Giải pháp:

✅ Đã fix - xóa dòng `version: '3.8'` trong docker-compose.yml

Docker Compose v2 không cần version field nữa.

## Build thành công nhưng container không start

### Check logs:

```bash
docker logs backend-student
docker-compose logs backend-student
```

### Common issues:

1. Port đã được sử dụng → Đổi port trong docker-compose.yml
2. Dependencies thiếu → Check requirements.txt
3. Code lỗi → Check Python syntax

## Performance Issues

### Build chậm:

```bash
# Sử dụng BuildKit
export DOCKER_BUILDKIT=1
docker-compose build
```

### Image quá lớn:

```bash
# Check size
docker images | grep backend-student

# Nên < 200MB với multi-stage build
```
