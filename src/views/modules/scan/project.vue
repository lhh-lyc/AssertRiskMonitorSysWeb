<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
      >
        <el-form-item label="项目名称">
          <el-input
              v-model="dataForm.name"
              placeholder="项目名称"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="扫描进度">
          <el-select
              v-model="dataForm.isCompleted"
              placeholder="请选择"
          >
            <el-option
                label="全部"
                value=""
            ></el-option>
            <el-option
                label="扫描中"
                value="0"
            ></el-option>
            <el-option
                label="扫描完成"
                value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()">{{
              $t("query")
            }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addOrUpdateHandle()"
          >{{ $t("add") }}
          </el-button
          >
        </el-form-item>
      </el-form>
      <div v-if="dataList.length == 0" style="height: 590px;display: flex;justify-content: center;align-items: center;">
        <span style="color: #9f9d9d;font-size: xxx-large;">暂无数据</span>
      </div>
      <div v-if="dataList.length != 0" style="height: 590px;overflow: hidden;overflow-y: auto;">
        <el-row v-for="(item, index) in dataList" :key="item.id" v-if="index%2==0">
          <el-col :span="12">
            <div class="grid-content project-col" @click="showPointList(item.id)">
              <div class="p-name">
                <span>{{ item.name }}</span>
                <i style="float: right;" class="el-icon-delete" @click.stop="deleteHandle(item.id)"></i>
                <i style="float: right;" class="el-icon-edit" @click.stop="addOrUpdateHandle(item.id)"></i>
              </div>
              <div class="p-desc">
                <el-row :gutter="20">
                  <el-col :span="4" v-if="item.isCompleted == 0">
                    <div class="desc-header" style="color: green">扫描中</div>
                  </el-col>
                  <el-col :span="4" v-if="item.isCompleted == 1">
                    <div class="desc-header" style="color: blue">扫描完成</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">资产总数</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">已扫描资产</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="desc-header">创建时间</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="4">
                    <div class="desc-content">
                      <Icon name="Mouse-alt" class="scanning"/>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-content">{{ item.portNum }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-content">{{ item.portNum }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="desc-content">{{ item.createTime }}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="4">
                    <div class="desc-header">高危<span style="color: #ff5454">&nbsp;&nbsp;0</span></div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">中危<span style="color: #cfb100">&nbsp;&nbsp;0</span></div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">低危<span style="color: #c0bcbc">&nbsp;&nbsp;0</span></div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="12" v-if="index+1 < dataList.length">
            <div class="grid-content project-col" @click="showPointList(item.id)">
              <div class="p-name">
                <span>{{ dataList[index + 1].name }}</span>
                <i style="float: right;" class="el-icon-delete" @click.stop="deleteHandle(dataList[index + 1].id)"></i>
                <i style="float: right;" class="el-icon-edit"
                   @click.stop="addOrUpdateHandle(dataList[index + 1].id)"></i>
              </div>
              <div class="p-desc">
                <el-row :gutter="20">
                  <el-col :span="4" v-if="dataList[index+1].isCompleted == 0">
                    <div class="desc-header" style="color: green">扫描中</div>
                  </el-col>
                  <el-col :span="4" v-if="dataList[index+1].isCompleted == 1">
                    <div class="desc-header" style="color: blue">扫描完成</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">资产总数</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">已扫描资产</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="desc-header">创建时间</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="4">
                    <div class="desc-content">
                      <Icon name="Mouse-alt" class="scanning"/>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-content">{{ dataList[index + 1].portNum }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-content">{{ dataList[index + 1].portNum }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="desc-content">{{ dataList[index + 1].createTime }}</div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-col :span="4">
                    </el-col>
                    <div class="desc-header">高危<span style="color: #ff5454">&nbsp;&nbsp;0</span></div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">中危<span style="color: #cfb100">&nbsp;&nbsp;0</span></div>
                  </el-col>
                  <el-col :span="4">
                    <div class="desc-header">低危<span style="color: #c0bcbc">&nbsp;&nbsp;0</span></div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
          v-if="addOrUpdateVisible"
          ref="addOrUpdate"
          @refreshDataList="getDataList"
      ></add-or-update>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./project-add-or-update";
import {addDynamicRoute} from "@/router";
import {assign} from "_lodash@4.17.21@lodash";
import {
  page
} from "@/api/scan/project";

export default {
  data() {
    return {
      // 默认属性
      dataForm: {
        unitId: "",
        name: "",
        isCompleted: ''
      }, // 查询条件
      dataList: [], // 数据列表
      order: "", // 排序，asc／desc
      orderField: "", // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
      addOrUpdateVisible: false, // 新增／更新，弹窗visible状态
    };
  },
  components: {
    AddOrUpdate,
  },
  mounted() {
    let that = this;
    that.getDataList();
    setInterval(function () {
      that.query();
    }, 10000);
  },
  methods: {
    // 子级
    childHandle(row) {
      // 路由参数
      const routeParams = {
        routeName: `${this.$route.name}__${row.id}`,
        title: `${this.$route.meta.title} - ${row.dictType}`,
        path: "sys/dict-data",
        params: {
          dictTypeId: row.id,
        },
      };
      // 动态路由
      addDynamicRoute(routeParams, this.$router);
    },
    // 获取列表信息
    query() {
      page(assign({
        page: this.page,
        limit: this.limit,
        name: this.dataForm.name,
        isCompleted: this.dataForm.isCompleted
      })).then(({data: res}) => {
        if (res.code != 200) {
          this.dataList = [];
          this.total = 0;
          return this.$message.error(res.msg);
        }
        this.dataList = res.data.records || [];
        this.total = res.data.total || 0;
      }).catch(() => {});
    },
    showPointList(projectId) {
      this.$router.replace({
        name: "scan-assets",
        params: {type: 1, tagValue: projectId}
      });
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.query();
    },
    getDataList: function () {
      this.page = 1;
      this.query();
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.unitId = id;
        this.$refs.addOrUpdate.init();
      });
    },
    // 删除
    deleteHandle(id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t("prompt.deleteBatch"),
          type: "warning",
          duration: 500,
        });
      }
      this.$confirm(
          this.$t("prompt.info", {handle: this.$t("delete")}),
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
      )
          .then(() => {
            this.$http
                .post("/scan/project/delete", [id], {emulateJSON: true})
                .then(({data: res}) => {
                  if (res.code != 200) {
                    return this.$message.error(res.msg);
                  }
                  this.$message({
                    message: this.$t("prompt.success"),
                    type: "success",
                    duration: 500,
                    onClose: () => {
                      this.getDataList();
                    },
                  });
                })
                .catch(() => {
                });
          })
          .catch(() => {
          });
    },
    // 删除多个  deleteHandleAll
    deleteHandleAll() {
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t("prompt.deleteBatch"),
          type: "warning",
          duration: 500,
        });
      }
      let arr = [];
      this.dataListSelections.forEach(function (item) {
        if (item.unitId) {
          arr.push(item.unitId);
        }
      });
      this.$confirm(
          this.$t("prompt.info", {handle: this.$t("delete")}),
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
      )
          .then(() => {
            this.$http
                .post("/cm/unit/delete", arr, {emulateJSON: true})
                .then(({data: res}) => {
                  if (res.code != 200) {
                    return this.$message.error(res.msg);
                  }
                  this.$message({
                    message: this.$t("prompt.success"),
                    type: "success",
                    duration: 500,
                    onClose: () => {
                      this.getDataList();
                    },
                  });
                })
                .catch(() => {
                });
          })
          .catch(() => {
          });
    },
  },
};

</script>
<style lang="scss" scoped>
.unitname {
  color: #189f92;
  cursor: pointer;
}

.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid #dbd9d9;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.project-col {
  //height: 70px;
  margin: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to right bottom, rgb(248 253 255), #edf4ff);
}

.p-name {
  padding: 10px;
  font-size: 24px;
  font-weight: 600;
  margin-left: 15px;
}

.p-desc {
  margin-left: 10px;
}

.desc-header {
  padding: 10px;
  font-size: 17px;
  font-weight: 600;
}

.desc-content {
  padding: 10px;
  font-size: 14px;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 0px;
}

</style>
