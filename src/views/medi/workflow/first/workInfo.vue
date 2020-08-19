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
        <!-- 基础信息 -->
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:" >
                <span>{{ info.mapInfo.entityName }}</span>
              </el-form-item>
              <el-form-item label="社会统一信用代码:">
                <span>{{ info.mapInfo.creditCode }}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="法人姓名:">
                <span>{{ info.mapInfo.legalPerson }}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可备案号:">
                <span>{{ info.mapInfo.backupNo }} </span>
              </el-form-item>
              <el-form-item label="许可证状态(主体状态):">
                <span>{{ info.mapInfo.backupState }}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="有效期自:">
                <span>{{ info.mapInfo.recordBegin }}-{{ info.mapInfo.recordEnd }}</span>
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 负责人信息 -->
        <toggle-form title="负责人信息">
          <div class="content">
            <div class="row">
              <el-form-item label="负责人:" >
                <span>{{ info.mapInfo.corpName }}</span>
              </el-form-item>
              <el-form-item label="负责人电话:" >
                <span>{{ info.mapInfo.corpMobile }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="负责人身份证:" >
                <span>{{ info.mapInfo.idNo }}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="质量负责人:" >
                <span>{{ info.mapInfo.qualityPerson }}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">
            <div class="row">
              <el-form-item label="注册经营地址:" prop="">
                <span>{{ info.mapInfo.registerAddr }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="实际经营地址:" >
                <span>{{ info.mapInfo.realityAddr }}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="机构类型:">
                <span>{{ info.mapInfo.organizationTypeStr }}</span>
              </el-form-item>
               <el-form-item label="经营方式:" >
                <span>{{ info.mapInfo.manageWayStr }}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="药品企业类型:" >
                <span>{{ info.mapInfo.enterpriseTypeStr }}</span>
              </el-form-item>
              <el-form-item label="连锁类型:" >
                 <span>{{ info.mapInfo.chainTypeStr }}</span>
              </el-form-item>
            </div>
            <div class="row" >
              <el-form-item label="营业状态:" >
                <span>{{ info.mapInfo.manageStateStr }}</span>
              </el-form-item>
              <el-form-item label="企业形态:" >
                <span>{{ info.mapInfo.enterpriseFormStr}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="经营类别:" >
                <span>{{ info.mapInfo.manageTypeStr }}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="typeExt=='medicine_manager'">
              <el-form-item label="经营范围:" >
                <span>{{ info.mapInfo.manageRangeStr }}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form title="责任落实">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:" >
                <span>{{ info.mapInfo.syjName }}</span>
              </el-form-item>
              <el-form-item label="所在网格:" >
                <span>{{ info.mapInfo.gridName }}</span>
              </el-form-item>
            </div>
            <div class="row" >
              <el-form-item label="监管人员:" >
                <span>{{ info.mapInfo.soName }}</span>
              </el-form-item>
              <el-form-item label="监管人员联系方式:" >
                <span>{{ info.mapInfo.soNumber }}</span>
              </el-form-item>
            </div>
            <div class="row" >
              <el-form-item label="网格信息员:">
                <span>{{ info.mapInfo.infoAssiName }}</span>
              </el-form-item>
              <el-form-item label="信息员联系方式:" >
                <span>{{ info.mapInfo.infoAssiNumber }}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
        <toggle-form title="工单操作记录">
          <div style="text-align: left;font-size:20px;margin:20px 0px 0px 11px">
            <span>工单类型 : {{ info.typeStr }}</span>
          </div>
          <el-table :data="info.listRecords" style="margin-top:20px" class="table-div">
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
    props: {
      infoData: {
        type: Object,
      },
      typeExt:{
        type:String,
      }
    },
  mounted(){
      //滚动效果
      scroll.call(this,'slideIndex');
    },
    components: {
      ToggleForm,
    },
    methods:{

    },
    watch:{
      infoData(v){
       this.info=v;
      }
    },
    data() {
      return {
        info:{
          mapInfo:{},
          listRecords:{},
          typeStr:"",
          listRecords:[]
        },
        slideIndex:-1,
        workTableData:[],
        progress:[// 左边悬浮栏的数据
          {
            title:'基础信息',

          },
          {
            title:'负责人信息',

          },
          {
            title:'经营信息',

          },
          {
            title:'责任落实',

          },
          {
            title:'工单操作记录',

          }
        ],
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
</style>
