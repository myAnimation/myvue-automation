<template>
  <div class="updateDialog">
    <el-dialog
      :title="updateDialogTitle"
      :visible.sync="visible"
      :before-close="cancel"
      :top="top"
      :close-on-click-modal="false"
    >
      <div class="content">
        <el-form ref="form" :model="formObj" :rules="rules">
          <el-row :gutter="60">
            <el-col
              :span="formType.col || 12"
              :key="formType.label"
              v-if="formType.label && formType.prop && formType.elType"
              v-for="formType in formList"
            >
              <el-form-item :label="formType.label" :prop="formType.prop || ''">
                <el-input
                  v-if="
                    formType.elType === 'input' ||
                    formType.elType === 'textarea'
                  "
                  clearable
                  :rows="(formType.elType === 'textarea' && formType.rows) || 2"
                  :type="formType.inputType || ''"
                  v-model="formObj[formType.prop]"
                  :placeholder="`请输入${formType.label}`"
                  :disabled="formType.disabled"
                  :min="formType.inputType == 'number' ? 1 : ''"
                >
                </el-input>
                <el-select
                  style="width: 100%"
                  clearable
                  filterable
                  :multiple="formType.multiple"
                  :collapse-tags="formType.tags"
                  v-if="formType.elType === 'select'"
                  v-model="formObj[formType.prop]"
                  :placeholder="`请选择${formType.label}`"
                >
                  <el-option
                    v-for="item in formType.selectList || []"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-date-picker
                  v-if="formType.elType === 'datetime'"
                  style="wdith: 100%"
                  v-model="formObj[formType.prop]"
                  type="datetime"
                  :placeholder="`请选择${formType.label}`"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>

                <el-date-picker
                  v-if="formType.elType === 'datetimerange'"
                  style="wdith: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="formObj[formType.prop]"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  clearable
                  end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-time-picker
                  v-if="formType.elType === 'timepicker'"
                  is-range
                  v-model="formObj[formType.prop]"
                  range-separator="~"
                  start-placeholder="开始时间"
                  value-format="HH:mm:ss"
                  end-placeholder="结束时间"
                  clearable
                  placeholder="选择时间范围"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "updateDialog",
    props: {
      updateDialogVisible: {
        type: Boolean,
        default: false,
      },
      updateDialogTitle: {
        type: String,
        default: "",
      },
      formConfigList: {
        type: Array,
        default: () => {
          return [
            {
              label: "电压等级",
              prop: "date1",
              elType: "input",
              required: true,
            },
            {
              label: "跳闸时间",
              prop: "date2",
              elType: "input",
            },
            {
              label: "变电站",
              prop: "date3",
              elType: "input",
            },
            {
              label: "跳闸线路",
              prop: "date4",
              elType: "select",
              selectList: [{ label: "11", value: "22" }],
            },
            {
              label: "保护动作情况",
              prop: "date5",
              elType: "input",
            },
            {
              label: "送出时间",
              prop: "date6",
              elType: "datetime",
            },
            {
              label: "巡线结果及结论",
              prop: "date7",
              elType: "textarea",
              inputType: "textarea",
              rows: 4,
              col: 24,
            },
          ];
        },
      },
      top: {
        type: String,
        default: "15vh",
      },
    },

    data() {
      return {
        formObj: {},
        rules: {},
        formList: [],
      };
    },
    created() {
      let formObj = {};
      let rules = {};
      let formList = [];
      console.log(this.formConfigList);
      JSON.parse(JSON.stringify(this.formConfigList)).forEach((item) => {
        if (item.prop && item.elType) {
          formObj[item.prop] = "";
          if (item.label.includes("//")) {
            item.label = item.label.replace("//", "");
          }

          if (item.required) {
            rules[item.prop] = [
              { required: true, message: `请输入${item.label}`, trigger: "blur" },
            ];
          }
          formList.push(item);
        }
      });
      this.formObj = formObj;
      this.rules = rules;
      this.formList = formList;
      // console.log('formList',formList)
    },
    computed: {
      visible: {
        get() {
          return this.updateDialogVisible;
        },
        set(val) {
          this.dialogVisible = val;
        },
      },
    },
    watch: {
      formObj: {
        handler(newVal, oldVal) {
          if (newVal?.reservoirCapacityElectric || newVal?.releasableElectric) {
            newVal.reservoirCapacityElectric = (
              newVal.installCapacity * newVal.wholeOpenDuration
            ).toFixed(2);
            newVal.releasableElectric = (
              newVal.standAlone * newVal.standAloneDuration
            ).toFixed(2);
          }
        },
        deep: true, // 深度监听
        immediate: true, // 初始化监听
      },
    },
    mounted() {},
    methods: {
      save() {
        console.log(this.formObj);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let formObj = JSON.parse(JSON.stringify(this.formObj));
            for (let key in formObj) {
              if (!formObj[key]) {
                formObj[key] = "";
              }
            }

            this.$emit("changeupdateDialogVisible", formObj);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      updateformObj(val) {
        // console.log(val)
        // return
        this.formObj = JSON.parse(JSON.stringify(val));
        console.log(this.formObj);
      },
      cancel() {
        this.$emit("changeupdateDialogVisible");
      },
    },
  };
</script>
<style lang='scss' scoped>
::v-deep .el-dialog__body {
  color: #fff;
  padding-bottom: 0px;

  .el-form {
    .el-form-item {
      width: 100%;

      & > div {
        width: 100%;
      }

      .el-form-item__label {
      }

      .el-form-item__content {
        .el-input {
          width: 100%;

          .el-input__inner {
            width: 100%;

         
          }

          .el-input__inner:focus {
          }
        }

        .el-input__inner.el-date-editor--datetimerange,
        .el-date-editor--timerange {
          width: 100%;

          .el-input__icon {
            font-size: 15px;
            padding: 0 10px;
       
          }

          .el-range-separator {
       
            font-size: 22px;
          }

          .el-range-input {
      
          }
        }
      }
    }
  }
}
</style>