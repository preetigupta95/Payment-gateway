"use strict";

const { Checkout } = require('checkout-sdk-node');
import { logger } from "@lib/logger";
const secretKey = 'sk_sbox_.....';
const publicKey = 'pk_sbox_.....';
const acceskey = 'ack_z...';
const accessSecret = 'kLnU_......';
const cko = new Checkout(secretKey, { pk: publicKey });
class CheckoutManager {

  async createAccessToken() {
    try {
      const access_token = await cko.access.request({
        grant_type: 'client_credentials',
        client_id: acceskey,
        client_secret: accessSecret,
        scope: 'gateway',
      });
      return access_token;
    } catch (err) {
      logger.error(err.name);
    }
  }
  async paymentTransaction(data, params,tokenData) {
    try {
      if(params?.isCardSaved){
        data.customer={
          email: tokenData.email,
          name: tokenData.firstName
        }
      }
      const paymentData = await cko.payments.request(data)
      if (paymentData?.source?.id) {
        await cko.instruments.update(paymentData.source.id, {
          account_holder: {
            first_name: params.name
          }
        });
      }
      return paymentData
    } catch (error) {
      throw error
    }
  }
  async createBankAccount(data) {
    try {
      return await cko.instruments.create(data)
    } catch (error) {
      throw error
    }
  }
 
  async createCardDetails(params, tokenData) {
    try {
      const data = {
        token: params.token,
        account_holder: {
          first_name: params.name
        },
        customer: {
          email: tokenData.email,
          name: tokenData.firstName
        }
      }
      return await cko.instruments.create(data);
    } catch (error) {
      throw error
    }
  }
  async getCustomerDetails(data) {
    try {
      return await cko.customers.get(data);
    } catch (error) {
      throw error
    }
  }
}
export const checkoutManager = new CheckoutManager();

