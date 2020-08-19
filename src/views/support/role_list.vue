<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>角色设置</span>
    </div>
    <ul v-if="area.codeLevel == 3" class="tab-box">
      <li style="cursor: pointer;" @click="liClick('SELF', $event);" :data-index='0' :class="0 == defaultIndex? 'li-bott':''">
        <span :data-index='0'>{{area.areaName}}</span>
      </li>
      <li style="cursor: pointer;" @click="liClick('LOWER', $event);" :data-index='1' :class="1 == defaultIndex? 'li-bott':''">
        <span :data-index='1'>下属食药所</span>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="big-box">
      <div style="width: 100%;">
        <div class="ipt-btn-box">
          <div>
            <el-input placeholder="请输入角色名称" v-model="page.keyword" class="w200 seekIpt">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>
          </div>
          <div>
            <el-button type="primary" v-auth="'organize.role|func.add'" @click="goAdd(user.deptId);">
              <i class="el-icon-plus el-icon--left"></i>添加角色
            </el-button>

          </div>
        </div>

        <!--列表-->
        <el-table :data="roleTableData" class="table-div">

          <el-table-column type="index" :width="120" label="序号"></el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column prop="intro" label="角色简介"></el-table-column>
          <el-table-column show-overflow-tooltip prop="funcName" label="角色权限"></el-table-column>
          <el-table-column prop="enableLabel" label="状态"></el-table-column>
          <el-table-column prop="source" label="来源"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="goDetail(scope.row);" class="operate-a">详情</a>

              <a v-if="!scope.row.isRoleEdit" v-auth="'organize.role|func.delete'" href="javascript:;" @click="delRole(scope.row);" class="operate-a">删除</a>

              <a href="javascript:;" v-auth="'organize.role|func.edit'" @click="goEdit(scope.row);" class="operate-a">编辑</a>

              <a href="javascript:;" v-auth="'organize.role|func.edit'" class="operate-a" @click="enableToggle(scope.row)">
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
  </div>
</template>

<style scoped lang="sass">
.big-box {
  display: flex;
  margin-top: 20px;
  min-height: 600px;
  padding-right: 20px;
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
</style>

<script>

import { getByAreaCode } from 'api/common';
import * as roleApi from 'api/support/role';

export default {
  async beforeMount() {

    this.user = this.$store.getters.user;
    this.params.page = this.page;
    this.params.deptId = this.user.deptId;

    getByAreaCode(this.user.areaCode).then(
      result => {
        if (result.status) {
          this.area = result.data;
        }
      });

    this.getRoleList(this.params);

  },

  methods: {
    async getRoleList(params) {
      let response = await roleApi.page(params);
      let list = response.data.list;
      this.roleTableData = list;
      this.pagination.total = response.data.total;
    },

    liClick(belong, e) {   //点击导航切换样式
      var me = this;
      me.defaultIndex = e.target.dataset.index;
      this.params.belong = belong;
      this.belong = belong;
      this.getRoleList(this.params);
    },
    handleIconClick() {
      roleApi.page(this.params).then((result) => {
        this.roleTableData = result.data.list;
        this.pagination.total = result.data.total;
      })
    },
    handleSizeChange(val = 10) {
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
    goAdd(deptId) {
      this.$router.push({
        name: "support.roles.curd",
        params: {
          curd: "add",
        },
        query: {
          belong: this.belong,
          deptId: deptId,
        }
      })
    },
    goEdit(role) {
      this.$router.push({
        name: "support.roles.curd", params: {
          curd: "edit",
        },
        query: {
          belong: this.belong,
          id: role.id,
        }
      });
    },
    goDetail(role) {
      this.$router.push({
        name: "support.roles.curd", params: {
          curd: "detail",
        },
        query: {
          belong: this.belong,
          id: role.id,
        }
      });
    },
    delRole(role) {
      this.$confirm('删除某某角色将影响到所有有用该角色的用户，是否确认删除' + role.name + '角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let roleId = role.id;
        roleApi.delRole(roleId).then(result => {
          if (result.status) {

            this.$message({
              message: role.name + '删除成功.',
              type: 'success'
            });
            this.handleSizeChange();
          }
        })
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

      roleApi.updateEnable(id, enable).then(result => {
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
      /* init data */
      user: {},
      area: {
        codeLevel: "",
        areaName: ""
      },
      belong: "SELF",

      defaultIndex: 0,		//控制tab导航样式

      pagination: {
        pageNum: 1,
        pageSize: 10
      },          //前端分页
      page: {
        keyword: "",
        pageNum: 1,
        pageSize: 10
      },              //后端分页
      params: {
        deptId: 0,
        belong: 'SELF'
      },
       roleTableData: [],
    }
  },
}
</script>