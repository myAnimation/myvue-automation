<template>
  <div class="goDemo" style="display: flex">
    <div id="myDiagramDiv"></div>
  </div>
</template>

<script>
import { Diagram } from "gojs";
var $ = go.GraphObject.make;
export default {
  name: "go7",
  data() {
    return {
      myDiagram: null,
    };
  },
  mounted() {
    this.init3();
    // this.init2();
    // this.init();
  },
  methods: {
    init3() {
        this.myDiagram =  $(go.Diagram, "myDiagramDiv");
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Auto",
        $(go.Shape, "Rectangle", { fill: "lightgray" }),
        $(
          go.Panel,
          "Table",
          $(go.RowColumnDefinition, { column: 0, alignment: go.Spot.Left }),
          $(go.RowColumnDefinition, { column: 2, alignment: go.Spot.Right }),
          
          $(
            go.TextBlock, // the node title
            {
              column: 0,
              row: 0,
              columnSpan: 3,
              alignment: go.Spot.Center,
              font: "bold 10pt sans-serif",
              margin: new go.Margin(4, 2),
            },
            new go.Binding("text", "key")
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 0, row: 1 },
            $(
              go.Shape, // the "A" port
              {
                width: 6,
                height: 6,
                portId: "A",
                toSpot: go.Spot.Left,
                toLinkable: true,
                toMaxLinks: 1,
              }
            ), // allow user-drawn links from here
            $(go.TextBlock, "A") // "A" port label
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 0, row: 2 },
            $(
              go.Shape, // the "B" port
              {
                width: 6,
                height: 6,
                portId: "B",
                toSpot: go.Spot.Left,
                toLinkable: true,
                toMaxLinks: 1,
              }
            ), // allow user-drawn links from here
            $(go.TextBlock, "B") // "B" port label
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 2, row: 1, rowSpan: 2},
            $(go.TextBlock, "Out"), // "Out" port label
            $(
              go.Shape, // the "Out" port
              {
                width: 6,
                height: 6,
                portId: "Out",
                fromSpot: go.Spot.Right,
                fromLinkable: true,
              }
            ) // allow user-drawn links to here
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 2, row: 0, rowSpan: 1 },
            $(go.TextBlock, "Link"), // "Out" port label
            $(
              go.Shape, // the "Out" port
              {
                width: 6,
                height: 6,
                portId: "Link",
                fromSpot: go.Spot.Right,
                fromLinkable: true,
              }
            ) // allow user-drawn links to here
          )
        )
      );

      this.myDiagram.linkTemplate = $(
        go.Link,
        { routing: go.Link.Orthogonal, corner: 3 },
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" })
      );

      this.myDiagram.layout = $(go.LayeredDigraphLayout, { columnSpacing: 10 });

      this.myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;

      this.myDiagram.model = $(go.GraphLinksModel, {
        linkFromPortIdProperty: "fromPort", // required information:
        linkToPortIdProperty: "toPort", // identifies data property names
        nodeDataArray: [{ key: "Add1" }, { key: "Add2" }, { key: "Subtract1" }],
        linkDataArray: [
          // no predeclared links
       
   
        ],
      });
    },
    init2() {
      this.myDiagram = new Diagram("myDiagramDiv", {
        "undoManager.isEnabled": true,
      });
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Auto",
        // 长方形
        $(go.Shape, "Rectangle", { fill: "lightgray" }),
        //   节点内容
        $(
          go.Panel,
          "Table",
          $(go.RowColumnDefinition, { column: 0, alignment: go.Spot.Left }),
          $(go.RowColumnDefinition, { column: 2, alignment: go.Spot.Right }),
          $(
            go.TextBlock, // the node title
            {
              column: 0,
              row: 0,
              columnSpan: 3,
              alignment: go.Spot.Center, // 放在上一级的哪个位置，除了特定的值还可以自定义，前面两个参数表示几倍于上一级的宽高的位置，后面设置具体x，y的位置
              font: "bold 10pt sans-serif",
              margin: new go.Margin(4, 2),
            },

            new go.Binding("text", "key")
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 0, row: 1 },
            $(
              go.Shape, // the "A" port
              { width: 6, height: 6, portId: "A", toSpot: go.Spot.Left }
            ),
            $(go.TextBlock, "A") // "A" port label
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 0, row: 2 },
            $(
              go.Shape, // the "B" port
              // 连接点ID，没有名称可能无法触发连线
              { width: 6, height: 6, portId: "B", toSpot: go.Spot.Left }
            ),
            $(go.TextBlock, "B") // "B" port label
          ),
          $(
            go.Panel,
            "Horizontal",
            { column: 2, row: 1, rowSpan: 2 },
            $(go.TextBlock, "Out"), // "Out" port label
            $(
              go.Shape, // the "Out" port
              { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right }
            )
          )
        )
      );
      this.myDiagram.linkTemplate = $(
        go.Link,
        { routing: go.Link.Orthogonal, corner: 3 },
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" })
      );
      this.myDiagram.model = $(go.GraphLinksModel, {
        linkFromPortIdProperty: "fromPort", // 默认渲染
        linkToPortIdProperty: "toPort", // 默认渲染
        nodeDataArray: [{ key: "Add1" }, { key: "Add2" }, { key: "Subtract1" }],
        linkDataArray: [
          { from: "Add1", fromPort: "Out", to: "Subtract1", toPort: "A" },
          { from: "Add2", fromPort: "Out", to: "Subtract1", toPort: "B" },
        ],
      });
    },
    init() {
      this.myDiagram = new Diagram("myDiagramDiv", {
        "undoManager.isEnabled": true,
      });
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Vertical",
        $(go.Shape, "Ellipse", {
          width: 30,
          height: 30,
          fill: "green",
          portId: "", //节点上的端口属性形状是端口，而不是整个节点
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        }),
        $(
          go.TextBlock,
          { font: "20px sans-serif" },
          new go.Binding("text", "key")
        )
      );

      var nodeDataArray = [{ key: "Alpha" }, { key: "Beta" }];
      var linkDataArray = [{ from: "Alpha", to: "Beta" }];
      this.myDiagram.model = new go.GraphLinksModel(
        nodeDataArray,
        linkDataArray
      );
    },
  },
};
</script>

<style scoped>
#myDiagramDiv {
  background-color: #f8f8f8;
  border: 1px solid #aaa;
  width: 600px;
  height: 600px;
}
</style>