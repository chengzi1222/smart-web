
<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">双随机检查记录详情</span>
    </div>
    <div class="container" @click="ifbig('-1')">
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
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <!-- 基本信息 -->
          <toggle-form title="基本信息">
            <div class="content" v-if="resultData.record">
              <div class="row">
                <el-form-item label="主体名:" prop="">
                  <span>{{resultData.record.entityName}}</span>
                  <a href="javascript:;" @click="ifType" v-auth="'food.biz.cb,food.biz.pb,food.biz.rb,food.biz.cfda'">进入该主体档案</a>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="巡查编号:" prop="">
                  <span>{{resultData.record.randomRecordNo}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="许可备案号:" prop="">
                  <span>{{resultData.record.licence}}</span>
                </el-form-item>
                <el-form-item label="主体类型:" prop="">
                  <span>{{resultData.record.entityTypeStr}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="经营地址:" prop="">
                  <span>{{resultData.record.realityAddr ? resultData.record.realityAddr:resultData.record.spaceAddr}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="巡查地址:" prop="">
                  <span v-if="!resultData.record.patrolAddr">暂无</span>
                  <span v-else>{{resultData.record.patrolAddr}}</span>
                  <el-button v-if="patrolRecordAddressIsShow" type="text" @click="mapAddressVisible = true">巡查坐标</el-button>
                  <el-dialog
                    v-if="patrolRecordAddressIsShow"
                    :visible.sync="mapAddressVisible"
                    :modal-append-to-body="false"
                    width="60%">
                    <slot slot="title">
                      {{resultData.record.entityName}} <br />
                      {{resultData.record.patrolAddr}}
                    </slot>
                    <div style="height: 300px;">
                      <address-map
                        v-if="patrolRecordAddressIsShow"
                        :lng="resultData.record.lng"
                        :lat="resultData.record.lat">
                      </address-map>
                    </div>
                  </el-dialog>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="巡查时间:" prop="">
                  <span>{{resultData.record.randomTime}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="执行机构:" prop="">
                  <span>{{resultData.record.deptNames}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="组长:" prop="">
                  <span>{{resultData.record.leaderName}}</span>
                </el-form-item>
                <el-form-item label="组员:" prop="">
                  <span>{{resultData.names.realName}}</span>
                </el-form-item>
              </div>
            </div>
          </toggle-form>

          <!-- 巡查项 -->
          <toggle-form title="巡查项（仅显示本次检查的巡查项）">
            <div class="mT35" v-if="resultData.listContext">
              <el-table :key="index" v-for="(item,index) in resultData.listContext" :class="index==0?'firsTeit':''" :data="item.content" :span-method="objectSpanMethod" border class="table-div brN">
                <el-table-column show-overflow-tooltip label="检查项编号" width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.pno}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="item" label="巡查项目" width="120"></el-table-column>
                <el-table-column show-overflow-tooltip label="巡查内容编号" width="120">
                  <template slot-scope="scope">
                    <span>{{scope.row.pno}}.{{scope.row.cno}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="context" label="巡查内容" width="250"></el-table-column>
                <el-table-column show-overflow-tooltip prop="importantStr" label="是否重点项" width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="qualStr" label="是否符合" width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
                <el-table-column label="附件" width="160">
                  <template slot-scope="scope">
                    <div class="accessoryList" v-if="scope.row.itemPic.length>0">
                      <span class="movePoin" @mouseover.stop="accessoryList($event,scope.row)" @mouseout="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
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
              <span style="color: #6D7787;">本次巡查重点项<span>{{resultData.total.ipTotal}}</span>项，一般项<span>{{resultData.total.unipTotal}}</span>项，共{{resultData.total.ipTotal + resultData.total.unipTotal}}项</span>
            </div>
            <div class="row result ml30">
              <div class="item">
                <div class="number">{{resultData.total.ipUnqualTotal}}</div>
                <div class="project-name">重点项不合格</div>
              </div>
              <div class="item">
                <div class="number">{{resultData.total.unipUnqualTotal}}</div>
                <div class="project-name">一般项不合格</div>
              </div>
            </div>
            <div class="row ml30" style="margin: 20px 0">
              <span style="font-size: 18px;color: #393939;">企业得分：</span><span style="color: #0DB5EF;font-size: 18px; "><span>{{resultData.total.score}}</span>分</span>
              <span style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{resultData.total.totalScores}}分，此评分仅供参考）</span>
            </div>
            <div class="row">
              <el-form-item label="巡查结果：" prop="">
                <span>{{resultData.record.randomResultStr}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="处理方式：" prop="">
                <span>{{resultData.record.randomTreatStr}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="备注：" prop="">
                <span v-if="resultData.record.randomTreatRemark" class="ellipsis">{{resultData.record.randomTreatRemark}}</span>
                <span v-else>无</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="上传图片：" prop="">
                <div class="imgbox" v-if="resultData.fileList.length >= 1">
                  <div v-for="(item,index)  in resultData.fileList"  :key="index" @click.stop="ifbig(item.fileId)" class="imgdiv" >
                    <img :src="pathFile + item.fileId" alt="">
                    <span>预览</span>
                  </div>
                </div>
                 <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                    <img :src="bigImgSrc">
                </div>
                <div v-if="resultData.fileList.length == 0">
                  <span>无</span>
                </div>
              </el-form-item>
            </div>

            <div class="row mRno">
              <el-form-item label="企业电子签名：" prop="">
                <span v-if="!resultData.record.sign">企业拒绝配合</span>
                <span v-if="resultData.record.sign">企业配合</span>
                <div v-if="resultData.record.sign" @click.stop="ifbigq()" class="imgdiv" :class="ifbigqy?'imgbig':''">
                  <img :src="pathFile + resultData.record.sign" alt="">
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

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseover.stop="accessoryListIf = true" @mouseout="accessoryListIf = false">
      <p v-for="item in itemPicList" :key="item.fileId" @click="showPic(item.fileId)">
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
                 :qrcodeId="qrcodeId"
    ></PrintPatrol>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import * as record from "api/random/recordInfo";
  import addressMap from "views/patrol/project/patrolRecordAddressMap"
  import popupPic from 'components/popup/PopupPic';
  import { doPrintRecord } from 'utils/print/doPrint.js';
  import PrintPatrol from 'views/random/record/PrintPatrol.vue';

  export default {
    components: {
      ToggleForm,
      addressMap,
      popupPic,
      PrintPatrol
    },
    mounted(){
      scroll.call(this,'slideIndex',0,50);

      this.pathFile = this.$store.getters.filePath;

      this.recordId = this.$route.query.recordId;
      this.initData();
    },
    methods:{
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        let rownum = 0;
        this.patrolData = this.resultData.listContext;
        for(var i=0;i<this.resultData.listContext.length;i++){
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
        record.getDetails(this.recordId).then(d => {
          this.resultData = d.data;
          if (d.data.record.patrolAddr &&
            d.data.record.lng &&
            d.data.record.lat) {
            this.patrolRecordAddressIsShow = true
          }
        });
      },
      ifType(){
        const entityId = this.resultData.record.entityId;
        let type = this.resultData.record.type;
        if (type === 'CFDA') {
          this.$router.push({
            name: 'cfda.archives.detail',
            query: {
              id: entityId,
            }
          });
        } else if (type === 'ENTITY') {
          const entityType = type.toLocaleLowerCase();
          this.$router.push({
            name: "subject.archives.detail",
            params: {
              type: this.resultData.record.entityType.toLocaleLowerCase(),
            },
            query: {
              id: entityId,
            }
          })
        }
      },
      back(){
        this.$router.go(-1)
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
      showPic(picSrc){
        this.picSrc = picSrc;
        this.showPicIf = true;
      },
      //关闭巡查项图片
      closePopupBody(){
        this.showPicIf = false;
      },


      /* 打印 */
      async printInitData(id){
        this.qrcodeId = id;
        this.basicInfoDataPrint = this.resultData.record;
        this.messengersPrint += this.resultData.names.realName;

        this.patrolDataPrint = JSON.parse(JSON.stringify(this.patrolDataInitPrint));
        this.patrolContentPrint = JSON.parse(JSON.stringify(this.patrolContentInitPrint));
        this.resultData.listContext.forEach(list => {
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
              }else {
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

      },

      printRecord(id, isPreview){
        this.loading = true;
        this.printInitData(id);
        setTimeout(() => {
          this.$refs.PrintPatrol.printStyle();
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      }
    },
    data() {
      return {
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
            title:'巡查项'
          },
          {
            title:'巡查结果'
          }
        ],
        bigImgSrc:null,//拍照图片查看路径
        showBigPic:false,//拍照图片查看是否显示
        ifbigqy:false,
        recordId:null,
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
.ellipsis{
  overflow-y:scroll;
  max-height: 170px;
}

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
    /*margin-left: -230px;*/
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
  .imgbox{
  // display: flex;
    width: 650px;
  // overflow: hidden;
    margin-left: 100px;
  }
  .imgdiv{
    float:left;
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
  img{
    transition: all 0.5s;
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  span{
    display: none;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: rgba(0,0,0,0.40);
    border-radius: 0 0 5px 5px;
    font-size: 14px;
    color: #FFFFFF;
    position: absolute;
    bottom: 0;
  }
  }
  .imgdiv:hover{
  span{
    display: inline-block;
  }
  }
  .imgbig{
    position: relative;
    z-index: 999;
  span{
    display: none !important;
  }
  img{
    transform:scale(2);
    border-radius: 0;
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
</style>
