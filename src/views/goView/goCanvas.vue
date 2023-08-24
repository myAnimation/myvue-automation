<template>
  <div class="goCanvas" ref="goCanvas" v-loading="currentOptimalLoading" element-loading-text="潮流生成中,请耐心等待"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- v-loading="loading2"
    :element-loading-text="`潮流计算中，预计用时${m}${s}秒`"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-spinner="el-icon-loading" -->

    <div class="details">
      <div class="cl" v-if="showcl">
        <span style="margin-right: 10px">断面时间：</span>
        <el-date-picker v-model="dmTime" type="datetime" class="dmTimeDom" format="yyyy-MM-dd HH:mm"
          @change="changedmTime" placeholder="选择日期时间" :popper-class="fillPath" @focus="addButtonClick" :ref="fillPath">
          <!-- :picker-options="pickerOptions" -->
        </el-date-picker>

        <el-button class="cl-btn" @click="computeCl">
          <img src="~@/assets/intelligent/cl.png" alt="" />
          潮流计算</el-button>
      </div>
    </div>
    <!-- <div class="TabBarList">
      <div class="createBtn" :class="showcl && 'active'" @click="gotocljs">
        <img v-if="showcl" src="~@/assets/intelligent/cljs.png" alt="" />
        <img v-else src="~@/assets/intelligent/cljsdefault.png" alt="" />
        <span>潮流计算</span>
      </div>
      <div class="switchList">
        <div class="dwd">
          <el-switch
            v-model="greenSwitch"
            active-color="aqua"
            :inactive-text="greenSwitch ? `潮流效果` : '潮流效果'"
            @change="changegreenSwitch"
          >
          </el-switch>
        </div>
        <div class="ld">
          <el-switch
            v-model="ldSwitch"
            active-color="#88ff14"
            :inactive-text="ldSwitch ? `绿电效果` : '绿电效果'"
            @change="changeldSwitch"
          >
          </el-switch>
        </div>
        <div class="ycz">
          <el-switch
            v-model="ycSwitch"
            active-color="aqua"
            :inactive-text="ycSwitch ? `潮流数值` : '潮流数值'"
            @change="changeycSwitch"
          >
          </el-switch>
        </div>
      </div>
      <img
        class="F5"
        @click="ResetData"
        src="~@/assets/intelligent/F5.png"
        alt=""
      />
    </div> -->
    <div class="changeTabBar" :class="{ shrink: !shrink }">
      <el-form ref="form" inline>
        <div class="leftFormItem">
          <el-form-item label="实时潮流">
            <!-- <el-select :value="`新昌/回山集群`" size="mini" placeholder="placeholder">
              <el-option label="新昌/回山集群" value="新昌/回山集群"></el-option>
            </el-select> -->
          </el-form-item>
        </div>

        <div class="rightFormItem">
          <el-form-item label="">
            <el-button-group class="buttonList">
              <el-button type="primary" :class="{ active: !ldSwitch }" size="mini"
                @click="changeldSwitch(false)">潮流视图</el-button>
              <el-button type="primary" :class="{ active: ldSwitch }" size="mini"
                @click="changeldSwitch(true)">绿电视图</el-button>
              <el-button type="primary" :disabled="addNodedisbale" @click="addNode" size="mini">事件视图</el-button>
              <!-- disabled -->
              <!-- @click="addNode" -->
              <!-- disabled -->
              <!-- @click="$message.info('此功能正在开发中~')" -->
            </el-button-group>
            <div class="fnBtn">
              <el-button type="primary" size="mini" @click="exportImg"><i class="el-icon-camera-solid"></i></el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div id="myPaletteDiv" v-if="!editTag"></div>
    <div id="myDiagramDiv" ref="myDiagram"></div>
    <div id="toolTipKg" v-loading="loading">
      <div id="toolTipParagraph">
        <div class="left Myrect"></div>
        <div class="right Myrect"></div>
        <div class="bottomright Myrect"></div>
        <div class="bottomleft Myrect"></div>
        <div class="tipItem">
          <span>所属变电站：</span>{{ toolTipKgInfo.substationName }}
        </div>
        <div class="tipItem">
          <span>设备名称：</span>{{ toolTipKgInfo.deviceName }}
        </div>
        <div class="tipItem">
          <span>设备标识：</span>{{ toolTipKgInfo.deviceMark }}
        </div>
        <div class="tipItem">
          <span>开关状态：</span>{{ toolTipKgInfo.state ? "合" : "分" }}
          <span class="addRed" v-if="toolTipKgInfo.afterCalculationState !== null && !loading">/
            {{ toolTipKgInfo.afterCalculationState ? "合" : "分" }}
            (潮流计算)</span>
        </div>
        <div class="tipItem">
          <span>采样时间：</span>{{ toolTipKgInfo.occurTime }}
        </div>
      </div>
    </div>
    <div id="toolTipLine" v-loading="loading">
      <div id="toolTipParagraph">
        <div class="left Myrect"></div>
        <div class="right Myrect"></div>
        <div class="bottomright Myrect"></div>
        <div class="bottomleft Myrect"></div>
        <div class="tipTemp" v-for="(item, idx) in toolTipLineInfo || []" :key="idx">
          <div class="tipItem">
            <span>所属变电站：</span>{{ item.substationName }}
          </div>
          <div class="tipItem">
            <span>设备名称：</span>{{ item.deviceName }}
          </div>
          <div class="tipItem">
            <span>设备标识：</span>{{ item.deviceMark }}
          </div>
          <div class="tipItem">
            <span>有功：</span>{{ item.p }}
            <span class="addRed" v-if="item.afterCalculateP !== null">/ {{ item.afterCalculateP }} (潮流计算)</span>
          </div>
          <div class="tipItem"><span>无功：</span>{{ item.q }}</div>
          <div class="tipItem"><span>电流：</span>{{ item.i }}</div>
          <div class="tipItem" v-if="idx == 0">
            <span>采样时间：</span>{{ item.occurTime }}
          </div>
          <br />
        </div>
      </div>
    </div>
    <div id="toolTipMx" v-loading="loading">
      <div id="toolTipParagraph">
        <div class="left Myrect"></div>
        <div class="right Myrect"></div>
        <div class="bottomright Myrect"></div>
        <div class="bottomleft Myrect"></div>
        <div class="tipItem">
          <span>所属变电站：</span>{{ toolTipMxInfo.substationName }}
        </div>
        <div class="tipItem">
          <span>设备名称：</span>{{ toolTipMxInfo.deviceName }}
        </div>
        <div class="tipItem">
          <span>设备标识：</span>{{ toolTipMxInfo.deviceMark }}
        </div>
        <div class="tipItem"><span>电压：</span>{{ toolTipMxInfo.v }}</div>
        <div class="tipItem"><span>A相电压：</span>{{ toolTipMxInfo.va }}</div>
        <div class="tipItem"><span>B相电压：</span>{{ toolTipMxInfo.vb }}</div>
        <div class="tipItem"><span>C相电压：</span>{{ toolTipMxInfo.vc }}</div>
        <div class="tipItem"><span>相角量测：</span>{{ toolTipMxInfo.a }}</div>
        <div class="tipItem">
          <span>采样时间：</span>{{ toolTipMxInfo.occurTime }}
        </div>
      </div>
    </div>
    <div id="toolTipZb" v-loading="loading">
      <div id="toolTipParagraph">
        <div class="left Myrect"></div>
        <div class="right Myrect"></div>
        <div class="bottomright Myrect"></div>
        <div class="bottomleft Myrect"></div>
        <div class="tipTemp" v-for="(item, idx) in toolTipZbInfo.emsTransformerwindingDataVOList ||
          []" :key="idx">
          <div class="tipItem">
            <span>所属变电站：</span>{{ item.substationName }}
          </div>
          <div class="tipItem">
            <span>设备名称：</span>{{ item.deviceName }}
          </div>
          <div class="tipItem">
            <span>设备标识：</span>{{ item.deviceMark }}
          </div>
          <div class="tipItem">
            <span>有功：</span>{{ item.p }}
            <span class="addRed" v-if="item.afterCalculateP !== null">/ {{ item.afterCalculateP }} (潮流计算)</span>
          </div>
          <div class="tipItem"><span>无功：</span>{{ item.q }}</div>
          <div class="tipItem"><span>电流：</span>{{ item.i }}</div>
          <div class="tipItem"><span>档位：</span>{{ item.dw }}</div>
          <div class="tipItem" v-if="idx == 0">
            <span>采样时间：</span>{{ item.occurTime }}
          </div>
          <br />
        </div>
      </div>
    </div>
    <div id="toolTipXsdz" v-loading="loading">

      <div id="toolTipParagraph">
        <div class="left Myrect"></div>
        <div class="right Myrect"></div>
        <div class="bottomright Myrect"></div>
        <div class="bottomleft Myrect"></div>
        <div class="tipTemp" v-for="(item, idx) in toolTipXsdzInfo.emsbreakerVOList ||
          []" :key="idx">
          <div class="tipItem">
            <span>所属变电站：</span>{{ item.substationName }}
          </div>
          <div class="tipItem">
            <span>设备名称：</span>{{ item.deviceName }}
          </div>
          <div class="tipItem">
            <span>设备标识：</span>{{ item.deviceMark }}
          </div>
          <div class="tipItem">
            <span>有功：</span>{{ item.p }}
            <!-- <span class="addRed" v-if="item.afterCalculateP !== null"
              >/ {{ item.afterCalculateP }} (潮流计算)</span
            > -->
          </div>
          <div class="tipItem"><span>无功：</span>{{ item.q }}</div>
          <div class="tipItem"><span>电流：</span>{{ item.i }}</div>
          <!-- <div class="tipItem"><span>档位：</span>{{ item.dw }}</div> -->
          <div class="tipItem">
            <span>采样时间：</span>{{ item.occurTime }}
          </div>
          <br />
        </div>
      </div>
    </div>
    <!-- 配网 -->
    <div id="toolTipKgPw" v-loading="loading">
      <div id="toolTipParagraph">
        <div class="tipItem">
          <span>所属馈线：</span>{{ toolTipKgPwInfo.feederName }}
        </div>
        <div class="tipItem">
          <span>设备名称：</span>{{ toolTipKgPwInfo.deviceName }}
        </div>
        <div class="tipItem">
          <span>设备标识：</span>{{ toolTipKgPwInfo.deviceMark }}
        </div>
        <div class="tipItem">
          <span>开关状态：</span>{{
            toolTipKgPwInfo.state === null
            ? ""
            : toolTipKgPwInfo.state
              ? "合"
              : "分"
          }}
          <span class="addRed" v-if="toolTipKgPwInfo.afterCalculationState !== null">/
            {{ toolTipKgPwInfo.afterCalculationState ? "合" : "分" }}
            (潮流计算)</span>
        </div>
        <div class="tipItem">
          <span>有功值：</span>{{ toolTipKgPwInfo.p === null ? "" : toolTipKgPwInfo.p }}
          <span class="addRed" v-if="toolTipKgPwInfo.afterCalculationP !== null">/
            {{ toolTipKgPwInfo.afterCalculationP }}
            (潮流计算)</span>
        </div>
        <div class="tipItem">
          <span>采样时间：</span>{{ toolTipKgPwInfo.occurTime }}
        </div>
      </div>
    </div>
    <div id="toolTipGtPw" v-loading="loading">
      <div id="toolTipParagraph">
        <div class="tipItem">
          <span>所属馈线：</span>{{ toolTipGtPwInfo.feederName }}
        </div>
        <div class="tipItem">
          <span>杆塔名称：</span>{{ toolTipGtPwInfo.deviceName }}
        </div>
        <div class="tipItem">
          <span>杆塔标识：</span>{{ toolTipGtPwInfo.deviceMark }}
        </div>
      </div>
    </div>

    <!-- 提示弹窗 -->
    <div class="messageBox" v-if="messageDialog" @click.self="messageClose">
      <div class="ract">
        <div class="title">
          <i class="el-notification__icon el-icon-info"></i>
          <span> {{ messageTilte }}</span>
          <i class="el-icon-close" @click="messageClose"></i>
        </div>
        <div class="messageBoxcontent">
          <div>是否收敛：{{ isConvergence ? "是" : "否" }}</div>
          <div>收敛精度：&lt;10^-6</div>
        </div>
        <!-- <div class="messageBox-footer">
          <el-button @click="yzhandleClose">关 闭</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import go from "@/utils/lib/gojs/release/go-module";

