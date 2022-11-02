<template>

  <form
    @submit.prevent="processOrder"
    v-if="order && order.data && order.data.methods && currentMethod"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 mb-4">
      <div>
        <h3 class="font-bold mt-4 mb-1">
          {{ $t("order_process_location_data") }}
        </h3>

        {{ order.data.order.Billing_User_Location.Display_Name }}
        <br />{{ order.data.order.Billing_User_Location.Zip }}
        {{ order.data.order.Billing_User_Location.Country.name }}
      </div>
      <div>
        <h3 class="font-bold mt-4 mb-1">{{ $t("order_process_products") }}</h3>

        <div v-for="(item, index) in order.data.order.Items" v-bind:key="index">
          {{ item.Catalog_Product["Basic.Name"] }} -
          <span class="font-bold font-heading">
            {{ item.Price.display }}
            <sup class="mt-2 mb-8 font-normal ml-1">
              {{ $t("per_month_product") }}
            </sup>
          </span>
        </div>
      </div>
    </div>
    <div v-if="currentMethod == 'Stripe'">
      <div class="input-group w-full">
        <div class="mr-4 w-16">
          <label class="label-basic" for="typeDef"
            >{{ $t("billing_create_creditcard_label") }}
          </label>
        </div>
        <div class="w-full">
          <div class="input-box w-full">
            <div
              id="theCard"
              ref="theCard"
              class="input-basic w-full"
              style="padding-left: 0.5rem"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="(field, key) in order.data.methods[currentMethod].fields"
      v-bind:key="field.method"
    >
      <template v-if="key != 'cc_token' && currentMethod == 'Stripe'">
        <div class="input-group">
          <template v-if="field.type == 'label'">
            <p class="form-error-label" v-if="field.style == 'error'">
              {{ field.label }}
            </p>
            <p class="font-medium" v-else>
              <template v-if="field.link !== void 0">
                <a class="underline" :href="field.link">{{ field.label }}</a>
              </template>
              <template v-else>
                {{ field.label }}
              </template>
            </p>
          </template>
          <template
            v-if="
              field.type == 'input' ||
              field.type == 'password' ||
              field.type == 'email'
            "
          >
            <div class="w-full">
              <label class="label-basic my-4" :for="`form_${key}`"
                >{{ field.label }}
                <sup class="text-red-700" v-if="req.includes(key)"
                  >*</sup
                ></label
              >
              <div class="input-box">
                <input
                  :placeholder="key == 'name' ? 'John Doe' : field.label"
                  class="input-basic"
                  :type="field.type"
                  v-model="formData[key]"
                  :id="`form_${key}`"
                  :ref="`form_${key}`"
                />
                <slot name="icon"> </slot>
              </div>
              <div class="error-form mt-4" v-if="key in errors">
                {{ errors[key] }}
              </div>
            </div>
          </template>
          <template v-if="field.type == 'checkbox'">
            <div class="mt-6">
              <label class="inline-flex text-xs" :for="`form_${key}`">
                <input
                  type="checkbox"
                  class="form-checkbox"
                  :id="`form_${key}`"
                  v-model="formData[key]"
                  :value="field.attributes.value"
                  :true-value="field.attributes.value"
                  false-value="0"
                />
                <span class="ml-2"> {{ $t(field.caption) }} </span>
              </label>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="text-lg mt-1" v-if="order">
      Total: <b>{{ order.data.order.Total.display }}</b>
    </div>
    <button
      class="block font-extrabold mx-auto px-4 py-3 mt-4 btn primary"
      type="submit"
    >
      {{ $t("process_order_cta") }}
    </button>
  </form>
  <FySelfLoading
    :isLoading="true"
    style="height: 155px"
    :size="[80, 80]"
    v-else
  />
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getUser } from "./../../klb/api/user";
import { orderProcessPost } from "./../../klb/api/order";
import { useEventBus } from "./../..";

const user = ref(null);
const order = ref(null);
const props = defineProps({ orderUuid: String, onComplete: Function }); // eslint-disable-line
const session = ref(null);
const currentMethod = ref(null);
const methodProperties = reactive({});
const formData = reactive({});
const theCard = ref(null);
const eventBus = useEventBus();

watch(theCard, (v) => {
  if (v && currentMethod.value == "Stripe") {
    methodProperties.stripeCard = methodProperties.stripe
      .elements()
      .create("card", { hidePostalCode: true });
    methodProperties.stripeCard.mount("#theCard");
  }
});
const processOrder = async () => {
  eventBus.emit("loading", true);
  if (currentMethod.value == "Stripe") {
    methodProperties.cardToken = await methodProperties.stripe.createToken(
      methodProperties.stripeCard,
      {
        name: `${order.value.data.order.Billing_User_Location.Display_Name}`,
        email: user.value.Email,
      }
    );
    let data = { ...formData };
    data.session = session.value;
    data.cc_token = methodProperties.cardToken.token.id;
    data.method = currentMethod.value;
    let orderResult = await orderProcessPost(props.orderUuid, data);
    props.onComplete(orderResult)
  } else if (currentMethod.value == 'Free') {
    let data = { ...formData };
    data.session = session.value
    data.method = currentMethod.value
    let orderResult = await orderProcessPost(props.orderUuid, data);
    props.onComplete(orderResult)    
  }
  eventBus.emit("loading", false);
};
onMounted(async () => {
  user.value = await getUser();
  order.value = await orderProcessPost(props.orderUuid);
  order.value.data.methods_order.forEach((method) => {
    if (method == "Stripe") {
      currentMethod.value = "Stripe";

      session.value = order.value.data.methods[method].session;
      methodProperties.stripe = window.Stripe(
        order.value.data.methods[method].fields.cc_token.attributes.key
      );
    } else if (method == 'Free') {
      session.value = order.value.data.methods[method].session;
      console.log(order.value.data.methods)
      currentMethod.value = 'Free'
    }

    for (const [key, value] of Object.entries(
      order.value.data.methods[method].fields
    )) {
      formData[key] = null;
      if (value.attributes.value) {
        formData[key] = value.attributes.value.toString();
      }
    }
  });
});
</script>
