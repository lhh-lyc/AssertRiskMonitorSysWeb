<template>
  <el-dialog
    :modal-append-to-body="false"
    :visible.sync="visible"
    title="企业档案"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
  >
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="tab0"></el-tab-pane>
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="'tab' + index"
        :label="item.name + item.num"
        :name="'tab' + item.value"
      ></el-tab-pane>
    </el-tabs>
    <!-- 基本信息 -->
    <div class="tab-content" v-show="activeName == 'tab0'">
      <div class="edit-btn">
        <el-button type="primary" @click="clickBtn(0)">
          {{ infoOption[0] == 0 ? "修改数据" : "取消修改" }}
        </el-button>
      </div>
      <div style="width: 100%; height: 40px"></div>
      <div v-if="!checkShowInfo(0)">
        <el-row>
          <el-col
            :span="12"
            v-for="(item, index) in infoArr[0]"
            :key="index + 'infoArr'"
          >
            <el-row>
              <el-col :span="10" class="info-name">{{ item.name }}</el-col>
              <el-col :span="14" class="info-value" :title="unit[item.value]">
                <span v-if="item.type != 'radio'">{{ unit[item.value] }}</span>
                <el-radio
                  v-model="unit[item.value]"
                  v-if="item.type == 'radio'"
                  label="1"
                  disabled
                  >是</el-radio
                >
                <el-radio
                  v-model="unit[item.value]"
                  v-if="item.type == 'radio'"
                  label="0"
                  disabled
                  >否</el-radio
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div v-if="checkShowInfo(0)">
        <el-row>
          <el-col
            :span="12"
            v-for="(item, index) in infoArr[0]"
            :key="index + 'infoArr2'"
          >
            <el-row>
              <el-col :span="8" class="info-name">
                <span :class="item.require ? 'require' : ''">{{
                  item.name
                }}</span>
              </el-col>
              <el-col :span="16" class="info-value">
                <input
                  class="form-control"
                  style="width: 90%"
                  :maxlength="item.maxLength"
                  v-if="item.type == 'inputText'"
                  v-model="unit[item.value]"
                  :placeholder="'请输入' + item.name"
                />
                <el-input-number
                  style="width: 90%"
                  :min="item.min"
                  :max="item.max"
                  :maxlength="item.maxLength"
                  v-if="item.type == 'inputNum'"
                  v-model="unit[item.value]"
                  :step="1"
                  step-strictly
                >
                </el-input-number>
                <el-radio
                  v-model="unit[item.value]"
                  v-if="item.type == 'radio'"
                  label="1"
                  >是</el-radio
                >
                <el-radio
                  v-model="unit[item.value]"
                  v-if="item.type == 'radio'"
                  label="0"
                  >否</el-radio
                >
                <el-select
                  style="width: 90%"
                  v-if="item.type == 'select'"
                  v-model="unit[item.value]"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="it in option[item.value]"
                    :key="it[item.optionValue]"
                    :label="it[item.optionName]"
                    :value="it[item.optionValue]"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div
        style="text-align: center; margin-top: 30px"
        v-if="infoOption[0] == 1 && activeName == 'tab0'"
      >
        <el-button type="primary" @click="saveOrUpdate()">保存</el-button>
      </div>
    </div>
    <!-- 非基本信息 -->
    <div
      class="tab-content"
      v-for="(tabItem, index) in tabList"
      v-show="activeName == 'tab' + tabItem.value"
      :key="'content' + index"
    >
      <div class="content">
        <div class="edit-btn">
          <el-button type="primary" @click="clickBtn(tabItem.value)"
            >{{ infoOption[tabItem.value] == 0 ? "修改数据" : "取消修改" }}
          </el-button>
        </div>
        <div style="width: 100%; height: 40px"></div>
        <div v-if="!checkShowInfo(tabItem.value)">
          <el-row
            v-for="(item, index) in infoArr[tabItem.value]"
            v-show="index % 2 == 0"
            :key="'infoArr1' + index"
          >
            <el-col :span="12">
              <el-row>
                <el-col :span="10" class="info-name" :title="item.name"
                  ><span style="whitespace: pre-wrap">{{ item.name }}</span>
                </el-col>
                <el-col :span="14" class="info-value2">
                  <div
                    class="fileItem"
                    v-for="(fileItem, index) in fileLists[
                      'fileList' + item.value
                    ]"
                    :key="'fileLists1' + index"
                  >
                    <div style="float: left">
                      <a @click="downloadFile(fileItem)"
                        >{{ fileItem.name }}&nbsp;</a
                      >
                    </div>
                    <br />
                  </div>
                  <div
                    class="form-group"
                    v-show="fileLists['fileList' + item.value].length == 0"
                    style="margin-bottom: 0px"
                  >
                    ---
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :span="12"
              v-if="!isBlank(infoArr[tabItem.value][index + 1])"
            >
              <el-row>
                <el-col :span="10" class="info-name" :title="infoArr[tabItem.value][index + 1].name"
                  ><span>{{ infoArr[tabItem.value][index + 1].name }}</span>
                </el-col>
                <el-col :span="14" class="info-value2">
                  <div
                    class="fileItem"
                    v-for="(fileItem, index) in fileLists[
                      'fileList' + infoArr[tabItem.value][index + 1].value
                    ]"
                    :key="'infoArr2' + index"
                  >
                    <div style="float: left">
                      <a @click="downloadFile(fileItem)"
                        >{{ fileItem.name }}&nbsp;</a
                      >
                    </div>
                  </div>
                  <div
                    class="form-group"
                    v-show="
                      fileLists[
                        'fileList' + infoArr[tabItem.value][index + 1].value
                      ].length == 0
                    "
                    style="margin-bottom: 0px"
                  >
                    ---
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <!-- 修改 -->
        <div v-if="checkShowInfo(tabItem.value)">
          <el-row
            v-for="(item, index) in infoArr[tabItem.value]"
            v-show="index % 2 == 0"
            :key="'infoArr2' + index"
          >
            <el-col :span="12">
              <el-row>
                <el-col :span="10" class="info-name"
                  ><span
                    :class="item.require ? 'require' : ''"
                    style="whitespace: pre-wrap"
                    >{{ item.name }}</span
                  >
                </el-col>
                <el-col :span="14" class="info-value2">
                  <div
                    class="upLoadClass"
                    @click="openUploadFile(item.value)"
                    :titles="item.name"
                  >
                    <input type="button" value="选择" class="btn" />
                  </div>
                  <div
                    class="fileItem"
                    v-for="(fileItem, index) in fileLists[
                      'fileList' + item.value
                    ]"
                    :key="'fileItem3' + index"
                  >
                    <div style="float: left">
                      <a @click="downloadFile(ffileItem)"
                        >{{ fileItem.name }}&nbsp;</a
                      >
                    </div>
                    <div class="status" style="float: left; cursor: pointer">
                      <i
                        class="el-icon-delete"
                        style="color: red"
                        title="删除"
                        @click="delFile(fileItem)"
                      ></i>
                    </div>
                    <br />
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :span="12"
              v-if="!isBlank(infoArr[tabItem.value][index + 1])"
            >
              <el-row>
                <el-col :span="10" class="info-name"
                  ><span
                    :class="
                      infoArr[tabItem.value][index + 1].require ? 'require' : ''
                    "
                    >{{ infoArr[tabItem.value][index + 1].name }}</span
                  >
                </el-col>
                <el-col :span="14" class="info-value2">
                  <div
                    class="upLoadClass"
                    @click="
                      openUploadFile(infoArr[tabItem.value][index + 1].value)
                    "
                    :titles="item.name"
                  >
                    <input type="button" value="选择" class="btn" />
                  </div>
                  <div
                    class="fileItem"
                    v-for="(fileItem, index) in fileLists[
                      'fileList' + infoArr[tabItem.value][index + 1].value
                    ]"
                    :key="'fileItem4' + index"
                  >
                    <div style="float: left">
                      <a @click="downloadFile(fileItem)" download="your-foo.txt"
                        >{{ fileItem.name }}&nbsp;</a
                      >
                    </div>
                    <div class="status" style="float: left; cursor: pointer">
                      <i
                        class="el-icon-delete"
                        style="color: red"
                        title="删除"
                        @click="delFile(fileItem)"
                      ></i>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 弹窗, 上传文件 -->
    <upload
      v-if="uploadVisible"
      ref="upload"
      @refreshDataList="reload"
    ></upload>
  </el-dialog>
