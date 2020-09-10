<template>
  <div class="footer_container">
    <img src="@/assets/img/fish.gif" style="height:100%;" id="swimming_fish_img" />
  </div>
</template>
<script>
export default {
  mounted() {
    /* 小章鱼的动画，自己删掉吧... */
    let fish = document.getElementById("swimming_fish_img");
    let fishWidth = Math.round(
      Number.parseFloat(window.getComputedStyle(fish).width)
    );
    let fishContainerWidth = Number.parseFloat(
      window.getComputedStyle(fish.parentElement).width
    );
    fish.style.position = "absolute";
    fish.style.top = 0;
    fish.style.left = `${-fishWidth}px`;
    fish.style.transition = "left 0.1s";
    setInterval(() => {
      let currentLeft = Number.parseFloat(fish.style.left);
      if (currentLeft > fishContainerWidth) {
        fish.style.left = `${-fishWidth}px`;
        fish.style.visibility = "hidden";
        return;
      }
      fish.style.visibility = "visible";
      fish.style.left = currentLeft + 2 + "px";
    }, 100);
    /* ************************* */
  },
};
</script>
<style lang="less" scoped>
.footer_container {
  height: 40px;
  width: 100%;
  background-color: pink;
  // text-align: left;
  position: relative;
  overflow: hidden;
}
</style>