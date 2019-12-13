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

    retainCreditCard(token: string) {
      this.logger.trace('making credit card retain request');
      return this.httpClient.put(`payment_methods/${token}/retain.json`);
    }
}