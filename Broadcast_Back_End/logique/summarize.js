const axios = require('axios');

async function summarize(url) {
    const postData = {
        model: "llama3",
        prompt: `Summarize me this article : ${url}`,
        stream: false
    };

    const result = await axios.post('http://localhost:11434/api/generate', postData);
    return result.data.response;
}

module.exports = summarize;