<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.userName" :placeholder="$t('user.username')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:export')" type="info" @click="exportCmsJson()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="cms" label="cms" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column prop="method" label="method" header-align="center" align="center"></el-table-column>
        <el-table-column prop="location" label="location" header-align="center" align="center"></el-table-column>
        <el-table-column prop="keyword" label="keyword" sortable="custom" header-align="center" align="center"></el-table-column><el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import {saveAs} from 'file-saver';
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './cms-json-add-or-update'
import {
  page,getCmsJson
} from "@/api/sys/cms-json";
import {assign} from "_lodash@4.17.21@lodash";
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/cms/json/page',
        getDataListIsPage: true,
        deleteURL: '/cms/json/deleteBatch',
        deleteIsBatch: true,
        deleteIsBatchKey: 'id',
      },
      dataForm: {
        userName: '',
        unitId: ''
      },
      dataList: [], // 数据列表
      order: "", // 排序，asc／desc
      orderField: "", // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
      addOrUpdateVisible: false, // 新增／更新，弹窗visible状态
      deleteVisible: false,
    }
  },
  components: {
    AddOrUpdate
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取列表信息
    query() {
      page(assign({
        page: this.page,
        limit: this.limit,
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
    getDataList: function () {
      this.page = 1;
      this.query();
    },
    exportCmsJson: function () {
      getCmsJson(assign({})).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        let str = new Blob([res.data], {type: 'text/plain;charset=utf-8'});
        // 注意：这里要手动写上文件的后缀名
        saveAs(str, `finger.json`);
      }).catch(() => {
      });
    }
  }
}
</script>
