build:
	@echo "Building the Docker images..."
	@docker-compose build

gpu:
	@echo "Installing and configuring NVIDIA GPU support..."
	@./install.sh

pull-model:
	@docker exec -it ollama ollama pull llama3

run: build gpu pull-model
	@echo "Starting Docker containers with GPU support..."
	@docker-compose up -d

stop:
	@echo "Stoping LLM Model..."
	@docker-compose stop
