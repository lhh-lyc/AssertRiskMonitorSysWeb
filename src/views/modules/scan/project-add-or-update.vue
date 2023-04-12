<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.unitId ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="700px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="100px"
    >
      <el-form-item prop="name" label="项目名称">
        <el-input v-model="dataForm.name" placeholder="项目名称" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="hosts" label="扫描域名">
        <textarea style="width: 560px;height: 100px" v-model="dataForm.hosts" placeholder="输入域名"></textarea>
      </el-form-item>
      <el-form-item prop="scanPorts" label="扫描端口">
        <textarea style="width: 560px;height: 100px" v-model="dataForm.scanPorts" placeholder="扫描端口"></textarea>
      </el-form-item>
      <el-form-item label="端口类型">
        <el-select
          v-model="dataForm.scanPortsStr"
          placeholder="端口类型"
          clearable
          class="filter-item"
          @change="putPorts"
        >
          <el-option label="-- 请选择端口 --" value="" />
          <el-option
            v-for="item in portList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
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
        hosts: "",
        scanPorts: '',
        scanPortsStr: ''
      },
      portList: [],
    };
  },
  computed: {
    dataRule() {
      return {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        hosts: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        scanPorts: [
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
    this.queryDictList();
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.dataForm.name = '';
        this.dataForm.hosts = '';
        this.dataForm.scanPorts = '';
        this.dataForm.scanPortsStr = '';
        if (this.dataForm.unitId) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http
        .get(`/scan/project/info/${this.dataForm.unitId}`)
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
    queryDictList() {
      this.$http
        .get(`/sys/dict/list?type=appoint_port_type`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.portList = res.data || [];
        })
        .catch(() => {});
    },
    putPorts(){
      this.dataForm.scanPorts = this.dataForm.scanPortsStr
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.dataForm.shortName = this.dataForm.name; // 不加接口报错
          let url = this.dataForm.unitId ? "/scan/project/update" : "/scan/project/saveProject";
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
