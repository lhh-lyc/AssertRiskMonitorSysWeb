<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.fileName" placeholder="文件名" clearable></el-input>
        </el-form-item>
        <el-form-item label="漏洞工具">
          <el-select
              v-model="dataForm.toolType"
              placeholder="请选择"
          >
            <el-option
                label="全部"
                value=""
            ></el-option>
            <el-option
                label="nuclei"
                value="1"
            ></el-option>
            <el-option
                label="afrog"
                value="2"
            ></el-option>
            <el-option
                label="xray"
                value="3"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传目录:">
          <el-select v-model="filters.folderName" placeholder="请选择上传目录" ref="treeSelect">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 180px;margin-left: 14px"></el-input>
            <el-option hidden :label="filters.folderName" :value="filters.folderId"></el-option>
            <el-tree :data="folderOptions" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree"
                     :expand-on-click-node="false" node-key="id" :default-expanded-keys="folderOptions[0] && [folderOptions[0].id]" highlight-current>
              <span slot-scope="{ node, data }" :class="'custom-tree-node ' + (node.expanded ? folderOpen : folderClose)" :title="node.label" v-text="node.label"></span>
            </el-tree>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-upload2" @click="uploadFiles()">{{ $t('uploadModule') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:export')" type="info" @click="exportYaml()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('sys:user:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
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
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scop">
            {{ showId + scop.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column prop="filePath" label="文件目录" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column prop="fileType" label="文件类型" header-align="center" align="center"></el-table-column>
        <el-table-column
            prop="toolType"
            label="工具类型"
            header-align="center"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.toolType == 1 ? 'nuclei' : scope.row.toolType == 2 ? 'afrog' : scope.row.toolType == 3 ? 'xray' : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上传时间" header-align="center" align="center"></el-table-column>
<!--        <el-table-column
            :label="$t('handle')"
            fixed="right"
            header-align="center"
            align="center"
            width="150"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                @click="download(scope.row)"
            >{{ $t("delete") }}
            </el-button
            >
          </template>
        </el-table-column>-->
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import {MessageBox} from 'element-ui';
import AddOrUpdate from './cms-json-add-or-update'
import {isBlank} from '@/utils/common.js'
import {page, folderList} from "@/api/sys/hole-yaml";
import {assign} from "_lodash@4.17.21@lodash";

export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/cms/json/page',
        getDataListIsPage: true,
        deleteURL: '/cms/json/deleteBatch',
        deleteIsBatch: true,
        deleteIsBatchKey: 'id',
      },
      dataForm: {
        fileName: '',
        unitId: '',
        toolType: ''
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
      // 部门树选项
      folderOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      filters: {
        folderId: '',
        folderName: '',
        folderPath: '/custom'
      },
      folderOpen:'folderOpen',
      folderClose: 'folderClose'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  components: {
    AddOrUpdate
  },
  mounted() {
    this.getDataList();
    this.getFolderList();
  },
  methods: {
    // 获取列表信息
    query() {
      page(assign({
        fileName: this.dataForm.fileName,
        page: this.page,
        limit: this.limit,
        toolType: this.dataForm.toolType,
        folderName: this.filters.folderPath
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
    getFolderList: function () {
      folderList().then(({data: res}) => {
        if (res.code != 200) {
          this.folderOptions = [];
          return this.$message.error(res.msg);
        }
        this.folderOptions = res.data || [];
        console.log(this.folderOptions)
      }).catch(() => {
      });
    },
    getDataList: function () {
      this.page = 1;
      this.query();
    },
    //关键字过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //点击选择
    handleNodeClick(data) {
      this.filters.folderName = data.label
      this.filters.folderId = data.id
      this.filters.folderPath = data.folder
      this.$refs.treeSelect.visible = false
    },
    uploadFiles: function () {
      if (isBlank(this.dataForm.toolType)) {
        return this.$message({
          message: this.$t('prompt.uploadTool'),
          type: 'warning',
          duration: 1000
        })
      }
      let msg = this.dataForm.toolType == 1 ? "nuclei" : this.dataForm.toolType == 2 ? "afrog" : "xray";
      MessageBox.confirm('确定上传'+msg+'漏洞规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this;
        const fileType = ['yaml']
        const inputFile = document.createElement("input")
        inputFile.type = "file"
        inputFile.style.display = "none"
        inputFile.setAttribute("webkitdirectory", "")
        document.body.appendChild(inputFile)
        inputFile.click()
        inputFile.addEventListener("change", function () {
          let files = inputFile.files;
          if (files == null || files.length == 0) {
            _this.$message.warning("上传文件不能为空");
            return false;
          }
          let fileError = false;
          const formData = new FormData();
          formData.append("toolType", _this.dataForm.toolType);
          formData.append("folderId", _this.filters.folderId);
          for (let i = 0; i < files.length; i++) {
            var relativePath = files[i].webkitRelativePath;
            let testMsg = files[i].name.substring(files[i].name.lastIndexOf('.') + 1)
            if (!fileType.includes(testMsg)) {
              fileError = true;
              break;
            }
            formData.append("files", files[i]);
            formData.append("paths", relativePath);
          }
          if (fileError) {
            _this.$message.warning("上传的文件格式只能是yaml");
            document.body.removeChild(inputFile);
            return false;
          }
          _this.$http
              .post("hole/yaml/uploadFiles", formData, {emulateJSON: true})
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
                    _this.getFolderList();
                  },
                });
              })
              .catch(() => {
              });
        })
      }).catch(() => {
        // 用户点击了取消按钮，执行取消操作
      });
    },
    exportYaml: function () {
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.export'),
          type: 'warning',
          duration: 500
        })
      }
      let fileUrlList = [];
      this.dataListSelections.forEach(function(item){
        fileUrlList.push(item.fileUrl);
      })
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('export') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.post(
            `/hole/yaml/downYaml`,
            JSON.stringify(fileUrlList)
        ).then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg)
          }
          let fileList = res.data;
          fileList.forEach(function(url){
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            // let timestamp = new Date().getTime()
            // link.download = timestamp + '.txt'
            document.body.appendChild(link)
            link.click()
            link.remove()
          })
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
              this.getFolderList();
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 删除
    deleteHandle () {
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      var ids = [];
      this.dataListSelections.forEach(function(item){
        ids.push(item.id);
      })
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.post(
            `/hole/yaml/delete`,
            JSON.stringify(ids)
        ).then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
              this.getFolderList();
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
  }
}
</script>
<style lang="scss" scoped>
//----------1.添加箭头效果-----------
// 没有展开且有子节点
.el-tree ::v-deep .el-icon-caret-right:before {
  background: url("~@/assets/img/arrow-right.png") no-repeat 0 0;
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 3px;
  background-size: 8px 12px;
}
// 已经展开且有子节点
.el-tree ::v-deep .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url("~@/assets/img/arrow-right.png") no-repeat 0 0;
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  background-size: 8px 12px;
}
// 没有子节点
.el-tree ::v-deep .el-tree-node__expand-icon.is-leaf::before {
  background: none;
}
// 设置节点高度
::v-deep .el-tree-node__content {
  position: relative;
  background: transparent;
  margin-top: 3px;
  height: 39px;
}
::v-deep .el-tree-node__label {
  font-size: 20px;
}
.custom-tree-node {
  width: 100%;
  overflow: hidden !important; // 溢出部分隐藏
  white-space: nowrap !important; //禁止自动换行
  text-overflow: ellipsis !important; // 使溢出部分以省略号显示
  display: block !important;
  font-size: 20px;
}
.folderOpen::before{                 //样式名称与data里的对应
  /* background-color: aqua; */
  content:'';
  /* float: left; */
  display: inline-block;
  width: 22px;
  height: 15px;
  /* border: 1px solid#000; */
  background: url("~@/assets/img/folderOpen.png") no-repeat;
  background-size: 18px;
}
.folderClose::before{                 //样式名称与data里的对应
  /* background-color: aqua; */
  content:'';
  /* float: left; */
  display: inline-block;
  width: 22px;
  height: 15px;
  /* border: 1px solid#000; */
  background: url("~@/assets/img/folderClose.png") no-repeat;
  background-size: 17px;
}
</style>
