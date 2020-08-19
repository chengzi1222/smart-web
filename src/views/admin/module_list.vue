<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>模块管理</span>
    </div>
    <div class="big-box">
      <div style="width: 100%;">
        <div class="ipt-btn-box">
          <div>
            <el-input placeholder="请输入模块名称" v-model="page.keyword" class="w200 seekIpt" @keyup.enter.native="handleIconClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>
          </div>
          <div>
            <el-button type="primary" v-auth="'system.admin.module|func.scan'" @click="scan">
              <i class="el-icon-plus el-icon--left"></i>扫描模块
            </el-button>
          </div>
        </div>

        <!--列表-->
        <el-table :data="moduleTableData" class="table-div" @expand-change="getFunc">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-table :data="funcTableData[props.row.moduleCode]" class="table-div">
                  <el-table-column prop="name" label="方法名称"></el-table-column>
                  <el-table-column prop="alias" label="方法别名"></el-table-column>
                  <el-table-column prop="funcCode" label="方法编码"></el-table-column>
                  <el-table-column prop="description" label="说明"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <a href="javascript:;" class="operate-a" @click="showEdit(scope.row.id, scope.row)">编辑</a>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="group" label="分组"></el-table-column>
          <el-table-column prop="label" label="标签"></el-table-column>
          <el-table-column prop="name" label="模块名称"></el-table-column>
          <el-table-column prop="moduleCode" label="模块编码"></el-table-column>
          <el-table-column show-overflow-tooltip prop="clazz" label="模块类"></el-table-column>
          <el-table-column prop="funcName" label="功能"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
        </el-table>

        <!--分页组件-->
        <div class="block" style="float: right; margin-top: 15px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[8, 10, 15]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!--<div  @click="isShow = true">点击</div>-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isShow">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShow = false"></i>
        <el-input placeholder="请输入功能别名" v-model="module.alias"></el-input>
        <el-input placeholder="请输入功能说明" v-model="module.description"></el-input>
        <div class="form-btn">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="editModule">确定</el-button>
        </div>
      </popupBody>
    </transition>

  </div>
</template>

<script>

import popupBody from 'components/popup/popupdata';
import * as moduleApi from 'api/admin/module';

export default {
  async beforeMount() {

    this.getTableData();

  },

  methods: {
    async getTableData() {
      let response = await moduleApi.page(this.page);
      let list = response.data.list;
      this.moduleTableData = list;
      this.pagination.total = response.data.total;
    },

    handleIconClick() {	//搜索框按钮点击搜索
      //this.a = !this.a
      moduleApi.page(this.page).then((result) => {
        this.moduleTableData = result.data.list;
        this.pagination.total = result.data.total;
      })
    },

    scan() {
      moduleApi.scan();
      this.getTableData();
    },

    //分页方法 siez
    handleSizeChange(val) {

      this.page.pageSize = val;
      moduleApi.page(this.page).then((result) => {
        this.moduleTableData = result.data.list;
        this.pagination.total = result.data.total;

        this.pagination.pageSize = val;
      })

    },
    //分页方法 num
    handleCurrentChange(val) {

      this.page.pageNum = val;
      moduleApi.page(this.page).then((result) => {
        this.moduleTableData = result.data.list;
        this.pagination.total = result.data.total;

        this.pagination.pageNum = val;
      })
    },

    //获取方法列表
    getFunc(moduleModel) {
      if (!this.funcTableData[moduleModel.moduleCode]) {
        moduleApi.listFunc(moduleModel.moduleCode).then((result) => {
          this.$set(this.funcTableData, moduleModel.moduleCode, result.data)
        })
      }
    },

    //显示编辑弹窗
    showEdit(id, module) {
      this.isShow = true;
      this.module.id = id;
      this.module.alias = module.alias;
      this.module.description = module.description;
      this.currentRow = module;
    },

    //编辑提交方法
    editModule() {
      moduleApi.editModule(this.module).then((result) => {
        if (result.status) {
          this.currentRow.alias = this.module.alias;
          this.currentRow.description = this.module.description;
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.isShow = false;
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      })
    },

  },
  data() {
    return {
      pagination: {
        pageNum: 1,
        pageSize: 8
      },          //前端分页
      page: {
        keyword: "",
        pageNum: 1,
        pageSize: 8
      },              //后端分页
      isShow: false,

      module: {},
      currentRow: {},

      moduleTableData: [],
      funcTableData: {}
    }
  },
  components: {
    popupBody
  }
}
</script>


<style scoped lang="sass">
.tree-box {
  border: none;
  background: #f2f5f8;
  height: 82%;
  overflow-y: scroll;
}

.big-box {
  display: flex;
  margin-top: 20px;
  min-height: 600px;
  padding-right: 20px;
}

.tree-div {
  min-width: 220px;
  margin-right: 20px;
  border-right: 1px solid #ccc;
  background: #f2f5f8;
}

.area-name {
  padding: 10px;
  background: #e7edf4;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #495669;
  line-height: 26px;
}

.area-name button {
  background: #ffffff;
  border: 1px solid #c2cad2;
  width: 26px;
  height: 26px;
  color: #a2aab6;
  text-align: center;
}

.ipt-div {
  border: 1px solid #ccc;
  margin: 10px;
  height: 34px;
  line-height: 34px;
  background: #fff;
}

.ipt-div i {
  margin: 0 10px 0 13px;
  color: #c5cfd9;
}

.ipt-div input {
  border: none;
  outline: none;
}

.box-tit {
  margin: 20px 0 10px 0;
  color: #393939;
}

.box-tit span {
  font-size: 18px;
}

.box-tit button {
  background: #f6f7f8;
  border: 1px solid #c2cad2;
  height: 28px;
  width: 88px;
  font-size: 14px;
  margin-left: 13px;
}

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

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 1;
  position: relative;
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

.typeWidth {
  width: 150px;
  margin-right: 20px;
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

.center-border {
  display: inline-block;
  width: 3px;
  border-right: 1px solid #ccc;
  height: 12px;
  margin: 0 8px 0 5px;
}

/*popup start*/

.popup-hide {
  position: absolute;
  top: 10px;
  right: 20px;
}

.dialog-fade-enter-active {
  animation: dialog-fade-in 0.3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.3s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

/*popup end*/
</style>
