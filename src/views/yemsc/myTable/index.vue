<template>
  <!-- tableDrag -->
  <!-- 表格 -->
  <el-table
    style="width: 100%"
    id="wTable"
    ref="wTable"
    v-loading.wTable="woptions.loading"
    :data="data"
    :cell-class-name="options.columnClass ? columnKrd : columnClass"
    :stripe="woptions.stripe"
    :border="woptions.border"
    :fit="woptions.fit"
    :span-method="spanMethod"
    :row-key="rowKey"
    :height="tHeight + 'vh'"
    @selection-change="handleSelectionChange"
    :header-cell-style="options.headerStyle"
  >
    <!-- 多选框 -->
    <el-table-column
      v-if="woptions.mutiSelect"
      :reserve-selection="true"
      type="selection"
      :selectable="woptions.checkSelect"
      width="45"
      align="center"
    />
    <!-- 序号 -->
    <el-table-column
      v-if="woptions.index"
      label="序号"
      type="index"
      width="60"
      align="center"
    />
    <!-- 数据列 -->
    <template v-for="(column, index) of columns">
      <!-- 如过有嵌套，递归多级表头 -->
      <template v-if="column.children && column.children.length > 0">
        <WColumn :key="index" :column="column" />
      </template>
      <!-- 没有正常显示 -->
      <template v-else>
        <!-- 具名插槽 -->
        <slot v-if="column.slot" :name="column.slot" />
        <el-table-column
          :render-header="renderheader"
          v-else-if="!column.isHide"
          v-slot="scope"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :type="column.type"
          :min-width="column.minWidth"
          :width="column.width"
          :align="column.align || 'center'"
          :fixed="column.fixed"
          :show-overflow-tooltip="column.tooltip"
          :class-name="column.class"
          :sortable="column.sort"
        >
          <!-- 是否需要特殊处理 -->
          <template v-if="column.formatter">
            <span v-html="column.formatter(scope.row, column)" />
          </template>
          <template v-else>
            <!-- 正常显示 -->
            <span>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </template>
  </el-table>
  <!-- 分页 -->
</template>

<script>
import WColumn from "./WCloumn.vue";
export default {
  name: "WTable",
  components: { WColumn },
  props: {
    // 头部按钮组
    tools: {
      type: Array,
      default() {
        return [{ method() {} }];
      },
    },
    // 数据
    data: {
      type: Array,
      requre: true,
      default() {
        return [];
      },
    },
    // 合并行
    spanMethod: Function,
    // 多选回显key
    rowKey: {
      type: String,
      default: "id",
    },
    /**
     * 表格默认配置
     * height: 表格高度
     * stripe: 是否为斑马纹 table
     * border: 是否带有纵向边框
     * fit: 列的宽度是否自撑开
     * mutiSelect: 是否开启多选
     * loading: 添加loading
     */
    options: {
      type: Object,
      default() {
        return {
          stripe: true,
          border: false,
          fit: true,
          mutiSelect: false,
          loading: false,
          index: true,
          columnClass: false,
          headerStyle:{}
        };
      },
    },
    // 表格高度 - 分页
    tHeight: {
      type: Number,
      default: 45,
    },
    /**
     * 列集合
     * prop: 列字段
     * label: 列名称
     * align: 文本显示位置
     * width: 列固定宽度，例：200
     * minWidth: 自适应宽度 例： 200 或 20%
     * type: 类型
     * formatter: 特殊处理
     * slot: 特殊列名称
     * isHide: 是否隐藏列，用于动态展示列
     * tooltip: 超出是否...
     * class: 列的class
     * sort: 是否排序
     */
    columns: {
      type: Array,
      default() {
        return [];
      },
      require: true,
    },
    // 数据总数
    total: {
      type: Number,
      default: 0,
    },
    // 是否显示分页
    isPagination: {
      type: Boolean,
      default: true,
    },
    /**
     * 分页参数
     * pagesize:每页显示的条数
     * currentPage:当前页码
     * pageArr: 显示多少条集合
     * background: 是否要背景
     */
    pagination: {
      type: Object,
      default() {
        return {
          pagesize: 10,
          background: true,
          currentPage: 1,
          pageArr: [10, 20, 50, 100],
        };
      },
    },
  },
  data() {
    return {
      // 默认的表格配置
      woptions: {
        stripe: false,
        border: false,
        fit: true,
        mutiSelect: false,
        loading: false,
        index: true,
        checkSelect() {
          return true;
        },
      },
      // 默认的分页配置
      wpagination: {
        pagesize: 10,
        background: true,
        currentPage: 1,
        pageArr: [10, 20, 50, 100],
      },
      myHeight:45
    };
  },
  created() {
    // 扩展配置，目的是引用组件不用把配置全写一遍
    this.woptions = Object.assign({}, this.woptions, this.options);
    this.wpagination = Object.assign({}, this.wpagination, this.pagination);
  },
  mounted() {
    var that = this;
    // that.$nextTick(() => {
    //   /**
    //    * 自动适配表格高度
    //    * 100% 减去表格头部
    //    * 在dom渲染完成后执行
    //    */
    //   let tableWrapperHeader = document.querySelector(
    //     ".tableBox .el-table .el-table__header-wrapper"
    //   );
    //   let tableWrapperBody = document.querySelector(
    //     ".tableBox .el-table .el-table__body-wrapper"
    //   );
    //   let tHeight = tableWrapperHeader.offsetHeight;
    //   that.myHeight = tHeight;
    //   tableWrapperBody.style = `height:calc(100% - ${that.tHeight}px)`;
    // });
  },
  methods: {
    // 不同列给class
    columnClass(row) {
      if (row.rowIndex % 2 !== 0) {
        return "double";
      } else {
        return "single";
      }
    },
    columnKrd({ row }) {
      if (row.controlWaterLevel >row.realTimeWaterLevel) {
        return "krdzActive";
      } else if (row.type == 1) {
        return "double";
      } else {
        return "sings";
      }
    },
    getTableRef() {
      return this.$refs["wTable"];
    },
    // 表格多选
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    // 选择每页展示的条数
    handleSizeChange(size) {
      this.$emit("handleSizeChange", size);
    },
    // 点击第几页
    handleCurrentChange(currentPage) {
      this.$emit("handleCurrentChange", currentPage);
    },
    // 上下换行
    renderheader(h, { column }) {
      // renderheader函数得用到el-table-column上，而不是el-table
      return h("span", {}, [
        h("span", {}, column.label.split("//")[0]), // 其中//也可以用其他符号替代
        h("br"),
        h("span", {}, column.label.split("//")[1]),
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.wTable {
}

</style>
