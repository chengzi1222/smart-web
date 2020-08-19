<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">自检自查详情</span><Back class="ml20"></Back>
    </div>
    <div class="container" @click="ifbig(-1)">
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
        <el-form :model="ruleForm" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <!-- 主体基本信息 -->
          <toggle-form title="主体信息">
            <div class="content">
              <div class="row">
                <el-form-item label="主体名:" prop="">
                  <span>{{allDatas.buyerName}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="所属辖区:" prop="">
                  <span>{{$route.query.areaName}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="主体类型:" prop="">
                  <span>{{allDatas.buyerType}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="经营地址:" prop="">
                  <span>{{allDatas.address}}</span>
                </el-form-item>
              </div>
            </div>
          </toggle-form>

          <!-- 检查信息 -->
          <toggle-form title="检查信息">
            <div class="content">
              <div class="row">
                <el-form-item label="检查任务：" prop="">
                  <span>{{allDatas.planName}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="检查轮次：" prop="">
                  <span>{{allDatas.turn}}</span>
                </el-form-item>
                <el-form-item label="检查时间：" prop="">
                  <span>{{allDatas.checkTime}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="检查人：" prop="">
                  <span>{{allDatas.inspector}}</span>
                </el-form-item>
              </div>
              <div class="row ml30" style="margin-left: 40px;">
                <span
                  style="color: #6D7787;">本次巡查重点项<span>{{allDatas.pointTotal}}</span>项，一般项<span>{{allDatas.ordinaryTotal}}</span>项，共{{allDatas.pointTotal + allDatas.ordinaryTotal}}项</span>
              </div>
              <div class="row result ml30">
                <div class="item">
                  <div class="number">{{allDatas.disquaMajorProject}}</div>
                  <div class="project-name">不合格重点项</div>
                  <div class="tipText">(≤{{allDatas.quaMajorProject}}项合格)</div>
                </div>
                <div class="item">
                  <div class="number">{{allDatas.disquaCommonProject}}</div>
                  <div class="project-name">不合格一般项</div>
                  <div class="tipText">(≤{{allDatas.quaCommonProject}}项合格)</div>
                </div>
                <div class="item">
                  <div class="number">{{allDatas.totalPoint}}</div>
                  <div class="project-name">总得分</div>
                  <div class="tipText">(≥{{allDatas.quaPoint}}分合格)</div>
                </div>
              </div>
              <div class="row ml30" style="margin: 20px 0">
                <span style="font-size: 18px;color: #393939;">最终检查结果：</span><span>{{allDatas.checkResultStr}}</span>
              </div>
              <div class="row">
                <el-form-item label="整改状态：" prop="">
                  <span>{{allDatas.rectificationStatusStr}}</span>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="整改人抓拍照片：" prop="">
                  <div v-if="allDatas.picUrl.length>0" v-for="(item,index) in allDatas.picUrl"  @click.stop="ifbigqyFun(index)"
                       class="imgdiv" :class="ifbigqy&&index==ifbigindex?'imgbig':''">
                    <img :src="pathFile + item" alt="">
                    <span>预览</span>
                  </div>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="电子签名：" prop="">
                  <div v-if="allDatas.eleSignUrl" @click.stop="ifbigqFun" class="imgdiv" :class="ifbigq?'imgbig':''">
                    <img :src="pathFile + allDatas.eleSignUrl" alt="">
                    <span>预览</span>
                  </div>
                </el-form-item>
              </div>
            </div>
          </toggle-form>

          <!-- 检查明细 -->
          <toggle-form title="检查明细">
            <div class="mT35">
              <el-table :key="index" v-for="(item,index) in allDatas.contexts" :class="index==0?'firsTeit':''"
                :data="item.projects" :span-method="objectSpanMethod" border class="table-div brN">
                <el-table-column show-overflow-tooltip label="编号" width="100">
                  <template slot-scope="scope">
                    <span>{{index+1}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="巡查项目" width="120">
                  <template slot-scope="scope">
                    <span>{{allDatas.contexts[index].contextName}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="巡查内容编号" width="120">
                  <template slot-scope="scope">
                    <span>{{index+1}}.{{allDatas.contexts[index].projects[scope.$index].projectNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectName" label="巡查内容" width="250"></el-table-column>
                <el-table-column show-overflow-tooltip prop="majorItemStr" label="是否重点项" width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="point" label="分值" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="projectStatusStr" label="是否检查通过" width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
                <el-table-column label="附件" width="160">
                  <template slot-scope="scope">
                    <div class="accessoryList" v-if="scope.row.fidUrl && scope.row.fidUrl.length >0">
                      <span class="movePoin" @mouseenter="accessoryList($event,scope.row)"
                        @mouseleave="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </toggle-form>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:2">
      <div>
        <el-button style="width:100px;" @click="back">返回</el-button>
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseenter="accessoryListIf = true"
      @mouseleave="accessoryListIf = false">
      <p v-for="item in itemPicList" @click="showPic(item)">
        <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
          {{item.length>24?(item.substring(0,12)+'...'+item.substring(item.length-12,item.length)):item}}
        </a>
      </p>
    </div>
    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="pathFile+this.picSrc" style="max-height: 500px;" />
    </popup-pic>

  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import popupPic from 'components/popup/PopupPic';
	import Back from "utils/back.vue";
	import { getRecordDetails } from 'api/patrol/checkByMyself'

  export default {
    components: {
      ToggleForm,popupPic, Back
    }, 
    data() {
      return {
        noPassScore: 0,
        slideIndex: -1,
        pathFile: "",
        checkboxGroup1: [],
        ruleForm: {
          name: "",
          checkboxGroup1: []
        },
        // 左边悬浮栏的数据
        progress: [{
          title: '主体信息'
        },{
          title: '检查信息'
        },{
          title: '检查明细'
        }],
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
        ifbigqy: false,
        ifbigindex: -1,
        ifbigq: false,
        recordId: null,
        basicInfoData: {
          entityName: '主体啊啊啊',
          region: '某个区',
          entityType: '某个类型',
          address: '某个地方'
        },
        patrolData: [],
        resultData: {},
        itemPicList: [],
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        accessoryListIf: false,
        showPicIf: false,
        picSrc: "",
        loading: false,
        allDatas: {}
      }
    },
    mounted() {
      scroll.call(this, 'slideIndex', 0, 50);
      this.pathFile = this.$store.getters.filePath;
      this.recordId = this.$route.query.recordId;
      this.initData();
      getRecordDetails({id: this.recordId}).then(r=>{
        if(r.status){
          let res = JSON.parse(r.data);
          this.allDatas = res.data;
          let y=0,n=0;
          for(let i=0; i<res.data.contexts.length;i++){
            for(let j=0; j<res.data.contexts[i].projects.length; j++){
              if(res.data.contexts[i].projects[j].majorItemStr=='是'){
                y++;
              }else {
                n++
              }
            }
          }
          this.allDatas.pointTotal = y;
          this.allDatas.ordinaryTotal = n;
        }
      })
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        let rownum = 0;
        for (var i = 0; i < this.allDatas.contexts.length; i++) {
          if (this.allDatas.contexts[i].projects.indexOf(row) >= 0) {
            rownum = this.allDatas.contexts[i].projects.length;
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
      ifbigqFun() {
        this.ifbigq = !this.ifbigq;
      },
      ifbigqyFun(index) {
        this.ifbigqy = !this.ifbigqy;
        if(this.ifbigindex == -1){
          this.ifbigindex = index;
        } else {
          this.ifbigindex = -1;
        }
      },
      initData() {

      },
      back() {
        this.$router.go(-1);
      },
      //鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = content.fidUrl;
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
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    margin-bottom: 200px;
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
      >li {
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
    width: 480px;
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
        font-weight: 500;
        color: rgba(57, 57, 57, 1);
        line-height: 36px;
      }
      .project-name {
        font-size: 14px;
        font-weight: 400;
        color: rgba(109, 119, 135, 1);
        line-height: 20px;
      }
      .tipText {
        font-size: 14px;
        font-weight: 400;
        color: rgba(162, 170, 182, 1);
        line-height: 20px;
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

    >img {
      display: block;
      max-height: 700px;
    }
  }
</style>
<style lang="scss">
  .brN .is-leaf {
    border-right: 0;
  }
  .brN tr td {
    border-right: 0;
  }
  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }
  .brN tr:hover>td {
    background-color: #fff !important;
  }
  .mT35 .el-table__header-wrapper {
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