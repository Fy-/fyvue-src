import mitt from "mitt";
import Notifications from "notiwind";
import { getLocale } from "@karpeleslab/klbfw";
import Backend from "./klb/i18n-backend.js";
import i18next from "i18next";
import { rest } from "@karpeleslab/klbfw";
import * as FyvueComponents from "./components/";
import * as KlbComponents from "./klb/components/";
import { createHead } from "@vueuse/head";
import { getCurrentInstance } from "vue";
import { notify } from "notiwind";
import { KlbBilling, KlbLocation, KlbUser, KlbOrder } from "./klb/api";
import { cropText, formatBytes, isPathActive } from "./utils";

const head = createHead();
const eventBus = mitt();
const countries = {
  countries: [],
  byUuid: {},
};
const locale = getLocale();

const useEventBus = () => {
  return getCurrentInstance().appContext.config.globalProperties.$eventBus;
};
const useCountries = () => {
  return getCurrentInstance().appContext.config.globalProperties.$countries;
};
const useTranslation = () => {
  return { t: getCurrentInstance().appContext.config.globalProperties.$t };
};
const countriesPromise = () => {
  return new Promise((resolve) => {
    KlbLocation.getCountries().then((_countries) => {
      countries.countries = _countries.data;
      _countries.data.forEach((_country) => {
        countries.byUuid[_country.Country__] = _country;
      });
      resolve();
    });
  });
};

const i18nextPromise = i18next.use(Backend).init({
  ns: ["translation"],
  defaultNS: "translation",
  debug: false,
  lng: locale,
  load: "currentOnly",
  initImmediate: false,
});

const notificationErrors = (err) => {
  notify(
    {
      group: "default",
      type: "error",
      title: i18next.t("error_notif_title"),
      text: err.error ? err.error : i18next.t("error_notif_unknown"),
    },
    6000
  );
};

function createFyvue() {
  const fyvue = {
    install(app, options = {}) {
      app.config.globalProperties.$eventBus = eventBus;
      app.config.globalProperties.$rest = rest;
      app.config.globalProperties.$countries = countries;
      app.config.globalProperties.$cropText = cropText;
      app.config.globalProperties.$formatBytes = formatBytes;
      app.config.globalProperties.$isPathActive = isPathActive;
      app.config.globalProperties.$t = i18next.t;

      for (const componentKey in FyvueComponents) {
        app.component(componentKey, FyvueComponents[componentKey]);
      }
      for (const componentKey in KlbComponents) {
        app.component(componentKey, KlbComponents[componentKey]);
      }
      app.use(Notifications);
      app.use(head);
    },
  };
  return fyvue;
}

export {
  createFyvue,
  KlbBilling,
  KlbLocation,
  KlbUser,
  KlbOrder,
  i18next,
  i18nextPromise,
  notificationErrors,
  countriesPromise,
  useCountries,
  useEventBus,
  useTranslation,
  head,
};
