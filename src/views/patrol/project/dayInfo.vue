<style lang="sass">
    .brN .is-leaf{
        border-right: 0;
    }
    .brN tr td{
        border-right: 0;
    }
    .brN tr td[colspan="1"]{
        border-right: 1px solid #ebeef5;
    }
    .brN tr:hover>td{
        background-color:#fff !important;
    }
    .mT35 .el-table__header-wrapper{
        display: none;
    }
    .firsTeit .el-table__header-wrapper{
        display: block;
    }
    .mT35 .el-table{
        border-top: none !important;
    }
    .mT35 .firsTeit{
        border-top: 1px solid #ebeef5!important;
    }
</style>
<template>
    <div v-loading="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
        <div style="margin-top:20px;border-left:3px solid #0DB5EF; margin-bottom: 20px;">
            <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;" v-if="patrolType=='DAILY'">检查记录详情</span>
            <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;" v-if="patrolType=='SPECIAL'">检查记录详情</span>
        </div>
        <div class="container" @click="ifbig(-1)">
        <!-- 左边信息悬浮栏 -->
      <div class="left-info">
            <ul class="main-block">
                <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
                    <p class="floatL left">{{item.title}}</p>
                </li>
            </ul>
        </div>
        <!-- 左边信息悬浮栏 end-->
        <div class="right-info">
            <el-button v-if="feedbackId" type="primary" @click="toDailyRecord">廉洁自律反馈记录</el-button>
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <!-- 基本信息 -->
                <toggle-form title="基本信息">
                    <div class="content" v-if="basicInfoData">
                        <div class="row">
                            <el-form-item label="主体名:" prop="">
                                <span>{{basicInfoData.entityName}}</span>
                                <a href="javascript:;" @click="ifType" v-auth="'food.biz.cb,food.biz.pb,food.biz.rb,food.biz.cfda'">进入该主体档案</a>
                            </el-form-item>
                        </div>
                        <div class="row" v-if="patrolType == 'REPATROL'">
                            <el-form-item label="复查记录编号:" prop="">
                                <span>{{basicInfoData.repatrolRecordNo}}</span>
                            </el-form-item>
                        </div>
                        <div class="row" v-if="patrolType == 'DAILY'">
                            <el-form-item label="检查记录编号:" prop="">
                                <span>{{basicInfoData.patrolRecordNo}}</span>
                            </el-form-item>
                        </div>
                        <div class="row" v-if="patrolType == 'SPECIAL'">
                          <el-form-item label="检查记录编号:" prop="">
                            <span>{{basicInfoData.patrolRecordNo}}</span>
                          </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="许可备案号:" prop="">
                                <span>{{basicInfoData.licenseNumber}}</span>
                            </el-form-item>
                            <el-form-item label="主体类型:" prop="">
                                <span>{{basicInfoData.entityTypeStr}}</span>
                            </el-form-item>
                        </div>

                        <div class="row">
                            <el-form-item label="经营地址:" prop="">
                                <span v-if="basicInfoData.spaceAddr != ''">{{basicInfoData.spaceAddr}}</span>
                                <span v-else>{{basicInfoData.spaceAddr}}</span>
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="检查地址:" prop="">
                                <span v-if="patrolRecordAddressIsShow">{{basicInfoData.patrolRecordAddress.address}}</span>
                                <span v-else>暂无</span>
                                <el-button v-if="patrolRecordAddressIsShow" type="text" @click="mapAddressVisible = true">巡查坐标</el-button>
                                <el-dialog
                                  v-if="patrolRecordAddressIsShow"
                                  :visible.sync="mapAddressVisible"
                                  :modal-append-to-body="false"
                                  width="60%">
                                  <slot slot="title">
                                      {{basicInfoData.entityName}} <br />
                                    {{basicInfoData.patrolRecordAddress.address}}
                                  </slot>
                                  <div style="height: 300px;">
                                    <address-map
                                      v-if="patrolRecordAddressIsShow"
                                      :lng="basicInfoData.patrolRecordAddress.lng"
                                      :lat="basicInfoData.patrolRecordAddress.lat">
                                    </address-map>
                                  </div>
                                </el-dialog>
                            </el-form-item>
                        </div>

                        <div class="row">
                            <el-form-item label="检查时间:" prop="">
                                <span>{{basicInfoData.patrolTime}}</span>
                            </el-form-item>
                        </div>

                        <div class="row">
                            <el-form-item label="监管人员:" prop="">
                                <span>{{basicInfoData.patrolSoIdStr}}</span>
                            </el-form-item>
                            <el-form-item :label="infoTitle" prop="">
                                <span v-for="(item,index) in basicInfoData.messengerList" :key="index">{{item.messengerStr}}<span v-if="index<basicInfoData.messengerList.length-1">，</span></span>
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
                <toggle-form title="巡查项（仅显示本次检查的巡查项）">
                    <div class="mT35" v-if="patrolData">
                        <el-table :key="index" v-for="(item,index) in patrolData" :class="index==0?'firsTeit':''" :data="item.content" :span-method="objectSpanMethod" border class="table-div brN">
                          <el-table-column show-overflow-tooltip label="检查项编号" prop="pno"
                                           width="100"></el-table-column>
                          <el-table-column show-overflow-tooltip prop="item" label="巡查项目" width="120"></el-table-column>
                          <el-table-column show-overflow-tooltip label="巡查内容编号" width="120">
                                <template slot-scope="scope">
                                  <span>{{patrolData[index].pno}}.{{patrolData[index].content[scope.$index].cno}}</span>
                                </template>
                          </el-table-column>
                          <el-table-column show-overflow-tooltip prop="context" label="巡查内容" width="250"></el-table-column>
                          <el-table-column show-overflow-tooltip prop="importantStr" label="是否重点项" width="80"></el-table-column>
                          <el-table-column show-overflow-tooltip prop="score" label="分值" width="50"></el-table-column>
                          <el-table-column show-overflow-tooltip  label="是否检查通过" width="120">
                            <template slot-scope="scope">
                              {{scope.row.qual==='YES'?'检查通过':'检查不通过'}}
                            </template>
                          </el-table-column>
                          <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
                          <el-table-column label="附件" width="160">
                            <template slot-scope="scope">
                              <div class="accessoryList" v-if="scope.row.itemPic.length>0">
                                <span class="movePoin" @mouseenter="accessoryList($event,scope.row)" @mouseleave="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                </toggle-form>

                <!-- 巡查结果 -->
                <toggle-form title="巡查结果">
                    <div class="content" v-if="resultData">
                        <div class="row ml30" style="margin-left: 40px;">
                           <span style="color: #6D7787;">本次巡查重点项<span>{{resultData.importantItem.total}}</span>项，一般项<span>{{resultData.generalItem.total}}</span>项，共{{resultData.generalItem.total + resultData.importantItem.total}}项</span>
                        </div>
                        <div class="row result ml30">
                            <div class="item">
                                <div class="number">{{resultData.importantItem.unqualified}}</div>
                                <div class="project-name">重点项不合格</div>
                            </div>
                             <div class="item">
                                <div class="number">{{resultData.generalItem.unqualified}}</div>
                                <div class="project-name">一般项不合格</div>
                            </div>
                        </div>
                        <div class="row ml30" style="margin: 20px 0">
                          <span style="font-size: 18px;color: #393939;">企业得分：</span><span
                          style="color: #0DB5EF;font-size: 18px; "><span>{{resultData.score - noPassScore}}</span>分</span>
                          <span style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{resultData.score}}分，此评分仅供参考）</span>
                        </div>
                        <div class="row">
                            <el-form-item label="巡查结果：" prop="">
                              <span>{{resultData.resultStr}}</span>
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="处理方式：" prop="">
                                <span>{{resultData.treatStr}}</span>
                            </el-form-item>
                        </div>

                        <div class="row" >
                            <el-form-item label="备注：" prop="">
                                <span v-if="resultData.remark" class="over-y">{{resultData.remark}}</span>
                                <span v-if="!resultData.remark">无</span>
                            </el-form-item>
                        </div>

                        <div class="row">
                            <el-form-item label="附件：" prop="">
                                  <!-- <div v-for="(item,index) in resultData.photo" :key="index" @click.stop="ifbig(item)" class="imgdiv">
                                      <img :src="pathFile + item" alt="">
                                      <span>预览</span>
                                  </div> -->
                              <div class="show-success-file" v-if='resultData.photo.length>0'>
                                <div class="file-item" v-for="(item,index) in resultData.photo" :key="index">
                                    <span class="file-name not-pic"
                                        @click.stop="ifbig(item)">{{item.substring(item.lastIndexOf('/')+1)}}</span>
                                </div>
                            </div>
                            <div v-else>
                                  <span>暂无附件</span>
                              </div>
                              <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                                <img :src="bigImgSrc">
                              </div>
                              
                            </el-form-item>
                        </div>

                        <div class="row">
                            <el-form-item label="量化等级：" prop="">
                                <span v-if="resultData.quantitativeLevel != ''">{{resultData.quantitativeLevel}}</span>
                                <span v-if="resultData.quantitativeLevel == ''">无</span>
                            </el-form-item>
                        </div>

                        <div class="row mRno">
                            <el-form-item label="企业电子签名：" prop="">
                                <span v-if="!resultData.sign">企业拒绝配合</span>
                                <span v-if="resultData.sign">企业配合</span>
                                <div v-if="resultData.sign"  @click.stop="ifbigq()" class="imgdiv" :class="ifbigqy?'imgbig':''">
                                      <img :src="pathFile + resultData.sign" alt="">
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
                <el-button style="width:100px;" v-if="from === 'not'&& rectificationType === '线上整改'" @click="goAudit(auditId)">去审核</el-button>
                <!-- <el-button style="width:100px;" @click="printRecord(recordId, true)">打印预览</el-button>
                <el-button style="width:100px;" @click="printRecord(recordId, false)">打印</el-button> -->
            </div>
        </div>

      <!-- 附件列表 -->
      <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseenter="accessoryListIf = true" @mouseleave="accessoryListIf = false">
        <p v-for="item in itemPicList" :key="item.fileId" @click="showPic(item)">
          <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
            {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
          </a>
        </p>
      </div>
      <popup-pic v-if="showPicIf" @close="closePopupBody">
        <img :src="pathFile+this.picSrc" style="max-height: 500px;" />
      </popup-pic>

      <!-- 打印 -->
      <PrintPatrol ref="PrintPatrol"
                   :basicInfoData="basicInfoDataPrint"
                   :messengers="messengersPrint"
                   :patrolData="patrolDataPrint"
                   :patrolContent="patrolContentPrint"
                   :resultData="resultDataPrint"
                   :patrolType="patrolType == 'DAILY'? '日常监督抽查': '专项整治活动'"
                   :qrcodeId="qrcodeId"
      ></PrintPatrol>
    </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import * as plan from "api/patrol/project"
  import addressMap from "./patrolRecordAddressMap"
  import popupPic from 'components/popup/PopupPic';
  import {doPrintRecord} from 'utils/print/doPrint.js';
  import PrintPatrol from '../record/PrintPatrol.vue';
  import {
        downloadFile
    } from "api/common";
  export default {
    components: {
      ToggleForm,
      addressMap,
      popupPic,
      PrintPatrol
    },
    mounted(){
        scroll.call(this,'slideIndex',0,50);
        this.auditId = this.$route.query.id;
        this.rectificationType = this.$route.query.type;
        this.from = this.$route.query.from;
        this.pathFile = this.$store.getters.filePath;
        this.recordId = this.$route.query.recordId;
        this.patrolType = this.$route.query.patrolType;
        this.initData();
    },
    methods:{
       goAudit(id){
        this.$router.push({name:'patrol.repatrol.audit',query:{repatrolId:id}})
      },
        toDailyRecord() {
          this.$router.push({
            path: "/biz/patrol/record/incorruption/detail",
            query: {
              feedbackId: this.feedbackId,
              recordId: this.recordId,
              patrolType: this.patrolType
            }
          })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            let rownum = 0;
            for(var i=0;i<this.patrolData.length;i++){
                if (this.patrolData[i].content.indexOf(row) >= 0) {
                    rownum = this.patrolData[i].content.length;
                    break;
                }
            }
            if (columnIndex === 0 || columnIndex === 1) {
                if(rowIndex%rownum == 0){
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
        ifbig(item){
           let t=item.substring(item.lastIndexOf('.'))
            if(t=='.mp3'||t=='.mp4'){
              downloadFile(item, item.substring(item.lastIndexOf('/')+1));
              return;
            }
            let i=this.pathFile+item
            if (this.bigImgSrc == null || this.bigImgSrc != i) {
            this.bigImgSrc = i;
            this.showBigPic = true;
            }else{
            this.bigImgSrc = null;
            }
            if(item == -1){
            this.showBigPic = false;
            }
        },
        ifbigq(){
            this.ifbigqy = !this.ifbigqy;
        },
        initData(){
            let datas = '';
            if(this.$route.query.type == 'review'){
                datas = 'sourceId=' + this.recordId + '&sourceType=' +this.patrolType;
            } else{
                datas = 'recordId=' + this.recordId + '&patrolType=' +this.patrolType;
            }
            plan.getBasicInfo(this.recordId,this.patrolType).then(d => {
                this.basicInfoData = d.data;
                if (this.basicInfoData.patrolRecordAddress &&
                  this.basicInfoData.patrolRecordAddress.address &&
                  this.basicInfoData.patrolRecordAddress.lng &&
                  this.basicInfoData.patrolRecordAddress.lat) {
                  this.patrolRecordAddressIsShow = true
                }
                if(this.basicInfoData.areaCode.length === 6){
                  this.infoTitle = '陪同监管人员:'
                }
            });
            plan.getPatrolItems(this.recordId,this.patrolType).then(d => {
                this.patrolData = d.data;
                for(var i=0;i<d.data.length;i++){
                    for(var j=0;j<d.data[i].content.length;j++){
                        this.gross += d.data[i].content[j].score;
                      if (d.data[i].content[j].qual === 'NO') {
                        this.noPassScore += d.data[i].content[j].score;
                      }
                    }
                }

            });
            plan.getPatrolResult(datas).then(d => {
                this.resultData = d.data;
                this.feedbackId = d.data.feedback.id;
            });
        },
        ifType(){
          const entityId = this.basicInfoData.entityId;
          if (this.basicInfoData.entityParentType === 'CFDA') {
            this.$router.push({
              name: 'cfda.archives.detail',
              query: {
                id: entityId,
                // back: 'subject.map'
              }
            });
          } else if (this.basicInfoData.entityParentType === 'ENTITY') {
            const entityType = this.basicInfoData.entityType.toLocaleLowerCase();
            this.$router.push({
              name: "subject.archives.detail",
              params: {
                type: entityType,
              },
              query: {
                id: entityId,
              }
            })
          }
        },
        back(){
          this.$router.go(-1);
        },
        //鼠标移入显示附件列表
        accessoryList(_e,content){
          let event = _e?_e:window.event;
          this.accessoryListIf = true;
          this.imgNameStyle.top = event.clientY + 1 + 'px';
          this.imgNameStyle.left = event.clientX - 215 + 'px';
          this.itemPicList = content.itemPic;
        },
        //鼠标移除隐藏附件列表
        async accessoryListElse(){
          this.accessoryListIf = false;
        },
        //显示巡查项图片
        showPic(item){
          let t=item.fileName.substring(item.fileName.lastIndexOf('.'))
          if(t=='.mp3'||t=='.mp4'){
            downloadFile(item.fileId, item.fileName);
            return;
          }
          this.picSrc = item.fileId;
          this.showPicIf = true;
        },
        //关闭巡查项图片
        closePopupBody(){
          this.showPicIf = false;
        },


      /* 打印 */
      async printInitData(id, type){
        this.qrcodeId = id;
        await plan.getBasicInfo(id, type).then(d => {
          this.basicInfoDataPrint = d.data;
          if (this.basicInfoDataPrint.spaceAddr === undefined) {
            this.basicInfoDataPrint.spaceAddr = d.data.realityAddr;
          }
          this.messengersPrint = "";
          this.basicInfoDataPrint.messengerList.forEach(messenger => {
            this.messengersPrint += messenger.messengerStr + "、"
          })
          this.messengersPrint = this.messengersPrint.substr(0, this.messengersPrint.length - 2);

        });

        plan.getPatrolItems(id, type).then(d => {
          this.patrolDataPrint = JSON.parse(JSON.stringify(this.patrolDataInitPrint));
          this.patrolContentPrint = JSON.parse(JSON.stringify(this.patrolContentInitPrint));
          d.data.forEach(list => {
            list.content.forEach(content => {
              if(content.important === 'YES') {
                this.patrolDataPrint.important++;
                if(content.qual === 'YES') {
                  this.patrolDataPrint.importantQual++;
                  this.patrolDataPrint.importantQualStr += content.pno + "." + content.cno + ", ";
                } else {
                  this.patrolDataPrint.importantNoQual++;
                  let contentItem = {};
                  contentItem.no = content.pno + "." + content.cno;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '')? "无": content.remark;
                  this.patrolContentPrint.important.push(contentItem);
                }
              } else {
                this.patrolDataPrint.normal++;
                if(content.qual === 'YES') {
                  this.patrolDataPrint.normalQual++;
                  this.patrolDataPrint.normalQualStr += content.pno + "." + content.cno + ", ";

                } else {
                  this.patrolDataPrint.normalNoQual++;
                  let contentItem = {};
                  contentItem.no = content.pno + "." + content.cno;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '')? "无": content.remark;
                  this.patrolContentPrint.normal.push(contentItem);
                }
              }
            })
          })
          this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr.substr(0, this.patrolDataPrint.importantQualStr.length - 2);
          this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr != ''? this.patrolDataPrint.importantQualStr: "无";

          this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr.substr(0, this.patrolDataPrint.normalQualStr.length - 2);
          this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr != ''? this.patrolDataPrint.normalQualStr: "无";
        });

        let datas = 'recordId=' + id + '&patrolType=' + type;
        plan.getPatrolResult(datas).then(d => {
          this.resultDataPrint = d.data;
          if(!this.resultDataPrint.planName) {
            this.resultDataPrint.planName = this.basicInfoDataPrint.entityTypeStr + "日常监督检查";
          }
          if(this.resultDataPrint.rectifyTime) {
            if(this.resultDataPrint.rectifyTime.indexOf(" ") > 0) {
              let rectifyTimeStr = this.resultDataPrint.rectifyTime.split(' ')[0];
              let rectifyTimeArr = [];
              if(rectifyTimeStr.indexOf("-") > 0) {
                rectifyTimeArr = rectifyTimeStr.split('-');
              } else if(rectifyTimeStr.indexOf("/") > 0) {
                rectifyTimeArr = rectifyTimeStr.split('/');
              }
              if(rectifyTimeArr != []) {
                this.resultDataPrint.rectifyTime = rectifyTimeArr[0] + "年" + rectifyTimeArr[1] + "月" + rectifyTimeArr[2] + "日";
              }
            }
          }
        });
      },

      async printRecord(id, isPreview){
        this.loading = true;
        await this.printInitData(id, this.patrolType);
        this.$refs.PrintPatrol.printStyle(id);
        setTimeout(() => {
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      }
    },
    data() {
        return {
          auditId:'',
          from:'',
          rectificationType:'',
          infoTitle:"信息员:",
          noPassScore: 0,
          patrolRecordAddressIsShow: false,
          mapAddressVisible:false,
          slideIndex:-1,
          pathFile: "",
          checkboxGroup1: [],
          ruleForm: {
              name: "",
              checkboxGroup1: []
          },
          // 左边悬浮栏的数据
          progress:[
              {
                  title:'基本信息'
              },
               {
                  title:'检查项'
              },
               {
                  title:'检查结果'
              }
          ],
          bigImgSrc:null,//拍照图片查看路径
          showBigPic:false,//拍照图片查看是否显示
          ifbigqy:false,
          recordId:null,
          feedbackId:null,
          patrolType:null,
          basicInfoData:null,
          patrolData: null,
          resultData:null,
          gross:0,
          itemPicList:[],
          imgNameStyle:{
            left:'0px',
            top:'0px'
          },
          accessoryListIf:false,
          showPicIf:false,
          picSrc:"",

          //打印
          printShow:false,
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

.container{
    position:relative;
    margin-bottom:200px;
}
$c:#0db5ef;
.left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: 0;
    z-index: 2;
    .head-block{
        background: #F2F5F8;
        height: 70px;
        padding:14px 20px;
        box-sizing: border-box;
        .num{
            color: $c;
        }
    }
    .main-block{
        // border-right: 2px solid #EBF1F5;
        // min-height: 470px;
        >li{
             border-right: 2px solid #EBF1F5;
            padding: 0 20px;
            height: 50px;
            line-height: 50px;
            cursor: default;
            &:hover{
                 background: #F2F5F8;
            }
            .right{
                color: #A2AAB6;
            }
        }
        .activePosition{
            border-right: 2px solid $c;
            .left{color:$c}
        }
    }
}
// 左边悬浮信息栏的样式 end
.right-info {
    width: calc(100% - 230px);
    margin-left:230px;
     .content{
        width: 600px;
     }
}
.content {
    margin-top: 20px;

     a{
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
.mT35{
    margin-top: 35px;
}
.row .el-form-item{
    min-width: 250px;
}
.table-div{
    text-align: center;
}
.zj{
    border: 1px solid #ebeef5;
    border-top: 0;
    height: 44px;
    line-height: 44px;

     span:first-child{
        margin-left: 36px;
     }
     span:last-child{
        width: 85%;
        display: inline-block;
        text-align: center;
     }
}

.result{
    margin:20px 0;
    width:402px;
    height:90px;
    border:1px solid #C2CAD2;
    display:flex;
    justify-content: space-around;
    align-items: center;
    .item{
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .number{
        font-size: 26px;
        color: #3B3B3B;
      }
      .project-name{
        font-size: 14px;
        color: #A2AAB6;
      }
    }
}
.imgNameBox{
  position: fixed;
  min-height: 50px;
  padding: 20px;
  min-width: 200px;
  z-index: 999;
  top: 100px;
  left: 100px;
  background:#fff;
  box-shadow: 0px 4px 12px 0px rgba(109,119,135,0.19);
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
    .show-success-file {
        .file-item {
            .file-name {
                cursor: pointer;
                margin-right: 20px;
                color: #1787AD;
                text-decoration: underline;
            }
        }

    }
</style>
