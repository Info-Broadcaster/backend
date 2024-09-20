build:
	@echo "Building the Docker images..."
	@docker-compose build

gpu:
	@echo "Installing and configuring NVIDIA GPU support..."
	@./install.sh

run: build GPU
	@echo "Starting Docker containers with GPU support..."
	@docker-compose up -d

