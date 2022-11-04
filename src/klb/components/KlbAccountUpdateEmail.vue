<template>
  <div v-if="user">
    <BaseModal id="UpdateEmail" :title="$t('account_title')">
      <form @submit.prevent="submitUpdatePwd">
        <div class="grid grid-cols-2 gap-2">
          <FyInput
            id="currPwd"
            :req="true"
            :showLabel="true"
            :placeholder="$t('emailchange_pwd_placeholder')"
            :validate="v$.pwd"
            :label="$t('emailchange_pwd_label')"
            type="password"
            autocomplete="off"
          ></FyInput>
          <FyInput
            id="newEmail"
            :req="true"
            :showLabel="true"
            :placeholder="$t('emailchange_email_placeholder')"
            :validate="v$.emailField"
            :label="$t('emailchange_email_label')"
            autocomplete="off"
            type="email"
          ></FyInput>
        </div>
        <div class="form-error-label" v-if="error">{{ error }}</div>
        <button
          class="btn-defaults mt-4 btn primary"
          type="submit"
        >
          {{ $t("save_new_email_button") }}
        </button>
      </form>
    </BaseModal>
    
    <button
      class="btn primary btn-defaults inline-block"
      @click="
        () => {
          eventBus.emit('UpdateEmailModal', true);
        }
      "
    >
      <PencilSquareIcon
        stroke="currentColor"
        class="h-5 -mt-0.5 align-middle inline-block"
      />
      {{ $t("change_email_btn") }}</button
    ><span class="text-lg italic ml-2">{{ user.Email }}</span>
  </div>
  <FySelfLoading :isLoading="true" style="height: 55px; " :size="[40,40]" v-else />
</template>
<script setup>
import { ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { notify } from "notiwind";
import { useEventBus, useTranslation } from "./../../";
import { getUser } from "./../../klb/api/user";
import FyInput from "./../../components/FyInput.vue";
import { updateEmail } from "./../../klb/api/user";
import BaseModal from "./../../components/FyModal.vue";
import { PencilSquareIcon } from "@heroicons/vue/24/solid";

const eventBus = useEventBus();
const i18next = useTranslation();
const user = ref(null);
const error = ref(null);
const emailField = ref("");
const pwd = ref("");

const rules = {
  emailField: { required, email },
  pwd: { required },
};

const v$ = useVuelidate(rules, { emailField: emailField, pwd: pwd });

const submitUpdatePwd = async () => {
  eventBus.emit("loading", true);
  error.value = null;
  if (await v$.value.$validate()) {
    let tmp = await updateEmail(pwd.value, emailField.value).catch((err) => {
      error.value = err.error;
      eventBus.emit("loading", false);
    });
    if (tmp && tmp.result && tmp.result == "success") {
      notify(
        {
          group: "default",
          title: i18next.t("notif_success_title"),
          text: i18next.t("update_success_confirm"),
        },
        4000
      );
      eventBus.emit("loading", false);
      eventBus.emit("UpdateEmailModal", false);
    } else {
      error.value = i18next.t("pwdchange_invalid_password");
      eventBus.emit("loading", false);
    }
  }
  eventBus.emit("loading", false);
};

onMounted(async () => {
  user.value = await getUser();
  if (user.value) {
    emailField.value = user.value.Email;
  }
});
</script>
