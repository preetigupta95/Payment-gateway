## Dwolla Documentation

This repository contains the source code for Dwolla's Node-based SDK, which allows developers to interact with Dwolla's [server-side API](https://developers.dwolla.com/api-reference) via a JavaScript API, with automatic OAuth token management included. Any action that can be performed via an HTTP request can be made using this SDK when executed within a server-side environment.

### Installation
To begin using this SDK, you will first need to download and install it on your machine. We use [npm](https://www.npmjs.com/package/dwolla-v2) to distribute this package.

```shell
# npm
$ npm install --save dwolla-v2

# yarn
$ yarn add dwolla-v2
```

### Initialization
Before any API requests can be made, you must first determine which environment you will be using, as well as fetch the application key and secret. To fetch your application key and secret, please visit one of the following links:

* Production: https://dashboard.dwolla.com/applications
* Sandbox: https://dashboard-sandbox.dwolla.com/applications

initially, you can create an instance of `Client` with `key` and `secret` replaced with the application key and secret that you fetched from one of the aforementioned links, respectively.

```javascript
const Client = require("dwolla-v2").Client;

const dwolla = new Client({
    environment: "sandbox", // Defaults to "production"
    key: process.env.DWOLLA_APP_KEY,
    secret: process.env.DWOLLA_APP_SECRET
})
```
#### Create Customer (RECEIVE-ONLY USER)

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  firstName: "Jane",
  lastName: "Merchant",
  email: "jmerchant@nomail.net",
  type: "receive-only",
  businessName: "Jane Corp llc",
  ipAddress: "99.99.99.99",
};

dwolla
  .post("customers", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/fc451a7a-ae30-4404-aB95-e3553fcd733f'
```
#### Create Customer (UNVERIFIED CUSTOMER)

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  firstName: "Jane",
  lastName: "Merchant",
  email: "jmerchant@nomail.net",
  ipAddress: "99.99.99.99",
};

dwolla
  .post("customers", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/fc451a7a-ae30-4404-aB95-e3553fcd733f'
```
#### Create Customer (VERIFIED PERSONAL CUSTOMER)

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  firstName: "John",
  lastName: "Doe",
  email: "jdoe@nomail.net",
  type: "personal",
  address1: "99-99 33rd St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  dateOfBirth: "1970-01-01",
  // For the first attempt, only the
  // last 4 digits of SSN required
  // If the entire SSN is provided,
  // it will still be accepted
  ssn: "1234",
};

dwolla
  .post("customers", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/fc451a7a-ae30-4404-aB95-e3553fcd733f'
```
#### Create Customer (VERIFIED BUSINESS CUSTOMER (SOLE PROPRIETORSHIP ONLY))

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  firstName: "Business",
  lastName: "Owner",
  email: "solePropBusiness@email.com",
  ipAddress: "143.156.7.8",
  type: "business",
  dateOfBirth: "1980-01-31",
  ssn: "6789",
  address1: "99-99 33rd St",
  city: "Some City",
  state: "NY",
  postalCode: "11101",
  businessClassification: "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
  businessType: "soleProprietorship",
  businessName: "Jane Corp",
  ein: "00-0000000",
};

dwolla
  .post("customers", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```
#### Create Customer (VERIFIED BUSINESS CUSTOMER (BUSINESSTYPE= LLC, CORPORATION OR PARTNERSHIP))

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  firstName: 'Account',
  lastName: 'Admin',
  email: 'accountAdmin@email.com',
  type: 'business',
  address1: '99-99 33rd St',
  city: 'Some City',
  state: 'NY',
  postalCode: '11101',
  controller: {
      firstName: 'John',
      lastName: 'Controller',
      title: 'CEO',
      dateOfBirth: '1980-01-31',
      ssn: '1234'
      address: {
        address1: '1749 18th st',
        address2: 'apt 12',
        city: 'Des Moines',
        stateProvinceRegion: 'IA',
        postalCode: '50266',
        country: 'US',
      }
  },
  businessClassification: '9ed38155-7d6f-11e3-83c3-5404a6144203',
  businessType: 'llc',
  businessName: 'Jane Corp',
  ein: '12-3456789'
};
dwolla
  .post('customers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```
#### Create Funding Source (Bank Account)

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  routingNumber: "222222226",
  accountNumber: "123456789",
  bankAccountType: "checking",
  name: "My Bank",
};

dwolla
  .post("funding-sources", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3'
```
#### Bank Transfer (initiate a transfer)

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  _links: {
    source: {
      href: "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4",
    },
    destination: {
      href: "https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C",
    },
  },
  amount: {
    currency: "USD",
    value: "1.00",
  },
  metadata: {
    paymentId: "12345678",
    note: "payment for completed work Dec. 1",
  },
  clearing: {
    destination: "next-available",
  },
  achDetails: {
    source: {
      addenda: {
        values: ["ABC123_AddendaValue"],
      },
    },
    destination: {
      addenda: {
        values: ["ZYX987_AddendaValue"],
      },
    },
  },
  correlationId: "8a2cdc8d-629d-4a24-98ac-40b735229fe2",
};

dwolla
  .post("transfers", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```
### Webhook

```js
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var requestBody = {
  url: "http://myawesomeapplication.com/destination",
  secret: "your webhook secret",
};
dwolla
  .post("webhook-subscriptions", requestBody)
  .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'
```



