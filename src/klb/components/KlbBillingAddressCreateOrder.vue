<template>
  <div v-if="user">
    <form @submit.prevent="submitEditBillingAddress">
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
        class="block font-extrabold mx-auto px-4 py-3 mt-4 btn primary"
        type="submit"
      >
        {{ $t("cta_next") }}
      </button>
    </form>
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
import { useCountries, useEventBus } from "./../../";
import { getUser } from "./../../klb/api/user";
import { getUserBilling } from "./../../klb/api/billing";
import {
  getLocationByID,
} from "./../../klb/api/location";
import { cartCreateOrder } from "./../../klb/api/order";

const props = defineProps({ onComplete: Function }); // eslint-disable-line
const eventBus = useEventBus();
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
const submitEditBillingAddress = async () => {
  eventBus.emit("loading", true);

  if (await v$.value.$validate()) {
    let result = await cartCreateOrder({
      First_Name: state.firstname,
      Last_Name: state.lastname,
      Zip: state.zip,
      Country__: state.country,
    });
    if (result.result == "success") {
      props.onComplete(result.data.Order__)
    }
  }
  eventBus.emit("loading", false);
};
onMounted(async () => {
  user.value = await getUser();
  if (user.value) {
    billing.value = await getUserBilling();
    if (billing.value.data.length != 0) {
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
