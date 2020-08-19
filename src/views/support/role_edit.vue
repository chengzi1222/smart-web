<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>角色{{curdStr}}</span>
      <Back></Back>
    </div>
    <toggle-form title="基本信息">
      <div class="form-box">
        <el-form :model="role" :rules="rules" ref="role" label-width="100px" class="demo-ruleForm">

          <el-form-item label="角色名称:" prop="name">
            <el-input v-if="curd != 'detail'" class="w200 success" v-model="role.name" placeholder="请输入角色名称"></el-input>
            <span v-if="curd == 'detail'" class="w200 success">{{role.name}}</span>
          </el-form-item>
          <el-form-item label="角色简介:" prop="intro">
            <el-input v-if="curd != 'detail'" class="w200 success" type="textarea" v-model="role.intro" placeholder="请输入角色介绍"></el-input>
            <span v-if="curd == 'detail'" class="w200 success" type="textarea">{{role.intro}}</span>
          </el-form-item>

        </el-form>
      </div>
    </toggle-form>

    <toggle-form title="权限配置">
      <div class="form-box" v-if="curd != 'detail'">
        <div class="form-item">
          <check-box @cheackChange="cheackChange" :allData="item.list" :group="item.group" :groupLabel="item.groupLabel" v-for="item in groupList.func" :key="item.group" :checkedList="groupList.funcRole">
          </check-box>
        </div>
      </div>
      <div class="form-box" v-if="curd == 'detail'">
        <div class="form-item">
          <div style="width: 400px;" v-for="item in groupList.funcRole" :key="item.group">
            <div>
              {{item.groupLabel}}：
            </div>
            <div style="margin-left: 50px;">
              <span style="display: inline-block; margin-right: 20px;width:140px;margin-bottom:10px;" v-for="module in item.list" :key="module.id">{{module.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </toggle-form>

    <div class="foot-btn">
      <div>
        <el-button @click="$router.go(-1);">取消</el-button>
        <el-button v-if="curd != 'detail'" type="primary" @click="submitRole();">保存</el-button>
        <el-button v-if="curd == 'detail'" type="primary" @click="goEdit();">编辑</el-button>
      </div>
    </div>

  </div>
</template>



<script>

import Back from 'utils/back.vue'		//返回上一个页面按钮
import ToggleForm from 'components/ToggleForm'  //列表块
import CheckBox from 'components/CheckBox'
import * as roleApi from 'api/support/role';

function getCurdStr(curd) {
  let curdStr = '';
  if (curd === 'add') {
    curdStr = '创建';
  } else if (curd === 'edit') {
    curdStr = '编辑';
  } else if (curd === 'detail') {
    curdStr = '详情';
  }

  return curdStr;
}

export default {
  async mounted() {

    this.user = this.$store.getters.user;

    this.curd = this.$route.params.curd;
    this.curdStr = getCurdStr(this.curd);

    if (this.curd != 'add') {
      this.roleId = this.$route.query.id;
      await roleApi.getRoleById(this.roleId).then(result => {
        this.role = result.data;
      });
    } else {
      this.deptId = this.$route.query.deptId;
    }

    this.belong = this.$route.query.belong;

    roleApi.listFuncByRoleIdGroup(this.roleId, this.user.deptId).then(result => {
      this.groupList = result.data;
    });

  },
  methods: {
    goEdit() {
      this.$router.push({
        path: "/support/roles/edit",
        query: {
          belong: this.belong,
          id: this.roleId,
        }
      });
    },

    //当点击选框时改变选中值
    cheackChange(val) {
      let tag = true;
      this.checkedList.forEach((item) => {
        if (item.group === val.group) {
          item.list = val.list;
          tag = false;
        }
      })
      if (tag) {
        this.checkedList.push(val);
      }
    },

    submitRole() {
      this.$refs.role.validate(function (result) {
        if (result) {
          this.moduleFuncList = []
          this.checkedList.forEach((item) => {

            item.list.forEach(ids => {
              this.moduleFuncList.push(ids.id);
            })
          })
          console.log(this.checkedList)

          if (this.moduleFuncList.length <= 0) {
            this.$message({
              message: "请勾选至少一个权限.",
              type: 'error'
            });

            return false;
          }

          this.params.role = this.role;

          this.params.role.belong = this.belong;
          this.params.moduleFuncList = this.moduleFuncList;
          let message = '';
          if (this.curd === 'add') {
            this.params.role.deptId = this.deptId;
            message = '添加角色成功!';
          } else if (this.curd === 'edit') {
            this.params.role.id = this.roleId;
            message = '编辑角色成功!';
          }


          roleApi.updateRole(this.params).then((result) => {
            if (result.status) {

              this.$message({
                message: message,
                type: 'success'
              });
              this.$router.go(-1);
            } else {
              this.$message({
                message: result.message,
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
    }

  },
  data() {
    return {
      //params
      curd: "",
      curdStr: "",
      roleId: "",
      deptId: "",

      role: {},

      //checkbox
      checkedData: [],
      groupList: {},
      group: [],
      //选中的值
      checkedList: [],
      moduleFuncList: [],

      params: {},

      //校验
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  components: {
    Back, ToggleForm, CheckBox
  }
}
</script>

<style scoped lang="sass">
.user-box {
  margin-bottom: 250px;
  position: relative;
}

.form-box {
  width: 460px;
  margin: 0 auto 40px;
  overflow: hidden;
}
</style>
