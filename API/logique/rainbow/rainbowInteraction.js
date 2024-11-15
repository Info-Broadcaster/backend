const RainbowSDK = require('rainbow-node-sdk');
require('dotenv').config();

function init(email, password, appId, appSecret) {
    options = {
        rainbow: {
            host: 'sandbox', // Use "sandbox" or "official" depending on your environment
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
            sendReadReceipt: false,
        },
    };
    
    return new RainbowSDK(options);
}

async function testConnection(rainbowSDK) {
    return new Promise((resolve, reject) => {
        rainbowSDK.events.on('rainbow_onready', () => {
            console.log('Rainbow SDK is ready bro!');
            resolve('SDK started successfully!');
        });

        rainbowSDK.events.on('rainbow_onconnectionerror', (error) => {
            console.error('Error during connection');
            reject(new Error('Connection failed'));
        });

        rainbowSDK.start().catch((error) => {
            console.error('Error starting Rainbow SDK: ' + error.details);
            reject(error);
        });
    });
}

async function sendMessageToBubble(rainbowSDK, bubbleJid, message) {
    try {
        const result = await rainbowSDK.im.sendMessageToBubbleJid(message, bubbleJid);
        console.log('Message sent:', result);
    } catch (err) {
        console.error('Error sending message:', err);
    }
}

async function getAllBubbles(rainbowSDK) {
    try {
        const bubbles = await rainbowSDK.bubbles.getAllBubbles();

        const formattedBubbles = bubbles.map((bubble) => ({
            jid: bubble.jid,
            name: bubble.name,
            avatar: bubble.avatar,
            topic: bubble.topic,
        }));

        return formattedBubbles;
    } catch (err) {
        console.error('Error sending message:', err);
    }
}

async function stop(rainbowSDK) {
    return new Promise((resolve, reject) => {
        rainbowSDK.events.on('rainbow_onstopped', () => {
	    console.log('SDK stopped successfully.');
	    resolve('SDK stopped successfully');
        });

        rainbowSDK.events.on('rainbow_onerror', (error) => {
	    console.error('Error during SDK stop:');
	    reject(new Error('Error during SDK stop'));
        });

        rainbowSDK.stop()
	    .then(() => {
		process.exit(0);
	    })
	    .catch(() => reject("Error while stopping"));
    });
}

module.exports = {init, testConnection, stop, getAllBubbles, sendMessageToBubble};
