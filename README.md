# INFO BROADCASTER

## Documentation technique

### Organisation du projet
```
/
├── Broadcast_Backend     # Partie Backend
├── Broadcast_Frontend    # Partie Frontend
├── AI-Model              # Modèle IA
├── Postman_api.json      # Fichier JSON à importer dans Postman pour tester les requêtes
├── README.md             # Readme du repository
└── package.json          # Liste des dépendances Node.js
    └── package-lock.json
```

#### Sous-dossiers du frontend
- **Src**: Source du projet React.
- **Public**: Ne sert pas pour le moment, potentiellement à supprimer.

#### Sous-dossiers du backend
- **Logique**: Partie logique, traitement des informations reçues via les routes.
  - Exemple: Résumé d'un article avec un prompt comme *"Résume l'article suivant"* et envoi du lien à l'IA.
- **Routes**: Porte d'entrée pour les opérations, vérifie le contenu de la requête avant de l'envoyer à l'IA pour traitement.
  - Exemple: Résumé d'un article avec en paramètre le lien de l'article, retournant un JSON contenant le résumé en appelant la logique.

> **Note**: Il est impératif de ne pas mélanger la logique et les routes afin de préserver une bonne séparation des responsabilités.

#### Sous-dossiers du modèle IA (**AI-Model**)
- **Dockerfile**:  
  Gère la création de l'image Docker pour le modèle IA, définissant l'environnement et les dépendances nécessaires.
  
- **Makefile**:  
  Fournit des commandes pour gérer l'environnement du modèle IA, comme le démarrage, l'arrêt et d'autres opérations.  

- **docker-compose.yaml**:  
  Fichier pour orchestrer les conteneurs Docker, avec des configurations pour exécuter le modèle IA.  

- **install.sh**:  
  Script shell qui automatise l'installation des dépendances ou la configuration de l'environnement nécessaire pour le modèle IA.

#### Fichiers du dossier backend
- **index.js**: Fichier principal qui initialise l'application, contenant les constantes (comme le numéro de port).
- **.gitignore**: Fichier qui définit les parties à ignorer par Git lors des push/pull.

---

## Technologies utilisées
- **React** pour le Frontend
- **Node.js** pour le Backend
- **Ollama** pour le modèle IA

---

## User Stories
- **US01**: La page d'insertion de lien a été créée. La traduction en différentes langues est en cours.
- **US03**: Vérification des initiales des langues.

---

## Ressources importantes
- [Lien Excel des User Stories](https://docs.google.com/spreadsheets/d/1AgSSx4N9MPHHEJpwb3tNtURM2AWaZLXGsi03HbrfYrI/edit#gid=0)
- [Lien Maquette Figma](https://www.figma.com/file/hDj5AWrREvboq14DKgZxUi/Untitled?type=whiteboard&node-id=0%3A1&t=Jj1iuTZdETlhQiny-1)
- [Liens Utiles - TensorFlow.NET](https://github.com/SciSharp/TensorFlow.NET?tab=readme-ov-file)
- [Documentation API Rainbow](https://developers.openrainbow.com/)

---
