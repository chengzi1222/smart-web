<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>用户字典管理</span>
    </div>
    <ul class="tab-box">
      <li class="tab-bott"></li>
    </ul>

    <div class="big-box">
      <div style="width: 15%; display: inline-block; margin: 20px 10px;
    float: left;" class="tree-div">
        <el-tree :data="areaTree" :props="areaProps" :highlight-current="true" @node-click="handleNodeClick" class="tree-box"></el-tree>
      </div>

      <div style="width: 80%; display: inline-block;" class="flex1">
        <div style="margin: 20px 0 5px;">
          <span>当前城市: {{area.areaName}}</span>
        </div>

        <div class="ipt-btn-box" v-if="area.areaName">
          <div>
            <el-input placeholder="请输入字典名称" v-model="page.keywords.name" class="w200 seekIpt" @keyup.enter.native="handleIconClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>

            <el-select clearable v-model="dictType" @change="selectType();" placeholder="请选择字典类型" class="w200">
              <el-option v-for="item in dictTypeList" :key="item.id" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </div>

          <el-button slot="append" type="primary" icon="plus" @click="goAdd()" style="padding-top: 9px;">添加字典
          </el-button>
        </div>
        <el-table :data="tableData" class="table-div">
          <el-table-column type="index" label="序号" width="120"></el-table-column>
          <el-table-column label="字典名" prop="name">
            <template slot-scope="scope">
              <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编码">
            <template slot-scope="scope">
              <el-input size="small" style="width: 120px" v-if="scope.row.isEdit && scope.row.isCreate" v-model="scope.row.code"></el-input>
              <span v-else>{{scope.row.code}}</span>
            </template>

          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.remark"></el-input>
              <span v-else>{{scope.row.remark}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" :width="200">
            <template slot-scope="scope">
              <a href="javascript:;" @click="goDetail(scope.row);" class="operate-a">详情</a>
              <a href="javascript:;" @click="goEdit(scope.row);" class="operate-a">编辑</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[5,8,10,15,20,25,30]" :page-size="pagination.pageSize" :current-page="pagination.pageNum" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @current-change="pagecCurrentChange" @size-change="pageSizeChange"></el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>


<script>

  import {
    pageDict,
    pageDictUser,
    listDictType
  } from "api/admin/dict";

  import {
    listExistsDept,
    getByAreaCode
  } from "api/admin/area";

  export default {
    async mounted() {
      //      pageDictUser(this.page).then((result) => {
      //        this.tableData = result.data.list;
      //        this.pagination.total = result.data.total;
      //      });

      this.areaCode = this.$route.params.areaCode;
      if (this.areaCode) {
        getByAreaCode(this.areaCode).then(result => {
          this.area = result.data;
        });
        this.page.keywords.areaCode = this.areaCode;
        pageDictUser(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      }

      let resultData = await listDictType();
      this.dictTypeList = this.dictTypeList.concat(resultData.data);

      let areaTreeResultData = await listExistsDept();
      this.areaTree = areaTreeResultData.data;
    },
    methods: {
      handleNodeClick(data) {
        if (data.codeLevel == 2 || data.isMunic == 'YES') {
          this.area = data;
          this.areaCode = data.areaCode;
          this.page.keywords.areaCode = data.areaCode;
          pageDictUser(this.page).then((result) => {
            this.tableData = result.data.list;
            this.pagination.total = result.data.total;
          });
        }
      },

      handleIconClick() {	//搜索框按钮点击搜索
        pageDictUser(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },
      selectType() {
        this.page.keywords.type = this.dictType;
        pageDictUser(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },

      pagecCurrentChange(num) {
        this.page.pageNum = num;
        pageDictUser(this.page).then((result) => {
          this.tableData = result.data.list;
        });
      },
      pageSizeChange(num) {
        this.page.pageSize = num;
        pageDictUser(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.pageSize = num;
        });
      },
      /* CURD 方法 */
      goAdd() {
        if (this.areaCode == '' || this.areaCode == 'undefined' || (this.area.codeLevel != '2' && this.area.isMunic != 'YES')) {
          this.$message({
            message: '请选择市级或直辖市区域.',
            type: 'error'
          });
          return false;
        }

        this.$router.push({ name: 'dict.user.curd', params: { curd: 'add' }, query: { id: this.areaCode } });
      },
      goEdit(dict) {
        this.$router.push({ name: 'dict.user.curd', params: { curd: 'edit' }, query: { id: dict.id } });
      },
      goDetail(dict) {
        this.$router.push({ name: 'dict.user.curd', params: { curd: 'detail' }, query: { id: dict.id } });
      },
    },
    components: {},
    data() {
      return {
        tableData: [],
        pagination: {
          pageNum: 1,
          pageSize: 8
        },          //前端分页
        page: {
          pageNum: 1,
          pageSize: 8,
          keywords: {}
        },              //后端分页

        //select字典
        dictTypeList: [],
        dictType: "",

        areaTree: [],
        areaProps: {
          children: 'children',
          label: 'areaName'
        },
        area: {},
        areaCode: ""
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
</style>
