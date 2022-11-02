<template>

    <div >
        <Dialog
            :open="confirm"
            @close="setConfirm"
            class="fy-modal"
            style="background: rgba(0, 0, 0, 0.6); z-index:51 !important;"
        >
            <div class="parent">
                <DialogOverlay />
                <div
                    class="modal-container" style="width: 350px !important; padding: 1rem !important;"
                >
                    <div>
                        <DialogTitle class="confirm-modal-desc-title">{{
                            title
                        }}</DialogTitle
                        ><div class="confirm-modal-desc default-p">{{ desc }}</div><br />
                        <div class="btn-box">
                            <button
                                @click="setConfirm(false)"
                                class="btn neutral btn-defaults"
                            >
                                {{ $t("confirm_modal_cta_cancel") }}
                            </button>
                            <button
                                @click="onConfirm()"
                                class="btn primary btn-defaults"
                            >
                                {{ $t("confirm_modal_cta_confirm") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>
<script>
import { ref } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";

export default {
  name: "FyConfirm",
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
  },
  setup() {
    let confirm = ref(false);

    return {
      confirm,
      setConfirm(value) {
        confirm.value = value;
      },
    };
  },
  data() {
    return {
      title: "",
      desc: "",
      onConfirm: () => {},
    };
  },
  created() {
    this.$eventBus.on("resetConfirm", () => {
      this.title = "";
      this.onConfirm = () => {};
      this.setConfirm(false);
    });
    this.$eventBus.on("showConfirm", (data) => {
      this.title = data.title;
      this.desc = data.desc;
      this.onConfirm = data.onConfirm;
      this.setConfirm(true);
    });
  },
};
</script>
