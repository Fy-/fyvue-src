<template>
  <FyModal id="GroupAdd" :title="$t('workgroup_add_title_modal')">
    <form @submit.prevent="_addGroup">
      <FyInput
        id="groupName"
        :req="true"
        :showLabel="true"
        :placeholder="$t('workgroup_name_placeholder')"
        :validate="v$.group.groupName"
        :label="$t('workgroup_name_label')"
        type="text"
        autocomplete="off"
      ></FyInput>
      <button class="btn primary btn-defaults" type="submit">
        {{ $t("create_group_cta") }}
      </button>
    </form>
  </FyModal>
</template>

<script setup>
import useVuelidate from "@vuelidate/core";
import { reactive } from "vue";
import { required } from "@vuelidate/validators";
import { addGroup } from "./../../klb/api/user";
import { useEventBus } from "./../..";

const props = defineProps({ onComplete: Function, default: () => {} }); // eslint-disable-line
const eventBus = useEventBus();
const state = reactive({
  group: {
    groupName: "",
  },
});
const rules = {
  group: {
    groupName: { required },
  },
};
const v$ = useVuelidate(rules, state);
const _addGroup = async () => {
  eventBus.emit("loading", true);
  if (await v$.value.group.$validate()) {
    let res = await addGroup(state.group.groupName);
    if (res.result == "success") {
      props.onComplete(res.data.User_Group__);
    }
    eventBus.emit("GroupAddModal", false);
  }
  eventBus.emit("loading", false);
};
</script>
