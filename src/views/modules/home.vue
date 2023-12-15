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
                    topUnBoxes[index] ? topUnBoxes[index].title : initUnTitle[index]
                  }}
                </div>
                <div class="box-icon">{{ topUnBoxes[index] ? topUnBoxes[index].num : '0' }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottom-section">
      <el-row>
        <el-col :span="12" style="padding-top: 20px;">
          <div class="left-box">
            <el-row>
              <el-tabs style="margin-top: 10px;margin-left: 10px" v-model="recordType" type="card"
                       @tab-click="recordClick">
                <el-tab-pane label="新增漏洞" name="3"></el-tab-pane>
                <el-tab-pane label="新增域名" name="1"></el-tab-pane>
                <el-tab-pane label="新增端口" name="2"></el-tab-pane>
              </el-tabs>
            </el-row>
            <el-row style="overflow-y: auto;height:355px;">
              <el-timeline :reverse="reverse">
                <el-timeline-item
                    v-for="(activity, index) in recordList"
                    :key="index"
                    placement="top"
                    :timestamp="activity.createTime">
                  <span style="color: #25a3e8">{{ activity.projectName }}</span><br>
                  <span style="color: #d30e0eb0">{{ activity.describe }}</span>
                </el-timeline-item>
              </el-timeline>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6" v-for="(item,value,index) in rankData" :key="index" style="padding-top: 20px;">
          <div class="left-chart-box">
            <div class="rank-title-font">{{ rankTitle['title' + (index + 1)] }}</div>
            <el-row v-for="(it,idx) in rankData['companyRankingList'+(index+1)]" :key="idx" style="margin-top: 10px" v-if="rankData['companyRankingList'+(index+1)]">
              <el-col :span="2">
                <div :class="idx == 0 ? 'one' : idx == 1 ? 'two' : idx == 2 ? 'three' : 'four'"></div>
              </el-col>
              <el-col :span="18">
                <el-tooltip class="item" effect="dark" :content="it.type" placement="top-start">
                  <div class="rank-data" @click="rankClick(it.type)">
                    {{ it.sType }}
                  </div>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <div class="rank-data">
                  {{ it.value }}
                </div>
              </el-col>
            </el-row>
            <el-row class="no-data" v-if="rankData['companyRankingList'+(index+1)].length == 0">
                暂无数据
            </el-row>
          </div>
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
  getUnHomeNum,
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
      topUnBoxes: [],
      initTitle: ["项目", "企业", "主域名", "子域名", "IP", "端口", "网站", "漏洞", "主域名已收集", "IP已扫描", "主域名收集", "IP扫描"],
      initUnTitle: ["主域名收集", "IP扫描"],
      recordType: "1",
      reverse: true,
      recordList: [],
      addOrUpdateVisible: false, // 弹窗visible状态
      title: '',
      rankData: {},
      rankTitle: {}
    }
  },
  components: {
    AddOrUpdate,
  },
  mounted() {
    this.getHomeNum()
    this.getUnHomeNum()
    this.recordClick()
    this.companyRanking()
  },
  methods: {
    getHomeNum() {
      let that = this;
      for (let i = 1; i < 11; i++) {
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
    getUnHomeNum() {
      let that = this;
      getUnHomeNum(assign()).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        that.topUnBoxes = res.data
        this.$forceUpdate()
      });
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
    rankClick(tag) {
      this.$router.replace({
        name: "scan-assets",
        params: {type: 2, tagValue: tag}
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
    companyRanking() {
      for (let i = 1; i <= 6; i++) {
        companyRanking(assign({
          type: i,
          limit: 10
        })).then(({data: res}) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          let data = [];
          if (!isBlank(res.data)) {
            res.data.forEach(function (item) {
              if (item.type.length > 10) {
                let i = item.type.length > 10 ? 10 : item.type.length
                item.sType = item.type.substr(0, i) + '...'
              } else {
                item.sType = item.type;
              }
            })
            data = res.data;
          }
          this.rankData['companyRankingList' + i] = data
          if (i == 1) {
            this.rankTitle['title' + i] = '企业主域名排行';
          }
          if (i == 2) {
            this.rankTitle['title' + i] = '企业子域名排行';
          }
          if (i == 3) {
            this.rankTitle['title' + i] = '企业IP排行';
          }
          if (i == 4) {
            this.rankTitle['title' + i] = '企业端口排行';
          }
          if (i == 5) {
            this.rankTitle['title' + i] = '企业服务排行';
          }
          if (i == 6) {
            this.rankTitle['title' + i] = '企业cms排行';
          }
          this.$forceUpdate()
        });
      }
      console.log(this.rankData)
    },
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

.rank-title-font {
  text-align: center;
  font-size: 26px;
  font-weight: 600;
}

.rank-data {
  color: cornflowerblue;
  font-size: x-large;
  cursor: pointer;
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
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  height: 440px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: relative;
}

.no-data {
  font-size: 35px;
  color: #999595;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
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

.one {
  type: flex;
  justify: center;
  align: middle;
  width: 22px;
  height: 22px;
  background-color: rgba(229, 87, 87, 1);
  border-radius: 50%;
}

.two {
  type: flex;
  justify: center;
  align: middle;
  width: 22px;
  height: 22px;
  background-color: rgba(253, 148, 55, 1);
  border-radius: 50%;
}

.three {
  type: flex;
  justify: center;
  align: middle;
  width: 22px;
  height: 22px;
  background-color: rgba(83, 169, 240, 0.79);
  border-radius: 50%;
}

.four {
  type: flex;
  justify: center;
  align: middle;
  width: 22px;
  height: 22px;
  background-color: rgba(0, 200, 200, 0.3);
  border-radius: 50%;
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
