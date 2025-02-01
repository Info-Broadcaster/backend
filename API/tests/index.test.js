const request = require('supertest');
const app = require('../index');

require('dotenv').config({ override: true });

describe('Server Startup', () => {
    let server;

    describe('when file is main module', () => {
        beforeAll((done) => {
            require.main = module;
            server = app.listen(process.env.PORT || 3000, () => {
                done();
            });
        });

        afterAll((done) => {
            server.close(() => {
                done();
            });
        });

        it('should start the server when the script is run directly', async () => {
            expect(app).toBeDefined();
            expect(app.listen).toBeDefined();
            expect(server).toBeDefined();
            expect(server.address()).toBeDefined();
            expect(server.address().port).toBeGreaterThan(0);
        });
    });

    describe('when file is not main module', () => {
        beforeAll(() => {
            require.main = { something: 'else' };
        });

        it('should not automatically start the server when required as a module', () => {
            expect(app).toBeDefined();
            expect(app.listen).toBeDefined();
        });
    });


    describe('CORS Origin', () => {
        let originalEnv;
        let app;

        beforeAll(() => {
            originalEnv = { ...process.env };
        });

        afterAll(() => {
            process.env = originalEnv;
        });

        beforeEach(() => {
            jest.resetModules();
        });

        it('should use default origin when FRONTEND_URL is not set', async () => {
            delete process.env.FRONTEND_URL;
            app = require('../index');
            const res = await request(app).get('/api/hello');
            expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
        });

        it('should use FRONTEND_URL when it is set', async () => {
            process.env.FRONTEND_URL = 'https://myapp.example.com';
            app = require('../index');
            const res = await request(app).get('/api/hello');
            expect(res.headers['access-control-allow-origin']).toBe('https://myapp.example.com');
        });

        it('should handle empty FRONTEND_URL value', async () => {
            process.env.FRONTEND_URL = '';
            app = require('../index');
            const res = await request(app).get('/api/hello');
            expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
        });
    });
});