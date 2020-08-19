<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>标准字典库管理</span>
    </div>
    <ul class="tab-box">
      <li class="tab-bott"></li>
    </ul>

    <div class="ipt-btn-box">
      <div>
        <el-input placeholder="请输入字典名称" v-model="page.keywords.name" class="w200 seekIpt" @keyup.enter.native="handleIconClick">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>

        <el-select v-model="dictType" @change="selectType();" placeholder="请选择字典类型" class="w200">
          <el-option v-for="item in dictTypeList" :key="item.id" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </div>

      <el-button slot="append" type="primary" icon="plus" @click="goAdd()" style="padding-top: 9px;">添加字典
      </el-button>
    </div>
    <el-table :data="tableData" class="table-div">
      <el-table-column type="index" label="序号" min-width="80"></el-table-column>
      <el-table-column label="字典名" prop="name" min-width="150"></el-table-column>
      <el-table-column prop="code" label="编码" min-width="120"></el-table-column>
      <el-table-column prop="typeName" label="类型" min-width="120"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>

      <el-table-column label="操作"  min-width="200"> 
        <template slot-scope="scope">
          <a href="javascript:;" @click="goDetail(scope.row);" class="operate-a">详情</a>
          <a href="javascript:;" @click="goEdit(scope.row);" class="operate-a">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background :page-sizes="[5,8,10,15,20,25,30]" :page-size="pagination.pageSize"
       :current-page="pagination.pageNum" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" 
       @current-change="pagecCurrentChange" @size-change="pageSizeChange"></el-pagination>
    </div>
  </div>
</template>


<script>

  import {
    pageDict,
    listDictType
  } from "api/admin/dict"

  export default {
    async mounted() {
      this.page.pageNum = 1;
      pageDict(this.page).then((result) => {
        this.tableData = result.data.list;
        this.pagination.total = result.data.total;
      });

      let resultData = await listDictType();
      this.dictTypeList = this.dictTypeList.concat(resultData.data);
    },
    methods: {
      handleIconClick() {	//搜索框按钮点击搜索
        pageDict(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },
      selectType() {
        this.page.keywords.type = this.dictType;
        pageDict(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },
      ////      async tableSearch(num = 1) {
      ////        var params = {
      ////          num: num,
      ////          size: this.page.pageSize,
      ////          keywords: {
      ////            name: this.page.keyword,
      ////            type: this.dictType
      ////          }
      ////        };
      //
      //
      //        pageDict(params).then((result) => {
      //          this.page = result.data;
      //          this.tableData = result.data.list;
      //        });
      //      },

      pagecCurrentChange(num) {
        this.page.pageNum = num;
        pageDict(this.page).then((result) => {
          this.tableData = result.data.list;
        });
      },
      pageSizeChange(num) {
        this.page.pageSize = num;
        pageDict(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.pageSize = num;
        });
      },

      /* CURD 方法 */
      goAdd() {
        this.$router.push({ name: 'dict.manager.curd', params: { curd: 'add' }, query: { id: 'sys' } });
      },
      goEdit(dict) {
        this.$router.push({ name: 'dict.manager.curd', params: { curd: 'edit' }, query: { id: dict.id } });
      },
      goDetail(dict) {
        this.$router.push({ name: 'dict.manager.curd', params: { curd: 'detail' }, query: { id: dict.id } });
      },
    },
    components: {},
    data() {
      return {
        a: false,
        tableData: [],
        pagination: {
          pageNum: 1,
          pageSize: 8
        },          //前端分页
        page: {
          pageNum: 1,
          pageSize: 8,
          keywords: {}
        },               //后端分页

        //select字典
        dictTypeList: [{ code: "", id: "", name: "全部" }],
        dictType: ""
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
