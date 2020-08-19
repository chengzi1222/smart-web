<template>
  <div class="addpopup">
    <div class="addDiv inputPadd5">
      <p class="addTit">
        <span class="ml20">选择设备</span>
        <i class="el-icon-close floatR movePoin"  @click="$emit('equipmentShowFun',false)"></i>
      </p>
      <div class="mt20">
        <el-input title="设备代码、登记证号、使用单位、楼盘名称、内部编号" placeholder="设备代码、登记证号、使用单位、楼盘名称、内部编号" class="w358 seekIpt" v-model="subName" @keyup.enter.native="getEntityPaging">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getEntityPaging"></i>
        </el-input>
        <div class="mt20">
          <el-cascader class="w150" clearable placeholder="设备类别与种类" :options="varietiesOptions.options" clearable
            :props="varietiesOptions.props" :change-on-select="true" :show-all-levels="false" @change="detVarieties">
          </el-cascader>
          <el-cascader v-model='codeList' class="w150 ml20" placeholder="所属辖区" :options="deptsOptions.options" clearable
            :props="deptsOptions.props" :change-on-select="true" :show-all-levels="false" @change="det">
          </el-cascader>
          <el-select v-model="employUnit" filterable remote reserve-keyword placeholder="请输入使用单位至少两个关键字" clearable
            :remote-method="employUnitFun" :loading="loading" class="w200 ml20" @change="clearList">
            <el-option v-for="item in employUnitOptions" :key="item.id" :label="item.entityName" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="buildName" filterable remote reserve-keyword placeholder="请输入楼盘名称至少两个关键字" clearable v-if="$route.name=='specialElevator_Surveyreport_indexTable'"
            :remote-method="buildNameFun" :loading="loading"  class="w200 ml20" @change="clearList">
            <el-option v-for="item in buildNameOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <el-table class="table-div mt20" :data="tableData" @row-click="addRowClick" height="350">
        <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="registerCode" label="注册代码" min-width="130"></el-table-column>
        <el-table-column show-overflow-tooltip prop="registerCardNo" label="登记证号" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="employName" label="使用单位" min-width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="buildName" label="楼盘名称" min-width="120" v-if="$route.name == 'specialElevator_Surveyreport_indexTable'"></el-table-column>
        <el-table-column show-overflow-tooltip prop="insideNumber" label="单位内部编号" min-width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityKind" label="设备类别" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityVarieties" label="设备品种" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" label="设备名称" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="childrenArea" label="所属区县" min-width="150"></el-table-column>
      </el-table>
      <div class="pagination-box textR mt20 mb20">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[5, 10, 15]" :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
          @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getEntityPaging, getEmployKeywordList, getEntityVarietiesList, getBuildingList } from 'api/special/elevator'
  import { findDeptGrid } from 'api/common'
  import { postEmployGridList } from 'api/special/archives'
export default {
  props: {
    entityType: {
      default: function () {
        return ''
      }
    },
  },
  data(){
    return {
      subName: '',
      employUnit: '',
      category: '',
      areaCode: '',
      buildName: '',
      employUnitOptions: [],
      buildNameOptions: [],
      buildNameSetTim: null,
      employUnitSetTim: null,
      loading: false,
      options: [
        {
          value: 'YES',
          label: '启用'
        }, {
          value: 'NO',
          label: '禁用'
        }
      ],
      deptsOptions: {
        props: {
          label: 'deptName',
          value: 'areaCode'
        },
        options: []
      },
      varietiesOptions: {
        props: {
          label: 'value',
          value: 'key'
        },
        options: []
      },
      codeList: [],
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
    }
  },
  mounted() {
    this.getEntityPaging()
    if(this.$store.getters.user.areaCode.length>=14){
      postEmployGridList({ streetCode: this.$store.getters.user.areaCode.slice(0, 10)}).then(r => {
        if(!r.status){return}
        this.deptsOptions.options = r.data;
      })
    } else {
      findDeptGrid().then(r => {
        if(!r.status){return}
        this.deptsOptions.options = r.data;
      })
    }
    getEntityVarietiesList({ entityType: this.entityType }).then(r => {
      if(!r.status){return}
      this.varietiesOptions.options.push(r.data);
    })
  },
  methods: {
    detVarieties(id) {
      if (id.length > 0) {
        this.category = id[id.length - 1];
      } else {
        this.category = ''
      }
      this.getEntityPaging();
    },
    clearList(){
      this.employUnitOptions = [];
      this.buildNameOptions = [];
      this.getEntityPaging()
    },
    getEntityPaging() {
      this.employUnitOptions = []
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
        search: this.subName,
        employUnit: this.employUnit,
        buildName: this.buildName,
        category: this.category,
        areaCode: this.areaCode,
        entityType: this.entityType
      }
      getEntityPaging(params).then(r => {
        if(!r.status){return}
        this.tableData = r.data.list;
        this.page.total = r.data.total;
      })
    },
    employUnitFun(text) {
      clearTimeout(this.employUnitSetTim);
      this.loading = true;
      if (text != '' && text.length >= 2) {
        this.loading = false;
        this.employUnitSetTim = setTimeout(() => {
          getEmployKeywordList({ keyWord: text, entityType: this.entityType }).then(r => {
            if(!r.status){return}
            this.employUnitOptions = r.data
          })
        }, 200);
      } else {
        this.loading = false;
        this.employUnitOptions = []
      }
    },
    buildNameFun(text) {
      clearTimeout(this.buildNameSetTim);
      this.loading = true;
      if (text != '' && text.length >= 2) {
        this.loading = false;
        this.buildNameSetTim = setTimeout(() => {
          getBuildingList({ keysWork: text, entityType: this.entityType }).then(r => {
            if(!r.status){return}
            this.buildNameOptions = r.data
          })
        }, 200);
      } else {
        this.loading = false;
        this.employUnitOptions = []
      }
    },
    det(deptId) {
      if (deptId.length > 0) {
        this.areaCode = deptId[deptId.length - 1];
      } else {
        this.areaCode = ''
      }
      this.getEntityPaging();
    },
    //页数改变
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.getEntityPaging();
    },
    //每页数量改变
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.getEntityPaging();
    },
    addRowClick(row){
      this.$emit('rowClick',row)
    }
  },
}
</script>

<style scoped lang="sass">
  .addpopup{
    position: fixed;
    background: rgba(0,0,0,.5);
    z-index: 99;
    top: 0;
    bottom:0;
    left:0;
    right:0;
    overflow: auto;
  }
  .addDiv{
    width: 900px;
    position: absolute;
    top: 100px;
    left: 50%;
    margin-left: -450px;
    background: #fff;
    padding: 0 20px;
  }
  .addTit{
    height: 40px;
    line-height: 40px;
    background: #F2F5F8;
    width: calc(100% + 40px);
    margin-left: -20px;
    i{
      font-size: 16px;
      margin-top: 12px;
      margin-right: 7px;
    }
  }
  .dowShow{
    display: inline-block;
    width: 34px;
    height: 34px;
    background: #F6F7F8;
    border:1px solid #C2CAD2;
    line-height: 34px;
    text-align: center;
    box-sizing: border-box;
  }
  .w358{
    width: 358px;
  }
  .w180{
    width: 180px;
  }
</style>