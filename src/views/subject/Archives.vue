<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{this.contants.entityTypeName}}档案</span>
    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="社会信用代码、备案号、名称、经营者、联系方式" class="w250 seekIpt" v-model="condition.search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <enum-select class="selectHeight" v-model="condition.natureType" placeholder="请选择证照类型" enum="com.ybveg.govx.enums.sub.NatureTypeEnum" @change="searchTab"></enum-select>

      <enum-select v-if="entityType==='product'"  class="selectHeight" v-model="condition.licenceType" placeholder="请选择许可证类型" enum="com.ybveg.govx.enums.ProduceLicenceTypeEnum" @change="searchTab"></enum-select>



      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>

      <enum-select class="selectHeight" v-model="condition.manageState" placeholder="请选择营业状态" enum="com.ybveg.govx.enums.ManageStateEnum" @change="searchTab"></enum-select>

      <el-select clearable class="selectHeight" v-model="condition.entityState" placeholder="请选择主体状态" @change="searchTab">
        <el-option v-for="item in entityStateList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="selectHeight" v-model="condition.state" placeholder="请选择操作状态" @change="searchTab">
        <el-option v-for="item in stateList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="selectHeight" v-model="condition.subType" placeholder="请选择主体业态" @change="searchTab">
        <el-option v-for="item in subTypeList" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>

      <el-select v-if="entityType == 'restaurant'" clearable class="selectHeight" v-model="condition.superviseType" placeholder="请选择监管类型" @change="searchTab">
        <el-option v-for="item in superviseTypeList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-select v-if="entityType == 'restaurant'" clearable class="selectHeight" v-model="condition.networkOperation" placeholder="请选择网络经营类型" @change="searchTab">
        <el-option v-for="item in networkOperationList" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <el-button @click="exportFile" class="floatR" type="primary" style="margin-left:20px;" :disabled="isExport">导出</el-button>
    </div>
    <div class="tabOffTop120">
      <el-table v-loading="loading" element-loading-text="数据正在努力加载中"  :cell-class-name="handleStyle" :border="true" :resizable="true"  :data="tableData" @sort-change="sortChange" class="table-div" :class="shadowShow?'shadowNo':''" :key="maxheight">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="190" @header-dragend="aaa" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licence" min-width="120" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="natureTypeLabel" min-width="100" label="证照性质"></el-table-column>
        <el-table-column show-overflow-tooltip v-if="entityType==='product'" prop="licenceTypeLabel" min-width="100" label="许可证类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="120" label="负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" min-width="140" label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="140" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="optTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="manageStateLabel" min-width="100" label="营业状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="subTypeLabel" min-width="100" label="主体业态"></el-table-column>
        <el-table-column v-if="entityType == 'restaurant'" show-overflow-tooltip prop="superviseTypeStr" min-width="100" label="监管类型"></el-table-column>
        <el-table-column v-if="entityType == 'restaurant'" show-overflow-tooltip prop="networkOperationStr" min-width="100" label="网络经营"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" label="主体状态">
          <template slot-scope="scope">
            <div style="position: relative;overflow: visible;">
              <span v-if="scope.row.entityLabel != 'NONE'" style="color:red;position: absolute;right:-2px;top:-8px;border:1px solid red;font-size: 10px;font-weight: bolder">{{scope.row.entityLabelStr}}</span>
              <span>{{scope.row.licStateLabel}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="stateLabel" min-width="100" label="操作状态"></el-table-column>
        <el-table-column sortable='custom' show-overflow-tooltip prop="createTime" min-width="100" label="创建时间"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="view(scope.row.id)" class="operate-a">详情</a>
            <a href="javascript:;" v-auth="changeCode" v-if="scope.row.workState != 'CHANGING'" @click="change(scope.row)" class="operate-a">编辑</a>
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
import * as common from 'api/common';
import { pageSub,moreExport } from "api/sub/sub";
import SelectAreaGrid from 'components/common/SelectAreaGrid';
import EnumSelect from 'components/common/EnumSelect';
import subject from './common/utils/Contants';
import { calcTableHeight, boxShadow } from 'utils/utils';

export default {

  mounted() {
    //获得主体类型
    this.entityType = this.$route.params.type;
    if (this.entityType == 'restaurant') {
      this.changeCode = 'food.biz.rb|func.change'
      common.getEnums(['com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum'], false).then((result) => {
        this.superviseTypeList = result.data
      })
      common.getDicts(['RB_NO']).then((result) => {
        this.networkOperationList = result.data[0].list || [];
      })
    } else if (this.entityType == 'circulation') {
      this.changeCode = 'food.biz.cb|func.change'
    } else if (this.entityType == 'product') {
      this.changeCode = 'food.biz.pb|func.change'
    } else {
      callback(new Error("找不到主体类型:" + this.entityType))
    }
    this.contants = subject[this.entityType];

    this.searchTab();

    //获取主体状态
    common.getEnums(['com.ybveg.govx.enums.LicenceStateEnum'], false).then((result) => {
      result.data.push({ name: '即将过期', key: 'none' });
      this.entityStateList = result.data;
      if (this.$route.query.entityState) {
        this.condition.entityState = this.$route.query.entityState;
      }
    });

    common.getEnums(['com.ybveg.govx.enums.sub.SubStateEnum'], false).then((result) => {
      this.stateList = result.data.filter(function (i) { return i.key != 'FIRST' });
    });

    common.getDicts([this.contants.subType]).then((result) => {
      this.subTypeList = result.data[0].list || [];
    });

    this.maxheight = calcTableHeight(this.tableHeight, 190);
    setTimeout(() => {
      this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth, document.getElementsByClassName("el-table__body")[0].clientWidth);
    }, 0)
    if(this.$route.params.totalstate){
      this.condition.manageState = 'NORMAL';
    }
  },
  methods: {
    aaa(newWidth, oldWidth, column, event){
      alert(newWidth, oldWidth, column, event)
    },
    handleStyle(item) {
      if (item.column.label === "主体状态") {
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
    view(id) {
      this.$router.push({
        name: "subject.archives.detail",
        params: {
          type: this.entityType
        },
        query: {
          id
        }
      })
    },
    deptChange(deptId) {
      this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
      this.searchTab();
    },
    handleIconClick() {	//搜索框按钮点击搜索
      this.a = !this.a;
      this.searchTab();
    },
    searchPage() {
      this.loading=true;
      const params = this.condition;
      const formData = {
        params: params,
        entityType: this.entityType,
        num: this.page.pageNum,
        size: this.page.pageSize
      };
      pageSub(formData).then((result) => {
        result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
        this.page.total = result.data.total;
        this.tableData = result.data.list;
        this.loading=false;
      });

    },
    exportFile() {
      let title = this.contants.entityTypeName+'档案'
      const params = this.condition;
      const formData = {
        params: params,
        entityType: this.entityType,
        title:title
      };
      this.isExport = true;
      moreExport(formData).then((result) => {
        this.isExport = false;
        common.downloadFile(result.data.fileId, title);
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
    change(row) {
      const entityType = row.entityType.toLowerCase();
      this.$router.push({name:"subject."+entityType+".change",query:{entityId:row.id}})
    }
  },
  components: { SelectAreaGrid, EnumSelect },
  computed: {
    tableHeight() {
      return this.$store.state.layout.tableHeight;
    },
    tableWidth() {
      return this.$store.state.layout.tableWidth;
    }
  },
  watch: {
    tableHeight() {
      this.maxheight = calcTableHeight(this.tableHeight, 190);
    },
    tableWidth() {
      setTimeout(() => {
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth, document.getElementsByClassName("el-table__body")[0].clientWidth);
      }, 0)
    }
  },
  data() {
    return {
      loading:false,
      contants: {},
      entityType: '',
      maxheight: 0,
      shadowShow: false,
      a: false,
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      subTypeList: [],
      stateList: [],
      entityStateList: [],//主体状态
      superviseTypeList: [], // 监管类型
      networkOperationList: [], // 网络经营
      condition: {
        //网格
        dept: "",
        //证照类型
        natureType: "",
        //经营类型
        licenceType: "",
        //操作状态
        state: "",
        //营业状态
        manageState: "",
        //主体类型
        entityState: "",
        // 监管类型
        superviseType: "",
        // 网络经营
        networkOperation: "",
        // 主体业态
        subType: "",
        //搜索
        search: "",
        sort: "DESC",
        sortColu: 'optTime'
      },
      changeCode: '',
      isExport:false,
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
