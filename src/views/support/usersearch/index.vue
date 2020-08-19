<template>

  <div>
    <!-- 过滤配置 -->
    <div class="page-tilt">
      <b></b>
      <span>人员查询</span>
    </div>
    <div class="big-box">
      <div class="tree-div">
        <div class="ipt-div">
          <i class="el-icon-search movePoin"></i>
          <input type="text" placeholder="搜索" v-model="deptTreeSearchModel" style="width:144px" />
        </div>
        <div v-if="isShowTree">
          <el-tree :data="deptTree" :props="deptTreeProps" :node-key="deptTreeKey" :default-expanded-keys="deptTreeExpanded" :highlight-current="true" :expand-on-click-node="false"  @node-expand="deptTreeNodeExpand" @current-change="deptTreeCurrentChange" accordion class="tree-box"></el-tree>
        </div>
        <div class="suggest" v-if="!isShowTree">
          <p v-for="(dept,index) in deptSearchData" :key="dept.id" class="suggest-item" :class="index == dsdIndex?'active':''" @click="deptSearchResultClick(index)">
            {{dept.deptName}}
          </p>
        </div>
      </div>
      <div style="width: calc(100% - 241px);">
        <div class="box-tit">
          <span>{{dept.deptName}}</span>
        </div>
        <div class="ipt-btn-box">

          <div>
            <el-input placeholder="请输入姓名或手机号" v-model="userSearchValue" class="w200 seekIpt" @keyup.enter.native="userSearchClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="userSearchClick"></i>
            </el-input>
            <el-select v-model="subDeptId" placeholder="请选择直属部门" @change="userSearchClick" clearable class="w150">
              <el-option
                v-for="items in DeptList"
                :key="items.id"
                :label="items.name"
                :value="items.id">
              </el-option>
            </el-select>
            <el-select v-model="postId" placeholder="请选择职务" @change="userSearchClick" clearable class="w150">
              <el-option
                v-for="items in PostList"
                :key="items.id"
                :label="items.name"
                :value="items.id">
              </el-option>
            </el-select>
          </div>

          <div>

            <span v-auth="'organize.query|func.import'" >
              <el-upload style="float:left; margin-right:5px;" action="/api/upload" :data="{type: 'IMPORT'}" :show-file-list="false" :on-error="uploadError" :before-upload="beforeUpload" :on-success="uploadSuccess" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                <el-button>批量导入</el-button>
              </el-upload>
            </span>
            <span v-auth="'organize.query|func.import'">
              <el-button @click="getUserStecilFileByDeptId">下载模板</el-button>
            </span>
            <span v-auth="'organize.query|func.export'">
              <el-button @click="getUserExcelFileAboutDeptInfo">批量导出</el-button>
            </span>
            <router-link v-auth="'organize.query|func.add'" :to="{name:'support.userquery.add',query:{deptId:dept.id}}">
              <el-button type="primary" icon="plus">添加用户
              </el-button>
            </router-link>

          </div>
        </div>

        <el-table :data="userTableData" class="table-div">
          <el-table-column type="index" :width="60" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="realName" label="姓名"></el-table-column>
          <el-table-column show-overflow-tooltip prop="subDeptName" label="直属部门"></el-table-column>
          <el-table-column show-overflow-tooltip prop="postName" label="职务"></el-table-column>
          <el-table-column show-overflow-tooltip prop="userNumber" label="胸牌编号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="phoneNumber" label="手机号码"></el-table-column>
          <el-table-column show-overflow-tooltip prop="roleNames" label="角色">

          </el-table-column>
          <el-table-column show-overflow-tooltip prop="enable" label="状态">
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

              <router-link  v-auth="'organize.query|func.edit'" :to="{name:'support.userquery.edit', query:{id:scope.row.id}}">
                <a href="javascript:;" class="operate-a">编辑</a>
              </router-link>

              <a href="javascript:;" v-auth="'organize.query|func.delete'" class="operate-a" @click="userEnable(scope.row.id,'DELETE')">删除</a>
              <a href="javascript:;" v-auth="'organize.query|func.edit'" v-if="scope.row.enable == 'YES'" @click="userEnable(scope.row.id,'NO')" class="operate-a">
                禁用
              </a>
              <a href="javascript:;" v-auth="'organize.query|func.edit'" v-else @click="userEnable(scope.row.id,'YES')" class="operate-a">
                启用
              </a>
              <a href="javascript:;" v-auth="'organize.query|func.edit'" class="operate-a" @click="resetPwd(scope.row.id)">重置密码</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[8,10,20,30,50]" :page-size="userPage.pageSize" :total="userPage.total" @size-change="userPageSizeChange" @current-change="userPageCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import * as organizeApi from 'api/support/organize';
