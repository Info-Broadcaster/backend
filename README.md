# INFO BROADCASTER

## Documentation technique
### Organisation du projet
- Arborescence du travail  
/  
|___ Broadcast_Backend : Partie Back  
|___ Broadcast_Frontend : Partie Front  
|___ AI-Model : Modele IA  
Postman_api.json : fichier json à importer dans postman pour avoir les requetes à test
README.md : Readme du repository
Packages.json et packages-lock.json : Packages nodes

- Sous dossiers du frontend :  
    - Src : Source du projet React  
    - Public : Ne sert pas pour le moment, potentiellement à supprimer  
- Sous dossiers du backend :
    - Logique : C’est la partie logique, le traitement des informations passées par la route. Exemple : Résumé de l’article : la logique contient le prompt « resume l’article suivant » et l’envois au modele avec le lien de l’article.
    - Routes : C’est la porte d’entrée pour les opérations, tester le contenu de la requete avant de l’envoyer à l’IA pour le resumé. Exemple : Résumé de l’article  
    - Prend en parametre le lien de l’article et retourne un json contenant le resumé en faisant appel à la logique.  

**NOTE** : La logique ne doit absolument pas figurer dans la partie route afin de ne pas poser de confusion. On souhaite garder une bonne séparation.
Fichiers du dossier backend :  
- Index.js : Fichier principal, initiateur. Contient les constantes (numero de port).
- .gitignore : Parties ignorées par git lors des push et des pull

## Technologies utilisés
- React pour le Front
- NodeJS pour le Back
- Ollama pour le modèle IA

## User Stories
- US01: La page d'insertion de lien a été effectué. La traduction avec différentes langues est en cours.
- US03: Vérifier les initiales des langues 

## Resources importantes
- Lien excel User Stories :  
https://docs.google.com/spreadsheets/d/1AgSSx4N9MPHHEJpwb3tNtURM2AWaZLXGsi03HbrfYrI/edit#gid=0  

- Lien maquette Figma :  
https://www.figma.com/file/hDj5AWrREvboq14DKgZxUi/Untitled?type=whiteboard&node-id=0%3A1&t=Jj1iuTZdETlhQiny-1  

- Liens utiles :  
https://github.com/SciSharp/TensorFlow.NET?tab=readme-ov-file  

