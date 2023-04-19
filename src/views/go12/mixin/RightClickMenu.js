import gojs from "gojs";
var go = gojs;
var $ = go.GraphObject.make;
import redzhong from "@/assets/dashboard/red/zhong.png";
export default {
    data() {
        return {
            // 大节点右键菜单事件
            nodeMenu: [
                {
                    title: '复制',
                    fn: (e, obj) => {
                        e.diagram.commandHandler.copySelection()
                    }
                },
                {
                    title: '粘贴',
                    fn: (e, obj) => {
                        e.diagram.commandHandler.pasteSelection()
                    }
                },
                {
                    title: '删除',
                    fn: (e, obj) => {
                        e.diagram.commandHandler.deleteSelection()
                    }
                },
                {
                    title: '添加头部小节点',
                    fn: (e, obj) => {
                        this.addPort("top")
                    }
                },
                {
                    title: '添加左侧小节点',
                    fn: (e, obj) => {
                        this.addPort("left")
                    }
                },
                {
                    title: '添加右侧小节点',
                    fn: (e, obj) => {
                        this.addPort("right")
                    }
                },
                {
                    title: '添加底部小节点',
                    fn: (e, obj) => {
                        this.addPort("bottom")
                    }
                },


            ],
            // 小节点右键菜单事件
            portMenu: [
                {
                    title: '删除小节点',
                    fn: (e, obj) => {
                        this.removePort(obj.part.adornedObject)
                    }
                },
                {
                    title: '删除全部小节点',
                    fn: (e, obj) => {
                        this.removeAll(obj.part.adornedObject)
                    }
                },

            ],
            // 线路右键菜单事件
            lineMenu: [
                {
                    title: '删除连线',
                    fn: (e, obj) => {
                        e.diagram.commandHandler.deleteSelection()
                    }
                },
               
            ]
        }
    },
    methods: {
        // 节点事件创建
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
        // 添加节点
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
    }
}