var $ = go.GraphObject.make;

import mixin from "./mixin";
import { cloneDeep } from "lodash";
// 图片
import quan3 from "@/assets/goIcon2/quan3.png";
import yellowWarn from "@/assets/goIcon3/yellowWarn.png";
import { parseTime } from "@/utils/index";
// 数据
// import json from "./json";
let json = {};
import imageList from "./imageList";
import {
  getTrendList,
  getYgWg,
  getEMSBreakerState,
  getTopologyData,
  getPWEMSBreakerState,
  getDmTimeList,
  getTrendVerifyList,
  getCalculateTrend,
  getDmTime,
} from "@/api/Intelligent/goCanvas";

export default {
  name: "mygo",
  props: {
    editTag: {
      type: Boolean,
      default: true,
    },
    shrink: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // 开关info
      toolTipKgInfo: {},
      // 小水电组
      toolTipXsdzInfo: {
        emsbreakerVOList: [],
        name: ''
      },
      // 线路info
      toolTipLineInfo: [],
      // 母线info
      toolTipMxInfo: {},
      // 主变info
      toolTipZbInfo: {
        emsTransformerwindingDataVOList: [],
      },
      loading2: false,
      loading: false,
      yclTextList: [],
      setYgWgInt: null,
      showcl: false,
      // 闪烁开关
      flickerList: [],
      // 断面下拉
      TimeSelectList: [],
      dmTime: "",
      pageNum: 1,
      toolTipKgPwInfo: {},
      toolTipGtPwInfo: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "实时态",
            onClick: this.realTime,
          },
        ],
      },
      fillPath: "",
      m: "",
      s: "",
      calcId: "",
      // 潮流效果
      greenSwitch: true,
      // 遥测值
      ycSwitch: false,
      realTimeTrendData: [],
      // 绿电
      ldSwitch: false,
      trendList: [],
      messageDialog: false,
      messageTilte: "潮流计算消息",
      isConvergence: "",
      currentOptimalLoading: false,
      resZW: [],
      resPW: [],
      addNodedisbale:false
    };
  },

  created() {
    // 正向箭头
    // this.definePathPattern("zx", "M1 1 L8 4 M1 7 L8 4", "red", 1);
    // this.definePathPattern("zx", "M1 -6 L11 4 M1 13 L11 4", "#00F9FF", 2.3);
    this.definePathPattern("zx", "M4 -3 L20 4 M4 10 L20 4", "#4dfff3", 2.3);
    // 反向箭头
    // this.definePathPattern("fx", "M8 1 L1 4 M8 7 L1 4", "red", 1);
    // this.definePathPattern("fx", "M8 -6 -2 4 M8 13 -2 4", "#4dfff3", 2.3);
    this.definePathPattern("fx", "M4 -3 -11 4 M4 10 -11 4", "#4dfff3", 2.3);
  },
  async mounted() {
    // 不同路由进行判断
    let arr = ["init", "clyz"];
    this.showcl = arr.every((item) => !this.$route.fullPath.includes(item));
    // 生成gojs图
    await this.getJSON();
    if (this.$route.fullPath.includes("init")) {
      // this.loading2 = true;
      this.currentOptimalLoading = true;
      await this.getTrendList();
      // // 开关状态
      await this.getZWPWEMSBreakerState();
    }
    if (!this.showcl) {
      // 线路潮流
      // await this.getTrendList();
      // // 开关状态
      // await this.getZWPWEMSBreakerState();
    }

    //开关 闪烁动画
    this.flickerAnimation();
    // 右上角固定数据
    this.setYgWg();
    // this.setYgWgInt = setInterval((item) => {
    //   this.setYgWg();
    // }, sysConfig.regionStatusTime);

    this.AnimationYes();
    // 刷新拓扑图潮流绿电以及潮流数值
    // this.kgclTimer = setInterval(async () => {
    //   this.setYgWg();
    //   await this.getTrendList();
    //   await this.getZWPWEMSBreakerState();

    //   // this.changeycSwitch(this.ycSwitch);
    //   // this.changeldSwitch(this.ldSwitch);
    // }, sysConfig.trendStatusTime);
  },
  async activated() {
    if (this.showcl) {
      this.calcId = "";
      // 不同的url生成实时态按钮
      let fillPathArr = this.$route.fullPath.split("/");
      this.fillPath = "a" + fillPathArr[fillPathArr.length - 1];
      this.$nextTick(() => {
        if (document.querySelector(`.el-picker-panel.${this.fillPath}`)) {
          // 生成实时态按钮方法
          this.addButtonClick();
        }
      });
      // 判断当前页面是否需要刷新状态
      if (sessionStorage.getItem("route")) {
        let route = JSON.parse(sessionStorage.getItem("route"));

        if (this.$route.fullPath === route.url) {
          this.dmTime = "";
          this.loading2 = false;
          this.clearKGFlicke();
          this.clearLineShapeColor();
          this.$nextTick(async () => {
            // await this.getZWPWEMSBreakerState();
          });
        }
      }
    }
    // 判断当前页面是否需要刷新状态
    if (this.$route.fullPath.includes("clyz")) {
      if (sessionStorage.getItem("route")) {
        let route = JSON.parse(sessionStorage.getItem("route"));
        if (this.$route.fullPath === route.url) {
          this.loading2 = false;
          console.log("2");
          this.$nextTick(async () => {
            await this.getTrendVerifyList();
          });
        }
      }
    }

    if (this.$route.fullPath.includes("init")) {
      // 刷新拓扑图潮流绿电以及潮流数值
      this.kgclTimer = setInterval(async () => {
        this.setYgWg();
        await this.getTrendList();
        await this.getZWPWEMSBreakerState();

        // this.changeycSwitch(this.ycSwitch);
        // this.changeldSwitch(this.ldSwitch);
      }, sysConfig.trendStatusTime);
    }
  },
  deactivated() {
    // 清除轮训
    if (this.kgclTimer) {
      clearInterval(this.kgclTimer);
      this.kgclTimer = null;
    }
  },
  beforeDestroy() {
    if (this.kgclTimer) {
      clearInterval(this.kgclTimer);
      this.kgclTimer = null;
    }
    clearInterval(this.setYgWgInt);
    this.setYgWgInt = null;
  },
  mixins: [mixin],
  watch: {
    editTag: {
      immediate: true,
      handler(newVal) { },
    },
    // 加载时 倒计时
    loading2: {
      handler(newVal) {
        if (newVal) {
          let m = "";
          let s = "";
          if (this.showcl) {
            m = this.$tl.minSecond(sysConfig.flowTime).m;
            s = this.$tl.minSecond(sysConfig.flowTime).s;
          } else if (this.$route.fullPath.includes("init")) {
            // m = this.$tl.minSecond(sysConfig.cswwTime).m;
            // s = this.$tl.minSecond(sysConfig.cswwTime).s;
          } else {
            m = this.$tl.minSecond(sysConfig.strategyTime).m;
            s = this.$tl.minSecond(sysConfig.strategyTime).s;
          }

          if (m > 0) {
            this.m = `${m}分`;
          } else {
            this.m = ``;
          }
          this.s = s;
          if (this.loadingTimer) {
            clearInterval(this.loadingTimer);
            this.loadingTimer = null;
          }
          this.loadingTimer = setInterval(() => {
            if (this.s <= 0) {
              if (parseFloat(this.m) > 0) {
                this.m = parseFloat(this.m) - 1 + "分";
                this.s = 60;
              } else {
                this.s = 0;
                this.m = 0 + "分";
                clearInterval(this.loadingTimer);
                this.loadingTimer = null;
              }
            } else {
              this.s -= 1;
            }
          }, 1000);
        } else {
          if (this.loadingTimer) {
            clearInterval(this.loadingTimer);
            this.loadingTimer = null;
          }
          this.m = "";
          this.s = "";
        }
      },
    },
  },
  methods: {
    addNode() {
      this.addNodedisbale = true
      let model = this.myDiagram.model;
      let nextKey = model.nodeDataArray.length + 1; // 生成新节点的键值
      let node = this.myDiagram
        .findNodesByExample({
          id: "117093590311633405",
        })
        .first()?.data;
      let [x, y] = node.loc.split(" ");
      x = (Number(x) + 80).toFixed(2);
      y = Number(y).toFixed(2);
      // 添加新节点到数据模型，并设置位置信息
      model.addNodeData({
        key: nextKey,
        name: "Node " + nextKey,
        // type: "220kV-quan3",
        category: "warningType",
        loc: `${x} ${y}`,
      });
      // model.removeNodeData( model.nodeDataArray[model.nodeDataArray.length - 1])
      // // 更新布局
      this.myDiagram.layoutDiagram(true);
      this.flickerList.push('117093590311633405')
      let linkdata = this.myDiagram
        .findLinksByExample({
          from
            : -145,
          to:
            -159
        }).first()?.data
      this.myDiagram.model.setDataProperty(linkdata, "isShowJg", true);
      this.myDiagram.model.setDataProperty(linkdata, "ShapeColor",null);
      this.myDiagram.model.setDataProperty(linkdata, "stroke",'red');

    },
    exportImg() {
      var image = this.myDiagram.makeImageData({
        background: "#080E12",
        returnType: "DataURL",
        scale: 0.35,
        // position: new go.Point(0, 0)
      });
      let myblob = this.b64toBlob(image);
      const imageUrl = URL.createObjectURL(myblob);

      var link = document.createElement("a"); // 创建新的链接元素
      link.download = "拓扑图.png"; // 指定下载文件的名称

      link.href = imageUrl; // 将URL设置为链接的href属性
      document.body.appendChild(link); // 将链接添加到文档中
      link.click(); // 触发点击事件以开始下载流程
      document.body.removeChild(link); // 然后删除链接元素
    },
    // 绿电效果开关
    changeldSwitch(visible) {
      this.ldSwitch = visible;
      this.clearLineShapeColor();
      // // 全部加载
      this.showLineShapeColor(JSON.parse(JSON.stringify(this.trendList)));

      this.myDiagram.nodes.each((node) => {
        let data = node.data;
        this.myDiagram.model.setDataProperty(
          data,
          "opacity",
          !visible ? 1 : 0.3
        );
      });
      this.myDiagram.links.each((link) => {
        let data = link.data;
        if (!data.electricCurrentType) {
          this.myDiagram.model.setDataProperty(
            data,
            "opacity",
            !visible ? 1 : 0.3
          );
        }
        if (data && data.electricCurrentType) {
          if (
            this.myDiagram.findNodeForKey(data.from) &&
            this.myDiagram.findNodeForKey(data.from).data
          ) {
            let node = this.myDiagram.findNodeForKey(data.from).data;
            this.myDiagram.model.setDataProperty(node, "opacity", 1);
          }
          if (
            this.myDiagram.findNodeForKey(data.to) &&
            this.myDiagram.findNodeForKey(data.to).data
          ) {
            let node = this.myDiagram.findNodeForKey(data.to).data;
            this.myDiagram.model.setDataProperty(node, "opacity", 1);
          }
          // this.myDiagram.findNodeForKey(data.from);
          // this.myDiagram.findNodeForKey(data.to);
        }
      });
      // this.clearLineShapeColor();
      // this.showLineShapeColor(JSON.parse(JSON.stringify(this.trendList)));
      // if (!this.greenSwitch && !visible) {
      //   return this.clearLineShapeColor();
      // }
      // // 高亮
      // if (visible) {
      //   this.clearLineShapeColor();
      //   // 赋值
      //   this.showLineShapeColor(JSON.parse(JSON.stringify(this.trendList)));
      //   this.myDiagram.links.each((link) => {
      //     let data = link.data;
      //     // 变色有值的
      //     if (visible && data.electricCurrentType) {
      //       this.myDiagram.model.setDataProperty(data, "strokeWidth", 10);
      //       this.myDiagram.model.setDataProperty(data, "ShapeColor", "#88ff14");
      //     } else if (!visible && data.electricCurrentType) {
      //       // 还原有值的
      //       this.myDiagram.model.setDataProperty(data, "strokeWidth", 8);
      //       this.myDiagram.model.setDataProperty(
      //         data,
      //         "ShapeColor",
      //         data.stroke
      //       );
      //     } else if (!this.greenSwitch && !data.electricCurrentType) {
      //       this.myDiagram.model.setDataProperty(data, "strokeWidth", 8);
      //       this.myDiagram.model.setDataProperty(data, "ShapeColor", null);
      //     }
      //   });
      // }

      this.AnimationYes();
    },
    // 重置所有状态
    async ResetData() {
      this.clearLineShapeColor();
      this.greenSwitch = true;
      this.ldSwitch = false;
      this.ycSwitch = false;
      this.changeycSwitch(this.ycSwitch);

      if (this.showcl) {
        this.dmTime = "";
        this.loading2 = false;
        this.clearKGFlicke();
        this.$nextTick(async () => {
          await this.getZWPWEMSBreakerState();
        });
      }

      if (this.$route.fullPath.includes("clyz")) {
        this.loading2 = false;
        this.$nextTick(async () => {
          await this.getTrendVerifyList();
        });
      }

      if (this.$route.fullPath.includes("init")) {
        // this.loading2 = true;
        await this.getTrendList();
        await this.getZWPWEMSBreakerState();
      }
      this.loading2 = false;
      this.$message({
        type: "success",
        message: "刷新成功",
      });
    },
    // 实时策略下弹窗信息
    messageClose() {
      this.messageDialog = false;
    },
    // 跳转潮流计算页面
    gotocljs() {
      this.$bus.$emit("addRouter", {
        title: "潮流计算",
        url: "/intelligent/goCanvas/a1",
      });
    },
    // 开启关闭潮流
    changegreenSwitch(visible) {
      this.clearLineShapeColor();
      // // 全部加载
      this.showLineShapeColor(JSON.parse(JSON.stringify(this.trendList)));
      if (visible) {
        //  清除之前所有线路
        // this.clearLineShapeColor();
        // // 全部加载
        // this.showLineShapeColor(JSON.parse(JSON.stringify(this.trendList)));
      } else {
        // this.myDiagram?.links.each((link) => {
        //   if (link.part && link.part.data && link.part.data.ShapeColor) {
        //     // 清除本身不清除绿电
        //     if (!link.part.data.electricCurrentType) {
        //       this.myDiagram.model.setDataProperty(link.data, "strokeWidth", 8);
        //       this.myDiagram.model.setDataProperty(
        //         link.data,
        //         "ShapeColor",
        //         null
        //       );
        //     } else if (!this.ldSwitch && link.part.data.electricCurrentType) {
        //       // 如果绿电是关闭的也清除掉
        //       this.myDiagram.model.setDataProperty(link.data, "strokeWidth", 8);
        //       this.myDiagram.model.setDataProperty(
        //         link.data,
        //         "ShapeColor",
        //         null
        //       );
        //     }
        //   }
        // });
      }
      // if (this.ldSwitch) {
      //   this.changeldSwitch(this.ldSwitch);
      // }
    },
    // 开启关闭潮流数值
    changeycSwitch(visible) {
      this.showPQIDataJSON(this.realTimeTrendData);
      this.myDiagram.nodes.each((item) => {
        let data = item.data;

        if (data.id) {
          if (data.category && data.category.includes("PQI")) {
            if (this.realTimeTrendData.length) {
              this.myDiagram.model.setDataProperty(
                data,
                "visible",
                visible ? "1" : visible
              );
            } else {
              this.myDiagram.model.setDataProperty(data, "visible", false);
            }
          }
        }
      });
    },
    // 添加实时态按钮方法
    addButtonClick() {
      this.$nextTick(() => {
        let mybutton = document.querySelector(
          `.${this.fillPath} .el-picker-panel__footer .mybutton`
        );
        if (this.showcl) {
          if (!mybutton) {
            let footerBody = document.querySelector(
              `.${this.fillPath} .el-picker-panel__footer`
            );

            let cikeButton = document.querySelector(
              `.${this.fillPath} .el-button.el-picker-panel__link-btn.el-button--text.el-button--mini`
            );
            var newButton = document.createElement("button");

            newButton.setAttribute(
              "class",
              "el-button el-picker-panel__link-btn el-button--text el-button--mini mybutton"
            );
            newButton.setAttribute("type", "button");
            var newTxt = document.createTextNode("实时态");
            newButton.appendChild(newTxt);

            // footerBody.appendChild(newButton);
            footerBody.insertBefore(newButton, cikeButton);
            newButton.onclick = () => {
              this.realTime();
            };
          }

          // appendChild
          // console.log("footerBody", footerBody);
          // el-picker-panel__footer
        }
      });
      // }
    },
    // 实时态时间
    realTime() {
      getDmTime().then((res) => {
        this.dmTime = new Date(res.data.occurTime);
        // this.$refs[this.fillPath].picker.$emit("pick", new Date(res.data.occurTime))
      });
    },
    // 时间改变
    changedmTime(time) {
      if (time) {
        let sectionTime = this.dmTime
          ? parseTime(this.dmTime, "{y}-{m}-{d} {h}:{i}:") + "00"
          : "";
        // 清除calcId
        this.calcId = "";
        // 清除开关闪烁
        this.clearKGFlicke();
        // 主配网开关状态查询
        this.getZWPWEMSBreakerState(sectionTime);
      }
    },
    // 潮流计算功能
    computeCl() {
      this.loading2 = true;
      let breakerStatus = [];
      cloneDeep(this.myDiagram.model.Fc).map((item) => {
        if (item.id) {
          if (item.type && item.type.includes("dz")) {
            breakerStatus.push({
              breakerId: item.id,
              status: item.fill ? "1" : "0",
            });
          }
        }
      });
      let measureTime = this.dmTime
        ? parseTime(this.dmTime, "{y}-{m}-{d} {h}:{i}:") + "00"
        : "";
      let obj = {
        breakerStatus,
        measureTime,
        topologyId: "1598937214428459009",
      };
      this.clearLineShapeColor();
      getCalculateTrend(obj).then((res) => {
        const { data, msg, code } = res;
        this.loading2 = false;

        if (code != "00000") {
          this.$message({
            type: "info",
            message: msg,
          });

          this.showPQIDataJSON([]);
        } else {
          this.greenSwitch = true;
          // console.log(data.trend)
          // console.log(this.trendList)
          // if(this.trendList.emsAcLineVOS&&this.trendList.emsAcLineVOS.length&&this.trendList.emsAcLineVOS[0]['electricCurrentType']){
          //    data.trend.emsAcLineVOS[0]['electricCurrentType'] = 0
          // }else{
          //   data.trend.emsAcLineVOS[0]['electricCurrentType'] = 1
          // }
          this.trendList = data.trend || {};
          this.calcId = data.calcId || "";
          this.realTimeTrendData = data.trendCalculateData || [];
          this.isConvergence = data.isConvergence;
          this.messageDialog = true;
          this.messageTilte = "潮流计算消息";

          //  根据潮流值状态判断是否显示
          if (this.ycSwitch) {
            this.showPQIDataJSON(this.realTimeTrendData);
          }
          //  根据是否显示潮流判断是否显示
          if (this.greenSwitch) {
            this.showLineShapeColor(this.trendList);
          }
        }

        this.clearKGFlicke();
      });
    },
    // 之前所写滚动下拉
    // getloadMoreList() {
    //   this.pageNum += 1;
    //   this.getDmTimeList();
    // },
    // getDmTimeList() {
    //   getDmTimeList(this.pageNum).then((res) => {
    //     this.TimeSelectList = [...this.TimeSelectList, ...res.data];
    //   });
    // },

    // 主配网开关状态
    getZWPWEMSBreakerState(sectionTime) {
      console.log('getEMSBreakerState', getEMSBreakerState())
      // 开关状态
      const resZW = getEMSBreakerState(
        sectionTime ? sectionTime : this.dmTime
      );
      // 配网开关状态
      const resPW = getPWEMSBreakerState(
        sectionTime ? sectionTime : this.dmTime
      );
      // if (resZW.code != "00000" || resPW.code != "00000") {
      //   this.clearKGStatus();
      //   return this.$message({
      //     type: "info",
      //     message: resZW.msg,
      //   });
      // }
      if (this.kgTimer) {
        clearInterval(this.kgTimer);
        this.kgTimer = null;
      }

      if (
        this.$tl.compare(JSON.parse(JSON.stringify(this.resZW)), resZW) &&
        this.$tl.compare(JSON.parse(JSON.stringify(this.resPW)), resPW)
      )
        return;

      this.resZW = resZW;
      this.resPW = resPW;

      this.kgTimer = setInterval(() => {
        if (this.myDiagram) {
          this.myDiagram.nodes.each((item) => {
            let data = item.data;
            if (data.id) {
              // if (data.type && data.type.includes("dz")) {
              //   this.myDiagram.model.setDataProperty(data, "fill", null);
              //   //  fill
              // } else
              if (data.type && data.type.indexOf("dzVertical1") > -1) {
                // 矩形开关
                this.myDiagram.model.setDataProperty(
                  data,
                  "type",
                  data.type.slice(0, data.type.length - 1)
                );
              } else if (data.type && data.type.indexOf("dzTransverse1") > -1) {
                // 矩形开关
                this.myDiagram.model.setDataProperty(
                  data,
                  "type",
                  data.type.slice(0, data.type.length - 1)
                );
              } else if (data.type && data.type.indexOf("kgVertical1") > -1) {
                // 闸刀开关
                this.myDiagram.model.setDataProperty(
                  data,
                  "type",
                  data.type.slice(0, data.type.length - 1)
                );
              } else if (data.type && data.type.indexOf("kgTransverse1") > -1) {
                // 闸刀开关
                this.myDiagram.model.setDataProperty(
                  data,
                  "type",
                  data.type.slice(0, data.type.length - 1)
                );
              }
            }
          });
          clearInterval(this.kgTimer);
          this.kgTimer = null;
          this.showKgStatus([...resZW, ...resPW]);
          // this.showKgStatus(resPW.data);
        }
      }, 200);
    },
    // 实时策略潮流 和开关状态
    async getTrendVerifyList() {
      this.loading2 = true;
      this.clearLineShapeColor();
      this.clearKGStatus();
      const res = await getTrendVerifyList();

      this.loading2 = false;
      if (res.code != "00000") {
        this.showPQIDataJSON([]);
        return this.$message({
          type: "warning",
          message: res.msg,
        });
      }
      this.calcId = res.data.calcId;
      let breakerState = res.data.breakerState;
      let trendList = res.data.topoTrend;
      this.trendList = trendList;
      this.realTimeTrendData = res.data.trendCalculateData || [];
      this.isConvergence = res.data.isConvergence;
      this.messageTilte = "实时策略验证消息";
      this.messageDialog = true;

      //  根据潮流值状态判断是否显示
      if (this.ycSwitch) {
        this.showPQIDataJSON(this.realTimeTrendData);
      }
      this.showKgStatus(breakerState);
      if (this.greenSwitch) {
        this.showLineShapeColor(this.trendList);
      }
    },
    // 线路潮流
    async getTrendList() {
      const res = await getTrendList();
      // console.log(res)
      this.currentOptimalLoading = false;
      if (
        this.$tl.compare(
          JSON.parse(JSON.stringify(this.trendList)),
          (res.data || {}).trendData
        )
      )
        return;

      this.clearLineShapeColor();
      this.trendList = (res.data || {}).trendData || {};
      if (this.greenSwitch) {
        this.showLineShapeColor(this.trendList);
      }
      this.realTimeTrendData = res.data.realTimeTrendData;

      //  根据潮流值状态判断是否显示
      if (this.ycSwitch) {
        this.showPQIDataJSON(this.realTimeTrendData);
      }
      // 开启潮流动画
    },
    // 获取拓扑图数据
    async getJSON() {
      this.clearIntervalYgWg();
      const res = await getTopologyData();
      let { topologyData } = res.data;
      json = topologyData;
      if (this.myDiagram) {
        this.myDiagram.div = null;
        this.myDiagram = null;
      }
      if (this.myPalette) {
        this.myPalette.div = null;
        this.myPalette = null;
      }
      // false代表不去除
      this.displayPort(json, true);
      json.linkDataArray.forEach((link) => {
        delete link.ShapeColor;
        link.isShowJg = false
      });
      json.nodeDataArray.forEach((node) => {
        if (node.type && node.type.includes("dz")) {
          node.fill = null;
        }
        if (node.textType == "遥测量") {
          this.yclTextList.push(node);
        }
        if (node.category === 'textarea') {
          node.text = ''
        }
      });
   
      // 生成拓扑图
      this.initDiagram();
    },
    // 生成拓扑图
    initDiagram() {
      var _that = this;
      _that.myDiagram = $(
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
          isReadOnly: this.editTag, // 是否为只读状态
          minScale: 0.15, //  缩小临界值
          maxScale: 0.75, // 放大临街值
          scale: 0.19, // 初始视图大小比例
          // PartResized: (a, ) => {
          //   // console.log('aasd',a);
          //   console.log('a',a);
          // },
          LinkDrawn: this.maybeChangeLinkCategory, // these two DiagramEvents call a
          LinkRelinked: this.maybeChangeLinkCategory, // function that is defined below
          // ViewportBoundsChanged: this.onScroll,
          // 开关分合状态更改
          "contextMenuTool.showContextMenu": function (cm, obj) {
            var data = obj.part.data;
            while (cm.elements.count > 0) cm.removeAt(0);
            if (data.infoJson?.deviceType === "开关") {
              if (!data.fill && _that.showcl) {
                cm.add(
                  _that.makeButton("置位(合)", (e, obj) => {
                    _that.changeKGStatus(data);
                  })
                );
              } else if (data.fill && _that.showcl) {
                cm.add(
                  _that.makeButton("置位(分)", (e, obj) => {
                    _that.changeKGStatus(data);
                  })
                );
              }
            }
            go.ContextMenuTool.prototype.showContextMenu.call(this, cm, obj);
          },
          // InitialLayoutCompleted: function (diagram) {
          //   var canvas = diagram.findPartForKey("main").element;
          //   canvas.style.backgroundColor = "lightgray";
          // },
        }
      );

      // 让虚拟点变小
      this.myDiagram.addDiagramListener("externalobjectsdropped", (e) => {
        e.subject.each((item) => {
          if (item.data.name === "xnd") {
            this.myDiagram.model.setDataProperty(item.data, "size", 8);
          }
        });
      });
      let portSize = new go.Size(4, 6); // 上下
      let portSize2 = new go.Size(7, 4); //左右

      let portMenu = null;

      // 节点模板
      this.myDiagram.nodeTemplate = $(
        go.Node,
        "Table",
        {
          locationObjectName: "BODY",
          locationSpot: go.Spot.Center,
          selectionObjectName: "BODY",
          toolTip: this.createdNodeTooTip(),
          contextMenu: $("ContextMenu"),
          click: (e, obj) => {
            console.log("node", obj.part.data);
          },
          // doubleClick: (e, obj) => {
          //   this.changeKGStatus(obj.part.data);
          // },
          zOrder: 11,
          opacity: 1,
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        new go.Binding("opacity", "opacity").makeTwoWay(),
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
          // $(
          //   go.Shape,
          //   {
          //     // name: "kg",
          //     stroke: "#00ff00", //auto bind
          //     strokeWidth: 3, //auto bind
          //     // desiredSize: new go.Size(20, 40),
          //     background: null,
          //     fill: null, //auto bind
          //     // option: 1,
          //     opacity: 1,
          //   },
          //   new go.Binding("opacity", "opacity").makeTwoWay(),
          //   new go.Binding("stroke", "stroke", (k) => {
          //     return k;
          //   }).makeTwoWay(),
          //   new go.Binding("fill", "fill", (fill) => {
          //     return fill;
          //   }).makeTwoWay(),
          //   new go.Binding("strokeWidth", "type", (type) => {
          //     if (type.includes("dz")) {
          //       return 3;
          //     }
          //     return 0;
          //   }).makeTwoWay(),
          //   new go.Binding(
          //     "desiredSize",
          //     "type",
          //     this.createdNodeSize
          //   ).makeTwoWay()
          // ),
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
              // if (type.includes("dz")) {
              //   let [voltage, name] = type.split("-");
              //   return imageList[voltage][name];
              //   // return null;
              let [voltage, name] = type.split("-");
              return imageList[voltage][name];
            }),
            new go.Binding(
              "desiredSize",
              "type",
              this.createdNodeSize
            ).makeTwoWay()
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
              new go.Binding("fill", "portColor", this.createdPortColor)
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
                margin: new go.Margin(0, 0),
                fill: "#00ff00",
              },
              new go.Binding("fill", "portColor", this.createdPortColor)
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
              new go.Binding("fill", "portColor", this.createdPortColor)
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
                margin: new go.Margin(0, 0),
              },
              new go.Binding("fill", "portColor", this.createdPortColor)
            )
          ), // end itemTemplate
        })
      );
      // 实线
      this.myDiagram.linkTemplate = $(
        "Link",
        {
          // routing: go.Link.AvoidsNodes,
          routing: go.Link.Orthogonal,
          adjusting: go.Link.FROM,
          curve: go.Link.JumpGap,
          reshapable: true,
          resegmentable: true,
          relinkableFrom: true,
          relinkableTo: true,
          corner: 4,
          toShortLength: 1,
          zOrder: 11,
          cursor: "pointer",
          contextMenu: null,
          // 生成线路弹窗
          toolTip: this.createdNodeTooTip(),
          opacity: 1,
          click: (e, obj) => {
            // obj.findObject("LINE").stroke
            console.log("实线", obj.part.data);
          },
          toPortChanged: (link, oldport, newport) => {
            if (link.part && link.part.data && !link.part.data.stroke) {
              link.part.data.stroke = "#D4E7F1";
            }
          },
        },
        new go.Binding("points").makeTwoWay(),

        // 线条颜色
        $(
          "Shape",
          {
            name: "LINE",
            isPanelMain: true,
            stroke: "#D4E7F1",
            strokeWidth: 3,
            opacity: 1,
          },
          new go.Binding("stroke", "stroke", (stroke, link) => {
            return stroke;
          }).makeTwoWay(),
          new go.Binding("opacity", "opacity").makeTwoWay()
          //     new go.Binding("stroke", "isHighlighted",
          // 			   function(h, link) { return h ? 'red' : link.part.data.stroke; })
          // .ofObject(),
        ),

        $(
          go.TextBlock,
          "",
          {
            textAlign: "center",
            // font: '20pt helvetica, arial, sans-serif',
            font: "bold small-caps 15pt helvetica, Arial, sans-serif",
            // stroke: "rgba(255,255,255,0.9)",
            // width:75,
            // height:55,
            // stroke: "#0ed3ff",
            stroke: "#fff",
            // stroke: "#333",
            editable: true,
            // background: "rgba(255,255,255,0.3)",
          },
          new go.Binding("text", "port1").makeTwoWay()
        ),
        $(
          "Shape",
          {
            name: "jt",
            isPanelMain: true,
            stroke: null,
            opacity: 0,
            strokeWidth: 14,
            pathPattern: null,
          },
          new go.Binding("pathPattern", "pathPattern", (pathPattern, link) => {
            return _that.convertPathPatternToShape(pathPattern, link);
          }).makeTwoWay()
          // new go.Binding("strokeWidth", "strokeWidth", (pathPattern) => {
          //   return (_that.convertPathPatternToShape(pathPattern) && _that.ldSwitch) ? 20 : 0;
          // }).makeTwoWay(),
        ),
        $(
          "Shape",
          {
            isPanelMain: true,
            // stroke: "lightblue",
            // stroke: "#01C0CA",
            stroke: null,
            // stroke: "",
            strokeWidth: 8,
            name: "DongHua",
            opacity: 1,
            // 10 35
            // strokeDashArray: [40, 100],
            strokeDashArray: [20, 100],

            // strokeDashArray: [10, 35],
          },
          new go.Binding("stroke", "ShapeColor", (ShapeColor) => {
            return ShapeColor;
          }).makeTwoWay(),
          new go.Binding("strokeWidth", "strokeWidth", (strokeWidth) => {
            if (strokeWidth) {
              return strokeWidth;
            }
            return 8;
          }),
          new go.Binding("strokeDashArray", "strokeWidth", (strokeWidth) => {
            if (strokeWidth != 8) {
              // return [60, 100];
              return [40, 120];
            }
            return [20, 100];
          }),
          new go.Binding("opacity", "opacity").makeTwoWay()
        ),

        // 故障挂牌 无文字
        // $(
        //   go.Picture,
        //   {
        //     name: "Picture",
        //       isPanelMain: true,
        //     source: yellowWarn,
        //     imageStretch: go.GraphObject.Fill,
        //     desiredSize: new go.Size(30, 30),
        //     cursor: "pointer",
        //   },
        // )
        // 挂牌 有文字
        $(
          go.Panel,
          "Horizontal",
          // "RoundedRectangle",
          {
            background: "#080e12",
            isPanelMain: true,
            visible: false
          },
          new go.Binding("visible", "isShowJg", (isShowJg, link) => {

            return isShowJg
          }).makeTwoWay(),
          $(go.Picture, {
            name: "Picture",
            // source: yellowWarn,
            source: yellowWarn,
            imageStretch: go.GraphObject.Fill,
            desiredSize: new go.Size(40, 40),
            margin: new go.Margin(20, 0, 20, 30),
            cursor: "pointer",
          }),
          $(go.TextBlock, "", {
            textAlign: "center",
            // font: '20pt helvetica, arial, sans-serif',
            font: "bold small-caps 17pt helvetica, Arial, sans-serif",
            // stroke: "rgba(255,255,255,0.9)",
            // width:75,
            // height:55,
            // stroke: "#0ed3ff",
            stroke: "#f8a74a",
            // stroke: "#333",
            editable: true,
            text: "xxx线路故障",
            margin: new go.Margin(0, 30, 0, 10),

            // background: "rgba(255,255,255,0.3)",
          })
        )
      );
      // 横向母线
      this.myDiagram.nodeTemplateMap.add(
        "WBar",
        $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            toolTip: this.createdNodeTooTip(),
            contextMenu: null,
            click: (e, obj) => {
              console.log("横向母线", obj.part.data);
            },
            opacity: 1,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("opacity", "opacity").makeTwoWay(),
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
            go.Panel,
            "AUTO",
            {
              row: 1,
              column: 1,
              name: "BODY",
              stretch: go.GraphObject.Fill,
              // height: 5,
              // portId: "",
              // toLinkable: true,
            },
            new go.Binding("background", "fill", (fill) => {
              return fill;
            }).makeTwoWay(),
            $(
              go.Shape,
              "Rectangle",
              {
                row: 1,
                column: 1,
                name: "SHAPE",
                stroke: null,
                fill: "#0CE9ED",
                width: 100,
                height: 5,
                minSize: new go.Size(50, 5),
                maxSize: new go.Size(Infinity, 10),
                // margin: 2,
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
              new go.Binding("fill", "fill", (fill) => {
                return fill;
              }).makeTwoWay(),
              new go.Binding("height", "height").makeTwoWay()
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
                  // strokeWidth: 5,
                  desiredSize: portSize2,
                  margin: new go.Margin(0, 0),
                },
                new go.Binding("fill", "portColor", (portColor, e) => {
                  if (!portColor) {
                    return null;
                  }
                  if (e.part && e.part.data && e.part.data) {
                    return e.part.data.fill;
                  }
                  return portColor;
                }).makeTwoWay()
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
                new go.Binding("fill", "portColor", (portColor, e) => {
                  if (!portColor) {
                    return null;
                  }
                  if (e.part && e.part.data && e.part.data) {
                    return e.part.data.fill;
                  }
                  return portColor;
                }).makeTwoWay(),
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

                new go.Binding("fill", "portColor", (portColor, e) => {
                  if (!portColor) {
                    return null;
                  }
                  if (e.part && e.part.data && e.part.data) {
                    return e.part.data.fill;
                  }
                  return portColor;
                }).makeTwoWay()
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
                  new go.Binding("fill", "portColor", (portColor, e) => {
                    if (!portColor) {
                      return null;
                    }
                    if (e.part && e.part.data && e.part.data) {
                      return e.part.data.fill;
                    }
                    return portColor;
                  }).makeTwoWay(),
                  new go.Binding("margin", "margin", (margin) => {
                    return new go.Margin(0, margin[0], 0, margin[1]);
                  })
                )
              ), // end itemTemplate
            }
          )
        )
      );
      // 竖向母线
      this.myDiagram.nodeTemplateMap.add(
        "HBar",
        $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            contextMenu: null,
            toolTip: this.createdNodeTooTip(),
            click: (e, obj) => {
              console.log("竖向母线", obj.part.data);
            },
            opacity: 1,
            // portId: "",
            // toLinkable: true,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("opacity", "opacity").makeTwoWay(),
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
          // $(
          //   go.TextBlock,
          //   {
          //     textAlign: "center",
          //     // font: "16px Segoe UI,sans-serif",
          //     font: "16pt Helvetica, Arial, sans-serif",
          //     // stroke: "#333",
          //     stroke: "#fff",
          //     cursor: "pointer",
          //     editable: true,
          //     row: 2,
          //     column: 1,
          //     alignment: go.Spot.Center,

          //     background: this.editTag ? null : "rgba(0, 255, 255,.5)",
          //   },
          //   new go.Binding("text", "name").makeTwoWay(),
          //   new go.Binding("row", "textRow").makeTwoWay(),
          //   new go.Binding("column", "textColumn").makeTwoWay()
          // ),
          $(
            go.Panel,
            "AUTO",
            {
              row: 1,
              column: 1,
              name: "BODY",
              stretch: go.GraphObject.Fill,
            },

            $(
              go.Shape,
              "RoundedRectangle",
              {
                row: 1,
                column: 1,
                name: "SHAPE",
                stroke: null,
                // fill: "#0000ff",
                fill: "#0CE9ED",
                width: 5,
                height: 100,
                minSize: new go.Size(5, 50),
                maxSize: new go.Size(5, Infinity),
                // margin: 2,
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
              new go.Binding("fill", "fill").makeTwoWay(),
              new go.Binding("width", "width").makeTwoWay()
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
                  // strokeWidth: 5,
                  desiredSize: portSize2,
                  // margin: new go.Margin(0, -3),
                },
                new go.Binding("fill", "portColor", (portColor, e) => {
                  if (!portColor) {
                    return null;
                  }
                  if (e.part && e.part.data && e.part.data) {
                    return e.part.data.fill;
                  }
                  return portColor;
                }).makeTwoWay(),
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
                new go.Binding("fill", "portColor", (portColor, e) => {
                  if (!portColor) {
                    return null;
                  }
                  if (e.part && e.part.data && e.part.data) {
                    return e.part.data.fill;
                  }
                  return portColor;
                }).makeTwoWay()
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
                new go.Binding("fill", "portColor", (portColor, e) => {
                  if (!portColor) {
                    return null;
                  }
                  if (e.part && e.part.data && e.part.data) {
                    return e.part.data.fill;
                  }
                  return portColor;
                }).makeTwoWay(),
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
                  new go.Binding("fill", "portColor", (portColor, e) => {
                    if (!portColor) {
                      return null;
                    }
                    if (e.part && e.part.data && e.part.data) {
                      return e.part.data.fill;
                    }
                    return portColor;
                  }).makeTwoWay()
                )
              ), // end itemTemplate
            }
          )
        )
      );
      // 小圆点
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
            width: 5,
            height: 5,
            stroke: null,
            // fill: "red",
            fill: this.editTag ? null : "red", //去掉小圆点
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
          })
        )
      );
      // 虚拟点
      this.myDiagram.nodeTemplateMap.add(
        "xnd",
        $(
          go.Node,
          "Vertical",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            contextMenu: null,
            toolTip: this.createdNodeTooTip(),
            click: (e, obj) => {
              console.log("虚拟点", obj.part.data);
            },
            opacity: 1,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("opacity", "opacity").makeTwoWay(),
          $(
            go.Shape,
            "Ellipse",
            {
              row: 1,
              column: 1,
              stroke: null,
              fill: null,
              background: null,
              width: 8,
              height: 8,
              // margin: 2,
              portId: "",
              cursor: "pointer",
              fromLinkable: true,
              toLinkable: true,
              opacity: 1,
              figure: "Ellipse",
            },
            new go.Binding("fill", "fill", (fill) => {
              return fill;
            }).makeTwoWay(),
            new go.Binding("background", "fill", (fill) => {
              return null;
            }).makeTwoWay(),
            new go.Binding("width", "size").makeTwoWay(),
            new go.Binding("height", "size").makeTwoWay()
          )
        )
      );
      // 警告标识
      this.myDiagram.nodeTemplateMap.add(
        "warningType",
        $(
          go.Node,
          "Vertical",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            contextMenu: null,
            click: (e, obj) => {
              console.log("警告标识", obj.part.data);
            },
            opacity: 1,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("opacity", "opacity").makeTwoWay(),
          $(
            go.Picture,
            {
              name: "Picture",
              source: yellowWarn,
              imageStretch: go.GraphObject.Fill,
              desiredSize: new go.Size(60, 60),
              cursor: "pointer",
            },
            new go.Binding("source", "type", (type) => {
              return yellowWarn;
            })
          )
        )
      );
      // 文本框
      this.myDiagram.nodeTemplateMap.add(
        "textarea",
        $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            click: (e, obj) => {
              console.log("文本框", obj.part.data);
            },
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            resizable: true,
            resizeObjectName: "TextBlock",
          },
          $(
            go.Panel,
            "AUTO",
            {
              row: 1,
              column: 1,
              name: "BODY",
              stretch: go.GraphObject.Fill,
              background: null,
            },

            $(
              go.TextBlock,
              {
                row: 1,
                column: 1,
                name: "TextBlock",
                textAlign: "center",
                // font: "16px Segoe UI,sans-serif",
                font: "30pt Helvetica, Arial, sans-serif",
                // desiredSize:new go.Size(800, 40),
                // maxSize: new go.Size(Infinity, Infinity),
                stroke: "#fff",
                cursor: "pointer",
                editable: true,
                textAlign: "left",
                minSize: new go.Size(0, 0),
                alignment: go.Spot.Left,
                background: this.editTag ? null : "rgba(185, 217, 242,.8)",
              },
              new go.Binding("text", "text").makeTwoWay(),
              new go.Binding("font", "font").makeTwoWay(),
              new go.Binding("minSize", "id", (id, e) => {
                let list = ["p_total", "p_in", "p_out", "p_exchange"];

                let { part } = e;
                if (
                  part &&
                  part.data &&
                  part.data.textType &&
                  part.data.textType === "区域数据" &&
                  list.includes(part.data.id)
                ) {
                  return new go.Size(1000, 0);
                }
                return new go.Size(0, 0);
              })
            )
          )
        )
      );
      // 虚线区域
      this.myDiagram.nodeTemplateMap.add(
        "xxqy",
        $(
          go.Node,
          "Table",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            zOrder: -999,
            click: (e, obj) => {
              console.log("虚线区域", obj.part.data);
            },
            opacity: 1,
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("opacity", "opacity").makeTwoWay(),
          {
            resizable: true,
            resizeObjectName: "xxqy",
          },
          $(
            go.Panel,
            "AUTO",
            {
              row: 1,
              column: 1,
              name: "BODY",
              stretch: go.GraphObject.Fill,
              background: null,
            },

            $(
              go.Shape,
              {
                row: 1,
                column: 1,
                name: "xxqy",
                strokeDashArray: [5, 10],
                strokeDashOffset: 5,
                stroke: "#f20", //auto bind
                strokeWidth: 5, //auto bind
                cursor: "pointer",
                minSize: new go.Size(100, 100),
                background: "transparent",
                fill: "rgba(255,255,255,0)",
              },

              new go.Binding("width", "width").makeTwoWay(),
              new go.Binding("height", "height").makeTwoWay(),
              new go.Binding("stroke", "stroke").makeTwoWay(),
              new go.Binding("strokeWidth", "strokeWidth"),
              new go.Binding(
                "strokeDashArray",
                "strokeWidth",
                (strokeWidth, link) => {
                  // 细 [5, 10]
                  // 中 [20,15]
                  // 粗 [40, 20]
                  if (+strokeWidth == 5) {
                    return [5, 10];
                  }
                  if (+strokeWidth == 8) {
                    return [20, 15];
                  }
                  if (+strokeWidth == 10) {
                    return [40, 15];
                  }
                  return [5, 10];
                }
              )
            )
          )
        )
      );
      //  有功无功电流
      this.myDiagram.nodeTemplateMap.add(
        "PQI",
        $(
          go.Node,
          "Auto",
          {
            locationObjectName: "BODY",
            locationSpot: go.Spot.Center,
            selectionObjectName: "BODY",
            click: (e, obj) => {
              console.log("node", obj.part.data);
            },
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          $(go.Shape, "RoundedRectangle", {
            // fill: "white",
            // stroke: "#eeeeee",
            // strokeWidth: 3,
          }),
          $(
            go.Panel,
            "Table",
            { margin: 1, stretch: go.GraphObject.Fill },
            $(go.RowColumnDefinition, {
              row: 0,
              sizing: go.RowColumnDefinition.None,
            }),
            // the table header
            $(
              go.TextBlock,
              {
                name: "P",
                row: 0,
                column: 0,
                stroke: "#fff",
                alignment: go.Spot.Left,
                margin: new go.Margin(0, 5, 0, 2),
                font: "bold 20px sans-serif",
                visible: true,
              },
              new go.Binding("text", "p"),
              new go.Binding("visible", "visible", (visible, e) => {
                if (visible == "1" && e.part.data.p) {
                  return true;
                }
                return false;
              }).makeTwoWay()
            ),
            $(
              go.TextBlock,
              {
                name: "afterCalculateP",
                row: 0,
                column: 1,
                alignment: go.Spot.Left,
                stroke: "red",
                // margin: new go.Margin(0, 0, 0, 6), // leave room for Button
                font: "bold 20px sans-serif",
                visible: true,
              },
              new go.Binding("text", "afterCalculateP"),
              new go.Binding("visible", "visible", (visible, e) => {
                if (visible == "1" && e.part.data.afterCalculateP) {
                  return true;
                }
                return false;
              }).makeTwoWay()
            ),
            $(
              go.TextBlock,
              {
                name: "Q",
                row: 1,
                column: 0,
                alignment: go.Spot.Left,
                visible: true,
                stroke: "#fff",
                font: "bold 20px sans-serif",
              },
              new go.Binding("text", "q"),
              new go.Binding("visible", "visible", (visible, e) => {
                if (visible == "1" && e.part.data.q) {
                  return true;
                }
                return false;
              }).makeTwoWay()
            ),
            $(
              go.TextBlock,
              {
                name: "afterCalculateQ",
                row: 1,
                column: 1,
                alignment: go.Spot.Left,
                stroke: "red",
                // margin: new go.Margin(0, 0, 0, 6), // leave room for Button
                font: "bold 20px sans-serif",
                visible: true,
              },
              new go.Binding("text", "afterCalculateQ"),
              new go.Binding("visible", "visible", (visible, e) => {
                if (visible == "1" && e.part.data.afterCalculateQ) {
                  return true;
                }
                return false;
              }).makeTwoWay()
            ),
            $(
              go.TextBlock,
              {
                name: "I",
                row: 2,
                column: 0,
                stroke: "#fff",
                alignment: go.Spot.Left,
                margin: new go.Margin(0, 0, 0, 6), // leave room for Button
                font: "bold 20px sans-serif",
                visible: true,
              },
              new go.Binding("text", "i"),
              new go.Binding("visible", "visible", (visible, e) => {
                if (visible == "1" && e.part.data.i) {
                  return true;
                }
                return false;
              }).makeTwoWay()
            ),
            $(
              go.TextBlock,
              {
                name: "afterCalculateI",
                row: 2,
                column: 1,
                alignment: go.Spot.Left,
                stroke: "red",
                // margin: new go.Margin(0, 0, 0, 6), // leave room for Button
                font: "bold 20px sans-serif",
                visible: true,
              },
              new go.Binding("text", "afterCalculateI"),
              new go.Binding("visible", "visible", (visible, e) => {
                if (visible == "1" && e.part.data.afterCalculateI) {
                  return true;
                }
                return false;
              }).makeTwoWay()
            )
          )
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
      //  console.log(this.myDiagram.Ca.La);
      // console.log((this.myDiagram.Ca.style.background = "#080E12"));
      // -848
      setTimeout(() => {
        this.myDiagram.commandHandler.scrollToPart(
          this.myDiagram.findNodeForKey(-130)
        );
      }, 500);

      // console.log(this.myDiagram.findNodeForKey(-848).data)
    },
    // 保存功能
    save() {
      // const item = cloneDeep(this.myDiagram.model.toJson());
      // const item = this.myDiagram.model.toJson();
      // console.log(item);
      // this.myDiagram.isModified = false;
      // this.myDiagram.div = null;
      // this.myDiagram = null;
      // this.initDiagram();
      // console.log(this.myDiagram)
      // const json = JSON.parse(item);
      // localStorage.setItem("json", JSON.stringify(json));
      let linkDataArray = cloneDeep(this.myDiagram.model.Yc).map((item) => {
        // console.log(item.labelKeys)
        delete item.__gohashid;
        if (item.labelKeys.indexOf(null) !== -1) {
          item.labelKeys = [];
        }
        let points = [];
        item.points.each((item) => {
          points.push(item.x);
          points.push(item.y);
        });

        return {
          ...item,
          points,
        };
      });
      let nodeDataArray = cloneDeep(this.myDiagram.model.Fc).map((item) => {
        delete item.__gohashid;
        return {
          ...item,
        };
      });
      let myJson = this.displayPort(
        {
          class: "GraphLinksModel",
          copiesArrays: true,
          copiesArrayObjects: true,
          linkFromPortIdProperty: "fromPort",
          linkToPortIdProperty: "toPort",
          linkLabelKeysProperty: "labelKeys",
          nodeDataArray,
          linkDataArray,
        },
        true
      );
      return myJson;
    },

    // 实时功率：
    // 网供电量：
    // 上网电量：
    // 交换电量：
    setYgWg() {
      getYgWg().then((res) => {
        let ygwgData = res.data;
        let map = {
          实时功率: "p_total",
          网供电量: "p_in",
          上网电量: "p_out",
          实时关口功率: "p_exchange",
        };
        let nodeDataArray = this.myDiagram.model.nodeDataArray;
        nodeDataArray?.forEach((node) => {
          if (
            node.category == "textarea" &&
            node.id &&
            node.textType == "区域数据"
          ) {
            for (let key in map) {
              if (node.id == map[key]) {
                let pattern = "";
                if (node.text.includes(":")) {
                  pattern = new RegExp(":" + ".*");
                }
                if (node.text.includes("：")) {
                  pattern = new RegExp("：" + ".*");
                }
                let text = node.text.replace(pattern, "");

                this.myDiagram.model.setDataProperty(
                  node,
                  "text",
                  text ? text : key
                );
              }
            }
            let i = ygwgData[node.id] + "";
            i = i.split(".");
            let num = ygwgData[node.id]
              ? `${i[0] + (i[1] ? "." + i[1].slice(0, 6) : "")}`
              : `-`;
            // if (node.id === "p_total") {
            //   this.myDiagram.model.setDataProperty(
            //     node,
            //     "text",
            //     node.text.includes("：")
            //       ? node.text + "100000.1234MWh"
            //       : node.text + "：" + "100000.1234MWh"
            //   );
            //   return;
            // }

            this.myDiagram.model.setDataProperty(
              node,
              "text",
              // node.text.includes("：")
              //   ? node.text + num
              //   :
              node.text + "：" + num
            );
          }
        });
      });
    },
    clearIntervalYgWg() {
      clearInterval(this.setYgWgInt);
    },
    // 开光状态更改
    showKgStatus(list = []) {
      let kgStausList = JSON.parse(JSON.stringify(list));
      let nodeList = [];

      kgStausList?.forEach((item) => {
        let node;
        if (this.myDiagram) {
          node = this.myDiagram
            .findNodesByExample({
              id: item.breakerId + "",
            })
            .first();

        }
        if (node && node.data) {
          let data = node.data;

          let type = data.type.slice(-1) === "1" ? str.slice(0, -1) : data.type;

          type = item.state ? type + "1" : type;

          if (
            node.data.type.indexOf("kgTransverse") > -1 ||
            node.data.type.indexOf("kgVertical") > -1
          ) {
            // 闸刀开关闭合

            this.myDiagram.model.setDataProperty(node.data, "type", type);

            nodeList.push(node.data);
          } else if (
            node.data.type.indexOf("dzTransverse") > -1 ||
            node.data.type.indexOf("dzVertical") > -1
          ) {
            if (item.breakerId === "3800475136453456446") {
              this.myDiagram.model.setDataProperty(node.data, "type", type);
            }

            this.myDiagram.model.setDataProperty(node.data, "type", type);

            nodeList.push(node.data);
          }

          // else {
          //   // if(node.data.category && node.data.category == '')
          //   this.myDiagram.model.setDataProperty(
          //     node.data,
          //     "fill",
          //     node.data.stroke
          //   );
          // }
        }
      });
      // console.log(2222222222222222, nodeList);
    },
  },

  // 滚动下拉
  // directives: {
  //   loadMore: {
  //     bind(el, binding) {
  //       let select_dom = el.querySelector(
  //         ".el-select-dropdown .el-select-dropdown__wrap"
  //       );
  //       select_dom.addEventListener("scroll", function () {
  //         console.log("this", this);
  //         let height = this.scrollHeight - this.scrollTop <= this.clientHeight;
  //         if (height) {
  //           binding.value();
  //         }
  //       });
  //     },
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.goCanvas {
  width: 100%;
  height: 100%;
  // background-image: url("~@/assets/intelligent/FigureBJ2.png");
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  background: #000;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  display: flex;
  // padding: 10px 5px;
  position: relative;

  // ::v-deep .el-loading-spinner .el-icon-loading {
  //   font-size: 30px;
  // }
  // ::v-deep .el-loading-mask {
  //   z-index: 2;
  // }
  // ::v-deep .el-loading-spinner {
  //   /*这个是自己想设置的 gif 加载动图*/
  //   background-image: url("~@/assets/images/loading.gif");
  //   background-repeat: no-repeat;
  //   background-size: 100px 30px;

  //   // height: 100px;
  //   height: 100px;
  //   width: calc(100% - 520px);
  //   background-position: center;
  //   /*覆盖 element-ui 默认的 50% 因为此处设置了height:100%,所以不设置的话，会只显示一半，因为被top顶下去了*/
  //   top: 50%;
  // }
  // ::v-deep .el-loading-spinner .circular {
  //   /*隐藏 之前 element-ui 默认的 loading 动画*/

  //   display: none;
  // }
  // ::v-deep.el-loading-spinner .el-loading-text {
  //   /*为了使得文字在loading图下面*/
  //   margin: 75px 0px;
  //   color: #596266;
  // }

  .messageBox {
    width: 100%;
    height: 100%;
    z-index: 20;
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .ract {
      position: absolute;
      left: 50%;
      top: 30%;
      width: 500px;
      min-height: 200px;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 20px;
      border-radius: 5px;

      .title {
        display: flex;
        align-items: center;
        font-size: 20px;

        span {
          width: 100%;
          padding-left: 10px;
          font-weight: 550;
        }

        // .el-icon-info {
        // }

        .el-icon-close {
          cursor: pointer;
        }
      }

      .messageBoxcontent {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-weight: 550;
        font-size: 16px;
        height: calc(160px - 30px - 30px);

        >div {
          margin-top: 10px;
        }

        // text-align: center;
      }

      .messageBox-footer {
        height: 30px;
        display: flex;
        flex-direction: row-reverse;
        // justify-items: center;
        align-items: center;

        .el-button {
          padding: 5px 10px;
        }

        .el-button--primary {
          margin-left: 20px;
        }
      }
    }
  }

  .changeTabBar {
    &.shrink {
      width: calc(100% - 20px);
    }

    width: calc(100% - 420px);
    position: absolute;
    top: 10px;
    left: 8px;
    z-index: 3;
    padding: 8px 18px;
    background: #11161e;

    .el-form--inline {
      display: flex;
      justify-content: space-between;

      ::v-deep .el-form-item {
        margin-bottom: 0px;
        display: flex;
        align-items: center;

        .el-form-item__label {
          font-size: 18px;
          font-family: PingFangSC-Semibold;
          display: block !important;
          line-height: 20px;
          color: #ffffff;
        }

        .el-form-item__content {
          .el-select {
            .el-input {
              .el-input__inner {
                background: #0d1519;
                color: #fff;
                border: 1px solid rgba(230, 230, 232, 0.2);

                &:focus {
                  border: 1px solid rgba(230, 230, 232, 0.5);
                }
              }
            }
          }
        }
      }

      .rightFormItem {
        display: flex;
        align-items: center;

        ::v-deep .el-form-item {
          margin-right: 0px;

          .el-form-item__content {
            display: flex;
            align-items: center;

            .fnBtn {
              display: flex;
              align-items: center;

              .el-button--primary {
                padding: 3px 8px;
                background: transparent;

                .el-icon-camera-solid {
                  font-size: 18px;
                }
              }
            }
          }

          .buttonList {
            .el-button {
              background: #121212;
              color: #ffffff;
              border-color: #566068;

              &:hover {
                background: rgba(39, 83, 100, 0.5);
              }

              &.is-disabled {
                background: #5e5e5e;
                color: black;
              }
            }

            .el-button.active {
              background: #275364;
            }
          }

          .fnBtn {
            padding-left: 20px;
          }
        }
      }
    }
  }

  // .TabBarList {
  //   width: calc(100% - 520px);
  //   padding: 0px 10px;
  //   position: absolute;
  //   top: 10px;
  //   left: 5px;
  //   z-index: 3;
  //   display: flex;
  //   height: 32px;
  //   align-items: center;
  //   background: rgba(56, 149, 216, 0.5);
  //   cursor: pointer;

  //   .createBtn {
  //     width: 100px;
  //     margin-right: 10px;
  //     font-size: 12px;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     height: 22px;
  //     background: #32709b;
  //     border: 1px solid #73b5e4;
  //     color: #daf0fe;
  //     border-radius: 2px;

  //     img {
  //       margin-right: 5px;
  //       width: 14px;
  //       height: 14px;
  //     }
  //   }

  //   .createBtn.active {
  //     background: #e1f2fe;
  //     color: #4898c5;
  //     font-weight: 550;
  //   }
  // }

  .details {
    position: absolute;
    right: 20px;
    top: 60px;
    z-index: 3;
    color: #5aa3da;
    font-size: 16px;

    .cl {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ::v-deep .el-date-editor {
      // height: 30px;
      background: transparent;

      .el-input__icon.el-icon-time,
      .el-input__suffix .el-input__suffix-inner .el-input__icon {
        line-height: 30px;
      }

      .el-input__inner {
        background: #000000;
        height: 30px;
        color: #3c96d9;
        border-color: #3c96d9;
      }
    }

    .cl-btn {
      padding: 0px 0px;
      height: 32px;
      width: 100px;
      font-size: 14px;
      background: #3c96d9;
      border-color: #5aa3da;
      margin-left: 15px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin-right: 5px;
      }
    }

    .cl-btn:active {
      font-size: 12px;
    }
  }

  .F5 {
    position: absolute;
    z-index: 4;
    top: 6px;
    right: 12px;
    width: 22px;
    height: 22px;
  }

  .switchList {
    position: absolute;
    right: 60px;
    display: flex;
    top: 6px;
    // top: 100px;
    z-index: 3;

    >div {
      display: flex;
      flex-direction: row-reverse;
      // margin-bottom: 10px;
      margin: 0 10px;
    }

    // .dwd,
    // .ycz {
    //   display: flex;
    //   flex-direction: row-reverse;

    //   ::v-deep .el-switch__label.el-switch__label--left.is-active {
    //     span {
    //       color: #ddd;
    //     }
    //   }
    // }
    .dwd {
      ::v-deep .el-switch__label.el-switch__label--left {
        span {
          color: #fff;
        }
      }

      ::v-deep .el-switch__label.el-switch__label--left.is-active {
        span {
          color: #ddd;
        }
      }
    }

    .ld {
      ::v-deep .el-switch__label.el-switch__label--left {
        span {
          color: #fff;
        }
      }

      ::v-deep .el-switch__label.el-switch__label--left.is-active {
        span {
          color: #ddd;
        }
      }
    }

    .ycz {
      ::v-deep .el-switch__label.el-switch__label--left {
        span {
          color: #fff;
        }
      }

      ::v-deep .el-switch__label.el-switch__label--left.is-active {
        span {
          color: #ddd;
        }
      }
    }
  }

  // position: relative;
  #myPaletteDiv {
    width: 100px;
    height: 100%;
    background: #323232;
  }

  #myDiagramDiv {
    // background: #000;
    margin-top: 70px;
    flex: 1;
    // width: calc(100% - 200px);
    height: calc(100% - 70px);
    // border: 1px solid #ddd;
    // background: rgba(255, 255, 255, 0.5);
    background: #000;
    outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    overflow: hidden;
  }

  // 230, 230, 230
  #toolTipKg,
  #toolTipKgPw,
  #toolTipGtPw,
  #toolTipLine,
  #toolTipMx,
  #toolTipXsdz,
  #toolTipZb {
    background: rgba(33, 52, 76, 0.8);
    position: absolute;
    z-index: 1000;
    display: none;
    min-width: 200px;
    // min-height: 100px;
    max-height: 450px;
    padding: 10px 5px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(56, 149, 216, 0.8);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(56, 149, 216, 0.8);
      cursor: pointer;
    }

    #toolTipParagraph {
      width: 100%;
      height: 100%;
      position: relative;

      .tipItem {
        width: 100%;
        padding: 3px 5px;
        font-size: 14px;
        font-family: PingFang SC;
        // margin-bottom: 4px;
        word-break: break-all; //英文
        // white-space: pre-wrap; //中文
        white-space: nowrap;
        color: #ffffff;

        span {
          color: #ffffff;
          font-weight: bold;
        }

        .addRed {
          color: rgb(218, 33, 33);
          font-weight: normal;
        }
      }
    }
  }

  // .tipItem {
  //   width: 100%;
  //   padding: 5px 5px;
  //   font-size: 14px;
  //   font-family: PingFang SC;
  //   margin-bottom: 4px;
  //   word-break: break-all; //英文
  //   white-space: pre-wrap; //中文
  //   color: #333333;
  //   span {
  //     color: #333333;
  //     font-weight: bold;
  //   }
  // }
  #toolTipZb,
  #toolTipXsdz,
  #toolTipLine {
    overflow: auto;
    word-break: break-all; //英文
    white-space: pre-wrap; //中文
  }

  .Myrect {
    width: 4px;
    height: 4px;
    background: #02fdf3;
  }

  .left {
    position: absolute;
    left: 4px;
    top: -5px;
  }

  .bottomleft {
    position: absolute;
    left: 4px;
    bottom: 0px;
  }

  .right {
    position: absolute;
    right: 0px;
    top: -5px;
  }

  .bottomright {
    position: absolute;
    right: 0px;
    bottom: 0px;
    // color:#01ffff
  }
}
</style>
