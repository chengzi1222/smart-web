<template>

  <div class="table-content">

    <div class="ipt-btn-box" style="justify-content: end;margin-left: -20px;">
      <enum-select class="selectHeight" v-model="condition.type" placeholder="业务类型" enum="com.ybveg.govx.enums.sub.SubWorkTypeEnum" @change="searchPage"></enum-select>
    </div>

    <div class="tabOffTop50">
      <el-table :data="tableData" style="margin-top:20px" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="100" label="编辑类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creatName" min-width="100" label="操作员"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reviewName" min-width="100" label="审核员"></el-table-column>
        <el-table-column show-overflow-tooltip prop="saveTime" min-width="100" label="审核日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="review(scope.row,false)" class="operate-a">详情</a>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>

  </div>

</template>

<script>

import {recordPage} from "api/cosmetics/subject";
import EnumSelect from 'components/common/EnumSelect';

  export default {
    mounted(){
      this.searchPage();
    },
    components: {
      EnumSelect
    },
    methods:{
      searchPage() {
        this.recordPage();
      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      recordPage(){
        const params = this.condition;
        const formData = {
          params: params,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        };
        recordPage(formData).then(result=>{
          this.tableData = result.data.list;
          this.page = result.data;
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
        })
      },
      review(row,isReivew){
        let name = "";
        let _query = this.$route.query;
        if (this.$route.name == 'production.editors') {
          name = "production.compile";
        } else if (this.$route.name == 'manage.editors') {
          name = "manage.compile";
        } else if (this.$route.name == 'use.editors') {
          name = "use.compile";
        } else {
          name = 'myWorkIndex.compile'
        }
        if (this.Routepush) {
          this.$router.push({
            name: name,
            query: {
              id: row.id,
              review: false,
              type: row.type,
              entityName: row.entityName,
              entityType: _query.entityType
            }
          })
        } else {
          if (row.type == "FIRST") {
            this.$emit('tabChange','detail')
          } else {
            this.$emit('tabChange', 'info')
            // this.$router.push({
            //   name: name,
            //   query: {
            //     id: row.id,
            //     review: false,
            //     type: row.type,
            //     entityName: row.entityName,
            //     entityType: _query.entityType
            //   }
            // })
          }
        }
      }
    },
    props:{
      entityId: {
        type: String,
      },
      Routepush: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      condition: {
        type: "", //主体类型
        sort: "DESC",
        entityId:this.entityId
      },
       tableData:null,//表格
      }
    }
  }
</script>

<style lang="scss" scoped>
.table-content{
    margin-left: -227px;
    height: 100%;
}
</style>
