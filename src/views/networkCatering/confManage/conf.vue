<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>风险管理</span>
      <Back></Back>
    </div>
    <div class="dataBox">
      <toggle-form title="配置区域" style="margin-top: 0">
        <div class="childBox" style="text-align:center;">
          <span style="margin-right:6px;">所属辖区:</span>
          <el-cascader ref="cascader" class="w200" v-model="areaCode" :options="areaList.options" @change="areaChange" :props="areaList.props" clearable placeholder="所属辖区"></el-cascader>
        </div>
      </toggle-form>
      <toggle-form title="风险类别" style="margin-top: 30px;">
        <div class="childBox mT35">
          <el-table v-for="(item,index) in riskTypeData" :class="index==0?'firsTeit':''" :key="item.key" :data="item.content" :span-method="typeSpanMethod" border class="table-div brN" v-loading="tableLoading">
            <el-table-column show-overflow-tooltip label="风险类型" min-width="150">
              <template slot-scope="scope">
                 <span>{{item.title?item.title:'-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="巡查项目" min-width="150">
              <template slot-scope="scope">
                <el-input v-if="scope.row.state === 'YES'" class="w150" v-model="scope.row.patrol"></el-input>
                <span v-else>{{scope.row.patrol?scope.row.patrol:'-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="风险点分数" min-width="150">
              <template slot-scope="scope">
                <el-input v-if="scope.row.state === 'YES'" class="w150" v-model="scope.row.score"></el-input>
                <span v-else>{{scope.row.score?scope.row.score : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" min-width="150">
              <template slot-scope="scope">
                <span>{{scope.row.state === 'YES' ? '启用' : '禁用'}}
                  <el-switch v-model="scope.row.state" active-color="#0DB5EF" inactive-color="#C5CFD9" active-value="YES" inactive-value="NO"></el-switch>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </toggle-form>
      <toggle-form title="风险等级" style="margin-top:30px; margin-bottom: 100px;">
        <div class="childBox">
          <el-table :data="riskLvData" border class="table-div r30 allDown movePoin" v-loading="tableLoading">
            <el-table-column show-overflow-tooltip prop="riskType" label="风险等级" min-width="150">
              <template slot-scope="scope">
                <span>范围</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="high" label="高风险" min-width="150">
              <template slot-scope="scope">
                <span>≤</span>
                <el-input class="ml10" style="width:60px;" v-model="scope.row.high"></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="normal" label="中风险" min-width="150">
              <template slot-scope="scope">
                <span>≤</span>
                <el-input class="ml10" style="width:60px;" v-model="scope.row.normal"></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="low" label="低风险" min-width="150">
              <template slot-scope="scope">
                <span>≤</span>
                <el-input class="ml10" style="width:60px;" v-model="scope.row.low"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </toggle-form>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn">
      <div class="fr">
        <el-button @click="cancal()">取消</el-button>
        <el-button @click="submit()" type="primary">确认并提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import * as merchantInfoApi from "api/networkCatering/merchantInfo"
import ToggleForm from "components/ToggleForm"; //列表块
import Back from 'utils/back.vue' // 返回上一页按钮
export default {
  components: {
    ToggleForm,
    Back
  },
  data() {
    return {
      areaCode: '',
      // 所属辖区级联选择器配置
      areaList: {
        selectedOptions: [],
        options: [],
        parentCode: '',
        props: {
          checkStrictly: true,
          expandTrigger: 'click',
          value: 'areaCode',
          label: 'areaName',
          children: 'children',
          lazy: true,
          lazyLoad(node, resolve) {}
        }
      },
      tableLoading: false,
      riskTypeData: [],
      riskLvData: []
    }
  },
  computed: {
      
  },
  methods: {
    // 点击区域节点前的圆圈进行选择
    areaChange(val) {   
        this.areaList.selectedOptions = val;
        this.tableRefresh();
    },
    // 合并行
    typeSpanMethod({ row, column, rowIndex, columnIndex }) {
      let rownum = 0;
      for(var i=0;i<this.riskTypeData.length;i++){
        if(this.riskTypeData[i].content.indexOf(row) >= 0) {
          rownum = this.riskTypeData[i].content.length;
          break;
        }
      }
      if (columnIndex === 0) {
        if(rowIndex%rownum == 0){
          return [rownum, 1]
        } else {
          return [0,0]
        }
      }
    },
    tableRefresh() {
      this.riskTypeData = [{title: '证照风险(25分)',key:'01', content: [{patrol:'无证照', score:'0'},{patrol:'证照重复', score:'0'}, {patrol:'证照模糊', score:'0'}, {patrol:'无店面照片', score:'0'}]},
                            {title: '地址风险(25分)',key:'02', content: [{patrol:'无地址', score:'0'},{patrol:'地址重复', score:'0'}, {patrol:'地址模糊', score:'0'}]},
                            {title: '联系方式风险(25分)',key:'03', content: [{patrol:'无号码', score:'0'}, {patrol:'号码重复', score:'0'}]},
                            {title: '评价风险(25分)',key:'04', content: [{patrol:'评分较低', score:'0'},{patrol:'卫生问题', score:'0'}, {patrol:'不良反应', score:'0'}]}]
      this.riskLvData = [{high: '12', normal: '34', low: '56'}]
    },
    cancal() {
      this.$router.go(-1)
    },
    submit() {

    }
  },
  created() {
    let that = this
    that.areaList.props.lazyLoad = function (node, resolve) {
      // let code = node.value ? node.value : that.userInfoAreaCode;
      // if (code.length > 6) { 
      //   return resolve([]) 
      // }
      // area.findArea(code).then(r => {
      //   if (r.status) {
      //     resolve(r.data)
      //   }
      // });
    }
  },
  mounted() {
    this.tableRefresh()
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
}
.dataBox {
  margin-top: 20px;
  .childBox {
    margin-top: 30px;
    /deep/ .el-input__inner{
      text-align: center !important;
    }
  }
  .brN .is-leaf {
    border-right: 0;
  }
  .brN tr td {
    border-right: 0;
  }
  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }
  .brN .el-table__header-wrapper {
    display: none;
  }
  .firsTeit .el-table__header-wrapper {
    display: block;
  }
  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }
  .mT35 .el-table {
    border-top: none !important;
  }
}
</style>
