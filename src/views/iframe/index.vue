<template>
  <div class="iframe-box">
    <!-- <iframe
      id="myiframe"
      ref="myiframe"
      src="http://192.168.3.181:9528"
      frameborder="0"
    ></iframe> -->
  </div>
</template>

<script>
import router from "@/router";
import Layout from "@/layout";
import myIframe from "@/views/myIframe/index.vue";
export default {
  data() {
    return {
      sonRouter: {},
      count: 0,
    };
  },
  mounted() {
    window.addEventListener("message", (e) => {
      if (e.data && e.data.path) {
        this.sonRouter = e.data;
      }
    });
    this.$nextTick(() => {
      this.getsonMessage();
    });
  },
  watch: {
    sonRouter: {
      handler(newval,oldVal) {
        if(oldVal.path === newval.path) return
        let routerObj = JSON.parse(JSON.stringify(newval));
        routerObj.component = Layout;
        routerObj.children.forEach((item) => {
          item.component = myIframe;
        });
        this.count += 1;
        if (this.count == 1) {
          this.$store.dispatch("user/createSonRouter", [routerObj]).then(res => {
            // console.log('res',res)
          router.addRoutes([routerObj]);
          })
        }
       
      },
    },
  },
  methods: {
    getsonMessage() {
      let myiframe = this.$refs["myiframe"];
      myiframe.onload = function () {
        myiframe.contentWindow.postMessage({ getRouter: "1" }, "*");
      };
    },
  },
};
</script>

<style lang='scss' scoped>
.iframe-box {
  width: 100%;
  height: 80vh;
  #myiframe {
    width: 100%;
    height: 100%;
  }
}
</style>