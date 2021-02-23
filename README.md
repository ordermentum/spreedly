# Spreedly API Client

Simple typescript/javascript client for the spreedly API

```javascript
import Client from 'spreedly';

const client = new Client(environment, token);

const GATEWAY_ID = '123';

const { token } = await client.createCreditCard(email, {
    fullName,
    number,
    month,
    year,
    verificationValue,
}, { userId: '1' });

await client.retainCreditCard(token);
await client.purchase(GATEWAY_ID, { amount: 100, currencyCode: 'USD', paymentMethodToken: token });
```
