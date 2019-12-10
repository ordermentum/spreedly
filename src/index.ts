import axios, { AxiosInstance } from 'axios';


export type ClientOptions = {
    endpoint?: string;
    version?: number;
}

export type Options = {
    endpoint: string;
    version: number;
}

export const ClientOptionsDefaults = {
    endpoint: 'https://core.spreedly.com',
    version: 1,
};

export type CreditCard  = {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    verificationValue: string;
    trackData: any;
    cardType: string;
};

export default class Client {
    environment: string;
    secret: string;
    options: Options;
    baseUrl: string;
    httpClient: AxiosInstance;

    constructor(environment: string, secret: string, options: ClientOptions = {}) {
        this.environment = environment;
        this.secret = secret;
        this.options = Object.assign({}, ClientOptionsDefaults, options);
        this.baseUrl = `${this.options.endpoint}/v/${this.options.version}`;

        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            auth: {
                username: this.environment,
                password: this.secret,
            }
        });
    }

    createCreditCard(card: CreditCard) {
        return this.httpClient.post('payment_methods.json', card)
    }
}