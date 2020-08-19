<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>版本更新列表</span>
    </div>
    <div class="ipt-btn-box" >
      <el-button class="selectHeight floatR" type="primary"
                 @click="add">添加更新
      </el-button>
    </div>
    <el-table :data="tableData" class="table-div"  @sort-change="handleSortChange">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="code"
                       label="版本号(内)"></el-table-column>
      <el-table-column show-overflow-tooltip prop="version"
                       label="版本号(外)"></el-table-column>
      <el-table-column show-overflow-tooltip prop="typeStr"
                       label="更新平台"></el-table-column>
      <el-table-column show-overflow-tooltip prop="title"
                       label="更新标题"></el-table-column>
      <el-table-column show-overflow-tooltip prop="message"
                       label="更新信息"></el-table-column>
      <el-table-column show-overflow-tooltip prop="isNecessaryStr"
                       label="是否强制更新"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" sortable="custom"
                       label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="javascript:;" @click="view(scope.row.id)" class="operate-a">详情</a>
          <a href="javascript:;" @click="edit(scope.row.id)" class="operate-a">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background @size-change="pageSizeChange"
                     @current-change="pageCurrentChange"
                     :current-page="page.num"
                     :page-sizes="[5,8,10,15,20,25,30]"
                     :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {findPage} from "api/admin/version";

  export default {
    components:{

    },
    async mounted() {
      this.getPage();
    },
    methods: {
      add() {
//        this.$router.push('/biz/patrol/record/daily/add');
        this.$router.push({ name: 'version.add', params: { curd: 'add' } });
      },
      //页面查询
      async getPage() {
        let params = this.search;
        if (this.patrolTimes != null && this.patrolTimes.length > 0) {
          this.search.startDate = this.patrolTimes[0];
          this.search.endDate = this.patrolTimes[1];
        }
        var formData = {
          params: this.search,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
        findPage(formData).then(r => {
          // this.page.pageNum == 0 ? 1 : r.data.pageNum;
          // this.page.pagesize = r.data.pagesize;
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      handleIconClick() {
        this.getPage();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.getPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPage();
      },
      // 排序
      handleSortChange({order}) {
        this.search.sortType = order == 'descending' ? 'DESC' : 'ASC';
        this.getPage();
      },
      //详情
      view(versionId){
        this.$router.push({
          name: 'version.detail',
          params: {curd: 'detail'},
          query:{versionId:versionId}
        })
      },
      //编辑
      edit(versionId){
        this.$router.push({
          name: 'version.edit',
          params: {curd: 'edit'},
          query:{versionId:versionId}
        })
      }
    },
    data() {
      return {
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        search: {
          sortType: "DESC",
        },
        //列表数据
        tableData: []
      }
    }
  }
</script>

<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    /*display: flex;*/
    /*justify-content: space-between;*/
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box a {
    color: #9A9A9A;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    /*display: flex;*/
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    /*display: flex;*/
    /*justify-content: space-between;*/
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .table-div {
    width: 100%;
    text-align: center;
  }

  .operate-a {
    color: #1787AD;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

</style>
