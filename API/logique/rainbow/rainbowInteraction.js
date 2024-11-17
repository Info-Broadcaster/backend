const RainbowSDK = require('rainbow-node-sdk');
require('dotenv').config();

class Rainbow {
    constructor(email, password) {
        this.options = {
            rainbow: {
                host: 'sandbox', // Use "sandbox" or "official" depending on your environment
            },
            credentials: {
                login: email,
                password: password,
            },
            application: {
                appID: process.env.APP_ID,
                appSecret: process.env.APP_SECRET,
            },
            logs: {
                enableConsoleLogs: false,
                enableFileLogs: false,
            },
            im: {
                sendReadReceipt: false,
            },
        };
        this.sdk = new RainbowSDK(this.options);
    }

    async testConnection() {
        return new Promise((resolve, reject) => {
            this.sdk.events.on('rainbow_onready', () => {
                console.log('Rainbow SDK is ready!');
                resolve('SDK started successfully!');
            });

            this.sdk.events.on('rainbow_onconnectionerror', (error) => {
                console.error('Error during connection');
                reject(new Error('Connection failed'));
            });

            this.sdk.start().catch((error) => {
                console.error('Error starting Rainbow SDK: ' + error.details);
                reject(error);
            });
        });
    }

    async sendMessageToBubble(bubbleJid, message) {
        try {
            const result = await this.sdk.im.sendMessageToBubbleJid(message, bubbleJid);
            console.log('Message sent:', result);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    }

    async getAllBubbles() {
        try {
            const bubbles = await this.sdk.bubbles.getAllBubbles();

            const formattedBubbles = bubbles.map((bubble) => ({
                jid: bubble.jid,
                name: bubble.name,
                avatar: bubble.avatar,
                topic: bubble.topic,
            }));

            return formattedBubbles;
        } catch (err) {
            console.error('Error getting bubbles:', err);
        }
    }

    async stop() {
        return new Promise((resolve, reject) => {
            this.sdk.events.on('rainbow_onstopped', () => {
                console.log('SDK stopped successfully.');
                resolve('SDK stopped successfully');
            });

            this.sdk.events.on('rainbow_onerror', (error) => {
                console.error('Error during SDK stop:');
                reject(new Error('Error during SDK stop'));
            });

            this.sdk.stop()
                .then(() => {
                    process.exit(0);
                })
                .catch(() => reject("Error while stopping"));
        });
    }
}

module.exports = Rainbow;