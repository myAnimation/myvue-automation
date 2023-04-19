<template>
  <div class="caidan">
    <div class="container">
      <div class="circle">
        <div class="circle__item" v-for="item in list"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [1, 2,3,4,5,6,7,8,9,10],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      const container = document.querySelector(".container");
      const containerWidth = container.clientWidth;
      const circleList = Array.from(document.querySelectorAll(".circle__item"));
      console.log("circleList", circleList);
      // 角度转弧度
      const transformToRadians = (degrees) => degrees * (Math.PI / 180);
      // 圆半径
      const circleRadius = containerWidth / 2;
      // 圆心
      const circlePointX = circleRadius;
      const circlePointY = circleRadius;
      // 划分多少等分
      const count = circleList.length;
      //   let cache = {};
      function changeItemAngle() {
        let cache = {
          // 起点
          angleStart: 0,
          //   度数
          circle: 360,
        //   circle: 370,
        };
        // 划分的角度
        const angle = Math.floor(cache.circle / count);

        circleList.forEach((item, index) => {
          // 转为 0 - 360 度
          const itemAngle = (angle * (index + 1) + cache.angleStart) % 360;
          // 弧度
          const itemRadians = transformToRadians(itemAngle);
          const { clientWidth, clientHeight } = item;

          let top = circleRadius * Math.sin(itemRadians) + circlePointY;
          let left = circleRadius * Math.cos(itemRadians) + circlePointX;

          // 为了让子节点紧贴圆内壁
          if (itemAngle < 90 && itemAngle >= 0) {
            top -= clientHeight;
            left -= clientWidth;
          } else if (itemAngle >= 90 && itemAngle < 180) {
            top -= clientHeight;
          } else if (itemAngle >= 270 && itemAngle < 360) {
            left -= clientWidth;
          }

          item.style.top = top + "px";
          item.style.left = left + "px";
          item.innerText = itemAngle;
        });
      }
      changeItemAngle();
    },
  },
};
</script>

<style lang='scss' scoped>
.caidan {
  width: 100%;
  height: 90vh;
  //   background: red;
  .container {
    position: relative;
    width: 600px;
    height: 600px;
  }

  .circle {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 9px 30px 3px rgba(0, 0, 0, 0.46);
  }
  .circle__item {
    position: absolute;
    width: 40px;
    height: 40px;
    background: linear-gradient(70deg, #0ebeff, #ffdd40, #ae63e4, #47cf73);
  }
}
</style>