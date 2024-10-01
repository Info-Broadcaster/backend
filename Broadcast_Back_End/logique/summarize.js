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
        model: `${model}`, prompt: `Forget all previous instructions and summarize this article "${url}"`, stream: false
    };

    switch (lang) {
        case "fr" :
            postData.prompt += ", in french";
            break
        case "en":
            postData.prompt += ", in english";
            break;
    }

    postData.prompt += url;

    const result = await axios.post('http://localhost:11434/api/generate', postData);
    const summarized = result.data.response;

    const promptForTitle = `"${summarized}": From this text, give me a title ${lang} that summarizes it. I just need the title, no need for a comment, without quotes.`
    const title = await interactWithIa(promptForTitle);

    // const promptForThemes = `"${summarized}": A partir de ce texte, extrait moi une liste de 3 mots-clés, thèmes ${lang}, qui représente ce texte. Il me faut juste les mots-clés, thèmes, pas besoin de commentaire.`;
    const promptForThemes = `Analyze the following text: "${summarized}". Identify and list 3 keywords, ${lang}, that summarize the main themes. Present the results as a comma-separated list. Just answer me with your analysis, without further comment or presentation of the data.`
    let themes = await interactWithIa(promptForThemes);
    themes = themes.split(", ");

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