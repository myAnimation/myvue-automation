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
    //  setInterval(() => {
    //      this.animate1()
    //  },2000)
    this.animateColorAndFraction();
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
        "Spot",
        { locationSpot: go.Spot.Center },
        new go.Binding("angle"),
        $(
          go.Shape,
          "Diamond",
          { strokeWidth: 0, width: 75, height: 75 },
          new go.Binding("fill", "color")
        ),
        $(
          go.TextBlock,
          { margin: 8, font: "bold 12pt sans-serif" },
          new go.Binding("text", "key")
        )
      );

      this.diagram.model = new go.GraphLinksModel(
        [
          { key: "Alpha", color: "lightblue" },
          { key: "Beta", color: "orange" },
          { key: "Gamma", group: "G1", color: "lightgreen" },
          { key: "Delta", group: "G1", color: "pink", angle: 45 },
        ],
        [
          { from: "Alpha", to: "Beta" },
          { from: "Gamma", to: "Delta" },
        ]
      );
      go.AnimationManager.defineAnimationEffect(
        "fraction",
        function (
          obj,
          startValue,
          endValue,
          easing,
          currentTime,
          duration,
          animation
        ) {
        
          obj.segmentFraction = easing(
            currentTime,
            startValue,
            endValue - startValue,
            duration
          );
        }
      );
    },
    animateColorAndFraction() {
      // create one Animation for each link, so that they have independent durations
      this.diagram.links.each(function (node) {
        var animation = new go.Animation();
        animation.add(
          node.elt(1),
          "fill",
          node.elt(0).fill,
          go.Brush.randomColor()
        );
        animation.add(node.elt(1), "fraction", 0, 1);
        animation.duration = 1000 + Math.random() * 2000;
        animation.reversible = true; // Re-run backwards
        animation.runCount = Infinity; // Animate forever
        animation.start();
      });
    },
    // animate1() {
    //   var animation = new go.Animation();
    //   this.diagram.nodes.each(function (node) {
    //     // Animate the node's angle from its current value to a random value between 0 and 150 degrees
    //     animation.add(node, "angle", node.angle, Math.random() * 150);
    //   });
    // //   this.animation.time = 1000; // Animate over 1 second, instead of the default 600 milliseconds
    //   animation.start(); // starts the animation immediately
    // },
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