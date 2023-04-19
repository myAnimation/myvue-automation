import gojs from "gojs";
var go = gojs;
var $ = go.GraphObject.make;
export default {
    methods: {
        save() {
            console.log(this.myDiagram.model.toJson());
            this.myDiagram.isModified = false;
        },
        load() {
            this.myDiagram.model = go.Model.fromJson({
                class: "go.GraphLinksModel",
                nodeDataArray: [
                    { key: 0, text: "Gen1", category: "Generator", location: "300 0" },
                    {
                        key: 1,
                        text: "Bar1",
                        category: "HBar",
                        location: "100 100",
                        size: "500 4",
                        fill: "green",
                    },

                    {
                        key: 2,
                        text: "Bar2",
                        category: "HBar",
                        location: "0 300",
                        size: "600 4",
                        fill: "orange",
                    },
                    {
                        key: 4,
                        text: "Conn1",
                        category: "Connector",
                        location: "232.5 207.75",
                    },
                   
                ],
                linkDataArray: [
                    { from: 0, to: 1 },
                    { from: 0, to: 2 },
                    { from: 4, to: 1 },
                    { from: 4, to: 2 },

                ],
            });
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
                { text: "Generator", category: "Generator" },
                { text: "Consumer", category: "Consumer" },
                { text: "Connector", category: "Connector" },
                { text: "Bar", category: "HBar", size: "100 4" },
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
        BarLink() {
            return class BarLink extends go.Link {
                computeSpot(from, port) {
                    if (from && this.toNode && this.toNode.category === "HBar")
                        return go.Spot.TopBottomSides;
                    if (!from && this.fromNode && this.fromNode.category === "HBar")
                        return go.Spot.TopBottomSides;
                    return super.computeSpot(from, port);
                }

                getLinkPoint(node, port, spot, from, ortho, othernode, otherport) {
                    if (!from && node.category === "HBar") {
                        var op = super.getLinkPoint(
                            othernode,
                            otherport,
                            this.computeSpot(!from),
                            !from,
                            ortho,
                            node,
                            port
                        );
                        var r = port.getDocumentBounds();
                        var y = op.y > r.centerY ? r.bottom : r.top;
                        if (op.x < r.left) return new go.Point(r.left, y);
                        if (op.x > r.right) return new go.Point(r.right, y);
                        return new go.Point(op.x, y);
                    } else {
                        return super.getLinkPoint(
                            node,
                            port,
                            spot,
                            from,
                            ortho,
                            othernode,
                            otherport
                        );
                    }
                }

                getLinkDirection(
                    node,
                    port,
                    linkpoint,
                    spot,
                    from,
                    ortho,
                    othernode,
                    otherport
                ) {
                    if (

                        node.category === "HBar" ||
                        othernode.category === "HBar"
                    ) {
                        var p = port.getDocumentPoint(go.Spot.Center);
                        var op = otherport.getDocumentPoint(go.Spot.Center);
                        var below = op.y > p.y;
                        return below ? 90 : 270;
                    } else {
                        return super.getLinkDirection(
                            node,
                            port,
                            linkpoint,
                            spot,
                            from,
                            ortho,
                            othernode,
                            otherport
                        );
                    }
                }
            };
        },
    }
}