const Config = require("../Configerations");
const Boom = require("@hapi/boom");
const Utils = require("../Utils");
const appConstants = require("../AppConstants");
const Client = require("dwolla-v2").Client;
const webhookSecret = Config.appConfig.get("/dwolla/webhookSecret", {
  env: process.env.NODE_ENV,
});
const webhookSubscriptionUrl =
  "webhook url";

const dwolla = new Client({
  key: Config.appConfig.get("/dwolla/key", {
    env: process.env.NODE_ENV,
  }),
  secret: Config.appConfig.get("/dwolla/secret", {
    env: process.env.NODE_ENV,
  }),
  environment: Config.appConfig.get("/dwolla/environment", {
    env: process.env.NODE_ENV,
  }), // sandbox to 'production'
});
const master_dwolla_account = Config.appConfig.get(
  "/dwolla/master_dwolla_account",
  { env: process.env.NODE_ENV }
);
const createDwollaCustomer = async (customer) => {
  try {
    const response = await dwolla.post("customers", customer);
    const customerUrl = response.headers.get("Location");
    const customerData = await dwolla.get(customerUrl);
    if (customerData) {
      return customerData?.body;
    }
  } catch (error) {
    throw error;
  }
};

const createCustomerFundingSource = async (customerData, processorToken) => {
  try {
    const customerUrl = `${appConstants.DWOLLA_API_URLS.sandbox}customers/${customerData.id}`;
    const requestBody = {
      plaidToken: processorToken,
      name:
        customerData?.userBankName ||
        `${customerData.firstName} ${customerData.lastName}`,
    };
    const response = await dwolla.post(
      `${customerUrl}/funding-sources`,
      requestBody
    );
    const fundingUrl = response.headers.get("Location");
    return fundingUrl;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_VERFIED_BANK_ACCOUNT", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};

const getFundingSourceDetails = async (customer) => {
  try {
    const bankDetails = await dwolla.get(customer?.fundingSourceURL);
    if (bankDetails?.body.id) {
      return bankDetails;
    }
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_GETTING_BANK_DETAILS", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};

const removeCustomerFundingSource = async (customer) => {
  try {
    const bankDetails = await dwolla.post(customer?.fundingSourceURL, {
      removed: true,
    });
    return bankDetails;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_REMOVE_BANK_DETAILS", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};

const updateDwollaCustomer = async (customer, data) => {
  try {
    const customerUrl = `${appConstants.DWOLLA_API_URLS.sandbox}customers/${customer.id}`;
    const response = await dwolla.post(customerUrl, data);
    if (response) {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

const updateDwollaCustomerStatus = async (id, status) => {
  try {
    const customerUrl = `${appConstants.DWOLLA_API_URLS.sandbox}customers/${id}`;
    const response = await dwolla.post(customerUrl, { status: status });
    return response?.body;
  } catch (error) {
    throw error;
  }
};

const getBusinessClassifications = async () => {
  try {
    const response = await dwolla.get("business-classifications");
    return response?.body?._embedded["business-classifications"];
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_BUSINESS_CLASSIFICATION", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};
const webHookSubscription = async (req, res) => {
  try {
    var requestBody = {
      url: webhookSubscriptionUrl,
      secret: webhookSecret,
    };
    const response = await dwolla
      .post("webhook-subscriptions", requestBody)
      .then((res) => res.headers.get("location"));
    res.json(response);
  } catch (error) {}
};

