const axios = require("axios");
require("dotenv").config();

function generatePrompt(model, systemContent, userContent) {
    return {
        model: model,
        messages: [
            {
                role: "system",
                content:
                    "Forget everything I've told you before and take this new context into account: " + systemContent,
            },
            {
                role: "user",
                content: userContent,
            },
        ],
        stream: false,
        raw: true,
    };
}

async function interactWithIa(prompt) {
    const result = await axios
        .post(process.env.MODEL_URL, prompt)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        });

    return result.data.message.content;
}

async function whichLanguage(model, text) {
    return await interactWithIa(
        generatePrompt(
            model,
            "You are an expert in language recognition. Identify the main language used in the text I give you. " +
                'If it is French, respond only with "French". If it is English, respond only with "English". No explanations or additional comments.',
            text
        )
    );
}

async function trad(model, text, lang) {
    return await interactWithIa(
        generatePrompt(
            model,
            `Translate the following text into ${lang}, keeping the structure and formatting identical. Respond only with the translation, without any explanation or additional comments.`,
            text
        )
    );
}

function clean(text) {
    return text.trim().replaceAll("\n", "");
}

module.exports = { generatePrompt, trad, interactWithIa, whichLanguage, clean };
