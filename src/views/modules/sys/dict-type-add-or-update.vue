<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.id ? $t('add') : $t('update')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="140px"
    >
      <el-form-item prop="name" label="字典所属类型说明">
        <el-input
          v-model="dataForm.name"
          placeholder="字典所属类型说明"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="字典所属类型值">
        <el-input
            v-model="dataForm.type"
            placeholder="字典所属类型值"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="字典值说明">
        <el-input
            v-model="dataForm.code"
            placeholder="字典值说明"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="字典值">
        <el-input
            v-model="dataForm.value"
            placeholder="字典值"
        ></el-input>
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
        id: "",
        name: "",
        type: "",
      },
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
        type: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
      };
    },
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http
        .get(`/sys/dict/info/${this.dataForm.id}`)
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
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          let url = this.dataForm.id ? "/sys/dict/update" : "/sys/dict/save";
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
