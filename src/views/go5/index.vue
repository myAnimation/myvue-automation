<template>
  <div class="goDemo" style="display: flex">
    <div id="myDiagramDiv"></div>
    <button @click="shiftNode" style="height: 30px">点击我</button>
  </div>
</template>

<script>
import { Diagram } from "gojs";
var $ = go.GraphObject.make;
export default {
  name: "go5",
  data() {
    return {
      myDiagram: null,
      dataOBJ: {
        lianxi1: [
          { name: "B1", source: require("../../assets/bj/haibian.png") },
          { name: "B2", source: require("../../assets/bj/dog.png") },
          { name: "B3", source: require("../../assets/bj/cat.png") },
          {},
        ],
        lianxi2: {
          node: [
            { key: "A", name: "策略一" },
            { key: "B", name: "环保" },
            { key: "C", name: "学习" },
          ],
          line: [
            { from: "A", to: "B" },
            { from: "B", to: "C" },
            // { from: "C", to: "B" },
          ],
        },
        lianxi3: [
          // the nodeDataArray
          { key: "A", name: "a", parent: "C" },
          { key: "B", name: "b", parent: "C" },
          { key: "C", name: "c" },
        ],
      },
      nodeDataArray: [
        { key: "Alpha", loc: new go.Point(0, 0) },
        { key: "gg", loc: new go.Point(60, 0) },
      ],
    };
  },
  mounted() {
    this.init3();
    // this.init2();

    // this.init();
  },
  methods: {
    init3() {
      this.myDiagram = new Diagram("myDiagramDiv", {
        "undoManager.isEnabled": true,
      });
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc").makeTwoWay(), // TwoWay Binding
        $(go.Shape, "RoundedRectangle", {
          fill: "lightblue",
          stroke: "blue",
          strokeWidth: 2,
        }),
        $(go.TextBlock, { margin: 5 }, new go.Binding("text", "key"))
      );

      this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray);
    },
    shiftNode() {
      this.myDiagram.commit(function (d) {
        // d.model.nodeDataArray获取节点的数组
        // 双向绑定
        var list = d.model.nodeDataArray[0];
        var node = d.findNodeForData(list);
        //  console.log('node',node.location);
        var p = node.location.copy();
        p.x += 10;
        // let a =   new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
        node.location = p;
      });
    },
    init2() {
      this.myDiagram = new Diagram("myDiagramDiv", {
        "undoManager.isEnabled": true,
        layout: new go.TreeLayout({ angle: 90, layerSpacing: 35 }),
      });
      this.myDiagram.nodeTemplate = new go.Node("Horizontal", {
        background: "#44CCFF",
      })
        .add(
          new go.Picture({
            margin: 10,
            width: 50,
            height: 50,
            background: "red",
          }).bind("source")
        )
        .add(
          new go.TextBlock("Default Text", {
            margin: 12,
            stroke: "white",
            font: "bold 16px sans-serif",
          }).bind("text", "name")
        );
      this.myDiagram.linkTemplate = new go.Link({
        routing: go.Link.Orthogonal,
        corner: 5,
      }).add(new go.Shape({ strokeWidth: 5, stroke: "#DDD" }));
      this.myDiagram.model = new go.TreeModel([
        // the "key" and "parent" property names are required,
        // but you can add whatever data properties you need for your app
        {
          key: "1",
          name: "森林",
          source: require("../../assets/bj/haibian.png"),
        },
        {
          key: "2",
          parent: "6",
          name: "dog",
          source: require("../../assets/bj/dog.png"),
        },
        {
          key: "3",
          parent: "2",
          name: "cat",
          source: require("../../assets/bj/cat.png"),
        },
        {
          key: "4",
          parent: "6",
          name: "pig",
          source: require("../../assets/bj/pig.png"),
        },
        {
          key: "5",
          parent: "6",
          name: "rabbit",
          source: require("../../assets/bj/rabbit.png"),
        },
        {
          key: "6",
          parent: "1",
          name: "tiger",
          source: require("../../assets/bj/tiger.png"),
        },
        {
          key: "7",
          parent: "5",
          name: "xixi",
        },
      ]);
    },
    init() {
      this.myDiagram = new go.Diagram("myDiagramDiv", {
        "undoManager.isEnabled": true,
      });
      this.myDiagram.nodeTemplate = new go.Node("Horizontal", {
        background: "#44CCFF",
      }).add(
        new go.TextBlock({
          margin: 12,
          stroke: "white",
          font: "bold 16px sans-serif",
          text: "无命名",
        })
          // TextBlock.text is data bound to the "name" property of the model data
          .bind("text", "name")
      );

      // .add(
      //   new go.Picture({
      //     name: "Picture",
      //     source: "",
      //     width: 100,
      //     height: 100,
      //     cursor: "pointer",
      //   }).bind('source','source')
      // );

      //  默认展示
      // this.myDiagram.model = new go.Model(this.dataOBJ.lianxi1);
      // 连线  图像模型
      /* GraphLinksModel 允许您在节点之间有任意数量的链接，向任意方向前进。从 A 到 B 可能有 10 个链接，另外三个从 B 到 A 以相反的方式运行。 */
      this.myDiagram.model = new go.GraphLinksModel(
        this.dataOBJ.lianxi2.node,
        this.dataOBJ.lianxi2.line
      );
      // 树模型
      // this.myDiagram.model = new go.TreeModel(this.dataOBJ.lianxi3);
    },
  },
};
</script>

<style>
#myDiagramDiv {
  background-color: #f8f8f8;
  border: 1px solid #aaa;
  width: 600px;
  height: 600px;
}
</style>