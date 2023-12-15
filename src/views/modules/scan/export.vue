<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form :inline="true" @keyup.enter.native="getDataList()">
        <el-form-item label="文件名" label-width="80px">
          <el-input v-model="q.fileName" clearable></el-input>
        </el-form-item>
        <el-form-item label="导出类型">
          <el-select
              v-model="q.type"
              placeholder="请选择"
          >
            <el-option
                label="全部"
                value=""
            ></el-option>
            <el-option
                label="端口资产"
                value="1"
            ></el-option>
            <el-option
                label="漏洞资产"
                value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="createName" :label="$t('user.username')" sortable="custom" header-align="center"
                         align="center"></el-table-column>

        <el-table-column label="文件名"  header-align="center">
          <template slot-scope="{ row }">
            <span v-if="row.fileName">
              <el-popover placement="top-start" width="500" trigger="hover">
               <div>{{ row.fileName }}</div>
                 <span slot="reference">
                    {{ row.fileName }}
                 </span>
             </el-popover>
           </span>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="fileSize" label="文件大小(M)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createTime" :label="$t('user.createDate')" sortable="custom" header-align="center"
                         align="center"></el-table-column>
      </el-table>
      <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import {page, exportFiles} from "@/api/sys/files";
import {assign} from "_lodash@4.17.21@lodash";

export default {
  data() {
    return {
      q: {
        fileName: '',
        type: ''
      },
      dataList: [], // 数据列表
      order: "", // 排序，asc／desc
      orderField: "", // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList: function () {
      this.page = 1;
      this.query();
    },
    query() {
      page(assign({
        page: this.page,
        limit: this.limit,
        type: this.q.type,
        fileName: this.q.fileName,
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
    exportHandle() {
      let fileUrlList = [];
      if (this.dataListSelections.length == 0) {
        this.$message.info("请选择文件");
      }
      this.dataListSelections.forEach(function(item){
        fileUrlList.push(item.fileUrl);
      });
      this.$http
          .post("/scan/export/exportFiles", fileUrlList, {emulateJSON: true})
          .then(({data: res}) => {
            if (res.code != 200) {
              return this.$message.error(res.msg);
            }
            res.data.forEach(function (url){
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              // let timestamp = new Date().getTime()
              // link.download = timestamp + '.txt'
              document.body.appendChild(link)
              link.click()
              link.remove()
            })
          })
          .catch(() => {
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
  }
}
</script>
