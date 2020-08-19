<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>部门管理</span>
    </div>
    <div class="big-box">

      <div class="tree-div">
        <div class="area-name">
          <span>行政区域</span>
          <button v-if="treeCurrentNodeData.codeLevel >= 1 && treeCurrentNodeData.codeLevel <= 4" @click="openAreaAdd" class="add-btn">
            <i class="el-icon-plus"></i>
          </button>
          <transition name="dialog-area">
            <popupBody class="popup-body" v-if="isShowArea">
              <!-- 功能模块添加到这一区域 -->
              <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="closeAreaPopup"></i>
              <div class="form-item">
                <span class="input-t">当前区域名称:</span>
                <el-input placeholder="请输入区域名称" :disabled="true" v-model="treeCurrentNodeData.areaName" class="w200"></el-input>
              </div>
              <div class="form-item">
                <span class="input-t"><b>*</b>区域名称:</span>
                <el-input placeholder="请输入区域名称" v-model="areaData.areaName" class="w200"></el-input>
              </div>
              <div class="form-item">
                <span class="input-t"><b>*</b>regionCode:</span>
                <el-input placeholder="请选择对应的区域" v-model="areaData.regionCode" maxlength="20" class="w200"></el-input>
              </div>
              <div class="form-item">
                <el-tree 
                        class="tree-box area-tree"
                        v-loading="treeLoad"
                        :data="searchOpts" 
                        :props="tobTreeProps" 
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        node-key="areaId" 
                        :load="loadNode" 
                        lazy
                        accordion
                        @node-click="handleNodeClickAdd">
                        <span class="span-ellipsis" slot-scope="{ node }">
                            <span :title="node.label">{{ node.label }}</span>
                        </span>
                </el-tree>
              </div>
              <div class="form-item" style="margin-bottom: 0;">
                <!--<el-input  placeholder="请输入区域名称"></el-input>-->
                <el-button type="primary" @click="addArea">添加</el-button>
              </div>
            </popupBody>
          </transition>

        </div>
        <el-tree :data="treeData" :props="treeProps" :highlight-current='true' :expand-on-click-node="false" @node-expand="treeExpandEvent" @current-change="treeCurrentChange" lazy accordion class="tree-box"></el-tree>
      </div>
      <div class="region-edit">
        <transition name="dialog-area">
          <popupBody class="popup-body" v-if="isShowRegionEdit">
            <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="closeAreaPopup"></i>
            <div class="form-item">
              <span class="input-t"><b>*</b>regionCode:</span>
              <el-input v-model="regionCode" placeholder="请选择对应的区域" class="w200"></el-input>
              <el-tree 
                      class="tree-box area-tree"
                      v-if="isTobTreeShow"
                      v-loading="treeLoad"
                      :data="searchOpts" 
                      :props="tobTreeProps" 
                      :highlight-current="true"
                      :expand-on-click-node="false"
                      node-key="areaId" 
                      :load="loadNode" 
                      lazy
                      accordion
                      @node-click="handleNodeClick">
                      <span class="span-ellipsis" slot-scope="{ node }">
                          <span :title="node.label">{{ node.label }}</span>
                      </span>
              </el-tree>
            </div>
            <div class="form-item" style="margin-bottom: 0;">
               <!-- <el-button type="primary" @click="isShowRegionEdit = false">取消</el-button> -->
              <el-button type="primary" @click="regionSubmit">确定</el-button>
            </div>
          </popupBody>
        </transition>
      </div>
      <div style="width:calc(100% - 240px)">
        <div class="box-tit">
          <span>{{treeCurrentNodeData.areaName}}</span>
          <el-button v-if="treeCurrentNodeData.codeLevel >= 1 && treeCurrentNodeData.codeLevel <= 5" class="fr" type="primary" @click="editRegionCode">编辑区域</el-button>
        </div>
        <ul class="tab-box">
          <li v-for="(item,index) in lists" @click="liClick" :data-index='index' style="width:135px" :class="index == defaultIndex? 'li-bott':''" :key="index">
            <span @click="liClick" :data-index="index">{{item.name}}</span>
          </li>
          <li class="tab-bott"></li>
        </ul>


        <el-table :data="tableData" style="margin: 20px 0 20px;" empty-text="22">
          <el-table-column type="index" label="序号" min-width="70"></el-table-column>
          <el-table-column prop="deptName" label="部门名称" :min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="re">
                <el-input size="small" v-if="isDeptCreate || isDeptEdit" v-model="scope.row.deptName"></el-input>
                <span v-else>{{scope.row.deptName}}</span>
                <div v-if="deptAdminIsNull && scope.row.deptName != ''" class="reDiv">部门名称不能为空且字数小于50</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="adminName" label="部门管理员" :min-width="150"  show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="re">
                <el-input size="small" v-if="isDeptCreate" v-model="scope.row.deptAdmin"></el-input>
                <span v-else>{{scope.row.adminName}}</span>
                <div v-if="deptAdminIsNull" class="reDiv">部门管理员不能为空</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="部门地址" :min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="re">
                <el-input size="small" v-if="isDeptCreate || isDeptEdit" v-model="scope.row.address"></el-input>
                <span v-else>{{scope.row.address}}</span>
                <div  v-if="addressIsNull"  class="reDiv">部门地址不能为空且字数小于50</div>
                </div>
            </template>
          </el-table-column>
          <el-table-column v-if="areaData.parentCode.length === 6" prop="issuingOrgan" label="发证机关"
                           min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-input size="small" v-if="isDeptCreate || isDeptEdit" v-model="scope.row.issuingOrgan"></el-input>
                <span v-else>{{scope.row.issuingOrgan}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="areaData.parentCode.length >= 2 && areaData.parentCode.length <= 6" prop="persoName" label="自定义全称"
                           min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-input size="small" v-if="isDeptCreate || isDeptEdit" v-model="scope.row.persoName"></el-input>
                <span v-else>{{scope.row.persoName}}</span>
                <div v-if="isPersoName" class="reDiv">内容不能超过50字</div>
            </template>
          </el-table-column>
          <el-table-column v-if="areaData.parentCode.length >= 2 && areaData.parentCode.length <= 6" prop="simpleName" label="自定义简称"
                           min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-input size="small" v-if="isDeptCreate || isDeptEdit" v-model="scope.row.simpleName"></el-input>
                <span v-else>{{scope.row.simpleName}}</span>
                <div v-if="isSimpleName" class="reDiv">内容不能超过50字</div>
            </template>
          </el-table-column>
          <el-table-column prop="telNum" label="联系方式" :min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="re">
                <el-input size="small" v-if="isDeptCreate || isDeptEdit"
                      v-model="scope.row.telNum"></el-input>
                <span v-else>{{scope.row.telNum}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deptCode" label="部门编码" :min-width="150">
          </el-table-column>
          <el-table-column label="状态" min-width="70">
            <template slot-scope="scope">
              <span v-if="isDeptCreate"></span>
              <span v-else-if="scope.row.enable == 'YES'">
                启用
              </span>
              <span v-else>
                禁用
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="210" fixed="right">

            <template slot-scope="scope">

              <a v-if="!isDeptCreate && !isDeptEdit" href="javascript:;" @click="isDeptEdit = true" class="operate-a">编辑</a>

              <a v-if="isDeptEdit" href="javascript:;" @click="updateDept()" class="operate-a">保存</a>

              <a v-if="isDeptCreate" href="javascript:;" @click="addDept()" class="operate-a">创建部门</a>
              <a v-if="treeCurrentNodeData.codeLevel <= 3 && scope.row.deptType === 'SYJ'" href="javascript:;" @click="showModule(scope.row);" class="operate-a">关联功能</a>
              <a v-if="treeCurrentNodeData.codeLevel <= 3 && scope.row.deptType === 'SYJ'" href="javascript:;" @click="showRoleCustom(scope.row);" class="operate-a">预置角色</a>

              <!-- 启用禁用操作 -->
              <a v-if="!isDeptCreate && scope.row.enable == 'YES'" href="javascript:;" @click="disabledDept(scope.row);" class="operate-a">禁用</a>
              <a v-else-if="!isDeptCreate" href="javascript:;" @click="enableDept(scope.row);" class="operate-a">启用</a>
            </template>
          </el-table-column>
        </el-table>

        <div class="ipt-btn-box">
          <div>
            <el-input placeholder="请输入用户名称"  v-model="searchUserName"
                       @click="getUserByDept()" class="w200 seekIpt">
                       <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
                      </el-input>
          </div>
          <el-button type="primary" icon="plus" @click="isUserCreate = true;addEmptyToListFisrt(userTableData);">添加用户
          </el-button>
        </div>

        <el-table :data="userTableData">
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column label="用户名">
            <template slot-scope="scope">
              <el-input size="small" v-if="scope.row.isCreate" v-model="scope.row.userName"></el-input>
              <span v-else>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="真实姓名" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input size="small" v-if="scope.row.isEdit || scope.row.isCreate" v-model="scope.row.realName"></el-input>
              <span v-else>{{scope.row.realName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="手机号码">
            <template slot-scope="scope">
              <el-input size="small" v-if="scope.row.isEdit || scope.row.isCreate" v-model="scope.row.phoneNumber"></el-input>
              <span v-else>{{scope.row.phoneNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="电子邮箱">
            <template slot-scope="scope">
              <el-input size="small" v-if="scope.row.isEdit || scope.row.isCreate" v-model="scope.row.email"></el-input>
              <span v-else>{{scope.row.email}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="userTypeStr" label="用户类型">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.enable == 'YES'">
                启用
              </span>
              <span v-else>
                禁用
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="200">
            <template slot-scope="scope">
              <a v-if="!scope.row.isEdit && !scope.row.isCreate" href="javascript:;" @click="scope.row.isEdit = true;" class="operate-a">编辑</a>
              <a v-else-if="scope.row.isEdit" href="javascript:;" @click="scope.row.isEdit = false;updateUser(scope.row)" class="operate-a">保存</a>
              <a v-if="scope.row.isCreate" href="javascript:;" class="operate-a" @click="addUser(scope.row)">
                添加
              </a>
              <a v-if="!scope.row.isCreate && scope.row.enable == 'YES'" href="javascript:;" class="operate-a" @click="disabledUser(scope.row)">
                禁用
              </a>
              <a v-else-if="!scope.row.isCreate" href="javascript:;" class="operate-a" @click="enableUser(scope.row)">
                启用
              </a>

              <a v-if="!scope.row.isCreate" href="javascript:;" class="operate-a" @click="resetPassword(scope.row.id)">
                重置密码
              </a>

            </template>

          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" :current-page="page.pageNum" :total="page.total" layout="total, sizes, prev, pager, next, jumper" @current-change="pagecCurrentChange" @size-change="pageSizeChange"></el-pagination>
        </div>
      </div>
    </div>

    <!-- 用户弹窗 -->
    <transition name="dialog-user">
      <popupBody class="popup-body" v-if="isShowUser">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShowUser = false;isShowUserEdit = false"></i>
        <div class="form-item">
          <span class="input-t">用户名:</span>
          <el-input placeholder="请输入用户名" :disabled="isShowUserEdit" v-model="userData.userName" class="w200"></el-input>
        </div>
        <div class="form-item">
          <span class="input-t">真实姓名:</span>
          <el-input placeholder="请输入真实姓名" v-model="userData.realName" class="w200"></el-input>
        </div>
        <div class="form-item">
          <span class="input-t">手机号:</span>
          <el-input placeholder="请输入手机号" v-model="userData.phoneNumber" class="w200"></el-input>
        </div>
        <div class="form-item">
          <span class="input-t">邮箱:</span>
          <el-input placeholder="请输入邮箱" v-model="userData.email" class="w200"></el-input>
        </div>
        <div class="form-btn">
          <el-button type="primary" @click="addUser" v-if="!isShowUserEdit">添加</el-button>
          <el-button type="primary" @click="updateUser()" v-if="isShowUserEdit">保存</el-button>
        </div>
      </popupBody>
    </transition>

    <!--关联功能池弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isShowModule">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShowModule = false"></i>

        <!--穿梭框-->
        <transfer :transferData_left="transferData_left" :transferData_right="transferData_right"
                  showFlied="text" childFlid="children" titleleft="未关联" titleright="已关联"
                  :callback="callback">
          <el-input slot="search1" placeholder="请输入搜索内容"  v-model="search2"  @keyup.enter.native="search2Click"
                   >
                     <i slot="suffix" class="el-input__icon el-icon-search" @click="search2Click"></i>
          </el-input>
          <el-input slot="search2" placeholder="请输入搜索内容"  v-model="search1" @keyup.enter.native="search1Click">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="search1Click"></i>
          </el-input>
        </transfer>
        <div class="form-btn">
          <el-button @click="isShowModule = false; search2 = ''; search1 = '';">取消</el-button>
          <el-button type="primary" @click="addDeptModule();">确定</el-button>
        </div>
      </popupBody>
    </transition>

    <!--预置弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isShowRoleCustom">
        <!-- 预置弹窗添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShowRoleCustom = false"></i>

        <!--穿梭框-->
        <transfer :transferData_left="role_left" :transferData_right="role_right" showFlied="text" childFlid="children" titleleft="未关联" titleright="已关联" :callback="roleCallBack">
          <el-input slot="search1" placeholder="请输入搜索内容"  v-model="unRoledSearch" @keyup.enter.native="unRoledSearchClick">
               <i slot="suffix" class="el-input__icon el-icon-search" @click="unRoledSearchClick"></i>
          </el-input>
          <el-input slot="search2" placeholder="请输入搜索内容"  v-model="roledSearch" @keyup.enter.native="roledSearchClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="roledSearchClick"></i>
          </el-input>
        </transfer>
        <div class="form-btn">
          <el-button @click="isShowRoleCustom = false; unRoledSearch = ''; roledSearch = '';">取消</el-button>
          <el-button type="primary" @click="addDeptRoleCustom();">确定</el-button>
        </div>
      </popupBody>
    </transition>

    <!-- 部门弹窗 -->
    <transition name="dialog-dept">
      <popupBody class="popup-body" v-if="isShowDept">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShowDept = false;isShowDeptEdit = false"></i>
        <div class="form-item">
          <span class="input-t">部门名称:</span>
          <el-input placeholder="请输入部门名称" v-model="deptData.deptName" class="w200"></el-input>
        </div>
        <div class="form-item">
          <span class="input-t">部门地址:</span>
          <el-input placeholder="请输入部门地址" v-model="deptData.address" class="w200"></el-input>
        </div>
        <div class="form-item">
          <span class="input-t">管理员帐号:</span>
          <el-input placeholder="请输入管理员帐号" v-model="deptData.deptAdmin" :disabled="isShowDeptEdit" class="w200"></el-input>
        </div>
        <div class="form-item">
          <span class="input-t">部门类型:</span>
          <el-select v-model="deptData.deptType" :disabled="isShowDeptEdit" placeholder="请选择部门类型" class="w200">
            <el-option v-for="item in lists" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="form-btn">
          <el-button type="primary" @click="addDept" v-if="!isShowDeptEdit">添加</el-button>
          <el-button type="primary" @click="updateDept()" v-if="isShowDeptEdit">保存</el-button>
        </div>

      </popupBody>
    </transition>

  </div>
</template>

<style scoped lang="sass">
.popup-hide {
  position: absolute;
  top: 10px;
  right: 20px;
}

.tree-box {
  border: none;
  background: #f2f5f8;
  max-height: 83%;
  overflow-y: scroll;
  margin-top: 10px;
}

.area-tree {
  margin-left: 20px;
  padding: 10px;
  height: 300px;
}

.big-box {
  display: flex;
  margin-top: 20px;
  min-height: 600px;
  border: 1px solid #ccc;
  padding-right: 20px;
}

.tree-div {
  width: 220px;
  max-height: 650px;
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

.area-name .add-btn {
  background: #ffffff;
  border: 1px solid #c2cad2;
  width: 26px;
  height: 26px;
  color: #a2aab6;
  text-align: center;
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
.re{
  padding-bottom:20px;
  padding-top: 10px;
  position: relative;
}
.reDiv{
  position: absolute;
  bottom: 0;
  color: red;
}
.form-item b {
  color: red;
}
</style>

<script>
  import popupBody from 'components/popup/popupdata';
  import transfer from 'components/transfer/transfer';
  import * as areaApi from 'api/admin/area'
  import * as deptApi from 'api/admin/dept'
  import * as moduleApi from 'api/admin/module'
  import * as roleApi from 'api/admin/role'
  import * as userApi from 'api/admin/user'
  import dataDistinct from 'utils/dataDistinct.js'
  import {phoneValid,userNameValid_user_defined,checkEmail} from 'utils/validate'

  export default {
  mounted() {

    deptApi.getDeptType().then((results) => {
      this.lists = results.data;
    })
    this.initTreeData("");
  },
  methods: {
    initTreeData(areaCode) {
      areaApi.getAreaChildren(areaCode).then((results) => {
        this.treeData = results.data;
      })
    },
    openAreaAdd() {
      this.areaData.areaName = '';
      this.areaData.regionCode = '';
      this.isShowArea = true;
      this.getTobArea("0");
    },
    closeAreaPopup() {
      this.isShowArea = false;
      this.isShowRegionEdit = false;
      this.treeLoad = false;
    },
    loadNode(node, resolve) {
      if(!node.data.areaId){return}
      areaApi.getTobArea({parentId: node.data.areaId}).then(r=>{
        if(r.code == 200){
          resolve(r.data)
        }
      });
    },
    handleNodeClickAdd(data) {
      this.areaData.regionCode = data.areaId;
    },
    handleNodeClick(data) {
      this.regionCode = data.areaId;
    },
    editRegionCode() {
      this.regionCode = this.treeCurrentNodeData.regionCode;
      this.isTobTreeShow = true;
      this.getTobArea("0");
      this.isShowRegionEdit = true;
    },
    getTobArea(parentId) {
      this.treeLoad = true;
      areaApi.getTobArea({parentId: parentId}).then(res => {
        if(res.code == 200) {
          let data = res.data
          if(data[0].areaId == 0) { // "中国"
            data.shift();
          }
          this.searchOpts = data;
        }
        this.treeLoad = false;
      })
    },
    regionSubmit() {
      if(!this.regionCode) {
        this.$message.warning("请输入当前区域对应的溯源系统编码");
        return;
      }
      let params = {
        areaCode: this.treeCurrentNodeData.areaCode,
        regionCode: this.regionCode
      }
      areaApi.update(params).then(res => {
        if(res.status) {
          if(this.currentNode) {
            this.currentNode.data.regionCode = params.regionCode
          }
          this.$message.success("编辑成功, regionCode已更新")
        }
      })
      this.isShowRegionEdit = false;
    },
    addEmptyToListFisrt(list) {
      list.unshift({
        isCreate: true
      });
    },
    //关联模块弹窗
    async showModule(currDept) {
      let params = {
        'deptId': currDept.id
      }
      //已关联
      let left, right;
      await moduleApi.listFuncByDeptId(params).then(
        result => {
          right = result.data;
        });
      //未关联
      await moduleApi.listModuleFuncAll().then(result => {
        left = result.data;
      });
      dataDistinct.call(this, left, right, 'transferData_left', 'transferData_right');
      this.selectDeptId = currDept.id;
      this.isShowModule = true;
    },
    //穿梭搜索
    search1Click() {
      let params = {
        'deptId': this.selectDeptId,
        'name': this.search1
      }
      moduleApi.listFuncByDeptId(params).then(
        result => {
          this.transferData_right = result.data;
          dataDistinct.call(this, this.transferData_left, this.transferData_right, 'transferData_left', 'transferData_right');
        });
    },
    search2Click() {
      let params = {
        'name': this.search2
      }
      moduleApi.listModuleFuncAll(params).then(
        result => {
          this.transferData_left = result.data;
          dataDistinct.call(this, this.transferData_left, this.transferData_right, 'transferData_left', 'transferData_right');
        });
    },
    //部门关联功能 功能池
    addDeptModule() {
      let moduleFuncList = [];
      this.transferData_right.forEach(data => {
        data.children.forEach(child => {
          moduleFuncList.push(child.id);
        })
      });
      let params = {
        moduleFuncList: moduleFuncList,
        deptId: this.selectDeptId
      };

      deptApi.addDeptModuleFunc(params).then(result => {
        if (result.status) {
          this.isShowModule = false;

          this.$message({
            message: '关联功能成功',
            type: 'success'
          });
        }
      });
    },
    //关联部门预置角色弹窗
    async showRoleCustom(currDept) {
      let params = {
        'deptId': currDept.id,
        'codeLevel': this.treeCurrentNodeData.codeLevel
      }
      let left, right;
      //已关联
      await roleApi.listRoleCustomByDeptId(params).then(result => {
        result.data.forEach(data => {
          data.children = [];
        });
        right = result.data;
      });
      //未关联
      let paramsNo = {
        'codeLevel': this.treeCurrentNodeData.codeLevel
      }
      await roleApi.listRoleCustomByDeptId(paramsNo).then(result => {
        result.data.forEach(data => {
          data.children = [];
        });
        left = result.data;
      });
      dataDistinct.call(this, left, right, 'role_left', 'role_right');

      this.selectDeptId = currDept.id;

      this.isShowRoleCustom = true;
    },

    //穿梭搜索
    roledSearchClick() {
      let params = {
        'deptId': this.selectDeptId,
        'name': this.roledSearch,
        'codeLevel': this.treeCurrentNodeData.codeLevel
      }
      roleApi.listRoleCustomByDeptId(params).then(result => {
        result.data.forEach(data => {
          data.children = [];
        });
        this.role_right = result.data;
        dataDistinct.call(this, this.role_left, this.role_right, 'transferData_left', 'transferData_right');
      });
    },
    unRoledSearchClick() {
      let params = {
        'name': this.unRoledSearch,
        'codeLevel': this.treeCurrentNodeData.codeLevel
      }
      roleApi.listRoleCustomByDeptId(params).then(result => {
        result.data.forEach(data => {
          data.children = [];
        });
        this.role_left = result.data;
        dataDistinct.call(this, this.role_left, this.role_right, 'transferData_left', 'transferData_right');
      });
    },

    //部门预置角色关联 提交
    addDeptRoleCustom() {
      let roleCustomList = [];

      this.role_right.forEach(data => {

        let roleCustom = {
          id: data.id,
          name: data.text
        }
        roleCustomList.push(roleCustom);
      });

      let params = {
        roleCustomList: roleCustomList,
        deptId: this.selectDeptId
      };
      roleApi.addDeptRoleCustom(params).then(result => {
        if (result.status) {
          this.isShowRoleCustom = false;

          this.$message({
            message: '角色关联功能成功.',
            type: 'success'
          });
        }
      }
      )
    },

    liClick(e) {   //点击导航切换样式
      var me = this;
      if (me.defaultIndex == e.target.dataset.index) {
        return;
      }
      me.defaultIndex = e.target.dataset.index;
      this.searchUserName = '';
      this.tableSearch();
    },

    handleIconClick() {	//搜索框按钮点击搜索
      this.a = !this.a
    },

    tableExpand(row, expanded) {
      //占时弃用该方式获取数据ser
      //        if (expanded){
      //          this.getUserByDept(row);
      //        }
    },

    treeExpandEvent(data, node, component) {
      // 若有子节点，则不再请求，避免重复渲染节点
      if (data.children.length > 0) {
        return;
      }
      areaApi.getAreaChildren(data.areaCode).then((result) => {
        data.children = result.data;
      })

    },
    async getUserByDept(num = 1) {

      let params = {
        params: {
          deptId: this.tableData[0].id == undefined ? '' : this.tableData[0].id,
          userName: this.searchUserName
        },
        size: this.page.pageSize,
        num: num
      };

      let res = await userApi.getPage(params);
      this.page.total = res.data.total;
      let list = res.data.list;
      this.userTableData = list;
    },
    //部门查询
    async tableSearch(num = 1) {
      this.isDeptEdit = false;
      let params = {
        areaCode: this.treeCurrentNodeData.areaCode,
        deptType: this.lists[this.defaultIndex].key
      }
      let res = await areaApi.getDeptPage({
        params: params,
        num: num,
        size: this.page.pageSize
      });
      //        this.page = res.data;
      if (res.data && res.data.total > 0) {
        this.isDeptCreate = false;
        this.tableData = res.data.list;
      } else {
        this.isDeptCreate = true;
        this.tableData = [{}];
      }
      this.getUserByDept();
    },
    treeCurrentChange(data, node) {
      this.currentNode = node;
      this.treeCurrentNodeData = data;
      this.searchUserName = '';
      this.tableSearch();
      this.areaData.parentCode = data.areaCode;
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.getUserByDept(num);
    },
    pageSizeChange(a) {
      this.page.pageSize = a;
      this.getUserByDept();
    },
    addArea() {
      if(!this.areaData.areaName) {
        this.$message.warning("请输入区域名称");
        return;
      }
      if(!this.areaData.regionCode) {
        this.$message.warning("请选择regionCode");
        return;
      }
      let parentCode = this.areaData.parentCode;
      areaApi.addArea(this.areaData).then((result) => {
        if (result || result.status) {
          this.$message({
            message: '添加区域成功！',
            type: 'success'
          });
          //              this.getAreaByParentCodeOnBindNode(parentCode);
          areaApi.getAreaChildren(this.treeCurrentNodeData.areaCode).then((result) => {
            // this.treeCurrentNodeData.children = result.data;
            if (!this.treeCurrentNodeData.children) {
              this.$set(this.treeCurrentNodeData.children, 'children', []);
            }
            const newChild = result.data[result.data.length - 1];
            this.treeCurrentNodeData.children.push(newChild);
          })
          this.areaData.areaName = '';
          this.areaData.regionCode = '';
          this.isShowArea = false;
        }
      }
      )
    },
    //获取数据绑定到Node上
    getAreaByParentCodeOnBindNode(parentCode) {
      //        let changeNode = this.getAreaNodeByCode(parentCode);
      //        this.$children[0].load(changeNode);
      //        this.$store.dispatch("admin/area/getChildren", parentCode).then((result)=>{
      //        });
    },
    getAreaNodeByCode(areaCode, treeData = this.treeData) {
      let childNodes = treeData.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        let child = childNodes[i]
        if (child.data.areaCode == areaCode) {
          return child;
        }
        if (child.childNodes.length > 0) {
          return this.getAreaNodeByCode(areaCode, child);
        }
      }
    },
    //添加部门
    addDept() {
      //获取部门信息
      let deptData = this.tableData[0];
      if (deptData.deptName && deptData.deptName.length <= 50) {
        this.deptNameIsNull = false
      } else {
        this.deptNameIsNull = true
      }
      if ( deptData.deptAdmin) {
        this.deptAdminIsNull = false
      } else {
        this.deptAdminIsNull = true
      }
      if (deptData.address && deptData.address.length <= 50) {
        this.addressIsNull = false
      } else {
        this.addressIsNull = true
      }
      if (deptData.persoName && deptData.persoName.length > 50) {
        this.isPersoName = true
      } else {
        this.isPersoName = false
      }
      if (deptData.simpleName && deptData.simpleName.length > 50) {
        this.isSimpleName = true
      } else {
        this.isSimpleName = false
      }
      if(this.areaData.parentCode.length === 6) {
        if (!deptData.issuingOrgan) {
          deptData.issuingOrgan = deptData.deptName;
        }
      }
      if (this.deptNameIsNull || this.deptAdminIsNull || this.addressIsNull || this.isPersoName || this.isSimpleName) {
        return false
      }

      let valid = deptData.telNum;
      if (valid && valid.trim() != "") {
        valid=valid.trim();
        if (!(/^[0-9][0-9\-]{4,17}$/.test(valid))) {
          this.$message({
            message: '联系方式格式错误，仅限4-17位数字或中横线！',

            type: 'warning'
          });
          return;
        }
      }
      //设置区域信息.
      deptData.areaCode = this.treeCurrentNodeData.areaCode;
      //设置类型信息
      deptData.deptType = this.lists[this.defaultIndex].key;
      deptApi.addDept(deptData).then((result) => {
        if (result.status) {
          this.$message({
            message: '添加部门成功',
            type: 'success'
          });
          this.tableSearch();
        }else{
          this.$message({
            message: result.message,
            type: 'error'
          });
        }
      });
    },
    //编辑部门
    updateDept(deptData = this.tableData[0], msg = '修改部门成功') { //默认是第一个

      if (deptData.deptName && deptData.deptName.length > 50) {
        this.$message({
            message: '部门名称不能超过50字!',
            type: 'warning'
          })
        return
      }
      if (deptData.address && deptData.address.length > 50) {
        this.$message({
            message: '地址不能超过50字!',
            type: 'warning'
          })
        return
      }
      if (deptData.persoName && deptData.persoName.length > 50) {
        this.$message({
            message: '全称内容不能超过50字!',
            type: 'warning'
          })
        return
      }
      if (deptData.simpleName && deptData.simpleName.length > 50) {
        this.$message({
            message: '简称内容不能超过50字!',
            type: 'warning'
          })
        return
      }
      if(this.areaData.parentCode.length === 6) {
        if (!deptData.issuingOrgan) {
          deptData.issuingOrgan = deptData.deptName;
        }
      }

      let valid = deptData.telNum;
      if (valid && valid.trim() != "") {
        valid=valid.trim();
        if (!(/^[0-9][0-9\-]{4,17}$/.test(valid))) {
          this.$message({
            message: '联系方式格式错误，仅限4-17位数字或中横线！',
            type: 'warning'
          });
          return;
        }
      }
      deptApi.updateDept(deptData).then((result) => {
        if (result || result.status) {
          this.$message({
            message: msg,
            type: 'success'
          });
          this.tableSearch();
        }
      });
    },
    addUser(userData = this.userData) {
      if (this.tableData.length != 1) {
        this.$message({
          message: '当前区域没有部门',
          type: 'warning'
        });
        return;
      }
      let valid = userData.phoneNumber;
      if (valid && valid.trim() != "") {
        let flag=false;
        phoneValid(null,valid,(iferr)=>{
          if(iferr!=null && Object.getPrototypeOf(iferr)===Error.prototype){
            this.$message({
              message: '请输入正确的手机号码!',
              type: 'warning'
            });
            flag=true;
          }
        })
        if(flag){
          return;
        }
      }
      valid = userData.userName;
      if (!valid || valid.trim() == "") {
        this.$message({
          message: '用户名不能为空!',
          type: 'warning'
        });
        return;
      }
      let flag=false;
      userNameValid_user_defined(/^[a-zA-Z][a-zA-Z0-9]{5,16}$/,valid,(iferr)=>{
          if(iferr!=null && Object.getPrototypeOf(iferr)===Error.prototype){
            this.$message({
              message: '用户名只能以字母开头,长度为6-16位!',
              type: 'warning'
            });
            flag=true;
          }
      })
      if(flag){
          return;
      }
      valid = userData.realName;
      if (!valid || valid.trim() == "") {
        this.$message({
          message: '真实姓名不能为空!',
          type: 'warning'
        });
        return;
      }

      valid = userData.email;
      if (valid && valid.trim() != "") {
        flag=false;
        checkEmail(null,valid,(iferr)=>{
              if(iferr!=null && Object.getPrototypeOf(iferr)===Error.prototype){
                this.$message({
                  message: '请输入正确的邮箱地址!',
                  type: 'warning'
                });
                flag=true;
              }
        })
        if(flag){
            return;
        }
      }


      userData.deptId = this.tableData[0].id;
      userApi.addUser(userData).then((result) => {
        if (result || result.status) {
          this.$message({
            message: '添加用户成功',
            type: 'success'
          });
          this.getUserByDept();
        }
      });
    },
    updateUser(userData = this.userData, msg = '修改用户成功') {
      if (msg == '修改用户成功') {
        let valid = userData.phoneNumber;
        if (valid && valid.trim() != "") {
         let flag=false;
        phoneValid(null,valid,(iferr)=>{
          if(iferr!=null && Object.getPrototypeOf(iferr)===Error.prototype){
            this.$message({
              message: '请输入正确的手机号码!',
              type: 'warning'
            });
            flag=true;
            userData.isEdit = true;
          }
        })
        if(flag){
          return;
        }

        }

        valid = userData.realName;
        if (!valid || valid.trim() == "") {
          this.$message({
            message: '真实姓名不能为空!',
            type: 'warning'
          });
          userData.isEdit = true;
          return;
        }

        valid = userData.email;
        if (valid && valid.trim() != "") {
          flag=false;
          checkEmail(null,valid,(iferr)=>{
                if(iferr!=null && Object.getPrototypeOf(iferr)===Error.prototype){
                  this.$message({
                    message: '请输入正确的邮箱地址!',
                    type: 'warning'
                  });
                  flag=true;
                }
          })
          if(flag){
              return;
          }
        }
      }
      userApi.updateUser(userData).then((result) => {
        if (result || result.status) {
          this.$message({
            message: msg,
            type: 'success'
          });
          this.getUserByDept();
        }
      });
    },
    enableDept(deptData) {
      deptData.enable = "YES";
      this.updateDept(deptData, "启用部门成功");
    },
    disabledDept(deptData) {
      deptData.enable = "NO";
      this.updateDept(deptData, '禁用部门成功');
    },
    enableUser(userData) {
      userData.enable = "YES";
      this.updateUser(userData, '启用用户成功');
    },
    disabledUser(userData) {
      userData.enable = "NO";
      this.updateUser(userData, '禁用用户成功');
    },
    resetPassword(userId) {
      userApi.resetPassword(userId).then((result) => {
        if (result || result.status) {
          this.$message({
            message: '重置密码成功',
            type: 'success'
          });
          this.isShowUser = false;
          this.userData = {};
          this.tableSearch();
        }
      });
    }
  },
  components: {
    popupBody,
    transfer
  },
  data() {
    return {
      regionCode: "",
      searchOpts: [],
      isTobTreeShow: false,
      treeLoad: false,
      currentNode: null,

      deptNameIsNull: false,
      deptAdminIsNull: false,
      addressIsNull: false,
      isPersoName: false,
      isSimpleName: false,
      treeData: [],
      treeProps: {
        label: 'areaName',
        disabled: true,
        children: 'children'
      },
      tobTreeProps: {
        label: 'areaName',
        value: 'areaId',
        children: 'children'
      },
      //当前选中节点的区域
      treeCurrentNodeData: {},
      currentDept: {},
      a: false,
      lists: [],
      currentTabIndex: 0,
      toSubmit: 27,
      defaultIndex: 0,		//控制tab导航样式
      value: '',
      page: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },

      //表格数据

      //部门
      tableData: [{}],

      //用户
      userTableData: [],
      //弹出层控制
      isShowArea: false,
      isShowDept: false,
      isShowDeptEdit: false,
      isShowUser: false,
      isShowUserEdit: false,
      isShowModule: false,
      isShowRoleCustom: false,
      isShowRegionEdit: false,

      //是否是编辑或者创建
      isDeptCreate: true,
      isDeptEdit: false,
      isUserEdit: false,
      isUserCreate: false,
      selectDeptId: '',   //操作行部门id

      areaData: {
        areaName: '',
        parentCode: '',
        regionCode: ''
      },
      deptData: {
        deptName: '',
        deptType: '',
        address: '',
        issuingOrgan: '',
        telNum: '',
        areaCode: ''
      },
      userData: {},
      searchUserName: '',
      currentPageNum: 0,
      currentPageSize: 10,

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

      roledSearch: "",
      unRoledSearch: "",
      role_left: [],
      role_right: [],
      roleCallBack: function () {
        console.log(this.role_left);
        console.log(this.role_right);
      },

    };
  }
}
</script>
