<template>
  <div class="fy-circle-percent">
    <svg viewBox="0 0 36 36" class="circular-chart">
      <path
        class="circle-bg"
        d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        class="circle"
        :stroke-dasharray="`${percent}, 100`"
        d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text :x="textXY[0]" :y="textXY[1]" class="percentage">{{ percent }}%</text>
    </svg>
  </div>
</template>
<script setup>
defineProps({ percent: Number, textXY: { type: Array, default: [18, 20.85] } });
</script>
