<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>三小档案</span>
    </div>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="备案号、名称、社会信用代码" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select class="selectHeight" v-model="condition.bizTypes"  clearable placeholder="主体类型" @change="searchTab">
        <el-option v-for="item in bizTypesOptions" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-cascader class="selectHeight" :clearable="true" placeholder="分管网格" :options="deptsOptions.options" :props="deptsOptions.props" :change-on-select="true" :show-all-levels="false" @change="deptChange">
      </el-cascader>

      <el-select class="selectHeight" v-model="condition.bizStates"  clearable placeholder="操作状态" @change="searchTab">
        <el-option v-for="item in bizStatesOptions" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <enum-select v-model="condition.selectManageState" @change="searchTab" enum="com.ybveg.govx.enums.ManageStateEnum"  placeholder="营业状态"></enum-select>

      <el-select clearable class="selectHeight" v-model="condition.selectCfdaState" placeholder="主体状态" @change="searchTab">
        <el-option v-for="item in cfdaStateList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-button @click="exportFile" class="floatR" type="primary" style="margin-left:20px;" :disabled="isExport">导出</el-button>
    </div>
    <div class="tabOffTop120">
      <el-table :cell-class-name="handleStyle"  :border="true" :resizable="true"  :data="tableData" @sort-change="sortChange" class="table-div" :class="shadowShow?'shadowNo':''" :key="maxheight" >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip label="主体名称" min-width="90" prop="entityName"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="100" label="三小性质"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="100" label="经营者"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" min-width="120" label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="optTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>

        <el-table-column show-overflow-tooltip prop="manageStateLabel" min-width="100" label="营业状态"></el-table-column>
        <el-table-column  show-overflow-tooltip  min-width="100" label="主体状态">
          <template slot-scope="scope">
            <div style="position: relative;overflow: visible;">
              <span v-if="scope.row.entityLabel != 'NONE'" style="color:red;position: absolute;right:-2px;top:-10px;border:1px solid red;font-size: 10px;font-weight: bolder">{{scope.row.entityLabelStr}}</span>
              <span>{{scope.row.licStateLabel}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="stateStr" min-width="100" label="操作状态"></el-table-column>
        <el-table-column sortable='custom' show-overflow-tooltip prop="createTime" min-width="100" label="创建时间"></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="view(scope.row)" class="operate-a">详情</a>
            <a v-show="scope.row.state == 'ALREADY_FILE'" href="javascript:;" @click="doPrintCf(scope.row,true)" class="operate-a">打印预览</a>
            <a v-show="scope.row.state == 'ALREADY_FILE'" href="javascript:;" @click="printCfda(scope.row)" class="operate-a">打印</a>
            <a v-show="scope.row.state == 'ALREADY_FILE' && scope.row.licState == 'EFFECTIVE'" href="javascript:;" @click="changeOpt(scope.row)" v-auth="'food.biz.cfda|func.change'" class="operate-a">变更</a>
            <a v-show="scope.row.state == 'ALREADY_FILE' && scope.row.licState == 'EFFECTIVE'" href="javascript:;" @click="goEdit(scope.row)" v-auth="'food.biz.cfda|func.edit'" class="operate-a">编辑</a>
            <a v-show="scope.row.type != 'VENDORS' && scope.row.state == 'ALREADY_FILE' && (scope.row.licState == 'EFFECTIVE' || scope.row.licState == 'OVERDUE')" href="javascript:;" @click="contin(scope.row)" v-auth="'food.biz.cfda|func.delay'" class="operate-a">延续</a>
            <a v-show="scope.row.state == 'ALREADY_FILE' && scope.row.licState == 'EFFECTIVE'" href="javascript:;" @click="cancel(scope.row)" v-auth="'food.biz.cfda|func.cancel'" class="operate-a">注销 </a>
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
import {getEnums } from 'api/common';
import {getBizEntityRecordPage,getSxStatus,getCfdaType,cfdaExport} from "api/cfda/enetityRecordList";
import { bizCancel } from "api/cfda/bizWorkflow";
import { doPrintCfda } from 'utils/print/doPrint'
import { findDeptGrid,downloadFile } from 'api/common'
import { INFO_TYPE } from "views/cfda/workflow/workUtil";
import {calcTableHeight,boxShadow} from 'utils/utils';
import EnumSelect from 'components/common/EnumSelect'

export default {
  mounted() {    
    if (this.$route.query.entityState) {
      this.condition.selectCfdaState = this.$route.query.entityState;
    }
    this.loading=true;
    getCfdaType().then((result) => {
      this.bizTypesOptions = result.data;
    });
    getSxStatus().then((result) => {
      this.bizStatesOptions = result.data;
    });
    findDeptGrid().then((result) => {
      this.deptsOptions.options = result.data;
    });
    //获取主体状态
    getEnums(['com.ybveg.govx.enums.cfda.CfdaStateEnum'],false).then((r) => {
      r.data.push({name: '即将过期', key:'none'});
      r.data.forEach(item=>{
        this.cfdaStateList.push(item)
      })
    });

    switch (this.$route.params.total){
      case 'expir':
        this.condition.selectCfdaState = 'none';
        this.$route.params.total = '';
        break;
      case 'effective':
        this.condition.selectCfdaState = 'EFFECTIVE';
        this.condition.selectManageState = 'NORMAL';
        this.$route.params.total = '';
        break;
    }
    this.searchTab();
    this.maxheight = calcTableHeight(this.tableHeight,190);
    setTimeout(()=>{
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,document.getElementsByClassName("el-table__body")[0].clientWidth);
    },0)
  },
  methods: {
    handleStyle(item){
      if(item.column.label === "主体状态"){
        return 'licStateLabel'
      }
    },
    sortChange(column) {
      this.condition.sortColu = column.prop
      if (column.order == 'ascending') {
        this.condition.sort = 'ASC';
      }
      if (column.order == 'descending') {
        this.condition.sort = 'DESC'
      }
      this.searchTab();
    },
    view(row) {
      this.$router.push({
        name: 'cfda.archives.detail',
        query: {
          id: row.id,
          back: 'cfda.archives'
        }
      });
    },
    deptChange(deptId) {
      this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
      this.searchTab();
    },
    handleIconClick() {	//搜索框按钮点击搜索
      this.a = !this.a;
      this.searchTab();
    },
    async searchPage() {
      let params = this.condition;
      var formData = {
        params: params,
        num: this.page.pageNum,
        size: this.page.pageSize
      };
      this.loading=true;
      getBizEntityRecordPage(formData).then((result) => {
        this.loading=false;
        result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
        this.page.total = result.data.total;
        this.tableData = result.data.list;
      });

    },
    searchTab() {
      this.page.pageNum = 1;
      this.searchPage();
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchPage();
    },
    exportFile() {
      let title = '三小档案'
      let params = this.condition;
      params.title = title;
      this.isExport = true;
      cfdaExport(params).then((result) => {
        this.isExport = false;
        downloadFile(result.data.fileId, title);
      });
    },
    cancel(row) {
      const $this = this;
      this.$confirm('注销操作审核生效后不可撤回，请确认是否注销该主体?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          entityId: row.id
        };
        bizCancel(param).then((result) => {
          this.$message({
            message: '注销申请成功!',
            type: 'success'
          });
          this.searchPage();
        });
      });

    },
    contin(row) {
      this.$router.push({
        name: 'cfda.archives.change',
        query: {
          cfdaId: row.id,
          type: INFO_TYPE.delay,
          back: 'cfda.archives'
        }
      });
    },
    changeOpt(row) {
      this.$router.push({
        name: 'cfda.archives.change',
        query: {
          cfdaId: row.id,
          type: INFO_TYPE.change,
          back: 'cfda.archives'
        }
      });
    },
    goEdit(row) {
      this.$router.push({
        name: 'cfda.archives.change',
        query: {
          cfdaId: row.id,
          type: INFO_TYPE.edit,
          back: 'cfda.archives'
        }
      });
    },

    //打印
    printCfda(row) {
      doPrintCfda(row.id, row.type);
    },
    //打印预览
    async doPrintCf(row, isPreview) {
      this.loading = true;
      setTimeout(() => {
        doPrintCfda(row.id,row.type,isPreview);
        setTimeout(() => {
          this.loading = false;
        }, 1000)
      }, 2000)
    },
  },
  components: {EnumSelect},
  computed: {
    tableHeight (){
        return this.$store.state.layout.tableHeight;
    },
    tableWidth (){
        return this.$store.state.layout.tableWidth;
    }
  },
  watch:{
    tableHeight(){
      this.maxheight = calcTableHeight(this.tableHeight,190);
    },
    tableWidth(){
        setTimeout(()=>{
           this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth,document.getElementsByClassName("el-table__body")[0].clientWidth);
        },0)
    }
  },
  data() {
    return {
      a: false,
      maxheight:0,
      shadowShow:false,
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      deptsOptions: {
        props: {
          label: 'deptName',
          value: 'areaCode'
        },
        options: []
      },
      cfdaStateList: [],
      bizTypesOptions: [],
      bizStatesOptions: [],
      condition: {
        //网格
        dept: "",
        //主体类型
        bizTypes: '',
        //操作状态
        bizStates: '',
        //搜索
        search: "",
        sort: "DESC",
        sortColu: 'optTime',
        //主体状态
        selectCfdaState: '',
        //营业状态
        selectManageState: ''
      },
      isExport:false,
      dictTypeData: {},
      loading: false,
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

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;

  font-size: 15px;
  color: #9a9a9a;
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
