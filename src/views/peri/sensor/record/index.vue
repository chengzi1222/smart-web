<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{$route.query.pathName}}</span>
    </div>
      <div class="sizer">
        <div>
          <el-input placeholder="设备编码、设备名称" class="w260 seekIpt" v-model="keyWord" @keyup.enter.native="selectChange">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="selectChange"></i>
          </el-input>
          <el-select v-model="parameter" clearable placeholder="参数类型" @change="selectChange" class="ml20 w150">
            <el-option v-for="item in labelOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-select v-model="state" clearable placeholder="状态" @change="selectChange" class="ml20 w150">
            <el-option v-for="item in stateOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-date-picker v-model="startDate" type="date" placeholder="起始日期" class="w150 ml20" @change="selectChange" :picker-options="beforeDate" value-format="yyyy/MM/dd"></el-date-picker>
          <span class="ml10 mr10">至</span>
          <el-date-picker v-model="endDate" type="date" placeholder="截止日期" class="w150" @change="selectChange" :picker-options="afterDate" value-format="yyyy/MM/dd"></el-date-picker>
        </div>
      </div>
      <div class="dataBox">
        <el-table :data="tableData" class="table-div allDown" v-loading="tableLoading">
          <el-table-column show-overflow-tooltip width="60" wlabel="序号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="deviceNo" label="设备编码" min-width="150">
            <template slot-scope="scope">
              <span class="pointer" @click="goDetail(scope.row.deviceId)">{{scope.row.no?scope.row.no:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="deviceName" label="名称" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.deviceName?scope.row.deviceName:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="deviceFirm" label="厂商" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.deviceFirm?scope.row.deviceFirm:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="deviceModel" label="型号" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.deviceModel?scope.row.deviceModel : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="label" label="参数类型" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.label?scope.row.label:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="value" label="值" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.value.toString() ?scope.row.value.toString() :'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="result" label="状态" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.result?scope.row.result:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="devicePosition" label="位置" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.devicePosition?scope.row.devicePosition:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="更新时间" min-width="180">
            <template slot-scope="scope">
              <span>{{scope.row.createTime?scope.row.createTime:'-'}}</span>
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
import { getEnums } from 'api/common';
export default {
  data() {
    return {
        keyWord: '',
        parameter: '',
        labelOptions: [],
        state: '',
        stateOptions: [],
        startDate: '',
        endDate: '',
        beforeDate: {
          disabledDate: (time) => {
            let before = new Date("2020/01/01");
            let after = new Date();
            let endDate = new Date(this.endDate);
            let interval = endDate.getTime() - 6*24*3600*1000;
            if (this.endDate) {
              return time.getTime() < interval || time.getTime() > endDate || time.getTime() > after || time.getTime() < before;
            } else {
              return time.getTime() > after || time.getTime() < before;
            }
          }
        },
        afterDate: {
          disabledDate: (time) => {
            let before = new Date("2020/01/01");
            let after = new Date();
            let startDate = new Date(this.startDate);
            let interval = startDate.getTime() + 6*24*3600*1000;
            if (this.startDate) {
              return time.getTime() > interval || time.getTime() < startDate || time.getTime() > after || time.getTime() < before;
            } else {
              return time.getTime() > after || time.getTime() < before;
            }
          }
        },
        tableLoading: false,
        tableData: [],
        btnLoading: false,
        pageObj: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        }
    }
  },
  computed: {

  },
  methods: {
    selectChange() {
      this.pageObj.pageNum = 1;
      if(!this.startDate) {
        this.$message.warning('请选择起始日期');
        return;
      }
      if(!this.endDate) {
        this.$message.warning('请选择截止日期');
        return;
      }
      this.tableRefresh();
    },
    tableRefresh() {
      let queryParams = {
        pageNum: this.pageObj.pageNum,
        pageSize: this.pageObj.pageSize,
        keysWord: this.keyWord,
        label: this.parameter,
        startDate: this.startDate ? this.startDate : null,
        endDate: this.endDate ? this.endDate : null,
        state: this.state
      }
      this.tableLoading = true;
      sensorApi.getDeviceRecordList(queryParams).then(res => {
        if(res.status) {
          this.tableData = res.data.list;
          this.pageObj.total = res.data.total;
        }
        this.tableLoading = false;
      }).catch(err=>{});
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
    },
    goDetail(deviceId) {
      this.$router.push({
        path: '/sensor/maintain/detail', 
        query: {
          id: deviceId
        }
      })
    }
  },
  mounted() {
    getEnums(['com.ybveg.govx.enums.sensor.BusinessLabelTypeEnum']).then((data) => {
      this.labelOptions = data.data;
    });
    getEnums(['com.ybveg.govx.enums.sensor.MonitorRecordResultEnum']).then((data) => {
      this.stateOptions = data.data;
    });
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    this.startDate = this.endDate = year + '/' + (month < 10 ? ('0' + month) : month) + '/' + (date < 10 ? ('0' + date) : date);
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
.pointer {
  cursor: pointer;
}
</style>
