<template>
  <div>
    <div id="myDiagram"></div>
  </div>
</template>

<script>
  var $ = go.GraphObject.make;
  export default {
    name: "goAnimation",
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
        this.myDiagram = $(
          go.Diagram,
          "myDiagram", //Diagram refers to its DIV HTML element by id
          {
            "undoManager.isEnabled": true,
            //   allowDragOut: false,// 允许拖拽节点
            //   allowMove: false,// 允许拖动画板
            //   isReadOnly: true,// 只读，无法编辑操作
          }
        );
        this.myDiagram.addDiagramListener("InitialLayoutCompleted", (e) => {
          var animation = new go.Animation();

          // 创建虚拟节点
          var fakeNode = this.myDiagram.model.addNodeData({
            key: -1,
            category: "FakeNode",
          });

          // 遍历所有的箭头节点，并设置开始和结束节点
          this.myDiagram.nodes.each(function (node) {
            if (node.category === "ArrowNode") {
              var link = node.linksConnected.first();
              link.fromNode = fakeNode;
              link.toNode = node;
            }
          });

          // 创建动画数据，让虚拟节点在线路上移动
          var animationData = {
            position: new go.Point(0, 0),
          };
          var animationSettings = {
            duration: 2000, // 持续时间
            easing: go.Animation.EaseLinear, // 动画方式
            animationEnd: (e) => {
              // 动画结束时，重新调整节点位置
              fakeNode.position = new go.Point(-100, -100);
              this.myDiagram.layoutDiagram(true);
            },
          };

          // 将动画数据添加到动画中，并启动动画
          animation.add(animationData, animationSettings);
          animation.start();
        });

        // 箭头节点模板
        this.myDiagram.nodeTemplateMap.add(
          "ArrowNode",
          $(
            go.Node,
            $(go.Shape, {
              strokeWidth: 2,
              stroke: "blue",
              fill: "blue",
              width: 10,
              height: 10,
              toArrow: "Standard",
            })
          )
        );

        // 虚拟节点模板
        this.myDiagram.nodeTemplateMap.add(
          "FakeNode",
          $(
            go.Node,
            { locationSpot: go.Spot.Center },
            $(go.Shape, { fill: "transparent", width: 1, height: 1 })
          )
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