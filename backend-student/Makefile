.PHONY: help build run stop clean logs shell test

# Variables
IMAGE_NAME = backend-student
CONTAINER_NAME = backend-student
PORT = 8000

help: ## Hiển thị help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker image
	docker build -t $(IMAGE_NAME):latest .

run: ## Chạy container
	docker run -d -p $(PORT):80 --name $(CONTAINER_NAME) $(IMAGE_NAME):latest

stop: ## Dừng container
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

restart: stop run ## Restart container

logs: ## Xem logs
	docker logs -f $(CONTAINER_NAME)

shell: ## Vào shell của container
	docker exec -it $(CONTAINER_NAME) /bin/sh

clean: stop ## Xóa container và image
	docker rmi $(IMAGE_NAME):latest || true

rebuild: clean build run ## Rebuild và chạy lại

dev: ## Chạy local development
	uvicorn main:app --reload --host 0.0.0.0 --port 8000

test: ## Test API
	curl http://localhost:$(PORT)/docs

ps: ## Xem container status
	docker ps -a | grep $(CONTAINER_NAME) || echo "Container not found"

size: ## Xem kích thước image
	docker images | grep $(IMAGE_NAME)
