const RainbowSDK = require('rainbow-node-sdk');

class RainbowInteraction {
    constructor(email, password, appId, appSecret) {
        // Rainbow SDK options
        this.options = {
            rainbow: {
                host: "sandbox", // Use "sandbox" or "official" depending on your environment
            },
            credentials: {
                login: email, // User email
                password: password, // User password
            },
            application: {
                appID: appId, // Application ID
                appSecret: appSecret, // Application secret
            },
            logs: {
                enableConsoleLogs: true, // Enable or disable console logs
                enableFileLogs: false, // Enable or disable file logs
            },
            im: {
                sendReadReceipt: true, // Automatically send read receipts
            },
        };

        // Initialize Rainbow SDK
        this.rainbowSDK = new RainbowSDK(this.options);
        this.isReady = false;

        // Start Rainbow SDK
        this.start();
    }

    // Start the SDK and set up event listeners
    start() {
        this.rainbowSDK.start();

        // Handle SDK ready event
        this.rainbowSDK.events.on("rainbow_onready", () => {
            console.log("Rainbow SDK is ready.");
            this.isReady = true;
        });

        // Handle errors
        this.rainbowSDK.events.on("rainbow_onerror", (err) => {
            console.error("Rainbow SDK error:", err);
        });
    }

    // Method to send a message to a bubble by its JID
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

    // Stop the SDK
    stop() {
        this.rainbowSDK.stop();
    }
}

module.exports = RainbowInteraction;
