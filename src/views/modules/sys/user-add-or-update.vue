<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="600px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="70px"
    >
      <el-form-item prop="userName" label="用户名">
        <el-input
          v-model="dataForm.userName"
          :placeholder="$t('user.username')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="realName" label="真实姓名">
        <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="email" :label="$t('user.email')">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="roleIdList" label="角色" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple placeholder="角色">
          <el-option
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleName"
            :value="role.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('user.status')" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio label="1">禁用</el-radio>
          <el-radio label="0">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{
        $t("confirm")
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from "lodash/debounce";
import { isEmail, isMobile } from "@/utils/validate";
export default {
  data() {
    return {
      visible: false,
      roleList: [],
      roleIdListDefault: [],
      options: [], // 企业列表
      dataForm: {
        id: "",
        unitId: "",
        userName: "",
        realName: "",
        mobile: "",
        email: "",
        roleIdList: [],
        status: "0",
        accountType: 2,
				authApp: 0,
				appType: 0,
				unionId: 0,
      },
    };
  },
  computed: {
    dataRule() {
      var validateEmail = (rule, value, callback) => {
        if (value && !isEmail(value)) {
          return callback(
            new Error(
              this.$t("validate.format", { attr: this.$t("user.email") })
            )
          );
        }
        callback();
      };
      var validateMobile = (rule, value, callback) => {
        if (value && !isMobile(value)) {
          return callback(
            new Error(
              this.$t("validate.format", { attr: this.$t("user.mobile") })
            )
          );
        }
        callback();
      };
      return {
        unitId: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        email: [{ validator: validateEmail, trigger: "blur" }],
        mobile: [
          {
            validator: validateMobile,
            trigger: "blur",
          },
        ],
      };
    },
  },
  created() {},
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.roleIdListDefault = [];
        Promise.all([this.getRoleList()]).then(() => {
          if (this.dataForm.id) {
            this.getInfo();
          }
        });
      });
    },
    // 获取角色列表
    getRoleList() {
      return this.$http
        .get("/sys/role/list")
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.roleList = res.data;
        })
        .catch(() => {});
    },
    // 获取信息
    getInfo() {
      this.$http
        .get(`/sys/user/info/${this.dataForm.id}`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          res.data.status = res.data.status + ''
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          };
          // 角色配置, 区分是否为默认角色
          // for (var i = 0; i < res.user.roleIdList.length; i++) {
          //   if (
          //     this.roleList.filter(
          //       (item) => item.id === res.user.roleIdList[i]
          //     )[0]
          //   ) {
          //     this.dataForm.roleIdList.push(res.user.roleIdList[i]);
          //     continue;
          //   }
          //   this.roleIdListDefault.push(res.user.roleIdList[i]);
          // }
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          let url = this.dataForm.id ? "/sys/user/update" : "/sys/user/save";
          this.$http
            .post(url, this.dataForm, { emulateJSON: true })
            .then(({ data: res }) => {
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
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style lang="scss">
.mod-sys__user {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
