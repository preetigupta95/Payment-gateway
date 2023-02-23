## Stripe Documentation

See the [`stripe-node` API docs](https://stripe.com/docs/api?lang=node) for Node.js.
## Requirements

Node 12 or higher.

## Installation

Install the package with:

```sh
npm install stripe --save
# or
yarn add stripe
```

## Usage

The package needs to be configured with your account's secret key, which is
available in the [Stripe Dashboard](https://dashboard.stripe.com/login). Require it with the key's
value:

<!-- prettier-ignore -->
```js
const stripe = require('stripe')('sk_test_...');

stripe.customers.create({
  email: 'customer@example.com',
})
  .then(customer => console.log(customer.id))
  .catch(error => console.error(error));
```

Or using ES modules and `async`/`await`:

```js
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...');

const customer = await stripe.customers.create({
  email: 'customer@example.com',
});

console.log(customer.id);
```

### Usage with TypeScript

As of 8.0.1, Stripe maintains types for the latest [API version](https://stripe.com/docs/api/versioning).

Import Stripe as a default import (not `* as Stripe`, unlike the DefinitelyTyped version)
and instantiate it as `new Stripe()` with the latest API version.

```ts
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...', {
  apiVersion: '2022-11-15',
});

const createCustomer = async () => {
  const params: Stripe.CustomerCreateParams = {
    description: 'test customer',
  };

  const customer: Stripe.Customer = await stripe.customers.create(params);

  console.log(customer.id);
};
createCustomer();
```
#### Create Product

You can use `stripe.products.create` to create product:

```js
const stripe = require('stripe')('sk_test_...');

const product = await stripe.products.create({
  name: 'Gold Special',
});
```
#### Create Price

You can use `stripe.prices.create` to create price:

```js
const stripe = require('stripe')('sk_test_...');

const price = await stripe.prices.create({
  unit_amount: 100,
  currency: 'usd',
  recurring: {interval: 'month'},
  product: 'prod_id_...',
});
```
#### Create Coupon

You can use `stripe.coupons.create` to create coupon:

```js
const stripe = require('stripe')('sk_test_...');

const coupon = await stripe.coupons.create({
  percent_off: 25.5,
  duration: 'repeating',
  duration_in_months: 3,
});
```
#### Create Card

You can use `stripe.customers.createSource` to create card:

```js
const stripe = require('stripe')('sk_test_...');

const card = await stripe.customers.createSource(
  'cus_id_...',
  {source: 'tok_visa'}
);
```
#### Webhook

Endpoints:

```js
POST 
/v1/webhook_endpoints
   GET 
/v1/webhook_endpoints/:id
  POST 
/v1/webhook_endpoints/:id
   GET 
/v1/webhook_endpoints
DELETE 
/v1/webhook_endpoints/:id
```

