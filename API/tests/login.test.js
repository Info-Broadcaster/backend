const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const RainbowInteraction = require('../logique/rainbow/rainbowInteraction');
const loginRouter = require('../routes/login');

jest.mock('../logique/rainbow/rainbowInteraction');

const app = express();
app.use(express.json());
app.use('/login', loginRouter);

describe('POST /login', () => {
    beforeEach(() => {
        RainbowInteraction.mockClear();
    });

    it('should return 400 if username or password is missing', async () => {
        const res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Missing username or password!' });
    });

    it('should return 401 if credentials are incorrect', async () => {
        RainbowInteraction.prototype.testConnection.mockRejectedValue(new Error('Incorrect credentials!'));

        const res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                username: 'wronguser',
                password: 'wrongpass'
            });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: 'Incorrect credentials!' });
    });

    it('should return 200 and a token if credentials are correct', async () => {
        RainbowInteraction.prototype.testConnection.mockResolvedValue('SDK started successfully!');

        const res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({
                username: 'correctuser',
                password: 'correctpass'
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');

        const decoded = jwt.verify(res.body.token, 'fatih_est_trop_beau');
        expect(decoded).toMatchObject({
            username: 'correctuser',
            password: 'correctpass'
        });
    });
});