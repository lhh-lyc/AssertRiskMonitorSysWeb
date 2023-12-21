<template>
  <el-card shadow="never" class="aui-card--fill">
    <div>
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>配置漏洞扫描服务信息</span>
              <el-button style="float: right; padding: 3px 3px" type="text" @click="saveServer">保存</el-button>
              <el-button style="float: right; padding: 3px 3px" type="text" @click="open">详情</el-button>
            </div>
            <el-form label-width="100px">
              <el-form-item label="服务名称">
                <el-input
                    type="textarea"
                    :rows="4"
                    v-model="serverNames">
                </el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import {saveServer, getServerInfo} from './../../../api/sys/setting'
export default {
  data () {
    return {
      serverNames: '',
      serverInfo: ''
    }
  },
  mounted(){
    this.getServerInfo(0);
  },
  methods: {
    open() {
      this.getServerInfo(1);
    },
    getServerInfo (type) {
      getServerInfo().then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.serverNames = res.data.replace(/,/g, '\n')
        if (type==1) {
          this.serverInfo = res.data
          this.$alert(this.serverInfo, '服务信息', {
            confirmButtonText: '确定',
          });
        }
      }).catch(() => {
      });
    },
    saveServer () {
      let params = {
        serverNames: this.serverNames.trim(),
      }
      saveServer(Object.assign(params)).then(({data: res}) => {
        if (res.code != 200) {
          return this.$message.error(res.msg);
        }
        this.$message({
          message: this.$t("prompt.success"),
          type: "success",
          duration: 500,
        });
      }).catch(() => {
      });
    }
  }
}
</script>
