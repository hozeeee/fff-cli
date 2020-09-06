<template>
  <div id="app">
    <Header class="__top__" />
    <div class="__center__">
      <div class="__left__">
        <Aside />
      </div>
      <div class="__content__">
        <router-view />
      </div>
      <div class="__right__"></div>
    </div>
    <Footer class="__bottom__" />
  </div>
</template>

<script>
import Header from "@/header";
import Footer from "@/footer";
import Aside from "@/aside";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    Aside,
  },
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow: auto;
  min-height: 600px;
  min-width: 900px;
}
</style>
