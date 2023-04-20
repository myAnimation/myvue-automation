<template>
  <div class="dashboard-container">
    <!-- <colorPicker v-model="color" v-on:change="headleChangeColor"></colorPicker> -->
    <!-- <sidebar-menu :menu="menu" /> -->
    <!-- <div class="BJ"></div> -->
    <p1>姜浩666</p1>
    <video src="~@/assets/jh.mp4" controls autoplay id ="video"></video>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import quickMenu from "vue-quick-menu";
export default {
  name: "Dashboard",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["name"]),
  },
  // components: { quickMenu },
  mounted() {
    // var box = document.querySelector(".box");
    // console.log("box", box);
    // box.classList = "open box";
  },
  methods: {
    // headleChangeColor(color) {
    //   console.log("1", color);
    //   console.log(hexToRgba(color))
    //   function hexToRgba(hex, opacity = 0.5) {
    //     if (!hex) hex = "#ededed";
    //     let rgba =
    //       "rgba(" +
    //       parseInt("0x" + hex.slice(1, 3)) +
    //       "," +
    //       parseInt("0x" + hex.slice(3, 5)) +
    //       "," +
    //       parseInt("0x" + hex.slice(5, 7)) +
    //       "," +
    //       (opacity || "1") +
    //       ")";
    //     return rgba;
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  height: 80vh;

}
#video{
  width: 100%;
  height: 90vh;
}
</style>
