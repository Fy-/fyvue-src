<template>
  <div v-if="loading">
    <div class="fy-loader " style="z-index: 60 !important;">
      <div
        class="loader-container  "
        style="top: 50%"
      >
        <div><div class="half-circle-spinner opacity-100">
          <div class="circle circle-1" />
          <div class="circle circle-2" />
        </div>
        <div
          class="loader-text"
        >
          {{$t('global_loading_text')}}
        </div></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "FyLoader",
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.$eventBus.on("loading", (value) => {
      this.loading = value;
    });
  },
};
</script>
