const RainbowSDK = require('rainbow-node-sdk');
require('dotenv').config();

class RainbowInteraction {
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
                enableConsoleLogs: true,
                enableFileLogs: false,
            },
            im: {
                sendReadReceipt: true,
            },
        };

        this.rainbowSDK = new RainbowSDK(this.options);

        this.isReady = false;

        this.loginError = false;

        this.start()
    }

    start() {

        this.rainbowSDK.start();

        this.rainbowSDK.events.on("rainbow_onready", () => {
            console.log("Rainbow SDK is ready.");
            this.isReady = true;
        });

        this.rainbowSDK.events.on("rainbow_onerror", (err) => {
            console.error("Rainbow SDK error:", err);
        });

        this.rainbowSDK.events.on("rainbow_onconnectionerror", (error) => {
            this.loginError = true;
        });
    }

    async sendMessageToBubble(bubbleJid, message) {
        if (!this.isReady) {
            console.log("SDK not ready yet, waiting...");
            // Wait for SDK to be ready
            await new Promise((resolve) => {
                this.rainbowSDK.events.once("rainbow_onready", resolve);
            });
        }

        try {
            const result = await this.rainbowSDK.im.sendMessageToBubbleJid(message, bubbleJid);
            console.log("Message sent:", result);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    }

    async getAllBubbles() {
        if (!this.isReady) {
            console.log("SDK not ready yet, waiting...");
            // Wait for SDK to be ready
            await new Promise((resolve) => {
                this.rainbowSDK.events.once("rainbow_onready", resolve);
            });
        }

        try {
            const bubbles = await this.rainbowSDK.bubbles.getAllBubbles();

            const formattedBubbles = bubbles.map(bubble => ({
                jid: bubble.jid,
                name: bubble.name,
                avatar: bubble.avatar,
                topic: bubble.topic,
            }));

            return formattedBubbles;

        } catch (err) {
            console.error("Error sending message:", err);
        }
    }

    stop() {
        this.rainbowSDK.stop();
    }
}

module.exports = RainbowInteraction;
