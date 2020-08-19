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
    <!-- 左边信息悬浮栏 end-->
    <div class="right-info">
      <el-form  label-width="120px" class="demo-ruleForm labW150">
        <!-- 基础信息（编辑前） -->
        <tggle-form title="基础信息（编辑前）" v-if="infoData.booleanBic">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:" :class="infoData.compareBasic.entityName ? 'font-color':''">
                <span>{{infoData.beforeBasic.entityName ? infoData.beforeBasic.entityName:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="社会统一信用代码:" :class="infoData.compareBasic.creditCode ? 'font-color':''">
                <span>{{infoData.beforeBasic.creditCode ? infoData.beforeBasic.creditCode:'暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" >
              <el-form-item label="法人姓名:" :class="infoData.compareBasic.legalPerson ? 'font-color':''">
                <span>{{infoData.beforeBasic.legalPerson ? infoData.beforeBasic.legalPerson:'暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可备案号:" :class="infoData.compareBasic.backupNo ? 'font-color':''">
                <span>{{infoData.beforeBasic.backupNo ? infoData.beforeBasic.backupNo:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="许可证状态(主体状态):" :class="infoData.compareBasic.backupStateStr ? 'font-color':''">
                <span>{{infoData.beforeBasic.backupStateStr ? infoData.beforeBasic.backupStateStr:'暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="有效期自:" :class="infoData.compareBasic.recordBegin ? 'font-color':''">
                <span>{{infoData.beforeBasic.recordBegin}}-{{infoData.beforeBasic.recordEnd}}</span>
              </el-form-item>
            </div>

          </div>
        </tggle-form>

        <!-- 基础信息（编辑后） -->
        <toggle-form title="基础信息（编辑后）" v-if="infoData.booleanBic">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:" :class="infoData.compareBasic.entityName ? 'font-color':''">
                <span>{{infoData.afterBasic.entityName ? infoData.afterBasic.entityName:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="社会统一信用代码:" :class="infoData.compareBasic.creditCode ? 'font-color':''">
                <span>{{infoData.afterBasic.creditCode ? infoData.afterBasic.creditCode:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row ">
              <el-form-item label="法人姓名:" :class="infoData.compareBasic.legalPerson ? 'font-color':''">
                <span>{{infoData.afterBasic.legalPerson ? infoData.afterBasic.legalPerson:'暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可备案号:" :class="infoData.compareBasic.backupNo ? 'font-color':''">
                <span>{{infoData.afterBasic.backupNo ? infoData.afterBasic.backupNo:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="许可证状态(主体状态):" :class="infoData.compareBasic.backupStateStr ? 'font-color':''">
                <span>{{infoData.afterBasic.backupStateStr ? infoData.afterBasic.backupStateStr:'暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="有效期自:" :class="infoData.compareBasic.recordBegin ? 'font-color':''">
                <span>{{infoData.afterBasic.recordBegin}}-{{infoData.afterBasic.recordEnd}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>


        <!-- 负责人信息 -->
        <toggle-form title="负责人信息（编辑前）" v-if="infoData.booleanCorp">
          <div class="content">
            <div class="row">
                <el-form-item label="负责人:" :class="infoData.corpMess.corpName ? 'font-color':''">
                  <span>{{infoData.beforeCorpMess.corpName ? infoData.beforeCorpMess.corpName:'暂无'}}</span>
                </el-form-item>
                <el-form-item label="负责人联系电话:" :class="infoData.corpMess.corpMobile ? 'font-color':''">
                  <span>{{infoData.beforeCorpMess.corpMobile ? infoData.beforeCorpMess.corpMobile:'暂无'}}</span>
                </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="负责人身份证:" :class="infoData.corpMess.idNo ? 'font-color':''">
                <span>{{infoData.beforeCorpMess.idNo ? infoData.beforeCorpMess.idNo:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="质量负责人:" :class="infoData.corpMess.qualityPerson ? 'font-color':''">
                <span>{{infoData.beforeCorpMess.qualityPerson ? infoData.beforeCorpMess.qualityPerson:'暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 负责人信息 -->
        <toggle-form title="负责人信息（编辑后）" v-if="infoData.booleanCorp">
          <div class="content">
            <div class="row">
              <el-form-item label="负责人:" :class="infoData.corpMess.corpName ? 'font-color':''">
                <span>{{infoData.afterCorpMess.corpName ? infoData.afterCorpMess.corpName:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="负责人联系电话:" :class="infoData.corpMess.corpMobile ? 'font-color':''">
                <span>{{infoData.afterCorpMess.corpMobile ? infoData.afterCorpMess.corpMobile:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="负责人身份证:" :class="infoData.corpMess.idNo ? 'font-color':''">
                <span>{{infoData.afterCorpMess.idNo ? infoData.afterCorpMess.idNo:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="质量负责人:" :class="infoData.corpMess.qualityPerson ? 'font-color':''">
                <span>{{infoData.afterCorpMess.qualityPerson ? infoData.afterCorpMess.qualityPerson:'暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息（编辑前）" v-if="infoData.booleanManage">
          <div class="content">
            <div class="row">
              <el-form-item label="注册经营地址:" :class="infoData.manageMess.registerAddr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.registerAddr ? infoData.beforeManageMess.registerAddr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="实际经营地址:" :class="infoData.manageMess.realityAddr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.realityAddr ? infoData.beforeManageMess.realityAddr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="机构类型:" :class="infoData.manageMess.organizationTypeStr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.organizationTypeStr ? infoData.beforeManageMess.organizationTypeStr:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="经营方式:" :class="infoData.manageMess.manageWayStr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.manageWayStr ? infoData.beforeManageMess.manageWayStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row"  v-if="typeExt=='medicine_manager'">
              <el-form-item label="药品企业类型:" :class="infoData.manageMess.enterpriseTypeStr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.enterpriseTypeStr ? infoData.beforeManageMess.enterpriseTypeStr:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="连锁类型:" :class="infoData.manageMess.chainTypeStr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.chainTypeStr ? infoData.beforeManageMess.chainTypeStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="营业状态:" :class="infoData.manageMess.manageStateStr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.manageStateStr ? infoData.beforeManageMess.manageStateStr:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="企业形态:" :class="infoData.manageMess.enterpriseFormStr ? 'font-color':''">
                <span>{{infoData.beforeManageMess.enterpriseFormStr ? infoData.beforeManageMess.enterpriseFormStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="经营类别:" :class="infoData.manageMess.manageType ? 'font-color':''">
                <span>{{infoData.beforeManageMess.manageTypeStr ? infoData.beforeManageMess.manageTypeStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="经营范围:" :class="infoData.manageMess.manageRange ? 'font-color':''">
                <span>{{infoData.beforeManageMess.manageRangeStr ? infoData.beforeManageMess.manageRangeStr:'暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="经营信息（编辑后）" v-if="infoData.booleanManage">
          <div class="content">
            <div class="row">
              <el-form-item label="注册经营地址:" :class="infoData.manageMess.registerAddr ? 'font-color':''">
                <span>{{infoData.afterManageMess.registerAddr ? infoData.afterManageMess.registerAddr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="实际经营地址:" :class="infoData.manageMess.realityAddr ? 'font-color':''">
                <span>{{infoData.afterManageMess.realityAddr ? infoData.afterManageMess.realityAddr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="机构类型:" :class="infoData.manageMess.organizationTypeStr ? 'font-color':''">
                <span>{{infoData.afterManageMess.organizationTypeStr ? infoData.afterManageMess.organizationTypeStr:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="经营方式:" :class="infoData.manageMess.manageWayStr ? 'font-color':''">
                <span>{{infoData.afterManageMess.manageWayStr ? infoData.afterManageMess.manageWayStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="药品企业类型:" :class="infoData.manageMess.enterpriseTypeStr ? 'font-color':''">
                <span>{{infoData.afterManageMess.enterpriseTypeStr ? infoData.afterManageMess.enterpriseTypeStr:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="连锁类型:" :class="infoData.manageMess.chainTypeStr ? 'font-color':''">
                <span>{{infoData.afterManageMess.chainTypeStr ? infoData.afterManageMess.chainTypeStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="营业状态:" :class="infoData.manageMess.manageStateStr ? 'font-color':''">
                <span>{{infoData.afterManageMess.manageStateStr ? infoData.afterManageMess.manageStateStr:'暂无'}}</span>
              </el-form-item>
              <el-form-item label="企业形态:" :class="infoData.manageMess.enterpriseFormStr ? 'font-color':''">
                <span>{{infoData.afterManageMess.enterpriseFormStr ? infoData.afterManageMess.enterpriseFormStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="经营类别:" :class="infoData.manageMess.manageType ? 'font-color':''">
                <span>{{infoData.afterManageMess.manageTypeStr ? infoData.afterManageMess.manageTypeStr:'暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="经营范围:" :class="infoData.manageMess.manageRange ? 'font-color':''">
                <span>{{infoData.afterManageMess.manageRangeStr ? infoData.afterManageMess.manageRangeStr:'暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="责任落实（编辑前）" v-if="infoData.booleanDuty">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:" :class="infoData.dutyMess.syj ? 'font-color':''">
                <span>{{infoData.beforeDutyMess.syjName}}</span>
              </el-form-item>
              <el-form-item label="所在网格:" :class="infoData.dutyMess.grid ? 'font-color':''">
                <span>{{infoData.beforeDutyMess.gridName}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="监管人员:" :class="infoData.dutyMess.so ? 'font-color':''">
                <span>{{infoData.beforeDutyMess.soName}}</span>
              </el-form-item>
              <el-form-item label="监管人员联系方式:" :class="infoData.dutyMess.so ? 'font-color':''">
                <span>{{infoData.beforeDutyMess.soMobile}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="网格信息员:" :class="infoData.dutyMess.infoAssi ? 'font-color':''">
                <span>{{infoData.beforeDutyMess.infoAssiName}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:" :class="infoData.dutyMess.infoAssi ? 'font-color':''">
                <span>{{infoData.beforeDutyMess.infoAssiMobile}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="责任落实（编辑后）" v-if="infoData.booleanDuty">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:" :class="infoData.dutyMess.syj ? 'font-color':''">
                <span>{{infoData.afterDutyMess.syjName}}</span>
              </el-form-item>
              <el-form-item label="所在网格:" :class="infoData.dutyMess.grid ? 'font-color':''">
                <span>{{infoData.afterDutyMess.gridName}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="监管人员:" :class="infoData.dutyMess.so ? 'font-color':''">
                <span>{{infoData.afterDutyMess.soName}}</span>
              </el-form-item>
              <el-form-item label="监管人员联系方式:" :class="infoData.dutyMess.so ? 'font-color':''">
                <span>{{infoData.afterDutyMess.soMobile}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="网格信息员:" :class="infoData.dutyMess.infoAssi ? 'font-color':''">
                <span>{{infoData.afterDutyMess.infoAssiName}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:" :class="infoData.dutyMess.infoAssi ? 'font-color':''">
                <span>{{infoData.afterDutyMess.infoAssiMobile}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="工单操作记录">
          <div style="text-align: left;font-size:20px;margin:20px 0px 0px 11px">
            <span>工单类型 : 编辑</span>
          </div>
          <el-table :data="infoData.recordList" style="margin-top:20px" class="table-div">
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
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";

  export default {
    mounted(){
      //滚动效果
      scroll.call(this,'slideIndex');
      this.getProgress();
    },
    components: {
      ToggleForm,
    },
    methods:{
      getProgress(){
        let progress = this.progress;
        if(this.infoData.booleanBic){
          progress.push({"title":'基础信息（编辑前）'});
          progress.push({"title":'基础信息（编辑后）'});
        }
        if(this.infoData.booleanCorp){
          progress.push({"title":'负责人信息（编辑前）'});
          progress.push({"title":'负责人信息（编辑后）'});
        }
        if(this.infoData.booleanManage){
          progress.push({"title":'经营信息（编辑前）'});
          progress.push({"title":'经营信息（编辑后）'});
        }
        if(this.infoData.booleanDuty){
          progress.push({"title":'责任落实（编辑前）'});
          progress.push({"title":'责任落实（编辑后）'});
        }
        this.progress.push({"title":'工单操作记录'});
      }
    },
    props:{
      infoData: {
        type: Object,
      },
      typeExt:{
        type:String,
      }
    },
    data() {
      return {
        slideIndex:-1,
        workTableData:[],
        progress:[],
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 左边悬浮信息栏的样式 start
  $c:#0db5ef;

  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: -20px;
  // z-index: 2;

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
    margin-top: 20px;
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
       width: 100%;
     }

  // .content {
     //   padding-left: 25%;
     //   margin-top: 20px;
     // }

  .table-div {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
  .font-color{
    color: red;
  }
</style>
