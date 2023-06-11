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
          <el-form-item label="扫描对象">
            <el-input
                v-model="q.content"
                placeholder="扫描对象"
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
            <el-button
                v-if="$hasPermission('cm:unit:save')"
                type="primary"
                @click="readAll()"
            >{{ $t("readAll") }}
            </el-button
            >
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
            prop="content"
            label="即时扫描对象"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div style="color: #409eff" @click="infoShow(scope.row.domainList)">{{scope.row.content}}</div>
          </template>
        </el-table-column>
        <el-table-column
            title="scanPorts"
            prop="scanPorts"
            label="即时扫描端口"
            header-align="center"
            align="center"
            width="250"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            prop="statusName"
            label="状态"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                v-if="scope.row.status==0"
                type="text"
                size="small"
                @click="read(scope.row)"
            >{{ $t("read") }}
            </el-button>
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
          <!-- 弹窗, 站内信 -->
          <letter v-if="letterVisible" ref="letter"></letter>
    </div>
  </el-card>
</template>

<script>
import {addDynamicRoute} from "@/router";
import {
  page,read
} from "@/api/sys/letter";
import letter from './letter_info'
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
        address: '',
      },
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
      deleteVisible: false,
      options: [], // 企业名称列表
      showFiles: false, // 是否显示附件弹框页
      isAdmin: sessionStorage.getItem(commonkey.isAdminKey),
      letterVisible: false
    };
  },
  components: {
    letter
  },
  mounted() {
    this.getDataList();
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
        content: this.q.content,
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
    read: function(row){
      read(assign({
        id: row.id,
      })).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.getDataList();
      }).catch(() => {
      });
    },
    readAll: function(){
      read(assign({
        userId: sessionStorage.getItem(commonkey.unitIdKey),
      })).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.getDataList();
      }).catch(() => {
      });
    },
    infoShow: function(domainList){
      this.letterVisible = true;
      this.$nextTick(() => {
        this.$refs.letter.page = 1;
        this.$refs.letter.limit = 10;
        /*let dataList = [];
        domainList.forEach(function(item){
          dataList.push({'domain': item});
        })
        this.$refs.letter.dataList = dataList;*/
        this.$refs.letter.domainList = domainList;
        this.$refs.letter.init();
      });
    }
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

.el-tooltip__popper{
  max-width:30%;
  padding-bottom: 5px!important;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 15;
  -webkit-box-orient: vertical;

}
.el-tooltip__popper,.el-tooltip__popper.is-dark{
  background:rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}

</style>
