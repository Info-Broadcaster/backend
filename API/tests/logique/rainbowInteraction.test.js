const RainbowSDK = require("rainbow-node-sdk");
const Rainbow = require("../../logique/rainbow/rainbowInteraction");

jest.mock("rainbow-node-sdk");
global.console = {
    log: jest.fn(),
    error: jest.fn(),
};

describe("Rainbow SDK Wrapper", () => {
    let rainbowInstance;
    let mockSdk;

    beforeEach(() => {
        RainbowSDK.mockImplementation(() => ({
            start: jest.fn().mockResolvedValue("Started"),
            stop: jest.fn().mockResolvedValue("Stopped"),
            events: {
                on: jest.fn((event, callback) => {
                    if (event === "rainbow_onready") setTimeout(() => callback(), 10);
                    if (event === "rainbow_onconnectionerror") setTimeout(() => callback(new Error("Connection error")), 10);
                    if (event === "rainbow_onstopped") setTimeout(() => callback(), 10);
                    if (event === "rainbow_onmessagereceiptreadreceived") setTimeout(() => callback({
                        id: 'testMessageId'
                    }), 10);
                }),
                emit: jest.fn()
            },
            im: {
                sendMessageToBubbleJid: jest.fn().mockResolvedValue("MessageSent"),
            },
            bubbles: {
                getAllBubbles: jest.fn().mockResolvedValue([
                    { jid: "bubble1", name: "TestBubble", avatar: "url", topic: "Testing" },
                ]),
            },
        }));

        rainbowInstance = new Rainbow("test@example.com", "password", "appId", "appSecret");
        mockSdk = rainbowInstance.sdk;
    });

    it("should initialize Rainbow.instance if it's null", () => {
        Rainbow.instance = null;
        const rainbowInstance = new Rainbow("user@example.com", "password", "appId", "appSecret");
        expect(Rainbow.instance).toBe(rainbowInstance);
    });


    it("should create a new instance of Rainbow SDK", () => {
        expect(rainbowInstance).toBeInstanceOf(Rainbow);
        expect(mockSdk.start).not.toHaveBeenCalled();
    });

    it("should start SDK successfully", async () => {
        await expect(rainbowInstance.testConnection()).resolves.toBe("SDK started successfully!");
        expect(mockSdk.start).toHaveBeenCalledTimes(1);
    });

    it("should handle SDK connection error", async () => {
        mockSdk.start.mockRejectedValueOnce(new Error("Connection failed"));
        await expect(rainbowInstance.testConnection()).rejects.toThrow("Connection failed");
    });

    it("should send message to bubble successfully", async () => {
        const bubbleJid = "bubbleJid";
        const message = "Hello World";

        const expectedParams = {
            message: "Hello World",
            type: "text/markdown"
        };

        await rainbowInstance.sendMessageToBubble(bubbleJid, message);

        expect(mockSdk.im.sendMessageToBubbleJid).toHaveBeenCalledWith(
            message,
            bubbleJid,
            undefined,
            expectedParams
        );
    });

    it("should handle error while sending message", async () => {
        mockSdk.im.sendMessageToBubbleJid.mockRejectedValueOnce(new Error("Send failed"));
        await expect(rainbowInstance.sendMessageToBubble("bubbleJid", "Hello World")).resolves.toBeUndefined();
    });

    it("should retrieve bubbles correctly", async () => {
        const bubbles = await rainbowInstance.getAllBubbles();
        expect(bubbles).toEqual([
            { jid: "bubble1", name: "TestBubble", avatar: "url", topic: "Testing" },
        ]);
    });

    it("should handle error while retrieving bubbles", async () => {
        mockSdk.bubbles.getAllBubbles.mockRejectedValueOnce(new Error("Retrieval error"));
        await expect(rainbowInstance.getAllBubbles()).resolves.toBeUndefined();
    });

    it("should stop SDK successfully", async () => {
        await expect(rainbowInstance.stop()).resolves.toBe("SDK stopped successfully");
        expect(mockSdk.stop).toHaveBeenCalledTimes(1);
    });

    it("should handle error while stopping SDK", async () => {
        mockSdk.stop.mockRejectedValueOnce(new Error("Stop failed"));
        await expect(rainbowInstance.stop()).rejects.toThrow("Error while stopping");
    });

    it("should handle message receipt event", () => {
        const eventHandler = mockSdk.events.on.mock.calls.find(
            call => call[0] === "rainbow_onmessagereceiptreadreceived"
        )[1];

        expect(() => eventHandler({ id: 'testMessageId' })).not.toThrow();
    });

    it("should handle null bubbles in getAllBubbles", async () => {
        mockSdk.bubbles.getAllBubbles.mockResolvedValueOnce(null);
        const result = await rainbowInstance.getAllBubbles();
        expect(result).toBeUndefined();
    });

    it("should create options with correct configuration", () => {
        expect(rainbowInstance.options).toEqual({
            rainbow: {
                host: "sandbox",
            },
            credentials: {
                login: "test@example.com",
                password: "password",
            },
            application: {
                appID: "appId",
                appSecret: "appSecret",
            },
            logs: {
                enableConsoleLogs: false,
                enableFileLogs: false,
            },
            im: {
                sendReadReceipt: true,
            },
        });
    });

    it("should handle connection error during testConnection", async () => {
        mockSdk.events.on.mockImplementationOnce((event, callback) => {
            if (event === "rainbow_onconnectionerror") {
                setTimeout(() => callback(new Error("Connection error")), 10);
            }
        });
        await expect(rainbowInstance.testConnection()).rejects.toThrow("Connection failed");
    });

    it("should handle multiple stop event callbacks", async () => {
        let stopCallback;
        mockSdk.events.on.mockImplementation((event, callback) => {
            if (event === "rainbow_onstopped") {
                stopCallback = callback;
            }
        });

        const stopPromise = rainbowInstance.stop();
        stopCallback();
        stopCallback();
        await expect(stopPromise).resolves.toBe("SDK stopped successfully");
    });

    it("should handle error event during stop", async () => {
        let errorCallback;
        mockSdk.events.on.mockImplementation((event, callback) => {
            if (event === "rainbow_onerror") {
                errorCallback = callback;
            }
        });

        const stopPromise = rainbowInstance.stop();
        errorCallback(new Error("Stop error"));
        await expect(stopPromise).rejects.toThrow("Error during SDK stop");
    });

    it("should increment message receipt counter correctly", () => {
        const event1 = { id: "msg1" };
        rainbowInstance.dict["msg1"] = 0;

        mockSdk.events.on.mock.calls.find(call => call[0] === "rainbow_onmessagereceiptreadreceived")[1](event1);
        expect(rainbowInstance.dict["msg1"]).toBe(1);

        const event2 = { id: "msg2" };
        rainbowInstance.dict["msg2"] = 2;

        mockSdk.events.on.mock.calls.find(call => call[0] === "rainbow_onmessagereceiptreadreceived")[1](event2);
        expect(rainbowInstance.dict["msg2"]).toBe(1);
    });

});
