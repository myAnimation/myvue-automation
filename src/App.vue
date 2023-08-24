<template>
  <div id="app" >
    <router-view />
    <!-- <iframe
      id="myiframe"
      ref="myiframe"
      src="http://localhost:9530"
      frameborder="0"
    ></iframe> -->
  </div>
</template>

<script>
import router from "@/router";
import Layout from "@/layout";
// import myIframe from "@/views/myIframe/index.vue";
export default {
  name: "App",
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
      handler(newval, oldVal) {
        if (oldVal.path === newval.path) return;
        let routerObj = JSON.parse(JSON.stringify(newval));
        routerObj.component = Layout;
        routerObj.children.forEach((item) => {
          item.component = myIframe;
        });
        this.count += 1;
        if (this.count == 1) {
          console.log(routerObj);
          this.$store
            .dispatch("user/createSonRouter", [routerObj])
            .then((res) => {
              // console.log('res',res)
              router.addRoutes([routerObj]);
            });
        }
      },
    },
    $route: {
      deep: true,
      handler(newVal) {
        if (newVal.path.includes("/lsdd")) {
          // console.log('111',newVal)
          this.$nextTick(() => {
            let myiframe = this.$refs["myiframe"];
            // myiframe.contentWindow.postMessage({ routeName: newVal.name }, "*");
          });

          console.log("newVal", newVal);
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
#myiframe {
  width: 0;
  height: 0;
}
</style>
