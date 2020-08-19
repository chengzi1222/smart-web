<template>
  <div class="bigbox">
    <div>
      <el-input placeholder="请输入主体名" class="w260 selectHeight" v-model="search.keysWord" @keyup.enter.native="findPage">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="findPage"></i>
      </el-input>
      <enum-select  class="selectHeight " v-model="search.patrolState" placeholder="巡查状态" @change="findPage"  enum="com.ybveg.govx.enums.RandomPatrolRecordStateEnum"></enum-select>
      <enum-select  class="selectHeight " v-model="search.entityType" placeholder="主体类型" @change="findPage"  enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
    </div>
    <el-table :data="dataPage" class="table-div">
      <el-table-column type="index" min-width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="entityName" label="主体名"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="entityType" label="主体类型"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="150" prop="realityAddr" label="实际经营地址"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="patrolState" label="巡查状态"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="randomResult" label="巡查结果">
        <template slot-scope="scope">
          {{scope.row.randomResult == null || scope.row.randomResult == '' ? '暂无' : scope.row.randomResult}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="randomTreat" min-width="120" label="处理方式">
        <template slot-scope="scope">
          {{scope.row.randomTreat == null || scope.row.randomTreat == '' ? '暂无' : scope.row.randomTreat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <a v-if="scope.row.patrolState == '已巡查'" href="javascript:;" @click="$router.push({name: 'random.task.record.detail', query: {recordId: scope.row.randomRecordId}})" class="operate-a">巡查记录</a>
          <a href="javascript:;" @click="goEntity(scope.row.entityId, scope.row.entityTypeStr)" class="operate-a">主体档案</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background :current-page="page.pageNum"
                     :page-sizes="[5, 10, 20, 40,50]"
                     :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"
                     @size-change="pageSizeChange"
                     @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {randomTaskEntityPage} from "api/random/random";
  import EnumSelect from 'components/common/EnumSelect.vue';

  export default {
    methods: {
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.findPage();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.findPage();
      },
      //获取分页数据
      findPage(){
        console.log(this.search)
        randomTaskEntityPage(this.search, this.page.pageNum, this.page.pageSize, this.randomTaskId, this.randomTaskGroupId).then(r => {
          this.dataPage = r.data.list;
          this.page.total = r.data.total
        })
      },
      goEntity(entityId, entityType){
        entityType = entityType.toLocaleLowerCase();
        this.$router.push({
          name: "subject.archives.detail",
          params: {
            type: entityType,
          },
          query: {
            id: entityId,
          }
        })
      }
    },
    mounted() {
      if (!this.randomTaskId) {
        return
      }
      if (!this.randomTaskGroupId) {
        return
      }
      this.findPage()
    },
    data() {
      return {
        page: {
          pageSize: 5,
          pageNum: 1,
          total: 0
        },
        dataPage:[],
        scLis:[],
        search:{
          keysWord:'',
          patrolState:'',
          entityType:''
        },
        randomTaskId: '',
        randomTaskGroupId: ''
      }
    },
    props: {
      randomTaskId: {
        type: String
      },
      randomTaskGroupId: {
        type: String
      }
    },
    components: {
      EnumSelect
    }
  }
</script>

<style scoped lang="sass">
  .bigbox{
    position: relative;
  }
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 20px;
  }
  .tab-box .tabLi {
    width: 128px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }
  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }
  .tab-box .li-span{
    color: #393939;
  }
  .tab-box span:first-child{
    margin-right: 10px;
  }
  .dc{
    float: right;
  }
  .table-div{
    margin: 20px 0;
    text-align: center;
  }
  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }
  .operate-a {
    color: #1787AD;
  }
</style>
