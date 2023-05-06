<template>
  <el-dialog
      :visible.sync="visible"
      :title="!dataForm.unitId ? $t('add') : $t('update')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
  >
    <div class="mod-sys__dict">
      <el-table
          :data="dataList"
          style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scop">
            {{ scop.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            prop="tagValue"
            :label="tagName"
            header-align="center"
            align="center"
        >
          <template slot-scope="scope">
            <div @click="showPointList(scope.row.tagValue)" style="cursor: pointer;">{{ scope.row.tagValue }}</div>
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
    </div>
  </el-dialog>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        type: '',
        unitId: "",
        name: "",
        hosts: "",
        subDomainFlag: "",
        portFlag: "",
        scanPorts: '',
        scanPortsStr: ''
      },
      tagName: '',
      dataList: [],
      order: "", // 排序，asc／desc
      orderField: "", // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
    };
  },
  methods: {
    init() {
      if (this.dataForm.type == 1) {
        this.tagName = '项目';
      }
      if (this.dataForm.type == 2) {
        this.tagName = '企业';
      }
      if (this.dataForm.type == 3) {
        this.tagName = '主域名';
      }
      if (this.dataForm.type == 4) {
        this.tagName = '子域名';
      }
      if (this.dataForm.type == 5) {
        this.tagName = 'IP';
      }
      if (this.dataForm.type == 6) {
        this.tagName = '端口';
      }
      if (this.dataForm.type == 7) {
        this.tagName = '网站';
      }
      this.query();
      this.visible = true;
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
    // 获取信息
    query() {
      this.$http
          .get(`/scan/home/getGroupTag?page=${this.page}&limit=${this.limit}&type=${this.dataForm.type}`)
          .then(({data: res}) => {
            if (res.code != 200) {
              return this.$message.error(res.msg);
            }
            this.dataList = res.data.records
            this.total = res.data.total || 0;
          })
          .catch(() => {
          });
    },
    showPointList(tagValue) {
      this.$router.replace({
        name: "scan-assets",
        params: {type: this.dataForm.type, tagValue: tagValue}
      });
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
        function () {
          this.$refs["dataForm"].validate((valid) => {
            if (!valid) {
              return false;
            }
            if (this.dataForm.portFlag == 0) {
              this.dataForm.scanPorts = "";
            }
            let url = this.dataForm.unitId ? "/scan/project/update" : "/scan/project/saveProject";
            this.$http
                .post(url, this.dataForm, {emulateJSON: true})
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
                      this.$emit("refreshDataList");
                    },
                  });
                })
                .catch(() => {
                });
          });
        },
        1000,
        {leading: true, trailing: false}
    ),
  },
};
</script>
