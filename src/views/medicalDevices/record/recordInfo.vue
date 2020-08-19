<style lang="sass">
  .brN .is-leaf {
    border-right: 0;
  }

  .brN tr td {
    border-right: 0;
  }

  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }

  .brN .el-table__header-wrapper {
    display: none;
  }

  .firsTeit .el-table__header-wrapper {
    display: block;
  }

  .mT35 .el-table {
    border-top: none !important;
  }

  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }
</style>
<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)"
       class="user-box">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;" v-if="patrolType=='DAILY'">日常巡查记录详情</span>
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;" v-if="patrolType=='SPECIAL'">专项巡查记录详情</span>
    </div>
    <div class="container" @click="ifbig('-1')">
      <!-- 左边信息悬浮栏 -->
      <div class="left-info">
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress"
              :key="index">
            <p class="floatL left">{{item.title}}</p>
          </li>
        </ul>
      </div>
      <!-- 左边信息悬浮栏 end-->
      <div class="right-info">
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <!-- 基本信息 -->
          <toggle-form title="基本信息">
            <div class="content" v-if="basicInfoData">
              <div class="row">
                <el-form-item label="主体名:" prop="">
                  <span>{{basicInfoData.entityName}}</span>
                  <a href="javascript:;" @click="goEntityDatail">进入该主体档案</a>
                </el-form-item>
              </div>
              <div class="row" v-if="patrolType != 'REPATROL'">
                <el-form-item label="巡查记录编号:" prop="">
                  <span>{{basicInfoData.patrolRecordNo}}</span>
                </el-form-item>
              </div>
              <div class="row" v-if="patrolType == 'REPATROL'">
                <el-form-item label="复查记录编号:" prop="">
                  <span>{{basicInfoData.repatrolRecordNo}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="社会信用代码:" prop="">
                  <span>{{basicInfoData.creditCode}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="专项检查名称:" prop="" v-if="patrolType=='SPECIAL'">
                  <span>{{basicInfoData.patrolPlanName}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="许可备案号:" prop="" v-if="basicInfoData.backupNo">
                  <span>{{basicInfoData.backupNo}}</span>
                </el-form-item>
                <el-form-item label="主体类型:" prop="">
                  <span>{{basicInfoData.entityTypeStr}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item :label="categoryLabel" prop="">
                  <span>{{basicInfoData.category}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="经营地址:" prop="">
                  <span v-if="basicInfoData.realityAddr != ''">{{basicInfoData.realityAddr}}</span>
                  <span v-else>{{basicInfoData.registerAddr}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="巡查地址:" prop="">
                  <span v-if="patrolRecordAddressIsShow">{{basicInfoData.patrolRecordAddress.address}}</span>
                  <span v-else>暂无</span>
                  <el-button v-if="patrolRecordAddressIsShow" type="text" @click="mapAddressVisible = true">巡查坐标
                  </el-button>
                  <el-dialog v-if="patrolRecordAddressIsShow" :visible.sync="mapAddressVisible"
                             :modal-append-to-body="false" width="60%">
                    <slot slot="title">
                      {{basicInfoData.entityName}} <br/> {{basicInfoData.patrolRecordAddress.address}}
                    </slot>
                    <div style="height: 300px;">
                      <address-map v-if="patrolRecordAddressIsShow" :lng="basicInfoData.patrolRecordAddress.lng"
                                   :lat="basicInfoData.patrolRecordAddress.lat">
                      </address-map>
                    </div>
                  </el-dialog>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="巡查时间:" prop="">
                  <span>{{basicInfoData.patrolTime}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item :label="$route.query.patrolAreaCode.length > 6?'监管人员:':'检查人员:'" prop="">
                  <span>{{basicInfoData.checkNames}}</span>
                </el-form-item>

                <el-form-item label="信息员:" prop="" v-if="$route.query.patrolAreaCode.length > 6">
                  <span>{{basicInfoData.accompanyNames}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="检查部门:" prop="">
                  <span>{{basicInfoData.deptName}}</span>
                </el-form-item>
              </div>
            </div>
          </toggle-form>

          <!-- 巡查项 -->
          <toggle-form title="巡查项">
            <div class="mT35" v-if="patrolData">
              <el-row>
                <el-form label-width="90px" size="mini">
                  <el-form-item label="检查要点表:" v-if="basicInfoData && basicInfoData.tableName" style="margin-bottom: 5px;width: 80%">
                    {{basicInfoData.tableName}}
                  </el-form-item>

                  <el-form-item label="查看模式:">
                    <el-select @change="getPatrolContext" class="" v-model="contextType">
                      <el-option key="SIMPLIFY" label="精简模式" value="SIMPLIFY"></el-option>
                      <el-option key="NORMAL" label="普通模式" value="NORMAL"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-row>

              <el-table :key="item.pno" v-for="(item,index) in patrolData" :class="index==0?'firsTeit':''"
                        :data="item.conList" :span-method="objectSpanMethod"
                        border class="table-div brN">
                <el-table-column show-overflow-tooltip label="检查项编号" width="100">
                  <template slot-scope="scope">
                    <span>{{item.pno}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="巡查项目" width="120">
                  <template slot-scope="scope">
                    <span>{{item.name}}</span>
                  </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="巡查内容编号" width="120">
                  <template slot-scope="scope">
                    <span>{{item.pno}}.{{scope.row.cno}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="context" label="巡查内容" width="250"></el-table-column>
                <el-table-column show-overflow-tooltip label="是否重点项" width="80">
                  <template slot-scope="scope">
                    {{scope.row.important == 'YES' ? '是':'否'}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip label="是否通过" width="120">
                  <template slot-scope="scope">
                    {{scope.row.isSuit == 'YES' ? '检查通过':scope.row.isSuit == 'NO'?'检查不通过':'未检查'}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>

                <el-table-column label="附件" width="160">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top-start" v-if="scope.row.fileList.length>0" >
                      <p v-for="files in scope.row.fileList" @click="showPic(files.fileId)">
                        <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
                          {{files.fileName.length>24?(files.fileName.substring(0,12)+'...'+files.fileName.substring(files.fileName.length-12,files.fileName.length)):files.fileName}}
                        </a>
                      </p>
                      <div slot="reference">附件列表</div>
                    </el-popover>
                    <span v-else>无</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </toggle-form>

          <!-- 巡查结果 -->
          <toggle-form title="巡查结果">
            <div class="content" v-if="resultData">
              <div class="row ml30" style="margin-left: 40px;">
                <span style="color: #6D7787;">本次巡查重点项<span>{{resultData.impItem}}</span>项，一般项<span>{{resultData.simItem}}</span>项，共{{resultData.impItem + resultData.simItem}}项</span>
              </div>
              <div class="row result ml30">
                <div class="item">
                  <div class="number">{{resultData.impUnqua}}</div>
                  <div class="project-name">重点项不合格</div>
                </div>
                <div class="item">
                  <div class="number">{{resultData.simUnqua}}</div>
                  <div class="project-name">一般项不合格</div>
                </div>
              </div>
              <div class="row ml30" style="margin: 20px 0">
                <span style="font-size: 18px;color: #393939;">企业得分：</span><span
                style="color: #0DB5EF;font-size: 18px; "><span>
                  {{resultData.qualified}}</span>分</span>
                <span
                  style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{basicInfoData.score}}分，此评分仅供参考）</span>
              </div>
              <div class="row">
                <el-form-item label="巡查结果：" prop="">
                  <span>{{basicInfoData.resultStr}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="处理方式：" prop="">
                  <span>{{basicInfoData.treatStr}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="备注：" prop="">
                  <span class="over-y">{{basicInfoData.treatRemark ? basicInfoData.treatRemark : '无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="上传图片：" prop="">
                  <div class="imgbox" v-if="basicInfoData.upfileList.length >= 1">
                    <div v-for="(item,index) in basicInfoData.upfileList" @click.stop="ifbig(item.fileId)"
                         class="imgdiv">
                      <img :src="pathFile + item.fileId" alt="">
                      <span>预览</span>
                    </div>
                  </div>
                  <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                    <img :src="bigImgSrc">
                  </div>
                  <div v-if="basicInfoData.upfileList.length == 0">
                    <span>无</span>
                  </div>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="风险分级：" prop="">
                  <span>{{basicInfoData.otherQuanrifyStr ? basicInfoData.otherQuanrifyStr : '无'}}</span>
                </el-form-item>
              </div>

              <div class="row mRno">
                <el-form-item label="企业电子签名：" prop="">
                  <span v-if="basicInfoData.isCooperate == 'YES'">企业配合</span>
                  <span v-else>企业拒绝配合</span>
                  <div v-if="basicInfoData.isCooperate == 'YES'" @click.stop="ifbigq()" class="imgdiv"
                       :class="ifbigqy?'imgbig':''">
                    <img :src="pathFile + basicInfoData.signList" alt="">
                    <span>预览</span>
                  </div>
                </el-form-item>
              </div>
            </div>
          </toggle-form>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button style="width:100px;" @click="back">返回</el-button>
        <el-button style="width:100px;" @click="printRecord(recordId, true)">打印预览</el-button>
        <el-button style="width:100px;" @click="printRecord(recordId, false)">打印</el-button>
      </div>
    </div>

    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="pathFile+this.picSrc" style="max-height: 500px;"/>
    </popup-pic>

    <!-- 打印 -->
    <PrintPatrol ref="PrintPatrol" :basicInfoData="basicInfoDataPrint" :messengers="messengersPrint"
                 :patrolData="patrolDataPrint"
                 :patrolContent="patrolContentPrint" :resultData="resultDataPrint"
                 :patrolType="patrolType == 'DAILY'? '日常监督抽查': '专项整治活动'"
                 :qrcodeId="qrcodeId"></PrintPatrol>
  </div>
</template>

<script type="module">
  import ToggleForm from "components/ToggleForm.vue";
  import qr from "components/QRcode.vue";
  import scroll from "utils/scroll";
  import addressMap from "views/patrol/project/patrolRecordAddressMap"
  import popupPic from 'components/popup/PopupPic';
  import {doPrintRecord} from 'utils/print/doPrint.js';
  import PrintPatrol from './PrintPatrol.vue';
  import * as recordInfoApi from "api/maai/record/recordDaily.js";

  export default {
    components: {
      ToggleForm,
      qr,
      addressMap,
      popupPic,
      PrintPatrol
    },
    mounted() {
      scroll.call(this, 'slideIndex', 0, 50);

      this.pathFile = this.$store.getters.filePath;

      this.recordId = this.$route.query.recordId;
      this.patrolType = this.$route.query.patrolType;
      this.initData();
      this.getPatrolContext();
    },
    methods: {
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        let rownum = 0;
        for (var i = 0; i < this.patrolData.length; i++) {
          if (this.patrolData[i].conList.indexOf(row) >= 0) {
            rownum = this.patrolData[i].conList.length;
            break;
          }
        }
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % rownum == 0) {
            return {
              rowspan: rownum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      ifbig(item) {
        let i = this.pathFile + item
        if (this.bigImgSrc == null || this.bigImgSrc != i) {
          this.bigImgSrc = i;
          this.showBigPic = true;
        } else {
          this.bigImgSrc = null;
        }
        if (item == -1) {
          this.showBigPic = false;
        }
      },
      ifbigq() {
        this.ifbigqy = !this.ifbigqy;
      },
      initData() {
        let datas = '';
        if (this.$route.query.type == 'review') {
          datas = 'sourceId=' + this.recordId + '&sourceType=' + this.patrolType;
        } else {
          datas = 'recordId=' + this.recordId + '&patrolType=' + this.patrolType;
        }
        recordInfoApi.getPatrolRecord(this.recordId).then(d => {
          this.basicInfoData = d.data.basic;
          this.resultData = d.data.statistics;
          this.basicInfoData.upfileList = d.data.upfileList;
          this.basicInfoData.checkNames = d.data.checkNames;
          this.basicInfoData.accompanyNames = d.data.accompanyNames;
          this.basicInfoData.signList = d.data.signList.length > 0 ? d.data.signList[0].fileId : '';
          this.basicInfoData.patrolRecordAddress = d.data.addMap || {};
          if (this.basicInfoData.patrolRecordAddress &&
            this.basicInfoData.patrolRecordAddress.address &&
            this.basicInfoData.patrolRecordAddress.lng &&
            this.basicInfoData.patrolRecordAddress.lat) {
            this.patrolRecordAddressIsShow = true
          }
        });
      },
      getPatrolContext() {
        let params = new FormData();
        params.append('type', this.contextType)
        recordInfoApi.getPatrolContext(this.recordId, params).then(d => {
          this.patrolData = d.data.reList;
        })
      },

      goEntityDatail() {
        const entityId = this.basicInfoData.entityId;
        let entityType = this.basicInfoData.entityType,
          routerName = "medicalDevices_sub." + entityType.substring(entityType.indexOf("_") + 1).toLowerCase() + ".detail";

        this.$router.push({
          // path: '/cosmetics/' + strType.toLowerCase() + '/archives/detail',
          name: routerName,
          query: {
            entityType: entityType,
            ext: 'INFO',
            entityId: entityId
          }
        })
      },

      back() {
        this.$router.go(-1);
      },
      //鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY - 10 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = content.fileList;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
      },
      //显示巡查项图片
      showPic(picSrc) {
        this.picSrc = picSrc;
        this.showPicIf = true;
      },
      //关闭巡查项图片
      closePopupBody() {
        this.showPicIf = false;
      },

      /* 打印 */
      async printInitData(id, type) {

        this.qrcodeId = id;
        await recordInfoApi.getPatrolRecord(id, type).then(d => {
          let name = this.$route.query.patrolType == 'DAILY' ? "日常监督检查" : "专项监督检查"
          this.resultDataPrint = d.data.basic;
          this.resultDataPrint.planName = d.data.basic.entityTypeStr + "日常监督检查";
          this.resultDataPrint.checkNames = d.data.checkNames;
          this.resultDataPrint.accompanyNames = d.data.accompanyNames;
          this.resultDataPrint.statistics = d.data.statistics;
          this.resultDataPrint.upfileList = d.data.signList.length > 0 ? d.data.signList[0].fileId : '';
        });
      },

      async printRecord(id, isPreview) {
        this.loading = true;
        await this.printInitData(id, this.patrolType);
        this.$refs.PrintPatrol.printStyle();
        setTimeout(() => {
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      }
    },

    computed: {
      categoryLabel: function () {
        return this.basicInfoData.entityTypeStr.substring(0, 2) + "类别:";
      }
    },

    data() {
      return {
        contextType: 'SIMPLIFY',
        infoTitle: "信息员:",
        noPassScore: 0,
        patrolRecordAddressIsShow: false,
        mapAddressVisible: false,
        slideIndex: -1,
        pathFile: "",
        checkboxGroup1: [],
        ruleForm: {
          name: "",
          checkboxGroup1: []
        },
        // 左边悬浮栏的数据
        progress: [
          {
            title: '基本信息'
          },
          {
            title: '巡查项'
          },
          {
            title: '巡查结果'
          }
        ],
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
        ifbigqy: false,
        recordId: null,
        patrolType: null,
        basicInfoData: null,
        patrolData: null,
        resultData: null,
        gross: 0,
        itemPicList: [],
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        accessoryListIf: false,
        showPicIf: false,
        picSrc: "",

        //打印
        printShow: false,
        qrcodeId: "",
        basicInfoDataPrint: {},
        messengersPrint: "",

        patrolDataPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentPrint: {
          normal: [],
          important: []
        },
        patrolDataInitPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInitPrint: {
          normal: [],
          important: []
        },
        resultDataPrint: {},

        recordDataPrint: {
          serialNumber: 123456789,
        },
        loading: false,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    margin-bottom: 200px;
  }

  $c: #0db5ef;
  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: 0;
    z-index: 2;
    .head-block {
      background: #F2F5F8;
      height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
      .num {
        color: $c;
      }
    }
    .main-block {
      // border-right: 2px solid #EBF1F5;
      // min-height: 470px;
      > li {
        border-right: 2px solid #EBF1F5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #F2F5F8;
        }
        .right {
          color: #A2AAB6;
        }
      }
      .activePosition {
        border-right: 2px solid $c;
        .left {
          color: $c
        }
      }
    }
  }

  // 左边悬浮信息栏的样式 end
  .right-info {
    width: calc(100% - 230px);
    margin-left: 230px;
    .content {
      width: 600px;
    }
  }

  .content {
    margin-top: 20px;

    a {
      background: #F6F7F8;
      border: 1px solid #C2CAD2;
      padding: 5px 19px;
      font-size: 14px;
      color: #393939;
      height: 30px;
      width: 136px;
      box-sizing: border-box;
      margin-left: 10px;
    }
  }

  .mT35 {
    margin-top: 35px;
  }

  .row .el-form-item {
    min-width: 250px;
  }

  .table-div {
    text-align: center;
  }

  .zj {
    border: 1px solid #ebeef5;
    border-top: 0;
    height: 44px;
    line-height: 44px;

    span:first-child {
      margin-left: 36px;
    }
    span:last-child {
      width: 85%;
      display: inline-block;
      text-align: center;
    }
  }

  .result {
    margin: 20px 0;
    width: 402px;
    height: 90px;
    border: 1px solid #C2CAD2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .number {
        font-size: 26px;
        color: #3B3B3B;
      }
      .project-name {
        font-size: 14px;
        color: #A2AAB6;
      }
    }
  }

  .imgbox {
    // display: flex;
    width: 650px;
    // overflow: hidden;
    margin-left: 100px;
  }

  .imgdiv {
    float: left;
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
    img {
      transition: all 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    span {
      display: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.40);
      border-radius: 0 0 5px 5px;
      font-size: 14px;
      color: #FFFFFF;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .imgbig {
    position: relative;
    z-index: 999;
    span {
      display: none !important;
    }
    img {
      transform: scale(2);
      border-radius: 0;
    }
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
  }

  .big-img {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    > img {
      display: block;
      max-height: 700px;
    }
  }
</style>
