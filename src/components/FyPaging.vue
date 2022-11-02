<template>
    <div
        class="paging flex items-center justify-center"
        v-if="items && items.page_max > 1 && items.page_no"
    >
        <div>
            <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
            >
                <a
                    href="javascript:void(0);"
                    @click="prev()"
                    v-if="items.page_no >= 2"
                    class="prev-next"
                >
                    <span class="sr-only">{ $t('previous') }</span>
                    <ChevronLeftIcon class="h-5 w-5" />
                </a>
                <a
                    v-if="items.page_no - 2 > 1"
                    class="innactive"
                    href="javascript:void(0);"
                    @click="page(1)"
                >
                    1
                </a>
                <span v-if="items.page_no - 2 > 2" class="dots"> ... </span>
                <template v-for="i in 2" :key="i">
                    <a
                        v-if="items.page_no - (3 - i) >= 1"
                        class="innactive"
                        href="javascript:void(0);"
                        @click="page(items.page_no - (3 - i))"
                    >
                        {{ items.page_no - (3 - i) }}
                    </a>
                </template>
                <a href="#" aria-current="page" class="active">
                    {{ items.page_no }}
                </a>
                <template v-for="i in 2" :key="i">
                    <a
                        v-if="items.page_no + i <= items.page_max"
                        class="innactive"
                        href="javascript:void(0);"
                        @click="page(items.page_no + i)"
                    >
                        {{ items.page_no + i }}
                    </a>
                </template>
                <span
                    v-if="items.page_no + 2 < items.page_max - 1"
                    class="dots"
                >
                    ...
                </span>
                <a
                    v-if="items.page_no + 2 < items.page_max"
                    class="innactive"
                    href="javascript:void(0);"
                    @click="page(items.page_max)"
                >
                    {{ items.page_max }}
                </a>
                <a
                    href="javascript:void(0);"
                    @click="next()"
                    v-if="items.page_no < items.page_max - 1"
                    class="prev-next"
                >
                    <span class="sr-only">{ $t('next') }</span>
                    <ChevronRightIcon class="h-5 w-5" />
                </a>
            </nav>
            <p class="paging-text">
                {{
                    $t("global_paging", {
                        start: items.results_per_page * (items.page_no - 1),
                        end: items.results_per_page * items.page_no,
                        total: items.count,
                    })
                }}
            </p>
        </div>
    </div>
</template>
<script>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";

export default {
  components: {
    ChevronLeftIcon, ChevronRightIcon
  },
  name: "FyPaging",
  props: {
    items: {
      type: Object,
      default() {
        return {};
      },
    },
    id: {
      type: String,
      default() {
        return "default";
      },
    },
  },
  mounted() {
    const routePage = parseInt(this.$route.query.page);
    if (!isNaN(routePage) && this.items) {
      if (this.isPageNew(routePage)) {
        this.$eventBus.emit(`${this.id}GoToPage`, routePage);
      }
    }
  },
  methods: {
    isPageNew(page) {
      return (
        page >= 1 &&
                page <= this.items.page_max &&
                page != this.items.page_no
      );
    },
    next() {
      let newPage = this.items.page_no + 1;
      if (!this.isPageNew(newPage)) return;

      this.$router
        .push({
          path: this.$route.path,
          query: { page: newPage },
        })
        .then(() => this.$eventBus.emit(`${this.id}GoToPage`, newPage));
    },
    prev() {
      let newPage = this.items.page_no - 1;
      if (!this.isPageNew(newPage)) return;
      this.$router
        .push({
          path: this.$route.path,
          query: { page: newPage },
        })
        .then(() => this.$eventBus.emit(`${this.id}GoToPage`, newPage));
    },
    page(page) {
      if (!this.isPageNew(page)) return;
      this.$router
        .push({
          path: this.$route.path,
          query: { page: page },
        })
        .then(() => this.$eventBus.emit(`${this.id}GoToPage`, page));
    },
  },
};
</script>
