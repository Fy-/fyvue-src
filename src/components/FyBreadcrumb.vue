<template>
  <div class="">
    <div
      class="fy-breadcrumb"
      aria-label="Breadcrumb"
    >
      <ol>
        <template v-for="item in nav">
          <li
            v-if="item.to"
            :key="item.to"
            class="bc-innactive"
          >
            <router-link
              :to="item.to"
              class="bc-active link"
            >
              {{
                $cropText(item.name, 15)
              }}
            </router-link>
            <ArrowRightIcon class="w-3 bc-innactive" />
          </li>
          <li
            v-else
            v-bind:key="item.to"
            class="flex items-center"
          >
            <span class="bc-innactive break-words">{{ $cropText(item.name, 15) }}</span>
          </li>
        </template>
      </ol>
    </div>
  </div>
</template>
<script>
import { ArrowRightIcon } from '@heroicons/vue/24/solid'

export default {
  name: "FyBreadcrumb",
  components: {
    ArrowRightIcon
  },
  props: {
    nav: {
      type: Array,
      default () {
        return [];
      }
    }
  }
};
</script>

