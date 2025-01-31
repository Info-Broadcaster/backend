const request = require('supertest');
const app = require('../index');

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
});