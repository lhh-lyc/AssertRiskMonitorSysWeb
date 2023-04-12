<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div style="height: 360px" ref="chart"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 数据选项
      dataOptions: ['全部数据', '数据项1', '数据项2', '数据项3'],
      // 当前选中的数据项，默认为全部���据
      selectedData: '全部数据',
      // 饼图实例
      chart: null,
      // 饼图配置选项
      option: {
        title: {
          text: '饼图示例'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['数据项1', '数据项2', '数据项3']
        },
        series: [
          {
            name: '数据来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '数据项1'},
              {value: 310, name: '数据项2'},
              {value: 234, name: '数据项3'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods:{
    initChart() {
      // 使用第三方图表库进行图表绘制
      // 例如：echarts

      let chart = echarts.init(this.$refs.chart)

      // 设置图表配置项
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表
      chart.setOption(option)
    }
  }
};
</script>
