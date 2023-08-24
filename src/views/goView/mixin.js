// import gojs from "gojs";
// import go from "@/utils/lib/gojs/release/go-module";
// var $ = go.GraphObject.make;
import {
  getEMSBreakerData,
  getEMSAclineendData,
  getEMSPowertransformerData,
  getEMSBusbarsectionData,
  getPwEMSBreakerData,
  getPwEMSBreakerDataGt,

  getSubstationGroupData
} from "@/api/Intelligent/goCanvas";
var $ = go.GraphObject.make;
import { cloneDeep } from "lodash";
import { parseTime } from "@/utils/index";
var PathPatterns = new go.Map();
export default {
  data() {
    return {
      hoverType: "",
      toolTipDiv: "",
    };
  },

  methods: {
    // 左侧面板配置
    createdPaleDOM() {
      this.myPalette = $(go.Palette, "myPaletteDiv", {
        scale: 0.4, // 初始视图大小比例
        // initialContentAlignment: go.Spot.Center, // 启动视口中间的所有内容
        nodeTemplateMap: this.myDiagram.nodeTemplateMap,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // 开启滚轮事件
        layout: $(go.GridLayout, {
          wrappingColumn: 1,
          // wrappingWidth:120,
          spacing: new go.Size(30, 40),
          // cellSize: new go.Size(120, 20),
          isViewportSized: true,
        }),
      });

      this.myPalette.model.nodeDataArray = [
        {
          type: "default-dzVertical",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          stroke: "#b9d9f2",
          portColor: "#00ff00",
        },
        {
          type: "default-dzTransverse",
          textDirection: [0, 2],
          textRow: 0,
          textColumn: 1,
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          stroke: "#b9d9f2",
          portColor: "#00ff00",
        },
        {
          type: "default-quan3",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-quan2",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-quan1",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-kgTransverse",
          textDirection: [0, 1],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-kgVertical",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-sd",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-zn",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-zsTransverse",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-zsVertical",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },
        {
          type: "default-gf",
          textDirection: [1, 0],
          name: "",
          font: "",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
        },

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
          fill: "#b9d9f2",
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
          fill: "#b9d9f2",
        },
        {
          name: "xnd",
          category: "xnd",
          leftArray: [],
          bottomArray: [],
          rightArray: [],
          topArray: [],
          fill: "#b9d9f2",
          size: 50,
        },
        {
          text: "文本",
          category: "textarea",
          width: 100,
          height: 50,
        },
        {
          category: "xxqy",
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
    // 节点TooTip配置
    createdNodeTooTip() {
      var myToolTip = $(go.HTMLInfo, {
        show: this.showToolTip,
        hide: this.hideToolTip,
      });
      return myToolTip;
    },
    async showToolTip(obj, diagram, tool) {
      this.hoverType = "";
      tool.toolTipDuration = 100000000000;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      let hoverData = obj.data;
      let hoverId = "";
      this.toolTipDiv = null;
      let pt = diagram.lastInput.viewPoint;
      this.toolTipLineInfo = {};
      this.toolTipZbInfo = [];
      this.toolTipMxInfo = {};
      this.toolTipKgInfo = {};
      let res = {};
      let calcId = encodeURIComponent(this.calcId);
      let sectionTime = this.dmTime
        ? parseTime(this.dmTime, "{y}-{m}-{d} {h}:{i}:") + "00"
        : "";
      this.loading = true;
      if (
        hoverData.infoJson &&
        hoverData.infoJson.id &&
        hoverData.infoJson.type &&
        hoverData.infoJson.type == "zw"
      ) {
        hoverId = hoverData.infoJson.id;
        this.hoverType = hoverData.infoJson.deviceType;

        switch (hoverData.infoJson.deviceType) {
          case "线路":
            this.toolTipDiv = document.getElementById("toolTipLine");
            // this.toolTipLineInfo = this.$options.data().toolTipInfo

            res = await getEMSAclineendData(hoverId, calcId, sectionTime);
            this.toolTipLineInfo = res.data;
            // getEMSAclineendData(hoverId, calcId, sectionTime).then(res => {
            //     this.toolTipLineInfo = res.data
            //     this.loading = false
            // })
            break;
          case "主变":
            this.toolTipDiv = document.getElementById("toolTipZb");
            // this.toolTipZbInfo = this.$options.data().toolTipInfo
            // this.loading = true
            res = await getEMSPowertransformerData(
              hoverId,
              calcId,
              sectionTime
            );
            this.toolTipZbInfo = res.data;
            // getEMSPowertransformerData(hoverId, calcId, sectionTime).then(res => {
            //     this.toolTipZbInfo = res.data
            //     this.loading = false
            // })
            break;
          case "母线":
            this.toolTipDiv = document.getElementById("toolTipMx");
            // this.toolTipMxInfo = this.$options.data().toolTipInfo
            // this.loading = true
            res = await getEMSBusbarsectionData(hoverId);
            this.toolTipMxInfo = res.data;
            // getEMSBusbarsectionData(hoverId).then(res => {
            //     this.toolTipMxInfo = res.data
            //     this.loading = false
            // })
            break;
          case "开关":
            this.toolTipDiv = document.getElementById("toolTipKg");
            // this.toolTipKgInfo = this.$options.data().toolTipInfo
            // this.loading = true
            res = await getEMSBreakerData(hoverId, calcId, sectionTime);
            this.toolTipKgInfo = res.data;

            // getEMSBreakerData(hoverId, calcId, sectionTime).then(res => {
            //     this.toolTipKgInfo = res.data
            //     this.loading = false
            // })
            break;
          case "小水电组":
            this.toolTipDiv = document.getElementById("toolTipXsdz");
            // this.toolTipKgInfo = this.$options.data().toolTipInfo
            // this.loading = true
            res = await getSubstationGroupData(hoverId);


            this.toolTipXsdzInfo = res.data;


            break;
        }
      } else if (
        hoverData.infoJson &&
        hoverData.infoJson.id &&
        hoverData.infoJson.type &&
        hoverData.infoJson.type == "pw"
      ) {
        hoverId = hoverData.infoJson.id;
        this.hoverType = hoverData.infoJson.deviceType;
        switch (hoverData.infoJson.deviceType) {
          case "线路":
            // this.toolTipDiv = document.getElementById("toolTipLinePw");
            // this.loading = true
            // getEMSAclineendData(hoverId).then(res => {
            //     this.toolTipLineInfo = res.data
            //     this.loading = false
            // })
            break;
          case "主变":
            // this.toolTipDiv = document.getElementById("toolTipZbPw");
            // res = await getEMSPowertransformerData(hoverId)
            // this.toolTipZbInfo = res.data
            // this.loading = true
            // getEMSPowertransformerData(hoverId).then(res => {
            //     this.toolTipZbInfo = res.data
            //     this.loading = false
            // })
            break;
          case "母线":
            // this.toolTipDiv = document.getElementById("toolTipMxPw");
            // this.loading = true
            // getEMSBusbarsectionData(hoverId).then(res => {
            //     this.toolTipMxInfo = res.data
            //     this.loading = false
            // })
            break;
          case "开关":
            this.toolTipDiv = document.getElementById("toolTipKgPw");
            res = await getPwEMSBreakerData(hoverId, calcId, sectionTime);
            this.toolTipKgPwInfo = res.data;
            // this.loading = true
            // getPwEMSBreakerData(hoverId, calcId, sectionTime).then(res => {
            //     this.toolTipKgPwInfo = res.data
            //     this.loading = false
            // })
            break;
          case "杆塔":
            this.toolTipDiv = document.getElementById("toolTipGtPw");
            res = await getPwEMSBreakerDataGt(hoverId);
            this.toolTipGtPwInfo = res.data;
            // this.loading = true
            // getPwEMSBreakerData(hoverId, calcId, sectionTime).then(res => {
            //     this.toolTipGtPwInfo = res.data
            //     this.loading = false
            // })
            break;

          case "小水电组":
            this.toolTipDiv = document.getElementById("toolTipXsdz");
            // this.toolTipKgInfo = this.$options.data().toolTipInfo
            // this.loading = true
            res = await getSubstationGroupData(hoverId);


            this.toolTipXsdzInfo = res.data;


            break;

        }
      } else {
        this.$message({
          message: "信息暂无绑定！",
          type: "warning",
        });
      }
      this.loading = false;
      let index = 0;
      let indey = 0;

      if (Array.isArray(res.data)) {
        indey = res.data.length;
      } else {
        for (let key in res.data) {
          if (Array.isArray(res.data[key])) {
            indey = res.data[key].length;
          }
        }
      }

      if (this.toolTipDiv) {
        let bodyDom = this.$refs["goCanvas"];

        if (pt.x + 300 >= bodyDom.clientWidth) {
          index = -300;
        } else {
          index = 0;
        }

        if (pt.y + indey * 225 >= bodyDom.clientHeight) {
          // 自身高度 indey * 225
          // 当前到达的区域 pt.y
          // 当前我看到了的长度
          let seeHeight = bodyDom.clientHeight - pt.y;
          // 我自己自身的高度
          let myHeight = indey * 225;
          // 还剩多少没看见
          indey = seeHeight - myHeight + 40;
          // indey = bodyDom.clientHeight - ((indey - 1) *225)
        } else if (bodyDom.clientHeight - pt.y < 225) {
          let seeHeight = bodyDom.clientHeight - pt.y;
          // 我自己自身的高度
          let myHeight = 225 / 2;
          indey = seeHeight - myHeight;
        } else if (pt.y < 225 / 2) {
          indey = 225 / 2 - 60;
        } else {
          indey = 0;
        }

        this.toolTipDiv.style.left = pt.x + 40 + index + "px";
        this.toolTipDiv.style.top = pt.y - 60 + indey + "px";
        this.toolTipDiv.style.display = "block";
      }
    },
    hideToolTip(obj, diagram, tool) {
      if (this.toolTipDiv) {
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.toolTipDiv.style.display = "none";
          }, 500);
        }
        this.toolTipDiv.onmouseenter = () => {
          clearTimeout(this.timer);
          this.timer = null;
          this.toolTipDiv.style.display = "block";
        };
        this.toolTipDiv.onmouseleave = () => {
          this.toolTipDiv.style.display = "none";
        };
      }
    },

    makeButton(text, action, visiblePredicate) {
      return $(
        "ContextMenuButton",
        $(go.TextBlock, text, {
          alignment: go.Spot.Left,
          margin: 5,
          textAlign: "left",
          font: "14px sans-serif",
          opacity: 0.85,
          stroke: "#404040",
          width: "auto",
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
    maybeChangeLinkCategory(e) {
      var link = e.subject;
      var linktolink = link.fromNode.isLinkLabel || link.toNode.isLinkLabel;
      e.diagram.model.setCategoryForLinkData(
        link.data,
        linktolink ? "linkToLink" : ""
      );
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
    // 闪烁动画
    flickerAnimation() {
      if (this.flickerTimer) {
        clearInterval(this.flickerTimer);
        this.flickerTimer = null;
      }
      let opacityList = [0.1, 0.4, 0.8, 0.9];
      this.flickerTimer = setInterval(() => {
        if (this.myDiagram) {
          this.myDiagram.nodes.filter((node) => {
            if (this.flickerList.includes(node.data.id)) {
              let index = opacityList.indexOf(node.data.opacity);
              index += 1;
              this.myDiagram.model.setDataProperty(
                node.data,
                "opacity",
                opacityList[index]
              );
            }
          });
        }
      }, 200);
    },
    // 潮流动画
    AnimationYes() {
      if (this.animation) {

        this.animation.stop()
        this.animation.duration = 1;
        this.animation.runCount = 1;
        this.animation.easing = null
        this.animation.name = null
        this.animation = null
      }
      // this.trendDirection()
      this.animation = new go.Animation();
      //  suspend
      this.animation.duration = 700;
      // animation.easing = go.Animation.EaseOutQuad;
      this.animation.easing = go.Animation.EaseLinear;
      // let zArr = [105, 15]
      let zArr = [120, 0];
      let fArr = [0, 120];
      // let fArr = [20, 60]
      // let greenZarr = [170, 0];
      let greenZarr = [150, 0];
      // let greenfarr = [0, 170];
      let greenfarr = [0, 150];
      this.myDiagram.links.each((link) => {
        // 60 20
        // console.log('linkpart',link.part.data)
        // console.log('link.findObject("DongHua")',link.findObject("DongHua"))
        if (link.part && link.part.data && link.part.data.ShapeColor) {
          // console.log('link.findObject("DongHua")',link.findObject("DongHua"))
          // .part.data
          // console.log('xx',this.myDiagram.findLinkForData(link.part.data).data)
          if (link.part.data.strokeWidth && link.part.data.strokeWidth != 8) {
            this.animation.add(
              link.findObject("DongHua"),
              "strokeDashOffset",
              ...(link.part.data.direction ? greenZarr : greenfarr),
              true
            );
          } else {
            this.animation.add(
              link.findObject("DongHua"),
              "strokeDashOffset",
              ...(link.part.data.direction ? zArr : fArr),
              true
            );
          }
        }
      });
      this.animation.runCount = Infinity;
      this.animation.start();
    },
    // 设置箭头样式
    definePathPattern(name, geostr, color, width, cap) {
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
    },
    // 获取箭头
    convertPathPatternToShape(name) {
      if (!name) return null;
      return PathPatterns.get(name);
    },
    // 获取潮流展示
    trendDirection(from, to, lineId, electricCurrentType) {
      let keyFrom;
      let keyTo;
      if (lineId) {
        /**
         * 所有T接站是同一个ID，涉及到T接站的需加个lineId，通过lindId来进行判断方向
         * 通过lineId获取线路，得到该线路的两端key值keyNodeFrom和keyNodeTo
         * 通过keyNodeFrom和keyNodeTo获取对应的id，keyId1和keyId2
         * keyId1、keyId2与传参所得的from、to进行对比，获取潮流方向
         */
        let { from: keyNodeFrom, to: keyNodeTo } = this.myDiagram
          .findLinksByExample({
            id: lineId,
          })
          .first()?.data || { from: "", to: "" };
        let keyId1 = this.myDiagram.findNodeForKey(keyNodeFrom)
          ? this.myDiagram.findNodeForKey(keyNodeFrom).data.id
          : "";
        let keyId2 = this.myDiagram.findNodeForKey(keyNodeTo)
          ? this.myDiagram.findNodeForKey(keyNodeTo).data.id
          : "";

        if (keyId1 == from && keyId2 == to) {
          keyFrom = keyNodeFrom;
          keyTo = keyNodeTo;
        } else if (keyId1 == to && keyId2 == from) {
          keyFrom = keyNodeTo;
          keyTo = keyNodeFrom;
        }
      } else {
        /**
         * 通过from、to获取元件key值keyNodeFrom、keyNodeTo，从而获取潮流方向keyFrom - keyTo
         */

        let { key: keyNodeFrom } = this.myDiagram
          .findNodesByExample({
            id: from,
          })
          .first()?.data || { key: "" };

        let { key: keyNodeTo } = this.myDiagram
          .findNodesByExample({
            id: to,
          })
          .first()?.data || { key: "" };
        keyFrom = keyNodeFrom;
        keyTo = keyNodeTo;
      }
      if (!keyTo) {
        // console.log("没有的toID", to);
        return;
      }
      if (!keyFrom) {
        // console.log("没有的fromID", from);
        return;
      }
      this.myDiagram.links.filter((item) => {
        if (item && item.data) {
          if (item.data.from === keyFrom && item.data.to === keyTo) {
            this.myDiagram.model.setDataProperty(item.data, "direction", 1);
            this.myDiagram.model.setDataProperty(item.data, "electricCurrentType", electricCurrentType);
            //   window.HEXList = {
            //     '0.1': '1a',
            //     '0.2': '33',
            //     '0.3': '4d',
            //     '0.4': '66',
            //     '0.5': '80',
            //     '0.6': '99',
            //     '0.7': 'b3',
            //     '0.8': 'cc',
            //     '0.9': 'e6',
            // };
            if (this.ldSwitch && electricCurrentType) {
              // 绿电加背景层
              item.findObject("jt").stroke = item.findObject("LINE").stroke + '4d'
              item.findObject("jt").stroke = '#83E1E3' + '4d'
              // item.findObject("jt").stroke = '#0ce9ed'
              item.findObject("jt").opacity = 0.8
              item.findObject("LINE").strokeWidth = 0
              this.myDiagram.model.setDataProperty(item.data, "pathPattern", "zx");
              this.myDiagram.model.setDataProperty(item.data, "ShapeColor", "#B5FEFF");
              // this.myDiagram.model.setDataProperty(item.data, "ShapeColor", "#88ff14")
              this.myDiagram.model.setDataProperty(item.data, "strokeWidth", 14);
              // this.myDiagram.model.setDataProperty(item.data, "strokeWidth", 8);

            } else if (this.greenSwitch) {
              // 去掉绿电加背景层
              item.findObject("jt").stroke = null
              item.findObject("jt").opacity = 0
              item.findObject("LINE").strokeWidth = 3
              this.myDiagram.model.setDataProperty(item.data, "pathPattern", "");
              this.myDiagram.model.setDataProperty(item.data, "ShapeColor", item.data.stroke ? item.data.stroke : "red");
              this.myDiagram.model.setDataProperty(item.data, "strokeWidth", 8);
            } else {
              // 去掉绿电加背景层
              item.findObject("jt").stroke = null
              item.findObject("jt").opacity = 0
              item.findObject("LINE").strokeWidth = 3
              this.myDiagram.model.setDataProperty(item.data, "pathPattern", "");
              this.myDiagram.model.setDataProperty(item.data, "ShapeColor", null)
            }
            return true;
          }
          if (item.data.from === keyTo && item.data.to === keyFrom) {
            this.myDiagram.model.setDataProperty(item.data, "direction", 0);
            this.myDiagram.model.setDataProperty(item.data, "electricCurrentType", electricCurrentType);
            if (this.ldSwitch && electricCurrentType) {
              // 绿电加背景层
              item.findObject("jt").stroke = item.findObject("LINE").stroke + '4d'
              item.findObject("jt").stroke = '#83E1E3' + '4d'
              // item.findObject("jt").stroke = '#0ce9ed'
              item.findObject("jt").opacity = 0.8
              item.findObject("LINE").strokeWidth = 0

              this.myDiagram.model.setDataProperty(item.data, "pathPattern", "fx");
              this.myDiagram.model.setDataProperty(item.data, "ShapeColor", "#B5FEFF")
              // this.myDiagram.model.setDataProperty(item.data, "ShapeColor", "#88ff14")
              this.myDiagram.model.setDataProperty(item.data, "strokeWidth", 14);
              // this.myDiagram.model.setDataProperty(item.data, "strokeWidth", 8);
            } else if (this.greenSwitch) {
              // 去掉绿电加背景层
              item.findObject("jt").stroke = null
              item.findObject("jt").opacity = 0
              item.findObject("LINE").strokeWidth = 3
              this.myDiagram.model.setDataProperty(item.data, "pathPattern", "");
              this.myDiagram.model.setDataProperty(item.data, "ShapeColor", item.data.stroke ? item.data.stroke : "red");
              this.myDiagram.model.setDataProperty(item.data, "strokeWidth", 8);

            } else {
              // 去掉绿电加背景层
              item.findObject("jt").stroke = null
              item.findObject("jt").opacity = 0
              item.findObject("LINE").strokeWidth = 3
              this.myDiagram.model.setDataProperty(item.data, "pathPattern", "");
              this.myDiagram.model.setDataProperty(item.data, "ShapeColor", null)

            }
            return true;
          }
        }
      });
    },
    // 修改状态显示未连接端口 查看状态隐藏端口
    displayPort(json, flag) {
      let list = ["leftArray", "bottomArray", "rightArray", "topArray"];
      let color = "#3d96da";
      json.nodeDataArray.forEach((item) => {
        if (item.category && item.category.includes("Bar") && flag) {
          list.forEach((key) => {
            item[key]?.forEach((port) => {
              port.portColor = null;
            });
          });
        } else if (item.category && item.category.includes("Bar") && !flag) {
          list.forEach((key) => {
            item[key]?.forEach((port) => {
              port.portColor = color;
            });
          });
        }
      });
      json.linkDataArray.forEach((link) => {
        json.nodeDataArray.forEach((node) => {
          if (
            link.from === node.key &&
            node.category &&
            node.category.includes("Bar")
          ) {
            const directionList = link.fromPort.replace(/[0-9]/g, "") + "Array";

            node[directionList]?.forEach((port) => {
              if (port.portId === link.fromPort && flag) {
                port.portColor = color;
              }
            });
          }
          if (
            link.to === node.key &&
            node.category &&
            node.category.includes("Bar")
          ) {
            const directionList = link.toPort.replace(/[0-9]/g, "") + "Array";
            node[directionList]?.forEach((port) => {
              if (port.portId === link.toPort && flag) {
                port.portColor = color;
              }
            });
          }
        });
      });

      return json;
    },
    // 端口颜色判断
    createdPortColor(portColor, e) {
      let colorList = [
        { voltage: "10kV", color: "#0CE9ED" },
        { voltage: "35kV", color: "#D4E7F1" },
        { voltage: "110kV", color: "#FD7566" },
        { voltage: "220kV", color: "#FF9052" },
      ];
      if (e.part.data.type.includes("dz")) {
        return e.part.data.stroke;
      } else {
        let color = portColor;
        colorList.forEach((item) => {
          if (e.part.data.type.includes(item.voltage)) {
            color = item.color;
          }
        });
        return color;
      }
    },
    // 节点大小判断
    createdNodeSize(type) {
      if (type.includes("dzVertical")) {
        return new go.Size(20, 40);
      }
      if (type.includes("dzTransverse")) {
        return new go.Size(40, 20);
      }
      if (type.includes("kgTransverse")) {
        return new go.Size(40, 20);
      }
      if (type.includes("kgVertical")) {
        return new go.Size(20, 40);
      }
      if (type.includes("quan3")) {
        return new go.Size(80, 80);
      }
      if (type.includes("quan2")) {
        return new go.Size(80, 80);
      }
      if (type.includes("quan1")) {
        return new go.Size(60, 60);
      }
      return new go.Size(50, 50);
    },
    changeKGStatus(data) {
      if (this.$route.fullPath.includes("init")) {
        return;
      }

      let { infoJson, fill, stroke } = data;
      if (infoJson && infoJson.deviceType == "开关") {
        this.$confirm(
          `当前开关状态为"${fill ? "合" : "分"}"， 是否继续更改?`,
          infoJson.name,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: fill ? "warning" : "success",
            // danger
            // iconClass:"el-icon-s-tools",
          }
        )
          .then(() => {
            this.myDiagram.model.setDataProperty(
              data,
              "fill",
              fill ? null : stroke
            );
            this.$message({
              type: "success",
              message: "更改成功!",
            });
            if (!this.flickerList.includes(data.id)) {
              this.flickerList.push(data.id);
            }
            this.myDiagram.links.each((link) => {
              if (link.part && link.part.data && link.part.data.ShapeColor) {
                this.myDiagram.model.setDataProperty(
                  link.part.data,
                  "ShapeColor",
                  null
                );
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消更改",
            });
          });
      }
    },
    // 清除开关状态
    clearKGStatus() {
      this.myDiagram?.nodes.each((item) => {
        let data = item.data;

        if (data.id) {
          if (data.type && data.type.includes("dz")) {
            this.myDiagram.model.setDataProperty(data, "fill", null);
            //  fill
          }
        }
      });
    },
    // 清除线路状态
    clearLineShapeColor() {
      this.myDiagram?.links.each((link) => {
        if (link.part && link.part.data && link.part.data.ShapeColor) {
          // 全部数据清除
          this.myDiagram.model.setDataProperty(link.data, "strokeWidth", 8);
          this.myDiagram.model.setDataProperty(link.data, "ShapeColor", null);
          this.myDiagram.model.setDataProperty(link.data, "electricCurrentType", null);
        }
      });
    },

    // 潮流值
    showPQIDataJSON(list = []) {
      this.myDiagram.nodes.each((item) => {
        let data = item.data;

        if (data.id) {
          if (data.category && data.category.includes("PQI")) {
            this.myDiagram.model.setDataProperty(data, "visible", "0");
            let pqiList = [
              "p",
              "q",
              "i",
              "afterCalculateP",
              "afterCalculateQ",
              "afterCalculateI",
            ];
            pqiList.forEach((key) => {
              if (data[key] && data[key].includes("1000.00")) {
                this.myDiagram.model.setDataProperty(data, key, null);
              }
            });
          }
        }
      });
      list.forEach((item) => {
        let node = this.myDiagram
          .findNodesByExample({
            id: item.id,
            category: "PQI",
          })
          ?.first();
        if (node && node.data) {
          this.myDiagram.model.setDataProperty(
            node.data,
            "p",
            item.p !== null ? `P：${item.p}` : null
          );
          this.myDiagram.model.setDataProperty(
            node.data,
            "q",
            item.q !== null ? `Q：${item.q}` : null
          );
          this.myDiagram.model.setDataProperty(
            node.data,
            "i",
            item.i !== null ? `I：${item.i}` : null
          );

          this.myDiagram.model.setDataProperty(
            node.data,
            "afterCalculateP",
            item.afterCalculateP !== null ? ` / ${item.afterCalculateP}` : null
          );
          this.myDiagram.model.setDataProperty(
            node.data,
            "afterCalculateQ",
            item.afterCalculateQ !== null ? ` / ${item.afterCalculateQ}` : null
          );
          this.myDiagram.model.setDataProperty(
            node.data,
            "afterCalculateI",
            item.afterCalculateI !== null ? ` / ${item.afterCalculateI}` : null
          );

          this.myDiagram.model.setDataProperty(node.data, "visible", "1");
        }
      });
    },
    // 显示潮流
    showLineShapeColor(trendList) {
      //  this.clearLineShapeColor('xxx')
      /**
       * emsTransformerwindingVOS 值得是绕组到母线的线路数组
       * 绕组到母线之间会存在0个或者多个开关存在betweenessVOS数组中，同时开关不一定在页面中展示
       * item.betweenessVOS.forEach，循环开关数组，判断是否在页面中，生成一个新的存在开关的newKgList数组
       * 这时潮流方向为emsTransformerwindingVOS.from - newKgList[0] - newKgList[1] ... newKgList[last] - emsTransformerwindingVOS.to
       * this.trendDirection(from, to, null, item.electricCurrentType);
       */
      // emsTransformerwindingVOS  绕组线路
      trendList?.emsTransformerwindingVOS?.forEach((item) => {
        let fromId = "";
        let toId = "";
        let newKgList = [];
        item.betweenessVOS.forEach((temp) => {
          let hasKg;
          if (this.myDiagram) {
            hasKg = this.myDiagram
              .findNodesByExample({
                id: temp.id,
              })
              .first();
          }
          if (hasKg) {
            newKgList.push(temp);
          }
        });
        if (newKgList.length > 0) {
          for (var i = 0; i < newKgList.length; i++) {
            if (i == 0) {
              fromId = item.from;
              toId = newKgList[i].id;
            } else {
              fromId = newKgList[i - 1].id;
              toId = newKgList[i].id;
            }
            this.trendDirection(fromId, toId, null, item.electricCurrentType);
          }
          this.trendDirection(
            newKgList[newKgList.length - 1].id,
            item.to,
            null,
            item.electricCurrentType
          );
        } else {
          this.trendDirection(
            item.from,
            item.to,
            null,
            item.electricCurrentType
          );
        }
      });
      // emsAcLineVOS  普通线路
      trendList?.emsAcLineVOS?.forEach((item) => {
        let { from, to, lineId } = item;
        this.trendDirection(from, to, lineId, item.electricCurrentType);
      });
      // trendList?.dmsAcLineVOS?.forEach((item) => {
      //   let { from, to, lineId } = item;
      //   this.trendDirection(from, to, lineId, item.electricCurrentType);
      // });
      // this.AnimationYes();
    },
    // 清除开关闪烁
    clearKGFlicke() {
      if (this.myDiagram) {
        this.flickerList = [];
        this.myDiagram.nodes.filter((node) => {
          if (node.data && node.data.id) {
            this.myDiagram.model.setDataProperty(node.data, "opacity", 1);
          }
        });
      }
    },
    // 导出
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data.split(",")[1]);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
  },
};
