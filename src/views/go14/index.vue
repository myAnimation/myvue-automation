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
            })
          );
        }
        function convertPathPatternToShape(name) {
          if (!name) return null;
          return PathPatterns.get(name);
        }

        // 正向箭头
        definePathPattern(
          "zx",
          "M0 2 L2 4 0 6  M2 0 L4 2  M4 6 L2 8",
          "green",
          0.1
        );
        definePathPattern("zx2", "M2 1 L10 5 M10 5 L2 9", "green");
        // 反向
        definePathPattern("fx", "M10 2 L4 6 10 10", "red");
        definePathPattern("fx2", "M10 -3 L4 2 M4 2 L10 8", "red");
        definePathPattern("fx3", "M10 -2 L4 2 M4 2 L10 6", "red");
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
          "Auto",
          $(
            go.Shape,
            "RoundedRectangle",
            { strokeWidth: 0 },
            new go.Binding("fill", "color")
          ),
          $(go.TextBlock, { margin: 8 }, new go.Binding("text", "key"))
        );
        this.diagram.linkTemplate = $(
          go.Link,
          // go.Link.Bezier,
          { reshapable: true },
          $(go.Shape, {
            isPanelMain: true,
            strokeWidth: 10,
            background: null,
            fill: null,
            stroke: "aqua",
          }),
          $(go.Shape, {
            isPanelMain: true,
            strokeWidth: 0,
            pathPattern: convertPathPatternToShape("zx2"),
          }),
          // The label
          $(go.Shape, "Circle", {
            name: "1",
            segmentIndex: 0,
            width: 15,
            height: 15,
            fill: "red",
            strokeWidth: 2,
          }),
          $(go.Shape, "Circle", {
            name: "2",
            segmentIndex: 1,
            width: 10,
            height: 10,
            fill: "green",
            strokeWidth: 2,
          })
        );
        this.diagram.model = new go.GraphLinksModel(
          [
            { key: "Alpha", color: "lightblue" },
            { key: "Gamma", color: "lightgreen" },
            { key: "Delta", color: "pink" },
          ],
          [
            { from: "Gamma", to: "Alpha" },
            { from: "Gamma", to: "Delta" },
            { from: "Delta", to: "Alpha" },
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
        var temp = new go.Point();
        // create one Animation for each link, so that they have independent durations
        var animation = new go.Animation();
        var animation2 = new go.Animation();

        this.diagram.links.each(function (node) {
          animation.add(
            node.findObject("1"),
            "fill",
            node.findObject("1").fill,
            go.Brush.randomColor()
          );
          animation.add(node.findObject("1"), "fraction", 0, 1);
        });

        animation.duration = 1000 + Math.random() * 2000;
        // animation.reversible = true; // Re-run backwards
        animation.runCount = Infinity; // Animate forever
        animation.start();
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