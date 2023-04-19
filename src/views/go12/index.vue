<template>
  <div class="canvas">
    <div class="btn-list">
      <el-button type="primary" @click="changeJSON(0)">更换为图片</el-button>
      <el-button type="primary" @click="changeJSON(1)">更换为节点</el-button>
      <el-button v-if="DiagramConfig.isReadOnly" @click="editGoCavas(false)">修改</el-button>
      <el-button v-if="!DiagramConfig.isReadOnly" @click="editGoCavas(true)" type="danger">取消</el-button>
      <el-button v-if="!DiagramConfig.isReadOnly" @click="save">保存</el-button>
    </div>
    <myCanvas :json="json" :DiagramConfig="DiagramConfig" :nodeAndLineEvent="nodeAndLineEvent" :lineStyle="lineStyle"
      :nodeStyle="nodeStyle" :lineTextStyle="lineTextStyle" :nodeTextStyle="nodeTextStyle"
      :RightClickMenu="RightClickMenu" :lineAddStyleList="lineAddStyleList" ref="goCanvas"></myCanvas>
    <el-dialog title="" :visible.sync="dialogVisible" width="600" :before-close="() => (dialogVisible = false)">
      <textarea name="" v-model="myJson" id="" cols="120" rows="40">
     
    </textarea>
    </el-dialog>
  </div>
</template>

