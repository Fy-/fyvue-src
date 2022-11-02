<template>
  <div class="fy-step-bar">
    <div class="bar-bg">
      <div class="bar" :style="`width:${barWidth}%`"></div>
    </div>

    <ol>
      <li v-for="(step, index) in steps" v-bind:key="index" :class="getStepClass(index)">
        <span class="hidden sm:inline"> {{ $t(step.name) }} </span>

        <i class="h-6 w-6 sm:ml-2 sm:h-5 sm:w-5" :class="step.icon"></i>
      </li>
    </ol>
  </div>
</template>
<script>
export default {
  name: "FySteps",
  props: {
    steps: Array,
    currentStep: Number,
  },
  computed: {
    barWidth() {
      return (this.currentStep * 100) / this.steps.length;
    },
  },
  methods: {
    getStepClass(index) {
      if ((index+1) < this.currentStep) return "past-step";
      if ((index+1) == this.currentStep) return "current-step";
      return "future-step";
    },
  },
};
</script>
