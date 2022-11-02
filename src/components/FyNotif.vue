<template>
    <NotificationGroup group="default">
        <div
            class="fy-notify"
        >
            <div class="w-full max-w-sm">
                <Notification
                    v-slot="{ notifications }"
                    enter="transform ease-out duration-300 transition"
                    enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                    enter-to="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-500"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                    move="transition duration-500"
                    move-delay="delay-300"
                >
                    <div
                        class="ncontainer" 
                        v-for="notification in notifications"
                        :key="notification.id"
                    >
                        <div
                            class="notif" :class="notification.type ? notification.type : 'success'"
                        >
                            <CheckIcon class="w-6 h-6 text-white fill-current" v-if="(!notification.type || notification.type=='success')" />
                            <ExclamationTriangleIcon class="w-6 h-6 text-white fill-current" v-if="notification.type=='error'" />
                        </div>
                        <div class="px-4 py-2 -mx-3">
                            <div class="mx-3">
                                <span class="title" :class="notification.type ? notification.type : 'success'">{{
                                    notification.title
                                }}</span>
                                <p class="text-sm text-gray-600">
                                    {{ notification.text }}
                                </p>
                            </div>
                        </div>
                    </div>
                </Notification>
            </div>
        </div>
    </NotificationGroup>
</template>
<script setup>
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/solid";

</script>