<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{title}}档案</span>
    </div>
    <div class="ipt-btn-box">
      <el-input :placeholder="keysWord_placeholder" class="w250 seekIpt" v-model="searchMap.keysWord" @keyup.enter.native="">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="pageSearch"></i>
      </el-input>
      <div class="selBox">
        <select-area-grid class="selectHeight" placeholder="分管网格" @change="areaCodeChange"></select-area-grid>
        <enum-select class="selectHeight" multiple v-model="searchMap.manageState" placeholder="营业状态" enum="com.ybveg.govx.enums.ManageStateEnum" @change="pageSearch"></enum-select>
        <el-select v-if='searchMap.entityType=="COSMETIC_PRODUCT"' multiple clearable class="selectHeight" :collapse-tags="true" v-model="searchMap.backupState" placeholder="请选择主体状态" @change="pageSearch">
          <el-option v-for="item in backupStateSelect" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-select multiple clearable class="selectHeight" :collapse-tags="true" v-model="searchMap.optState" placeholder="工单状态" @change="pageSearch">
          <el-option v-for="item in subStateSelect" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
        <el-select v-if='searchMap.entityType!="COSMETIC_PRODUCT"' multiple clearable class="selectHeight" :collapse-tags="true" v-model="searchMap.enterpriseForm" placeholder="企业形态" @change="pageSearch">
          <el-option v-for="item in enterpriseFormArr" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
        <el-select v-if='searchMap.entityType!="COSMETIC_PRODUCT"' multiple clearable class="selectHeight " style="width: 250px;"  :collapse-tags="true" v-model="searchMap.manageScope" placeholder="经营范围" @change="pageSearch">
          <el-option v-for="item in manageScopeArr" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="tabOffTop120">
      <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :key="searchMap.entityType" :border="true" :resizable="true"  @sort-change="sortChange" :cell-class-name="handleStyle" :data="tableData" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column  v-if='searchMap.entityType=="COSMETIC_PRODUCT"'  show-overflow-tooltip prop="backupNo" min-width="120" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="registerAddr" min-width="120" label="注册经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="120" label="负责人"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" label="分管网格">
          <template slot-scope="scope">
            <span>{{scope.row.syjName + scope.row.gridName}}</span>
          </template>
        </el-table-column>
        <el-table-column  v-if='searchMap.entityType != "COSMETIC_PRODUCT"'  show-overflow-tooltip prop="enterpriseForm" min-width="100" label="企业形态"></el-table-column>
        <el-table-column  v-if='searchMap.entityType != "COSMETIC_PRODUCT"'  show-overflow-tooltip prop="manageScope" min-width="100" label="经营范围"></el-table-column>
        <el-table-column show-overflow-tooltip prop="optTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="manageState" min-width="100" label="营业状态"></el-table-column>
        <el-table-column min-width="100" label="主体状态" v-if='searchMap.entityType=="COSMETIC_PRODUCT"'  class="licStateLabel">
          <template slot-scope="scope">
            <div style="position: relative;overflow: visible;">
              <span v-if="scope.row.entityLabel != '无'" style="color:red;position: absolute;right:-2px;top:-8px;border:1px solid red;font-size: 10px;font-weight: bolder">{{scope.row.entityLabel}}</span>
              <span>{{scope.row.backupState}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="optStateStr" min-width="100" label="操作状态"></el-table-column>
        <el-table-column sortable="custom" show-overflow-tooltip prop="createTime" min-width="100" label="创建时间"></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="$router.push({name: 'cosmetics_subject.detail', query: {entityType: scope.row.entityType, entityTypeExt: scope.row.entityTypeExt, ext: 'INFO', entityId: scope.row.id}})" class="operate-a">详情</a>
            <a href="javascript:;" v-if="scope.row.optState != 'CHANGING'" v-auth="changeCode"
              @click="$router.push({name: 'cosmetics_subject.detail', query: {entityType: scope.row.entityType, entityTypeExt: scope.row.entityTypeExt, ext: 'CHANGE', entityId: scope.row.id}})" class="operate-a">编辑</a>
          </template>
        </el-table-column>
      </el-table>
      <yuanben-page :page="page" @size-change="pageSizeChange" @current-change="pageCurrentChange" style="margin-top:10px;">
      </yuanben-page>
    </div>
  </div>
</template>

<script>
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import EnumSelect from 'components/common/EnumSelect';
  import DictSelect from 'components/common/DictSelect';
  import YuanbenPage from 'components/common/YuanbenPage';
  import { page } from 'api/cosmetics/subject';
  import { getEnums,listDictUserItemByCodeAll } from 'api/common';
  import { getEntityName } from '../add/entityUtils';

  export default {

    async mounted() {
      this.title = getEntityName("COSMETIC", "COSMETIC_"+this.$route.params.type.toUpperCase());
      this.searchMap.entityType = 'COSMETIC_'+this.$route.params.type.toUpperCase();
      if (this.$route.query.statistics) {
        if(this.searchMap.entityType=="COSMETIC_PRODUCT"){
          this.searchMap.manageState.push('NORMAL');
          this.searchMap.backupState.push('EFFECTIVE');
        }else{
          this.searchMap.manageState.push('NORMAL');
        }
      }
      //枚举和字典开始
      if (this.searchMap.entityType === 'COSMETIC_MANAGER') {
        this.changeCode = 'cosmetic.biz.mb|func.edit';
        listDictUserItemByCodeAll('COSM_MB_BS').then(d=>{
            this.manageScopeArr = d.data;
          //  this.manageScopeArr.unshift({ code: '', name: "经营范围" })
        });
        listDictUserItemByCodeAll('COSM_MB_SUB').then(d=>{
            this.enterpriseFormArr = d.data;
          //  this.enterpriseFormArr.unshift({ code: '', name: "企业形态" })
        });
      } else if (this.searchMap.entityType === 'COSMETIC_EMPLOY') {
        this.changeCode = 'cosmetic.biz.eb|func.edit';
        listDictUserItemByCodeAll('COSM_EB_BS').then(d=>{
            this.manageScopeArr = d.data;
          //  this.manageScopeArr.unshift({ code: '', name: "经营范围" })
        });
        listDictUserItemByCodeAll('COSM_EB_SUB').then(d=>{
            this.enterpriseFormArr = d.data;
          //  this.enterpriseFormArr.unshift({ code: '', name: "企业形态" })
        });
      } else if (this.searchMap.entityType === 'COSMETIC_PRODUCT') {
        this.changeCode = 'cosmetic.biz.pb|func.edit';
        this.keysWord_placeholder = '备案号、名称、社会信用代码、负责人、负责人联系方式';
      } else {
        new Error('找不到该主体类型:'+ this.searchMap.entityType);
      };
      await getEnums(['com.ybveg.govx.enums.LicenceStateEnum'], false).then(r => {
        this.backupStateSelect = r.data;
        this.backupStateSelect.push({name: '即将过期', key: 'IMMINENT_EXPIRY'});
      });
      await getEnums(['com.ybveg.govx.enums.sub.SubStateEnum'], false).then(r => {
        this.subStateSelect = r.data;
        for (let i = 0; i < this.subStateSelect.length; i++) {
          if (this.subStateSelect[i].key === 'FIRST') {
            this.subStateSelect.splice(i, 1);
          };
        };
      });
      // 枚举和字典end
      this.pageSearch();
    },
    methods: {
      handleStyle (item) {
        if (item.column.label === "主体状态") {
          let text='licStateLabel'
          return text;
        };
      },
      pageCurrentChange (num) {
        if (num !== this.page.pageNum) {
          this.page.pageNum = num;
          this.pageSearch();
        }
      },
      pageSizeChange (size) {
        if (size !== this.page.pageSize) {
          this.page.pageSize = size;
          this.pageSearch();
        };
      },
      pageSearch () {
        this.loading = true;
        page(this.page, this.searchMap).then(r => {
          this.tableData = r.data.list;
          this.page.total = r.data.total;
          this.loading = false;
        });
      },
      areaCodeChange (value) {
        if (value[value.length - 1]) {
          this.searchMap.areaCode = value[value.length - 1];
        } else {
          this.searchMap.areaCode = '';
        };
        this.pageSearch();
      },
      sortChange () {
        // descending下降 ascending上升
        // console.log(arguments)
        this.searchMap.sortColu = arguments[0].prop;
        this.searchMap.sort = arguments[0].order;
        this.pageSearch();
      }
    },
    components: { SelectAreaGrid, DictSelect, EnumSelect, YuanbenPage },
    computed: {

    },
    data () {
      return {
        keysWord_placeholder: '名称、社会信用代码、负责人、负责人联系方式',
        loading: false,
        title: '',
        backupStateSelect: [],
        subStateSelect: [],
        manageScopeArr: [],
        enterpriseFormArr: [],
        searchMap: {
          entityType: '',
          keysWord: '',
          areaCode: '',
          sort: '',
          sortColu: '',
          manageState: [],
          backupState: [],
          optState: [],
          manageScope: [],//经营范围
          enterpriseForm:[],//企业形态
        },
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        entityStateList: [],
        changeCode: ''
      };
    }
  };
</script>

<style scoped lang="sass">
  .ipt-btn-box {
    margin: 20px 0;
    overflow: hidden;
  }
  .selBox{
    text-align: right;
    width: 80%;
    float: right;
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
  .licStateLabel .cell {
    overflow: visible !important;
  }
</style>
