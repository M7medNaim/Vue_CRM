<template>
  <div class="app overflow-hidden">
    <div class="row">
      <div :class="sidebarClass">
        <LeftSidebar @toggle="handleSidebarToggle" />
      </div>
      <div :class="headerClass">
        <TopHeader />
      </div>
    </div>
  </div>
</template>

<script>
import TopHeader from "@/components/headers/TopHeader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
export default {
  data() {
    return {
      isSidebarCollapsed: true,
    };
  },
  computed: {
    sidebarClass() {
      return this.isSidebarCollapsed ? "col-1" : "col-2";
    },
    headerClass() {
      return this.isSidebarCollapsed ? "col-11" : "col-10";
    },
  },
  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    },
  },
  components: { TopHeader, LeftSidebar },
  name: "HomePage",
};
</script>
