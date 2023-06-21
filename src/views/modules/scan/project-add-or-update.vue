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
        label-width="100px"
    >
      <el-form-item prop="name" label="项目名称">
        <el-input v-model="dataForm.name" placeholder="项目名称" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item prop="hosts" label="扫描域名">
        <textarea style="width: 560px;height: 100px" v-model="dataForm.hosts" placeholder="输入域名，多域名请换行输入"></textarea>
      </el-form-item>
<!--      <el-form-item prop="subDomainFlag" label="子域名收集">-->
<!--        <el-checkbox v-model="dataForm.subDomainFlag" :true-label="1" :false-label="0">子域名收集</el-checkbox>-->
<!--      </el-form-item>-->
      <el-form-item prop="portFlag" label="端口扫描">
        <el-checkbox v-model="dataForm.portFlag" :true-label="1" :false-label="0">端口扫描</el-checkbox>
      </el-form-item>
      <el-form-item v-if="dataForm.portFlag==1" prop="scanPorts" label="扫描端口">
        <textarea style="width: 560px;height: 100px" v-model="dataForm.scanPorts" placeholder="扫描端口"></textarea>
      </el-form-item>
      <el-form-item v-if="dataForm.portFlag==1" label="端口类型">
        <el-select
            v-model="dataForm.scanPortsStr"
            placeholder="端口类型"
            clearable
            class="filter-item"
            @change="putPorts"
        >
          <el-option label="-- 请选择端口 --" value=""/>
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
        }}
      </el-button>
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
        hosts: "",
        subDomainFlag: "",
        portFlag: "",
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
        this.dataForm.subDomainFlag = 1;
        this.dataForm.portFlag = 1;
        if (this.dataForm.unitId) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http
          .get(`/scan/project/info/${this.dataForm.unitId}`)
          .then(({data: res}) => {
            if (res.code != 200) {
              return this.$message.error(res.msg);
            }
            this.dataForm = {
              ...this.dataForm,
              ...res.data,
            };
          })
          .catch(() => {
          });
    },
    queryDictList() {
      this.$http
          .get(`/sys/dict/list?type=appoint_port_type`)
          .then(({data: res}) => {
            if (res.code != 200) {
              return this.$message.error(res.msg);
            }
            this.portList = res.data || [];
          })
          .catch(() => {
          });
    },
    putPorts() {
      this.dataForm.scanPorts = this.dataForm.scanPortsStr
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
        function () {
          this.$refs["dataForm"].validate((valid) => {
            if (!valid) {
              return false;
            }
            if (this.dataForm.portFlag == 0) {
              this.dataForm.scanPorts = "";
            }
            let url = this.dataForm.unitId ? "/scan/project/update" : "/scan/project/saveProject";
            this.$http
                .post(url, this.dataForm, {emulateJSON: true})
                .then(({data: res}) => {
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
                .catch(() => {
                });
          });
        },
        1000,
        {leading: true, trailing: false}
    ),
  },
};
</script>
