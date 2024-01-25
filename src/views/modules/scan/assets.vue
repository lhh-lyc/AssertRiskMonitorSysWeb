<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form
          label-width="67px"
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="initDataList()"
      >
        <el-row>
          <el-form-item prop="roleIdList" label="项目">
            <el-select v-model="q.projectId" filterable placeholder="请选择" clearable style="width: 200px">
              <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click.native="getProjectName(item.name)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司">
            <el-input
                v-model="q.company"
                placeholder="公司"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="主域名">
            <el-input
                v-model="q.parentDomain"
                placeholder="主域名"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="子域名">
            <el-input
                v-model="q.domain"
                placeholder="子域名"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 54px;">
            <el-button icon="el-icon-search" @click="clickQuery()">{{
                $t("query")
              }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                icon="el-icon-delete"
                @click="deleteHandleAll()"
            >{{ $t("deleteBatch") }}
            </el-button
            >
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
          <el-form-item>
            <el-button icon="el-icon-sort" @click="moreQuery()">{{
                $t("moreQuery")
              }}
            </el-button>
          </el-form-item>
        </el-row>
        <el-row v-if="moreQueryFlag">
          <el-form-item label="IP">
            <el-input
                v-model="q.ip"
                placeholder="IP"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-input
                v-model="q.port"
                placeholder="端口"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="服务">
            <el-input
                v-model="q.serverName"
                placeholder="服务"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="URL">
            <el-input
                v-model="q.url"
                placeholder="URL"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 54px;">
            <el-button
                type="primary"
                @click="reScan()"
            >{{ $t("reScan") }}
            </el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
                v-if="isAdmin==1"
                type="primary"
                icon="el-icon-download"
                @click="downLoadModule()"
            >{{ $t("downLoadModule") }}
            </el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
                v-if="isAdmin==1"
                id="upFlle"
                type="primary"
                icon="el-icon-upload2"
                @click="uploadModule()"
            >{{ $t("uploadModule") }}
            </el-button
            >
          </el-form-item>
        </el-row>
        <el-row v-if="moreQueryFlag">
          <el-form-item label="cms">
            <el-input
                v-model="q.cms"
                placeholder="cms"
                clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Title">
            <el-input
                v-model="q.title"
                placeholder="Title"
                clearable
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          style="width: 100%"
      >
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
            prop="company"
            label="公司"
            header-align="center"
            align="center"
            width="250"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="parentDomain"
            label="主域名"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="domain"
            label="子域名"
            header-align="center"
            align="center"
            width="200"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="ip"
            label="IP"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="port"
            label="端口"
            header-align="center"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="serverName"
            label="服务"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="url"
            label="URL"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="cms"
            label="cms"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="title"
            label="Title"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
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
            <!--            <el-button
                            v-if="$hasPermission('cm:unit:update')"
                            type="text"
                            size="small"
                            @click="addOrUpdateHandle(scope.row.unitId)"
                        >{{ $t("update") }}
                        </el-button
                        >-->
            <el-button
                v-if="$hasPermission('cm:unit:delete') && scope.row.ip != '-' && scope.row.ip != '-'"
                type="text"
                size="small"
                @click="deleteHandle(scope.row)"
            >{{ $t("delete") }}
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
      <!-- 弹窗, 新增 / 修改 -->
      <delete-batch
          v-if="deleteVisible"
          ref="deleteBatch"
      ></delete-batch>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./assets-add-or-update";
import deleteBatch from "./assets-delete-list";
import {addDynamicRoute} from "@/router";
import {
  page, exportFile, exportFile2, del
} from "@/api/scan/port";
import {
  projectList
} from "@/api/scan/project";
import {assign} from "_lodash@4.17.21@lodash";
import {commonkey, isBlank} from "@/utils/common";

export default {
  data() {
    return {
      // 默认属性
      q: {
        projectId: '',
        company: '',
        parentDomain: '',
        domain: '',
        ip: '',
        port: '',
        serverName: '',
        url: '',
        cms: '',
        title: '',
      },
      projectName: '',
      showId: '',
      queryType: '',
      moreQueryFlag: false,
      dataForm: {
        unitId: "",
        unitCode: "",
      }, // 查询条件
      dataList: [], // 数据列表
      projectList: [],
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
    deleteBatch
  },
  mounted() {
    this.queryType = this.$route.params.type;
    let tagValue = this.$route.params.tagValue;
    if (!isBlank(this.queryType)) {
      if (this.queryType == 1) {
        this.q.projectId = parseInt(tagValue);
      }
      if (this.queryType == 2) {
        this.q.company = tagValue;
      }
      if (this.queryType == 3) {
        this.q.parentDomain = tagValue;
      }
      if (this.queryType == 4) {
        this.q.domain = tagValue;
      }
      if (this.queryType == 5) {
        this.q.ip = tagValue;
      }
      if (this.queryType == 6) {
        let arr = tagValue.split(":");
        this.q.ip = arr[0];
        this.q.port = arr[1];
      }
    }
    this.initDataList();
  },
  methods: {
    getProjectName(name){
      this.projectName = name;
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
    clickQuery() {
      this.page = 1;
      if (!isBlank(this.q.ip)) {
        let ipArr = this.q.ip.split(".");
        if (ipArr.length<4) {
          return this.$message.warning("请输入正确格式的ip！");
        }
      }
      this.query();
    },
    // 获取列表信息
    query() {
      page(assign({
        page: this.page,
        limit: this.limit,
        projectId: this.q.projectId,
        company: this.q.company.trim(),
        parentDomain: this.q.parentDomain.trim(),
        domain: this.q.domain.trim(),
        ip: this.q.ip.trim(),
        port: this.q.port.trim(),
        serverName: this.q.serverName.trim(),
        url: this.q.url.trim(),
        cms: this.q.cms.trim(),
        title: this.q.title.trim(),
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
        if (this.projectList != null && this.projectList.length != 0) {
          this.q.projectId = this.projectList[0].id
        }
        this.query();
      }).catch(() => {
      });
    },
    moreQuery: function () {
      this.moreQueryFlag = !this.moreQueryFlag;
    },
    exportFile: function () {
      let fileName = '端口资产';
      let tmpNameList = [];
      tmpNameList.push(this.projectName);
      tmpNameList.push(this.q.company);
      tmpNameList.push(this.q.parentDomain);
      tmpNameList.push(this.q.domain);
      tmpNameList.push(this.q.ip);
      tmpNameList.push(this.q.port);
      tmpNameList.push(this.q.serverName);
      tmpNameList.push(this.q.url);
      tmpNameList.push(this.q.cms);
      tmpNameList.push(this.q.title);
      tmpNameList = tmpNameList.filter(item=>item);
      if (tmpNameList != null && tmpNameList.length != 0){
        let tmpName = tmpNameList.join('_');
        fileName += '(' + tmpName + ')';
      }
      exportFile2(assign({
        page: this.page,
        limit: this.limit,
        projectId: this.q.projectId,
        company: this.q.company,
        parentDomain: this.q.parentDomain,
        domain: this.q.domain,
        ip: this.q.ip,
        port: this.q.port,
        serverName: this.q.serverName,
        url: this.q.url,
        cms: this.q.cms,
        title: this.q.title,
        filename: fileName
      })).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
      }).catch(() => {
      });
      /*exportFile(assign({
        page: this.page,
        limit: this.limit,
        projectId: this.q.projectId,
        company: this.q.company,
        parentDomain: this.q.parentDomain,
        domain: this.q.domain,
        ip: this.q.ip,
        port: this.q.port,
        serverName: this.q.serverName,
        url: this.q.url,
        cms: this.q.cms,
        title: this.q.title,
        filename: '用户资产'
      })).then(({data: res}) => {
        const objectUrl = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
        )
        const link = document.createElement('a')
        // 设置导出的文件名称
        link.download = `用户资产` + '.xlsx'
        link.style.display = 'none'
        link.href = objectUrl
        link.click()
        document.body.appendChild(link)
      }).catch(() => {
      });*/
    },
    downLoadModule() {
      let file = "./static/module.xls";
      let domA = document.createElement('a'); // js创建a标签
      domA.setAttribute('download', ''); // 给a标签设置download属性
      domA.setAttribute('href', file); // 给a标签href属性赋值为要下载文件的路径
      domA.click(); // 点击下载
    },
    uploadModule() {
      const _this = this;
      const fileType = ['xls', 'xlsx']
      const inputFile = document.createElement("input")
      inputFile.type = "file"
      inputFile.style.display = "none"
      document.body.appendChild(inputFile)
      inputFile.click()
      inputFile.addEventListener("change", function () {
        const file = inputFile.files[0];
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (!fileType.includes(testmsg)) {
          _this.$message.warning("上传的文件格式只能是,xls,xlsx");
          document.body.removeChild(inputFile);
          return false;
        }
        const formData = new FormData();
        formData.append("file", file);
        _this.$http
            .post("scan/export/upload", formData, {emulateJSON: true})
            .then(({data: res}) => {
              if (res.code != 200) {
                return _this.$message.error(res.msg);
              }
              _this.$message({
                message: _this.$t("prompt.success"),
                type: "success",
                duration: 500,
                onClose: () => {
                  _this.getDataList();
                },
              });
            })
            .catch(() => {
            });
      })
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
    initDataList: function () {
      this.page = 1;
      this.getProjectList();
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
    deleteHandle(row) {
      this.$confirm(
          this.$t("prompt.info", {handle: this.$t("delete")}),
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
      ).then(() => {
        if (row.ip != '-' && row.port != '-') {
          let param = {
            ip: row.ip,
            ipLong: row.ipLong,
            port: row.port
          }
          del(Object.assign(param)).then(({data: res}) => {
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
          }).catch(() => {
          });
        }
      })

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
<style lang="scss" scoped>
.unitname {
  color: #189f92;
  cursor: pointer;
}

.el-input {
  width: 200px;
}

</style>
