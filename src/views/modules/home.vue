<template xmlns="http://www.w3.org/1999/html">
  <div class="home-page">
    <div class="top-section">
      <el-row>
        <el-col :span="18">
          <div class="big-box">
            <div class="title-font">已发现</div>
            <div class="box-row">
              <div class="box" v-for="(item,index) in 4" :key="index" @click="showList(index+1)">
                <div class="box-title">{{ topBoxes[index] ? topBoxes[index].title : initTitle[index] }}</div>
                <div class="box-icon">{{ topBoxes[index] ? topBoxes[index].num : '0' }}</div>
              </div>
            </div>
            <div class="box-row">
              <div class="box" v-for="(item,index) in 4" :key="index" @click="showList(index+5)">
                <div class="box-title">{{
                    topBoxes[index + 4] ? topBoxes[index + 4].title : initTitle[index + 4]
                  }}
                </div>
                <div class="box-icon">{{ topBoxes[index + 4] ? topBoxes[index + 4].num : '0' }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="big-box-right">
            <div class="title-font">待执行</div>
            <div class="box-row" v-for="(item,index) in 2" :key="index">
              <div class="box-right">
                <div class="box-title">{{
                    topBoxes[index + 10] ? topBoxes[index + 10].title : initTitle[index + 10]
                  }}
                </div>
                <div class="box-icon">{{ topBoxes[index + 10] ? topBoxes[index + 10].num : '0' }}</div>
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
          <el-col :span="12">
            <div class="chart-box left-chart-box">
              <div class="chart">
                <div class="chart-container">
                  <div ref="chart1" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-box right-chart-box">
              <div class="chart">
                <div class="chart-container">
                  <div ref="chart2" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="next-row">
        <el-col :span="12">
          <el-col :span="12">
            <div class="chart-box left-chart-box">
              <div class="chart">
                <div class="chart-container">
                  <div ref="chart3" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-box right-chart-box">
              <div class="chart">
                <div class="chart-container">
                  <div ref="chart4" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="12">
            <div class="chart-box left-chart-box">
              <div class="chart">
                <div class="chart-container">
                  <div ref="chart5" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-box right-chart-box">
              <div class="chart">
                <div class="chart-container">
                  <div ref="chart6" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getHomeNum"
    ></add-or-update>
  </div>
</template>

<script>
import {
  getHomeNum,
  recordClick,
  companyRanking
} from "@/api/home";
import AddOrUpdate from "./home-comyany-list";
import {
  formatYMD,
} from "@/api/common";
import * as echarts from 'echarts';
import {commonkey, isBlank} from "@/utils/common";
import {assign} from "lodash";
import request from '@/utils/request'

export default {
  data() {
    return {
      userId: sessionStorage.getItem(commonkey.adminUserIdKey),
      topBoxes: [],
      initTitle: ["项目", "企业", "主域名", "子域名", "IP", "端口", "网站", "漏洞", "主域名已收集", "IP已扫描", "主域名收集", "IP扫描"],
      recordType: "1",
      reverse: true,
      recordList: [],
      addOrUpdateVisible: false, // 弹窗visible状态
      companyRankingList: []
    }
  },
  components: {
    AddOrUpdate,
  },
  mounted() {
    this.getHomeNum()
    this.recordClick()
    this.companyRanking()
    this.initChart()
  },
  methods: {
    getHomeNum() {
      let that = this;
      for (let i = 1; i < 13; i++) {
        getHomeNum(assign({
          type: i
        })).then(({data: res}) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          const index = res.data.type - 1
          that.topBoxes[index] = res.data
          this.$forceUpdate()
        });
      }
    },
    showList(type) {
      let typeList = [1, 2, 3, 4, 5, 6, 7];
      if (typeList.indexOf(type) != -1) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.page = 1;
          this.$refs.addOrUpdate.limit = 10;
          this.$refs.addOrUpdate.dataForm.type = type;
          this.$refs.addOrUpdate.init();
        });
      }
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
    companyRanking() {
      for (let i = 1; i <= 6; i++) {
        companyRanking(assign({
          type: i
        })).then(({data: res}) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          const index = i
          let ydata = [];
          let xdata = [];
          if (!isBlank(res.data)) {
            res.data.forEach(function(item) {
              ydata.push(item.type);
              xdata.push(item.value);
            })
          }
          let title = '';
          if (i == 1) {
            title = '企业主域名排行';
          }
          if (i == 2) {
            title = '企业子域名排行';
          }
          if (i == 3) {
            title = '企业IP排行';
          }
          if (i == 4) {
            title = '企业端口排行';
          }
          if (i == 5) {
            title = '企业网站排行';
          }
          if (i == 6) {
            title = '企业漏洞排行';
          }
          this.drawChart(index, xdata, ydata, title)
          this.$forceUpdate()
        });
      }
    },
    initChart() {
      // 使用第三方图表库进行图表绘制
      // 例如：echarts
      for (let i = 1; i <= 6; i++) {
        let chartNumber = i;
        let title = '';
        if (i == 1) {
          title = '企业主域名排行';
        }
        if (i == 2) {
          title = '企业子域名排行';
        }
        if (i == 3) {
          title = '企业IP排行';
        }
        if (i == 4) {
          title = '企业端口排行';
        }
        if (i == 5) {
          title = '企业网站排行';
        }
        if (i == 6) {
          title = '企业漏洞排行';
        }
        let ydata = [];
        let xdata = [];
        // let ydata = ['上海', '北京', '深圳', '天津', '河南', '新疆', '澳门'];
        // let xdata = [12, 13, 14, 15, 16, 17, 18];
        this.drawChart(chartNumber, xdata, ydata, title)
      }
    },
    drawChart(chartNumber, xdata, ydata, title){
      const chartRefName = `chart${chartNumber}`;
      const chartRef = this.$refs[chartRefName];
      let chart = echarts.init(chartRef)
      let option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "80",
          right: "20",
          bottom: "20",
          top: "20",
          containLabel: false,
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          data: ydata,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            margin: 70,
            align: "left",
            overflow: "truncate",
            formatter: function (value, index) {
              if (value.length>3) {
                value = value.substr(0,3)+'...'
              }
              let ind = index + 1;
              if (ind == ydata.length) {
                return "{one|" + (ydata.length - index) + "} {a|" + value + "}";
              } else if (ind + 1 == ydata.length) {
                return "{two|" + (ydata.length - index) + "} {b|" + value + "}";
              } else if (ind + 2 == ydata.length) {
                return (
                    "{three|" + (ydata.length - index) + "} {c|" + value + "}"
                );
              }
              if (ydata.length - index > 9) {
                return (
                    "{five|" + (ydata.length - index) + "} {d|" + value + "}"
                );
              }
              return "{four|" + (ydata.length - index) + "} {d|" + value + "}";
            },
            rich: {
              a: {
                color: "#59c9f9",
              },
              b: {
                color: "#59c9f9",
              },
              c: {
                color: "#59c9f9",
              },
              d: {
                color: "#59c9f9",
              },
              // 第一名
              one: {
                backgroundColor: "#E86452",
                color: "white",
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11,
              },
              // 第二名
              two: {
                backgroundColor: "#FF9845",
                color: "white",
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11,
              },
              // 第三名
              three: {
                backgroundColor: "#F6BD16",
                color: "white",
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11,
              },
              // 一位数
              four: {
                backgroundColor: "rgba(0,0,0,0.15)",
                color: "white",
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11,
              },
              // 两位数
              five: {
                backgroundColor: "rgba(0,0,0,0.15)",
                color: "white",
                width: 16,
                height: 16,
                padding: [1, 0, 0, 1],
                borderRadius: 10,
                fontSize: 11,
              },
            },
          },
        },
        series: [{
          type: "bar",
          showBackground: true,
          label: {
            show: true,
            position: "right",
            color: "rgba(0,0,0,0.45)",
          },
          barWidth: 20,
          itemStyle: {
            color: "#5B8FF9",
          },
          data: xdata,
        },],
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
}

.left-chart-box {
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.right-chart-box {
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  height: 440px;
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

.next-row {
  margin-top: 20px;
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
