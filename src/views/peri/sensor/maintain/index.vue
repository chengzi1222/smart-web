<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{$route.query.pathName ? $route.query.pathName : '传感器维护'}}</span>
    </div>
      <div class="sizer">
        <div>
          <el-input placeholder="设备编码、设备名称" class="w260 seekIpt" v-model="keyWord" @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
          <el-button class="ml20 fr" @click="add" :loading="btnLoading" icon="el-icon-plus" type="primary">添加</el-button>
          <el-button class="fr" @click="batchEnable('unable')" :loading="btnLoading">批量禁用</el-button>
          <el-button class="fr" @click="batchEnable('enable')" :loading="btnLoading">批量启用</el-button>
        </div>
      </div>
      <div class="dataBox">
        <el-table :data="tableData" class="table-div allDown" v-loading="tableLoading" @sort-change="sortChange"  @selection-change="selectionChange">
          <el-table-column show-overflow-tooltip width="60" type="selection" label="序号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="no" label="设备编码" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.no?scope.row.no:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="名称" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.name?scope.row.name:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="firm" label="厂商" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.firm?scope.row.firm:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="model" label="型号" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.model?scope.row.model : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="label" label="参数类型" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.label?scope.row.label:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="state" label="状态" min-width="150" sortable="custom">
            <template slot-scope="scope">
              <span>{{scope.row.state?scope.row.state:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="position" label="位置" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.position?scope.row.position:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" fixed="right" label="操作" min-width="180">
            <template slot-scope="scope">
              <a href="javascript:;" @click="operate(scope.row, 'detail')" class="operate">详情</a>
              <a href="javascript:;" @click="operate(scope.row, 'edit')" class="operate">编辑</a>
              <a v-if="scope.row.state === '启用'" href="javascript:;" @click="operate(scope.row, 'unable')" class="operate">禁用</a>
              <a v-else href="javascript:;" @click="operate(scope.row, 'enable')" class="operate">启用</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="fr mt20">
        <el-pagination background :current-page="pageObj.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import * as sensorApi from "api/peri/sensor";
import qs from "qs";
export default {
  data() {
    return {
        keyWord: '',
        tableLoading: false,
        tableData: [],
        btnLoading: false,
        pageObj: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        sort: '',
        selection: []
    }
  },
  computed: {
      
  },
  methods: {
    search() {
      this.pageObj.pageNum = 1;
      this.tableRefresh();
    },
    // 添加
    add() {
      this.$router.push({name: 'sensor.maintain.update', query: {type: 'isAdd'}});
    },
    // 批量更新
    batchEnable(type) {
      if(this.selection.length == 0) {
        this.$message.warning('请选中行后再进行批量操作');
        return;
      }
      let ids = []
      this.selection.forEach(item => {
        ids.push(item.id);
      });
      let params = {
        ids: ids,
        state: type == "enable" ? 0 : 1
      }
      sensorApi.deviceEnable(params).then(res => {
        if(res.status) {
          this.$message.success(type == "enable" ?  "启用成功" : "禁用成功")
          this.tableRefresh();
        }
      }).catch(err => {})
    },
    sortChange(column) {
      if (column.order == "ascending") {
        this.sort = "0";
      } else if (column.order == "descending") {
        this.sort = "1";
      } else {
        this.sort = "";
      }
      this.tableRefresh();
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    operate(row, order) {
      if(order === 'detail') {
        this.$router.push({name: 'sensor.maintain.detail', query: {type: 'isDetail', id: row.id}});
      } else if(order === 'edit') {
        this.$router.push({name: 'sensor.maintain.update', query: {type: 'isEdit', id: row.id}});
        return;
      } else {
        let ids = []
        ids.push(row.id)
        let params = {
          ids: ids,
          state: row.state == "启用" ? 1 : 0
        }
        sensorApi.deviceEnable(params).then(res => {
          if(res.status) {
            this.$message.success(row.state == "启用" ? "禁用成功" : "启用成功")
            this.tableRefresh();
          }
        }).catch(err => {});
      }
    },
    tableRefresh() {
      this.tableLoading = true;
      let queryParams = {
        pageNum: this.pageObj.pageNum,
        pageSize: this.pageObj.pageSize,
        keysWord: this.keyWord,
        sort: this.sort
      }
      sensorApi.getDeviceList(queryParams).then(res => {
          if(res.status) {
              this.tableData = res.data.list;
              this.pageObj.total = res.data.total;
          }
          this.tableLoading = false;
      })
    },
    //页数改变
    pagecCurrentChange(num) {
      this.pageObj.pageNum = num;
      this.tableRefresh();
    },
    //每页数量改变
    pageSizeChange(size) {
      this.pageObj.pageNum = 1;
      this.pageObj.pageSize = size;
      this.tableRefresh();
    }
  },
  mounted() {
    this.tableRefresh();
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
  .sizer {
    margin-top: 20px;
  }
}
.dataBox {
  margin-top: 20px;
  .operate {
    color: #1787AD;
  }
}
</style>
