<template>
  <div class="user-box" ref="loadingDiv">
    <div class="page-tilt">
      <b></b><span>日常巡查策略配置</span><Back v-if="edit"></Back>
    </div>
    <toggle-form title="当前巡查模式">
      <div class="childBox">
        <span class="floatL">当前巡查模式：</span>
        <span v-if="!edit">{{daily.type == 'INTELLIGENT' ? '智能模式':'自由模式'}}</span>
        <enum-select @getName="getTypeName" :clearable="false" v-else class="w120" v-model="daily.type" enum="com.ybveg.govx.enums.medi.patrol.PlanDailyTypeEnum"
          placeholder="请选择"></enum-select>
      </div>
    </toggle-form>

    <toggle-form title="巡查频次配置" v-if="daily.type == 'INTELLIGENT'">
      <div style="margin: 34px 0;">
        <el-table style="width: 100%;" :data="daily.planDailyConfigs" class="table-div">
          <el-table-column label="序号">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column prop="otherRiskStr" label="风险等级"></el-table-column>
          <el-table-column prop="otherQuantifyStr" label="量化等级"></el-table-column>
          <el-table-column label="巡查频次/年">
            <template slot-scope="scope">
              <span v-if="!edit">{{scope.row.times}}</span>
              <el-select v-model="scope.row.times" placeholder="请选择" v-if="edit">
                <el-option v-for="item in options" :label="item" :key="item" :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </toggle-form>
    <toggle-form title="新增主体默认生效时间设置" v-if="daily.type == 'INTELLIGENT'">
      <div class="childBox">
        <span class="floatL">默认生效时间：</span>
        <span v-if="!edit">{{daily.effeTimeStr}}</span>
        <span v-else>
          <enum-select :clearable="false" class="w120" @getName="getEffeTime" v-model="daily.effeTime" enum="com.ybveg.govx.enums.medi.patrol.PlanDailyEffeEnum"
            placeholder="请选择"></enum-select>
        </span>
      </div>
    </toggle-form>
    <div class="freetxt" v-if="this.daily.type == 'FREE'">
      <h3>说明：自由模式下，系统将不会规定主体的巡查频次</h3>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button v-if="!edit" @click="editCik()" v-auth="'cosmetic.daily.plan|func.edit'" class="cdit">编辑</el-button>
        <el-button v-if="edit" @click="offCik()">取消</el-button>
        <el-button v-if="edit" @click="saveCik()" class="cdit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Back from "utils/back.vue"; //返回上一个页面按钮
  import ToggleForm from "components/ToggleForm"; //列表块
  import EnumSelect from "components/common/EnumSelect";
  // import {getConfig, updateConfig} from "api/medi/patrol/plan.js";
  import * as plan from 'api/cosmetics/dailyStrategy'


  export default {
    components: {
      Back,
      ToggleForm,
      EnumSelect
    },
    mounted() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 1)',
        target: this.$refs['loadingDiv']
      });

      plan.getInfo().then(r => {
        this.daily = r.data;
        loading.close();
      });

    },
    methods: {
      getTypeName(name) {
        this.daily.typeLabel = name;
      },
      getEffeTime(name) {
        this.daily.effeTimeLabel = name;
      },
      editCik() {
        this.tmp = JSON.parse(JSON.stringify(this.daily));
        this.edit = true;
      },
      offCik() {
        this.daily = JSON.parse(JSON.stringify(this.tmp));
        this.edit = false;
      },
      saveCik() {
        plan.postEdit(this.daily).then(r => {
          if (r.status) {
            this.edit = false;
            this.$message({ message: '提交保存成功!', type: 'success' });
            plan.getInfo().then(r => {
              this.daily = r.data;
            });
          }
        });
      }
    },
    data() {
      return {
        daily: {
          id: '',
          areaCode: '',
          type: '',
          typeLabel: '',
          effeTime: '',
          effeTimeLabel: '',
          config: []
        },
        tmp: {},
        tag: true,
        options: [1, 2, 3, 4, 6],
        edit: false,
        tableData: [],
      };
    }

  };
</script>

<style scoped lang="sass">
  .app-container>div {
    height: auto !important;
  }

  .user-box {
    margin-bottom: 150px;
  }

  .titBox {
    background: #f2f5f8;
    height: 30px;
    line-height: 30px;
    margin-top: 20px;
  }

  .titBox b {
    background: #606979;
    height: 30px;
    width: 3px;
    display: inline-block;
    float: left;
  }

  .titBox span {
    margin-left: 13px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #6d7787;
  }

  .titBox div {
    float: right;
    width: 30px;
    height: 30px;
    background: #e7ecf2;
  }

  .childBox {
    width: 300px;
    height: 34px;
    line-height: 34px;
    margin: 34px auto;
  }

  .childBox span {
    font-size: 14px;
  }

  .childBox span:first-child {
    color: #6d7787;
  }

  .childBox span:last-child {
    color: #393939;
  }

  .table-div {
    text-align: center;
  }

  .cdit {
    background: #0db5ef;
    color: #fff;
  }

  .forbidden {
    background: #b5bec6;
    color: #fff;
  }

  .freetxt {
    text-align: center;
    margin-top: 34px;
    margin-bottom: 34px;
  }
</style>