const request = require("supertest");
const express = require("express");
const router = require("../../routes/rainbow-send-message-to-bubbles");
const { getLinkTracker } = require("../../logique/link-tracker");

jest.mock("../../logique/rainbow/rainbowInteraction");
jest.mock("../../logique/link-tracker");

const app = express();
app.use(express.json());

const user = {
    rainbowInstance: {
        sendMessageToBubble: jest.fn()
    }
};

app.use((req, res, next) => {
    req.user = user;
    next();
});

app.use("/send-message", router);

describe("POST /send-message", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getLinkTracker.mockReset();
        user.rainbowInstance.sendMessageToBubble.mockReset();
    });

    it("should return 400 if bubbles, message, title or link are missing", async () => {
        const response = await request(app).post("/send-message").send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("bubbles, message, title and link are required.");
    });

    it("should return 400 if bubbles array is empty", async () => {
        getLinkTracker.mockResolvedValue("http://tracked-link.com");
        const response = await request(app).post("/send-message").send({
            bubbles: [],
            message: "Test message",
            title: "Test title",
            link: "http://example.com"
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("bubbles, message, title and link are required.");
    });

    it("should return 500 if there is an error sending the message", async () => {
        getLinkTracker.mockResolvedValue("http://tracked-link.com");
        user.rainbowInstance.sendMessageToBubble.mockRejectedValue(new Error("Send message error"));

        const response = await request(app).post("/send-message").send({
            bubbles: ["bubble1"],
            message: "Test message",
            title: "Test title",
            link: "http://example.com"
        });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Send message error");
    });

    it("should return 200 if the message is sent successfully", async () => {
        getLinkTracker.mockResolvedValue("http://tracked-link.com");
        user.rainbowInstance.sendMessageToBubble.mockResolvedValue();

        const response = await request(app).post("/send-message").send({
            bubbles: ["bubble1"],
            message: "Test message",
            title: "Test title",
            link: "http://example.com"
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Message sent successfully!.");
    });
});