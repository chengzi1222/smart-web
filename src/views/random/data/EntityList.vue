<template>
  <div class="bigbox">
    <div>
      <el-input placeholder="许可证编号、主体名称" class="w260 selectHeight" v-model="search.select" @keyup.enter.native="findPage">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="findPage"></i>
      </el-input>
      <enum-select  class="selectHeight " v-model="search.entityType" multiple placeholder="主体类型" @change="findPage"  enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
      <enum-select  class="selectHeight " v-model="search.licenceType" multiple placeholder="许可证类型" @change="findPage"  enum="com.ybveg.govx.enums.ProduceLicenceTypeEnum"></enum-select>
      <select-area-grid  class="selectHeight w150"  placeholder="分管网格"  @change="deptChange"></select-area-grid>
    </div>
    <el-table :data="dataPage" class="table-div" :key="mess.choose">
      <el-table-column type="index"  min-width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="entityName" label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="licence" label="许可备案号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="entityTypeStr" label="主体类型"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="licenceTypeStr" label="许可证类型"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="firstPl" label="负责人"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="deptName" label="分管网格"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="realityAddr" label="注册地址"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="createTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="view(scope.row.id,scope.row.entityType)" class="operate-a">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background :current-page="page.pageNum"
                     :page-sizes="[10, 20, 30, 40,50]"
                     :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"
                     @size-change="pageSizeChange"
                     @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {findEntityList} from "api/random/random";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import SelectAreaGrid from 'components/common/SelectAreaGrid.vue';

  export default {
    methods: {
      //切换导航样式
      choose(index,type) {
        this.mess.choose = index;
        this.mess.type = type;
      },
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
        var formData = {
          params: this.search,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
        findEntityList(formData).then(r => {
          this.dataPage = r.data.list;
          this.page.total = r.data.total
          this.tableData = r.data.list;
        })
      },
      //分管网络
      deptChange(deptId){
        this.search.areaCode = !deptId ? "" : deptId[deptId.length-1];
        this.findPage();
      },
      view(entityId,entityType){
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
      this.findPage();
    },
    data() {
      return {
        mess:{
          choose:0,
          type:''
        },
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dataPage:[],
        scLis:[],
        search:{
          select:'',
          areaCode:'',
          licenceType:[],
          entityType:[]
        }
      };
    },
    components: {
      SelectAreaGrid,
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
