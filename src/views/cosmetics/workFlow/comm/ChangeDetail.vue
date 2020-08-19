<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
        </li>
      </ul>
    </div>
    <div class="right-info">

      <el-form label-width="130px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form v-if="dataAll.booleanBic" title="基础信息（编辑前）">
          <div class="content">
            <div class="row">
              <span :class="(dataAll.compareBasic.entityName) ? 'font-color':''">
                <el-form-item label="主体名称:">
                  <span>{{dataAll.beforeBasic.entityName ? dataAll.beforeBasic.entityName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(dataAll.compareBasic.creditCode) ? 'font-color':''">
                <el-form-item label="统一社会信用代码:">
                  <span>{{dataAll.beforeBasic.creditCode ? dataAll.beforeBasic.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.legalPerson) ? 'font-color':''">
                  <el-form-item label="法人姓名:">
                    <span>{{dataAll.beforeBasic.legalPerson ? dataAll.beforeBasic.legalPerson : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <div class="row">
                <span :class="(dataAll.compareBasic.backupNo) ? 'font-color':''">
                  <el-form-item label="许可备案号:">
                    <span>{{dataAll.beforeBasic.backupNo ? dataAll.beforeBasic.backupNo : '暂无'}}</span>
                  </el-form-item>
                </span>
                <span :class="(dataAll.compareBasic.backupStateStr) ? 'font-color':''">
                  <el-form-item label="许可证状态(主体状态):">
                    <span>{{dataAll.beforeBasic.backupStateStr ? dataAll.beforeBasic.backupStateStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row"  v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
                <el-form-item label="有效期:">
                  <span :class="(dataAll.compareBasic.recordBegin) ? 'font-color':''">{{dataAll.beforeBasic.recordBegin}}</span>
                  -
                  <span :class="(dataAll.compareBasic.recordEnd) ? 'font-color':''">{{dataAll.beforeBasic.recordEnd}}</span>
                </el-form-item>
              </div>
            </span>
          </div>
        </toggle-form>

        <toggle-form v-if="dataAll.booleanBic" title="基础信息（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="(dataAll.compareBasic.entityName) ? 'font-color':''">
                <el-form-item label="主体名称:">
                  <span>{{dataAll.afterBasic.entityName ? dataAll.afterBasic.entityName : '暂无'}}</span>
                </el-form-item>
              </span>
          
              <span :class="(dataAll.compareBasic.creditCode) ? 'font-color':''">
                <el-form-item label="统一社会信用代码:">
                  <span>{{dataAll.afterBasic.creditCode ? dataAll.afterBasic.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.legalPerson) ? 'font-color':''">
                  <el-form-item label="法人姓名:">
                    <span>{{dataAll.afterBasic.legalPerson ? dataAll.afterBasic.legalPerson : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>
          
            <span v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <div class="row">
                <span :class="(dataAll.compareBasic.backupNo) ? 'font-color':''">
                  <el-form-item label="许可备案号:">
                    <span>{{dataAll.afterBasic.backupNo ? dataAll.afterBasic.backupNo : '暂无'}}</span>
                  </el-form-item>
                </span>
                <span :class="(dataAll.compareBasic.backupStateStr) ? 'font-color':''">
                  <el-form-item label="许可证状态(主体状态):">
                    <span>{{dataAll.afterBasic.backupStateStr ? dataAll.afterBasic.backupStateStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
          
              <div class="row"  v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
                  <el-form-item label="有效期:">
                    <span :class="(dataAll.compareBasic.recordBegin) ? 'font-color':''">{{dataAll.afterBasic.recordBegin}}</span>
                     - 
                    <span :class="(dataAll.compareBasic.recordEnd) ? 'font-color':''">{{dataAll.afterBasic.recordEnd}}</span>
                  </el-form-item>
              </div>
            </span>
          </div>
        </toggle-form>
        <!-- 负责人信息 -->
        <toggle-form v-if="dataAll.booleanCorp" :title="'负责人信息（编辑前）'">
          <div class="content">
            <div class="row">
              <span :class="(dataAll.corpMess.corpName) ? 'font-color':''">
                <el-form-item label="负责人:">
                  <span>{{dataAll.beforeCorpMess.corpName ? dataAll.beforeCorpMess.corpName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(dataAll.corpMess.corpMobile) ? 'font-color':''">
                <el-form-item label="负责人联系电话:">
                  <span>{{dataAll.beforeCorpMess.corpMobile ? dataAll.beforeCorpMess.corpMobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row">
              <span :class="(dataAll.corpMess.idNo) ? 'font-color':''">
                <el-form-item label="负责人身份证:">
                  <span>{{dataAll.beforeCorpMess.idNo ? dataAll.beforeCorpMess.idNo : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(dataAll.corpMess.qualityPerson) ? 'font-color':''">
                <el-form-item :label="'质量负责人:'">
                  <span>{{dataAll.beforeCorpMess.qualityPerson ? dataAll.beforeCorpMess.qualityPerson : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form  v-if="dataAll.booleanCorp" :title="'负责人信息（编辑后）'">
          <div class="content">
            <div class="row">
              <span :class="(dataAll.corpMess.corpName) ? 'font-color':''">
                <el-form-item label="负责人:">
                  <span>{{dataAll.afterCorpMess.corpName ? dataAll.afterCorpMess.corpName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(dataAll.corpMess.corpMobile) ? 'font-color':''">
                <el-form-item label="负责人联系电话:">
                  <span>{{dataAll.afterCorpMess.corpMobile ? dataAll.afterCorpMess.corpMobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row">
              <span :class="(dataAll.corpMess.idNo) ? 'font-color':''">
                <el-form-item label="负责人身份证:">
                  <span>{{dataAll.afterCorpMess.idNo ? dataAll.afterCorpMess.idNo : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(dataAll.corpMess.qualityPerson) ? 'font-color':''">
                <el-form-item :label="'质量负责人:'">
                  <span>{{dataAll.afterCorpMess.qualityPerson ? dataAll.afterCorpMess.qualityPerson : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form v-if="this.dataAll.booleanManage" title="经营信息（编辑前）">
          <div class="content">
            <div class="row">
              <span :class="dataAll.manageMess.registerAddr ? 'font-color':''">
                <el-form-item label="注册经营地址:">
                  <span>{{dataAll.beforeManageMess.registerAddr ? dataAll.beforeManageMess.registerAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.manageMess.realityAddr? 'font-color':''">
                <el-form-item label="实际经营地址:">
                  <span>{{dataAll.beforeManageMess.realityAddr ? dataAll.beforeManageMess.realityAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            
            <div class="row">
              <span :class="dataAll.manageMess.manageStateStr? 'font-color':''">
                <el-form-item label="营业状态:">
                  <span>{{dataAll.beforeManageMess.manageStateStr ? dataAll.beforeManageMess.manageStateStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="$route.query.entityType != 'production' && entryType != 'COSMETIC_PRODUCT'" :class="dataAll.manageMess.enterpriseFormStr? 'font-color':''">
                <el-form-item label="企业形态:">
                  <span>{{dataAll.beforeManageMess.enterpriseFormStr ? dataAll.beforeManageMess.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.manageScopeStr ? 'font-color':''">
                <el-form-item label="生产范围:">
                  <span>{{dataAll.beforeManageMess.manageScopeStr ? dataAll.beforeManageMess.manageScopeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="$route.query.entityType != 'production' && entryType != 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.manageScopeStr ? 'font-color':''">
                <el-form-item label="经营范围:">
                  <span>{{dataAll.beforeManageMess.manageScopeStr ? dataAll.beforeManageMess.manageScopeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.detailedEngageStr ? 'font-color':''">
                <el-form-item label="详细生产信息:">
                  <span>{{dataAll.beforeManageMess.detailedEngageStr ? dataAll.beforeManageMess.detailedEngageStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="$route.query.entityType != 'production' && entryType != 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.detailedEngageStr ? 'font-color':''">
                <el-form-item label="详细经营信息:">
                  <span>{{dataAll.beforeManageMess.detailedEngageStr ? dataAll.beforeManageMess.detailedEngageStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form v-if="this.dataAll.booleanManage" title="经营信息（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="dataAll.manageMess.registerAddr ? 'font-color':''">
                <el-form-item label="注册经营地址:">
                  <span>{{dataAll.afterManageMess.registerAddr ? dataAll.afterManageMess.registerAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row">
              <span :class="dataAll.manageMess.realityAddr? 'font-color':''">
                <el-form-item label="实际经营地址:">
                  <span>{{dataAll.afterManageMess.realityAddr ? dataAll.afterManageMess.realityAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row">
              <span :class="dataAll.manageMess.manageStateStr? 'font-color':''">
                <el-form-item label="营业状态:">
                  <span>{{dataAll.afterManageMess.manageStateStr ? dataAll.afterManageMess.manageStateStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="dataAll.manageMess.enterpriseFormStr? 'font-color':''" v-if="$route.query.entityType != 'production' && entryType != 'COSMETIC_PRODUCT'">
                <el-form-item label="企业形态:">
                  <span>{{dataAll.afterManageMess.enterpriseFormStr ? dataAll.afterManageMess.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row" v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.manageScopeStr ? 'font-color':''">
                <el-form-item label="生产范围:">
                  <span>{{dataAll.afterManageMess.manageScopeStr ? dataAll.afterManageMess.manageScopeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="$route.query.entityType != 'production' && entryType != 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.manageScopeStr ? 'font-color':''">
                <el-form-item label="经营范围:">
                  <span>{{dataAll.afterManageMess.manageScopeStr ? dataAll.afterManageMess.manageScopeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row" v-if="$route.query.entityType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.detailedEngageStr ? 'font-color':''">
                <el-form-item label="详细生产信息:">
                  <span>{{dataAll.afterManageMess.detailedEngageStr ? dataAll.afterManageMess.detailedEngageStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="$route.query.entityType != 'production' && entryType != 'COSMETIC_PRODUCT'">
              <span :class="dataAll.manageMess.detailedEngageStr ? 'font-color':''">
                <el-form-item label="详细经营信息:">
                  <span>{{dataAll.afterManageMess.detailedEngageStr ? dataAll.afterManageMess.detailedEngageStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form v-if="dataAll.booleanDuty" title="责任落实（编辑前）">
          <div class="content">
            <div class="row">
              <span :class="dataAll.dutyMess.syj? 'font-color':''">
                <el-form-item label="所属食药所:">
                  <span>{{dataAll.beforeDutyMess.syjName ? dataAll.beforeDutyMess.syjName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="dataAll.dutyMess.grid ? 'font-color':''">
                <el-form-item label="所在网格:">
                  <span>{{dataAll.beforeDutyMess.gridName ? dataAll.beforeDutyMess.gridName : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.dutyMess.so ? 'font-color':''">
                <el-form-item label="监管人员:">
                  <span>{{dataAll.beforeDutyMess.soName ? dataAll.beforeDutyMess.soName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="dataAll.dutyMess.so ? 'font-color':''">
                <el-form-item label="监管人员联系方式:">
                  <span>{{dataAll.beforeDutyMess.soMobile ? dataAll.beforeDutyMess.soMobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.dutyMess.infoAssi ? 'font-color':''">
                <el-form-item label="网格信息员:">
                  <span>{{dataAll.beforeDutyMess.infoAssiName ? dataAll.beforeDutyMess.infoAssiName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="dataAll.dutyMess.infoAssi ? 'font-color':''">
                <el-form-item label="网格信息员联系方式:">
                  <span>{{dataAll.beforeDutyMess.infoAssiMobile ? dataAll.beforeDutyMess.infoAssiMobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="dataAll.booleanDuty" title="责任落实（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="dataAll.dutyMess.syj? 'font-color':''">
                <el-form-item label="所属食药所:">
                  <span>{{dataAll.afterDutyMess.syjName ? dataAll.afterDutyMess.syjName : '暂无'}}</span>
                </el-form-item>
              </span>
          
              <span :class="dataAll.dutyMess.grid ? 'font-color':''">
                <el-form-item label="所在网格:">
                  <span>{{dataAll.afterDutyMess.gridName ? dataAll.afterDutyMess.gridName : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row">
              <span :class="dataAll.dutyMess.so ? 'font-color':''">
                <el-form-item label="监管人员:">
                  <span>{{dataAll.afterDutyMess.soName ? dataAll.afterDutyMess.soName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="dataAll.dutyMess.so ? 'font-color':''">
                <el-form-item label="监管人员联系方式:">
                  <span>{{dataAll.afterDutyMess.soMobile ? dataAll.afterDutyMess.soMobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          
            <div class="row">
              <span :class="dataAll.dutyMess.infoAssi ? 'font-color':''">
                <el-form-item label="网格信息员:">
                  <span>{{dataAll.afterDutyMess.infoAssiName ? dataAll.afterDutyMess.infoAssiName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="dataAll.dutyMess.infoAssi ? 'font-color':''">
                <el-form-item label="网格信息员联系方式:">
                  <span>{{dataAll.afterDutyMess.infoAssiMobile ? dataAll.afterDutyMess.infoAssiMobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="工单操作记录">
          <div style="text-align: left;font-size:20px;margin:20px 0px 0px 11px">
            <!-- <span>工单类型 : {{this.$route.params.type == 'FIRST'? '首次':'编辑'}}</span> -->
            <span>工单类型 : {{this.$route.params.type == 'FIRST'? '首次':'编辑'}}</span>
            <!--  工单类型 -->
          </div>
          <el-table :data="dataAll.recordList" style="margin-top:20px" class="table-div">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optTypeStr" min-width="100" label="操作类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="stateStr" min-width="100" label="操作结果"></el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" min-width="120" label="操作备注"></el-table-column>
            <el-table-column show-overflow-tooltip prop="realName" min-width="100" label="操作员"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optTime" min-width="100" label="操作日期"></el-table-column>
          </el-table>
        </toggle-form>

      </el-form>
    </div>
  </div>
</template>

<script>

import scroll from "utils/scroll";
import ToggleForm from "components/ToggleForm.vue";
import { getInfoFeldChange, getCfdaInfoFeldChange } from "views/subject/common/utils/InfoFieldChange";
import AttachmentUploadDetail from 'components/AttachmentUploadDetail/index';

import * as plan from 'api/cosmetics/workflow'

export default {
  props: {
    workId: String,
    workType: String,
    entryType: String,
  },
  components: {
    ToggleForm,
    AttachmentUploadDetail
  },
  mounted() {
    // if(this.entryType === 'entity' || !this.entryType) {
      plan.getEditInfo(this.workId).then(results => {
        // debugger
        this.dataAll = results.data;
        console.log(this.dataAll.beforeCorpMess)
        this.initProgress();
      });
  },
  updated() {
    if (this.updatedTag) {
      //滚动效果
      scroll.call(this, 'slideIndex');
    }
  },
  methods: {
    initProgress() {
      const option = [{
        show: this.dataAll.booleanBic,
        title: '基础信息（编辑前）',
      }, {
        show: this.dataAll.booleanBic,
        title: '基础信息（编辑后）',
      }, {
        show: this.dataAll.booleanCorp,
        title:'负责人信息（编辑前）',
      }, {
        show: this.dataAll.booleanCorp,
        title: '负责人信息（编辑后）',
      }, {
        show: this.dataAll.booleanManage,
        title: '经营信息（编辑前）',
      }, {
        show: this.dataAll.booleanManage,
        title: '经营信息（编辑后）',
      }, {
        show: this.dataAll.booleanDuty,
        title: '责任落实（编辑前）',
      }, {
        show: this.dataAll.booleanDuty,
        title: '责任落实（编辑后）',
      },{
        show: true,
        title: '工单操作记录',
      }];
      this.progress = option.filter(item => item.show === true);
    }
  },
  data() {
    return {
      cfdaType: "",
      updatedTag: true,
      slideIndex: -1,
      workTableData: [],
      afterSubInfo: {},
      afterSubInfoStr: {},
      beforeSubInfo: {},
      beforeSubInfoStr: {},
      fieldChange: {},
      // 左边悬浮栏的数据
      progress: [
        {show: false, title: '基础信息(编辑后)',},
        {show: false, title: '基础信息(编辑前)',},
        {show: false, title: '负责人信息（编辑后）',},
        {show: false, title:'负责人信息（编辑前）',},
        {show: false, title: '经营信息(编辑后)',},
        {show: false, title: '经营信息(编辑前)',},
        {show: false, title: '责任落实(编辑后)',},
        {show: false, title: '责任落实(编辑前)',},
        {show: true, title: '工单操作记录',},
      ],
      dataAll:{}
    };
  }
}
</script>

<style lang="scss" scoped>
// 左边悬浮信息栏的样式 start
$c: #0db5ef;

.table-div {
  width: 100%;
  text-align: center;
}

.font-color {
  color: red !important;
}
.font-color label {
  color: red;
}

.left-info {
  width: 210px;
  height: 560px;
  background: #fff;
  position: fixed;
  margin-left: -230px;
  margin-top: -20px;
  // z-index: 2;

  .head-block {
    background: #f2f5f8;
    height: 70px;
    padding: 14px 20px;
    box-sizing: border-box;
    .num {
      color: $c;
    }
  }
  .main-block {
    margin-top: 20px;
    // border-right: 2px solid #EBF1F5;
    // min-height: 470px;
    > li {
      border-right: 2px solid #ebf1f5;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      cursor: default;
      &:hover {
        background: #f2f5f8;
      }
      .right {
        color: #a2aab6;
      }
    }
    .activePosition {
      border-right: 2px solid $c;
      .left {
        color: $c;
      }
    }
  }
}
// 左边悬浮信息栏的样式 end

.right-info {
  width: 100%;
}

// .content {
//   padding-left: 25%;
//   margin-top: 20px;
// }
</style>
