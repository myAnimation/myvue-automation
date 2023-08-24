<template>
  <div>
    <el-card>
      <el-form class="queryForm" ref="queryForm">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="编号" prop="name">
              <el-input
                v-model="form.serialNumber"
                clearable
                size="mini"
                placeholder="编号"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <myTable
        :options="options"
        :data="tableData"
        @handleSelectionChange="handleSelectionChange"
        :columns="columns"
        :tHeight="68"
      >
        <template #cz>
          <el-table-column align="center" prop="cz" label="操作">
            <template v-slot="{ row }">
              <div class="table-btnList">
                <el-button type="text" @click="editUpdateDialog(row)"
                  >编辑</el-button
                >
              </div>
            </template>
          </el-table-column>
        </template>
      </myTable>
      <Pagination
        :total="totalCount"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.pageSize"
        @pagination="getDataList"
        style="margin-top:20px;"
      ></Pagination>
    </el-card>

    <updateDialog
      :formConfigList="columns"
      :updateDialogTitle="updateDialogTitle"
      v-if="updateDialogVisible"
      ref="updateDialog"
      :updateDialogVisible="updateDialogVisible"
      @changeupdateDialogVisible="changeupdateDialogVisible"
    ></updateDialog>
  </div>
</template>

<script>
  import myTable from "./myTable/index.vue";
  import updateDialog from "./updateDialog/index.vue";
  import Pagination from "./Pagination/index.vue";
  export default {
    components: { myTable, updateDialog, Pagination },
    data() {
      return {
        // 表格配置
        options: {
          // 序号
          index: true,
          // 选择框
          mutiSelect: true,
          //   开启边框表格
          border: true,
          //   表头样式
          headerStyle: {
            fontSize: "16px",
            fontFamily: "Microsoft YaHei",
            fontWeight: "bold",
            padding: "8px 0px",
            color: "#333333",
          },
        },
        columns: [
          {
            label: "编号",
            prop: "serialNumber",
            elType: "input",
            // inputType: "number",
          },
          {
            label: "开始时间",
            prop: "startTime",
            elType: "datetime",
          },
          {
            label: "结束时间",
            prop: "endTime",
            elType: "datetime",
          },
          {
            label: "时间范围",
            prop: "time",
            elType: "datetimerange",
            // 宽度
            width: 300,
          },
          {
            label: "下拉选项",
            prop: "date4",
            elType: "select",
            selectList: [
              { label: "11", value: "22" },
              { label: "22", value: "33" },
            ],
          },
          {
            label: "工作内容",
            prop: "workContent",
            elType: "textarea",
            inputType: "textarea",
            rows: 4,
            col: 24,
          },

          {
            slot: "cz",
          },
        ],
        // 表格数据
        tableData: [],
        // 表格选中数据
        multipleSelection: [],

        // 弹窗标题
        updateDialogTitle: "新增",
        updateDialogVisible: false,
        // 分页
        totalCount: 100,
        queryParams: {
          page: 1,
          pageSize: 10,
        },
        // 查询参数
        form: {
          serialNumber: "",
        },
      };
    },
    mounted() {
      this.getDataList();
    },
    methods: {
      // 数据请求
      getDataList() {
        // 每次点击分页参数会改变
        console.log(this.queryParams);
        console.log(this.form);
        this.tableData = [
          {
            serialNumber: "1222",
            startTime: "2023-05-11 16:53:40",
            endTime: "2023-05-11 20:53:40",
            time: "2023-05-11 16:53:40,2023-05-11 20:53:40",
            workContent: "备注！！！！！！！！！！！",
            date4: "33",
          },
        ];
      },
      // 查询
      handleQuery() {
        this.queryParams.page = 1;
        this.getDataList();
      },
      //   重置
      resetQuery() {
        this.form = {
          serialNumber: "",
        };
        this.handleQuery();
      },
      //   新增开启弹窗
      addUpdateDialog() {
        this.updateDialogTitle = "新增";
        this.updateDialogVisible = true;
      },
      //   编辑开启弹窗
      editUpdateDialog(row) {
        this.updateDialogTitle = "修改";
        this.updateDialogVisible = true;
        // 时间范围需要【】格式 所有需要转换
        let item = JSON.parse(JSON.stringify(row));
        item.time = item.time.split(",");
        this.$nextTick(() => {
          this.$refs["updateDialog"].updateformObj(item);
        });
      },
      // 关闭弹窗回调
      changeupdateDialogVisible(val) {
        if (val) {
          console.log(val);
          this.getDataList();
        }
        this.updateDialogVisible = false;
      },
      // 点击选中
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    },
  };
</script>

<style lang='scss'>
.queryForm {
  .el-form-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    .el-form-item__label {
      flex-shrink: 0;
    }
    .el-form-item__content {
      width: 100%;
      .el-input {
        .el-input__inner {
          width: 100%;
        }
      }
    }
  }
}
</style>