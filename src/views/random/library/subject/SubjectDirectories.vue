<template>
  <div>
    <div>
      <el-input placeholder="许可证编号、主体名称" class="w200 seekIpt selectHeight" style="margin-left: 0px;" v-model="search.select" @keyup.enter.native="findPage">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="findPage"></i>
      </el-input>
      <enum-select  style="margin-left: 20px;width: 180px;" v-model="search.entityType" multiple placeholder="主体类型(全部)" @change="findPage"  enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
      <enum-select  style="margin-left: 20px;width: 230px;" v-model="search.licenceType" multiple placeholder="请选择许可证类型(全部)" @change="findPage"  enum="com.ybveg.govx.enums.sub.SubLicenceTypeEnum"></enum-select>
      <select-area-grid  class="w150 selectHeight" placeholder="分管网格"  @change="deptChange"></select-area-grid>
    </div>
    <el-table :data="dataPage"  :border="true" :resizable="true"  class="table-div" :key="mess.choose" @sort-change="handleSortChange"  v-loading="loading">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityName" label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="licence" label="许可备案号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entityTypeStr" label="主体类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="licenceTypeStr" label="许可证类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="firstPl" label="负责人"></el-table-column>
      <el-table-column show-overflow-tooltip prop="deptName" label="分管网格"></el-table-column>
      <el-table-column show-overflow-tooltip prop="realityAddr" label="经营地址"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" sortable="custom" label="更新时间"></el-table-column>
      <el-table-column label="操作" fixed="right">
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
        this.loading=true;
        findEntityList(formData).then(r => {
          this.loading=false;
          this.dataPage = r.data.list;
          this.page.total = r.data.total
          this.tableData = r.data.list;
        })
      },
      // 排序
      handleSortChange({order}) {
        this.search.sort = order == 'descending' ? 'DESC' : 'ASC';
        this.findPage();
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
            type: entityType.toLowerCase(),
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
          sort:'DESC',
          entityType:[],
        },
        loading: false,
      };
    },
    components: {
      SelectAreaGrid,
      EnumSelect
    },

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
