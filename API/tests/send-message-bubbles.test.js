const request = require('supertest');
const express = require('express');
const assert = require('assert');
const Rainbow = require('../logique/rainbow/rainbowInteraction');
const router = require('../routes/rainbow-send-message-to-bubbles');

jest.mock('../logique/rainbow/rainbowInteraction');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { username: 'testuser', password: 'testpass' };
    next();
});
app.use('/api/rainbowSendMessageToBubbles', router);

describe('Rainbow Send Message to Bubbles API', () => {
    beforeEach(() => {
        Rainbow.mockClear();
    });

    it('should send message successfully', async () => {
        Rainbow.prototype.sendMessageToBubble.mockResolvedValue();

        const response = await request(app)
            .post('/api/rainbowSendMessageToBubbles')
            .send({ bubbles: ['bubble1'], message: 'Hello' });

        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(response.body, { success: true, message: 'Message sent successfully!.' });
    });

    it('should return 400 if bubbles or message are missing', async () => {
        const response = await request(app)
            .post('/api/rainbowSendMessageToBubbles')
            .send({ bubbles: [], message: '' });

        assert.strictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, { error: 'bubbles and message are required.' });
    });

    it('should return 500 if there is an error during message sending', async () => {
        const mockError = new Error('Failed to send message');
        Rainbow.prototype.sendMessageToBubble.mockRejectedValue(mockError);

        const response = await request(app)
            .post('/api/rainbowSendMessageToBubbles')
            .send({ bubbles: ['bubble1'], message: 'Hello' });

        assert.strictEqual(response.status, 500);
        assert.deepStrictEqual(response.body, { error: mockError.message });
    });
});