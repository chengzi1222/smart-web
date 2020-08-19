<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>{{ $route.query.pathName ? $route.query.pathName : '主体管理'}}</span>
    </div>
    <div class="selBox">
        <el-input placeholder="主体名称、社会信用代码" class="w200 seekIpt" v-model="keyWord" @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>

        <select-dept-grid class="w150 ml20" placeholder="分管网格" @change="deptChange"></select-dept-grid>

        <el-select clearable class="w150 ml20" v-model="entityType" placeholder="主体类型" @change="search">
          <el-option v-for="item in entityTypeOpt" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

        <el-select clearable class="w150 ml20" v-model="state" placeholder="状态" @change="search">
          <el-option v-for="item in stateOpt" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <span class="fr">
          <el-button class="default-btn" @click="batch('DISABLE')">批量禁用</el-button>
          <el-button class="ml20 default-btn" @click="batch('ENABLE')">批量启用</el-button>
          <!-- 只有市级和区级能拉去主体 -->
          <el-button v-if="$store.state.common.user.areaCode.length == 4 || $store.state.common.user.areaCode.length == 6" class="ml20" type='primary' @click="addEntity">添加主体</el-button>
        </span>
        
    </div>
    <div>
      <el-table :data="dataPage" @selection-change="selChange" class="table-div r30 allDown" v-loading="lodings">
        <el-table-column width="60" type="selection" align="left" label="">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" label="主体名称" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.entityName?scope.row.entityName:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" label="分管网格" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.deptName?scope.row.deptName:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" label="社会信用代码" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.creditCode?scope.row.creditCode:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" label="负责人" min-width="90">
            <template slot-scope="scope">
                <span>{{scope.row.corpName?scope.row.corpName:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" label="联系方式" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.mobile?scope.row.mobile:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="type" label="主体类型" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.type?entityTypes[scope.row.type]:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.createTime?scope.row.createTime:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
                <span>{{scope.row.status?statusTypes[scope.row.status]:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="" label="操作" min-width="100">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="goDetail(scope.row)">详情</a>
              <a href="javascript:;" class="operate-a" @click="goAble(scope.row)">{{scope.row.status == 'DISABLE' ? '启用' : '禁用'}}</a>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
    <add-dialog 
      v-if="dialogVisible"
      :sub-add-dialog-visible="dialogVisible" 
      @closeSubAddDialog="closeDialogVisible">
    </add-dialog> 
  </div>
</template>

<script>
  import SelectDeptGrid from "components/common/SelectDeptGrid.vue";
  import * as api from "api/rating/subManage";
  import AddDialog from './subAddDialog';
  export default {
    data() {
      return {
        keyWord: '',
        entityType: '',
        state: '',
        areaCode: '',
        lodings: false,
        dataPage: [],
        entityTypeOpt: [{
          name: '餐饮主体',
          key: 'RESTAURANT'
        },{
          name: '三小主体（小餐饮店）',
          key: 'CFDARESTAURANT'
        }],
        stateOpt: [{
          name: '启用',
          key: 'ENABLE'
        },{
          name: '禁用',
          key: 'DISABLE'
        }],
        entityTypes: {
          'RESTAURANT': '餐饮主体',
          'CFDARESTAURANT': '三小主体（小餐饮店）'
        },
        statusTypes: {
          'ENABLE': '启用',
          'DISABLE': '禁用'
        },
        mutiSelection: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        dialogVisible: false
      }
    },
    computed: {
      queryParams: function() {
        return {
          search: this.keyWord,
          areaCode: this.areaCode ? this.areaCode : this.$store.state.common.user.areaCode,
          entityType: this.entityType,
          status: this.state,
          pageNum: this.page.pageNum, 
          pageSize: this.page.pageSize 
        }
      }
    },
    methods: {
        // 筛选
        search() {
          this.page.pageNum = 1;
          this.getPageData();
        },
        deptChange(deptId) {
          this.areaCode = !deptId || deptId.length == 0 ? "" : deptId[deptId.length - 1];
          this.getPageData();
        },
        // 批量启用/禁用
        async batch(type) {
          if(this.mutiSelection.length == 0) {
            this.$message.warning(`请先勾选需要批量${type === 'DISABLE' ? '禁用' : '启用'}的主体`);
            return;
          } else {
            let ids = [];
            this.mutiSelection.forEach(item => {
              ids.push(item.id);
            })
            let params = {ids: ids, status: type === 'DISABLE' ? 'DISABLE' : 'ENABLE'}
            let res = await api.batchUpdateStatus(params);
            if(res.status) {
              let msg = type === 'DISABLE' ? '禁用成功' : '启用成功';
              this.$message.success(msg);
              this.getPageData();
            }
          }
        },
        selChange(val) {
          this.mutiSelection = val
        },
        // 详情
        goDetail(row) {
          this.$router.push({
            name: 'restaurantRating.sub.riskLevelDetail',
            query: {
              id: row.id
            }
          });
        },
        // 启用/禁用
        async goAble(row) {
          let params = {id: row.id, status: row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'};
          let res = await api.updateStatus(params);
          if(res.status) {
            let msg = row.status === 'ENABLE' ? '禁用成功' : '启用成功';
            this.$message.success(msg)
            this.getPageData();
          }
        },
        // 请求列表数据
        async getPageData() {
          this.lodings = true;
          let res = await api.getSubList(this.queryParams)
          if(res.status) {
            this.dataPage = res.data.list;
            this.page.total = res.data.total;
            this.lodings = false;
          }
        },
         //页数改变
        pagecCurrentChange(num) {
          this.page.pageNum = num;
          this.getPageData();
        },
        //每页数量改变
        pageSizeChange(size) {
          this.page.pageNum = 1;
          this.page.pageSize = size;
          this.getPageData();
        },
        addEntity() {
          this.dialogVisible = true;
        },
        closeDialogVisible() {
          this.dialogVisible = false;
        }
    },
    mounted() {
      this.getPageData();
    },
    components: {
      AddDialog,
      SelectDeptGrid
    }
  }
</script>

<style scoped lang="scss">
  .bigbox {
    position: relative;
  }
  .selBox {
    margin: 20px 0;
  }
  .table-div {
    margin: 20px 0;
    text-align: center;
  }
  .pagination-box {
    text-align: right;
    margin-top: 20px;
    ::v-deep .el-pager li:not(.disabled).active {
      background-color: #0DB5EF;
    }
  }
  .default-btn {
    background-color: #F6F7F8;
  }
</style>