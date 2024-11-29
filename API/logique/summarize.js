const { generatePrompt, interactWithIa, trad, whichLanguage } = require('../utils');

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

    let themes = await interactWithIa(
        generatePrompt(
            model,  
            'Extract up only to three most important keywords. ' +
                'Respond only with the keywords, separated by commas.' +
                ' If fewer than three keywords are identified, provide only the ones found.' +
                ' Do not provide any explanation or additional comments.',
            websiteContentInText
        )
    );

    let hookphrase = await interactWithIa(
        generatePrompt(
            model,
            'Generate a hook phrase that would be appropriate to introduce the article. ' +
                'Respond only with the hook phrase and provide no explanation or additional comments.',
            websiteContentInText
        )
    );

    if (usedLanguage !== lang) {
        summarized = await trad(model, summarized, lang);
        title = await trad(model, title, lang);
        themes = await trad(model, themes, lang);
        hookphrase = await trad(model, hookphrase, lang);
    }

    return {
        summarized,
        title,
        themes,
        hookphrase,
    };
}

module.exports = summarize;
