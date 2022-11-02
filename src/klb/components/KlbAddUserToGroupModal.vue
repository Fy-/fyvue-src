<template>
<FyModal id="AddUserGroup" :title="$t('workgroup_user_add_title')">
  <template v-if="groupUsers">
    <p class="default-p -mt-6 mb-3" >
      {{ $t("workgroup_summary_group") }} <b>{{ groupUsers.data.Name }}</b>
      <small>
        ({{ $t("workgroup_summary_owned_by") }}
        <i>{{ groupUsers.data.Owner.Email }}</i
        >)</small
      >
    </p>

    <p class="default-p my-2">{{ $t("workgroup_user_add_description") }}</p>
    <form @submit.prevent="_addUserToGroup()">
      <FyInput
        id="groupUserEmail"
        :req="true"
        :showLabel="true"
        :placeholder="$t('workgroup_useradd_email_placeholder')"
        :validate="v$.user.email"
        :label="$t('workgroup_useradd_email_label')"
        type="text"
        autocomplete="off"
      ></FyInput>
      <FyInput
        id="groupUserRole"
        :req="true"
        :showLabel="true"
        :validate="v$.user.role"
        :options="roles"
        :label="$t('workgroup_useradd_role_placeholder')"
        type="select"
        autocomplete="off"
      ></FyInput>
      <div
        class="default-p-err mt-4"
        v-if="addUserGroupError && addUserGroupError.token"
      >
        {{ $t(addUserGroupError.token) }}
      </div>
      <button class="btn primary btn-defaults" type="submit">
        {{ $t("add_user_to_group_cta") }}
      </button>
    </form>
    <p class="default-p mt-4 mb-4">
      {{ $t("workgroup_user_add_invite_link_description") }}
    </p>
    <form
      @submit.prevent="
        () => {
          generateAccessLink();
        }
      "
      class="flex flex-nowrap items-stretch w-full"
    >
      <input
        type="text"
        aria-invalid="false"
        disabled="true"
        style="border: 1px solid #eee"
        class="input-basic"
        v-model="accessLinkLink"
      />
      <button
        class="btn accent p-3"
        style="border-radius: 0; border: 3px solid #eee"
        v-if="accessLinkLink"
        @click.prevent="
          () => {
            copyText(accessLinkLink, undefined, () => {});
            notify(
              {
                group: 'default',
                title: $t('notif_success_title'),
                text: $t('workgroup_link_invite_copy_confirm'),
              },
              4000
            );
          }
        "
      >
        <ClipboardDocumentIcon
          stroke="currentColor"
          class="h-5 -mt-0.5 align-middle inline-block"
        />
      </button>
      <button
        class="btn primary p-3"
        style="border-radius: 0; border: 3px solid #eee"
        type="submit"
      >
        {{ $t("group_invite_link_cta") }}
      </button>
    </form>
  </template>
  </FyModal>
</template>
<script setup>
import { ClipboardDocumentIcon } from "@heroicons/vue/24/solid";
import { copyText } from "vue3-clipboard";
import { notify } from "notiwind";
import { useEventBus } from "./../..";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { ref, reactive, onMounted } from "vue";
import { addUserToGroup, getGroups, groupLinkAccess } from "./../../klb/api/user";

const props = defineProps({
  roles: {
    type: Array,
    default: [
      ["A", "Administrator"],
      ["W", "Write access"],
      ["C", "Create access"],
      ["R", "View only"],
    ],
  },
  joinURL: String,
});
const eventBus = useEventBus();
const addUserGroupError = ref(null);
const user = ref(null);
const accessLink = ref(null);
const accessLinkLink = ref(null);
const groupUsers = ref(null);
const state = reactive({
  user: {
    email: "",
    role: "R",
  },
});
const rules = {
  user: {
    email: { required, email },
    role: { required },
  },
};
const v$ = useVuelidate(rules, state);
const addUserModal = async (groupUuid) => {
  eventBus.emit("loading", true);
  groupUsers.value = await getGroups(groupUuid);
  eventBus.emit("AddUserGroupModal", true);
  accessLinkLink.value = null;
  eventBus.emit("loading", false);
};
const _getGroupUsers = async (page = 1, groupUuid) => {
  eventBus.emit("loading", true);
  groupUsers.value = await getGroups(groupUuid);
  eventBus.emit("loading", false);
};
const generateAccessLink = async () => {
  eventBus.emit("loading", true);
  accessLink.value = await groupLinkAccess(
    groupUsers.value.data.User_Group__,
    state.user.role
  );
  accessLinkLink.value = props.joinURL + accessLink.value.data.Link;
  eventBus.emit("loading", false);
};
const _addUserToGroup = async () => {
  eventBus.emit("loading", true);

  if (await v$.value.user.$validate()) {
    addUserGroupError.value = null;
    let result = await addUserToGroup(
      groupUsers.value.data.User_Group__,
      state.user.email,
      state.user.role
    ).catch((err) => {
      addUserGroupError.value = err;
      eventBus.emit("loading", false);
      return;
    });

    if (result.result == "success") {
      eventBus.emit("AddUserGroupModal", false);
      eventBus.emit(
        "KlbAddUserToGroupCompleted",
        groupUsers.value.data.User_Group__
      );
    }
  }
  eventBus.emit("loading", false);
};

onMounted(async () => {
  eventBus.on("KlbAddUserToGroup", async (groupUuid) => {
    eventBus.emit("loading", true);
    await addUserModal(groupUuid);
    eventBus.emit("loading", false);
  });
});
</script>
