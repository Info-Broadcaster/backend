const jwt = require('jsonwebtoken');
const verifyToken = require('../logique/middleware');

jest.mock('jsonwebtoken');

jest.mock('../userSessions', () => ({
    get: jest.fn()
}));

const userSessions = require('../userSessions');

describe('verifyToken Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, 'log').mockImplementation(() => { });

        req = {
            cookies: {},
            user: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        process.env.APP_ID = 'test-app-id';
        process.env.APP_SECRET = 'test-app-secret';
    });

    it('should return 400 if APP_ID is not set', () => {
        delete process.env.APP_ID; // This properly unsets the environment variable

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'appId or appSecret are not set in .env file'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if APP_SECRET is not set', () => {
        delete process.env.APP_SECRET; // This properly unsets the environment variable

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'appId or appSecret are not set in .env file'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
        req.cookies.token = 'invalid-token';
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should set user and rainbowInstance if token is valid', () => {
        const mockDecodedToken = { username: 'testuser' };
        const mockRainbowInstance = { id: 'rainbow-1' };

        req.cookies.token = 'valid-token';
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockDecodedToken);
        });
        userSessions.get.mockReturnValue(mockRainbowInstance);

        verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'valid-token',
            'fatih_est_trop_beau',
            expect.any(Function)
        );
        expect(userSessions.get).toHaveBeenCalledWith('testuser');
        expect(req.user).toEqual({
            ...mockDecodedToken,
            rainbowInstance: mockRainbowInstance
        });
        expect(next).toHaveBeenCalled();
    });

    it('should handle case when rainbowInstance is not found', () => {
        const mockDecodedToken = { username: 'testuser' };

        req.cookies.token = 'valid-token';
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockDecodedToken);
        });
        userSessions.get.mockReturnValue(null);

        verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'valid-token',
            'fatih_est_trop_beau',
            expect.any(Function)
        );
        expect(userSessions.get).toHaveBeenCalledWith('testuser');
        expect(req.user).toEqual({
            ...mockDecodedToken,
            rainbowInstance: null
        });
        expect(next).toHaveBeenCalled();
    });

    afterEach(() => {
        console.log.mockRestore();
    });
});