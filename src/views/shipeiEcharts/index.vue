<template>
    <VScaleScreen width="1920" height="1080">

        <div class="wenzi">
            <span>11112312312</span>
            <div ref="item1" class="item1" style="width:300px;height:200px"></div>
        </div>
        <div ref="item2" class="item2" style="width:500px;height:400px"></div>
    </VScaleScreen>
    <!-- <Vcharts>
        <div class="wenzi">
            <span>11112312312</span>
            <div ref="item1" class="item1" style="width:300px;height:200px"></div>
        </div>
        <div ref="item2" class="item2" style="width:500px;height:400px"></div>
    </Vcharts> -->
</template>

<script>
import Vcharts from './components/Vcharts.vue';
export default {
    name: 'echarts',
    components: { Vcharts },
    data() {
        return {

        }
    },
    mounted() {
        this.$nextTick(() => {

            this.createItem1()
            this.createItem2()
        })
    },
    methods: {
        createItem1() {
            var myChart = this.$echarts.init(this.$refs.item1);

            // 数据
            let data = ["3526.542", "862.515", "567.498", "453.344", "389.042", "274.598", "259.472", "240.810", "194.984", "144.751", "134.844", "132.975", "114.305", "96.880", "86.550", "73.782", "50.704", "47.157", "31.744", "28.818", "3.479"]
            // x轴数据
            let xdata = ["山东XX集团", "山东XX股份", "建设管理集团", "XX股份控股", "XX集团控股", "XX产业发展", "XX发展参股", "齐鲁XX股份", "山东XX发展", "红河公路开发", "山东XX新台", "山东荣潍XX", "山高集团参股", "山东XX岚临", "山东桂鲁高速", "山东滨莱高速", "湖北发展公司", "青岛交通发展", "中铁宜彝高速", "XX青岛公路", "青岛胶州发展"]
            // 颜色
            let color = ["#5ef3ff", "#06a4f4"]
            let option = {
                "grid": {
                    "left": "5%",
                    "right": "2%",
                    "top": "15%",
                    "bottom": "20%"
                },
                "tooltip": {
                    "show": true,
                    "transitionDuration": 0
                },
                "xAxis": {
                    "data": xdata,
                    "axisLine": {
                        "lineStyle": {
                            "color": "#E2E8Ec"
                        }
                    },
                    "axisLabel": {
                        "color": "#3d5269",
                        "fontSize": 12,
                        "rotate": 25
                    }
                },
                "yAxis": {
                    "name": "单位:公里",
                    "nameTextStyle": {
                        "color": "#3d5269",
                        "fontSize": 12
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#E2E8Ec"
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "color": "#3d5269",
                        "fontSize": 12
                    },
                    "splitLine": {
                        "show": false,
                        "lineStyle": {
                            "color": "#fff"
                        }
                    },
                    "interval": 500
                },
                "series": [{
                    "type": "bar",
                    "barWidth": 25,
                    "itemStyle": {
                        "normal": {
                            "color": {
                                "x": 0,
                                "y": 0,
                                "x2": 0,
                                "y2": 1,
                                "type": "linear",
                                "global": false,
                                "colorStops": [{
                                    "offset": 0,
                                    "color": color[0]
                                },
                                {
                                    "offset": 1,
                                    "color": color[1]
                                }]
                            }
                        }
                    },
                    "label": {
                        "normal": {
                            "show": true,
                            "fontSize": 10,
                            "fontWeight": "400",
                            "color": "#000",
                            "position": "top"
                        }
                    },
                    "data": data
                }]
            }
            myChart.setOption(option);
        },
        createItem2() {
            var myChart = this.$echarts.init(this.$refs.item2);

            // 数据
            let data = ["3526.542", "862.515", "567.498", "453.344", "389.042", "274.598", "259.472", "240.810", "194.984", "144.751", "134.844", "132.975", "114.305", "96.880", "86.550", "73.782", "50.704", "47.157", "31.744", "28.818", "3.479"]
            // x轴数据
            let xdata = ["山东XX集团", "山东XX股份", "建设管理集团", "XX股份控股", "XX集团控股", "XX产业发展", "XX发展参股", "齐鲁XX股份", "山东XX发展", "红河公路开发", "山东XX新台", "山东荣潍XX", "山高集团参股", "山东XX岚临", "山东桂鲁高速", "山东滨莱高速", "湖北发展公司", "青岛交通发展", "中铁宜彝高速", "XX青岛公路", "青岛胶州发展"]
            // 颜色
            let color = ["#5ef3ff", "#06a4f4"]
            let option = {
                "grid": {
                    "left": "5%",
                    "right": "2%",
                    "top": "15%",
                    "bottom": "20%"
                },
                "tooltip": {
                    "show": true,
                    "transitionDuration": 0
                },
                "xAxis": {
                    "data": xdata,
                    "axisLine": {
                        "lineStyle": {
                            "color": "#E2E8Ec"
                        }
                    },
                    "axisLabel": {
                        "color": "#3d5269",
                        "fontSize": 12,
                        "rotate": 25
                    }
                },
                "yAxis": {
                    "name": "单位:公里",
                    "nameTextStyle": {
                        "color": "#3d5269",
                        "fontSize": 12
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#E2E8Ec"
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "color": "#3d5269",
                        "fontSize": 12
                    },
                    "splitLine": {
                        "show": false,
                        "lineStyle": {
                            "color": "#fff"
                        }
                    },
                    "interval": 500
                },
                "series": [{
                    "type": "bar",
                    "barWidth": 25,
                    "itemStyle": {
                        "normal": {
                            "color": {
                                "x": 0,
                                "y": 0,
                                "x2": 0,
                                "y2": 1,
                                "type": "linear",
                                "global": false,
                                "colorStops": [{
                                    "offset": 0,
                                    "color": color[0]
                                },
                                {
                                    "offset": 1,
                                    "color": color[1]
                                }]
                            }
                        }
                    },
                    "label": {
                        "normal": {
                            "show": true,
                            "fontSize": 10,
                            "fontWeight": "400",
                            "color": "#000",
                            "position": "top"
                        }
                    },
                    "data": data
                }]
            }
            myChart.setOption(option);
        },
    }
}
</script>

<style lang="scss" scoped>
.item1 {
    // position: absolute;
    // bottom: 0;
    // left: 0;

}

.wenzi {
    span {

        font-size: 40px;
    }
}
</style>