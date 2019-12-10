"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.ClientOptionsDefaults = {
    endpoint: 'https://core.spreedly.com',
    version: 1,
};
class Client {
    constructor(environment, secret, options = {}) {
        this.environment = environment;
        this.secret = secret;
        this.options = Object.assign({}, exports.ClientOptionsDefaults, options);
        this.baseUrl = `${this.options.endpoint}/v${this.options.version}/`;
        this.httpClient = axios_1.default.create({
            baseURL: this.baseUrl,
            auth: {
                username: this.environment,
                password: this.secret,
            }
        });
    }
    createCreditCard(email, card, meta) {
        return this.httpClient.post('payment_methods.json', { email, metadata: meta, payment_method: { credit_card: card } });
    }
    retainCreditCard(token) {
        return this.httpClient.put(`payment_methods/${token}/retain.json`);
    }
}
exports.default = Client;
