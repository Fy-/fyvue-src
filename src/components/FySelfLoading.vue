<template>
  <template v-if="isLoading">
    <div class="fy-self-loader" :style="style">
      <div
        class="half-circle-spinner opacity-100"
        :style="`width: ${size[0]}px; height:${size[1]}px`"
      >
        <div class="circle circle-1" />
        <div class="circle circle-2" />
      </div>
    </div>
  </template>
</template>
<script setup>
const props = defineProps({ // eslint-disable-line
  isLoading: Boolean,
  style: Object,
  size: { type: Array, default: [100, 100] },
}); 
</script>
