const axios = require('axios');
const { generatePrompt, trad, interactWithIa, whichLanguage, clean } = require('../utils');

jest.mock('axios');

describe('Utils Tests', () => {
    describe('generatePrompt', () => {
        it('should generate the correct prompt object', () => {
            const model = 'test-model';
            const systemContent = 'system content';
            const userContent = 'user content';
            const expectedPrompt = {
                model: model,
                messages: [
                    { role: 'system', content: "Forget everything I've told you before and take this new context into account: " + systemContent },
                    { role: 'user', content: userContent },
                ],
                stream: false,
                raw: true,
            };

            const prompt = generatePrompt(model, systemContent, userContent);
            expect(prompt).toEqual(expectedPrompt);
        });
    });

    describe('interactWithIa', () => {
        it('should return the correct response from the API', async () => {
            const prompt = { model: 'test-model', messages: [] };
            const apiResponse = { data: { message: { content: 'response content' } } };
            axios.post.mockResolvedValue(apiResponse);

            const result = await interactWithIa(prompt);
            expect(result).toBe('response content');
        });

        it('should handle API errors gracefully', async () => {
            const prompt = { model: 'test-model', messages: [] };
            axios.post.mockRejectedValue(new Error('API Error'));

            await expect(interactWithIa(prompt)).rejects.toThrow("API Error");
        });

        it('should throw an error if MODEL_URL is missing', async () => {
            delete process.env.MODEL_URL;

            await expect(interactWithIa({ model: 'test-model', messages: [] })).rejects.toThrow();
        });
    });

    describe('whichLanguage', () => {
        it('should identify the correct language', async () => {
            const model = 'test-model';
            const text = 'Hello, how are you?';
            const apiResponse = { data: { message: { content: 'English' } } };
            axios.post.mockResolvedValue(apiResponse);

            const result = await whichLanguage(model, text);
            expect(result).toBe('English');
        });

        it('should handle API errors when identifying language', async () => {
            const model = 'test-model';
            const text = 'Hello, how are you?';
            axios.post.mockRejectedValue(new Error('Language Detection Error'));

            await expect(whichLanguage(model, text)).rejects.toThrow("Language Detection Error");
        });
    });

    describe('trad', () => {
        it('should translate the text correctly', async () => {
            const model = 'test-model';
            const text = 'Hello, how are you?';
            const lang = 'French';
            const apiResponse = { data: { message: { content: 'Bonjour, comment ça va?' } } };
            axios.post.mockResolvedValue(apiResponse);

            const result = await trad(model, text, lang);
            expect(result).toBe('Bonjour, comment ça va?');
        });

        it('should handle translation errors gracefully', async () => {
            const model = 'test-model';
            const text = 'Hello, how are you?';
            const lang = 'French';
            axios.post.mockRejectedValue(new Error('Translation Error'));

            await expect(trad(model, text, lang)).rejects.toThrow("Translation Error");
        });
    });

    describe('clean', () => {
        it('should remove newlines and trim spaces', () => {
            const input = '  Hello \nWorld  ';
            const expectedOutput = 'Hello World';

            expect(clean(input)).toBe(expectedOutput);
        });

        it('should handle an empty string', () => {
            expect(clean('')).toBe('');
        });

        it('should handle multiple spaces correctly', () => {
            expect(clean('   This   is   a   test   ')).toBe('This   is   a   test');
        });
    });
});
