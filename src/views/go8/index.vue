<template>
  <div>
    <div id="myDiagram"></div>
    <button @click="save">查看数据</button>
  </div>
</template>

<script>
  var $ = go.GraphObject.make;
  import datam from "@/views/go8/datam";
  export default {
    name: "go8",
    mixins: [datam],
    data() {
      return {
        myDiagram: null,
        t: 0,
        timeInterval: 100,
        // myJson: {
        //   class: "go.GraphLinksModel",
        //   copiesArrays: true,
        //   copiesArrayObjects: true,
        //   linkFromPortIdProperty: "fromPort", //连线出发位置
        //   linkToPortIdProperty: "toPort", //连线结束
        //   nodeDataArray: [
        //     {
        //       key: 1,
        //       name: "BDZ1",
        //       loc: "101 204",
        //       background: "red",
        //       leftArray: [{ portColor: "#01C0CA ", portId: "left0" }],
        //       topArray: [
        //         { portColor: "#01C0CA ", portId: "top0" },
        //         { portColor: "#01C0CA ", portId: "top1" },
        //       ],
        //       bottomArray: [
        //         { portColor: "#01C0CA  ", portId: "bottom0" },
        //         { portColor: "#01C0CA  ", portId: "bottom1" },
        //       ],
        //       rightArray: [
        //         { portColor: "#01C0CA", portId: "right0" },
        //         { portColor: "#01C0CA ", portId: "right1" },
        //       ],
        //     },
        //     {
        //       key: 2,
        //       name: "BDZ2",
        //       loc: "400 400",
        //       leftArray: [{ portColor: "#01C0CA ", portId: "left0" }],
        //       topArray: [{ portColor: "#01C0CA ", portId: "top0" }],
        //       bottomArray: [{ portColor: "#01C0CA  ", portId: "bottom0" }],
        //       rightArray: [
        //         { portColor: "#01C0CA", portId: "right0" },
        //         { portColor: "#01C0CA ", portId: "right1" },
        //       ],
        //     },
        //     {
        //       key: 3,
        //       name: "BDZ3",
        //       loc: "800 800",
        //       leftArray: [{ portColor: "#01C0CA ", portId: "left0" }],
        //       topArray: [{ portColor: "#01C0CA ", portId: "top0" }],
        //       bottomArray: [{ portColor: "#01C0CA  ", portId: "bottom0" }],
        //       rightArray: [
        //         { portColor: "#01C0CA", portId: "right0" },
        //         { portColor: "#01C0CA ", portId: "right1" },
        //       ],
        //     },
        //   ],

        //   linkDataArray: [
        //     {
        //       from: 3,
        //       to: 1,
        //       fromPort: "left0",
        //       toPort: "left0",
        //       port1: "C600",
        //       color: "red",
        //     },
        //     { from: 1, to: 2, fromPort: "top0", toPort: "top1" },
        //     { from: 2, to: 3, fromPort: "right0", toPort: "top1" },
        //   ],
        // },
      };
    },
    mounted() {
      this.init();
      // this.animateColorAndFraction();
      // this.AnimationYes();

      setInterval(this.animateLink, this.timeInterval);
    },
    methods: {
      init() {
        var PathPatterns = new go.Map();
        function definePathPattern(name, geostr, color, width, cap) {
          if (typeof name !== "string" || typeof geostr !== "string")
            throw new Error(
              "invalid name or geometry string argument: " + name + " " + geostr
            );
          if (color === undefined) color = "black";
          if (width === undefined) width = 1;
          if (cap === undefined) cap = "square";
          PathPatterns.set(
            name,
            $(go.Shape, {
              geometryString: geostr,
              fill: "transparent",
              stroke: color,
              strokeWidth: width,
              strokeCap: cap,
              // isPanelMain: true,
              // name: name === 'Herringbone' ? 'DongHua' : null,
            })
          );
        }
        function convertPathPatternToShape(name) {
          if (!name) return null;
          return PathPatterns.get(name);
        }
        // OpenTriangle
        definePathPattern(
          "Greek",
          "M0 0 L1 0  1 3  0 3  M0 6 L4 6  4 0  8 0  M8 3 L7 3  7 6  8 6",
          "red",
          5
        );
        definePathPattern("Seed", "M0 0 A9 9 0 0 0 12 0  A9 9 180 0 0 0 0");
        definePathPattern("SemiCircle", "M0 0 A4 4 0 0 1 8 0");
        definePathPattern("BlindHem", "M0 4 L2 4  4 0  6 4  8 4");
        definePathPattern(
          "Zipper",
          "M0 4 L1 4 1 0 8 0 8 4 9 4  M0 6 L3 6 3 2 6 2 6 6 9 6"
        );
        definePathPattern(
          "Herringbone",
          "M0 2 L2 4 0 6  M2 0 L4 2  M4 6 L2 8",
          "red",
          1
        );

        this.myDiagram = $(
          go.Diagram,
          "myDiagram", //Diagram refers to its DIV HTML element by id
          {
            "undoManager.isEnabled": true,
            LinkDrawn: this.maybeChangeLinkCategory, // these two DiagramEvents call a
            LinkRelinked: this.maybeChangeLinkCategory, // function that is defined below
            // allowDragOut: false,// 允许拖拽节点
            // allowMove: false,// 允许拖动画板
            // isReadOnly: true,// 只读，无法编辑操作
          }
        );

        const portSize = new go.Size(9, 9); //小节点大小

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
          this.makeButton("更改背景色", (e, obj) =>
            this.changeBackground(obj.part.adornedObject)
          ),
          this.makeButton("添加头部小节点", (e, obj) => this.addPort("top")),
          this.makeButton("添加左侧小节点", (e, obj) => this.addPort("left")),
          this.makeButton("添加右侧小节点", (e, obj) => this.addPort("right")),
          this.makeButton("添加底部小节点", (e, obj) => this.addPort("bottom"))
        );

        // 给小节点设置删除
        const portMenu = $(
          "ContextMenu",
          this.makeButton("更改小节点颜色", (e, obj) =>
            this.changeColor(obj.part.adornedObject)
          ),
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

        //   节点模板
        this.myDiagram.nodeTemplate = $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            contextMenu: nodeMenu,
            doubleClick: (e, obj) => {
              //   点击事件
              console.log(this);
              //   拿到节点当前的信息
              console.log(e.diagram.selection.first().data);
            },
            //   contextMenu: nodeMenu,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
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
              background: "#01C0CA",
            },
            $(
              go.Shape,
              "Rectangle",
              {
                //   背景色和填充
                background: "#01c0ca",
                // 内容颜色
                fill: "#042334 ",
                stroke: null,
                strokeWidth: 20,
                cursor: "pointer",
                // 最小值
                minSize: new go.Size(50, 50),
              },
              //   动态设置
              new go.Binding("background", "background").makeTwoWay()
            ),
            $(
              go.TextBlock,
              {
                // margin: 8,
                // textAlign: "center",
                font: "bold 12px Segoe UI,sans-serif",
                stroke: "#fff",
                cursor: "pointer",
                editable: true,
                // editable: false,
              },
              new go.Binding("text", "name").makeTwoWay()
            )
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
                _side: "left", //内部属性，以便更容易地判断它位于哪一侧
                fromSpot: go.Spot.Left, //从左
                toSpot: go.Spot.Left, //到左
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
                  fill: "#01C0CA",
                  stroke: null,
                  strokeWidth: 5,
                  desiredSize: portSize,
                  margin: new go.Margin(6, 0),
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
                  desiredSize: portSize, //小节点大小
                  margin: new go.Margin(0, 6),
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
                  desiredSize: portSize,
                  margin: new go.Margin(6, 0),
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
                  fill: "#01C0CA",
                  desiredSize: portSize,
                  margin: new go.Margin(0, 6),
                },
                new go.Binding("fill", "portColor")
              )
            ), // end itemTemplate
          })
        );
        //   连线设置
        // this.myDiagram.linkTemplate = $(
        //   this.CustomLink,
        //   {
        //     routing: go.Link.AvoidsNodes, //自动绕开节点
        //     corner: 4, //拐角弧度
        //     curve: go.Link.JumpGap, //先和线相交不重叠
        //     reshapable: true,
        //     resegmentable: true,
        //     // 出发点和结束点是可以改变的
        //     relinkableFrom: true,
        //     relinkableTo: true,
        //   },
        //   new go.Binding("points").makeTwoWay(),
        //   //    线的颜色配置
        //   $(
        //     go.Shape,
        //     { stroke: "#01C0CA", strokeWidth: 3 },
        //   )
        // );

        // 实线
        this.myDiagram.linkTemplate = $(
          "Link",
          {
            routing: go.Link.AvoidsNodes,
            adjusting: go.Link.FROM,
            curve: go.Link.JumpOver,
            reshapable: true,
            resegmentable: true,
            relinkableFrom: true,
            relinkableTo: true,
            corner: 4,
            toShortLength: 1,
            cursor: "pointer",
            reshapable: false,
        
            name: "PIPELINE",
          },
          $(go.Shape, { strokeWidth: 2, stroke: "#555" }),
          // $("Shape", {
          //   name: "LINE",
          //   isPanelMain: true,
          //   stroke: "#2E68CC",
          //   // stroke: "#01C0CA",
          //   strokeWidth: 10,
          // }),
          $(go.Shape, { fromArrow: "Circle", scale: 1.5 }),
          // $(go.Shape, {
          //   isPanelMain: true,
          //   strokeDashOffset: 0,
          //   strokeWidth: 10,
          //   strokeDashArray: [10, 35],
          //   name: "DongHua",
          // }),

          // $(
          //   go.Shape,
          //   {
          //     isPanelMain: true,
          //     // stroke: "lightblue",
          //     stroke: "#01C0CA",
          //     // background:'red',
          //     // figure: "M0 0 L10 10 L0 20 L2 10 Z",
          //     // figure: "Triangle",
          //     // geometryString:'M0 0 L10 10 L0 20 L2 10 Z',
          //     // fill: "lightblue",
          //     strokeWidth: 8,
          //     name: "DongHua",
          //     strokeDashArray: [10, 35],
          //     // strokeDashArray: [6, 4],
          //     strokeDashOffset: 0,

          //   },
          //   new go.Binding("stroke", "ShapeColor").makeTwoWay(),

          // ),
          // $(go.Shape, "RoundedRectangle", {
          //   name: "SHAPE",
          //   fill: "rgba(255,255,255,0.4)",
          //   height: 24,
          //   strokeWidth: 1,
          //   stroke: "rgba(255,255,255,0.8)",
          // }),
          $(
            go.TextBlock,
            "C600",
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              // stroke: "rgba(255,255,255,0.9)",
              stroke: "#A1F9FA",
            },
            new go.Binding("text", "port1").makeTwoWay()
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
              width: 2,
              height: 2,
              stroke: null,
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

        let myJson = JSON.parse(JSON.stringify(this.myJson));
        this.myDiagram.model = go.Model.fromJson(myJson);
        // this.AnimationYes();
        this.animateLink();
      },
      CustomLink() {
        class CustomLink extends go.Link {}
        return new CustomLink();
      },
      save() {
        console.log(this.myDiagram.model.toJson());
        this.myDiagram.isModified = false;
        console.log(this.myDiagram.isModified);
      },
      animateLink() {
        const diagram = this.myDiagram;
        diagram.links.each((link) => {
          const pipeline = link.findObject("PIPELINE");
          if (pipeline) {
            const bounds = pipeline.actualBounds;
            let offsetX = (this.t * this.timeInterval) % bounds.width;
            pipeline.segmentOffset = new go.Point(offsetX, 0);
          }
        });
        this.t++;
      },
      AnimationYes() {
        var animation = new go.Animation();
        animation.easing = go.Animation.EaseLinear;
        this.myDiagram.links.each(function (link) {
          // console.log(link.findObject("DongHua"))/
          // animation.add(link.findObject("DongHua"), "strokeDashOffset", 60, 20);
          animation.add(link.findObject("DongHua"), "strokeDashOffset", 60, 20);
          // strokeDashOffset
        });
        animation.runCount = Infinity;
        animation.start();
      },
      //上下文button
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
          // compute the next available index number for the side
          let i = 0;
          while (node.findPort(side + i.toString()) !== node) i++;
          // now this new port name is unique within the whole Node because of the side prefix
          const name = side + i.toString();
          // get the Array of port data to be modified
          const arr = node.data[side + "Array"];
          if (arr) {
            // create a new port data object
            const newportdata = {
              portId: name,
              portColor: "#01C0CA",
            };
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
      // 更改小节点颜色
      changeColor(port) {
        this.myDiagram.startTransaction("colorPort");
        const data = port.data;
        this.myDiagram.model.setDataProperty(data, "portColor", "#ddd");
        this.myDiagram.commitTransaction("colorPort");
      },
      // 更改背景色
      changeBackground(port) {
        this.myDiagram.startTransaction("colorPort");
        const data = port.data;
        this.myDiagram.model.setDataProperty(data, "background", "red");
        this.myDiagram.commitTransaction("colorPort");
      },
      maybeChangeLinkCategory(e) {
        var link = e.subject;
        var linktolink = link.fromNode.isLinkLabel || link.toNode.isLinkLabel;
        e.diagram.model.setCategoryForLinkData(
          link.data,
          linktolink ? "linkToLink" : ""
        );
      },
    },
  };
</script>

<style scoped>
#myDiagram {
  width: 90%;
  height: 800px;
  border: 1px solid black;
}
</style>