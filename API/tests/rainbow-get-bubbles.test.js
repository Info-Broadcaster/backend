const request = require('supertest');
const express = require('express');
const assert = require('assert');
const Rainbow = require('../logique/rainbow/rainbowInteraction');
const router = require('../routes/rainbow-get-bubbles');

jest.mock('../logique/rainbow/rainbowInteraction');

const app = express();
app.use(express.json());

// Create a mock Rainbow instance
const mockRainbowInstance = {
    getAllBubbles: jest.fn()
};

// Update middleware to include rainbowInstance
app.use((req, res, next) => {
    req.user = {
        username: 'testuser',
        password: 'testpass',
        rainbowInstance: mockRainbowInstance
    };
    next();
});

app.use('/api/rainbowGetBubbles', router);

describe('Rainbow Get Bubbles API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRainbowInstance.getAllBubbles.mockReset();
    });

    it('should return bubbles on success', async () => {
        const mockBubbles = [{ id: 1, name: 'Bubble1' }, { id: 2, name: 'Bubble2' }];
        mockRainbowInstance.getAllBubbles.mockResolvedValue(mockBubbles);

        const response = await request(app).get('/api/rainbowGetBubbles');

        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(response.body, mockBubbles);
    });

    it('should return an error on failure', async () => {
        const mockError = new Error('Failed to get bubbles');
        mockRainbowInstance.getAllBubbles.mockRejectedValue(mockError);

        const response = await request(app).get('/api/rainbowGetBubbles');

        assert.strictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, { error: mockError.message });
    });
});