const axios = require('axios');

/*
Description:
La fonction summarize envoie une requête POST à une API locale pour obtenir le résumé d'un article spécifié par une URL.

Paramètres:
url (String) : L'URL de l'article à résumer.

Retour:
Une promesse contenant le résumé de l'article
 */

async function summarize(url) {
    const postData = {
        model: "llama3",
        prompt: `Summarize me this article : ${url}`,
        stream: false
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData);
    return result.data.response;
}

module.exports = summarize;