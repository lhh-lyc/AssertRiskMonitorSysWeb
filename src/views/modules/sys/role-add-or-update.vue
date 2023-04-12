<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             label-width="70px">
      <el-form-item prop="type" :label="$t('menu.type')" size="mini">
        <el-radio-group v-model="dataForm.type" :disabled="!!dataForm.id">
          <el-radio :label="0">{{ $t('role.type0') }}</el-radio>
          <el-radio :label="1">{{ $t('role.type1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="$t('role.name')">
        <el-input v-model="dataForm.roleName" :placeholder="$t('role.name')"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('role.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('role.remark')"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" :label="$t('role.menuList')">
            <el-tree
                :data="menuList"
                :props="{ label: 'name', children: 'children' }"
                node-key="menuId"
                ref="menuListTree"
                :default-checked-keys="menuIds"
                check-strictly
                accordion
                show-checkbox
                @check="menuChange">
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  data() {
    return {
      visible: false,
      menuList: [],
      deptList: [],
      menuIds: [],
      dataForm: {
        id: '',
        name: '',
        menuIdList: [],
        deptIdList: [],
        remark: ''
      }
    }
  },
  computed: {
    dataRule() {
      return {
        roleName: [
          {required: true, message: this.$t('validate.required'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      // 初始化默认选中的key
      this.menuIds = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
        // this.$refs.deptListTree.setCheckedKeys([])
        Promise.all([
          this.getMenuList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取菜单列表
    getMenuList() {
      return this.$http.get('/sys/menu/findAll').then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        this.menuList = res.data
      }).catch(() => {
      })
    },
    // 获取信息
    getInfo() {
      this.$http.get(`/sys/role/info/${this.dataForm.id}`).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg)
        }
        this.menuIds = res.data.menuIdList
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
        // this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList)
      }).catch(() => {
      })
    },
    menuChange(menu) {
      // 获取该节点的所有子节点，id 包含自身
      this.$http.get(`/sys/menu/getChild?nodeId=`+menu.menuId).then(childIds => {
        childIds = childIds.data.data;
        // 判断是否在 menuIds 中，如果存在则删除，否则添加
        if (this.menuIds.indexOf(menu.menuId) !== -1) {
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index !== -1) {
              this.menuIds.splice(index, 1)
            }
          }
        } else {
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index === -1) {
              this.menuIds.push(childIds[i])
            }
          }
        }
        console.log(this.menuIds)
        this.$refs.menuListTree.setCheckedKeys(this.menuIds)
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        // 得到已选中的 key 值
        this.dataForm.menuIdList = this.menuIds
        console.log(this.menuIds)
        var url = this.dataForm.roleId == undefined ? '/sys/role/save' : '/sys/role/update';
        this.dataForm.roleType = 0
        this.$http['post'](url, this.dataForm).then(({data: res}) => {
          if (res.code != 200) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {
        })
      })
    }, 1000, {'leading': true, 'trailing': false})
  }
}
</script>
