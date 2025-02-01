const summarize = require('../../logique/summarize');
const { interactWithIa, trad, whichLanguage, clean } = require("../../utils");
const Rainbow = require("../../logique/rainbow/rainbowInteraction");

jest.mock('../../utils', () => ({
    generatePrompt: jest.fn((model, prompt, text) => `${prompt} ${text}`),
    interactWithIa: jest.fn(),
    trad: jest.fn(),
    whichLanguage: jest.fn(),
    clean: jest.fn(text => text)
}));

jest.mock('../../logique/rainbow/rainbowInteraction', () => ({
    instance: {
        getAllBubbles: jest.fn()
    }
}));

describe('summarize', () => {
    const mockContent = "This is a test content";

    beforeEach(() => {
        jest.clearAllMocks();

        clean.mockImplementation(text => text);
        interactWithIa.mockImplementation(text => text);
    });

    it('should handle French language summarization without translation', async () => {
        const lang = "fr";
        const mockBubbles = [{ topic: "Technology" }, { topic: "Health" }];

        interactWithIa
            .mockResolvedValueOnce("cleaned content") // Cleaned content
            .mockResolvedValueOnce("summary") // Summary
            .mockResolvedValueOnce("Test Title") // Title
            .mockResolvedValueOnce("tech, health") // Themes
            .mockResolvedValueOnce("Technology") // Suggested theme
            .mockResolvedValueOnce("Hook phrase"); // Hook phrase

        whichLanguage.mockResolvedValue("French");
        Rainbow.instance.getAllBubbles.mockResolvedValue(mockBubbles);

        const result = await summarize(mockContent, lang);

        expect(result).toEqual({
            summarized: "summary",
            title: "Test Title",
            themes: "tech, health",
            suggestThemeFromTopicsInBubbles: "Technology",
            hookphrase: "Hook phrase"
        });

        expect(interactWithIa).toHaveBeenCalledTimes(6);
        expect(whichLanguage).toHaveBeenCalledTimes(1);
        expect(trad).not.toHaveBeenCalled();
    });

    it('should handle English language summarization with translation', async () => {
        const lang = "en";
        const mockBubbles = [{ topic: "Technology" }];

        // Mock responses
        interactWithIa
            .mockResolvedValueOnce("cleaned content")
            .mockResolvedValueOnce("résumé") // French summary
            .mockResolvedValueOnce("Titre") // French title
            .mockResolvedValueOnce("thèmes")
            .mockResolvedValueOnce("Technologie")
            .mockResolvedValueOnce("Phrase d'accroche");

        whichLanguage.mockResolvedValue("French");
        Rainbow.instance.getAllBubbles.mockResolvedValue(mockBubbles);

        trad
            .mockResolvedValueOnce("summary")
            .mockResolvedValueOnce("title")
            .mockResolvedValueOnce("hook phrase");

        const result = await summarize(mockContent, lang);

        expect(result).toEqual({
            summarized: "summary",
            title: "title",
            themes: "thèmes",
            suggestThemeFromTopicsInBubbles: "Technologie",
            hookphrase: "hook phrase"
        });

        expect(interactWithIa).toHaveBeenCalledTimes(6);
        expect(whichLanguage).toHaveBeenCalledTimes(1);
        expect(trad).toHaveBeenCalledTimes(3);
    });

    it('should handle empty bubble topics', async () => {
        const lang = "en";
        Rainbow.instance.getAllBubbles.mockResolvedValue([]);

        interactWithIa
            .mockResolvedValueOnce("cleaned content")
            .mockResolvedValueOnce("summary")
            .mockResolvedValueOnce("title")
            .mockResolvedValueOnce("themes")
            .mockResolvedValueOnce("")
            .mockResolvedValueOnce("hook phrase");

        whichLanguage.mockResolvedValue("English");

        const result = await summarize(mockContent, lang);

        expect(result.suggestThemeFromTopicsInBubbles).toBe("");
        expect(Rainbow.instance.getAllBubbles).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid language input', async () => {
        const lang = "invalid";
        const mockBubbles = [{ topic: "Technology" }];

        interactWithIa
            .mockResolvedValueOnce("cleaned content")
            .mockResolvedValueOnce("summary")
            .mockResolvedValueOnce("title")
            .mockResolvedValueOnce("themes")
            .mockResolvedValueOnce("Technology")
            .mockResolvedValueOnce("hook phrase");

        whichLanguage.mockResolvedValue("English");
        Rainbow.instance.getAllBubbles.mockResolvedValue(mockBubbles);

        const result = await summarize(mockContent, lang);
        expect(result).toBeDefined();

        expect(interactWithIa).toHaveBeenCalledTimes(6);
        expect(whichLanguage).toHaveBeenCalledTimes(1);
    });

    it('should handle errors in API calls', async () => {
        const lang = "en";
        const error = new Error('API Error');
        interactWithIa.mockRejectedValue(error);

        await expect(summarize(mockContent, lang)).rejects.toThrow('API Error');
    });
});