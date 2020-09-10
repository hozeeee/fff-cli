<template>
  <div class="header_container">
    <img class="logo" src="@/assets/img/logo.gif" />
    <span class="title">我是头部...</span>
  </div>
</template>
<style lang="less" scoped>
.header_container {
  height: 40px;
  width: 100%;
  color: #fff;
  background-color: #003261;
  display: flex;
  align-items: center;
  .logo {
    height: 100%;
    margin-left: 20px;
  }
  .title {
    font-size: 20px;
    text-indent: 10px;
  }
}
</style>