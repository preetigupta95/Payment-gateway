## Plaid documentation
## Install

```console
$ npm install plaid
```
## Getting started

The module supports all Plaid API endpoints. For complete information about the API, head
to the [docs][2].

Most endpoints require a valid `client_id` and `secret` as authentication. Attach them via the configuration.

```typescript
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': CLIENT_ID,
      'PLAID-SECRET': SECRET,
    },
  },
});
```

The `PlaidEnvironments` parameter dictates which Plaid API environment you will access. Values are:

- `PlaidEnvironments.production` - production use, creates `Item`s on https://production.plaid.com
- `PlaidEnvironments.development` - use for integration development and testing, creates `Item`s on https://development.plaid.com
- `PlaidEnvironments.sandbox` - quickly build out your integration with stateful test data, creates `Item`s on https://sandbox.plaid.com

The `baseOptions` field allows for clients to override the default options used to make requests. e.g.

```typescript
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    // Axios request options
  },
});
```

## Error Handling

All errors can now be caught using `try/catch` with `async/await` or through promise chaining.

```typescript
try {
  await plaidClient.transactionsSync(request);
} catch (error) {
  const err = error.response.data;
}

// or

plaidClient
  .transactionsSync(request)
  .then((data) => {
    console.log(data);
  })
  .catch((e) => {
    console.log(e.response.data);
  });
```
## Create Link Token (for Payment Initiation only)

```js
const response = await plaidClient.linkTokenCreate({
  user: {
    client_user_id: '123-test-user-id',
  },
  client_name: 'Plaid Test App',
  products: ['payment_initiation'],
  country_codes: ['GB'],
  language: 'en',
  payment_initiation: {
    payment_id: 'some_payment_id',
  },
});
console.log(response.data.link_token);
```
## Create Processor Token
```js
const request: ItemPublicTokenExchangeRequest = {
  public_token: publicToken,
};
try {
  const response = await plaidClient.itemPublicTokenExchange(request);
  const accessToken = response.data.access_token;
  const itemId = response.data.item_id;
} catch (err) {
  // handle error
}
```