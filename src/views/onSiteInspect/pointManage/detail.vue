<template>
  <div  class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>核查要点表详情</span>
    </div>
    <el-form ref="form" :model="form" label-width="200px" class="demo-ruleForm" style="min-height:100%">
      <toggle-form title="基本信息">
        <div class="content">
          <div class="row">
            <el-form-item label="要点表名称">
              <span>{{form.name}}</span>
            </el-form-item> 
          </div>
          <div class="row">
            <el-form-item label="适用类型">
              <span>{{form.businessType}}</span>
            </el-form-item> 
          </div>
          <div class="row">
            <el-form-item label="使用说明">
              <span>{{form.description === ''? '暂无':form.description}}</span>
            </el-form-item>
          </div>
        </div>
      </toggle-form>
      <toggle-form title="要点表核查内容信息" v-if="tableList.length > 0">
        <div class="mT35  mt20">
           <el-table   v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''" :data="item"
                :span-method="objectSpanMethod" border class="table-div brN mT0">
            <el-table-column show-overflow-tooltip prop="projectNo" label="核查项编号" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="核查项目" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="contextNo" label="核查内容编号" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="content" label="核查内容" min-width="250"></el-table-column>
          <el-table-column show-overflow-tooltip  label="重要性" min-width="80">
            <template slot-scope="scope">
              {{importance[scope.row.importance]}} 
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="185">
            <template slot-scope="scope">{{scope.row.status === 'YES'?'启用':'禁用'}}</template>
          </el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination
              background
              @size-change="pageSizeChange"
              @current-change="pageCurrentChange"
              :current-page="queryLimit.pageNum"
              :page-sizes="[10, 20, 30, 40,50]"
              :page-size="queryLimit.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </toggle-form>
      <toggle-form title="要点表判定标准" style="margin-bottom:300px">
        <div class="content">
          <div class="row">
            <el-form-item label="关键项不符合数">
              <span>≤{{form.cruxNum}}项</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="重点项不符合数">
              <span>≤{{form.importantNum}}项</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="一般项+重点项不符合数">
              <span>≤{{form.generalImportNum}}项</span>
            </el-form-item>
          </div>
        </div>
      </toggle-form>
    </el-form>
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
        <el-button type="primary" @click="go('xchc.pointManage.edit')">配置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ToggleForm from "components/ToggleForm.vue";
import * as api from '../../../api/xchc/index'
export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      form: {
        name: '四川省食品经营许可现场核查表',
        type: '适用特大型参观, 大型餐馆,供餐200人以上的学校(含托幼机构)食堂, 供餐500人以上的机关, 企业单位食堂, 其他食堂',
        description: '1. 本表适用于四川省行政区域内食品药品监督管理部门对食品经营(销售)许可申请的审查',
        cruxInconformity: 0,
        pointInconformity: 2,
        allInconformity: 5
      },
      importance:{
        "IMPORTANT":"重点项(**)",
        "CRUX":"关键项(***)",
        "GENERAL":"一般项(*)"
      },
      tableList: [],
      queryLimit: {
        pageSize: 10,
        pageNum: 1,
        tableId: ''
      },
      total: 0
    }
  },
  methods: {
    pageSizeChange(size) {
      this.queryLimit.pageSize = size
      this.getPageList()
    },
    pageCurrentChange(num) { 
      this.queryLimit.pageNum = num
      this.getPageList()
    },
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
      let result = await api.getBaseData({
        tableId:this.queryLimit.tableId
      })
      this.form = result.data
    },
    async getPageList(){
      let result = await api.getTableList(this.queryLimit)
      this.tableList = []
      if(result && result.status){
        let d = result.data.list
        for (let i = 0; i < d.length; i++) {
            let list = [];
            for (let j = 0; j < d[i].contentInfoList.length; j++) {
              let obj = {}
              obj = d[i].contentInfoList[j];
              obj.projectNo = d[i].no;
              obj.name = d[i].name;
              obj.id = d[i].id;
              obj.content = d[i].contentInfoList[j].content;
              obj.importance = d[i].contentInfoList[j].importance;
              obj.contextNo = d[i].contentInfoList[j].no;
              obj.status = d[i].contentInfoList[j].status
              list.push(obj);
            } 
            d[i].contentInfoList.length <=0? '':this.tableList.push(list);
          }
        this.total = result.data.total
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
