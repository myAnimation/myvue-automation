<template>
  <div class="goDemo">
    <div id="myDiagramDiv"></div>
  </div>
</template>

<script>
var $ = go.GraphObject.make;
export default {
  name: "go4",
  data() {
    return {
      myDiagram: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.myDiagram = new go.Diagram("myDiagramDiv", {
        //  图表配置项
        "undoManager.isEnabled": true,
      });
      this.myDiagram.model = new go.Model([
        {
          key: "小刘",
        },
        {
          key: "小明",
        },
        {
          key: "小王",
        },
      ]);
      //  默认节点模板
      this.myDiagram.nodeTemplate = new go.Node("Vertical", {
        locationSpot: go.Spot.Center,
      })
        .add(new go.TextBlock().bind("text", "key"))
        .add(
          new go.Shape("RoundedRectangle", {
            fill: "red",
          })
        );
    },
  },
};
</script>

<style>
#myDiagramDiv {
  background-color: #f8f8f8;
  border: 1px solid #aaa;
  width: 1350px;
  height: 880px;
}
</style>