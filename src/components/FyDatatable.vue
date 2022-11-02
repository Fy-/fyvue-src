<template>
  <table class="border-collapse w-full md:mx-0 fy-datatable" v-if="data && data.length > 0">
    <thead v-if="showHeaders">
      <tr>
        <th
          v-for="title in headers" :key="`header_${title}`"
        >
          {{ title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, index) in data" :key="index">
        <tr
          :class="`tr ${bgColor(index)} `"
        >
          <template v-for="(title, property) in headers" :key="title">
            <td
              class="td "
            >
              <div
                class="div"
                >{{ title }}</div
              >
              <div class="px-2 md:px-0">
              <slot
                :name="`${property}_item`"
                v-bind:data="{ prop: item[property], id: item.id, item: item, idx: index }"
              >
                <span v-if="item[property]">{{ item[property] }}</span><span v-else>n/a</span>
              </slot>
            </div>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script>

export default {
  name: "FyDatatable",
  props: {
    showHeaders: {
      type: Boolean,
      default: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    bgColor(i) {
      if (i % 2 == 0) {
        return 'bg-gray-200'
      }
      return 'bg-gray-100'
    }
  }
};
</script>
