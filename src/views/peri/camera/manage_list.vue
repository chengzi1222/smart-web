<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>设备管理</span>
    </div>

    <ul class="tab-box">
      <li v-for="(item,index) in lists" @click="liClick($event, item.bind)" :key="item.state" :data-index='index'
          :class="index == defaultIndex? 'li-bott':''">
        <div :data-index='index'>{{item.tabName}}
          <span>
            <span v-if="item.num" style="margin-left:10px;">{{item.num}}</span>
          </span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="请输入主体名称" class="w250 seekIpt" v-model="condition.search"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>
      <enum-select class="selectHeight" v-model="condition.entityType" multiple collapse-tags placeholder="主体类型"
                   @change="handleIconClick" enum="com.ybveg.govx.enums.EntityEnum">
      </enum-select>
    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" @sort-change="sortChange" class="table-div" v-show="bind == 'UNBIND'"
                v-loading="loading">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="90" label="经营者"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" min-width="120" label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="placeBiz" min-width="100" label="经营地址">
          <template slot-scope="scope">
            <span v-if="scope.row.entityType!='VENDORS'">{{scope.row.realityAddr}}</span>
            <span v-if="scope.row.entityType == 'VENDORS'">{{scope.row.placeBiz}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column label="操作" key="food.peri.camera|func.add" v-if="canOperate()" min-width="90">
          <template slot-scope="scope">
            <a href="javascript:;" @click="goEdit(scope.row)" class="operate-a">绑定</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" @sort-change="sortChange" class="table-div" v-show="bind == 'BIND'">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="70" label="经营者"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" min-width="100" label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realityAddr" min-width="100" label="经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="110" label="更新时间"
                         sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="caremaCount" min-width="50" label="摄像头数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="enableLabel" min-width="50" label="状态"></el-table-column>
        <el-table-column label="操作" min-width='80'>
          <template slot-scope="scope">
            <a href="javascript:;" @click="goDetail(scope.row)" class="operate-a">查看</a>
            <a href="javascript:;" v-auth="'food.peri.camera|func.add'" @click="goEdit(scope.row)"
               class="operate-a">编辑</a>
            <a href="javascript:;" v-auth="'food.peri.camera|func.add'" v-if="scope.row.enable == 'YES'"
               @click="enableCameraEntity('NO', scope.row)"
               class="operate-a">禁用</a>
            <a href="javascript:;" v-auth="'food.peri.camera|func.add'" v-if="scope.row.enable == 'NO'"
               @click="enableCameraEntity('YES', scope.row)"
               class="operate-a">启用</a>
            <a href="javascript:;" @click="goDetailFace(scope.row)" class="operate-a">人脸库管理</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                       :current-page="page.pageNum"
                       :page-sizes="[10, 20, 30, 40, 50]" :page-size="page.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {pageManage, countManage, updateCameraEntity} from "api/peri/camera";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import hasAuth from 'utils/checkAuth';
  import EnumSelect from 'components/common/EnumSelect';

  export default {

    async mounted() {

      this.loading = true;
      await countManage(this.entityType).then((r) => {
        let data = r.data;
        this.lists = [
          {tabName: '未绑定', bind: 'UNBIND', num: data.unbind},
          {tabName: '已绑定', bind: 'BIND', num: data.bind}
        ];
      })
      this.tabSearch();
    },
    methods: {
      canOperate() {
        return hasAuth('food.peri.camera|func.add');
      },
      liClick(e, bind) {   //点击导航切换样式
        var me = this;
        me.defaultIndex = e.target.dataset.index;
        this.bind = bind;
        this.tabSearch();
        this.condition.entityType = []
      },

      sortChange(column) {
        if (column.order == 'ascending') {
          this.condition.sort = 'ASC';
        }
        if (column.order == 'descending') {
          this.condition.sort = 'DESC'
        }
        this.tabSearch();
      },

      deptChange(deptId) {
        this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      handleIconClick() { //搜索框按钮点击搜索
        this.a = !this.a;
        this.tabSearch();
      },
      async searchPage() {
        this.loading = true;
        let params = this.condition;
        var formData = {
          ifBind: this.bind,
          params: params,
          num: this.page.pageNum,
          size: this.page.pageSize,
        };
        pageManage(formData).then((result) => {
          this.loading = false;
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
          this.page.total = result.data.total;
          this.tableData = result.data.list;
        });

      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      tabSearch() {
        this.page.pageNum = 1;
        this.searchPage();
      },

      goEdit(row) {
        this.$router.push({name: 'camera.manage.edit', query: {id: row.entityId}});
      },

      goDetail(row) {
        let obj={id: row.entityId}
        if(this.bind=='BIND'&&row.aiCameraId!=null){
          obj['cameraType']='AI'
        }
        if(this.bind=='BIND'&&row.tobId!=null){
          obj['tobId']=row.tobId
        }
        this.$router.push({name: 'camera.manage.detail', query: obj});
      },

      enableCameraEntity(enable, row) {
        row.enable = enable;

        updateCameraEntity(row).then((result) => {
          if (result.status) {
            let enableStr = '';
            if (enable == 'YES') {
              enableStr = '启用';
            } else {
              enableStr = '禁用';
            }
            this.$message({
              message: enableStr + '成功',
              type: 'success'
            });

            this.tabSearch();
          }
        });
      },
      goDetailFace(row) {
        this.$router.push({
          name: 'camera.manage.face',
          query: {
            id: row.entityId
          }
        })
      }
    },
    components: {SelectAreaGrid, EnumSelect},
    data() {
      return {
        a: false,
        defaultIndex: 0,
        lists: [],

        bind: 'UNBIND',

        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        natureTypeList: [],
        subTypeList: [],
        workTypeList: [],

        condition: {
          dept: "", //网格
          search: "",   //搜索
          sort: "DESC",
          entityType: []
        },
        dictTypeData: {},
        loading: false,
      }
    }
  }
</script>

<style scoped lang="sass">

  .li-bott span {
    color: #393939;
  }

  .tab-box a {
    color: #9a9a9a;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box li {
    min-width: 130px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
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
    color: #1787ad;
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
