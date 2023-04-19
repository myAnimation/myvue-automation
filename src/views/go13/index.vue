<template>
  <div class="goNetwork">
    <div class="btnList">
      <el-button type="primary" @click="save">查看数据</el-button>
    </div>
    <div class="content">
      <div id="myPaletteDiv"></div>
      <div id="myDiagramDiv" ref="myDiagram"></div>
    </div>
  </div>
</template>

<script>
import gojs from "gojs";
var go = gojs;
var $ = go.GraphObject.make;

import quan3 from "@/assets/goIcon/quan3.png";
import quan2 from "@/assets/goIcon/quan2.png";
import quan1 from "@/assets/goIcon/quan1.png";
import kgTransverse from "@/assets/goIcon/kg-transverse.png";
import kgVertical from "@/assets/goIcon/kg-vertical.png";
import json from "./json";
export default {
  name: "goNetwork",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var _that = this;
      this.myDiagram = $(
        go.Diagram,
        this.$refs.myDiagram, // 获取原生dom进行gojs的注入
        {
          "undoManager.isEnabled": true, // 是否可以进行撤销等操作
          // "undoManager.isEnabled": false,
          initialContentAlignment: go.Spot.Center, // 启动视口中间的所有内容
          // "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone, //鼠标滚轮事件禁止
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // 开启滚轮事件
          // allowHorizontalScroll: false, //禁止水平拖动
          // allowVerticalScroll: false, // 禁止垂直拖动
          isReadOnly: false, // 是否为只读状态
          minScale: 0.2, //  缩小临界值
          maxScale: 1.5, // 放大临街值
          scale: 1, // 初始视图大小比例
          PartResized: (a, b, c) => {
            // console.log('aasd',a);
            // console.log('a',a);
            // console.log('b',b);
            // console.log('c',c);
          },
          //   LinkDrawn: this.maybeChangeLinkCategory, // these two DiagramEvents call a
          //   LinkRelinked: this.maybeChangeLinkCategory // function that is defined below
          // ViewportBoundsChanged: this.onScroll,
        }
      );

      let portSize = new go.Size(4, 6); // 上下
      let portSize2 = new go.Size(7, 4); //左右

      // 给节点的设置右键按钮  //  nodeMenu上下文菜单
      const nodeMenu = $(
        "ContextMenu",
        this.makeButton("复制", (e, obj) =>
          e.diagram.commandHandler.copySelection()
        ),
        this.makeButton("粘贴", (e, obj) =>
          e.diagram.commandHandler.pasteSelection()
        ),
        this.makeButton("删除", (e, obj) =>
          e.diagram.commandHandler.deleteSelection()
        ),
        this.makeButton("添加头部小节点", (e, obj) => this.addPort("top")),
        this.makeButton("添加左侧小节点", (e, obj) => this.addPort("left")),
        this.makeButton("添加右侧小节点", (e, obj) => this.addPort("right")),
        this.makeButton("添加底部小节点", (e, obj) => this.addPort("bottom")),
        this.makeButton("更改文本位置", (e, obj) =>
          this.changeTextDirection(obj.part.adornedObject, e)
        )
      );
      const nodeMenu2 = $(
        "ContextMenu",
        this.makeButton("复制", (e, obj) =>
          e.diagram.commandHandler.copySelection()
        ),
        this.makeButton("粘贴", (e, obj) =>
          e.diagram.commandHandler.pasteSelection()
        ),
        this.makeButton("删除", (e, obj) =>
          e.diagram.commandHandler.deleteSelection()
        ),
        this.makeButton("添加头部小节点", (e, obj) => this.addPort("top")),
        this.makeButton("添加左侧小节点", (e, obj) => this.addPort("left")),
        this.makeButton("添加右侧小节点", (e, obj) => this.addPort("right")),
        this.makeButton("添加底部小节点", (e, obj) => this.addPort("bottom")),
        this.makeButton("更改背景色", (e, obj) =>
          this.changeBackground(obj.part.adornedObject)
        ),
        this.makeButton("更改文本位置", (e, obj) =>
          this.changeTextDirection(obj.part.adornedObject, e)
        )
      );
      // 给小节点设置删除
      const portMenu = $(
        "ContextMenu",
        // this.makeButton("更改小节点颜色", (e, obj) =>
        //   this.changeColor(obj.part.adornedObject)
        // ),
        this.makeButton(
          "删除小节点",
          // in the click event handler, the obj.part is the Adornment;
          // 在click事件处理程序中，obj。一部分是装饰；
          // its adornedObject is the port
          // 它的父对象是端口
          (e, obj) => this.removePort(obj.part.adornedObject)
        ),
        this.makeButton("删除全部小节点", (e, obj) =>
          this.removeAll(obj.part.adornedObject)
        )
      );

      //  GraphObject.make
      //   节点模板
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Table",
        {
          locationObjectName: "BODY",
          locationSpot: go.Spot.Center,
          selectionObjectName: "BODY",
          contextMenu: this.editTag ? null : nodeMenu, // 去除右键
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.TextBlock,
          {
            margin: 5,
            row: 1,
            column: 0,
            font: "16pt Helvetica, Arial, sans-serif",
            stroke: "#fff",
            cursor: "pointer",
            editable: true,

            // alignment: go.Spot.Left,
            // alignmentFocus: go.Spot.Left,

            background: "aqua",
          },
          new go.Binding("text", "name").makeTwoWay(),
          new go.Binding("row", "textRow").makeTwoWay(),
          new go.Binding("column", "textColumn").makeTwoWay()
        ),
        // 声明面板 the body
        $(
          go.Panel,
          "Auto",
          //   面板默认设置
          {
            row: 1,
            column: 1,
            name: "BODY",
            stretch: go.GraphObject.Fill,
          },
          //   块元素
          $(
            go.Shape,
            {
              stroke: "#00ff00",
              strokeWidth: 3,
              desiredSize: new go.Size(20, 40),
            },
            new go.Binding("stroke", "stroke").makeTwoWay(),
            new go.Binding("strokeWidth", "type", (type) => {
              if (type.includes("dz")) {
                return 3;
              }
              return 0;
            }).makeTwoWay(),
            new go.Binding("desiredSize", "type", (type) => {
              if (type === "dz-vertical") {
                return new go.Size(20, 40);
              }
              if (type === "dz-transverse") {
                return new go.Size(40, 20);
              }
              if (type === "quan3") {
                return new go.Size(80, 80);
              }
              if (type === "quan2") {
                return new go.Size(80, 80);
              }
              if (type == "quan1") {
                return new go.Size(30, 30);
              }
              if (type === "kg-transverse") {
                return new go.Size(40, 20);
              }
              if (type === "kg-vertical") {
                return new go.Size(20, 40);
              }
              return new go.Size(80, 80);
            }).makeTwoWay()
          ),
          $(
            go.Picture,
            {
              name: "Picture",
              source: quan3,
              imageStretch: go.GraphObject.Fill,
              desiredSize: new go.Size(80, 80),
              cursor: "pointer",
            },
            new go.Binding("source", "type", (type) => {
              if (type == "quan3") {
                return quan3;
              }
              if (type == "quan2") {
                return quan2;
              }
              if (type == "quan1") {
                return quan1;
              }
              if (type === "kg-transverse") {
                return kgTransverse;
              }
              if (type === "kg-vertical") {
                return kgVertical;
              }
            }).makeTwoWay(),
            new go.Binding("desiredSize", "type", (type) => {
              if (type == "quan3") {
                return new go.Size(80, 80);
              }
              if (type == "quan2") {
                return new go.Size(80, 80);
              }
              if (type == "quan1") {
                return new go.Size(30, 30);
              }
              if (type == "kg-transverse") {
                return new go.Size(40, 20);
              }
              if (type == "kg-vertical") {
                return new go.Size(20, 40);
              }
            }).makeTwoWay()
          )

          //   $(
          //     go.TextBlock,
          //     {
          //       margin: 8,
          //       //   textAlign: "center",
          //       // font: "16px Segoe UI,sans-serif",
          //       font: "16pt Helvetica, Arial, sans-serif",
          //       stroke: "#fff",
          //       cursor: "pointer",
          //       editable: true,
          //       //   alignment: go.Spot.Right,
          //       //   alignmentFocus: go.Spot.Left,

          //       // background: "aqua",
          //       //   minSize: new go.Size(42, 42),
          //     },
          //     new go.Binding("text", "name").makeTwoWay()
          // new go.Binding("font", "font").makeTwoWay()
          // new go.Binding("stroke", "stroke").makeTwoWay(),
          // new go.Binding("font", "font")
          // new go.Binding("visible", "isHighlighted"),
          //   )
        ),

        // 设置小节点
        // 绑定 itemArray leftArray
        // 为itemArray中的每个项创建，并绑定到数据。左数组
        $(go.Panel, "Vertical", new go.Binding("itemArray", "leftArray"), {
          row: 1,
          column: 0,
          itemTemplate: $(
            go.Panel,
            {
              _side: "left", // 内部属性，以便更容易地判断它位于哪一侧
              fromSpot: go.Spot.Left, // 从左
              toSpot: go.Spot.Left, // 到左
              fromLinkable: true,
              toLinkable: true,
              cursor: "pointer",
              contextMenu: portMenu,
            },
            new go.Binding("portId", "portId"),
            $(
              go.Shape,
              "Rectangle",
              {
                fill: "#00ff00",
                stroke: null,
                strokeWidth: 5,
                desiredSize: portSize2,
                margin: new go.Margin(10, -3),
              },
              new go.Binding("fill", "portColor")
            )
          ),
        }),
        $(go.Panel, "Horizontal", new go.Binding("itemArray", "topArray"), {
          row: 0,
          column: 1,
          itemTemplate: $(
            go.Panel,
            {
              _side: "top",
              fromSpot: go.Spot.Top,
              toSpot: go.Spot.Top,
              fromLinkable: true,
              toLinkable: true,
              cursor: "pointer",
              contextMenu: portMenu,
            },
            new go.Binding("portId", "portId"),
            $(
              go.Shape,
              "Rectangle",
              {
                stroke: null,
                strokeWidth: 0,
                desiredSize: portSize, // 小节点大小
                margin: new go.Margin(0, 10),
                fill: "#00ff00",
              },
              new go.Binding("fill", "portColor")
            )
          ), // end itemTemplate
        }),
        $(go.Panel, "Vertical", new go.Binding("itemArray", "rightArray"), {
          row: 1,
          column: 2,
          itemTemplate: $(
            go.Panel,
            {
              _side: "right",
              fromSpot: go.Spot.Right,
              toSpot: go.Spot.Right,
              fromLinkable: true,
              toLinkable: true,
              cursor: "pointer",
              contextMenu: portMenu,
            },
            new go.Binding("portId", "portId"),
            $(
              go.Shape,
              "Rectangle",
              {
                stroke: null,
                strokeWidth: 0,
                desiredSize: portSize2,
                margin: new go.Margin(6, 0),
                fill: "#00ff00",
              },
              new go.Binding("fill", "portColor")
            )
          ), // end itemTemplate
        }),
        $(go.Panel, "Horizontal", new go.Binding("itemArray", "bottomArray"), {
          row: 2,
          column: 1,
          itemTemplate: $(
            go.Panel,
            {
              _side: "bottom",
              fromSpot: go.Spot.Bottom,
              toSpot: go.Spot.Bottom,
              fromLinkable: true,
              toLinkable: true,
              cursor: "pointer",
              contextMenu: portMenu,
            },
            new go.Binding("portId", "portId"),
            $(
              go.Shape,
              "Rectangle",
              {
                stroke: null,
                strokeWidth: 0,
                fill: "#00ff00",
                desiredSize: portSize,
                margin: new go.Margin(0, 10),
              },
              new go.Binding("fill", "portColor")
            )
          ), // end itemTemplate
        })
      );

      // 实线
      this.myDiagram.linkTemplate = $(
        "Link",
        {
          routing: go.Link.AvoidsNodes,
          adjusting: go.Link.FROM,
          curve: go.Link.JumpGap,
          reshapable: true,
          resegmentable: true,
          relinkableFrom: true,
          relinkableTo: true,
          corner: 4,
          toShortLength: 1,
          cursor: "pointer",
        },
        new go.Binding("points").makeTwoWay(),
        // 线条颜色
        $("Shape", {
          name: "LINE",
          isPanelMain: true,
          // stroke: "#5aaefd",
          stroke: "#0000ff",
          strokeWidth: 3,
        }),
        $(
          go.TextBlock,
          "",
          {
            textAlign: "center",
            // font: '20pt helvetica, arial, sans-serif',
            font: "bold small-caps 20pt helvetica, Arial, sans-serif",
            // stroke: "rgba(255,255,255,0.9)",
            // width:75,
            // height:55,
            // stroke: "#0ed3ff",
            stroke: "#eee",
            editable: true,
            // background: "rgba(255,255,255,0.3)",
          },
          new go.Binding("text", "port1").makeTwoWay()
        )
      );

      // WBAR
      this.myDiagram.nodeTemplateMap.add(
        "WBar",
        $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            contextMenu: this.editTag ? null : nodeMenu2,
            // selectionChanged: (node) => {
            //   console.log("node", node);
            // },
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            resizable: true,
            resizeObjectName: "SHAPE",
            resizeAdornmentTemplate: $(
              go.Adornment,
              "Table",
              { locationSpot: go.Spot.Center },
              $(go.Placeholder),
              $(
                go.Shape, // left resize handle
                {
                  alignment: go.Spot.Left,

                  cursor: "col-resize",
                  desiredSize: new go.Size(6, 6),
                  fill: "#0000ff",
                  stroke: "dodgerblue",
                }
              ),
              $(
                go.Shape, // right resize handle
                {
                  alignment: go.Spot.Right,
                  cursor: "col-resize",
                  desiredSize: new go.Size(6, 6),
                  fill: "#0000ff",
                  stroke: "dodgerblue",
                }
              )
            ),
          },
          $(
            go.TextBlock,
            {
              textAlign: "center",
              // font: "16px Segoe UI,sans-serif",
              font: "12pt Helvetica, Arial, sans-serif",
              stroke: "#fff",
              cursor: "pointer",
              editable: true,
              row: 2,
              column: 1,
              alignment: go.Spot.Center,
            },
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("row", "textRow").makeTwoWay(),
            new go.Binding("column", "textColumn").makeTwoWay()
          ),
          $(
            go.Panel,
            "AUTO",
            {
              row: 1,
              column: 1,
              name: "BODY",
              stretch: go.GraphObject.Fill,
              height: 10,
            },

            $(
              go.Shape,
              "RoundedRectangle",
              {
                row: 1,
                column: 1,
                name: "SHAPE",
                stroke: null,
                fill: "#0000ff",
                width: 100,
                height: 4,
                minSize: new go.Size(50, 4),
                maxSize: new go.Size(Infinity, 4),
                margin: 2,
                portId: "",
                cursor: "pointer",
              },
              new go.Binding("width", "width", (width, b, c) => {
                // b.part.data.topArray[0].margin = width / 5

                if (b.part.data.topArray.length) {
                  this.dividePort(b.part.data.topArray, width);
                }
                if (b.part.data.bottomArray.length) {
                  this.dividePort(b.part.data.bottomArray, width);
                }

                return width;
              }).makeTwoWay(),
              new go.Binding("fill", "fill").makeTwoWay()
            )
          ),

          $(go.Panel, "Vertical", new go.Binding("itemArray", "leftArray"), {
            row: 1,
            column: 0,

            itemTemplate: $(
              go.Panel,
              {
                _side: "left", // 内部属性，以便更容易地判断它位于哪一侧
                fromSpot: go.Spot.Left, // 从左
                toSpot: go.Spot.Left, // 到左
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                contextMenu: portMenu,
              },
              new go.Binding("portId", "portId"),
              $(
                go.Shape,
                "Rectangle",
                {
                  fill: "#00ff00",
                  stroke: null,
                  strokeWidth: 5,
                  desiredSize: portSize2,
                  margin: new go.Margin(0, -3),
                },
                new go.Binding("fill", "portColor")
              )
            ),
          }),
          $(go.Panel, "Horizontal", new go.Binding("itemArray", "topArray"), {
            row: 0,
            column: 1,
            itemTemplate: $(
              go.Panel,
              {
                _side: "top",
                fromSpot: go.Spot.Top,
                toSpot: go.Spot.Top,
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                contextMenu: portMenu,
              },
              new go.Binding("portId", "portId"),
              $(
                go.Shape,
                "Rectangle",
                {
                  stroke: null,
                  strokeWidth: 0,
                  desiredSize: portSize, // 小节点大小
                  margin: new go.Margin(0, 10),
                  fill: "#00ff00",
                },
                new go.Binding("fill", "portColor"),
                new go.Binding("margin", "margin", (margin) => {
                  return new go.Margin(0, margin[0], 0, margin[1]);
                })
              )
            ), // end itemTemplate
          }),
          $(go.Panel, "Vertical", new go.Binding("itemArray", "rightArray"), {
            row: 1,
            column: 2,
            itemTemplate: $(
              go.Panel,
              {
                _side: "right",
                fromSpot: go.Spot.Right,
                toSpot: go.Spot.Right,
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                contextMenu: portMenu,
              },
              new go.Binding("portId", "portId"),
              $(
                go.Shape,
                "Rectangle",
                {
                  stroke: null,
                  strokeWidth: 0,
                  desiredSize: portSize2,
                  margin: new go.Margin(0, 0),
                  fill: "#00ff00",
                },
                new go.Binding("fill", "portColor")
              )
            ), // end itemTemplate
          }),
          $(
            go.Panel,
            "Horizontal",
            new go.Binding("itemArray", "bottomArray"),
            {
              row: 2,
              column: 1,
              itemTemplate: $(
                go.Panel,
                {
                  _side: "bottom",
                  fromSpot: go.Spot.Bottom,
                  toSpot: go.Spot.Bottom,
                  fromLinkable: true,
                  toLinkable: true,
                  cursor: "pointer",
                  contextMenu: portMenu,
                },
                new go.Binding("portId", "portId"),
                $(
                  go.Shape,
                  "Rectangle",
                  {
                    stroke: null,
                    strokeWidth: 0,
                    fill: "#00ff00",
                    desiredSize: portSize,
                    margin: new go.Margin(0, 10),
                  },
                  new go.Binding("fill", "portColor"),
                  new go.Binding("margin", "margin", (margin) => {
                    return new go.Margin(0, margin[0], 0, margin[1]);
                  })
                )
              ), // end itemTemplate
            }
          )
        )
      );
      // HBar
      this.myDiagram.nodeTemplateMap.add(
        "HBar",
        $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            contextMenu: nodeMenu2,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            resizable: true,
            resizeObjectName: "SHAPE",
            resizeAdornmentTemplate: $(
              go.Adornment,
              "Table",
              { locationSpot: go.Spot.Center },
              $(go.Placeholder),
              $(
                go.Shape, // left resize handle
                {
                  alignment: go.Spot.Top,
                  cursor: "col-resize",
                  desiredSize: new go.Size(6, 6),
                  fill: "#0000ff",
                  stroke: "dodgerblue",
                }
              ),
              $(
                go.Shape, // right resize handle
                {
                  alignment: go.Spot.Bottom,
                  cursor: "col-resize",
                  desiredSize: new go.Size(6, 6),
                  fill: "#0000ff",
                  stroke: "dodgerblue",
                }
              )
            ),
          },
          $(
            go.TextBlock,
            {
              textAlign: "center",
              // font: "16px Segoe UI,sans-serif",
              font: "12pt Helvetica, Arial, sans-serif",
              stroke: "#fff",
              cursor: "pointer",
              editable: true,
              row: 2,
              column: 1,
              alignment: go.Spot.Center,
            },
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("row", "textRow").makeTwoWay(),
            new go.Binding("column", "textColumn").makeTwoWay()
          ),
          $(
            go.Panel,
            "AUTO",
            {
              row: 1,
              column: 1,
              name: "BODY",
              stretch: go.GraphObject.Fill,
              width: 10,
            },

            $(
              go.Shape,
              "RoundedRectangle",
              {
                row: 1,
                column: 1,
                name: "SHAPE",
                stroke: null,
                fill: "#0000ff",
                width: 4,
                height: 100,
                minSize: new go.Size(4, 50),
                maxSize: new go.Size(4, Infinity),
                margin: 2,
                portId: "",
                cursor: "pointer",
              },
              new go.Binding("height", "height", (height, b, c) => {
                // b.part.data.topArray[0].margin = width / 5

                if (b.part.data.leftArray.length) {
                  this.dividePort(b.part.data.leftArray, height);
                }
                if (b.part.data.rightArray.length) {
                  this.dividePort(b.part.data.rightArray, height);
                }

                return height;
              }).makeTwoWay(),
              new go.Binding("fill", "fill").makeTwoWay()
            )
          ),

          $(go.Panel, "Vertical", new go.Binding("itemArray", "leftArray"), {
            row: 1,
            column: 0,

            itemTemplate: $(
              go.Panel,
              {
                _side: "left", // 内部属性，以便更容易地判断它位于哪一侧
                fromSpot: go.Spot.Left, // 从左
                toSpot: go.Spot.Left, // 到左
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                contextMenu: portMenu,
              },
              new go.Binding("portId", "portId"),
              $(
                go.Shape,
                "Rectangle",
                {
                  fill: "#00ff00",
                  stroke: null,
                  strokeWidth: 5,
                  desiredSize: portSize2,
                  margin: new go.Margin(0, -3),
                },
                new go.Binding("fill", "portColor"),
                new go.Binding("margin", "margin", (margin) => {
                  return new go.Margin(margin[0], -1, margin[1], 0);
                })
              )
            ),
          }),
          $(go.Panel, "Horizontal", new go.Binding("itemArray", "topArray"), {
            row: 0,
            column: 1,
            itemTemplate: $(
              go.Panel,
              {
                _side: "top",
                fromSpot: go.Spot.Top,
                toSpot: go.Spot.Top,
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                contextMenu: portMenu,
              },
              new go.Binding("portId", "portId"),
              $(
                go.Shape,
                "Rectangle",
                {
                  stroke: null,
                  strokeWidth: 0,
                  desiredSize: portSize, // 小节点大小
                  margin: new go.Margin(-1, 1),
                  fill: "#00ff00",
                },
                new go.Binding("fill", "portColor")
              )
            ), // end itemTemplate
          }),
          $(go.Panel, "Vertical", new go.Binding("itemArray", "rightArray"), {
            row: 1,
            column: 2,
            itemTemplate: $(
              go.Panel,
              {
                _side: "right",
                fromSpot: go.Spot.Right,
                toSpot: go.Spot.Right,
                fromLinkable: true,
                toLinkable: true,
                cursor: "pointer",
                contextMenu: portMenu,
              },
              new go.Binding("portId", "portId"),
              $(
                go.Shape,
                "Rectangle",
                {
                  stroke: null,
                  strokeWidth: 0,
                  desiredSize: portSize2,
                  margin: new go.Margin(0, 0),
                  fill: "#00ff00",
                },
                new go.Binding("fill", "portColor"),
                new go.Binding("margin", "margin", (margin) => {
                  return new go.Margin(margin[0], 0, margin[1], -1);
                })
              )
            ), // end itemTemplate
          }),
          $(
            go.Panel,
            "Horizontal",
            new go.Binding("itemArray", "bottomArray"),
            {
              row: 2,
              column: 1,
              itemTemplate: $(
                go.Panel,
                {
                  _side: "bottom",
                  fromSpot: go.Spot.Bottom,
                  toSpot: go.Spot.Bottom,
                  fromLinkable: true,
                  toLinkable: true,
                  cursor: "pointer",
                  contextMenu: portMenu,
                },
                new go.Binding("portId", "portId"),
                $(
                  go.Shape,
                  "Rectangle",
                  {
                    stroke: null,
                    strokeWidth: 0,
                    fill: "#00ff00",
                    desiredSize: portSize,
                    margin: new go.Margin(-1, 1),
                  },
                  new go.Binding("fill", "portColor")
                )
              ), // end itemTemplate
            }
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "LinkLabel",
        $(
          "Node",
          {
            selectable: false,
            avoidable: false,
            layerName: "Foreground",
          }, // always have link label nodes in front of Links
          $("Shape", "Ellipse", {
            width: 10,
            height: 10,
            stroke: null,
            fill: "red",
            // fill:null,//去掉小圆点
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
          })
        )
      );

      // GraphLinkModel对链接标签节点的支持需要指定两个属性
      // 优化连线

      this.myDiagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
      });
      // 每当通过链接工具绘制新链接时，它还添加节点数据对象。
      // 用作链接的标签节点的，以允许向链接绘制链接或从链接绘制链接。
      this.myDiagram.toolManager.linkingTool.archetypeLabelNodeData = {
        category: "LinkLabel",
      };

      this.myDiagram.model = go.Model.fromJson(json);
      this.createdPaleDOM();
    },
    save() {
      console.log(this.myDiagram.model.toJson());
    },
    createdPaleDOM() {
      this.myPalette = $(go.Palette, "myPaletteDiv", {
        nodeTemplateMap: this.myDiagram.nodeTemplateMap,
        layout: $(go.GridLayout, {
          cellSize: new go.Size(2, 2),
          isViewportSized: true,
        }),
      });

      this.myPalette.model.nodeDataArray = [
        {
          type: "dz-vertical",
          textDirection: [1, 0],
          name: "",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          stroke: "#00ff00",
          portColor: "#00ff00",
        },
        {
          type: "dz-transverse",
          textDirection: [0, 1],
          name: "",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          stroke: "#00ff00",
          portColor: "#00ff00",
        },
        {
          type: "quan3",
          textDirection: [1, 0],
          name: "quan3",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "quan2",
          textDirection: [1, 0],
          name: "quan2",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "kg-transverse",
          textDirection: [0, 1],
          name: "kg",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "kg-vertical",
          textDirection: [1, 0],
          name: "kg",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "quan1",
          textDirection: [1, 0],
          name: "quan1",

          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        // { text: "Bar", category: "HBar", size: "100 4" },
        // { name: "Bar", category: "WBar", size: "100 4", width: 200 },
        {
          name: "WBar",
          category: "WBar",
          textDirection: [2, 1],
          width: 100,
          size: "100 4",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          fill: "#0000ff",
        },
        {
          name: "HBar",
          category: "HBar",
          textDirection: [0, 1],
          height: 100,
          size: "4 100",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          fill: "#0000ff",
        },
      ];

      // remove cursors on all ports in the Palette
      // make TextBlocks invisible, to reduce size of Nodes
      this.myPalette.nodes.each((node) => {
        node.ports.each((port) => (port.cursor = ""));
        node.elements.each((tb) => {
          if (tb instanceof go.TextBlock) tb.visible = false;
        });
      });
    },
    // 上下文button
    makeButton(text, action, visiblePredicate) {
      return $(
        "ContextMenuButton",
        $(go.TextBlock, text, {
          alignment: go.Spot.Left,
          margin: 5,
          textAlign: "center",
          font: "14px sans-serif",
          opacity: 0.85,
          stroke: "#404040",
          width: 100,
        }),
        { click: action },
        // don't bother with binding GraphObject.visible if there's no predicate
        visiblePredicate
          ? new go.Binding("visible", "", (o, e) =>
              o.diagram ? visiblePredicate(o, e) : false
            ).ofObject()
          : {}
      );
    },

    // 添加头部小节点
    addPort(side) {
      this.myDiagram.startTransaction("addPort");

      this.myDiagram.selection.each((node) => {
        // skip any selected Links
        if (!(node instanceof go.Node)) return;
        if (node.data.category === "HBar") {
          // jg
          // console.log("width", node.Oy.width);

          let list = node.data[side + "Array"];
          // console.log("side", side);
          // console.log("list", list);

          let myname = side + list.length;

          let num;
          let data;
          if (list.length) {
            num = Math.floor(node.jg.height / list.length / 2);
          } else {
            num = 0;
          }
          if (side === "left" || side === "right") {
            data = {
              portId: myname,
              portColor: "#0000ff",
              margin: [num, 0],
            };
          } else {
            data = {
              portId: myname,
              portColor: "#0000ff",
            };
          }
          this.myDiagram.model.insertArrayItem(list, -1, data);
          return;
        }
        if (node.data.category === "WBar") {
          // jg
          // console.log("width", node.Oy.width);

          let list = node.data[side + "Array"];
          // console.log("side", side);
          // console.log("list", list);

          let myname = side + list.length;

          let num;
          let data;
          if (list.length) {
            num = Math.floor(node.jg.width / list.length / 2);
          } else {
            num = 0;
          }
          if (side === "bottom" || side === "top") {
            data = {
              portId: myname,
              portColor: "#0000ff",
              margin: [0, num],
            };
          } else {
            data = {
              portId: myname,
              portColor: "#0000ff",
            };
          }
          this.myDiagram.model.insertArrayItem(list, -1, data);

          // console.log("list", list);
          return;
        }

        let i = 0;
        while (node.findPort(side + i.toString()) !== node) i++;

        const name = side + i.toString();

        const arr = node.data[side + "Array"];
        if (arr) {
          let newportdata = {};
          console.log(node.data);
          // create a new port data object
          if (node.data.type.includes("quan")) {
            newportdata = {
              portId: name,
              portColor: "#ffff00",
            };
          } else {
            newportdata = {
              portId: name,
              portColor: "#00ff00",
            };
          }

          // and add it to the Array of port data
          this.myDiagram.model.insertArrayItem(arr, -1, newportdata);
        }
      });
      this.myDiagram.commitTransaction("addPort");
    },
    // 删除小节点
    removePort(port) {
      this.myDiagram.startTransaction("removePort");
      const pid = port.portId;
      const arr = port.panel.itemArray;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].portId === pid) {
          this.myDiagram.model.removeArrayItem(arr, i);
          break;
        }
      }
      this.myDiagram.commitTransaction("removePort");
    },
    // 删除全部小节点
    removeAll(port) {
      this.myDiagram.startTransaction("removePorts");
      const nodedata = port.part.data;
      const side = port._side; // there are four property names, all ending in "Array"
      this.myDiagram.model.setDataProperty(nodedata, side + "Array", []); // an empty Array
      this.myDiagram.commitTransaction("removePorts");
    },

    dividePort(list, width) {
      let num;
      if (list.length - 1 === 0) {
        num = 0;
      } else {
        num = Math.floor(width / (list.length - 1) / 2);
      }

      list.forEach((item, index) => {
        // 为0 就直接居中
        if (list.length === 1 && !index) {
          item.margin = [0, 0];
          return;
        }
        // 不为0
        if (list.length > 1) {
          item.margin = [num / 2, num / 2];
        }
        if (list.length > 1 && list.length - 1 === index) {
          item.margin = [num / 2, num / 2];
        }
      });
    },
    changeBackground(port) {
      this.myDiagram.startTransaction("colorPort");
      const data = port.data;
      // fill:'#0000ff'
      console.log("data", data.fill);
      let color = data.fill === "#0000ff" ? "#fefefe" : "#0000ff";
      this.myDiagram.model.setDataProperty(data, "fill", color);
      this.myDiagram.commitTransaction("colorPort");
    },
    changeTextDirection(port, e) {
      const data = port.data;

      let { textColumn, textRow } = data;
      let rowColumn = textRow + "-" + textColumn;

      let list = [
        "0-0",
        "0-1",
        "0-2",
        "1-0",
        "1-1",
        "1-2",
        "2-0",
        "2-1",
        "2-2",
      ];
      let index = list.findIndex((item) => rowColumn == item);
      // console.log("index", index);
      index = index === list.length - 1 ? -1 : index;
      let [row, column] = list[index + 1].split("-");

      this.myDiagram.model.setDataProperty(data, "textRow", row);
      this.myDiagram.model.setDataProperty(data, "textColumn", column);
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
    background: #000;
  }
  #myDiagramDiv {
    width: calc(100% - 200px);
    height: 100%;
    border: 1px solid #ddd;
    background: #000;
  }
}
</style>