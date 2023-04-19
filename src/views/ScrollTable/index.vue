<template>
    <div class="mytabel">
        <el-table v-loading="loading" ref="table" :data="tableData" height="200" v-loadmore="loadMore"
            style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
            ],
            loading: false,
            scrollTop: null
        }
    },
    mounted() {
        // let dom = document.querySelector(".el-table__body-wrapper");
        // dom.addEventListener("scroll", (v) => {
        //     const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
        //     // 判断是否到底，可以加载下一页
        //     if (scrollDistance <= 1) {
        //         // 判断是否全部加载完成
        //         if (this.page >= this.totalPage) {
        //             this.$message.warning("已经见底了 ～");
        //         }
        //         if (this.page < this.totalPage) {
        //             //当前页数小于总页数就请求
        //             this.page++; //当前页数自增
        //             // 加载下一页方法
        //             this.getNextList();
        //         } 
        //     }
        // });
        // -------------------------------
        // 监听滚动条的位置 
        this.$refs.table.bodyWrapper.addEventListener('scroll', (res) => {
            let height = res.target
            this.scrollTop = height.scrollTop
        }, false)
    },
    methods: {
        // 当页码改变的时候滚动条重新到顶部
        pageChange(page) {
            this.$emit('page-change', page)
            this.scrollTop = 0
            this.saveScroll()
        },
        // 这里如果直接赋值给this.$el.querySelector('.el-table__body-wrapper').scrollTop会失效，需要加上setTimeout才行。
        saveScroll() {
            this.$nextTick(() => {
                setTimeout(() => {
                    var scrollTop = this.$el.querySelector('.el-table__body-wrapper')
                    scrollTop.scrollTop = this.scrollTop
                }, 13)
            })
        },

        loadMore() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.tableData = this.tableData.concat([{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }])
            }, 500)

            console.log('el-table 已经滚到底部')

        }
    },
    beforeMount() {
        this.$refs.table.bodyWrapper.removeEventListener('scroll', (res) => {
            let height = res.target
            this.scrollTop = height.scrollTop
        }, false)
    },
}
</script>

<style>

</style>