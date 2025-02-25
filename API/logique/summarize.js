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
    try {
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
                "Extract only the main content of the article. Remove all unrelated or supplementary content. Return only the cleaned main content without altering the core text or its meaning. Converts text to markdown, highlighting important information. If there is a main image, add it..",
                websiteContentInText
            )
        );

        const prompt = generatePrompt(
            model,
            `Summarize the following text in 50 words or less in a concise, fluid style. 
            - Format the summary in **Markdown**.  
            - Use proper Markdown syntax:
                - **Bold** key points.
                - *Italicize* important concepts.
                - Use \`code blocks\` where relevant.
            - Maintain clarity and conciseness.`,
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

        const rainbow = Rainbow.instance;
        const bubbles = await rainbow.getAllBubbles();
        const onlyTopicOfBubbles = bubbles.map((bubble) => bubble.topic);

        let themes = await interactWithIa(
            generatePrompt(
                model,
                "Extract up only to three most important keywords. " +
                    "Respond only with the keywords, separated by commas." +
                    " If fewer than three keywords are identified, provide only the ones found." +
                    " Do not provide any explanation or additional comments.",
                websiteContentInText
            )
        );

        let suggestThemeFromTopicsInBubbles = await interactWithIa(
            generatePrompt(
                model,
                "From the following text, identify the most relevant themes, strictly limited to the provided list: [" +
                    onlyTopicOfBubbles +
                    "]. Only return 3 themes separated by commas that are clearly and explicitly discussed in the text. Avoid any vague or loosely related matches. If none of the themes from the list are present in the text, return nothing. Respond only with the themes that match. Do not invent or approximate any themes.",
                websiteContentCleaned
            )
        );

        let hookphrase = await interactWithIa(
            generatePrompt(
                model,
                "Generate a hook phrase that would be appropriate to introduce the article. " +
                    "Respond only with the hook phrase and provide no explanation or additional comments.",
                websiteContentInText
            )
        );

        if (usedLanguage !== lang) {
            summarized = await trad(model, summarized, lang);
            title = await trad(model, title, lang);
            hookphrase = await trad(model, hookphrase, lang);
        }

        summarized = clean(summarized);
        title = clean(title);
        themes = clean(themes);
        suggestThemeFromTopicsInBubbles = clean(suggestThemeFromTopicsInBubbles);

        return {
            summarized,
            title,
            themes,
            suggestThemeFromTopicsInBubbles,
            hookphrase,
        };
    } catch (error) {
        throw error;
    }
}

module.exports = summarize;
