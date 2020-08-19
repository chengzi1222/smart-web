<template>
    <div v-loading="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
        <div style="margin-top:20px;border-left:3px solid #0DB5EF;margin-bottom: 20px;">
            <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">廉洁自律反馈记录详情</span>
        </div>
        <div class="container">
          <!-- 左边信息悬浮栏 -->
          <div class="left-info">
              <ul class="main-block">
                  <li class="clearfix" :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
                      <p class="floatL left">{{item.title}}</p>
                  </li>
              </ul>
          </div>
          <!-- 左边信息悬浮栏 end-->
          <div class="right-info">
              <el-button type="primary" @click="toInspectionRecord">检查记录</el-button>
              <el-form :model="recordData" label-width="150px">
                  <!-- 主体信息 -->
                  <toggle-form title="主体信息">
                      <div class="content">
                          <div class="row">
                              <el-form-item label="企业（单位）名称：" prop="">
                                  <span>{{recordData.entityName ? recordData.entityName : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="通讯地址：" prop="">
                                  <span>{{recordData.address ? recordData.address : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="联系人：" prop="">
                                  <span>{{recordData.contactPerson ? recordData.contactPerson : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="联系电话：" prop="">
                                <span>{{recordData.contactTel ? recordData.contactTel : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="邮编：" prop="">
                                  <span>{{recordData.postcode ? recordData.postcode : '-'}}</span>
                              </el-form-item>
                          </div>
                      </div>
                  </toggle-form>

                  <!-- 检查单位信息 -->
                  <toggle-form title="检查单位信息">
                      <div class="content">
                          <div class="row">
                              <el-form-item label="检查单位：" prop="">
                                  <span>{{recordData.patrolDept ? recordData.patrolDept : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="检查人员：" prop="">
                                  <span>{{recordData.patrolPerson ? recordData.patrolPerson : '-'}}</span>
                              </el-form-item>
                          </div>
                      </div>
                  </toggle-form>
              
                  <!-- 廉政建设反馈表 -->
                  <toggle-form title="廉政建设反馈表">
                      <div class="toggle-table">
                        <el-table :data="feedBackData" border class="brN" :fit="false">
                          <el-table-column type="index" min-width="60" label=""></el-table-column>
                          <el-table-column show-overflow-tooltip prop="quesItem" label="" width="480"></el-table-column>
                          <el-table-column show-overflow-tooltip prop="quesOpt" label="" width="60">
                            <template slot-scope="scope">
                              <span>{{scope.row.quesOpt == "NO" ? "否" : "是"}}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <div class="content">
                          <div class="row">
                              <el-form-item label="工作情况：" prop="">
                                  <span>{{recordData.workingConditionStr ? recordData.workingConditionStr : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="意见和建议：" prop="">
                                  <span>{{recordData.suggest ? recordData.suggest : '-'}}</span>
                              </el-form-item>
                          </div>
                          <div class="row">
                              <el-form-item label="电子签名：" prop="">
                                  <div v-if="recordData.signature" class="signature">
                                      <img class="signature" :src="$store.getters.filePath + '/' +recordData.signature + '?x-oss-process=image/resize,h_200'" alt="">
                                  </div>
                                  <span v-else>-</span>
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
                <el-button style="width:100px;" @click="printRecord(feedbackId, true)">打印预览</el-button>
                <el-button style="width:100px;" @click="printRecord(feedbackId, false)">打印</el-button>
            </div>
        </div>

      <!-- 打印 -->
      <PrintIncorruption ref="PrintIncorruption" :dataInfo="recordData"></PrintIncorruption>
    </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import {getIncorruptionDetail} from "api/patrol/incorruption/incorruption";
  import {doPrintIncorruption} from 'utils/print/doPrint.js';
  import PrintIncorruption from '../record/printIncorruption.vue';
  import qs from 'qs';
  export default {
    components: {
      ToggleForm,
      PrintIncorruption
    },
    mounted(){
        scroll.call(this,'slideIndex',0,50);
        this.feedbackId = this.$route.query.feedbackId;
        this.recordId = this.$route.query.recordId;
        this.initData();
    },
    methods:{
        toInspectionRecord() {
          this.$router.push({
            path: "/biz/patrol/record/daily/detail",
            query: {
              recordId: this.recordId,
              patrolType: this.patrolType
            }
          })
        },
        initData() {
          this.loading = true
          getIncorruptionDetail(qs.stringify({feedbackId: this.feedbackId})).then(res => {
            if(res.status) {
              let data = res.data
              this.patrolType = data.patrolType
              this.recordData = data
              this.feedBackData = [{
                quesItem: "是否语言礼貌，文明执法？", quesOpt: data.politeCivilized
              }, {
                quesItem: "是否接受你单位现金，有价证券和礼品馈赠？", quesOpt: data.bribe
              }, {
                quesItem: "是否要求或参加您单位安排经营性娱乐活动？", quesOpt: data.entertainment
              }, {
                quesItem: "是否在您单位报销应由个人承担的费用？", quesOpt: data.reimbursement
              }]
            }
            this.loading = false
          }).catch(err => {}) 
        },
        back(){
          this.$router.go(-1);
        },

      /* 打印 */
      async printRecord(id, isPreview){
        this.loading = true;
        let printDoc = []
        printDoc.push(this.$refs.PrintIncorruption.$el.children[0].children[0].innerHTML)
        setTimeout(() => {
          doPrintIncorruption(isPreview, printDoc);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      }
    },
    data() {
        return {
          feedBackData: [],
          infoTitle:"信息员:",
          noPassScore: 0,
          slideIndex:-1,
          // 左边悬浮栏的数据
          progress:[
              {
                  title:'主体信息'
              },
               {
                  title:'检查单位信息'
              },
               {
                  title:'反馈表'
              }
          ],
          feedbackId: null,
          recordId: null,
          recordData: {},
          loading: false,
          patrolType: 'DAILY'
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
    .signature {
      width: 386px;
      height: 202px;
      border: 1px solid #ebeef5;
    }
    .signature > img{
      width: 100%;
      height: 100%;
    }
}

.row .el-form-item{
    min-width: 250px;
}
.table-div{
    text-align: center;
}

.toggle-table {
  margin-top: 20px;
  margin-left: 50%;
  width: 600px;
  transform: translate(-50%);
}


</style>
