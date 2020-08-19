<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>字典分类管理</span>
    </div>
    <ul class="tab-box">
      <li class="tab-bott"></li>
    </ul>
    <div class="ipt-btn-box" style=" float: right;">
      <el-button type="primary" icon="plus" slot="append" @click="addDictType(tableData)" style="padding-top: 9px;">添加分类
      </el-button>
    </div>
    <el-table :data="tableData" class="table-div">
      <el-table-column type="index" label="序号" width="120"></el-table-column>
      <el-table-column label="分类名" prop="name">
        <template slot-scope="scope">
          <el-input size="small" style="width: 120px"
                    v-if="scope.row.isEdit"
                    v-model="scope.row.name"
                    ></el-input>
          <span style="color: #ff4949" v-if="nameIsNull">{{scope.row.nameIsNull}}</span>

          <span v-if="!scope.row.isEdit">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="编码">
        <template slot-scope="scope">
          <el-input size="small" style="width: 120px"
                    v-if="scope.row.isEdit && scope.row.isCreate"
                    v-model="scope.row.code"></el-input>
          <span style="color: #ff4949" v-if="codeIsNull">{{scope.row.codeIsNull}}</span>
          <span v-if="!(scope.row.isEdit && scope.row.isCreate)">{{scope.row.code}}</span>
        </template>

      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <el-input size="small" style="width: 120px"
                    v-if="scope.row.isEdit"
                    v-model="scope.row.remark"></el-input>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" :width="200">
        <template slot-scope="scope">
          <a v-if="!scope.row.isEdit" href="javascript:;"
             @click="showEditDictType(tableData, scope.row)"
             class="operate-a">编辑</a>
          <a v-if="scope.row.isEdit" href="javascript:;"
             @click="cancel(tableData, scope.row);"
             class="operate-a">取消</a>
          <a v-if="scope.row.isEdit" href="javascript:;"
             @click="editDictType(scope.row)"
             class="operate-a">保存</a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination background :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
                     :current-page="page.pageNum" :total="page.total"
                     layout="total, sizes, prev, pager, next, jumper"
                     @current-change="pagecCurrentChange"
                     @size-change="pageSizeChange"></el-pagination>
    </div>
  </div>
</template>


<script>

  import {
    getDictTypePage,
    editDictType
  } from "api/admin/dict"

  export default {
    mounted() {
      this.page.pageNum = 1;
      this.tableSearch();
    },
    methods: {
      handleIconClick() {	//搜索框按钮点击搜索
        this.a = !this.a;
        this.tableSearch();
      },
      async tableSearch(num = 1) {
        let params = {};
        var formData = {
          params: params,
          num: num,
          size: this.page.pageSize
        };
        getDictTypePage(formData).then((result) => {
          this.page.total = result.data.total;
          result.data.list.forEach((value) => {
            this.$set(value, 'isEdit', false);
            this.$set(value, 'isCreate', false);
          });
          this.tableData = result.data.list;
        });

      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.tableSearch(num);
      },
      pageSizeChange(size) {
        this.page.pageSize=size;
        this.tableSearch();
      },

      cancel(tableData, row){
        if(row.isEdit && row.isCreate) {
          tableData.shift();
          row.isEdit = false;
          row.isCreate = false;
        } else {
          row.isEdit = false;
        }
      },

      editDictType(dictTypeData) {
        if(!dictTypeData.name) {
          this.nameIsNull = true;
          dictTypeData.nameIsNull = '请输入名称';
          return false;
        }
        if(!dictTypeData.code) {
          this.codeIsNull = true;
          dictTypeData.codeIsNull = '请输入编码';
          return false;
        }

        editDictType(dictTypeData).then((result) => {
          if (result || result.status) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            dictTypeData.isEdit = false;
            this.dictTypeData = {};
            this.tableSearch();
          }
        });
      },
      addDictType(tableData){
        let stopCount = 0;
        tableData.forEach(data => {
          if(data.isEdit || data.isCreate) {
            stopCount++;
          }
        })
        if(stopCount > 0) {
          this.$message({
            message: '请完成之前的保存.',
            type: 'error'
          });
          return false;
        }

        tableData.unshift({
          isEdit: true,
          isCreate: true
        });
      },
      showEditDictType(tableData, row) {
        let stopCount = 0;
        tableData.forEach(data => {
          if(data.isEdit || data.isCreate) {
            stopCount++;
          }
        })
        if(stopCount > 0) {
          this.$message({
            message: '请完成之前的操作.',
            type: 'error'
          });
          return false;
        }

        row.isEdit = true;
      }
    },
    components: {},
    data() {
      return {
        a: false,
        tableData: [],

        nameIsNull: false,
        codeIsNull: false,

        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dictTypeData: {},
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
    color: #9A9A9A;
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
    background: #EBF1F5;
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
    color: #1787AD;
  }
</style>
