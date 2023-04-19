<template>
  <div class="iframe-box">
    <iframe id="ssss" :src="src" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sonRouter: {},
      src: "http://192.168.3.181:9528",
    };
  },
 watch:{
   $route: {
    immediate: true,
    deep: true,
    handler(newVal) {
      console.log("2222", newVal.path);
      if (newVal.path.includes("/lsdd")) {
          this.src = 'http://192.168.3.181:9528/#' + newVal.path.replace('/lsdd','')
          console.log(this.src)
      }
    },
  }
 },
  mounted() {},

  methods: {},
};
</script>

<style lang='scss' scoped>
.iframe-box {
  width: 100%;
  height: 80vh;
  #ssss {
    width: 100%;
    height: 100%;
  }
}
</style>