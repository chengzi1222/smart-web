<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>角色管理</span>
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
              <i class="el-icon-plus el-icon--left"></i>添加预置角色
            </el-button>

          </div>
        </div>

        <!--列表-->
        <el-table :data="roleCustomTableData" class="table-div">

          <el-table-column type="index" :width="120" label="序号"></el-table-column>
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <el-input size="small" v-if="(scope.row.isRoleEdit)" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="belong" label="所属"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--<a href="javascript:;" class="operate-a" @click="showEdit(scope.row.id, scope.row.name)">编辑</a>-->
              <a v-if="!scope.row.isRoleEdit" href="javascript:;" @click="scope.row.isRoleEdit = true;" class="operate-a">编辑</a>

              <a v-if="scope.row.isRoleEdit" href="javascript:;" @click="editRoleCustom(scope.row)" class="operate-a">保存</a>

              <a href="javascript:;" class="operate-a" @click="showFunc(scope.row.id)">关联</a>
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

        <el-form :model="roleCustom" :rules="rules" ref="roleCustom" label-width="100px" class="demo-ruleForm">

          <el-form-item label="角色名称:" prop="name">
            <el-input placeholder="请输入角色名" v-model="roleCustom.name" class="w200"></el-input>
          </el-form-item>

          <el-form-item label="角色类型:" prop="type">
            <el-select v-model="roleCustom.type" placeholder="请选择角色类型" class="w200">
              <el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="角色所属:" prop="belong">
            <el-select v-model="roleCustom.belong" placeholder="请选择角色所属" class="w200">
              <el-option v-for="item in belongList" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="角色介绍:" prop="intro">
            <el-input placeholder="请输入角色介绍" v-model="roleCustom.intro" class="w200"></el-input>
          </el-form-item>

        </el-form>

        <div class="form-btn">
          <el-button @click="isShow = false; isAdd = false; isEdit = false;">取消</el-button>
          <el-button v-if="isAdd" type="primary" @click="addRoleCustom">确定</el-button>
          <el-button v-if="isEdit" type="primary" @click="editRoleCustom">确定</el-button>
        </div>
      </popupBody>
    </transition>

    <!--关联弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isShowFunc">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShowFunc = false"></i>

        <!--穿梭框-->
        <transfer :transferData_left="transferData_right" :transferData_right="transferData_left" showFlied="text" childFlid="children" titleleft="未关联" titleright="已关联" :callback="callback">
          <el-input slot="search1" placeholder="请输入搜索内容" v-model="search2" @keyup.enter.native="search2Click">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search2Click"></i>
          </el-input>
          <el-input slot="search2" placeholder="请输入搜索内容" v-model="search1" @keyup.enter.native="search1Click">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search1Click"></i>
          </el-input>
        </transfer>
        <div class="form-btn">
          <el-button @click="isShowFunc = false">取消</el-button>
          <el-button type="primary" @click="addRoleModule();">确定</el-button>
        </div>
      </popupBody>
    </transition>

  </div>
</template>



<script>

import popupBody from 'components/popup/popupdata';
import transfer from 'components/transfer/transfer';
import dataDistinct from 'utils/dataDistinct.js'

import * as roleApi from 'api/admin/role';
import * as moduleApi from 'api/admin/module';

export default {
  async beforeMount() {

    let response = await roleApi.pageCustom(this.page);
    let list = response.data.list;
    this.roleCustomTableData = list;
    this.pagination.total = response.data.total;

  },

  methods: {
    /* 关联方法 */

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

      //dataDistinct(this.transferData_left, this.transferData_right, "text", "children");
      dataDistinct.call(this, this.transferData_right, this.transferData_left, 'transferData_right', 'transferData_left');

      this.selectRoleId = id;
      this.isShowFunc = true;
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
          this.isShowFunc = false;

          this.$message({
            message: '预置角色关联功能成功.',
            type: 'success'
          });
        }
      }
      )
    },

    /* 表格方法 */
    //搜索框按钮点击搜索
    handleIconClick() {
      //this.a = !this.a
      roleApi.pageCustom(this.page).then((result) => {
        this.roleCustomTableData = result.data.list;
        this.pagination.total = result.data.total;
      })
    },
    //分页方法 siez
    handleSizeChange(val = 8) {
      this.page.pageSize = val;
      roleApi.pageCustom(this.page).then((result) => {
        this.roleCustomTableData = result.data.list;
        this.pagination.total = result.data.total;

        this.pagination.pageSize = val;
      })
    },
    //分页方法 num
    handleCurrentChange(val) {
      this.page.pageNum = val;
      roleApi.pageCustom(this.page).then((result) => {
        this.roleCustomTableData = result.data.list;
        this.pagination.total = result.data.total;
        this.pagination.pageNum = val;
      })
    },

    /* CURD 方法 */
    showAdd() {
      roleApi.getRoleType().then((results) => {
        this.typeList = results.data;
      })

      roleApi.getBelong().then((results) => {
        this.belongList = results.data;
      })

      this.isShow = true;
      this.isAdd = true;
      this.roleCustom.name = "";
      this.roleCustom.type = "";
      this.roleCustom.belong = "";
      this.roleCustom.intro = "";

    },

    addRoleCustom() {
      this.$refs.roleCustom.validate(function (result) {
        if (result) {

          roleApi.addRoleCustom(this.roleCustom).then((result) => {
            if (result.status) {
              this.isShow = false;
              this.isAdd = false;

              this.$message({
                message: '添加预置角色成功',
                type: 'success'
              });

              this.handleSizeChange();
            } else {
              this.$message({
                message: result.msg,
                type: 'error'
              });
            }
          })
        } else {
          this.$message({
            message: "请按提示输入完整信息.",
            type: 'error'
          });
        }
      }.bind(this))
    },

    //编辑提交方法
    editRoleCustom(obj) {
      let params = {};
      params.id = obj.id;
      params.name = obj.name;

      roleApi.editRoleCustom(params).then((result) => {
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

      //弹出层
      isShow: false,
      isAdd: false,
      isEdit: false,
      isShowFunc: false,

      typeList: [],
      belongList: [],

      selectRoleId: '',   //操作行部门id

      roleCustom: {
        type: '',
        belong: ''
      },

      roleCustomTableData: [],

      //穿梭框
      search1: "",
      search2: "",
      transferData_left: [],
      transferData_right: [],
      //可以在回调函数中进行提交操作以及数据操作。
      callback: function () {
        console.log(this.transferData_left)
        console.log(this.transferData_right)
      },

      //校验
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'blur' }],
        belong: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    };
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