</template>

<script>
import debounce from "lodash/debounce";
import Upload from "./unit-upload";
import { isBlank, checkPhone } from "@/utils/common.js";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      visible: false,
      uploadVisible: false,
      activeName: "tab0",
      infoOption: [0, 0, 0, 0, 0, 0, 0],
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
      },
      tabList: [],
      unit: {},
      infoArr: [],
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      // 存放17个附件
      fileLists: {
        fileList1: [], // 三同时验收信息安全专题
        fileList2: [], // 项目批复/三同时验收信息安全专题
        fileList3: [], // 安全设施设计专篇
        fileList4: [], // 工艺来源信息
        fileList5: [], // 安全预评价
        fileList6: [], // 试生产方案
        fileList7: [], // 安全验收评价
        fileList8: [], // 安全现状评价
        fileList9: [], // 本质安全诊断
        fileList10: [], // 消防验收
        fileList11: [], // 安全组织架构
        fileList12: [], // 安全生产责任制
        fileList13: [], // 安全生产规章制度
        fileList14: [], // 安全操作规程
        fileList15: [], // 反应风险评估
        fileList16: [], // 安全风险评估报告(政府填写)
        fileList17: [], // 营业执照
        fileList18: [], //
        fileList20: [], //
        fileList21: [], //
        fileList23: [], //
        fileList24: [], //
        fileList25: [], //
        fileList26: [], //
        fileList27: [], //
        fileList28: [], //
        fileList30: [], //
        fileList31: [], //
        fileList32: [], //
        fileList33: [], //
        fileList34: [], //
        fileList37: [], //
        fileList38: [], //
        fileList39: [], //
        fileList40: [], //
        fileList41: [], //
        fileList43: [], //
        fileList44: [], //
        fileList45: [], //
        fileList46: [], //
        fileList47: [], //
        fileList49: [], //
        fileList50: [], //
        fileList51: [], //
        fileList52: [], //
        fileList53: [], //
        fileList54: [], //
        fileList55: [], //
        fileList56: [], //
        fileList57: [], //
      },
    };
  },
  computed: {},
  created() {
    let infoArr0 = [
      {
        name: "企业名称",
        value: "name",
        type: "inputText",
        maxLength: 50,
        require: true,
      },
      {
        name: "行业类别",
        value: "industry",
        type: "inputText",
        maxLength: 50,
        require: true,
      },
      {
        name: "行业代码",
        value: "industryCode",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "社会统一信用代码",
        value: "socialCreditCode",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "单位注册地址",
        value: "address",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "生产设施地址",
        value: "deviceAddress",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "生产线条数",
        value: "produceLineNum",
        type: "inputNum",
        maxLength: 5,
        require: false,
      },
      {
        name: "生产线名称",
        value: "produceLineNames",
        type: "inputText",
        maxLength: 512,
        require: false,
      },
      {
        name: "是否有锅炉",
        value: "hasBoiler",
        type: "radio",
        maxLength: 1,
        require: false,
      },
      {
        name: "锅炉规模",
        value: "boilerScale",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "企业环保部门负责人",
        value: "headOfEnvironment",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "企业环保部门联系人联系电话",
        value: "headOfEnvironmentPhone",
        type: "inputText",
        maxLength: 15,
        require: false,
      },
      {
        name: "企业环保部门联系人电子邮箱",
        value: "headOfEnvironmentEmail",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "法定代表人",
        value: "legalRepresentative",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
      {
        name: "法定代表人联系号码",
        value: "statutoryContact",
        type: "inputText",
        maxLength: 50,
        require: false,
      },
    ];
    let infoArr1 = [
      {
        name: "营业执照",
        value: "2",
        require: false,
      },
      {
        name: "登记表网上备案文件",
        value: "4",
        require: false,
      },
      {
        name: "环境影响评价报告书/报告表批复文件",
        value: "3",
        require: false,
      },
      {
        name: "环境影响评价报告书/报告表全本",
        value: "5",
        require: false,
      },
      {
        name: "环境保护设施验收批复、自主验收文件、验收监测（调查）报告",
        value: "6",
        require: false,
      },
    ];
    let infoArr2 = [
      {
        name: "排污许可证正本",
        value: "8",
        require: false,
      },
      {
        name: "排污许可证副本",
        value: "9",
        require: false,
      },
      {
        name: "执行报告",
        value: "53",
        require: false,
      },
      {
        name: "自行监测方案",
        value: "54",
        require: false,
      },
      {
        name: "环境管理台账",
        value: "55",
        require: false,
      },
      {
        name: "生产设施及污染物治理设施运行情况",
        value: "56",
        require: false,
      },
      {
        name: "监测报告",
        value: "57",
        require: false,
      },
    ];
    let infoArr3 = [
      {
        name: "污染治理设施设计方案及工艺流程图",
        value: "11",
        require: false,
      },
      {
        name: "污染治理设施运行维护记录",
        value: "13",
        require: false,
      },
      {
        name: "污染治理设施加药记录",
        value: "14",
        require: false,
      },
      {
        name: "污染治理设施活性炭更换记录",
        value: "15",
        require: false,
      },
      {
        name: "在线监测设备的安装、验收、使用情况",
        value: "17",
        require: false,
      },
      {
        name: "在线监测设备的定期校验资料",
        value: "18",
        require: false,
      },
    ];
    let infoArr4 = [
      {
        name: "固体废物申报登记及转移记录",
        value: "20",
        require: false,
      },
      {
        name: "与有资质单位签订的危险废物处置合同",
        value: "21",
        require: false,
      },
      {
        name: "危险废物产生环节记录表",
        value: "23",
        require: false,
      },
      {
        name: "危险废物贮存环节记录表",
        value: "24",
        require: false,
      },
      {
        name: "危险废物内部利用/处置情况记录表",
        value: "25",
        require: false,
      },
      {
        name: "月度危险废物台账报表",
        value: "26",
        require: false,
      },
      {
        name: "危险废物贮存场所及设置相应警示标志的标签和照片",
        value: "27",
        require: false,
      },
      {
        name: "危险废物应急预案",
        value: "28",
        require: false,
      },
      {
        name: "危险废物管理组织架构",
        value: "30",
        require: false,
      },
      {
        name: "危险废物管理制度",
        value: "31",
        require: false,
      },
      {
        name: "危险废物公开制度",
        value: "32",
        require: false,
      },
      {
        name: "危险废物培训制度",
        value: "33",
        require: false,
      },
      {
        name: "危险废物档案管理制度",
        value: "34",
        require: false,
      },
    ];
    let infoArr5 = [
      {
        name: "环境应急预案",
        value: "37",
        require: false,
      },
      {
        name: "环境风险评估报告",
        value: "38",
        require: false,
      },
      {
        name: "环境应急资源调查报告",
        value: "39",
        require: false,
      },
      {
        name: "专家评审意见",
        value: "40",
        require: false,
      },
      {
        name: "环保部门备案意见",
        value: "41",
        require: false,
      },
      {
        name: "环境应急培训",
        value: "43",
        require: false,
      },
      {
        name: "环境应急演练方案",
        value: "44",
        require: false,
      },
      {
        name: "环境应急培训的照片和总结",
        value: "45",
        require: false,
      },
      {
        name: "环境安全隐患排查治理档案",
        value: "46",
        require: false,
      },
      {
        name: "环境污染强制责任保险资料",
        value: "47",
        require: false,
      },
    ];
    let infoArr6 = [
      {
        name: "重点企业清洁生产审核报告及验收文件",
        value: "49",
        require: false,
      },
      {
        name: "企业环保管理责任架构图",
        value: "50",
        require: false,
      },
      {
        name: "其他环保管理制度",
        value: "51",
        require: false,
      },
      {
        name: "行政处罚、限期改正通知及整改台账",
        value: "52",
        require: false,
      },
    ];
    this.infoArr = [
      infoArr0,
      infoArr1,
      infoArr2,
      infoArr3,
      infoArr4,
      infoArr5,
      infoArr6,
    ];
  },
  mounted() {},
  methods: {
    init() {
      this.visible = true;
      this.activeName = "tab0";
      this.infoOption = [0, 0, 0, 0, 0, 0, 0];
      this.$nextTick(() => {
        if (this.dataForm.unitId) {
          this.queryListAll(); // 获取tab列表信息
          this.getUnitInfo(); // 获取企业基本信息
          this.getFiles2(); // 获取企业下所有的附件
        }
      });
    },
    // 附件上传后，重新加载页面数据
    reload() {
      this.queryListAll(); // 获取tab列表信息
      this.getFiles2(); // 获取企业下所有的附件
    },
    isBlank(obj) {
      if (obj === undefined || obj === null || obj === "") {
        return true;
      } else {
        return false;
      }
    },
    handleClick(tab, event) {
    },
    // 获取tab列表信息
    queryListAll() {
      this.$http
        .get(`/sys/unit/file/getUnitFilesNum?unitId=${this.dataForm.unitId}`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.tabList = res.data || [];
          // if (this.tabList && this.tabList.length > 0) {
          //   this.tabList.forEach(function () {
          //     this.infoOption.push(0);
          //   });
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
    // 点击修改数据按钮
    clickBtn: function (index) {
      if (index == 0) {
        this.$http
          .get(`/cm/unit/info/${this.dataForm.unitId}`)
          .then(({ data: res }) => {
            if (res.code != 200) {
              return this.$message.error(res.msg);
            }
            this.unit = res.data;
            if (
              this.unit.hasBoiler !== undefined &&
              this.unit.hasBoiler !== null &&
              this.unit.hasBoiler !== ""
            ) {
              this.unit.hasBoiler = this.unit.hasBoiler + "";
            }
          })
          .catch(() => {});
      }
      if (this.infoOption[index] == 0) {
        this.infoOption[index] = 1;
      } else {
        this.infoOption[index] = 0;
      }
      this.$forceUpdate(); // 强制刷新
    },
    // 改变当前修改数据按钮的状态
    checkShowInfo: function (index) {
      // isInfo 0:展示修改操作 1展示info信息
      let that = this;
      if (that.infoOption[index] == 1) {
        return true;
      }
      return false;
    },
    getUnitInfo: function () {
      this.$http
        .get(`/cm/unit/info/${this.dataForm.unitId}`)
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.unit = res.data;
          if (
            this.unit.hasBoiler !== undefined &&
            this.unit.hasBoiler !== null &&
            this.unit.hasBoiler !== ""
          ) {
            this.unit.hasBoiler = this.unit.hasBoiler + "";
          }
        })
        .catch(() => {});
    },
    validator: function () {
      if (isBlank(this.unit.name))
      {
        this.$message({
          message: "企业名称不能为空！",
          type: "error",
          duration: 1000,
        });
        return true;
      }
      if (isBlank(this.unit.industry))
      {
        this.$message({
          message: "行业类别不能为空！",
          type: "error",
          duration: 1000,
        });
        return true;
      }
      if (
        !isBlank(this.unit.socialCreditCode) &&
        this.unit.socialCreditCode.length != 18
      ) {
        this.$message({
          message: "长度不合法！信用代码为18位！",
          type: "error",
          duration: 1000,
        });
        return true;
      }
      if (
        !isBlank(this.unit.headOfEnvironmentPhone) &&
        !checkPhone(this.unit.headOfEnvironmentPhone)
      ) {
        this.$message({
          message: "企业环保部门负责人联系方式格式不正确！",
          type: "error",
          duration: 1000,
        });
        return true;
      }
      if (
        !isBlank(this.unit.statutoryContact) &&
        !checkPhone(this.unit.statutoryContact)
      ) {
        this.$message({
          message: "法定代表人联系号码格式不正确！",
          type: "error",
          duration: 1000,
        });
        return true;
      }
      return false;
    },
    saveOrUpdate: function () {
      var that = this;
      if (that.validator()) {
        return;
      }
      let url = that.unit.unitId == null ? "/cm/unit/save" : "/cm/unit/update";
      this.$http
        .post(url, this.unit, { emulateJSON: true })
        .then(({ data: res }) => {
          if (res.code != 200) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              that.infoOption[0] = 0;
              this.$emit("refreshDataList");
              that.$forceUpdate();
            },
          });
        })
        .catch(() => {});
    },
    // 获取企业下所有的附件
    getFiles2: function () {
      let that = this;
      for (let key in that.fileLists) {
        that.fileLists[key] = [];
      }
      this.$http
        .get(`/sys/unit/file/getFiles?unitId=` + this.dataForm.unitId)
        .then(({ data: r }) => {
          if (r.code != 200) {
            return this.$message.error(res.msg);
          }
          let flag = true;
          if (!isBlank(r.data)) {
            r.data.forEach(function (item) {
              let i = that.fileLists["fileList" + item.fileTypeId].length;
              if (i == 0) {
                let file = {
                  path: item.fileUrl,
                  name: item.fileName,
                  uniqueCode: item.uniqueCode,
                  fileTypeId: item.fileTypeId,
                  fileOrgName: item.fileOrgName,
                };
                that.fileLists["fileList" + item.fileTypeId].push(file);
              } else {
                while (i--) {
                  if (
                    that.fileLists["fileList" + item.fileTypeId][i]
                      .fileOrgName === item.fileOrgName
                  ) {
                    flag = false;
                    return;
                  }
                }
                if (flag) {
                  let file = {
                    path: item.fileUrl,
                    name: item.fileName,
                    uniqueCode: item.uniqueCode,
                    fileTypeId: item.fileTypeId,
                    fileOrgName: item.fileOrgName,
                  };
                  that.fileLists["fileList" + item.fileTypeId].push(file);
                }
              }
            });
          }
        })
        .catch(() => {});
    },
    // 上传文件
    openUploadFile(fileTypeId) {
      this.uploadVisible = true;
      this.$nextTick(() => {
        this.$refs.upload.init(this.dataForm.unitId, fileTypeId);
      });
    },
    downloadFile: function (fileItem) {
      var URL = `${window.SITE_CONFIG["fileURL"]}${fileItem.fileOrgName}`;
      window.open(URL);
    },
    // 删除
    delFile(data) {
      this.$confirm(
        this.$t("prompt.info", { handle: this.$t("delete") }),
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let delFile = {
            uniqueCode: data.uniqueCode,
            fileOrgName: data.fileOrgName,
          };
          this.$http
            .post("/common/upload/deleteFile", delFile, { emulateJSON: true })
            .then(({ data: res }) => {
              if (res.code != 200) {
                return this.$message.error(res.msg);
              }
              this.$message({
                message: this.$t("prompt.success"),
                type: "success",
                duration: 500,
                onClose: () => {
                  this.reload();
                },
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.tab-content {
  width: 100%;
  height: auto;
  min-height: 500px;
  position: relative;
}

.edit-btn {
  display: inline-block;
  height: auto;
  width: auto;
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 10000;
}

.info-name {
  font-weight: bold;
  line-height: 40px;
  text-align: right;
  padding-right: 10px;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // margin-bottom: 10px;
}

.info-value {
  line-height: 40px;
  padding-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.info-value2 {
  line-height: 32px;
  padding-left: 10px;
  margin-bottom: 10px;
}

.content {
  height: 80%;
  min-height: 500px;
  font-size: 15px;
}

.require:after {
	content: "*";
	color: red;
	vertical-align: middle;
}
</style>
