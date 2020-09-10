<template>
  <div class="aside_container" :class="showMenu? '': 'hide_menu'">
    <div class="menu_content" ref="prefectScrollbarContainer">
      <myMenu :menuData="menuData" />
    </div>
    <div class="slide_left_btn_container">
      <div class="slide_left_btn" @click="showMenu = !showMenu">
        <a-icon type="double-left" class="icon" />
      </div>
    </div>
  </div>
</template>
<script>
import myMenu from "./components/myMenu";
import { transformMenuToRoutes } from "./menuUtils"; // 将菜单列表转换成路由列表，并添加到路由器

/* 这是模拟的数据。实际可能通过后台接口，或读取本地存取的数据。请根据您的实际情况去修改 */
import mockMenuList from "./mockMenuList";
/* **************************************************************************** */

export default {
  data() {
    return {
      menuData: mockMenuList,
      showMenu: true,
      // 滚动条组件
      pScrollbar: null,
    };
  },
  mounted() {
    let el = this.$refs.prefectScrollbarContainer;
    this.pScrollbar = new this.$PerfectScrollbar(el);
    this.pScrollbar.update();
  },
  created() {
    // "菜单"转成"路由"
    transformMenuToRoutes(this.menuData);
  },
  beforeDestroy() {
    if (this.ps && typeof this.pScrollbar.destroy === "function")
      this.pScrollbar.destroy();
    this.pScrollbar = null;
  },
  components: { myMenu },
};
</script>
<style lang="less" scoped>
.aside_container {
  @aside_width: 180px; // aside 总宽度
  @slide_left_btn_width: 20px; // 收起按钮的宽度

  width: @aside_width;
  height: 100%;
  position: relative;
  display: flex;
  transition: width 0.5s;
  &.hide_menu {
    width: @slide_left_btn_width;
    .icon {
      transform: rotateY(180deg);
    }
  }
  .menu_content {
    background-color: #eee;
    position: absolute;
    top: 0;
    right: @slide_left_btn_width;
    width: @aside_width - @slide_left_btn_width;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    border-right: 1px solid #aaa;
  }
  .slide_left_btn_container {
    position: absolute;
    top: 0;
    right: 0;
    width: @slide_left_btn_width;
    height: 100%;
    display: flex;
    align-items: center;
    .slide_left_btn {
      border: 1px solid #aaa;
      border-left: none;
      border-radius: 0 4px 4px 0;
      background-color: #eee;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      width: 14px;
      .icon {
        transition: transform 0.5s;
      }
    }
  }
}
</style>