<script>
import myCanvas from "./myCanvas/index.vue";
import json from "@/views/go12/json";
import json1 from "@/views/go12/json1";
import gojs from "gojs";
import zhong from "@/assets/dashboard/blue/zhong.png";
import dc from "@/assets/dashboard/blue/dc.png";
import da from "@/assets/dashboard/blue/da.png";
import xiao from "@/assets/dashboard/blue/xiao.png";
import redzhong from "@/assets/dashboard/red/zhong.png";
var go = gojs;
var $ = go.GraphObject.make;
export default {
  name: "goCanvas",
  components: { myCanvas },
  data() {
    return {
      // gojs默认配置项
      DiagramConfig: {
        // 控制是否可以编辑状态
        isReadOnly: true,
        // 最小缩小
        minScale: 0.3,
        // 最大放大
        maxScale: 1.5,
        // 默认视图大小
        scale: 0.4,
        // "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone, //鼠标滚轮事件禁止
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        // allowHorizontalScroll: false, //禁止水平拖动
        // allowVerticalScroll: false, // 禁止垂直拖动
      },
      // 节点和线路事件
      nodeAndLineEvent: {
        nodeEvent: {
          // 例如双击击事件
          doubleClick: this.nodedbClick,
        },
        lineEvent: {
          doubleClick: this.linedbClick,
        },
      },
      // 线路样式自定义（组件默认有封装）
      lineStyle: {
        // 样式配置
        style: {
          stroke: "black",
          strokeWidth: 4,
        },
        // 需要动态绑定值
        Binding: [
          {
            // 例如 stroke 线条颜色 需要动态绑定线路名称 并指定该线路变为黄色
            stroke: "color",
            fn: (color) => {
              return color;
            },
          },
          {
            strokeWidth: "port1",
            fn: (port1) => {
              if (port1 == "童医1670") {
                return 20;
              }
              return 4;
            },
          },
        ],
      },
      // 线的文字样式自定义
      lineTextStyle: {
             // 文字样式配置
        style: {
          stroke: "#fff",
        },
        // 需要动态绑定值
        Binding: [
          {
            text: "port1",
          },
        ],
      },
      // 线路动画样式(以及需要额外添加的样式)
      lineAddStyleList: [
        // {
        //   style: {
        //     // stroke: "lightblue",
        //     stroke: "#01C0CA",
        //     // stroke: "",
        //     strokeWidth: 8,
        //     name: "DongHua",
        //     strokeDashArray: [10, 35],
        //   },
        //   Binding: [],
        // },
      ],
      // 节点样式自定义（组件默认有封装）
      nodeStyle: {
        // 样式配置(分别又两种配置 1.gojs自带节点 2.使用图片 (两种为互斥选项))
        ShapeStyle: {
          fill: "#042334",
        },
        ShapeBinding: [
          {
            fill: "background",
            fn: (k) => {
              return k;
            },
          },
        ],
        // PictureStyle: {
        //   width: 100,
        //   height: 100,
        //   cursor: "pointer",
        //   background: null,
        // },
        // PictureBinding: [
        //   {
        //     source: "source",
        //   },
        //   {
        //     width: "size",
        //     fn: (size) => {
        //       if (+size === 100) {
        //         return 120;
        //       }
        //       return +size;
        //     },
        //   },
        //   {
        //     height: "size",
        //     fn: (size) => {
        //       if (+size === 120) {
        //         return 85;
        //       }
        //       if (+size === 100) {
        //         return 120;
        //       }
        //       return +size;
        //     },
        //   },
        // ],
      },
      // 节点文字样式自定义
      nodeTextStyle: {
        style: {
          stroke: "#fff",
        },
        // 需要动态绑定值
        Binding: [
          {
            text: "name",
          },
          {
            font: "font",
          },
        ],
      },
      // 右键事件
      RightClickMenu: {
        // 大节点右键配置(内置 粘贴复制)
        copyPaste: true,
        // 大节点右键配置(内置 删除节点)
        nodeDelete: true,
        // 添加端口（小节点）用于连线内置 四个方向进行添加
        addPort: true,
        // 后续大节点功能可自己添加
        nodeMenu: [
          {
            title: '更改背景',
            fn: (e, obj) => {
              this.changeBackground(obj.part.adornedObject)
            }
          }
        ],
        // 小节点事件 内置单删
        portDelete: true,
        // 小节点事件 内置多删
        portDeleteAll: true,
        //后续小节点功能可自己添加
        portMenu: [{
          title: '更改小节点颜色',
          fn: (e, obj) => {
            this.changeColor(obj.part.adornedObject)
          }
        }],
        // 连线事件 内置单删
        lineDelete: true,
        //后续连线功能可自己添加
        lineMenu: [
          {
            title: '更改线路颜色',
            fn: (e, obj) => {
              this.changeLineColor(obj.part.adornedObject)
            }
          },
        ]
      },
      // 结果查看弹框
      dialogVisible: false,
      myJson: {},
    };
  },
  created() {
    // 节点的JSON
    // this.json = json;
    //图片的JSON
    json1.nodeDataArray.forEach(item => item.name = "")
    json1.linkDataArray.forEach(item => item.port1 = "")
    this.json = JSON.parse(JSON.stringify(json1));
  },
  mounted() { },
  methods: {
    // 节点事件
    nodedbClick(e, obj) {
      //   拿到节点当前的信息
      console.log("节点属性", e.diagram.selection.first().data);
    },
    // 节点事件
    linedbClick(e, obj) {
      console.log("线路属性", obj.part.data);
    },
    // 编辑
    editGoCavas(flag) {
      this.DiagramConfig.isReadOnly = flag;
    },
    // 当前数据 （修改之后 发送至后端保存项）
    save() {
      this.myJson = this.$refs["goCanvas"].save();
      this.DiagramConfig.isReadOnly = true;
      this.dialogVisible = true;
      console.log("myJSon", myJson);
    },
    // 更换数据
    changeJSON(flag) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (flag) {
        this.nodeStyle = {
          ShapeStyle: {
            fill: "#042334",
          },
          ShapeBinding: [
            {
              fill: "background",
              fn: (k) => {
                return k;
              },
            },
          ],
        };
        let json3 = JSON.parse(JSON.stringify(json1));
        json3["nodeDataArray"].forEach((item) => {
          delete item.source;
        });
        this.json = json3;
        this.$nextTick(() => {
          // this.$refs["goCanvas"].myDiagram.div = null;
          // this.$refs["goCanvas"].init();
          // this.AnimationYes();
        });
        return;
      }

      this.nodeStyle = {
        PictureStyle: {
          width: 100,
          height: 100,
          cursor: "pointer",
          background: null,
        },
        PictureBinding: [
          {
            source: "source",
          },
          {
            width: "size",
            fn: (size) => {
              if (+size === 100) {
                return 120;
              }
              return +size;
            },
          },
          {
            height: "size",
            fn: (size) => {
              if (+size === 120) {
                return 85;
              }
              if (+size === 100) {
                return 120;
              }
              return +size;
            },
          },
        ],
      };
      let json2 = JSON.parse(JSON.stringify(json1));
      json2["nodeDataArray"].forEach((item) => {
        delete item.background;
        switch (+item.size) {
          case 100:
            item.source = xiao;

            break;
          case 150:
            item.source = zhong;

            break;
          case 120:
            item.source = dc;

            break;
          case 200:
            item.source = da;

            break;
          default:
            item.source = xiao;
            break;
        }
      });
      this.json = json2;
      this.$nextTick(() => {
        // this.$refs["goCanvas"].myDiagram.div = null;
        // this.$refs["goCanvas"].init();
        // this.AnimationYes();
        // this.changeImg();
      });
    },
    // --------------------自行添加-------------------------
    // 子组件连线动画
    AnimationYes() {
      var animation = new go.Animation();
      animation.easing = go.Animation.EaseLinear;
      this.$refs["goCanvas"].myDiagram.links.each(function (link) {
        animation.add(link.findObject("DongHua"), "strokeDashOffset", 60, 20);
      });
      animation.runCount = Infinity;
      animation.start();
    },
    // 子组件节点动画
    changeImg() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.$refs["goCanvas"].myDiagram.nodes.each((node) => {
          if (node.findObject("Picture")) {
            node.findObject("Picture").source =
              node.findObject("Picture").source === zhong ? redzhong : zhong;
          }
        });
      }, 280);
    },

    // 更改节点背景色
    changeBackground(port) {
      // this.$refs['goCanvas'].myDiagram.startTransaction("colorPort");
      const data = port.data;
      console.log(data)
      if (data['source']) {

        this.$refs['goCanvas'].myDiagram.model.setDataProperty(data, "source", redzhong);
        return
      }
      if (data['background']) {
        this.$refs['goCanvas'].myDiagram.model.setDataProperty(data, "background", "red");

      }

      // this.$refs['goCanvas'].myDiagram.commitTransaction("colorPort");
    },
    // 更改小节点颜色
    changeColor(port) {
      this.$refs['goCanvas'].myDiagram.startTransaction("colorPort");
      const data = port.data;
      this.$refs['goCanvas'].myDiagram.model.setDataProperty(data, "portColor", "red");
      this.$refs['goCanvas'].myDiagram.commitTransaction("colorPort");
    },
    // 更改线路颜色
    changeLineColor(port) {
      const data = port.data;
      this.$refs['goCanvas'].myDiagram.model.setDataProperty(data, "color", "red");
      console.log(data)
    },
  },
};
</script>

<style lang='scss' scoped>
.canvas {
  width: 100%;
  height: 90vh;
  position: relative;
  // margin-right: 5%;
  // margin-left: 5%;
  // padding: 40px;
  // margin: 0 auto;
  background-image: url("~@/assets/bj/BJ.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-content: center;

  #myDiagram {
    width: 100%;
    height: 100%;

    // border: 1px solid #fff;
  }

  .btn-list {
    position: absolute;
    left: 0px;
    top: -30px;
  }
}
</style>