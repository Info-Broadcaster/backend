require("dotenv").config();
var fs = require("fs");

async function getLinkTracker(target_link) {
    const apiUrl = "https://app.linklyhq.com/api/v1/link";
    const apiKey = process.env.LINKLY_API_KEY;

    const completeUrl = `${apiUrl}?api_key=${apiKey}`;

    const data = {
        url: target_link,
        workspace_id: process.env.WORKSPACE_ID,
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    return fetch(completeUrl, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json.full_url;
        })
        .catch((error) => {
            console.error("Error:", error);
            throw error;
        });
}

function getTrackerDataFromLinkly() {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://app.linklyhq.com/api/v1/workspace/${process.env.WORKSPACE_ID}/list_links`;
        const apiKey = process.env.LINKLY_API_KEY;
        const completeUrl = `${apiUrl}?api_key=${apiKey}`;

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        return fetch(completeUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const simplifiedLinks = data.links.map((link) => ({
                    id: link.id,
                    clicks_total: link.clicks_total,
                    url: link.url,
                    full_url: link.full_url,
                }));

                // console.log('Simplified Links:', simplifiedLinks);

                resolve(simplifiedLinks);
            })
            .catch((error) => {
                console.error("Error:", error);
                reject(error);
                throw error;
            });
    });
}

module.exports = { getLinkTracker, getTrackerDataFromLinkly };
