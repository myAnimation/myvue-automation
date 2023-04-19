<template>
  <div>
    <myTable :options="woptions" :columns="columns" :data="tableData">
      <template #cz>
        <el-table-column align="center" prop="cz" label="操作">
          <template v-slot="{ row }">
            <div>
              <el-button type="primary">操作</el-button>
              <el-button type="primary">修改</el-button>
            </div>
          </template>
        </el-table-column>
      </template>
    </myTable>
  </div>
</template>

<script>
import myTable from "./myTable.vue";
export default {
  name: "tb",
  components: { myTable },
  data() {
    return {
      tableData: [{ name: "xm", age: 17, sex: "男" }],
      woptions: {
        mutiSelect: true,
      },
      columns: [
        {
          label: "名字",
          prop: "",
          children: [
            {
              prop: "xx",
              label: "小学",
            },
            {
              prop: "xx",
              label: "初中",
            },
          ],
        },
        { prop: "age", label: "年龄" },
        { prop: "sex", label: "性别" },
        {
          slot: "cz",
        },
      ],
    };
  },
};
</script>

<style>
</style>