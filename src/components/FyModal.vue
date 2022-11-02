<template>
  <TransitionRoot
    :show="isOpen"
    as="template"
    enter="duration-300 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <Dialog
      :open="isOpen"
      @close="setModal"
      style="background: rgba(0, 0, 0, 0.8)"
      class="fy-modal"
    >
      <div class="parent">
        <DialogPanel class="modal-container">
          <DialogTitle class="title">
            {{ title }}
            <a href="javascript:void(0)" @click="setModal(false)">
              <XCircleIcon class="close-icon"/>
            </a>
          </DialogTitle>
          <slot />
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
} from "@headlessui/vue";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { useEventBus } from "./../";

const eventBus = useEventBus();

const props = defineProps({
  // eslint-disable-line
  id: { type: String, default: "CustomModal" },
  title: { type: String, default: "" },
  onOpen: { type: Function, default: () => {} },
  onClose: { type: Function, default: () => {} },
});
const isOpen = ref(false);
const setModal = (value) => {
  if (value === true) props.onOpen();
  else {
    props.onClose();
  }
  isOpen.value = value;
};

onMounted(() => {
  eventBus.on(`${props.id}Modal`, setModal);
});
onUnmounted(() => {
  eventBus.on(`${props.id}Modal`, setModal);
});
</script>
