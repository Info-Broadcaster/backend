const { generatePrompt, interactWithIa, trad, whichLanguage } = require('../utils');
const Rainbow = require('./rainbow/rainbowInteraction');

/*
Description:
La fonction summarize envoie une requête POST à une API locale pour obtenir le résumé d'un article textuel.

Paramètres:
websiteContentInText (String) : Le contenu de l'url en texte.

lang (String): La langue du résultat.

Retour:
Une promesse contenant le résumé de l'article
 */

const model = 'gemma2:9b';
// const model = 'gemma2:9b-instruct-q5_K_M';
// const model = 'llama3.2:3b-instruct-fp16';

async function summarize(websiteContentInText, lang) {
    switch (lang) {
        case 'fr':
            lang = 'French';
            break;
        case 'en':
            lang = 'English';
            break;
    }

    const prompt = generatePrompt(
        model,
        'You are a summarizer. You will summarize any text provided to you. ' +
            'No more than 50 words. Only provide the summary itself without any introduction, explanation, ' +
            'or additional information.',
        websiteContentInText
    );

    let summarized = await interactWithIa(prompt);

    let usedLanguage;
    switch (await whichLanguage(model, summarized)) {
        case 'French':
            usedLanguage = 'French';
            break;
        case 'English':
            usedLanguage = 'English';
            break;
    }

    let title = await interactWithIa(
        generatePrompt(
            model,
            'Generate a concise and accurate title. ' +
                'Respond only with the title and provide no explanation or additional comments.',
            websiteContentInText
        )
    );

    // Supprimer ce code en prod, puisque une instance existe déjà.
    // Ici c'est juste pour ne pas passer par le front.
    new Rainbow(
        'lhotz@cfai-formation.fr',
        'Azertyuiop67!',
        '255f2b9080fd11efa6661b0bb9c90370',
        'Tiw4OORLjL0WTjYbmym6Z2o9p0AuPakNGQUM6bAnRyyJQ7muBz27wmBcxVxWuTix'
    );

    const rainbow = Rainbow.instance;
    const bubbles = await rainbow.getAllBubbles();
    const onlyTopicOfBubbles = bubbles.map((bubble) => bubble.topic.trim());
    let onlyTopisOfBubblesInEnglish = await trad(model, onlyTopicOfBubbles.join(','), 'English');
    onlyTopisOfBubblesInEnglish = onlyTopisOfBubblesInEnglish.replaceAll('\n', '');

    let themes = await interactWithIa(
        generatePrompt(
            model,
            'From the following list, extract up to three keywords that exactly match the entries provided: ' +
                onlyTopisOfBubblesInEnglish +
                '. Only respond with keywords that match exactly from this list, separated by commas. If no exact matches are found, return nothing. Do not return any keywords that are not an exact match from the provided list. No explanations or additional comments are required.',
            websiteContentInText
        )
    );

    if (usedLanguage !== lang) {
        summarized = await trad(model, summarized, lang);
        title = await trad(model, title, lang);
        themes = await trad(model, themes, lang);
    }

    return {
        summarized,
        title,
        themes,
    };
}

module.exports = summarize;
