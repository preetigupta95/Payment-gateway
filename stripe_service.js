const Utils = require("../Utils");
const Boom = require("@hapi/boom");
const Config = require("../Configerations");
const Stripe = require("stripe");
const Models = require("../Models");
const appConstants = require("../AppConstants");
const logger = require("../Utils/logger");

const stripe = Stripe(
  Config.appConfig.get("/stripe/serverKey", {
    env: process.env.NODE_ENV,
  }),
  { apiVersion: appConstants.STRIPE_VERSION }
);
const createProduct = async function (product) {
  try {
    const productData = await stripe.products.create({
      name: product.name,
      description: product.description,
    });
    return productData;
  } catch (error) {
    throw error;
  }
};
const createPrice = async function (product) {
  try {
    const productData = await createProduct(product);
    const priceData = await stripe.prices.create({
      unit_amount: product.price * 100,
      currency: "usd",
      recurring: {
        interval: product.frequency,
      },
      product: productData.id,
    });
    return priceData;
  } catch (error) {
    logger.error(error);
  }
};

const archiveProduct = async (payload) => {
  try {
    const product = await stripe.products.update(payload.planProductId, {
      active: false,
    });
    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (planProuctId, payload) => {
  try {
    const product = await stripe.products.update(planProuctId, payload);
  } catch (error) {
    logger.error(error);
  }
};

const createCustomer = async function (customer) {
  try {
    const customerData = await stripe.customers.create({
      description: `Created customer ${customer.email} for ${customer.companyName}`,
      address: {
        city: customer.city,
        country: customer.country,
        line1: customer.line1,
        postal_code: customer.postal_code,
        state: customer.state,
      },
      email: customer.email,
      name: customer.companyName,
    });

    return customerData;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_CREATING_STRIPE_CUSTOMER", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};

const addCard = async function (customerId, token) {
  try {
    const card = await stripe.customers.createSource(customerId, {
      source: token,
    });
    return card;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_ADDING_CARD_IN_STRIPE", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};
const retrieveCoupon = async function (planProuctId, couponCode) {
  try {
    const coupon = await stripe.coupons.retrieve(couponCode, {
      expand: ["applies_to"],
    });

    return coupon;
  } catch (error) {
    throw error;
  }
};

const createSubscription = async function (
  customerId,
  priceId,
  couponId
) {
  try {
    const subscriptionObj = {
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      expand: ["latest_invoice.payment_intent"],
    };
    if (couponId) {
      subscriptionObj["coupon"] = couponId;
    }
    const subscription = await stripe.subscriptions.create(subscriptionObj);
    return subscription;
  } catch (error) {
    throw error;
  }
};
const deleteSubscription = async function (subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    throw Boom.badRequest(
      Utils.responseMessages.get("/ERROR_IN_DELETING_STRIPE_SUBSCRIPTION", {
        contentLanguage: appConstants.CONTENT_LANGUAGE.ENGLISH,
      })
    );
  }
};
const createSubscriptionCoupon = async (couponId) => {
  try {
    await Utils.queries.saveData(Models.coupon, { couponId });
  } catch (error) {
    throw error;
  }
};
const deleteSubscriptionCoupon = async (couponId) => {
  try {
    await Utils.queries.remove(Models.coupon, { couponId });
    return;
  } catch (error) {
    throw error;
  }
};

const webhookEvent = async (request, response) => {
  try {
    const event = request.body.type;
    if (event === "customer.subscription.updated") {
      return request?.body?.data?.object;
    }
    if (event === "customer.subscription.deleted") {
      return request?.body?.data?.object;
    }
    if (event === "payment_intent.payment_failed") {
      return request?.body?.data?.object;
    }
    if (event === "coupon.created") {
      if (request?.body?.data?.object) {
        await createSubscriptionCoupon(request?.body?.data?.object.id);
      }
    }
    if (event === "coupon.deleted") {
      if (request?.body?.data?.object) {
        await deleteSubscriptionCoupon(request?.body?.data?.object.id);
      }
    }
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  response.send();
};
const retrieveCouponDetails = async function (couponCode) {
  try {
    const coupon = await stripe.coupons.retrieve(couponCode, {
      expand: ["applies_to"],
    });
    return coupon;
  } catch (error) {
    throw error;
  }
};

