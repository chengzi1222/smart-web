<template>

  <div>
    <!-- 过滤配置 -->
    <div class="page-tilt">
      <b></b>
      <span>组织架构</span>
    </div>
    <div class="big-box">
      <div class="tree-div">
        <div class="ipt-div">
          <i class="el-icon-search movePoin"></i>
          <input type="text" placeholder="搜索" v-model="deptTreeSearchModel" style="width:144px" />
        </div>
        <div v-if="isShowTree">
          <el-tree :data="deptTree" :props="deptTreeProps" :node-key="deptTreeKey" :default-expanded-keys="deptTreeExpanded" :highlight-current="true" :expand-on-click-node="false" :render-content="deptTreeRender" @node-expand="deptTreeNodeExpand" @current-change="deptTreeCurrentChange" accordion class="tree-box"></el-tree>
        </div>
        <div class="suggest" v-if="!isShowTree">
          <p v-for="dept,index in deptSearchData" class="suggest-item" :class="index == dsdIndex?'active':''" @click="deptSearchResultClick(index)">
            {{dept.deptName}}
          </p>
        </div>
      </div>
      <div style="width: calc(100% - 241px);">
        <div class="box-tit">
          <span>{{dept.deptName}}</span>
          <button v-if="dept.id != rootId">编辑部门</button>
        </div>
        <p class="content-title">
          <span class="iconfont icon-system"></span>
          <span>人员管理</span>
        </p>
        <div class="ipt-btn-box">

          <div>
            <el-input placeholder="请输入姓名或手机号" v-model="userSearchValue" class="w200 seekIpt" @keyup.enter.native="userSearchClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="userSearchClick"></i>
            </el-input>
          </div>

          <div>

            <span>
              <input type="file" style="display: none" @click="uploadType='USER'" @change="uploadExcelFile" id="userExcelFileInput">

              <el-button @click="clickUploadUserExcel('userExcelFileInput')">批量导入
              </el-button>

            </span>

            <el-button @click="getUserStecilFileByDeptId">下载模板
            </el-button>
            <el-button @click="getUserExcelFileAboutDeptInfo">批量导出
            </el-button>

            <router-link :to="{path:'organize/user/add/'+dept.id}">
              <el-button type="primary" icon="plus">添加用户
              </el-button>
            </router-link>

          </div>
        </div>

        <el-table :data="userTableData" class="table-div">
          <el-table-column type="index" :width="60" label="序号"></el-table-column>
          <el-table-column prop="realName" label="姓名"></el-table-column>
          <el-table-column prop="userNumber" label="胸牌编号"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
          <el-table-column prop="roleNames" label="角色"></el-table-column>
          <el-table-column prop="enable" label="状态">
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

              <router-link :to="{path:'organize/user/edit/'+scope.row.id}">
                <a href="javascript:;" class="operate-a">编辑</a>
              </router-link>

              <a href="javascript:;" class="operate-a" @click="userEnable(scope.row.id,'DELETE')">删除</a>
              <a href="javascript:;" v-if="scope.row.enable == 'YES'" @click="userEnable(scope.row.id,'NO')" class="operate-a">
                禁用
              </a>
              <a href="javascript:;" v-else @click="userEnable(scope.row.id,'YES')" class="operate-a">
                启用
              </a>
              <a href="javascript:;" class="operate-a" @click="resetPwd(scope.row.id)">重置密码</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[10, 20, 30, 40]" :page-size="userPage.pageSize" :total="userPage.total" @size-change="" @current-change="" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <div class="ipt-btn-box">
          <div class="progress-box" v-if="isShowProgress">
            <el-progress type="circle" :percentage="percentage" :status="percentageType"></el-progress>
          </div>
          <div></div>
          <div class="btn-group clearfix">
            <p class="content-title floatL">
              <span class="iconfont icon-system"></span>
              <span>下级部门</span>
            </p>
            <span>
              <input type="file" style="display: none" @click="uploadType='DEPT'" @change="uploadExcelFile" id="deptExcelFileInput">
              <el-button @click="clickUploadUserExcel('deptExcelFileInput')">批量导入
              </el-button>
            </span>

            <el-button @click="getStecilFileByDeptId">下载模板
            </el-button>
            <el-button @click="getDeptExcelFileAboutDeptInfo">批量导出
            </el-button>

            <router-link :to="{path:'dept/add/',query:{id:dept.id}}">
              <el-button type="primary" icon="plus">
                添加部门
              </el-button>
            </router-link>
          </div>
        </div>
        <el-table :data="deptTableData" class="table-div">
          <el-table-column type="index" :width="60" label="序号"></el-table-column>
          <el-table-column prop="deptName" label="部门名称"></el-table-column>
          <el-table-column prop="areaName" label="所属辖区"></el-table-column>
          <el-table-column prop="adminName" label="管理员账户"></el-table-column>
          <el-table-column prop="address" label="地址" :show-overflow-tooltip="true"></el-table-column>
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
              <router-link :to="{path:'dept/edit/',query:{parentDeptId:dept.id,deptId:scope.row.id}}">
                <a href="javascript:;" class="operate-a">编辑</a>
              </router-link>

              <a href="javascript:;" class="operate-a" @click="deptEnable(scope.row.id,'DELETE')">删除</a>
              <!-- 启用禁用隐藏判断 -->
              <span>
                <a href="javascript:;" v-if="scope.row.enable == 'YES'" @click="deptEnable(scope.row.id,'NO')" class="operate-a">
                  禁用
                </a>
                <a href="javascript:;" v-else @click="deptEnable(scope.row.id,'YES')" class="operate-a">
                  启用
                </a>
              </span>

              <a href="javascript:;" class="operate-a" @click="resetPwd(scope.row.adminId)">重置密码</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[5,10,20]" :page-size="deptPage.pageSize" :total="deptPage.total" @size-change="deptPageSizeChange" @current-change="deptPageCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.btn-group {
  width: 100%;
  text-align: right;
}
.content-title {
  height: 34px;
  line-height: 34px;
  font-size: 18px;
  text-align: left;
  color: #393939;
}

