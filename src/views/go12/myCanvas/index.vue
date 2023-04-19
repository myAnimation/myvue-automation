<template>
  <div class="canvas">
    <div ref="myDiagram" id="myDiagram"></div>
  </div>
</template>

<script>
import gojs from "gojs";
var go = gojs;
var $ = go.GraphObject.make;
import RightMenu from "@/views/go12/mixin/RightClickMenu";
export default {
  name: "goCanvas",
  data() {
    return {
      // gojs默认配置项
      defaultConfig: {
        "undoManager.isEnabled": true, //开启后可 ctrl  + Z  + C + v 撤销 赋值 粘贴 有效
        initialContentAlignment: go.Spot.Center, //启动视口中间的所有内容
        isReadOnly: true,  // 只读属性  改为false 既为编辑状态
        minScale: 0.3,      // 最小缩小
        maxScale: 1.5,   // 最大放大
        scale: 0.5, //初始视图大小比例
        LinkDrawn: this.maybeChangeLinkCategory, // these two DiagramEvents call a
        LinkRelinked: this.maybeChangeLinkCategory,
      },
    };
  },
  props: {
    // 接收数据值
    json: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 传递过来的配置项
    DiagramConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 节点和线路事件
    nodeAndLineEvent: {
      type: Object,
      default: () => {
        return {
          // 节点事件
          nodeEvent: {},
          // 线路事件
          lineEvent: {},
        };
      },
    },
    // 线路样式自定义（组件默认有封装）
    lineStyle: {
      type: Object,
      default: () => {
        return {
          // 样式配置
          style: {},
          // 需要动态绑定值
          Binding: [],
        };
      },
    },
    // 线的文字样式自定义
    lineTextStyle: {
      type: Object,
      default: () => {
        return {
          // 文字样式配置
          style: {},
          // 需要动态绑定值
          Binding: [],
        };
      },
    },
    // 线路动画样式(以及需要额外添加的样式) 主文件中注释有使用方式
    lineAddStyleList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 节点样式自定义（组件默认有封装）
    nodeStyle: {
      type: Object,
      default: () => {
        return {
          // 样式配置(分别又两种配置 1.gojs自带节点 2.使用图片 (两种为互斥选项))
          ShapeStyle: {},
          // 需要动态绑定值
          ShapeBinding: [],
          PictureStyle: {},
          // 需要动态绑定值
          PictureBinding: [],
        };
      },
    },
    // 节点文字样式自定义（默认内置）
    nodeTextStyle: {
      type: Object,
      default: () => {
        return {
          style: {},
          Binding: [],
        };
      },
    },
    // 右键事件合集
    RightClickMenu: {
      type: Object,
      default: () => {
        return {
          // 大节点右键配置(内置 粘贴复制)
          copyPaste: false,
          // 大节点右键配置(内置 删除节点)
          nodeDelete: false,
          // 添加端口（小节点）用于连线内置 四个方向进行添加
          addPort: false,
          // 后续大节点功能可自己添加
          nodeMenu: [],
          //后续小节点功能可自己添加
          portMenu: [],
          //后续线路功能可自己添加
          lineMenu: []
        };
      },
    }

  },
  mixins: [RightMenu], // 默认事件合集
  computed: {
    //  传递过来配置项和原本配置项合并
  },
  mounted() { },

  methods: {


    init() {
      var _that = this;
      console.log(this.nodeMenu);

      this.myDiagram = $(
        go.Diagram,
        this.$refs.myDiagram, //Diagram refers to its DIV HTML element by id
        {
          ...{ ...this.defaultConfig, ...this.DiagramConfig },
        }
      );

      let portSize = new go.Size(8, 8); //小节点大小
      // 给节点的设置右键按钮  //  nodeMenu上下文菜单
      // 固定的3个按钮，复制、粘贴、删除
      let nodeMenuList = []
      if (this.RightClickMenu.copyPaste) {
        nodeMenuList.push(this.nodeMenu[0])
        nodeMenuList.push(this.nodeMenu[1])
      }
      if (this.RightClickMenu.nodeDelete) {
        nodeMenuList.push(this.nodeMenu[2])
      }
      if (this.RightClickMenu.addPort) {

        nodeMenuList = nodeMenuList.concat(this.nodeMenu.slice(3, this.nodeMenu.length))
      }
      let nodeMenu = $(
        "ContextMenu",
        ...nodeMenuList.concat(this.RightClickMenu.nodeMenu).map((item) => {
          return this.makeButton(item.title, item.fn);
        })

      );
      let portMenuList = []
      if (this.RightClickMenu.portDelete) {
        portMenuList.push(this.portMenu[0])

      }
      if (this.RightClickMenu.portDeleteAll) {
        portMenuList.push(this.portMenu[1])
      }

      // 给小节点设置删除
      let portMenu = $(
        "ContextMenu",
        ...portMenuList.concat(this.RightClickMenu.portMenu).map((item) => {
          return this.makeButton(item.title, item.fn);
        })
      );
      let lineMenuList = []
      if (this.RightClickMenu.lineDelete) {
        lineMenuList.push(this.lineMenu[0])
      }
      // 给线路设置
      let lineMenu = $(
        "ContextMenu",
        ...lineMenuList.concat(this.RightClickMenu.lineMenu).map((item) => {
          return this.makeButton(item.title, item.fn);
        })
      );

      // 判断是否为只读状态
      if ({ ...this.defaultConfig, ...this.DiagramConfig }["isReadOnly"]) {
        portSize = new go.Size(0, 0);
        nodeMenu = null;
        portMenu = null;
        lineMenu = null;
      }

      //  节点模板
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Table",
        {
          locationObjectName: "BODY",
          locationSpot: go.Spot.Center,
          selectionObjectName: "BODY",
          contextMenu: nodeMenu, //去除右键
          ...this.nodeAndLineEvent.nodeEvent,
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
            // background: "#01C0CA",
          },
          $(
            this.nodeStyle.ShapeStyle ? go.Shape : go.Picture,
            this.nodeStyle.ShapeStyle
              ? {
                background: "#01c0ca",
                fill: "#042334",
                stroke: null,
                strokeWidth: 5,
                cursor: "pointer",
                figure: "RoundedRectangle",
                minSize: new go.Size(42, 42),
                ...this.nodeStyle.ShapeStyle,
              }
              : {
                name: "Picture",
                source: "",
                width: 100,
                height: 100,
                cursor: "pointer",
                ...this.nodeStyle.PictureStyle,
              },
            ...(this.nodeStyle.ShapeStyle
              ? this.nodeStyle.ShapeBinding
              : this.nodeStyle.PictureBinding
            ).map((item, index) => {
              let itemKeys = Object.keys(item);
              return new go.Binding(
                itemKeys[0],
                item[itemKeys[0]],
                item.fn ? item.fn : null
              ).makeTwoWay();
            })
            //   动态设置
            // new go.Binding("background", "backgroud").makeTwoWay()
          ),
          $(
            go.TextBlock,
            {
              font: "13pt Helvetica, Arial, sans-serif",
              stroke: "#fff",
              cursor: "pointer",
              editable: true,
              ...this.nodeTextStyle.style,
            },
            ...this.nodeTextStyle.Binding.map((item, index) => {
              let itemKeys = Object.keys(item);

              return new go.Binding(
                itemKeys[0],
                item[itemKeys[0]],
                item.fn ? item.fn : null
              ).makeTwoWay();
            })
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
                margin: new go.Margin(6, -3),
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
          ...this.nodeAndLineEvent.lineEvent,
          contextMenu: lineMenu,
        },
        new go.Binding("points").makeTwoWay(),
        // 线条颜色
        $(
          "Shape",
          {
            name: "LINE",
            isPanelMain: true,
            stroke: "#2E68CC",
            strokeWidth: 4,
            ...this.lineStyle.style,
          },
          ...this.lineStyle.Binding.map((item, index) => {
            let itemKeys = Object.keys(item);
            // console.log(itemKeys)
            return new go.Binding(
              itemKeys[0],
              item[itemKeys[0]],
              item.fn ? item.fn : null
            ).makeTwoWay();
          })
        ),

        $(
          go.TextBlock,
          "",
          {
            textAlign: "center",
            font: "12pt helvetica, arial, sans-serif",
            // stroke: "rgba(255,255,255,0.9)",
            stroke: "#A1F9FA",
            editable: true,
            ...this.lineTextStyle.style,
          },
          ...this.lineTextStyle.Binding.map((item, index) => {
            let itemKeys = Object.keys(item);
            // console.log(itemKeys)
            return new go.Binding(
              itemKeys[0],
              item[itemKeys[0]],
              item.fn ? item.fn : null
            ).makeTwoWay();
          })
        )
      );

      this.DiagramConfig["isReadOnly"] &&
        this.lineAddStyleList.forEach((item) => {
          this.myDiagram.linkTemplate.add(
            $(
              "Shape",
              {
                isPanelMain: true,
                ...item.style,
              },
              ...item.Binding.map((itemX, index) => {
                let itemKeys = Object.keys(itemX);
                return new go.Binding(
                  itemKeys[0],
                  itemX[itemKeys[0]],
                  itemX.fn ? itemX.fn : null
                ).makeTwoWay();
              })
            )
          );
        });
      // 每当通过链接工具绘制新链接时，它还添加节点数据对象。
      this.myDiagram.nodeTemplateMap.add(
        'LinkLabel',
        $(
          'Node',
          {
            selectable: false,
            avoidable: false,
            layerName: 'Foreground'
          }, // always have link label nodes in front of Links
          $('Shape', 'Ellipse', {
            width: 15,
            height: 15,
            stroke: null,
            fill: this.DiagramConfig["isReadOnly"] ? null : 'red',
            // fill:null,//去掉小圆点
            portId: '',
            fromLinkable: true,
            toLinkable: true,
            cursor: 'pointer'
          })
        )
      )
      this.myDiagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
      });

      // 用作链接的标签节点的，以允许向链接绘制链接或从链接绘制链接。
      this.myDiagram.toolManager.linkingTool.archetypeLabelNodeData = {
        category: "LinkLabel",
      };

      this.myDiagram.model = go.Model.fromJson(this.json);
      // this.AnimationYes();
    },

    save() {
      return {
        class: "GraphLinksModel",
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        linkLabelKeysProperty: "labelKeys",
        nodeDataArray: this.myDiagram.model.Fc,
        linkDataArray: this.myDiagram.model.Yc,
      };
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
  watch: {
    //  对比属性过多
    DiagramConfig: {
      deep: true,
      handler(newVal) {
        if (this.myDiagram) {
          this.myDiagram.div = null;
        }
        this.$nextTick(() => {
          this.init();
        });
      },
    },
    json: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (this.myDiagram) {
          this.myDiagram.div = null;
        }
        this.$nextTick(() => {
          this.init();
        });
      },
    },
  },
};
</script>

<style lang='scss' scoped>
.canvas {
  width: 100%;
  height: 90vh;

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
}
</style>