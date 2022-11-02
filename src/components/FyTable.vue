<template>
  <div class="fy-table" v-if="data && data.length">
    <div class="table-container">
      <table>
        <thead v-if="showHeaders">
          <tr>
            <th v-for="(title, property) in headers" :key="property">
              {{ title }}
              <button
                class="flex items-center th-cell"
                @click="toggleSort(property)"
              ></button>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in data" :key="index">
            <tr>
              <template v-for="(title, property) in headers" :key="property">
                <td
                  :ref="
                    (el) => {
                      if (el) {
                        if (!columns.hasOwnProperty(property))
                          columns[property] = {};
                        columns[property][index] = el.innerHTML;
                      }
                    }
                  "
                >
                  <slot
                    :name="`${property}_item`"
                    v-bind:data="{
                      prop: item[property],
                      item: item,
                      idx: index,
                    }"
                  >
                    <span v-if="item[property]">{{ item[property] }}</span
                    ><span v-else>n/a</span>
                  </slot>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  headers: {
    type: Object,
    default() {
      return {};
    },
  },
  showHeaders: {
    type: Boolean,
    default: true
  },
  data: {
    type: Array,
    default() {
      return [];
    },
  },
});
const columns = ref({});
</script>
