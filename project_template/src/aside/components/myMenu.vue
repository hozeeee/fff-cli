<template>
  <a-menu
    class="a_menu"
    mode="inline"
    :selectedKeys.sync="selectedKeys"
    :openKeys.sync="openKeys"
    :inlineIndent="12"
    @click="handleClick"
  >
    <template v-for="item in menuData">
      <a-menu-item
        v-if="!Array.isArray(item.children) || item.children.length===0"
        :key="item.id"
        :value="item"
      >
        <a-icon v-if="item.iconType" :type="item.iconType" />
        <span>{{ item.title }}</span>
      </a-menu-item>
      <SubMenu v-else :key="item.id" :menu-info="item" />
    </template>
  </a-menu>
</template>
<script>
import { getMenuPathKeys } from "../menuUtils";
// 这部分内容只是为了兼容"无线嵌套菜单"的情况。
// 若清楚自己的菜单有多少层嵌套，可以不用。同时 "runtimeCompiler:true" 的配置也可以去掉。
import { Menu } from "ant-design-vue";
const SubMenu = {
  template: `
    <a-sub-menu :key="menuInfo.id" v-bind="$props" v-on="$listeners">
      <span slot="title">
        <a-icon v-if="menuInfo.iconType" :type="menuInfo.iconType" />
        <span>{{ menuInfo.title }}</span>
      </span>
      <template v-for="item in menuInfo.children">
        <a-menu-item v-if="!Array.isArray(item.children) || item.children.length===0" :key="item.id" :value="item">
          <a-icon v-if="item.iconType" :type="item.iconType" />
          <span>{{ item.title }}</span>
        </a-menu-item>
        <SubMenu v-else :key="item.id" :menu-info="item" />
      </template>
    </a-sub-menu>
  `,
  name: "SubMenu",
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
};
export default {
  props: {
    menuData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedKeys: [],
      openKeys: [],
    };
  },
  methods: {
    handleClick({ item }) {
      this.$router.push(item.value.path);
    },
    handleRouteChange() {
      this.selectedKeys = [this.$route.meta.id];
      if (this.handleRouteChange.first) return;
      let openKeys = getMenuPathKeys(this.menuData, this.$route.meta.id);
      if (!Array.isArray(openKeys)) openKeys = [];
      this.openKeys = openKeys;
      this.handleRouteChange.first = true;
    },
  },
  watch: {
    $route: "handleRouteChange",
  },
  components: {
    SubMenu,
  },
};
</script>
<style lang="less" scoped >
.a_menu {
  width: 100%;
  height: 100%;
  text-align: left;
}
</style>