.progress-box {
  position: fixed;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}
.progress-box > div {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
}

.suggest {
  background: #fff;
  margin: 10px 10px 0;
  border: 1px solid #cbcbcb;
}

.suggest .suggest-item {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;
}

.suggest .suggest-item:hover {
  background: #0db5ef;
  color: #fff;
}

.suggest .active {
  background: #0db5ef;
  color: #fff;
}

.tree-box {
  border: none;
  background: #f2f5f8;
  height: 82%;
  overflow-y:auto ;
}

.big-box {
  display: flex;
  margin-top: 20px;
  min-height: 600px;
  border: 1px solid #ccc;
  padding-right: 20px;
}

.tree-div {
  min-width: 240px;
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
  z-index: 666;
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
</style>

<script>
import * as organizeApi from 'api/support/organize';
import { downloadFile } from 'api/common';
export default {
  mounted() {
    this.initTreeData()
  },
  methods: {
    initTreeData() {
      organizeApi.getDeptTree().then((results) => {
        this.deptTree = results.data;
        if (this.deptTree.length > 0) {//如果有数据,设置第一个节点默认展开
          this.deptTreeExpanded = [this.deptTree[0].id];
          this.rootId = this.deptTree[0].id;
          //动态设置属性
          let len = this.deptTree[0].children.length;
          len = len == 0 ? '' : len;
          this.$set(this.deptTree[0], 'cnt', len);
          //设置当前部门
          this.dept = this.deptTree[0];
          //调用部门列表搜索方法
          this.deptTableSearch();
          this.userTableSearch();
        }
      })
    },
    deptPageSizeChange(size) {
      this.deptPage.pageSize = size;
      this.deptTableSearch();
    },

    deptPageCurrentChange(num) {
      this.deptTableSearch(num);
    },

    userPageSizeChange(size) {
      this.deptPage.pageSize = size;
      this.userTableSearch();
    },

    userPageCurrentChange(num) {
      this.userTableSearch(num);
    },

    userSearchClick() {
      this.userTableSearch();
    },

    liClick(e) {   //点击导航切换样式
      var me = this;
      me.defaultIndex = e.target.dataset.index;
    },

    //组织结构树的渲染
    deptTreeRender(h, { data }) {
      if (data.children) {
        let len = data.children.length;
        len = len == 0 ? '' : len;
        data.cnt = len;
      }
      return (`<span style="font-size:12px;" >
        <span style="margin-right:5px;">{data.deptName}</span >
        <span>{data.cnt}</span></span>`);
    },

    //组织结构树的事件
    deptTreeNodeExpand(node) {//部门节点展开事件
      node.children = [];
      organizeApi.getDeptTree({ areaCode: node.areaCode }).then((results) => {
        node.children = results.data;
      })
    },

    //部门节点选中事件
    deptTreeCurrentChange(data) {
      if (this.dept.id == data.id) {//如果还是之前的部门.
        return;
      }
      this.dept = data;
      this.userSearchValue = '';
      this.deptTableSearch();
      this.userTableSearch();
      this.userSearchValue = '';
    },

    deptSearchResultClick(index) {
      this.dsdIndex = index;
      if (this.dept.id == this.deptSearchData[index].id) {//如果还是之前的部门.
        return;
      }
      this.dept = this.deptSearchData[index];
      this.userSearchValue = '';
      this.deptTableSearch();
      this.userTableSearch();
    },

    deptTreeSearch(value) {
      if (value.trim() == "") {//如果不为空,那么搜索
        this.isShowTree = true;
        this.dsdIndex = -1;
      } else {
        this.isShowTree = false;
        organizeApi.getDeptTree({ deptName: value }).then(result => {
          this.deptSearchData = result.data;
        });
      }
    },

    deptTableSearch(num = 1) {
      organizeApi.getDeptTable({
        areaCode: this.dept.areaCode,
        num: num,
        size: this.deptPage.pageSize
      }).then((results) => {
        this.deptPage = results.data;
        this.deptTableData = results.data.list;
      });
    },

    userTableSearch(num = 1) {
      organizeApi.getUserTable({
        params: {
          deptId: this.dept.id,
          userName: this.userSearchValue
        },
        num: num,
        size: this.userPage.pageSize
      }).then((results) => {
        this.userPage = results.data;
        this.userTableData = results.data.list;
      });
    },

    userEnable(id, value) {
      let msg = '';
      if (value == 'YES') {
        msg = '启用';
      } else if (value == 'NO') {
        msg = '禁用';
      } else if (value == 'DELETE') {
        msg = '删除';
      }
      this.$confirm('是否要' + msg + '该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizeApi.updateUser({
          id: id,
          enable: value
        }).then((result) => {
          this.$message({
            message: "用户" + msg + "成功!",
            type: 'success'
          });
          this.userTableSearch();
        }).catch(() => {

        });
      });
    },

    deptEnable(id, value) {
      let msg = '';
      if (value == 'YES') {
        msg = '启用';
      } else if (value == 'NO') {
        msg = '禁用';
      } else if (value == 'DELETE') {
        msg = '删除';
      }
      this.$confirm('是否要' + msg + '该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizeApi.updateDept({ id: id, enable: value }).then((result) => {
          console.dir(result)
          debugger
          if(result.status){
            this.$message({
              message: "部门" + msg + "成功!",
              type: 'success'
            });
          }

          this.deptTableSearch();
          if (value == "DELETE") {
            organizeApi.getDeptTree({ areaCode: this.dept.areaCode }).then((results) => {
              this.dept.children = results.data;
            })
          }
        }).catch(() => { });
      });
    },

    resetPwd(id) {
      this.$confirm('是否要重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizeApi.restPwd(id).then((result) => {
          this.$message({ message: "重置密码成功!", type: 'success' });
        });
      });
    },
    getUserExcelFileAboutDeptInfo() {
      organizeApi.getExcelFileAboutDeptInfo({ deptId: this.dept.id, type: 'USER' }).then((result) => {
        downloadFile(result.data, '人员导出');
      })
    },
    getUserStecilFileByDeptId() {
      organizeApi.getUserStecilFileByDeptId().then((result) => {
        downloadFile(result.data, '人员导入模版');
      })
    },
    uploadExcelFile(event) {
      this.percentage = 0;
      this.percentageType = "";
      this.$message({
        message: '数据上传中,请稍后!',
        type: 'info'
      });
      var time = new Date().getTime();
      var data = { progerssId: time };
      let me = this;
      var hunder = setInterval(function () {
        organizeApi.getStecilPorcess(data).then((result) => {
          me.percentage = result.data;
        })
      }, 200);
      var formdata = new FormData();
      if (event.target.files[0] == undefined) {
        this.$message({
          message: '请选择上传文件',
          type: 'error'
        });
        me.percentage = 0;
        clearInterval(hunder);
        return;
      }
      formdata.append('file', event.target.files[0]);
      formdata.append('uploadType', this.uploadType);
      formdata.append('deptId', this.dept.id);
      formdata.append('progerssId', time);
      this.isShowProgress = true;
      organizeApi.uploadExcelFile(formdata).then((result) => {
        me.percentage = 0;
        me.isShowProgress = false;
        this.deptTableSearch();
        this.userTableSearch();
        clearInterval(hunder);
        this.percentageType = "success"
        this.initTreeData()
        if (result.status) {
          me.percentage = 100;
          this.$message({
            message: '全部数据导入成功',
            type: 'success'
          });
        } else {
          this.percentageType = "exception";
          this.$alert("处理Excel文件过程中部分数据处理出错,其他数据已成功导入,即将下载出错数据!", '导入数据完毕', {
            confirmButtonText: '确定',
            callback: () => {
              downloadFile(result.message, '导入失败数据');
            }
          });
        }
        document.getElementById("deptExcelFileInput").value = "";
        document.getElementById("userExcelFileInput").value = "";
      }).catch(error => {
        this.deptTableSearch();
        this.userTableSearch();
        me.percentage = 0;
        me.isShowProgress = false;
        clearInterval(hunder);
        document.getElementById("deptExcelFileInput").value = "";
        document.getElementById("userExcelFileInput").value = "";
      })
    },
    getStecilFileByDeptId() {
      organizeApi.getStecilFileByDeptId({ deptId: this.dept.id }).then((result) => {
        downloadFile(result.data, '部门导入模版');
      });
    },
    getDeptExcelFileAboutDeptInfo() {
      organizeApi.getExcelFileAboutDeptInfo({ deptId: this.dept.id, type: 'DEPT' }).then((result) => {
        downloadFile(result.data, '部门导出');
      })
    },
    clickUploadUserExcel(id) {
      document.getElementById(id).click();
    }
  },
  computed: {
    deptTreeSearchModel: {
      set: function (newValue) {
        this.searchValue = newValue;
        this.deptTreeSearch(this.searchValue);
      },
      get: function () {
        return this.searchValue;
      }
    }
  },
  data() {
    return {
      isShowProgress: false,
      uploadType: "DEPT",
      percentage: 0,
      percentageType: "",
      //组织结构的树
      deptTree: [],
      deptTreeProps: {
        label: 'deptName',
        children: 'children'
      },
      deptTreeKey: 'id',
      rootId: '',
      deptTreeExpanded: [],

      //当前的选中的部门
      dept: {},

      //部门树搜索
      searchValue: "",
      deptSearchData: [],
      dsdIndex: -1,//选中的索引

      //显示控制器
      isShowTree: true,

      //分页数据
      deptPage: {
        pageSize: 5,
        total: 0,
        num: 1
      },
      userPage: {
        pageSize: 10,
        total: 0,
        num: 1
      },

      //列表数据
      deptTableData: [],
      userTableData: [],

      //列表搜索框Model
      userSearchValue: '',

      //        deptTreeSearchModel: '',

      a: false,
      lists: [
        { tabName: '食药局体系' },
        { tabName: '政府部门' }
      ],
      toSubmit: 27,
      defaultIndex: 0,		//控制tab导航样式
      options: [{
        value: '选项1',
        label: '黄金糕'
      }]

    }
  }
}
</script>
