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

const model = "llama3";

async function summarize(url, lang) {
    const postData = {
        model: `${model}`, prompt: "Résume moi cette article ", stream: false
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
    const themes = await getThemes(result.data.response, lang);

    return {
        summarized: result.data.response, title, themes,
    };
}

async function getTitle(summarized, lang) {
    const postData = {
        model: `${model}`,
        prompt: `"${summarized}". A partir de ce texte, donne moi un titre ${lang} qui le résume. Il me faut juste le titre, pas besoin de commentaire.`,
        stream: false
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData);

    return result.data.response;
}

async function getThemes(summarized, lang) {
    const postData = {
        model: `${model}`,
        prompt: `"${summarized}". A partir de ce texte, extrait moi une liste de 3 mots-clés, thèmes ${lang} qui représente ce texte. Il me faut juste les thèmes, pas besoin de commentaire.`,
        stream: false
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData);

    return result.data.response;
}

module.exports = summarize;