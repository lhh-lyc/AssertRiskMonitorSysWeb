<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form
          label-width="67px"
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-form-item label="项目" label-width="80px">
            <el-select v-model="q.projectId" filterable placeholder="请选择" clearable style="width: 200px">
              <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click.native="getProjectName(item.name)" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主域名" label-width="80px">
            <el-input
                v-model="q.domain"
                placeholder="主域名"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="子域名" label-width="80px">
            <el-input
                v-model="q.subDomain"
                placeholder="子域名"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="漏洞名称" label-width="80px">
            <el-input
                v-model="q.name"
                placeholder="漏洞名称"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 54px;">
            <el-button icon="el-icon-search" @click="getDataList()">{{
                $t("query")
              }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$hasPermission('scan:hole:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                icon="el-icon-download"
                @click="exportFile()"
            >{{ $t("export") }}
            </el-button
            >
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="漏洞级别" label-width="80px">
            <el-select v-model="q.level" filterable placeholder="请选择" clearable style="width: 200px">
              <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.code"
                  :value="item.value"
                  @click.native="getLevelName(item.code)" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求路径" label-width="80px">
            <el-input
                v-model="q.url"
                placeholder="请求路径"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="扫描工具" label-width="80px">
            <el-select v-model="q.toolType" filterable placeholder="请选择" clearable style="width: 200px">
              <el-option
                  v-for="item in toolList"
                  :key="item.value"
                  :label="item.code"
                  :value="item.value"
                  @click.native="getToolName(item.code)" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="漏洞状态" label-width="80px">
            <el-select v-model="q.status" filterable placeholder="请选择" clearable style="width: 200px">
              <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.code"
                  :value="item.value"
                  @click.native="getStatusName(item.code)" >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          :row-key="getRowKeys"
          style="width: 100%"
      >
        <el-table-column type="selection" :reserve-selection="true" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scop">
            {{ showId + scop.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户"
            header-align="center"
            align="center"
            v-if="isAdmin==1"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="projectName"
            label="项目"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="domain"
            label="主域名"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="subDomain"
            label="子域名"
            header-align="center"
            align="center"
            width="200"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="漏洞名称">
          <template slot-scope="{ row }">
            <span v-if="row.name">
              <el-popover placement="top-start" width="50" trigger="hover">
               <div>{{ row.name }}</div>
                 <span slot="reference">
                    {{ row.name }}
                 </span>
             </el-popover>
           </span>
          </template>
        </el-table-column>
        <el-table-column
            prop="levelName"
            label="漏洞等级"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="protocol"
            label="协议"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="请求路径">
          <template slot-scope="{ row }">
            <span v-if="row.url">
              <el-popover placement="top-start" width="500" trigger="hover">
               <div>{{ row.url }}</div>
                 <span slot="reference">
                    {{ row.url }}
                 </span>
             </el-popover>
           </span>
          </template>
        </el-table-column>
        <el-table-column label="请求信息">
          <template slot-scope="{ row }">
            <span v-if="row.info">
              <el-popover placement="top-start" width="500" trigger="hover">
               <div>{{ row.info }}</div>
                 <span slot="reference">
                    {{ row.info }}
                 </span>
             </el-popover>
           </span>
          </template>
        </el-table-column>
        <el-table-column
            prop="toolTypeName"
            label="使用工具"
            header-align="center"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="statusName"
            label="状态"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div :style="{'color':scope.row.status == 1 ? 'red': scope.row.status == 2 ? '#34d04a' : '#a5861c'}">
              {{ scope.row.statusName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="扫描时间"
            header-align="center"
            align="center"
            width="160"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            :label="$t('handle')"
            fixed="right"
            header-align="center"
            align="center"
            width="150"
        >
          <template slot-scope="scope">
            <el-button
                v-show="scope.row.status == 2"
                type="text"
                size="small"
                @click="wrongMark(scope.row)"
            >{{ $t("wrongMark") }}
            </el-button>
            <el-button
                type="text"
                size="small"
                @click="deleteHandle(scope.row.id)"
            >{{ $t("delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100, 1000, 10000]"
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
      <!-- 弹窗, 新增 / 修改 -->
      <delete-batch
          v-if="deleteVisible"
          ref="deleteBatch"
      ></delete-batch>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./hole-add-or-update";
import {addDynamicRoute} from "@/router";
import {
  page, exportFile
} from "@/api/scan/hole";
import {
  projectList
} from "@/api/scan/project";
import {
  dictListByType
} from "@/api/sys/dict";
import {assign} from "_lodash@4.17.21@lodash";
import {commonkey, isBlank} from "@/utils/common";

export default {
  data() {
    return {
      // 默认属性
      q: {
        name: '',
        url: '',
        projectId: '',
        company: '',
        domain: '',
        subDomain: '',
        status: '',
        toolType: '',
        level: '',
      },
      projectName: '',
      levelName: '',
      toolName: '',
      statusName: '',
      showId: '',
      queryType: '',
      moreQueryFlag: false,
      dataForm: {
        unitId: "",
        unitCode: "",
      }, // 查询条件
      dataList: [], // 数据列表
      projectList: [],
      levelList: [],
      toolList: [],
      statusList: [],
      order: "", // 排序，asc／desc
      orderField: "", // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
      addOrUpdateVisible: false, // 新增／更新，弹窗visible状态
      deleteVisible: false,
      options: [], // 企业名称列表
      showFiles: false, // 是否显示附件弹框页
      isAdmin: sessionStorage.getItem(commonkey.isAdminKey)
    };
  },
  components: {
    AddOrUpdate,
  },
  mounted() {
    this.getDataList();
    this.getProjectList();
    this.getLevelList();
    this.getToolList();
    this.getStatusList();
  },
  methods: {
    getProjectName(name){
      this.projectName = name;
    },
    getLevelName(name){
      this.levelName = name;
    },
    getToolName(name){
      this.toolName = name;
    },
    getStatusName(name){
      this.statusName = name;
    },
    // 点击企业名称
    clickName(unitId) {
      if (unitId) {
        this.showFiles = true;
      }
    },
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
        projectId: this.q.projectId,
        domain: this.q.domain.trim(),
        subDomain: this.q.subDomain.trim(),
        status: this.q.status,
        toolType: this.q.toolType,
        level: this.q.level,
        name: this.q.name.trim(),
        url: this.q.url.trim(),
      })).then(({data: res}) => {
        if (res.code != 200) {
          this.dataList = [];
          this.total = 0;
          return this.$message.error(res.msg);
        }
        this.dataList = res.data.records || [];
        this.total = res.data.total || 0;
        this.showId = res.data.size * (res.data.current - 1);
      }).catch(() => {
      });
    },
    // 获取列表信息
    getProjectList() {
      projectList(assign({})).then(({data: res}) => {
        if (res.code != 200) {
          this.projectList = [];
          return this.$message.error(res.msg);
        }
        this.projectList = res.data || [];
      }).catch(() => {
      });
    },
    getLevelList() {
      dictListByType(assign({
        type: "hole_level"
      })).then(({data: res}) => {
        if (res.code != 200) {
          this.levelList = [];
          return this.$message.error(res.msg);
        }
        this.levelList = res.data || [];
      }).catch(() => {
      });
    },
    getToolList() {
      dictListByType(assign({
        type: "scan_tool_type"
      })).then(({data: res}) => {
        if (res.code != 200) {
          this.toolList = [];
          return this.$message.error(res.msg);
        }
        this.toolList = res.data || [];
      }).catch(() => {
      });
    },
    getStatusList() {
      dictListByType(assign({
        type: "hole_status"
      })).then(({data: res}) => {
        if (res.code != 200) {
          this.statusList = [];
          return this.$message.error(res.msg);
        }
        this.statusList = res.data || [];
      }).catch(() => {
      });
    },
    moreQuery: function () {
      this.moreQueryFlag = !this.moreQueryFlag;
    },
    exportFile: function () {
      let fileName = '漏洞资产';
      let tmpNameList = [];
      tmpNameList.push(this.projectName);
      tmpNameList.push(this.q.company);
      tmpNameList.push(this.q.domain);
      tmpNameList.push(this.q.subDomain);
      tmpNameList.push(this.levelName);
      tmpNameList.push(this.q.url);
      tmpNameList.push(this.toolName);
      tmpNameList.push(this.statusName);
      tmpNameList = tmpNameList.filter(item=>item);
      if (tmpNameList != null && tmpNameList.length != 0){
        let tmpName = tmpNameList.join('_');
        fileName += '(' + tmpName + ')';
      }
      exportFile(assign({
        page: this.page,
        limit: this.limit,
        projectId: this.q.projectId,
        company: this.q.company,
        domain: this.q.domain,
        subDomain: this.q.subDomain,
        status: this.q.status,
        toolType: this.q.toolType,
        level: this.q.level,
        filename: fileName
      })).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
      }).catch(() => {
      });
    },
    downLoadModule() {
      let file = "./static/module.xls";
      let domA = document.createElement('a'); // js创建a标签
      domA.setAttribute('download', ''); // 给a标签设置download属性
      domA.setAttribute('href', file); // 给a标签href属性赋值为要下载文件的路径
      domA.click(); // 点击下载
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    getRowKeys(row) {
      return row.id;
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
    // 误报标记
    wrongMark(row) {
      debugger
      this.$confirm(
          "确定将此条数据标记为误报吗？",
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
      ).then(() => {
        // 误报状态
        row.status = 3;
        let url = "/scan/security/hole/update";
        this.$http
            .post(url, row, {emulateJSON: true})
            .then(({data: res}) => {
              if (res.code != 200) {
                return this.$message.error(res.msg);
              }
              this.$message({
                message: this.$t("prompt.success"),
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  this.getDataList();
                },
              });
            })
            .catch(() => {
            });
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => item["id"])
      this.$confirm(
          this.$t("prompt.info", {handle: this.$t("delete")}),
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
      ).then(() => {
            this.$http
                .post("/scan/security/hole/delete", ids, {emulateJSON: true})
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
      this.deleteVisible = true;
      this.$nextTick(() => {
        this.$refs.deleteBatch.page = 1;
        this.$refs.deleteBatch.limit = 10;
        this.$refs.deleteBatch.type = 1;
        this.$refs.deleteBatch.doType = 1;
        this.$refs.deleteBatch.init();
      });
    },
    // 即时扫描
    reScan() {
      this.deleteVisible = true;
      this.$nextTick(() => {
        this.$refs.deleteBatch.page = 1;
        this.$refs.deleteBatch.limit = 10;
        this.$refs.deleteBatch.type = 1;
        this.$refs.deleteBatch.doType = 2;
        this.$refs.deleteBatch.init();
      });
    },

  },
};
</script>
<style lang="scss">

.el-input {
  width: 200px;
}

.el-table .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}

</style>
