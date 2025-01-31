const RainbowSDK = require("rainbow-node-sdk");
const Rainbow = require("../logique/rainbow/rainbowInteraction"); // Import the class
jest.mock("rainbow-node-sdk");

global.console = {
    log: jest.fn(),
    error: jest.fn(),
};

describe("Rainbow SDK Wrapper (Fully Mocked Connection)", () => {
    let rainbowInstance;
    let mockSdk;

    beforeEach(() => {
        // Mock SDK behavior
        RainbowSDK.mockImplementation(() => ({
            start: jest.fn().mockResolvedValue("Started"),
            stop: jest.fn().mockResolvedValue("Stopped"),
            events: {
                on: jest.fn((event, callback) => {
                    if (event === "rainbow_onready") setTimeout(() => callback(), 10);
                    if (event === "rainbow_onconnectionerror") setTimeout(() => callback(new Error("Connection error")), 10);
                    if (event === "rainbow_onstopped") setTimeout(() => callback(), 10);
                }),
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

        // Initialize the class (Mocking real connection)
        rainbowInstance = new Rainbow("test@example.com", "password", "appId", "appSecret");
        mockSdk = rainbowInstance.sdk;
    });

    it("should start SDK successfully (Mocked)", async () => {
        await expect(rainbowInstance.testConnection()).resolves.toBe("SDK started successfully!");
        expect(mockSdk.start).toHaveBeenCalledTimes(1);
    });

    it("should handle SDK connection error (Mocked)", async () => {
        mockSdk.start.mockRejectedValueOnce(new Error("Connection failed"));
        await expect(rainbowInstance.testConnection()).rejects.toThrow("Connection failed");
    });

    it("should send message to bubble successfully (Mocked)", async () => {
        await rainbowInstance.sendMessageToBubble("bubbleJid", "Hello World");
        expect(mockSdk.im.sendMessageToBubbleJid).toHaveBeenCalledWith("Hello World", "bubbleJid");
    });

    it("should handle error while sending message (Mocked)", async () => {
        mockSdk.im.sendMessageToBubbleJid.mockRejectedValueOnce(new Error("Send failed"));
        await expect(rainbowInstance.sendMessageToBubble("bubbleJid", "Hello World")).resolves.toBeUndefined();
    });

    it("should retrieve bubbles correctly (Mocked)", async () => {
        const bubbles = await rainbowInstance.getAllBubbles();
        expect(bubbles).toEqual([
            { jid: "bubble1", name: "TestBubble", avatar: "url", topic: "Testing" },
        ]);
    });

    it("should handle error while retrieving bubbles (Mocked)", async () => {
        mockSdk.bubbles.getAllBubbles.mockRejectedValueOnce(new Error("Retrieval error"));
        await expect(rainbowInstance.getAllBubbles()).resolves.toBeUndefined();
    });

    it("should stop SDK successfully (Mocked)", async () => {
        await expect(rainbowInstance.stop()).resolves.toBe("SDK stopped successfully");
        expect(mockSdk.stop).toHaveBeenCalledTimes(1);
    });

    it("should handle error while stopping SDK (Mocked)", async () => {
        mockSdk.stop.mockRejectedValueOnce(new Error("Stop failed"));
        await expect(rainbowInstance.stop()).rejects.toThrow("Error while stopping");
    });
});
