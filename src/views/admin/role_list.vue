<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>角色设置</span>
    </div>
    <ul class="tab-box">
      <router-link activeClass="li-bott" tag="li" to="/admin/roles/preset">
        预置角色
      </router-link>
      <router-link activeClass="li-bott" tag="li" to="/admin/roles/system">
        系统角色
      </router-link>
      <li class="tab-bott"></li>
    </ul>
    <div class="big-box">
      <div style="width: 100%;">
        <div class="ipt-btn-box">
          <div>
            <el-input placeholder="请输入角色名称" v-model="page.keyword" class="w200 seekIpt" @keyup.enter.native="handleIconClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>
          </div>
          <div>

            <el-button type="primary" @click="showAdd();">
              <i class="el-icon-plus el-icon--left"></i>添加角色
            </el-button>

          </div>
        </div>

        <!--列表-->
        <el-table :data="roleTableData" class="table-div">

          <el-table-column type="index" :width="120" label="序号"></el-table-column>
          <el-table-column label="角色名称">

            <template slot-scope="scope">
              <el-input size="small" v-if="(scope.row.isRoleEdit)" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>

          </el-table-column>
          <el-table-column prop="intro" label="角色简介"></el-table-column>
          <el-table-column show-overflow-tooltip prop="funcName" label="角色权限"></el-table-column>
          <el-table-column prop="enableLabel" label="状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a v-if="!scope.row.isRoleEdit" href="javascript:;" @click="scope.row.isRoleEdit = true;" class="operate-a">编辑</a>
              <a v-if="scope.row.isRoleEdit" href="javascript:;" @click="editRole(scope.row)" class="operate-a">保存</a>

              <a v-if="scope.row.type == 'CONFIGURED'" href="javascript:;" class="operate-a" @click="showFunc(scope.row.id)">关联</a>

              <a href="javascript:;" class="operate-a" @click="enableToggle(scope.row)">
                <span v-if="scope.row.enable == 'YES'">禁用</span>
                <span v-if="scope.row.enable == 'NO'">启用</span>
              </a>
            </template>
          </el-table-column>
        </el-table>

        <!--分页组件-->
        <div class="block" style="float: right; margin-top: 15px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[8, 10, 15]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!--添加弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isShow">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShow = false; isAdd = false; isEdit = false;"></i>

        <div class="form-item">
          <span class="input-t">角色名称:</span>
          <el-input placeholder="请输入角色名" v-model="role.name" class="w200"></el-input>
        </div>

        <div class="form-item">
          <span class="input-t">角色介绍:</span>
          <el-input placeholder="请输入角色介绍" v-model="role.intro" class="w200"></el-input>
        </div>

        <div class="form-btn">
          <el-button @click="isShow = false; isAdd = false; isEdit = false;">取消</el-button>
          <el-button v-if="isAdd" type="primary" @click="addRole">确定</el-button>
          <el-button v-if="isEdit" type="primary" @click="editRole">确定</el-button>
        </div>
      </popupBody>
    </transition>

    <!--关联弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isShowTransfer">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShowTransfer = false; isShowFunc = false; isShowRoleCustom = false;"></i>

        <!--角色功能穿梭框-->
        <transfer v-if="isShowFunc" :transferData_left="transferData_right" :transferData_right="transferData_left" showFlied="text" childFlid="children" titleleft="未关联" titleright="已关联" :callback="callback">
          <el-input slot="search1" placeholder="请输入搜索内容" v-model="search2" @keyup.enter.native="search2Click">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search2Click"></i>
          </el-input>
          <el-input slot="search2" placeholder="请输入搜索内容" v-model="search1" @keyup.enter.native="search1Click">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search1Click"></i>
          </el-input>
        </transfer>

        <!--部门角色穿梭框-->
        <transfer v-if="isShowRoleCustom" :transferData_left="role_right" :transferData_right="role_left" showFlied="text" childFlid="children" titleleft="未关联" titleright="已关联" :callback="roleCallBack">
          <el-input slot="search1" placeholder="请输入搜索内容" v-model="search2" @keyup.enter.native="search2Click">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search2Click"></i>
          </el-input>
          <el-input slot="search2" placeholder="请输入搜索内容" v-model="search1"  @keyup.enter.native="search1Click">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search1Click"></i>
          </el-input>
        </transfer>

        <div class="form-btn">
          <el-button @click="isShowTransfer = false; isShowFunc = false; isShowRoleCustom = false;">
            取消
          </el-button>
          <el-button v-if="isShowFunc" type="primary" @click="addRoleModule();">确定</el-button>
          <el-button v-if="isShowRoleCustom" type="primary" @click="addDeptRoleCustom();">确定
          </el-button>
        </div>
      </popupBody>
    </transition>

  </div>
</template>

<script>

import popupBody from 'components/popup/popupdata';
import transfer from 'components/transfer/transfer';
import { updateEnable } from 'api/admin/role';
import dataDistinct from 'utils/dataDistinct.js'

import * as moduleApi from 'api/admin/module';
import * as roleApi from 'api/admin/role';

