<template>
  <el-dialog
      :visible.sync="visible"
      :title="title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
  >
    <div class="dialog-header">
      <el-select v-model="tagType" @change="query" filterable clearable style="width: 200px">
        <el-option value="2" label="公司"></el-option>
        <el-option value="3" label="主域名"></el-option>
        <el-option value="4" label="子域名"></el-option>
      </el-select>
      <el-button type="primary" @click="deleteBatch" v-if="doType==1">确定</el-button>
      <el-button type="primary" @click="reScan" v-if="doType==2">确定</el-button>
    </div>
    <div class="dialog-body">
      <el-table
          v-loading="loading"
          :data="dataList"
          @selection-change="handleSelectStockChange"
          :row-key="getRowKeys"
          stripe>
        <el-table-column type="selection" :reserve-selection="true"></el-table-column>
        <!--        <el-table-column type="index"></el-table-column>-->
        <el-table-column
            prop="tag"
            :label="tagName"
            header-align="center"
            align="center"
        >
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
        ></el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import debounce from "lodash/debounce";
import {isBlank} from "@/utils/common";
import {
  del, reScan
} from "@/api/scan/assets-delete-list";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        unitId: "",
        name: "",
        hosts: "",
        subDomainFlag: "",
        portFlag: "",
        scanPorts: '',
        scanPortsStr: ''
      },
      title: '',
      type: '',
      tagType: '2',
      doType: '',
      showId: '',
      tagName: '',
      dataList: [],
      order: "", // 排序，asc／desc
      orderField: "", // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      loading: false,
      selectList: []
    };
  },
  methods: {
    getRowKeys(row) {
      return row.tagValue;
    },
    handleSelectStockChange(val) {
      val.forEach((el) => {
        this.selectList.push(el.tagValue);
      });
    },
    deleteBatch() {
      // 删除
      if (isBlank(this.selectList)) {
        alert("删除数据不能为空！");
        return
      }
      this.$confirm(
          this.$t("prompt.info", {handle: this.$t("delete")}),
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
      ).then(() => {
        let param = {
          tagType: this.tagType,
          selectList: this.selectList
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
              this.query();
            },
          });
        }).catch(() => {
        });
      })
    },
    reScan() {
      if (isBlank(this.selectList)) {
        alert("扫描数据不能为空！");
      }
      let param = {
        tagType: this.tagType,
        selectList: this.selectList
      }
      reScan(Object.assign(param)).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.$message({
          message: this.$t("prompt.success"),
          type: "success",
          duration: 500,
          onClose: () => {
            this.query();
          },
        });
      }).catch(() => {
      });
    },
    init() {
      this.title = this.doType == 1 ? "批量删除" : "即时扫描";
      if (this.type == 1) {
        this.tagName = '项目';
      }
      if (this.type == 2) {
        this.tagName = '企业';
      }
      if (this.type == 3) {
        this.tagName = '主域名';
      }
      if (this.type == 4) {
        this.tagName = '子域名';
      }
      if (this.type == 5) {
        this.tagName = 'IP';
      }
      if (this.type == 6) {
        this.tagName = '端口';
      }
      if (this.type == 7) {
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
      this.selectList = [];
      if (this.tagType == 2) {
        this.tagName = '企业';
      }
      if (this.tagType == 3) {
        this.tagName = '主域名';
      }
      if (this.tagType == 4) {
        this.tagName = '子域名';
      }
      this.$http
          .get(`/scan/home/getGroupTag?page=${this.page}&limit=${this.limit}&type=${this.tagType}`)
          .then(({data: res}) => {
            if (res.code != 200) {
              return this.$message.error(res.msg);
            }
            this.dataList = res.data.records
            this.total = res.data.total || 0;
            this.showId = res.data.size * (res.data.current - 1);
          })
          .catch(() => {
          });
    },
    showPointList(tagValue) {
      this.$router.replace({
        name: "scan-assets",
        params: {type: this.type, tagValue: tagValue}
      });
    },
  },
};
</script>
<style>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
