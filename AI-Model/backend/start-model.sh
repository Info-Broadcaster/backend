#!/bin/sh
MODEL_NAME=$1

if [ -z "$MODEL_NAME" ]; then
  echo "Erreur: Pas de nom de modèle spécifié."
  exit 1
fi

ollama serve & # Pour démarrer le serveur Ollama en background
ollama run "$MODEL_NAME"