export default {
  async beforeMount() {

    this.params.page = this.page;

    let response = await roleApi.page(this.params);
    let list = response.data.list;
    this.roleTableData = list;
    this.pagination.total = response.data.total;

  },

  methods: {

    /* 关联角色功能方法 */

    //关联模块弹窗
    async showFunc(id) {
      let params = {
        'roleId': id
      }
      //已关联
      let { data } = await moduleApi.listFuncByRoleId(params)
      this.transferData_left = data

      //未关联
      let res = await moduleApi.listModuleFuncAll()
      this.transferData_right = res.data

      dataDistinct.call(this, this.transferData_right, this.transferData_left, 'transferData_right', 'transferData_left');

      this.selectRoleId = id;
      this.isShowFunc = true;
      this.isShowTransfer = true;
    },

    //穿梭搜索
    search1Click() {
      let params = {
        'roleId': this.selectRoleId,
        'name': this.search1
      }
      moduleApi.listFuncByRoleId(params).then(
        result => {
          this.transferData_left = result.data;
        });
    },
    search2Click() {
      let params = {
        'name': this.search2
      }
      moduleApi.listModuleFuncAll(params).then(
        result => {
          this.transferData_right = result.data;
        });
    },

    //角色关联功能 功能池
    addRoleModule() {
      let moduleFuncList = [];
      this.transferData_left.forEach(data => {
        data.children.forEach(child => {
          moduleFuncList.push(child.id);
        })
      });
      let params = {
        moduleFuncList: moduleFuncList,
        roleId: this.selectRoleId
      };
      roleApi.addRoleModuleFunc(params).then(result => {
        if (result.status) {
          this.isShowTransfer = false;
        }
      }
      )
    },


    //穿梭搜索
    roledSearchClick() {
      let params = {
        'deptId': this.selectDeptId,
        'name': this.roledSearch
      }
      roleApi.listRoleCustomByDeptId(params).then(result => {
        result.data.forEach(data => {
          data.children = [];
        });
        this.role_left = result.data;
      });
    },
    unRoledSearchClick() {
      let params = {
        'name': this.unRoledSearch
      }
      roleApi.listRoleCustomByDeptId(params).then(result => {
        result.data.forEach(data => {
          data.children = [];
        });
        this.role_left = result.data;
      });
    },

    /* 表格方法 */
    //搜索框按钮点击搜索
    handleIconClick() {
      //this.a = !this.a
      roleApi.page(this.params).then((result) => {
        this.roleTableData = result.data.list;
        this.pagination.total = result.data.total;
      })
    },
    //分页方法 siez
    handleSizeChange(val = 8) {
      this.page.pageSize = val;
      roleApi.page(this.params).then((result) => {
        this.roleTableData = result.data.list;
        this.pagination.total = result.data.total;

        this.pagination.pageSize = val;
      })
    },
    //分页方法 num
    handleCurrentChange(val = 1) {
      this.page.pageNum = val;
      roleApi.page(this.params).then((result) => {
        this.roleTableData = result.data.list;
        this.pagination.total = result.data.total;
        this.pagination.pageNum = val;
      })
    },

    /* CURD 方法 */
    showAdd() {

      this.roleType = "ADMIN";
      this.roleBelong = "SELF";
      this.role.intro = "";
      this.isShow = true;
      this.isAdd = true;
      this.role.name = '';

    },

    addRole() {
      this.role.type = this.roleType;
      this.role.belong = this.roleBelong;

      roleApi.addRole(this.role).then((result) => {
        if (result.status) {
          this.isShow = false;
          this.isAdd = false;

          this.$message({
            message: '添加角色成功',
            type: 'success'
          });

          this.handleSizeChange();
        }
      })
    },
    //显示编辑弹窗
    showEdit(id, name) {
      //        this.isShow = true;
      //        this.isEdit = true;
      this.isRoleEdit = true;
      this.role.id = id;
      this.role.name = name;
    },

    //编辑提交方法
    editRole(obj) {
      let params = {};
      params.id = obj.id;
      params.name = obj.name;

      roleApi.editRole(params).then((result) => {
        if (result.status) {
          this.isShow = false;
          this.isEdit = false;

          this.$message({
            message: '编辑角色成功',
            type: 'success'
          });

          this.handleSizeChange();
          obj.isRoleEdit = false;
        }
      })
    },

    //启用开关
    enableToggle(role) {
      let enable = '';
      let id = role.id;
      if (role.enable === 'YES') {
        enable = 'NO';
      } else if (role.enable === 'NO') {
        enable = 'YES';
      }

      updateEnable(id, enable).then(result => {
        if (result.status) {

          this.$message({
            message: '操作成功.',
            type: 'success'
          });

          this.handleSizeChange();
        }
      });

    }

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

      params: {
        deptId: '00000000000000000000000000000000'
      },

      //弹出层
      isShow: false,
      isAdd: false,
      isEdit: false,
      isShowTransfer: false,
      isShowFunc: false,
      isShowRoleCustom: false,

      selectRoleId: '',   //操作行角色id
      selectDeptId: '',   //操作行部门id

      role: {
        deptId: '00000000000000000000000000000000'
      },

      typeList: [],
      belongList: [],
      roleType: "",
      roleBelong: "",

      toggleStr: "禁用",

      roleTableData: [],

      //角色功能穿梭框
      search1: "",
      search2: "",
      transferData_left: [],
      transferData_right: [],
      //可以在回调函数中进行提交操作以及数据操作。
      callback: function () {
        console.log(this.transferData_left);
        console.log(this.transferData_right);
      },

      //部门预置角色穿梭框
      roledSearch: "",
      unRoledSearch: "",
      role_left: [],
      role_right: [],
      roleCallBack: function () {
        console.log(this.role_left);
        console.log(this.role_right);
      },
    }
  },
  components: {
    popupBody,
    transfer
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

.tab-box:after {
  content: "";
  clear: both;
  overflow: hidden;
  display: block;
  height: 0;
}
.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
  float: left;
  cursor: pointer;
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

/* tab-box start */
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

/* tab-box end */
</style>
