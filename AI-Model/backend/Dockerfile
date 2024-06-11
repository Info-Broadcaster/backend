FROM ollama/ollama:latest

WORKDIR /app

COPY start-model.sh /app/start-model.sh

RUN chmod +x /app/start-model.sh

EXPOSE 11434

ENTRYPOINT [ "/app/start-model.sh", "llama3" ]