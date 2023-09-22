<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.unitId ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="800px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="200px"
    >
      <el-form-item prop="name" label="企业名称">
        <el-input v-model="dataForm.name" placeholder="企业名称" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="unitCode" label="企业编号">
        <el-input v-model="dataForm.unitCode" placeholder="企业编号" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="industry" label="行业">
        <el-input v-model="dataForm.industry" placeholder="行业" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="parkId" label="所属园区">
        <el-select
          v-model="dataForm.parkId"
          placeholder="所属园区"
          clearable
          class="filter-item"
        >
          <el-option label="-- 请选择园区 --" value="" />
          <el-option
            v-for="item in parkList"
            :key="'parkId' + item.parkId"
            :label="item.name"
            :value="item.parkId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="socialCreditCode" label="社会统一信用代码">
        <el-input
          v-model="dataForm.socialCreditCode"
          placeholder="社会统一信用代码"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item prop="address" label="单位注册地址">
        <el-input
          v-model="dataForm.address"
          placeholder="单位注册地址"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item prop="headOfEnvironment" label="企业环保部门负责人">
        <el-input
          v-model="dataForm.headOfEnvironment"
          placeholder="企业环保部门负责人"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="headOfEnvironmentPhone"
        label="企业环保部门联系人联系电话"
      >
        <el-input
          v-model="dataForm.headOfEnvironmentPhone"
          placeholder="企业环保部门联系人联系电话"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item prop="legalRepresentative" label="法定代表人">
        <el-input
          v-model="dataForm.legalRepresentative"
          placeholder="法定代表人"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item prop="statutoryContact" label="法定代表人联系方式">
        <el-input
          v-model="dataForm.statutoryContact"
          placeholder="法定代表人联系方式"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="longitude" label="经度">
            <el-input-number v-model="dataForm.longitude" :max="180" :min="-180"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="latitude" label="纬度">
            <el-input-number v-model="dataForm.latitude" :max="90" :min="-90"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" placeholder="备注" maxlength="100"></el-input>
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
import { isMobile } from "@/utils/validate";
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        unitId: "",
        name: "",
        unitCode: "",
        industry: "",
        parkId: "",
        socialCreditCode: "",
        address: "",
        headOfEnvironment: "",
        headOfEnvironmentPhone: "",
        legalRepresentative: "",
        statutoryContact: "",
        remark: "",
        longitude: undefined,
        latitude: undefined,
      },
      parkList: [],
    };
  },
  computed: {
    dataRule() {
      var validateMobile = (rule, value, callback) => {
        if (value && !isMobile(value)) {
          return callback(
            new Error(
              this.$t("validate.format", { attr: '手机号码' })
            )
          );
        }
        callback();
      };
      var validateSocialCreditCode = (rule, value, callback) => {
        if (value && value.length !== 18) {
          return callback(
            new Error(
              '社会统一信用代码必须是18位'
            )
          );
        }
        callback();
      };
      return {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        unitCode: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        industry: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        parkId: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        headOfEnvironmentPhone: [
          {
            validator: validateMobile,
            trigger: "blur",
          },
        ],
        statutoryContact: [
          {
            validator: validateMobile,
            trigger: "blur",
          },
        ],
        socialCreditCode: [
          {
            validator: validateSocialCreditCode,
            trigger: "blur",
          },
        ],
      };
    },
  },
  created() {
    this.queryListAll(); // 获取园区名称列表信息
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.unitId) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http
        .get(`/cm/unit/info/${this.dataForm.unitId}`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data,
          };
        })
        .catch(() => {});
    },
    // 获取园区名称列表信息
    queryListAll() {
      this.$http
        .get(`/cm/park/queryListAll`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.parkList = res.data || [];
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
          this.dataForm.shortName = this.dataForm.name; // 不加接口报错
          let url = this.dataForm.unitId ? "/cm/unit/update" : "/cm/unit/save";
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
