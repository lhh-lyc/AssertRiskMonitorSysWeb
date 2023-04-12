<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item>
          <el-input
            v-model="dataForm.name"
            placeholder="类型说明"
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
            v-if="$hasPermission('sys:dict:save')"
            type="primary"
            icon="el-icon-plus"
            @click="addOrUpdateHandle()"
            >{{ $t("add") }}</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPermission('sys:dict:update')"
            type="primary"
            icon="el-icon-edit"
            @click="xiugai()"
            >修改</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$hasPermission('sys:dict:delete')"
            type="primary"
            icon="el-icon-delete"
            @click="deleteHandle()"
            >{{ $t("deleteBatch") }}</el-button
          >
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
          width="50"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="字典所属类型说明"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="字典所属类型值"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
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
              v-if="$hasPermission('sys:dict:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle2(scope.row.type,scope.row.name)"
              >具体字典值</el-button
            >
            <!-- <el-button
              v-if="$hasPermission('sys:dict:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.type)"
              >{{ $t("delete") }}</el-button
            > -->
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
      <!-- 具体字典值 -->
      <add-or-update2
        v-if="addOrUpdateVisible2"
        ref="addOrUpdate2"
      ></add-or-update2>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./dict-type-add-or-update";
import AddOrUpdate2 from "./dict-data";
export default {
  data() {
    return {
      // 默认属性
      dataForm: {
        name: "",
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
      addOrUpdateVisible2: false, // 具体字典值，弹窗visible状态
    };
  },
  components: {
    AddOrUpdate,
    AddOrUpdate2
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取列表信息
    query() {
      this.$http
        .get(
          `/sys/dict/list?dictType=0&page=${this.page}&limit=${this.limit}&name=${this.dataForm.name}`
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
    // 具体字典值
    addOrUpdateHandle2(type,name) {
      this.addOrUpdateVisible2 = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate2.type = type;
        this.$refs.addOrUpdate2.name = name;
        this.$refs.addOrUpdate2.init();
      });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id;
        this.$refs.addOrUpdate.init();
      });
    },
    // 删除
    deleteHandle(id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t("prompt.deleteBatch"),
          type: "warning",
          duration: 1500,
        });
      }
      if (this.dataListSelections.length > 1) {
        return this.$message({
          message: "选择选项过多，请只选择一个选择",
          type: "warning",
          duration: 1500,
        });
      }
      id = this.dataListSelections[0].type;
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
            .post("/sys/dict/delete", id, { emulateJSON: true })
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
    // 修改
    xiugai(id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: '请选择一个修改项',
          type: "warning",
          duration: 1500,
        });
      }
      if (this.dataListSelections.length > 1) {
        return this.$message({
          message: "选择选项过多，请只选择一个选择",
          type: "warning",
          duration: 1500,
        });
      }
      id = this.dataListSelections[0].id;
      this.addOrUpdateHandle(id)
    },
  },
};
</script>
