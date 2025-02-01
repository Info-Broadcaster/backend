const { getLinkTracker, getTrackerDataFromLinkly } = require('../../logique/link-tracker');

global.fetch = jest.fn();

process.env.LINKLY_API_KEY = 'test-api-key';
process.env.WORKSPACE_ID = 'test-workspace-id';

describe('getLinkTracker function', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('should create a link tracker successfully', async () => {
        const mockResponse = {
            full_url: 'https://linkly.com/abc123'
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponse)
            })
        );

        const result = await getLinkTracker('https://example.com');
        expect(fetch).toHaveBeenCalledWith(
            'https://app.linklyhq.com/api/v1/link?api_key=test-api-key',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: 'https://example.com',
                    workspace_id: 'test-workspace-id'
                })
            }
        );

        expect(result).toBe('https://linkly.com/abc123');
    });

    it('should handle API errors properly', async () => {
        const errorMessage = 'API Error';

        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error(errorMessage))
        );

        await expect(getLinkTracker('https://example.com'))
            .rejects
            .toThrow(errorMessage);
    });

    it('should handle malformed API responses', async () => { // TRES IMPORTANT, ça arrive souvent dans certains cas
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({})
            })
        );

        const result = await getLinkTracker('https://example.com');
        expect(result).toBeUndefined();
    });
});

describe('getTrackerDataFromLinkly function', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('should fetch and simplify link data successfully', async () => {
        const mockApiResponse = {
            links: [
                {
                    id: '1',
                    clicks_total: 100,
                    url: 'https://example.com',
                    full_url: 'https://linkly.com/abc',
                    other_field: 'ignored'
                }
            ]
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockApiResponse)
            })
        );

        const result = await getTrackerDataFromLinkly();

        expect(fetch).toHaveBeenCalledWith(
            'https://app.linklyhq.com/api/v1/workspace/test-workspace-id/list_links?api_key=test-api-key',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        expect(result).toEqual([
            {
                id: '1',
                clicks_total: 100,
                url: 'https://example.com',
                full_url: 'https://linkly.com/abc'
            }
        ]);
    });

    it('should handle API errors properly', async () => {
        const errorMessage = 'API Error';

        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error(errorMessage))
        );

        await expect(getTrackerDataFromLinkly())
            .rejects
            .toThrow(errorMessage);
    });

    it('should handle empty response properly', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ links: [] })
            })
        );

        const result = await getTrackerDataFromLinkly();
        expect(result).toEqual([]);
    });
});