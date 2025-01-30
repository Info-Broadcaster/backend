const RainbowSDK = require("rainbow-node-sdk");
require("dotenv").config();

class Rainbow {
    static instance = null;

    static instance = null;

    constructor(email, password, appId, appSecret) {
        this.options = {
            rainbow: {
                host: "sandbox", // Use "sandbox" or "official" depending on your environment
            },
            credentials: {
                login: email,
                password: password,
            },
            application: {
                appID: appId,
                appSecret: appSecret,
            },
            logs: {
                enableConsoleLogs: false,
                enableFileLogs: false,
            },
            im: {
                sendReadReceipt: true,
            },
        };

        this.dict = {};

        this.sdk = new RainbowSDK(this.options);

        // Attention pas encore un vrai singleton pour l'instant!
        if (Rainbow.instance == null) {
            Rainbow.instance = this;
        }

        const receipt = this.sdk.events.on("rainbow_onmessagereceiptreadreceived", (event) => {
            console.log("Someone viewed...");
            console.log(event);

            if (this.dict[event.id] > 0) {
                dict[event.id] = 1;
            } else {
                dict[event.id] += 1;
            }
        });
    }

    async testConnection() {
        return new Promise((resolve, reject) => {
            this.sdk.events.on("rainbow_onready", () => {
                console.log("Rainbow SDK is ready!");
                resolve("SDK started successfully!");
            });

            this.sdk.events.on("rainbow_onconnectionerror", (error) => {
                console.error("Error during connection");
                reject(new Error("Connection failed"));
            });

            this.sdk.start().catch((error) => {
                console.error("Error starting Rainbow SDK: " + error.details);
                reject(error);
            });
        });
    }

    async sendMessageToBubble(bubbleJid, message) {
        // await this.testConnection(); // TODO: Check try/catch block
        try {
            const result = await this.sdk.im.sendMessageToBubbleJid(message, bubbleJid);
            console.log("Message sent:", result);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    }

    async getAllBubbles() {
        // await this.testConnection();

        try {
            const bubbles = await this.sdk.bubbles.getAllBubbles();

            const formattedBubbles = bubbles?.map((bubble) => ({
                jid: bubble.jid,
                name: bubble.name,
                avatar: bubble.avatar,
                topic: bubble.topic,
            }));

            return formattedBubbles;
        } catch (err) {
            console.error("Error getting bubbles:", err);
        }
    }

    async stop() {
        return new Promise((resolve, reject) => {
            this.sdk.events.on("rainbow_onstopped", () => {
                console.log("SDK stopped successfully.");
                resolve("SDK stopped successfully");
            });

            this.sdk.events.on("rainbow_onerror", (error) => {
                console.error("Error during SDK stop:");
                reject(new Error("Error during SDK stop"));
            });

            this.sdk
                .stop()
            this.sdk
                .stop()
                .then(() => {
                    process.exit(0);
                })
                .catch(() => reject('Error while stopping'));
        });
    }
}

module.exports = Rainbow;