import { downloadFile } from 'api/common';

export default {
  mounted() {
    this.initTreeData();
    this.getDeptList();
    this.getPostList();
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
          this.userTableSearch();
        }
      })
    },

    userPageSizeChange(size) {
      this.userPage.pageSize = size;
      this.userTableSearch();
    },

    userPageCurrentChange(num) {
      this.userTableSearch(num);
    },

    userSearchClick() {
      this.userTableSearch();
    },

    //组织结构树的渲染
    // deptTreeRender(h, { data }) {
    //   if (data.children) {
    //     let len = data.children.length;
    //     len = len == 0 ? '' : len;
    //     data.cnt = len;
    //   }
    //   return ('<span style="font-size:12px;">'+
    //     '<span style="margin-right:5px;">{data.deptName}</span>'+
    //     '<span>{data.cnt}</span></span>');
    // },

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
      this.userTableSearch();
    },

    deptSearchResultClick(index) {
      this.dsdIndex = index;
      if (this.dept.id == this.deptSearchData[index].id) {//如果还是之前的部门.
        return;
      }
      this.dept = this.deptSearchData[index];
      this.userSearchValue = '';
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

    userTableSearch(num = 1) {
      const params = {
        deptId: this.dept.id,
        mixSearch: this.userSearchValue,
        subDeptId: this.subDeptId,
        postId: this.postId
      }
      const page = {
        pageNum: num,
        pageSize: this.userPage.pageSize
      }
      organizeApi.getUserTable(params, page).then((results) => {
        this.userPage.total = results.data.total;
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
        organizeApi.updateUser({ id: id, enable: value }).then((result) => {
          this.$message({ message: "用户" + msg + "成功!", type: 'success' });
          this.userTableSearch();
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
    beforeUpload(file) {
      this.$message({ message: '数据上传中,请稍后!', type: 'info' });
    },
    uploadSuccess(response, file, fileList) {
      this.$message({ message: '数据导入中,请勿关闭此页面', type: 'info' });
      if (response.status) {
        const data = response.data;
        this.uploadExcelFile(data.id)
      } else {
        this.$message({ message: response.message, type: response.level });
      }
    },
    uploadError(err, file, fileList) {  // 此方法应该没有用 因为后台返回的都是200

    },
    uploadExcelFile(id) {
      this.percentage = 0;
      this.percentageType = "";
      const $this = this;
      const hunder = setInterval(() => {
        organizeApi.getStecilPorcess(id).then((result) => {
          if (result.status && result.data) {
            $this.percentage = parseFloat(result.data);
          }
        })
      }, 1000);
      this.isShowProgress = true;
      const params = {
        importType: 'USER',
        id: id,
        areaCode: this.dept.areaCode,
      }
      organizeApi.uploadExcelFile(params).then((result) => {
        this.percentage = 0;
        this.isShowProgress = false;
        this.userTableSearch();
        clearInterval(hunder);
        if (result.status) {
          this.percentageType = "success"
          this.percentage = 100;
          this.$message({
            message: `共导入${result.data.total}条, 导入成功${result.data.total - result.data.failure}条, 导入失败${result.data.failure}条`,
            type: 'success'
          });
        } else {
          if (result.data) {
            this.percentageType = "exception";
            this.$alert('共导入' + result.data.total + '条, 导入成功' + (result.data.total - result.data.failure)
              + '条, 导入失败' + result.data.failure + '条, 即将下载出错数据!', '导入数据完毕', {
                confirmButtonText: '确定',
                callback: () => {
                  downloadFile(result.data.file, '导入失败数据');
                }
              });
          } else if (result.message) {
            this.$message({ message: result.message, type: result.level });
          }
        }
      });
    },
    getDeptList() {
      organizeApi.getSubDeptList().then((results) => {
        this.DeptList = results.data
      });
    },
    getPostList() {
      organizeApi.getPostList().then((results) => {
        this.PostList = results.data
      });
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
        pageSize: 8,
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
      }],
      subDeptId: '',
      postId: '',
      DeptList: {},
      PostList: {}

    }
  }
}
</script>


<style scoped lang="sass">
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
  overflow-y: auto;
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
