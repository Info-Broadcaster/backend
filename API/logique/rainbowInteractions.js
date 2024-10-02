let loginMail = ""; // To fill with rainbow developper credentials (from sandbox)
let password = ""; // To fill with rainbow developper credentials (from sandbox)


let RainbowSDK = require('rainbow-node-sdk');
const {DataStoreType} = require("rainbow-node-sdk/lib/config/config");

// Define all the configuration, to be moved somewhere else
let options = {
    "rainbow": {
        "host": "sandbox", // Can be "sandbox" (developer platform), "official" or any other hostname when using dedicated AIO
        "mode": "xmpp" // The event mode used to receive the events. (default : `xmpp`)
    },
    "credentials": {
        "login": loginMail, // Bot's login to the rainbow platform
        "password": password // Bot's password to the rainbow platform
    },
    // Application identifier
    "application": {
        "appID": "7c0cd37080c611efa6661b0bb9c90370", // The Rainbow Application Identifier
        "appSecret": "mwzxgG5yWVsbGzz61aX6klt895XwNIpcrbJtod5fBgYH3pvU8NS9WkYk6pDhtih9", // The Rainbow Application Secret
    },
    // Logs options
    "logs": {
        "enableConsoleLogs": false, // Activate logs on the console
        "enableFileLogs": false, // Activate the logs in a file<br>
        "color": true, // Activate the ansii color in the log (more humain readable, but need a term console or reader compatible (ex : vim + AnsiEsc module)) <br>
        "level": "info", // The level of logs. The value can be "info", "debug", "warn", "error"<br>
        "customLabel": "MyRBProject", // A label inserted in every lines of the logs. It is usefull if you use multiple SDK instances at a same time. It allows to separate logs in console.<br>
        "file": {
            "path": "c:/temp/", // Path to the log file
            "customFileName": "R-SDK-Node-MyRBProject", // A label inserted in the name of the log file
            "zippedArchive": false // Can activate a zip of file. It needs CPU process, so avoid it.
        }
    },
    "testOutdatedVersion": true, //Parameter to verify at startup if the current SDK Version is the lastest published on npmjs.com.
    "requestsRate":{ // rate limit of the http requests to server.
        "maxReqByIntervalForRequestRate": 600, // nb requests during the interval.
        "intervalForRequestRate": 60, // nb of seconds used for the calcul of the rate limit.
        "timeoutRequestForRequestRate": 600 // nb seconds Request stay in queue before being rejected if queue is full.
    },
    // IM options
    "im": {
        "sendReadReceipt": true, // If it is setted to true (default value), the 'read' receipt is sent automatically to the sender when the message is received so that the sender knows that the message as been read.
        "messageMaxLength": 1024, // the maximum size of IM messages sent. Note that this value must be under 1024.
        "sendMessageToConnectedUser": false, // When it is setted to false it forbid to send message to the connected user. This avoid a bot to auto send messages.
        "conversationsRetrievedFormat": "small", // It allows to set the quantity of datas retrieved when SDK get conversations from server. Value can be "small" of "full"
        "storeMessages": true, // Define a server side behaviour with the messages sent. When true, the messages are stored, else messages are only available on the fly. They can not be retrieved later.
        "nbMaxConversations": 15, // parameter to set the maximum number of conversations to keep (defaut value to 15). Old ones are removed from XMPP server. They are not destroyed. The can be activated again with a send to the conversation again.
        "rateLimitPerHour": 1000, // Set the maximum count of stanza messages of type `message` sent during one hour. The counter is started at startup, and reseted every hour.
        "messagesDataStore": DataStoreType.StoreTwinSide, // Parameter to override the storeMessages parameter of the SDK to define the behaviour of the storage of the messages (Enum DataStoreType in lib/config/config , default value "DataStoreType.UsestoreMessagesField" so it follows the storeMessages behaviour)<br>
        // DataStoreType.NoStore Tell the server to NOT store the messages for delay distribution or for history of the bot and the contact.<br>
        // DataStoreType.NoPermanentStore Tell the server to NOT store the messages for history of the bot and the contact. But being stored temporarily as a normal part of delivery (e.g. if the recipient is offline at the time of sending).<br>
        // DataStoreType.StoreTwinSide The messages are fully stored.<br>
        // DataStoreType.UsestoreMessagesField to follow the storeMessages SDK's parameter behaviour.

        "autoInitialGetBubbles" : true, // to allow automatic opening of the bubbles the user is in. Default value is true.
        "autoInitialBubblePresence": true, // Define if the presence should be sent automatically to bubbles. This allows to receive the messages from the bubbles.
        "autoInitialBubbleFormat": "small", // to allow modify format of data received at getting the bubbles. Default value is true.
        "autoInitialBubbleUnsubscribed": true, // to allow get the bubbles when the user is unsubscribed from it. Default value is true.
        "autoLoadConversations": true, // Define if the existing conversations on server side should be downloaded at startup. On bot with lot of contacts exchange it can slower the startup.
        "autoLoadContacts": true // Define if the contacts from the network (the roster) should be loaded at startup.
    },

    // Services to start. This allows to start the SDK with restricted number of services, so there are less call to API.
    // Take care, severals services are linked, so disabling a service can disturb an other one.
    // By default all the services are started. Events received from server are not filtered.
    // So this feature is realy risky, and should be used with much more cautions.
    "servicesToStart": {
        "bubbles":  {
            "start_up":true,
        }, //need services :
        "telephony":  {
            "start_up":true,
        }, //need services : _contacts, _bubbles, _profiles
        "channels":  {
            "start_up":true,
        }, //need services :
        "admin":  {
            "start_up":true,
        }, //need services :
        "fileServer":  {
            "start_up":true,
        }, //need services : _fileStorage
        "fileStorage":  {
            "start_up":true,
        }, //need services : _fileServer, _conversations
        "calllog":  {
            "start_up":true,
        }, //need services :  _contacts, _profiles, _telephony
        "favorites":  {
            "start_up":true,
        } //need services :
    } // */

};

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(options);

// Connection states
rainbowSDK.events.on('rainbow_onstarted', () => {
    console.log("RainbowSDK started");
});

rainbowSDK.events.on('rainbow_onconnected', () => {
    console.log("RainbowSDK connected");
});

rainbowSDK.events.on('rainbow_onready', () => {
    console.log("RainbowSDK ready");
});

rainbowSDK.events.on('rainbow_onstopped', () => {
    console.log("RainbowSDK stopped");
});

// Start the SDK
rainbowSDK.start().then(() => {
    console.log("All good.");
});