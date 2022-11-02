<template>
  <form @submit.prevent="onSubmit" v-if="!completed" class="klb-login">
    <div class="w-full">
      <h1>{{ $t("user_flow_title") }}</h1>
      <h2 class="message" v-if="responseMessage">{{ responseMessage }}</h2>
      <template v-if="responseFields.length > 0">
        <template v-for="field of responseFields" :key="field.label">
          <h3
            v-if="field.type == 'label'"
            class="label"
            :class="field.style == 'error' ? 'response-error' : ''"
          >
            {{ field.label }}
          </h3>
          <template v-if="field.cat == 'input'">
            <template
              v-if="
                field.type == 'text' ||
                field.type == 'password' ||
                field.type == 'email'
              "
            >
              <div class="input-group">
                <div>
                  <label class="label-basic" :for="`login${field.name}`">
                    {{ field.label }}
                    <sup
                      class="mandatory"
                      v-if="responseReq.includes(field.name)"
                      >*</sup
                    >
                  </label>
                </div>
                <div class="flex-1">
                  <div class="input-box">
                    <input
                      :placeholder="
                        field.name == 'name' ? 'John Doe' : field.label
                      "
                      :class="fieldsError[field.name] ? 'error-form' : ''"
                      class="input-basic"
                      :type="field.type"
                      v-model="formData[field.name]"
                      :id="`login${field.name}`"
                      :ref="
                        (el) => {
                          if (el) inputs.push(el);
                        }
                      "
                    />
                  </div>
                  <div class="form-error-label" v-if="fieldsError[field.name]">
                    {{ $t(fieldsError[field.name]) }}
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-if="field.type == 'checkbox'">
            <div class="mt-6">
              <label class="inline-flex text-xs" :for="`login${field.name}`">
                <input
                  type="checkbox"
                  class="form-checkbox"
                  :id="`login${field.name}`"
                  v-model="formData[field.name]"
                  :class="fieldsError[field.name] ? 'error-form' : ''"
                  :true-value="true"
                  :false-value="false"
                />
                <span class="ml-2">
                  <a
                    class="chekbox-label"
                    :href="field.link"
                    target="_blank"
                    >{{ field.label }}</a
                  >&nbsp;
                  <sup
                    class="mandatory"
                    v-if="responseReq.includes(field.name)"
                    >*</sup
                  >
                </span>
              </label>
            </div>
          </template>
        </template>
        <div class="oauth-container" v-if="hasOauth">
          <template v-for="field of responseFields" :key="field.id">
            <a
              @click="
                () => {
                  userFlow({ initial: true, oauth: field.id });
                }
              "
              v-if="field.type && field.type == 'oauth2'"
              href="javascript:void(0);"
            >
              <img
                :key="`${field.label}oauth`"
                class="oauth-button"
                :alt="field.info.Name"
                :src="field.button.logo"
                :style="`background: ${field.button['background-color']}`"
              />
            </a>
          </template>
        </div>
        <div class="response-error" v-if="responseError">
          {{ $t(responseError.token) }}
        </div>
        <div v-if="responseReq.includes('password') && 0" class="reset-pwd">
          <a
            href="javascript:void(0)"
            @click="
              () => {
                $eventBus.emit('ResetPasswordModal', true);
                pwdRecoverMailSent = false;
              }
            "
            >{{ $t("recover_pwd_link") }}</a
          >
        </div>
        <button
          @click="
            () => {
              userFlow();
            }
          "
          class="btn primary btn-defaults"
        >
          {{ $t("cta_login_next") }}
        </button>
      </template>
    </div>
  </form>
  <FyModal id="ResetPassword" :title="`${$t('recover_pwd_title')}`">
    <template v-if="!pwdRecoverMailSent">
      <FyInput
        id="emailRecover"
        :req="true"
        :showLabel="true"
        :placeholder="$t('recover_pwd_email_placeholder')"
        :validate="v$.userEmail"
        type="email"
        :label="$t('recover_pwd_email_label')"
      ></FyInput>
      <div class="response-error" v-if="pwdRecoverError">
        {{ $(pwdRecoverError.token) }}
      </div>
      <a
        href="javascript:void(0)"
        @click="forgotPassword()"
        class="mt-2 float-right btn px-5 py-2 primary"
        >{{ $t("recover_pwd_cta") }}</a
      ><br style="clear: both" />
    </template>
    <div v-else>
      {{ $t("pwd_recover_confirm") }}
    </div>
  </FyModal>
