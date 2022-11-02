import { rest } from "@karpeleslab/klbfw";
import { notificationErrors } from './../../';

export const catalogSearch = async (sort='Basic.Priority:asc') => {
  return new Promise((resolve, reject) => {
    rest("/Catalog/Product:search", "GET", {sort:sort})
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};


export const addProductToCart = async (id_product) => {
  return new Promise((resolve, reject) => {
    rest("Catalog/Cart/@:process", "POST", {request:id_product})
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const getOrder = async (uid) => {
  return new Promise((resolve, reject) => {
    rest(`Order/${uid}`, "GET")
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const orderProcess = async () => {
  return new Promise((resolve, reject) => {
    rest("Catalog/Cart/@:process", "GET")
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const orderProcessPost = async (order, data={}) => {
  return new Promise((resolve, reject) => {
    rest(`Order/${order}:process`, "POST", data)
      .catch((err) => {
        console.log("orderProcessPayment" + err);
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};


export const resetCart = async () => {
  return new Promise((resolve, reject) => {
    rest("Catalog/Cart/@:reset", "POST", {})
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const getCart = async () => {
  return new Promise((resolve, reject) => {
    rest("/Catalog/Cart", "GET")
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};

export const cartCreateOrder = async (billing) => {
  return new Promise((resolve, reject) => {
    rest("Catalog/Cart/@:createOrder", "POST", {Billing:billing})
      .catch((err) => {
        notificationErrors(err)
      })
      .then((result) => resolve(result));
  });
};  


