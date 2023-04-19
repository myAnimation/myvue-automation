<template>
  <div class="goNetwork">
    <div class="btnList">
      <el-button type="primary" @click="save">查看数据</el-button>
    </div>
    <div class="content">
      <div id="myPaletteDiv"></div>
      <div id="myDiagramDiv"></div>
    </div>
  </div>
</template>

<script>
import gojs from "gojs";
var go = gojs;
var $ = go.GraphObject.make;
import mixin from "./mixin";
export default {
  name: "goNetwork",
   mounted() {
    this.init();
  },
  mixins: [mixin],
  methods: {
    init() {
      var that = this;

      this.myDiagram = $(go.Diagram, "myDiagramDiv", {
        "linkingTool.direction": go.LinkingTool.ForwardsOnly,
        "undoManager.isEnabled": true,
      });

      // when the document is modified, add a "*" to the title and enable the "Save" button

      this.myDiagram.nodeTemplateMap.add(
        "Generator",
        $(
          go.Node,
          "Spot",
          { locationSpot: go.Spot.Center, selectionObjectName: "BODY" },
          new go.Binding("location", "location", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          $(go.Shape, {
            name: "BODY",
            stroke: "white",
            strokeWidth: 3,
            fill: "transparent",
            background: "darkblue",
            width: 40,
            height: 40,
            margin: 5,
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
            fromSpot: go.Spot.TopBottomSides,
            toSpot: go.Spot.TopBottomSides,
          }),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Left,
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "Connector",
        $(
          go.Node,
          "Spot",
          { locationSpot: go.Spot.Center, selectionObjectName: "BODY" },
          new go.Binding("location", "location", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          $(go.Shape, "Circle", {
            name: "BODY",
            stroke: null,
            fill: $(go.Brush, "Linear", { 0: "lightgray", 1: "gray" }),
            background: "gray",
            width: 20,
            height: 20,
            margin: 2,
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
            fromSpot: go.Spot.TopBottomSides,
            toSpot: go.Spot.TopBottomSides,
          }),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Left,
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "Consumer",
        $(
          go.Node,
          "Spot",
          {
            locationSpot: go.Spot.Center,
            locationObjectName: "BODY",
            selectionObjectName: "BODY",
          },
          new go.Binding("location", "location", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          $(go.Picture, "images/pc.jpg", {
            name: "BODY",
            width: 50,
            height: 40,
            margin: 2,
            portId: "",
            fromLinkable: true,
            cursor: "pointer",
            fromSpot: go.Spot.TopBottomSides,
            toSpot: go.Spot.TopBottomSides,
          }),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Left,
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "HBar",
        $(
          go.Node,
          "Spot",
          new go.Binding("location", "location", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            layerName: "Background",
            // special resizing: just at the ends
            resizable: true,
            resizeObjectName: "SHAPE",
            resizeAdornmentTemplate: $(
              go.Adornment,
              "Spot",
              $(go.Placeholder),
              $(
                go.Shape, // left resize handle
                {
                  alignment: go.Spot.Left,
                  cursor: "col-resize",
                  desiredSize: new go.Size(6, 6),
                  fill: "lightblue",
                  stroke: "dodgerblue",
                }
              ),
              $(
                go.Shape, // right resize handle
                {
                  alignment: go.Spot.Right,
                  cursor: "col-resize",
                  desiredSize: new go.Size(6, 6),
                  fill: "lightblue",
                  stroke: "dodgerblue",
                }
              )
            ),
          },
          $(
            go.Shape,
            "Rectangle",
            {
              name: "SHAPE",
              fill: "black",
              stroke: null,
              strokeWidth: 0,
              width: 1000,
              height: 4,
              minSize: new go.Size(100, 4),
              maxSize: new go.Size(Infinity, 4),
            },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            ),
            new go.Binding("fill"),
            { portId: "", toLinkable: true }
          ),
          $(
            go.TextBlock,
            {
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Left,
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      this.myDiagram.linkTemplate = $(
        that.BarLink(), // subclass defined below
        {
          routing: go.Link.Orthogonal,
          relinkableFrom: true,
          relinkableTo: true,
          toPortChanged: (link, oldport, newport) => {
            if (newport instanceof go.Shape) link.path.stroke = newport.fill;
          },
        },
        $(go.Shape, { strokeWidth: 2 })
      );

      // start off with a simple diagram
      this.load();

      this.createdPaleDOM();
    },
  },
};
</script>

<style lang='scss' scoped>
.goNetwork {
  width: 100%;
  height: calc(100vh - 50px);

  .btnList {
    width: 100%;
    height: 60px;
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    justify-content: space-between;
  }
  #myPaletteDiv {
    width: 200px;
    height: 100%;
    border: 1px solid #ddd;
  }
  #myDiagramDiv {
    width: calc(100% - 200px);
    height: 100%;
    border: 1px solid #ddd;
  }
}
</style>