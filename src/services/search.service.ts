import { ISearchItem } from '../models/search-item';

class SearchService {
    private apiBase: string;

    constructor(apiBaseUrl: string) {
        this.apiBase = apiBaseUrl;
    }

    static handleErrorResponse(response: Response): Promise<string> {
        switch (response.status) {
            case 404:
                return Promise.reject(
                    '[API] 404: The server can not find the requested resource.'
                );
            case 500:
                return Promise.reject(
                    '[API] 500: The server met an unexpected condition.'
                );
            default:
                return Promise.reject(
                    `[API] ${response.status}: ${response.statusText}`
                );
        }
    }

    async fetchAllItems(): Promise<ISearchItem[]> {
        const url = new URL(`${this.apiBase}`);

        const response = await fetch(url.toString(), {
            method: 'GET'
        });

        return response && response.ok
            ? response.json()
            : SearchService.handleErrorResponse(response);
    }
}

export default new SearchService('https://jsonplaceholder.typicode.com/users');
