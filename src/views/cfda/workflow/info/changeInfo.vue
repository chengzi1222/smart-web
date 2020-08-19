<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
          <p class="floatR right">
            <span>{{item.successNum}}</span>
            <span>{{item.totalNum}}</span>
          </p>
        </li>
      </ul>
    </div>
    <!-- 左边信息悬浮栏 end-->
    <div class="right-info">
      <el-form label-width="110px" class="demo-ruleForm">
        <!-- 经营信息 -->
        <!-- 经营信息（变更前） -->
        <toggle-form title="经营信息(变更前)">
          <div class="content">
            <div class="row" v-if="cfdaType == 'SALE' || cfdaType == 'CFDARESTAURANT'">
              <el-form-item label="主营项目:">
                {{cfdaBefore.projectMainStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfdaType == 'SALE' || cfdaType == 'CFDARESTAURANT'">
              <el-form-item label="兼营项目:">
                {{cfdaBefore.projectSidStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfdaType == 'WORKSHOP'">
              <el-form-item label="生产形式:">
                {{cfdaBefore.prodFormStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfdaType == 'WORKSHOP'">
              <el-form-item label="生产类别:">
                {{cfdaBefore.prodTypeStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfdaType == 'WORKSHOP'">
              <el-form-item label="品种明细:">
                {{cfdaBefore.prodVarietyStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfdaType == 'VENDORS'">
              <el-form-item label="食品销售:">
                {{cfdaBefore.foodSalesStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfdaType == 'VENDORS'">
              <el-form-item label="食品制售:">
                {{cfdaBefore.foodProdStr}}
              </el-form-item>
            </div>

          </div>
        </toggle-form>
        <!-- 经营信息（变更前） -->
        <toggle-form title="经营信息(变更后)">
          <div class="content">
            <div class="row" v-if="cfdaType == 'SALE' || cfdaType == 'CFDARESTAURANT'">
              <span :class="cfdaAfter.projectMainStr != cfdaBefore.projectMainStr?'font-color':''">
                <el-form-item label="主营项目:">
                  {{cfdaAfter.projectMainStr}}
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="cfdaType == 'SALE' || cfdaType == 'CFDARESTAURANT'">
              <span :class="cfdaAfter.projectSidStr != cfdaBefore.projectSidStr?'font-color':''">
                <el-form-item label="兼营项目:">
                  {{cfdaAfter.projectSidStr}}
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="cfdaType == 'WORKSHOP'">
              <span :class="cfdaAfter.prodFormStr != cfdaBefore.prodFormStr?'font-color':''">
                <el-form-item label="生产形式:">
                  {{cfdaAfter.prodFormStr}}
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="cfdaType == 'WORKSHOP'">
              <span :class="cfdaAfter.prodTypeStr != cfdaBefore.prodTypeStr?'font-color':''">
                <el-form-item label="生产类别:">
                  {{cfdaAfter.prodTypeStr}}
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="cfdaType == 'WORKSHOP'">
              <span :class="cfdaAfter.prodVarietyStr != cfdaBefore.prodVarietyStr?'font-color':''">
                <el-form-item label="品种明细:">
                  {{cfdaAfter.prodVarietyStr}}
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="cfdaType == 'VENDORS'">
              <span :class="cfdaAfter.foodSalesStr != cfdaBefore.foodSalesStr?'font-color':''">
                <el-form-item label="食品销售:">
                  {{cfdaAfter.foodSalesStr}}
                </el-form-item>
              </span>
            </div>
            <div class="row" v-if="cfdaType == 'VENDORS'">
              <span :class="cfdaAfter.foodProdStr != cfdaBefore.foodProdStr?'font-color':''">
                <el-form-item label="食品制售:">
                  {{cfdaAfter.foodProdStr}}
                </el-form-item>
              </span>
            </div>

          </div>
        </toggle-form>

        <toggle-form title="工单操作记录">
          <div style="text-align: left;font-size:20px;margin:20px 0px 0px 11px">
            <span>工单类型 : {{cfdaWorkType}}</span>
          </div>
          <el-table :data="workTableData" class="table-div">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optType" min-width="100" label="操作类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="state" min-width="100" label="操作结果"></el-table-column>
            <el-table-column show-overflow-tooltip prop="backReason" min-width="120" label="操作备注"></el-table-column>
            <el-table-column show-overflow-tooltip prop="username" min-width="100" label="操作员"></el-table-column>
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
  import { getRecordByWorkId } from "api/cfda/bizWorkflow";
  export default {
    components: {
      ToggleForm
    },
    mounted() {
      //滚动效果
      scroll.call(this, 'slideIndex');

      getRecordByWorkId({
        workId: this.workId
      }).then((r) => {
        this.workTableData = r.data;
      });

    },
    methods: {

    },
    props: {
      cfdaAfter: {
        type: Object,
      },
      cfdaBefore: {
        type: Object,
      },
      workId: {
        type: String,
      },
      cfdaWorkType: {
        type: String,
      },
      cfdaType: {
        type: String,
      },
    },
    data() {
      return {
        slideIndex: -1,
        tableData: [{ index: 1 }, { index: 2 }],
        workTableData: [],


        // 左边悬浮栏的数据
        progress: [
          {
            title: '经营项目（变更前）'
          },
          {
            title: '经营项目（变更后）'
          }, {
            title: '工单操作记录'
          }
        ],

      }
    }
  }
</script>

<style lang="scss" scoped>
  // 左边悬浮信息栏的样式 start
  $c: #0db5ef;
  .font-color {
    color: red !important;
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
      >li {
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

  // 更多食品类别的按钮
  .row .more-btn {
    display: block;
    background: #ebeff2;
    color: #6d7787;
    margin-bottom: 10px;
    border: 0px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
  }

  // .content {
  //     // padding-left: 25%;
  //     margin-top: 20px;
  // }

  .table-div {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
</style>