<template>
  <FyModal id="GroupUsers" :title="$t('workgroup_user_list_title')">
    <template v-if="groupUsers">
      <button
        class="btn primary px-2 py-1 text-sm float-right -mt-8"
        @click="
          () => {
            $eventBus.emit('GroupUsersModal', false);
            $eventBus.emit('KlbAddUserToGroup', groupUsers.data.User_Group__);
          }
        "
      >
        <UserPlusIcon
          stroke="currentColor"
          class="h-5 -mt-0.5 align-middle inline-block"
        />
        {{ $t("workgroup_add_user_modal_cta") }}
      </button>
      <p class="default-p -mt-6 mb-3">
        {{ $t("workgroup_summary_group") }} <b>{{ groupUsers.data.Name }}</b>
        <small>
          ({{ $t("workgroup_summary_owned_by") }}
          <i>{{ groupUsers.data.Owner.Email }}</i
          >)</small
        >
      </p>
      <FyTable
        v-model:data="groupUsers.data.Members"
        :headers="{
          Name: $t('workgroups_users_headers_name'),
          Access: $t('workgroups_users_headers_access'),
          Actions: $t('workgroups_users_headers_actions'),
        }"
      >
        <template v-slot:Actions_item="property">
          <button
            class="btn primary px-2 py-1 text-sm"
            @click="
              () => {
                $eventBus.emit('showConfirm', {
                  title: $t('workgroup_del_user_confirm_title'),
                  desc: `${$t('workgroup_del_user_confirm_desc', {user: property.data.item.User.Display_Name, group:groupUsers.data.Name})}`,
                  onConfirm: async () => {
                    await _delUserFromGroup(property.data.item.User.User__);
                  },
                });
              }
            "
          >
            <UserMinusIcon
              stroke="currentColor"
              class="h-5 -mt-0.5 align-middle inline-block"
            />
          </button>
        </template>
        <template v-slot:Name_item="property">
          {{ property.data.item.User.Profile.Display_Name }}
          <small>({{ property.data.item.User.Email }})</small>
        </template>
        <template v-slot:Access_item="property">
          {{ getRole(property.data.item.Access) }}
        </template>
      </FyTable>
    </template>
  </FyModal>
</template>
<script setup>
import { useEventBus } from "./../..";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/vue/24/solid";
import { delUserFromGroup, getGroups } from "./../../klb/api/user";
import { ref, onMounted } from "vue";

const groupUsers = ref(null);
const groupUserModal = async (groupUuid) => {
  eventBus.emit("loading", true);
  groupUsers.value = await getGroups(groupUuid);
  eventBus.emit("GroupUsersModal", true);
  eventBus.emit("loading", false);
};

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
});
const eventBus = useEventBus();
const getRole = (role) => {
  if (role === "O") return "Owner";
  return props.roles.filter((r) => r[0] == role)[0][1];
};

const _delUserFromGroup = async (user) => {
  eventBus.emit("loading", true);
  await delUserFromGroup(groupUsers.value.data.User_Group__, user);
  groupUsers.value = await getGroups(groupUsers.value.data.User_Group__);
  eventBus.emit("resetConfirm", true);
  eventBus.emit("loading", false);
};
onMounted(async () => {
  eventBus.on("KlbGroupUsersModal", async (groupUuid) => {
    await groupUserModal(groupUuid);
  });
  eventBus.on("KlbAddUserToGroupCompleted", async (groupUuid) => {
    eventBus.emit("loading", true);
    groupUsers.value = await getGroups(groupUuid);
    eventBus.emit("GroupUsersModal", true);
    eventBus.emit("loading", false);
  });
});
///KlbAddUserToGroupCompleted
</script>
