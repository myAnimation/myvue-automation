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
      diagram: null,
    };
  },
  mounted() {
    this.init();
    setInterval(() => {
        this.animateTrigger()
    },1000)
  
  },
  methods: {
    init() {
      this.diagram = $(
        go.Diagram,
        "myDiagram", //Diagram refers to its DIV HTML element by id
        {
          "undoManager.isEnabled": true,
          //   allowDragOut: false,// 允许拖拽节点
          //   allowMove: false,// 允许拖动画板
          //   isReadOnly: true,// 只读，无法编辑操作
        }
      );
      this.diagram.nodeTemplate = $(
        go.Node,
        $(
          go.Shape,
          "Rectangle",
          { strokeWidth: 12, stroke: "black", fill: "white" },
          new go.AnimationTrigger("stroke"),
          new go.AnimationTrigger("fill")
        )
      );

      this.diagram.model = new go.GraphLinksModel([{ key: "Alpha" }]); // One node

      // attach this Diagram to the window to use a button
     
    },
    animateTrigger(){
        this.diagram.commit(function (diag) {
        
          var node = diag.nodes.first();
          node.elt(0).stroke = go.Brush.randomColor();
          node.elt(0).fill = go.Brush.randomColor();
        });
     }
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