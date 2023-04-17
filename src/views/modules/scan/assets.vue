<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="公司">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="公司"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="主域名">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="主域名"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="子域名">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="子域名"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="IP">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="IP"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="端口"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()">{{
            $t("query")
          }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPermission('cm:unit:save')"
            type="primary"
            icon="el-icon-plus"
            @click="addOrUpdateHandle()"
            >{{ $t("add") }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPermission('cm:unit:delete')"
            type="primary"
            icon="el-icon-delete"
            @click="deleteHandleAll()"
            >{{ $t("deleteBatch") }}</el-button
          >
        </el-form-item>
        <el-form-item label="服务">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="服务"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="URL"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="cms">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="cms"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="Title">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="Title"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="ip归属地">
          <el-input
              v-model="dataForm.unitCode"
              placeholder="ip归属地"
              clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50px"
        ></el-table-column>
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scop">
            {{scop.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="公司"
          header-align="center"
          align="center"
          width="250"
        >
        </el-table-column>
        <el-table-column
          prop="unitCode"
          label="主域名"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="industry"
          label="子域名"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="IP"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="socialCreditCode"
          label="端口"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="legalRepresentative"
          label="服务"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="statutoryContact"
          label="URL"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="headOfEnvironment"
          label="cms"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="headOfEnvironmentPhone"
          label="Title"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fileCount"
          label="IP归属地"
          header-align="center"
          align="center"
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
              v-if="$hasPermission('cm:unit:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.unitId)"
              >{{ $t("update") }}</el-button
            >
            <el-button
              v-if="$hasPermission('cm:unit:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.unitId)"
              >{{ $t("delete") }}</el-button
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
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./assets-add-or-update";
import { addDynamicRoute } from "@/router";
import { commonkey } from "@/utils/common.js";
export default {
  data() {
    return {
      // 默认属性
      dataForm: {
        unitId: "",
        unitCode: "",
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
      options: [], // 企业名称列表
      showFiles: false, // 是否显示附件弹框页
    };
  },
  components: {
    AddOrUpdate,
  },
  created() {
    this.getUnits(); // 获取企业名称列表信息
  },
  mounted() {
    let isPark = sessionStorage.getItem(commonkey.isParkKey);
    if (isPark == 0) {
      this.dataForm.unitId = sessionStorage.getItem(commonkey.unitIdKey) * 1;
    } else {
      this.dataForm.unitId = "";
    }
    this.getDataList();
  },
  methods: {
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
    // 获取企业名称列表信息
    getUnits() {
      this.$http
        .get(`/cm/unit/queryList`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.options = res.data || [];
        })
        .catch(() => {});
    },
    // 获取列表信息
    query() {
      this.$http
        .get(
          `/cm/unit/list?page=${this.page}&limit=${this.limit}&unitId=${this.dataForm.unitId}&unitCode=${this.dataForm.unitCode}`
        )
        .then(({ data: res }) => {
          if (res.code != 200) {
            this.dataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.dataList = res.data.records || [];
          this.total = res.data.total || 0;
        })
        .catch(() => {});
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
        this.$t("prompt.info", { handle: this.$t("delete") }),
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .post("/cm/unit/delete", [id], { emulateJSON: true })
            .then(({ data: res }) => {
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
            .catch(() => {});
        })
        .catch(() => {});
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
        this.$t("prompt.info", { handle: this.$t("delete") }),
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .post("/cm/unit/delete", arr, { emulateJSON: true })
            .then(({ data: res }) => {
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
            .catch(() => {});
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.unitname {
  color: #189f92;
  cursor: pointer;
}

</style>
