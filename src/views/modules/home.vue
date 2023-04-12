<template xmlns="http://www.w3.org/1999/html">
  <div class="home-page">
    <div class="top-section">
      <el-row>
        <el-col :span="18">
          <div class="big-box">
            <div class="title-font">已发现</div>
            <div class="box-row">
              <div class="box" v-for="item in topBoxes.slice(0, 4)" :key="item.id">
                <div class="box-title">{{ item.title }}</div>
                <div class="box-icon">{{ item.num }}</div>
              </div>
            </div>
            <div class="box-row">
              <div class="box" v-for="item in topBoxes.slice(4, 8)" :key="item.id">
                <div class="box-title">{{ item.title }}</div>
                <div class="box-icon">{{ item.num }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="big-box-right">
            <div class="title-font">待执行</div>
            <div class="box-row">
              <div class="box-right" v-for="item in topBoxes.slice(8, 9)" :key="item.id">
                <div class="box-title">{{ item.title }}</div>
                <div class="box-icon">{{ item.num }}</div>
              </div>
            </div>
            <div class="box-row">
              <div class="box-right" v-for="item in topBoxes.slice(9, 10)" :key="item.id">
                <div class="box-title">{{ item.title }}</div>
                <div class="box-icon">{{ item.num }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottom-section">
      <el-row>
        <el-col :span="12">
          <div class="left-box">
            <el-row>
              <el-tabs style="margin-top: 10px;margin-left: 10px" v-model="recordType" type="card"
                       @tab-click="recordClick">
                <el-tab-pane label="新增漏洞" name="1"></el-tab-pane>
                <el-tab-pane label="新增域名" name="2"></el-tab-pane>
                <el-tab-pane label="新增端口" name="3"></el-tab-pane>
              </el-tabs>
            </el-row>
            <el-row style="overflow-y: auto;height:355px;">
              <el-timeline :reverse="reverse">
                <el-timeline-item
                    v-for="(activity, index) in recordList"
                    :key="index"
                    placement="top"
                    :timestamp="activity.createTime">
                  {{ activity.projectName }}<br>
                  {{ activity.describe }}
                </el-timeline-item>
              </el-timeline>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-box">
            <div class="chart">
              <div class="chart-container">
                <div ref="chart" class="chart"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getHomeNum,
  recordClick
} from "@/api/home";
import {
  formatYMD,
} from "@/api/common";
import * as echarts from 'echarts';
import {commonkey} from "@/utils/common";
import {assign} from "lodash";

export default {
  data() {
    return {
      userId: sessionStorage.getItem(commonkey.adminUserIdKey),
      topBoxes: [],
      recordType: 1,
      reverse: true,
      recordList: [{
        projectName: '1111',
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        projectName: '1111',
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        projectName: '1111',
        content: '创建成功',
        timestamp: '2018-04-11'
      }, {
        projectName: '1111',
        content: '创建成功',
        timestamp: '2018-04-11'
      }, {
        projectName: '1111',
        content: '创建成功',
        timestamp: '2018-04-11'
      }, {
        projectName: '1111',
        content: '创建成功',
        timestamp: '2018-04-11'
      }, {
        projectName: '1111',
        content: '创建成功',
        timestamp: '2018-04-11'
      }, {
        projectName: '1111',
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  mounted() {
    // 初始化图表
    this.initChart()
    this.getHomeNum()
    this.recordClick()
  },
  methods: {
    getHomeNum() {
      let that = this;
      getHomeNum().then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        res.data.forEach(function (item) {
          that.topBoxes.push({title: item.title, num: item.num});
        })
      });
    },
    recordClick() {
      let endTime = formatYMD(new Date());
      let beginTime = formatYMD(new Date(new Date() - (7 * 24 * 3600 * 1000)))
      recordClick(assign({
        type: this.recordType,
        beginTime: beginTime,
        endTime: endTime
      })).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.recordList = res.data;
      });
    },
    initChart() {
      // 使用第三方图表库进行图表绘制
      // 例如：echarts

      let chart = echarts.init(this.$refs.chart)

      // 设置图表配置项
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: [
            '已扫描端口',
            '未扫描端口',
            '已扫描域名',
            '未扫描域名',
          ]
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 64, name: '已扫描端口' },
              { value: 28, name: '未扫描端口', selected: true }
            ]
          },
          {
            name: 'Access From',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: [
              { value: 26, name: '已扫描域名' },
              { value: 24, name: '未扫描域名' },
            ]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表
      chart.setOption(option)
    }
  }
}
</script>

<style scoped>
.big-box {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.big-box-right {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-left: 20px;
}

.box-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.left-box {
  height: 440px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: calc(24% - 10px);
  background-image: linear-gradient(to right bottom, rgb(86, 205, 243), #719de3);
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.box-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: calc(95% - 10px);
  background-color: #f5c4b7;
  background-image: linear-gradient(to right bottom, rgb(239 228 103), rgb(214 204 50));
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.box:hover {
  background-color: #e6e6e6;
}

.title-font {
  font-size: 36px;
  color: #676262;
  padding-bottom: 10px;
}

.box-icon {
  font-size: 36px;
  color: #fff;
}

.box-title {
  font-size: 32px;
  color: #fff;
}

.bottom-section {
  padding-top: 20px;
  background-color: #f5f7fa;
}

.chart-box {
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  padding: 20px;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  height: 400px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-box {
  height: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}


::v-deep .el-tabs__item {
  padding: 0 28px;
  height: 48px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 48px;
  display: inline-block;
  list-style: none;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  position: relative;
}

.el-timeline {
  margin: 20px;
  font-size: 19px;
  font-weight: 550;
  list-style: none;
}

.el-timeline-item {
  position: relative;
  padding-bottom: 12px;
}

::v-deep .el-timeline-item__timestamp.is-top {
  margin-bottom: 10px;
  padding-top: 2px;
}

::v-deep .el-timeline-item__timestamp {
  color: #909399;
  line-height: 1;
  font-size: 18px;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 0px;
}

</style>
