const axios = require('axios');
const {post} = require("axios");

/*
Description:
La fonction summarize envoie une requête POST à une API locale pour obtenir le résumé d'un article spécifié par une URL.

Paramètres:
url (String) : L'URL de l'article à résumer.

Retour:
Une promesse contenant le résumé de l'article
 */

async function summarize(url, lang) {
    const postData = {
        model: "llama3",
        prompt: "Summarize me this article ",
        stream: false
    };

    switch (lang) {
        case "fr" :
            postData.prompt += "en français";
            break
        case "en":
            postData.prompt += "en anglais";
            break;
    }

    postData.prompt += url;

    const result = await axios.post('http://localhost:11434/api/generate', postData);

    const title = await getTitle(result.data.response, lang);

    return {
        summarized: result.data.response,
        title: title
    };
}

async function getTitle(summarized, lang) {
    const postData = {
        model: "llama3",
        prompt: `"${summarized}". A partir de ce texte, donne moi un titre ${lang} qui le résume. Il me faut juste le titre, pas besoin de commentaire.`,
        stream: false
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData)

    return result.data.response;
}

module.exports = summarize;