<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
          <h2 class="login-brand">{{ $t("brand.lg") }}</h2>
        </div>
        <div class="login-body">
          <h3 class="login-title">
            欢迎登陆
            <div class="login-line"></div>
          </h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmitHandle()"
            status-icon
          >
            <el-form-item prop="userName">
              <el-input
                v-model="dataForm.userName"
                :placeholder="$t('login.username')"
              >
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-user"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="dataForm.password"
                type="password"
                :placeholder="$t('login.password')"
              >
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item> </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="dataFormSubmitHandle()"
                class="w-percent-100"
              >
                {{ $t("login.title") }}</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-checkbox
                v-model="checked"
                label="记住账号"
                name="type"
                class="checked"
              ></el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="login-footer">
					<p>
						<a href="http://demo.open.renren.io/renren-security" target="_blank">{{ $t('login.demo') }}</a>
					</p>
					<p><a href="https://www.renren.io/" target="_blank">{{ $t('login.copyright') }}</a>2022 © renren.io
					</p>
				</div> -->
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
import { getUUID } from "@/utils";
import { commonkey } from "@/utils/common.js";
import Fingerprint2 from "fingerprintjs2";
import md5 from "js-md5";
export default {
  data() {
    return {
      captchaPath: "",
      checked: false,
      dataForm: {
        userName: "",
        password: "",
      },
    };
  },
  computed: {
    dataRule() {
      return {
        userName: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
      };
    },
  },
  created() {
    this.getDevCode();
  },
  mounted() {
    let username = localStorage.getItem("username");
    if (username) {
      this.dataForm.userName = localStorage.getItem("username");
      this.checked = true;
    }
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = `${window.SITE_CONFIG["apiURL"]}/captcha?uuid=${this.dataForm.uuid}`;
    },
    getDevCode() {
      Fingerprint2.get(function (components) {
        const values = components.map(function (component, index) {
          if (index === 0) {
            // 把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
            return component.value.replace(/\bNetType\/\w+\b/, "");
          }
          return component.value;
        });
        // 生成最终id murmur
        // 使用的浏览器信息
        // 生成32位标识码
        const murmur = Fingerprint2.x64hash128(values.join(""), 31);
        sessionStorage.setItem(commonkey.adminDevCodeKey, murmur);
      });
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.checked) {
            localStorage.setItem("username", this.dataForm.userName);
          } else {
            localStorage.removeItem("username");
          }
          var obj = {
            userName: this.dataForm.userName,
            password: this.dataForm.password,
          };
          this.$http
            .post("auth/login", obj)
            .then(({ data: res }) => {
              if (res.code != 200) {
                return this.$message.error(res.msg);
              }
              Cookies.set("access_token", res.data.access_token);
              Cookies.set("refresh_token", res.data.refresh_token);
              var token = res.data.access_token;
              if (token != null) {
                sessionStorage.setItem(commonkey.adminTokenKey, token);
              }
              sessionStorage.setItem(commonkey.adminUserIdKey, res.data.userId);
              sessionStorage.setItem(commonkey.isAdminKey, res.data.isAdmin);
              sessionStorage.setItem(commonkey.adminEncUserIdKey, res.data.encUserId);
              sessionStorage.setItem(
                commonkey.adminUserNamekey,
                res.data.userName
              );
              this.$store.state.user.name = res.data.userName;
              this.$router.replace({
                name: "home",
              });
              // const path = '/'
              // this.$router.push({ path: path, query: {}}) // 带参跳转
            })
            .catch(() => {});
        });
      },
      1000,
      {
        leading: true,
        trailing: false,
      }
    ),
  },
};
</script>
<style lang="scss" scoped>
.el-button {
  border-radius: 20px;
}

.checked {
  float: left;
  margin-left: 10px;
}
// ::v-deep .el-input__inner {
//   border-radius: 20px;
// }
</style>
