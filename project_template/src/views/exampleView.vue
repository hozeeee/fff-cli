<template>
  <div class="home_container">
    <span style="font-size:60px; line-height:160px;">{{ $route.meta.title || $route.name }}</span>
  </div>
</template>
<style lang="less" scoped>
.home_container {
  height: 100%;
  width: 100%;
  background-color: rgb(240, 240, 240);
}
</style>