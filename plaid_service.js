const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const Config = require("../Configerations");
const Boom = require("@hapi/boom");
const Utils = require("../Utils");
const Models = require("../Models");
const appConstants = require("../AppConstants");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": Config.appConfig.get("/plaid/clientID", {
        env: process.env.NODE_ENV,
      }),
      "PLAID-SECRET": Config.appConfig.get("/plaid/secret", {
        env: process.env.NODE_ENV,
      }),
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const createPlaidToken = async (customerData) => {
  try {
    const request = {
      user: {
        client_user_id: customerData?.id,
      },
      client_name: "My Sales Champion",

      products: ["auth", "transactions"],

      country_codes: ["US"],
      language: appConstants.CONTENT_LANGUAGE.ENGLISH,
    };
    const response = await plaidClient.linkTokenCreate(request);

    const { link_token } = response.data;
    return link_token;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_CREATING_PLAID_TOKEN", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};
const createProcessorToken = async (requestData, customerData) => {
  try {
    const { publicToken, accountData } = requestData;
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = tokenResponse.data.access_token;
    const request = {
      access_token: accessToken,
      account_id: accountData?.account_id,
      processor: "dwolla",
    };
    const dataToSave = {
      accessToken: accessToken,
      userBankName: accountData?.name,
      last4DigitBankAccount: accountData?.mask,
    };

    await Utils.queries.findAndUpdate(
      Models.company,
      { id: customerData?.id },
      dataToSave
    );
    await Utils.queries.findAndUpdate(
      Models.saleschamp,
      { id: customerData?.id },
      dataToSave
    );
    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;
    return processorToken;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_CREATING_PROCESSOR_TOKEN", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};

module.exports = {
  createPlaidToken,
  createProcessorToken,
};
