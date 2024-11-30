const { generatePrompt, interactWithIa, trad, whichLanguage, clean } = require("../utils");
const Rainbow = require("./rainbow/rainbowInteraction");

/*
Description:
La fonction summarize envoie une requête POST à une API locale pour obtenir le résumé d'un article textuel.

Paramètres:
websiteContentInText (String) : Le contenu de l'url en texte.

lang (String): La langue du résultat.

Retour:
Une promesse contenant le résumé de l'article
 */

const model = "gemma2:9b";
// const model = 'gemma2:9b-instruct-q5_K_M';
// const model = 'llama3.2:3b-instruct-fp16';
// const model = 'llama3.1:8b';

async function summarize(websiteContentInText, lang) {
    switch (lang) {
        case "fr":
            lang = "French";
            break;
        case "en":
            lang = "English";
            break;
    }

    const websiteContentCleaned = await interactWithIa(
        generatePrompt(
            model,
            "Extract only the main content of the article. Remove all unrelated or supplementary content. Return only the cleaned main content without altering the core text or its meaning.",
            websiteContentInText
        )
    );

    const prompt = generatePrompt(
        model,
        "Summarize the following text in 50 words or less in a concise, fluid style. Ignore titles, lists, or formatting. Provide only the plain summary.",
        websiteContentCleaned
    );

    let summarized = await interactWithIa(prompt);

    let usedLanguage;
    switch (await whichLanguage(model, summarized)) {
        case "French":
            usedLanguage = "French";
            break;
        case "English":
            usedLanguage = "English";
            break;
    }

    let title = await interactWithIa(
        generatePrompt(
            model,
            "Generate a concise and accurate title. " +
                "Respond only with the title and provide no explanation or additional comments.",
            websiteContentCleaned
        )
    );

    // Supprimer ce code en prod, puisque une instance existe déjà.
    // Ici c'est juste pour ne pas passer par le front.
    new Rainbow(
        "lhotz@cfai-formation.fr",
        "Azertyuiop67!",
        "255f2b9080fd11efa6661b0bb9c90370",
        "Tiw4OORLjL0WTjYbmym6Z2o9p0AuPakNGQUM6bAnRyyJQ7muBz27wmBcxVxWuTix"
    );

    const rainbow = Rainbow.instance;
    const bubbles = await rainbow.getAllBubbles();
    const onlyTopicOfBubbles = bubbles.map((bubble) => bubble.topic);

    let themes = await interactWithIa(
        generatePrompt(
            model,
            "From the following text, identify the most relevant theme, strictly limited to the provided list: [" +
                onlyTopicOfBubbles +
                "]. Only return theme that are clearly and explicitly discussed in the text. Avoid any vague or loosely related matches. If none of the themes from the list are present in the text, return nothing. Respond only with the theme that match. Do not invent or approximate any themes.",
            websiteContentCleaned
        )
    );

    if (usedLanguage !== lang) {
        summarized = await trad(model, summarized, lang);
        title = await trad(model, title, lang);
        // if (themes.length > 0) {
        //     themes = await trad(model, themes, lang);
        // }
    }

    summarized = clean(summarized);
    title = clean(title);
    themes = clean(themes);

    return {
        summarized,
        title,
        themes,
    };
}

module.exports = summarize;