</template>

<script setup>
import { rest } from "@karpeleslab/klbfw";
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useEventBus } from "./../..";

const props = defineProps({
  // eslint-disable-line
  returnDefault: { type: String, default: "/" },
  forceAction: { type: String, default: "" },
});
const state = reactive({
  userEmail: "",
});
const rules = {
  userEmail: { required },
};
const eventBus = useEventBus();
const v$ = useVuelidate(rules, state);
const route = useRoute();
const returnTo = ref(props.returnDefault);
const responseMessage = ref(null);
const responseError = ref(null);
const responseReq = ref([]);
const responseFields = ref([]);
const response = ref(null);
const hasOauth = ref(false);
const fieldsError = ref({});
const store = useStore();
const pwdRecoverMailSent = ref(null);
const pwdRecoverError = ref(false);
const inputs = ref([]);

const formData = ref({
  return_to: "/l/en-US/",
  session: null,
  action: props.forceAction ? props.forceAction : undefined,
});
const completed = ref(false);

const forgotPassword = async () => {
  if (await v$.value.$validate()) {
    let data = await rest("User:forgot_password", "POST", {
      login: state.userEmail,
    }).catch((err) => {
      pwdRecoverError.value = err;
    });

    if (data.result == "success") {
      pwdRecoverMailSent.value = true;
    } else {
      console.log(data);
      //@TODO:
    }
  }
};

const userFlow = async (params = { initial: false }) => {
  eventBus.emit("loading", true);
  fieldsError.value = {};

  hasOauth.value = false;
  if (params.initial === false) {
    let hasError = false;
    responseReq.value.forEach((field) => {
      if (!formData.value[field] || formData.value[field] == "") {
        fieldsError.value[field] = "error_form_value_is_required";
        hasError = true;
      }
    });
    if (hasError) {
      eventBus.emit("loading", false);
      return;
    }
  }
  if (params.oauth) {
    formData.value.oauth2 = params.oauth;
  }
  returnTo.value = route.query.return_to
    ? route.query.return_to
    : props.returnDefault;
  if (!formData.value.session) {
    formData.value.session = route.query.session
      ? route.query.session
      : undefined;
  }
  response.value = await rest("User:flow", "POST", formData.value).catch(
    (err) => {
      responseError.value = err;
      if (responseError.value.param) {
        fieldsError.value[responseError.value.param] =
          responseError.value.token;
      }
      eventBus.emit("loading", false);
      return;
    }
  );
  if (response.value.result == "success") {
    if (response.value.data.url) {
      window.location = response.value.data.url;
      return;
    }
    if (response.value.data.complete == true && response.value.data.user) {
      store.dispatch("setSession", response.value.data.user.User__).then(() => {
        completed.value = true;
        window.location = returnTo.value;
      });
      return;
    }
    formData.value = {
      session: response.value.data.session,
    };
    inputs.value = [];
    state.userEmail = response.value.data.email;
    responseFields.value = response.value.data.fields;
    responseMessage.value = response.value.data.message;
    responseReq.value = response.value.data.req;
    responseFields.value.forEach((field) => {
      if (field.type == "oauth2") {
        hasOauth.value = true;
      }
    });
    setTimeout(() => {
      if (inputs.value.length > 0 && inputs.value[inputs.value.length - 1])
        inputs.value[inputs.value.length - 1].focus();
    }, 500);
  } else {
    console.log(response);
  }

  eventBus.emit("loading", false);
};

onMounted(async () => {
  await userFlow({ intial: true });
});
</script>
