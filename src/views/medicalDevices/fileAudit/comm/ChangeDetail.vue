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
                  <span>{{dataAll.before.entityName ? dataAll.before.entityName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(dataAll.compareBasic.creditCode) ? 'font-color':''">
                <el-form-item label="统一社会信用代码:">
                  <span>{{dataAll.before.creditCode ? dataAll.before.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_EMPLOY'">
              <span :class="(dataAll.compareBasic.employNo) ? 'font-color':''">
                <el-form-item label="医疗机构许可证:">
                  <span>{{dataAll.before.employNo ? dataAll.before.employNo : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.legalPerson) ? 'font-color':''">
                  <el-form-item label="法人姓名:">
                    <span>{{dataAll.before.legalPerson ? dataAll.before.legalPerson : '暂无'}}</span>
                  </el-form-item>
                </span>

                <span :class="(dataAll.compareBasic.legalNo) ? 'font-color':''">
                  <el-form-item label="法人身份证:">
                    <span>{{dataAll.before.legalNo ? dataAll.before.legalNo : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.legalMobile) ? 'font-color':''">
                  <el-form-item label="法人电话:">
                    <span>{{dataAll.before.legalMobile ? dataAll.before.legalMobile : '暂无'}}</span>
                  </el-form-item>
                </span>

                <span :class="(dataAll.compareBasic.corpPerson) ? 'font-color':''">
                  <el-form-item label="负责人:">
                    <span>{{dataAll.before.corpPerson ? dataAll.before.corpPerson : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.contactPerson) ? 'font-color':''">
                  <el-form-item label="联系人:">
                    <span>{{dataAll.before.contactPerson ? dataAll.before.contactPerson : '暂无'}}</span>
                  </el-form-item>
                </span>

                <span :class="(dataAll.compareBasic.contactMobile) ? 'font-color':''">
                  <el-form-item label="联系电话:">
                    <span>{{dataAll.before.contactMobile ? dataAll.before.contactMobile : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

          </div>
        </toggle-form>

        <toggle-form v-if="dataAll.booleanBic" title="基础信息（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="(dataAll.compareBasic.entityName) ? 'font-color':''">
                <el-form-item label="主体名称:">
                  <span>{{dataAll.after.entityName ? dataAll.after.entityName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(dataAll.compareBasic.creditCode) ? 'font-color':''">
                <el-form-item label="统一社会信用代码:">
                  <span>{{dataAll.after.creditCode ? dataAll.after.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_EMPLOY'">
              <span :class="(dataAll.compareBasic.employNo) ? 'font-color':''">
                <el-form-item label="医疗机构许可证:">
                  <span>{{dataAll.after.employNo ? dataAll.after.employNo : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.legalPerson) ? 'font-color':''">
                  <el-form-item label="法人姓名:">
                    <span>{{dataAll.after.legalPerson ? dataAll.after.legalPerson : '暂无'}}</span>
                  </el-form-item>
                </span>

                <span :class="(dataAll.compareBasic.legalNo) ? 'font-color':''">
                  <el-form-item label="法人身份证:">
                    <span>{{dataAll.after.legalNo ? dataAll.after.legalNo : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.legalMobile) ? 'font-color':''">
                  <el-form-item label="法人电话:">
                    <span>{{dataAll.after.legalMobile ? dataAll.after.legalMobile : '暂无'}}</span>
                  </el-form-item>
                </span>

                <span :class="(dataAll.compareBasic.corpPerson) ? 'font-color':''">
                  <el-form-item label="负责人:">
                    <span>{{dataAll.after.corpPerson ? dataAll.after.corpPerson : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span>
              <div class="row">
                <span :class="(dataAll.compareBasic.contactPerson) ? 'font-color':''">
                  <el-form-item label="联系人:">
                    <span>{{dataAll.after.contactPerson ? dataAll.after.contactPerson : '暂无'}}</span>
                  </el-form-item>
                </span>

                <span :class="(dataAll.compareBasic.contactMobile) ? 'font-color':''">
                  <el-form-item label="联系电话:">
                    <span>{{dataAll.after.contactMobile ? dataAll.after.contactMobile : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form v-if="this.dataAll.booleanManage" title="经营信息（编辑前）">
          <div class="content">
            <div class="row">
              <span :class="dataAll.maaiManage.registerAddr ? 'font-color':''">
                <el-form-item :label="entityType === 'MAAI_PRODUCT'?'注册场所':'注册经营场所'">
                  <span>{{dataAll.before.registerAddr ? dataAll.before.registerAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.maaiManage.realityAddr? 'font-color':''">
                <el-form-item label="实际经营地址:">
                  <span>{{dataAll.before.realityAddr ? dataAll.before.realityAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.maaiManage.otherAddr ? 'font-color':''">
                <el-form-item :label="entityType === 'MAAI_PRODUCT'?'生产地址':'仓库地址'">
                  <span>{{dataAll.before.otherAddr ? dataAll.before.otherAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.maaiManage.manageState? 'font-color':''">
                <el-form-item label="营业状态:">
                  <span>{{dataAll.before.manageStateStr ? dataAll.before.manageStateStr : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="dataAll.maaiManage.manageType? 'font-color':''"  v-if="entityType === 'MAAI_MANAGER'">
                <el-form-item label="经营方式:">
                  <span>{{dataAll.before.manageTypeStr ? dataAll.before.manageTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_MANAGER'">
              <span :class="dataAll.maaiManage.enterpriseForm? 'font-color':''">
                <el-form-item label="企业形态:">
                  <span>{{dataAll.before.enterpriseFormStr ? dataAll.before.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="dataAll.maaiManage.online? 'font-color':''">
                <el-form-item label="是否网络经营:">
                  <span>{{dataAll.before.onlineStr ? dataAll.before.onlineStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_MANAGER'">
              <span :class="dataAll.maaiManage.onlineRemark? 'font-color':''">
                <el-form-item label="网络经营备注:">
                  <span>{{dataAll.before.onlineRemark ? dataAll.before.onlineRemark : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_EMPLOY'">
              <span :class="dataAll.maaiManage.enterpriseForm? 'font-color':''">
                <el-form-item label="企业形态:">
                  <span>{{dataAll.before.enterpriseFormStr ? dataAll.before.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_EMPLOY'">
              <span :class="dataAll.maaiManage.category? 'font-color':''">
                <el-form-item label="使用类别:">
                  <span>{{dataAll.before.categoryStr ? dataAll.before.categoryStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form v-if="this.dataAll.booleanManage" title="经营信息（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="dataAll.maaiManage.registerAddr ? 'font-color':''">
                <el-form-item label="注册场所:">
                  <span>{{dataAll.after.registerAddr ? dataAll.after.registerAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.maaiManage.realityAddr? 'font-color':''">
                <el-form-item label="实际经营地址:">
                  <span>{{dataAll.after.realityAddr ? dataAll.after.realityAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.maaiManage.otherAddr ? 'font-color':''">
                <el-form-item :label="entityType === 'MAAI_PRODUCT'?'生产地址':'仓库地址'">
                  <span>{{dataAll.after.otherAddr ? dataAll.after.otherAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="dataAll.maaiManage.manageState? 'font-color':''">
                <el-form-item label="营业状态:">
                  <span>{{dataAll.after.manageStateStr ? dataAll.after.manageStateStr : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="dataAll.maaiManage.manageType? 'font-color':''"  v-if="entityType === 'MAAI_MANAGER'">
                <el-form-item label="经营方式:">
                  <span>{{dataAll.after.manageTypeStr ? dataAll.after.manageTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_MANAGER'">
              <span :class="dataAll.maaiManage.enterpriseForm? 'font-color':''">
                <el-form-item label="企业形态:">
                  <span>{{dataAll.after.enterpriseFormStr ? dataAll.after.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="dataAll.maaiManage.online? 'font-color':''">
                <el-form-item label="是否网络经营:">
                  <span>{{dataAll.after.onlineStr ? dataAll.after.onlineStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_MANAGER'">
              <span :class="dataAll.maaiManage.onlineRemark? 'font-color':''">
                <el-form-item label="网络经营备注:">
                  <span>{{dataAll.after.onlineRemark ? dataAll.after.onlineRemark : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_EMPLOY'">
              <span :class="dataAll.maaiManage.enterpriseForm? 'font-color':''">
                <el-form-item label="企业形态:">
                  <span>{{dataAll.after.enterpriseFormStr ? dataAll.after.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entityType === 'MAAI_EMPLOY'">
              <span :class="dataAll.maaiManage.category? 'font-color':''">
                <el-form-item label="使用类别:">
                  <span>{{dataAll.after.categoryStr ? dataAll.after.categoryStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="dataAll.booleanLicence && entityType !== 'MAAI_EMPLOY'" title="许可备案信息（编辑前）">
          <div class="row">
              <span :class="dataAll.booleanCategory? 'font-color':''">
                <el-form-item :label="entityType === 'MAAI_PRODUCT'?'生产类别:':'经营类别:'">
                  <span>{{dataAll.before.categoryStr ? dataAll.before.categoryStr : '暂无'}}</span>
                </el-form-item>
              </span>
          </div>
          <div class="row" v-if="dataAll.booleanLicence && entityType === 'MAAI_MANAGER'">
            <span :class="dataAll.booleanMultInOne? 'font-color':''" >
                <el-form-item label="是否多证合一">
                  <span>{{dataAll.before.multInOne ? dataAll.before.multInOneStr : '暂无'}}</span>
                </el-form-item>
              </span>
          </div>
          <!--生产主体-->
          <product-card v-if="entityType === 'MAAI_PRODUCT'" :showType="'info'" v-for="(value, key, index) in dataAll.before.maaiLicenceMap" :licence="value" :key="index" :otherLicence="dataAll.after.maaiLicenceMap" :showR="true"></product-card>
          <!--经营主体(非多证合一)-->
          <manager-card v-if="entityType === 'MAAI_MANAGER' && dataAll.before.multInOne === 'NO'" :showType="'info'" v-for="(value, key, index) in dataAll.before.maaiLicenceMap" :key="index" :licence="value" :otherLicence="dataAll.after.maaiLicenceMap" :showR="true"></manager-card>
          <!--经营主体(多证合一)-->
          <manager-one-card v-if="entityType === 'MAAI_MANAGER' && dataAll.before.multInOne === 'YES'" :showType="'info'" v-for="(value, key, index) in dataAll.before.maaiLicenceMap" :key="index" :licence="value" :otherLicence="dataAll.after.maaiLicenceMap" :showR="true"></manager-one-card>
        </toggle-form>

        <toggle-form v-if="dataAll.booleanLicence && entityType !== 'MAAI_EMPLOY'" title="许可备案信息（编辑后）">
          <div class="row">
              <span :class="dataAll.booleanCategory? 'font-color':''">
                <el-form-item :label="entityType === 'MAAI_PRODUCT'?'生产类别:':'经营类别:'">
                  <span>{{dataAll.after.categoryStr ? dataAll.after.categoryStr : '暂无'}}</span>
                </el-form-item>
              </span>
          </div>
          <div class="row" v-if="dataAll.booleanLicence && entityType === 'MAAI_MANAGER'">
            <span :class="dataAll.booleanMultInOne? 'font-color':''" >
                <el-form-item label="是否多证合一">
                  <span>{{dataAll.after.multInOne ? dataAll.after.multInOneStr : '暂无'}}</span>
                </el-form-item>
              </span>
          </div>
          <!--生产主体-->
          <product-card v-if="entityType === 'MAAI_PRODUCT'" :showType="'info'" v-for="(value, key, index) in dataAll.after.maaiLicenceMap" :licence="value" :key="index" :otherLicence="dataAll.before.maaiLicenceMap" :showR="true"></product-card>
          <!--经营主体(非多证合一)-->
          <manager-card v-if="entityType === 'MAAI_MANAGER' && dataAll.after.multInOne === 'NO'" :showType="'info'" v-for="(value, key, index) in dataAll.after.maaiLicenceMap" :key="index" :licence="value" :otherLicence="dataAll.before.maaiLicenceMap" :showR="true"></manager-card>
          <!--经营主体(多证合一)-->
          <manager-one-card v-if="entityType === 'MAAI_MANAGER' && dataAll.after.multInOne === 'YES'" :showType="'info'" v-for="(value, key, index) in dataAll.after.maaiLicenceMap" :key="index" :licence="value" :otherLicence="dataAll.before.maaiLicenceMap" :showR="true"></manager-one-card>
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
            <span>工单类型 : {{this.$route.params.type == 'FIRST'? '首次':'重新审核'}}</span>
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

<script type="module">

  import scroll from "utils/scroll";
  import ToggleForm from "components/ToggleForm.vue";
  import ProductCard from "../card/ProductCard";
  import ManagerCard from "../card/ManagerCard";
  import ManagerOneCard from "../card/ManagerOneCard";
  import AttachmentUploadDetail from 'components/AttachmentUploadDetail/index';
  import {getEditInfo} from 'api/maai/workflow/workedit'

  export default {
    props: {
      workId: String,
      workType: String,
      entityType: String,
    },
    components: {
      ToggleForm,
      AttachmentUploadDetail,
      ProductCard,
      ManagerCard,
      ManagerOneCard
    },
    mounted() {
      getEditInfo(this.workId).then(results => {
        this.dataAll = results.data;
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
        },{
          show: this.dataAll.booleanManage,
          title: '经营信息（编辑前）',
        }, {
          show: this.dataAll.booleanManage,
          title: '经营信息（编辑后）',
        }, {
          show: this.dataAll.booleanLicence,
          title:'许可备案信息（编辑前）',
        }, {
          show: this.dataAll.booleanLicence,
          title: '许可备案信息（编辑后）',
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
          {show: false, title: '经营信息(编辑后)',},
          {show: false, title: '经营信息(编辑前)',},
          {show: false, title: '许可备案信息(编辑前)',},
          {show: false, title: '许可备案信息(编辑前)',},
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
