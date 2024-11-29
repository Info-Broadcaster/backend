const RainbowSDK = require('rainbow-node-sdk');
require('dotenv').config();

class Rainbow {
    constructor(email, password) {
        this.options = {
            rainbow: { host: 'sandbox' },
            credentials: { login: email, password: password },
            application: { appID: process.env.APP_ID, appSecret: process.env.APP_SECRET},
            logs: { enableConsoleLogs: false, enableFileLogs: false },
            im: { sendReadReceipt: false },
        };
        this.sdk = new RainbowSDK(this.options);
    }

    async start() {
        return new Promise((resolve, reject) => {
            this.sdk.events.on('rainbow_onready', () => {
                console.log('Rainbow SDK pour ' + this.options.credentials.login + ' prêt !');
                resolve();
            });

            this.sdk.events.on('rainbow_onconnectionerror', (error) => {
                console.error('Erreur de connexion Rainbow :', error);
                reject(new Error('Connexion Rainbow échouée'));
            });

            this.sdk.start().catch((error) => {
                console.error('Erreur lors du démarrage de Rainbow SDK :', error.details);
                reject(error);
            });
        });
    }

    async stop() {
        return new Promise((resolve) => {
            this.sdk.stop().then(() => {
                console.log('Rainbow SDK arrêté pour cet utilisateur');
                resolve();
            });
        });
    }

    async getBubbles() {
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
            console.error('Error getting bubbles:', err);
        }
    }

    async sendMessageToBubble(bubbleJid, message) {
        return this.sdk.im.sendMessageToBubbleJid(message, bubbleJid);
    }
}

module.exports = Rainbow;
