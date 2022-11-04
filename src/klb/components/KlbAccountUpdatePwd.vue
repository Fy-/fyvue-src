<template>
  <div v-if="user">
    <FyModal id="UpdatePwd" :title="$t('account_security_title')">
      <form @submit.prevent="submitUpdatePwd">
        <div class="">
          <FyInput
            id="pwd"
            :req="true"
            :showLabel="true"
            :placeholder="$t('pwdchange_old_placeholder')"
            :validate="v$.oldPwd"
            :label="$t('pwdchange_old_label')"
            type="password"
            autocomplete="off"
          ></FyInput>
          <FyInput
            id="pwdNew"
            :req="true"
            :showLabel="true"
            :placeholder="$t('pwdchange_new_placeholder')"
            :validate="v$.pwd"
            :label="$t('pwdchange_new_label')"
            type="password"
            autocomplete="off"
          ></FyInput>
          <FyInput
            id="pwdNewConfirm"
            :req="true"
            :showLabel="true"
            :placeholder="$t('pwdchange_new_confirm_placeholder')"
            :validate="v$.pwdConfirm"
            :label="$t('pwdchange_new_confirm_label')"
            type="password"
            autocomplete="off"
          ></FyInput>
        </div>
        <div class="form-error-label" v-if="error">{{ error }}</div>
        <button
          class="btn-defaults mt-4 btn primary"
          type="submit"
        >
          {{ $t("save_new_pwd_button") }}
        </button>
      </form>
    </FyModal>

    <button
      class="btn primary btn-defaults"
      @click="
        () => {
          eventBus.emit('UpdatePwdModal', true);
        }
      "
    >
       <PencilSquareIcon
            stroke="currentColor"
            class="h-5 -mt-0.5 align-middle inline-block"
          /> {{ $t("change_pwd_btn") }}
    </button>
  </div>
  <FySelfLoading v-else :isLoading="true" style="height: 55px; " :size="[40,40]"/>
</template>
<script setup>
import { ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
import { notify } from "notiwind";
import { useEventBus, useTranslation } from "./../../";
import { getUser } from "./../../klb/api/user";
import FyInput from "./../../components/FyInput.vue";
import { updatePwd } from "./../../klb/api/user";
import FyModal from "./../../components/FyModal.vue";
import { PencilSquareIcon } from "@heroicons/vue/24/solid";

const eventBus = useEventBus();
const i18next = useTranslation();
const user = ref(null);
const error = ref(null);
const oldPwd = ref("");
const pwd = ref("");
const pwdConfirm = ref("");

const rules = {
  oldPwd: { required },
  pwd: { required },
  pwdConfirm: { req: required, sameAs: sameAs(pwd) },
};

const v$ = useVuelidate(rules, { oldPwd, pwd, pwdConfirm });

const submitUpdatePwd = async () => {
  eventBus.emit("loading", true);
  error.value = null;
  if (await v$.value.$validate()) {
    let tmp = await updatePwd(oldPwd.value, pwd.value).catch((err) => {
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
      eventBus.emit("UpdatePwdModal", false);
      eventBus.emit("loading", false);
    } else {
      error.value = i18next.t("pwdchange_invalid_password");
      eventBus.emit("loading", false);
    }
  }
  eventBus.emit("loading", false);
};

onMounted(async () => {
  user.value = await getUser();
});
</script>
