<template>
  <el-dialog
      :visible.sync="visible"
      title="域名列表"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      width="700px"
  >
    <div class="dialog-body">
      <el-table
          v-loading="loading"
          :data="dataList"
          :row-key="getRowKeys"
          stripe>
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scop">
            {{ scop.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
            prop="domain"
            label="即时扫描对象"
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
  del
} from "@/api/scan/assets-delete-list";

export default {
  data() {
    return {
      visible: false,
      domainList: [],
      allList: [],
      type: '',
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
  mounted() {
  },
  methods: {
    getRowKeys(row) {
      return row.tagValue;
    },
    init() {
      let list = [];
      this.domainList.forEach(function(item){
        list.push({'domain': item});
      })
      this.allList = list;
      this.total= this.allList.length;
      this.dataList = this.allList.slice(0, this.limit)
      this.visible = true;
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.dataList = this.allList.slice(0, this.limit)
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.dataList = this.allList.slice((this.page-1)*this.limit, this.page*this.limit)
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
