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
    const summarized = result.data.response;

    const promptForTitle = `"${summarized}": A partir de ce texte, donne moi un titre ${lang} qui le résume. Il me faut juste le titre, pas besoin de commentaire.`
    const title = await interactWithIa(promptForTitle);

    const promptForThemes = `"${summarized}": A partir de ce texte, extrait moi une liste de 3 mots-clés, thèmes ${lang}, qui représente ce texte. Il me faut juste les mots-clés, thèmes, pas besoin de commentaire.`;
    const themes = await interactWithIa(promptForThemes);

    return {
        summarized: result.data.response, title, themes,
    };
}

async function interactWithIa(prompt) {
    const postData = {
        model: `${model}`,
        prompt: `${prompt}`,
        stream: false
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData);

    return result.data.response;
}

module.exports = summarize;