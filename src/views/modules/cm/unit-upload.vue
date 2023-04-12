<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="visible"
    title="上传文件"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-upload
      :action="url"
      :file-list="fileList"
      drag
      multiple
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      class="text-center"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <!-- <div class="el-upload__tip" slot="tip">
        {{ $t("upload.tip", { format: "jpg、png、gif" }) }}
      </div> -->
    </el-upload>
    <div style="width: 100%; height: 80px"></div>
  </el-dialog>
</template>

<script>
import { getFolder } from "@/utils/common.js";
export default {
  data() {
    return {
      visible: false,
      url: "",
      num: 0,
      fileList: [],
      folder: "",
      unitId: "",
      fileTypeId: "",
    };
  },
  methods: {
    init(unitId, fileTypeId) {
      this.visible = true;
      this.folder = getFolder();
      this.url = `${window.SITE_CONFIG["apiURL"]}/common/upload/uploadFile?folder=${this.folder}`;
      this.num = 0;
      this.fileList = [];
      this.unitId = unitId;
      this.fileTypeId = fileTypeId;
    },
    // 上传之前
    beforeUploadHandle(file) {
      // if (
      //   file.type !== "image/jpg" &&
      //   file.type !== "image/jpeg" &&
      //   file.type !== "image/png" &&
      //   file.type !== "image/gif"
      // ) {
      //   this.$message.error(this.$t("upload.tip", { format: "jpg、png、gif" }));
      //   return false;
      // }
      // this.num++;
    },
    // 上传成功
    successHandle(res, file, fileList) {
      if (res.code != 200) {
        return this.$message.error(res.msg);
      }
      let saveFile = {};
      saveFile.fileUrl =
        window.SITE_CONFIG["apiURL"] + "/" + res.data[0].fileUrl;
      saveFile.fileName = res.data[0].fileOrgName;
      saveFile.unitId = this.unitId;
      saveFile.fileTypeId = this.fileTypeId;
      saveFile.fileSize = res.data[0].fileSize;
      saveFile.fileType = res.data[0].fileType;
      saveFile.fileOrgName = res.data[0].fileName;
      let url = "/sys/files/saveFile";
      this.$http
        .post(url, saveFile, { emulateJSON: true })
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
    },
  },
};
</script>
