import { ISearchItem } from '../models/search-item';
import to from 'await-to-js';
import { ISearchResponse } from '../models/search-response';

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

        return new Promise<ISearchItem[]>(async (resolve, reject) => {
            if (response && response.ok) {
                const [error, responseBody] = await to<ISearchResponse[]>(
                    response.json()
                );

                if (responseBody) {
                    resolve(
                        responseBody.map((item, index) => {
                            return {
                                accountNo: item['Account No'],
                                transactionDate: new Date(item['Date']),
                                transactionDetails: item['Transaction Details'],
                                valueDate: new Date(item['Value Date']),
                                withdrawAmount: Number(
                                    item['Withdrawal AMT'].replace(/,/g, '')
                                ),
                                depositAmount: Number(
                                    item['Deposit AMT'].replace(/,/g, '')
                                ),
                                balanceAmount: Number(
                                    item['Balance AMT'].replace(/,/g, '')
                                )
                            };
                        })
                    );
                } else {
                    reject(error);
                }
            } else {
                reject(SearchService.handleErrorResponse(response));
            }
        });
    }
}

// export default new SearchService('http://localhost:3000/bankAccount.json');
export default new SearchService('http://starlord.hackerearth.com/bankAccount');
