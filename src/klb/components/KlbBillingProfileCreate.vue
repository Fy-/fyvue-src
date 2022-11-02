<template>
  <div v-if="user">
    <FyModal id="FirstBilling" :title="$t('modal_first_billing_title')">
      {{ $t("modal_first_billing_description") }}<br /><br />

      <form @submit.prevent="submitBillingCreate">
        <FyInput
          id="billingLabel"
          :req="true"
          :showLabel="true"
          :placeholder="$t('billing_create_label_placeholder')"
          :validate="v$.label"
          :label="$t('billing_create_label_label')"
        ></FyInput>
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
        <div class="input-group w-full">
          <div class="mr-4 w-16">
            <label class="label-basic" for="typeDef"
              >{{ $t("billing_create_creditcard_label") }}
            </label>
          </div>
          <div class="w-full">
            <div class="input-box w-full">
              <div id="theCard" class="pl-2 input-basic w-full"></div>
            </div>
          </div>
        </div>
        <button
          class="block text-lg font-extrabold mx-auto p-2 mt-4 btn primary"
          type="submit"
        >
          {{ $t("create_billing_profile") }}
        </button>
      </form>
    </FyModal>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { getUser } from "./../../klb/api/user";
import {
  getUserBilling,
  getPaymentMethod,
  createBillingProfile,
} from "./../../klb/api/billing";
import { useEventBus, useCountries } from "./../../";
import FyModal from "./../../components/FyModal.vue";
import FyInput from "./../../components/FyInput.vue";

const props = defineProps({ // eslint-disable-line
  showOnMount: { type: Boolean, default: false },
  onComplete: { type: Function, default: ()=> {}} 
});
const eventBus = useEventBus();
const state = reactive({
  label: "",
  firstname: "",
  lastname: "",
  country: "",
  zip: "",
});
const rules = {
  label: { required },
  firstname: { required },
  lastname: { required },
  country: { required },
  zip: { required },
};
const v$ = useVuelidate(rules, state);

const user = ref(null);
const billing = ref(null);
const countries = useCountries().countries;
const stripe = ref(null);
const stripePK = ref(null);
const stripeCard = ref(null);
const cardToken = ref(null);
const billingProfile = ref(null);
const submitBillingCreate = async () => {
  if (await v$.value.$validate()) {
    eventBus.emit('loading', true)
    cardToken.value = await stripe.value.createToken(stripeCard.value, {
      name: `${state.firstname} ${state.lastname}`,
      email: user.value.Email,
    });
    createBillingProfile.value = await createBillingProfile(
      state.label,
      state.firstname,
      state.lastname,
      state.zip,
      state.country,
      "Stripe",
      cardToken.value.token.id
    );
    eventBus.emit("FirstBillingModal", false);
    user.value = await getUser();
    eventBus.emit('loading', false)
    props.onComplete(createBillingProfile.value);
  }
};
const showBillingModal = async () => {
  eventBus.emit("FirstBillingModal", true);
  stripePK.value = await getPaymentMethod();
  if (
    stripePK.value &&
    stripePK.value.data &&
    stripePK.value.data.Fields &&
    stripePK.value.data.Fields.cc_token &&
    stripePK.value.data.Fields.cc_token.attributes.key
  ) {
    stripe.value = window.Stripe(
      stripePK.value.data.Fields.cc_token.attributes.key
    );
    stripeCard.value = stripe.value
      .elements()
      .create("card", { hidePostalCode: true });
    stripeCard.value.mount("#theCard");
  }
};

onMounted(async () => {
  user.value = await getUser();
  eventBus.on("ShowCreateBillingProfile", (r) => {
    if (r) showBillingModal();
  });
  if (user.value) {
    billing.value = await getUserBilling();
    if (billing.value.data.length == 0) {
      if (props.showOnMount) showBillingModal();
    }
  }
});
</script>
