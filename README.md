# Spreedly API Client

```javascript
import Client from 'spreedly';

const client = new Client(environment, token);

const { token } = await client.createCreditCard(email, {
    fullName,
    number,
    month,
    year,
    verificationValue,
}, { userId: '1' });

await client.retainCreditCard(token);
```