import { rest } from "@karpeleslab/klbfw";
import { notificationErrors } from './../../';

export const getUserBilling = async () => {
  return new Promise((resolve, reject) => {
    rest("User/Billing", "GET")
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const updateBillingByID = async (id, data) => {
  return new Promise((resolve, reject) => {
    rest(`User/Billing/${id}`, "PATCH", data)
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const getPaymentHistory = async (page = 1) => {
  return new Promise((resolve, reject) => {
    rest("Order", "GET", {
      page_no: page,
      results_per_page: 10,
      Status: "completed",
    })
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const changePaymentMethodByID = async (id, cc_token) => {
  return new Promise((resolve, reject) => {
    rest(`User/Billing/Method/${id}:change`, "POST", {
      method: "Stripe",
      cc_token: cc_token,
    })
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const getPaymentMethod = async () => {
  return new Promise((resolve, reject) => {
    rest("Realm/PaymentMethod:methodInfo", "GET", {
      method: "Stripe",
    })
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const createBillingProfile = async (
  label,
  firstname,
  lastname,
  zip,
  country,
  method,
  cc_token
) => {
  return new Promise((resolve, reject) => {
    rest("User/Billing:create", "POST", {
      Label: label,
      First_Name: firstname,
      Last_Name: lastname,
      Zip: zip,
      Country__: country,
      method: method,
      cc_token: cc_token,
    })
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};
