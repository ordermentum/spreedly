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
    fullName?: string;
    firstName: string;
    lastName: string;
    number: string;
    verificationValue: string;
    month: string;
    year: string;
};

export type Meta = { [key: string]: any };

export type CreditCardRequest = {
    email: string;
    creditCard: CreditCard;
    metadata: Meta;
    retained?: Boolean;
    allowBlankName?: Boolean;
    allowExpiredDate?: Boolean;
    allowBlankDate?: Boolean;
    eligibleForCardUpdater?: Boolean;
}

export type UpdateCreditCardRequest = {
    metadata?: Meta;
}

const snake = (string) => string.replace(/[\w]([A-Z])/g, (m) => {
    return m[0] + "_" + m[1];
}).toLowerCase();

const snakeObject = (data) => {
    const params = {};
    for (const key in data) {
    params[snake(key)] = data[key];
    }
    return params;
}

const buildCreditCardRequest = (request: CreditCardRequest) => {
    const { creditCard, ...restParams } = request;
    return { payment_method: { credit_card: snakeObject(creditCard), ...snakeObject(restParams) } };
}

type Logger = {
    info(error: any, ...params: any[]): void;
    log(error: any, ...params: any[]): void;
    trace(error: any, ...params: any[]): void;
    error(error: any, ...params: any[]): void;
    debug(error: any, ...params: any[]): void;
};

const NullLogger: Logger = {
    info() {},
    log() {},
    trace() {},
    error() {},
    debug() {},
};

export type GatewayRequest = {
    gatewayType:  string;
    login: string;
    versionOverride?: string; 
}

export type StoreGatewayRequest = {
    paymentMethodToken: string;
}

export type PurchaseRequest = {
    paymentMethodToken: string;
    amount: number;
    currencyCode: 'AUD' | 'USD' | 'EUR';
}

const buildGatewayRequest = (request: GatewayRequest) => {
    return { gateway: { ... snakeObject(request) } };
}

const buildPurchaseRequest = (request: PurchaseRequest) => {
    return { transaction: { ...snakeObject(request) } };
}

const buildStoreRequest = (request: StoreGatewayRequest) => {
    return { transaction: { ...snakeObject(request) } };
}

const buildUpdateCreditCardRequest = (request: UpdateCreditCardRequest) => {
    return { payment_method: { ...snakeObject(request) } }
}


export default class Client {
    environment: string;
    secret: string;
    options: Options;
    baseUrl: string;
    logger: Logger;
    httpClient: AxiosInstance;

    constructor(environment: string, secret: string, options: ClientOptions = {}, logger = NullLogger) {
      this.environment = environment;
      this.secret = secret;
      this.options = Object.assign({}, ClientOptionsDefaults, options);
      this.baseUrl = `${this.options.endpoint}/v${this.options.version}/`;
      this.logger = logger;

      this.httpClient = axios.create({
          baseURL: this.baseUrl,
          auth: {
              username: this.environment,
              password: this.secret,
          }
      });
    }

    createCreditCard(request: CreditCardRequest) {
      this.logger.trace('making credit card create request');
      const params = buildCreditCardRequest(request);
      return this.httpClient.post('payment_methods.json', params);
    }

    createGateway(request: GatewayRequest) {
      const params = buildGatewayRequest(request);
      return this.httpClient.post('gateways.json', params);
    }

    storeGateway(id: string, request: StoreGatewayRequest) {
        return this.httpClient.post(`gateways/${id}/store.json`, buildStoreRequest(request));
    }

    purchase(id: string, request: PurchaseRequest) {
        const params = buildPurchaseRequest(request);
        return this.httpClient.post(`gateways/${id}/purchase.json`, params);
    }

    retainCreditCard(token: string) {
      this.logger.trace('making credit card retain request');
      return this.httpClient.put(`payment_methods/${token}/retain.json`);
    }

    updateCreditCard(token: string, request: UpdateCreditCardRequest) {
        this.logger.trace('making credit card update request');
        const params = buildUpdateCreditCardRequest(request);
        return this.httpClient.put(`payment_methods/${token}.json`, params);
    }

    getCreditCard(token: string) {
        this.logger.trace('getting credit card');
        return this.httpClient.get(`payment_methods/${token}.json`)
    }
}