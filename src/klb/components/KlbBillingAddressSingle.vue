<template>
  <div v-if="user">
    <form @submit.prevent="submitEditBillingAddress" v-if="hasBilling">
      <div class="grid grid-cols-2 gap-2">
        <FyInput
          id="billingFirstname"
          :req="true"
          :showLabel="true"
          :placeholder="$t('billing_create_firstname_placeholder')"
          :validate="v$.firstname"
          :label="$t('billing_create_firstname_label')"
        ></FyInput>
        <FyInput
          id="billingLastname"
          :req="true"
          :showLabel="true"
          :placeholder="$t('billing_create_lastname_placeholder')"
          :validate="v$.lastname"
          :label="$t('billing_create_lastname_label')"
        ></FyInput>
        <FyInput
          id="billingZip"
          :req="true"
          :showLabel="true"
          :placeholder="$t('billing_create_zip_placeholder')"
          :validate="v$.zip"
          :label="$t('billing_create_zip_label')"
        ></FyInput>
        <div class="input-group">
          <div class="mr-4 w-16">
            <label class="label-basic" for="typeDef"
              >{{ $t("billing_create_country_label") }}
            </label>
          </div>
          <div class="flex-1">
            <div class="input-box">
              <select
                class="input-basic"
                v-model="state.country"
              >
                <option
                  :value="country.Country__"
                  v-for="country in countries"
                  v-bind:key="country.Country__"
                >
                  {{ country.Name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <button
        class="block font-extrabold mx-auto p-2 mt-4 btn primary"
        type="submit"
      >
        {{ $t("save_billing_address") }}
      </button>
    </form>
    <div v-else>
      {{ $t("no_billing_location_yet") }}
    </div>
  </div>
  <FySelfLoading
    :isLoading="true"
    style="height: 155px"
    :size="[80, 80]"
    v-else
  />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { notify } from "notiwind";
import { useEventBus, useCountries, useTranslation } from "./../../";
import { getUser } from "./../../klb/api/user";
import { getUserBilling, updateBillingByID } from "./../../klb/api/billing";
import {
  getLocationByID,
  updateLocationByID,
} from "./../../klb/api/location";

const eventBus = useEventBus();
const i18next = useTranslation();
const countries = useCountries().countries;
const billing = ref(null);
const location = ref(null);
const state = reactive({
  firstname: "",
  lastname: "",
  country: "",
  zip: "",
});
const rules = {
  firstname: { required },
  lastname: { required },
  country: { required },
  zip: { required },
};
const v$ = useVuelidate(rules, state);

const user = ref(null);
const hasBilling = ref(false);
const submitEditBillingAddress = async () => {
  eventBus.emit("loading", true);

  if (await v$.value.$validate()) {
    let result = await updateLocationByID(
      billing.value.data[0].User_Location__,
      {
        First_Name: state.firstname,
        Last_Name: state.lastname,
        Zip: state.zip,
        Country__: state.country,
      }
    );

    await updateBillingByID(billing.value.data[0].User_Billing__, {
      User_Location__: result.data.User_Location__,
      Label: billing.value.data[0].Label,
    });

    location.value = await getLocationByID(result.data.User_Location__);
    state.firstname = location.value.data.First_Name;
    state.lastname = location.value.data.Last_Name;
    state.zip = location.value.data.Zip;
    state.country = location.value.data.Country__;
    notify(
      {
        group: "default",
        title: i18next.t("notif_success_title"),
        text: i18next.t("update_success_confirm"),
      },
      4000
    );
  }
  eventBus.emit("loading", false);
};
onMounted(async () => {
  user.value = await getUser();
  if (user.value) {
    billing.value = await getUserBilling();
    if (billing.value.data.length != 0) {
      hasBilling.value = true;
      location.value = await getLocationByID(
        billing.value.data[0].User_Location__
      );
      state.firstname = location.value.data.First_Name;
      state.lastname = location.value.data.Last_Name;
      state.zip = location.value.data.Zip;
      state.country = location.value.data.Country__;
    }
  }
});
</script>
