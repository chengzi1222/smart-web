<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{$route.query.pathName}}</span>
    </div>
      <div class="sizer">
        <div>
          <el-input placeholder="商户信息" class="w260 seekIpt" v-model="keyWord" @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
          <el-date-picker v-model="startDate" type="date" placeholder="起始日期" class="w120 ml20" @change="selectChange" :picker-options="beforeDate" value-format="yyyy-MM-dd"></el-date-picker>
          <span class="ml10 mr10">至</span>
          <el-date-picker v-model="endDate" type="date" placeholder="截止日期" class="w120" @change="selectChange" :picker-options="afterDate" value-format="yyyy-MM-dd"></el-date-picker>
          <el-cascader ref="cascader" class="w150 ml20" v-model="areaCode" :options="areaList.options" @change="areaChange" :props="areaList.props" clearable placeholder="所属辖区"></el-cascader>
          <el-select v-model="stateVal" clearable placeholder="状态" @change="selectChange" class="ml20 w150">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button v-show="!isMoreSel" class="up-btn" @click="showMoreSel"><i class="el-icon-caret-top"></i></el-button>
          <el-button v-show="isMoreSel" class="up-btn" @click="showMoreSel"><i class="el-icon-caret-bottom"></i></el-button>
          <el-button class="ml20 fr" @click="add" :loading="exportLoading" icon="el-icon-plus" type="primary">添加</el-button>
          <el-button class="fr" @click="multiUpdate" :loading="exportLoading">批量更新</el-button>
        </div>
        <div v-if="isMoreSel" class="more-sel">
          <el-select v-model="platformVal" clearable placeholder="采集平台" @change="selectChange" class="ml20 w150">
            <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="kindsVal" clearable placeholder="经营品类" @change="selectChange" class="ml20 w150">
            <el-option v-for="item in kindsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="cuisineVal" clearable placeholder="地方菜系" @change="selectChange" class="ml20 w150">
            <el-option v-for="item in cuisineOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="dataBox">
        <el-table :data="tableData" class="table-div r30 allDown movePoin" v-loading="tableLoading">
          <el-table-column show-overflow-tooltip width="60" type="selection" label="序号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" label="商家头像" min-width="120">
            <template slot-scope="scope">
              <el-image v-if="scope.row.img" :src="scope.row.img" fit="cover" style="width:100px; height:100px;"></el-image>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="avgPrice" label="店名" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.avgPrice?scope.row.avgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yesAvgPrice" label="经营项" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.yesAvgPrice?scope.row.yesAvgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="percent" label="经营品类" min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.percent?scope.row.percent : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p1AvgPrice" label="月销量" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p1AvgPrice?scope.row.p1AvgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p1MinPrice" label="商家评分" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p1MinPrice?scope.row.p1MinPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p1MaxPrice" label="联系方式" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p1MaxPrice?scope.row.p1MaxPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p2AvgPrice" label="地址" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p2AvgPrice?scope.row.p2AvgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p2MinPrice" label="所属辖区" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p2MinPrice?scope.row.p2MinPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p2MaxPrice" label="食品安全档案" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p2MaxPrice?scope.row.p2MaxPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p3AvgPrice" label="所属平台" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p3AvgPrice?scope.row.p3AvgPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="p3MinPrice" label="更新时间" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.p3MinPrice?scope.row.p3MinPrice:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="state" label="状态" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.state === '正常'" class="state-type state-normal">正常</span>
              <span v-else-if="scope.row.state === '停业'" class="state-type state-closure">停业</span>
              <span v-else>{{scope.row.state?scope.row.state:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="p4MaxPrice" fixed="right" label="操作" min-width="180">
            <template slot-scope="scope">
              <a href="javascript:;" @click="operate(scope.row, 'update')" class="operate">更新</a>
              <a href="javascript:;" @click="operate(scope.row, 'edit')" class="operate">编辑</a>
              <a href="javascript:;" @click="operate(scope.row, 'detail')" class="operate">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="fr mt20">
        <el-pagination background :current-page="pageObj.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
      <div>
        <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible" title="商户链接" size="tiny">
          <span style="margin-left:80px;">商户链接: </span>
          <el-input v-model="merchantUrl" placeholder="请复制粘贴, 输入商户链接" class="w300"></el-input>
          <el-button style="margin-bottom:60px;" class="ml20" type="primary">抓取信息</el-button>
        </el-dialog>
      </div>
  </div>
</template>

<script>
// import * as merchantInfoApi from "api/networkCatering/merchantInfo"
export default {
  data() {
    return {
        keyWord: '',
        startDate: '',
        endDate: '',
        areaCode: '',
        // 所属辖区级联选择器配置
        areaList: {
          selectedOptions: [],
          options: [],
          parentCode: '',
          props: {
            checkStrictly: true,
            expandTrigger: 'click',
            value: 'areaCode',
            label: 'areaName',
            children: 'children',
            lazy: true,
            lazyLoad(node, resolve) {}
          }
        },
        stateVal: '',
        stateOptions: [{
            value: '1',
            label: '正常'
        }, {
            value: '0',
            label: '停业'
        }],
        platformVal: '',
        platformOptions: [],
        kindsVal: '',
        kindsOptions: [],
        cuisineVal: '',
        cuisineOptions: [],
        isMoreSel: false,
        tableLoading: false,
        tableData: [],
        searchDate: '',
        beforeDate: {
          disabledDate: (time) => {
            let before = new Date("2018-01-01") - 8.64e7;
            let after = new Date();
            let endDate = new Date(this.endDate);
            let intervalDate = endDate.getDate();
            let intervalMonth = endDate.getMonth() + 1 - 3;
            let intervalYear = endDate.getFullYear();
            if(intervalMonth < 1) {
              intervalMonth = intervalMonth + 12;
              intervalYear = intervalYear - 1;
            }
            let interval = new Date(intervalYear + '/' + intervalMonth + '/' + intervalDate + '/08:00:00');
            if (this.endDate) {
              return time.getTime() < interval || time.getTime() > endDate || time.getTime() > after || time.getTime() < before;
            } else {
              return time.getTime() > after || time.getTime() < before;
            }
          }
        },
        afterDate: {
          disabledDate: (time) => {
            let before = new Date("2018-01-01") - 8.64e7;
            let after = new Date();
            let startDate = new Date(this.startDate);
            let intervalDate = startDate.getDate();
            let intervalMonth = startDate.getMonth() + 1 + 3;
            let intervalYear = startDate.getFullYear();
            if(intervalMonth > 12) {
              intervalMonth = intervalMonth - 12;
              intervalYear = intervalYear + 1;
            }
            let interval = new Date(intervalYear + '/' + intervalMonth + '/' + intervalDate + '/08:00:00') - 8.64e7;
            if (this.startDate) {
              return time.getTime() > interval || time.getTime() < startDate - 8.64e7 || time.getTime() > after || time.getTime() < before;
            } else {
              return time.getTime() > after || time.getTime() < before;
            }
          }
        },
        exportLoading: false,
        pageObj: {
          pageSize: 1,
          pageNum: 10,
          total: 0
        },
        dialogVisible: false,
        merchantUrl: ''
    }
  },
  computed: {
      
  },
  methods: {
    search() {
      
    },
    selectChange() {
        this.tableRefresh()
    },
    // 点击区域节点前的圆圈进行选择
    areaChange(val) {   
        this.areaList.selectedOptions = val;
        this.tableRefresh();
    },
    // 添加
    add() {
      this.$router.push({path: '/catering/merchantAdd', query: {type: 'isAdd'}})
    },
    // 批量更新
    multiUpdate() {

    },
    showMoreSel() {
      this.isMoreSel = !this.isMoreSel
    },
    operate(row, order) {
      if(order === 'update') {
        this.dialogVisible = true;
        return
      }
      if(order === 'edit') {
        this.$router.push({path: '/catering/merchantAdd', query: {type: 'isEdit'}})
        return
      }
      if(order === 'detail') {
        this.$router.push({path: '/catering/merchantAdd', query: {type: 'isDetail'}})
        return
      }
    },
    tableRefresh() {
      this.tableData = [{state:'正常'},{state:'停业'}]
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
  created() {
    let that = this
    that.areaList.props.lazyLoad = function (node, resolve) {
      // let code = node.value ? node.value : that.userInfoAreaCode;
      // if (code.length > 6) { 
      //   return resolve([]) 
      // }
      // area.findArea(code).then(r => {
      //   if (r.status) {
      //     resolve(r.data)
      //   }
      // });
    }
  },
  mounted() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    this.searchDate = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
    this.tableRefresh()
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
  .sizer {
    margin-top: 20px;
    .up-btn {
      margin-left: 20px;
      width: 34px;
      height: 34px;
      background:#F6F7F8;
      border:1px solid #C2CAD2;
      box-sizing: border-box;
      i {
        width: 12px;
        height: 6px;
        color: #C2CAD2;
        position: relative;
        right: 8px;
      }
    }
    .more-sel {
      margin-left: 260px;
      margin-top: 20px;
    }
  }
}
.dataBox {
  margin-top: 20px;
  .state-type {
    display: inline-block;
    width:44px;
    height:21px;
    line-height: 21px;
    font-size:12px;
    border-radius:4px;
  }
  .state-normal {
    color: #32C25E;
    background:#ECF9F0;
    border:1px solid #B9E7C7;
  }
  .state-closure {
    color: #A2AAB6;
    background:#F2F6FA;
    border:1px solid #CDD8E3;
  }
  .operate {
    color: #1787AD;
  }
}
</style>
