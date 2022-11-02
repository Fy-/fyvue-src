<template>
  <template v-if="paymentHistory">
    <FyPaging
      id="billingHistory"
      v-model:items="paging"
      v-if="paging && paging.page_no"
      class="mt-4 mb-4"
    />
    <FyTable
      v-model:data="paymentHistory"
      :headers="{
        Invoice_Number: $t('billing_history_headers_invoice_number'),
        Invoice_Date: $t('billing_history_headers_created'),
        Paid: $t('billing_history_headers_paid'),
        Status: $t('billing_history_headers_status'),
        Total: $t('billing_history_headers_price'),
        Actions: $t('billing_history_headers_actions'),
      }"
    >
      <template v-slot:Actions_item="property">
        <a
          :href="property.data.item.Invoice_Url"
          target="_blank"
          class="btn neutral p-2"
          v-if="property.data.item.Invoice_Url"
          ><ArrowDownTrayIcon
            stroke="currentColor"
            class="h-5 -mt-0.5 align-middle inline-block"
          />
          Download PDF</a
        >
      </template>
      <template v-slot:Total_item="property">
        <span class="uppercase block mx-auto bg-blue-200 rounded p-1">{{
          property.data.item.Total.display
        }}</span>
      </template>
      <template v-slot:Status_item="property">
        <span class="uppercase block mx-auto bg-blue-200 rounded p-1">{{
          property.data.item.Status
        }}</span>
      </template>
      <template v-slot:Invoice_Date_item="property">
        {{
          $t("global_datetime", {
            val: new Date(property.data.item.Invoice_Date.iso),
            formatParams: {
              val: {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              },
            },
          })
        }}
      </template>
      <template v-slot:Paid_item="property">
        {{
          $t("global_datetime", {
            val: new Date(property.data.item.Paid.iso),
            formatParams: {
              val: {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              },
            },
          })
        }}
      </template>
    </FyTable>
    <FyPaging
      id="billingHistory"
      v-model:items="paging"
      v-if="paging && paging.page_no"
      class="mt-4 mb-4"
    />
  </template>
    <FySelfLoading
    :isLoading="true"
    style="height: 60px"
    :size="[45, 45]"
    v-else
  />
  <div v-if="paymentHistory && paymentHistory.length==0" class="text-center default-p">{{$t('billing_history_empty')}}</div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getPaymentHistory } from "./../../klb/api/billing";
import { getUser } from "./../../klb/api/user";
import { useEventBus } from "./../..";
import { ArrowDownTrayIcon } from "@heroicons/vue/24/solid";

const user = ref(null);
const paymentHistory = ref(null);
const paging = ref(null);
const eventBus = useEventBus();

const _getPaymentHistory = async (page = 1) => {
  let tmp = await getPaymentHistory(page);
  paymentHistory.value = await tmp.data;
  paging.value = await tmp.paging;
};
onMounted(async () => {
  user.value = await getUser();
  if (user.value) {
    _getPaymentHistory();
    eventBus.on("billingHistoryGoToPage", (page) => _getPaymentHistory(page));
  }
});
</script>
