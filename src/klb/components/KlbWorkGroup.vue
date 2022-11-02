<template>
  <FyTable
    v-model:data="groups.data"
    v-if="groups"
    :headers="{
      Name: $t('workgroups_headers_name'),
      Type: $t('workgroups_headers_type'),
      Owner: $t('workgroups_headers_owner'),
      Actions: $t('workgroups_headers_actions'),
    }"
  >
    <template v-slot:Owner_item="property">
      {{ property.data.item.Owner.Email }}
    </template>
    <template v-slot:Name_item="property">
      <span class="text-md font-medium">{{ property.data.item.Name }}</span>
    </template>
    <template v-slot:Actions_item="property">
      <div class="flex space-x-2" v-if="property.data.item.Type != 'user'">
        <button
          class="btn primary px-2 py-1 text-sm"
          @click="
            () => {
              $eventBus.emit('KlbAddUserToGroup', property.data.item.User_Group__)
            }
          "
        >
          <UserPlusIcon
            stroke="currentColor"
            class="h-5 -mt-0.5 align-middle inline-block"
          />
          {{ $t("workgroup_add_user_modal_cta") }}
        </button>
        <button
          class="btn primary px-2 py-1 text-sm"
          @click="
            () => {
              $eventBus.emit('KlbGroupUsersModal', property.data.item.User_Group__);
            }
          "
        >
          <UsersIcon
            stroke="currentColor"
            class="h-5 -mt-0.5 align-middle inline-block"
          />
          {{ $t("workgroup_users_modal_cta") }}
        </button>
        <button
          class="btn primary px-2 py-1 text-sm"
          @click="
            () => {
              _deleteGroup(
                property.data.item.User_Group__,
                property.data.item.Name
              );
            }
          "
        >
          <TrashIcon
            stroke="currentColor"
            class="h-5 -mt-0.5 align-middle inline-block"
          />
          {{ $t("workgroup_delete_cta") }}
        </button>
      </div>
      <div v-else>n/a</div>
    </template>
  </FyTable>
  <KlbGroupUsersModal :roles="roles" />
  <KlbAddUserToGroupModal :roles="roles" :joinURL="joinURL" />
  <KlbAddGroupModal :onComplete="async ()=> { _getGroups(); }" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEventBus, useTranslation } from "./../..";
import {
  getGroups,
  delGroup
} from "./../../klb/api/user";

import {
  UserPlusIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/vue/24/solid";


const props = defineProps({// eslint-disable-lin
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
const i18next = useTranslation();
const groupUsers = ref(null);
const groups = ref(null);

const _deleteGroup = async (groupUuid, name) => {
  eventBus.emit("showConfirm", {
    title: i18next.t("workgroup_del_group_confirm_title"),
    desc: i18next.t("workgroup_del_group_confirm_desc", {
      group: name,
    }),
    onConfirm: async () => {
      eventBus.emit("loading", true);
      await delGroup(groupUuid);
      await _getGroups();
      eventBus.emit("loading", false);
      eventBus.emit("resetConfirm", true);
    },
  });
};
const _getGroups = async (page = 1, groupUuid = undefined) => {
  eventBus.emit("loading", true);
  groups.value = await getGroups(groupUuid);
  eventBus.emit("loading", false);
};
onMounted(async () => {
  await _getGroups();
});
</script>
