<template>
  <div  class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>检查要点表详情</span>
    </div>
    <el-form ref="form" :model="form" label-width="200px" class="demo-ruleForm" style="min-height:100%">
      <toggle-form title="基本信息">
        <div class="content">
          <div class="row">
            <el-form-item label="要点表名称:">
              <span>{{form.name}}</span>
            </el-form-item> 
          </div>
          <div class="row">
            <el-form-item label="表类型:">
              <span>{{form.type === 'DYNAMIC'?'动态评分表':'静态评分表'}}</span>
            </el-form-item> 
          </div>
          <div class="row">
            <el-form-item label="适用类型:">
              <span>{{businessType[form.businessType]}}</span>
            </el-form-item> 
          </div>
          <div class="row">
            <el-form-item label="分数统计选项:">
              <span>{{form.statisticsOptions === 'YES'?'是':'否'}}</span>
            </el-form-item> 
          </div>
          <div class="row">
            <el-form-item label="备注:">
              <span>{{form.remark === ''? '暂无':form.remark}}</span>
            </el-form-item>
          </div>
        </div>
      </toggle-form>
      <toggle-form title="要点表信息">
        <div class="mT35  mt20">
           <el-table   v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''" :data="item"
                :span-method="objectSpanMethod" border class="table-div brN mT0">
            <el-table-column show-overflow-tooltip prop="projectNo" label="检查项编号" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="检查项目" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="计分规则" min-width="120">
             <template slot-scope="scope">
              {{rule[scope.row.rule]}} 
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="contextNo" label="检查内容编号" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="content" label="检查内容" min-width="250"></el-table-column>
          <el-table-column show-overflow-tooltip  prop="score" label="分值" min-width="80"></el-table-column>
          <el-table-column align="center" label="状态" min-width="185">
            <template slot-scope="scope">{{scope.row.status === 'ENABLE'?'启用':'禁用'}}</template>
          </el-table-column>
          </el-table>
        </div>
      </toggle-form>
    </el-form>
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
        <el-button type="primary" @click="go('restaurantRating.pointManage.edit')">配置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ToggleForm from "components/ToggleForm.vue";
import * as api from '../../../../api/rating/restaurantRating2'
export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      form: {
        name: '',
        type: '',
        description: '',
        cruxInconformity: 0,
        pointInconformity: 2,
        allInconformity: 5
      },
      rule:{
        "SINGLE":"单选计分",
        "MULTIPLE":"多选计分",
        "HIGHEST":"多选取最高值计分"
      },
      tableList: [],
      queryLimit: {
        contentStatus:'',
        tableId: ''
      },
      businessType:{
        'CFDARESTAURANT':'小经营店(餐饮)',
        'RESTAURANT':'餐饮主体'
      }
    }
  },
  methods: {
    go(page){
      this.$router.push({
        name:page,
        query:{
          id:this.queryLimit.tableId
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let rownum = 0;
      for (var i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].indexOf(row) >= 0) {
          rownum = this.tableList[i].length;
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
    async getData(){
      let result = await api.getBaseInfo({
        tableId:this.queryLimit.tableId
      })
      this.form = result.data
    },
    async getPageList(){
      let result = await api.getContentList(this.queryLimit)
      this.tableList = []
      if(result && result.status){
        let d = result.data
        for (let i = 0; i < d.length; i++) {
            let list = [];
            for (let j = 0; j < d[i].contentList.length; j++) {
              let obj = {}
              obj = d[i].contentList[j];
              obj.projectNo = d[i].no;
              obj.name = d[i].name;
              obj.id = d[i].id;
              obj.rule = d[i].rule
              obj.content = d[i].contentList[j].content;
              obj.score = d[i].contentList[j].score;
              obj.contextNo = d[i].contentList[j].no;
              obj.status = d[i].contentList[j].status
              list.push(obj);
            } 
            d[i].contentList.length <=0? '':this.tableList.push(list);
          }
      }
    }
  },
  mounted() {
    this.queryLimit.tableId = this.$route.query.id
    this.getData()
    this.getPageList()
  }
}
</script>
<style lang="scss" scoped>
  .bigbox {
        width: 100%;
        position: relative;
    }
    .table-div {
        margin: 20px 0;
        text-align: center;
    }

    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
    .mT0{
      margin:0;
    }
.content {
  margin: 20px auto 0px;
  width: 750px;
}
</style>
