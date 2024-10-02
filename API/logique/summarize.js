const axios = require('axios');

/*
Description:
La fonction summarize envoie une requête POST à une API locale pour obtenir le résumé d'un article spécifié par une URL.

Paramètres:
url (String) : L'URL de l'article à résumer.

Retour:
Une promesse contenant le résumé de l'article
 */

const model = 'llama3.2:3b';

async function summarize(url, lang) {
    const postData = {
        // model: `${model}`, prompt: `Forget all previous instructions and summarize this article "${url}", in two short sentence maximal `, stream: false
        model: `${model}`,
        //         prompt: `Extract the essential information from a long text and summarize it in 2-3 sentences, retaining the gist of important details.
        // details. This is the text : "${url}"`,
        prompt:
            'Answer this prompt with a summary of no more than 100 words, using a concise sentence and without' +
            " providing any explanation or additional comments. Only the translated text should be returned, Here's" +
            ' the text : \n',
        stream: false,
    };

    switch (lang) {
        case 'fr':
            lang = 'French';
            break;
        case 'en':
            lang = 'English';
            break;
    }

    postData.prompt += `"${await trad(url, lang)}"`;

    // postData.prompt += url;

    const result = await axios.post('http://localhost:11434/api/generate', postData);
    const summarized = result.data.response;

    const promptForTitle = `"${summarized}": From this text, give me a title to ${lang} that summarizes it and without providing any explanation or additional comments. Only the title should be returned`;
    const title = await interactWithIa(promptForTitle);

    // const promptForThemes = `"${summarized}": A partir de ce texte, extrait moi une liste de 3 mots-clés, thèmes ${lang}, qui représente ce texte. Il me faut juste les mots-clés, thèmes, pas besoin de commentaire.`;
    const promptForThemes = `Analyze the following text: "${summarized}". Identify and list 3 keywords to ${lang}, that summarize the main themes. Present the results as a comma-separated list and without providing any explanation or additional comments. Only the list of theme should be returned.`;
    let themes = await interactWithIa(promptForThemes);
    themes = themes.split(', ');

    return {
        summarized: result.data.response,
        title,
        themes,
    };
}

async function interactWithIa(prompt) {
    const postData = {
        model: `${model}`,
        prompt: `${prompt}`,
        stream: false,
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData);

    return result.data.response;
}

async function trad(text, lang) {
    const textSplitIntoSentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g);

    if(!textSplitIntoSentences){
        return text;
    }

    let traductions = [];
    for (const sentence of textSplitIntoSentences) {
        traductions.push(
            await interactWithIa(
                `Translate the following text to ${lang} without providing any explanation or additional comments. Only the translated text should be returned : "${sentence}"`
            )
        );
    }

    return traductions.join(' ');
}

module.exports = summarize;
