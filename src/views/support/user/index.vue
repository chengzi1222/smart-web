<template>

  <div>
    <!-- 过滤配置 -->
    <div class="page-tilt">
      <b></b>
      <span>人员管理</span>
    </div>
    <div>
      <div>
        <div class="ipt-btn-box">
          <div>
            <el-input placeholder="请输入姓名或手机号" v-model="userSearchValue" class="w200 seekIpt"
                      @keyup.enter.native="userSearchClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="userSearchClick"></i>
            </el-input>
            <el-select v-model="subDeptId" placeholder="请选择直属部门" @change="userSearchClick" clearable>
              <el-option
                v-for="items in DeptList"
                :key="items.id"
                :label="items.name"
                :value="items.id">
              </el-option>
            </el-select>
            <el-select v-model="postId" placeholder="请选择职务" @change="userSearchClick" clearable>
              <el-option
                v-for="items in PostList"
                :key="items.id"
                :label="items.name"
                :value="items.id">
              </el-option>
            </el-select>

          </div>
          <div>
            <el-upload v-auth="'organize.user|func.import'" style="float:left; margin-right:5px;" action="/api/upload"
                       :data="{type: 'IMPORT'}" :show-file-list="false" :on-error="uploadError"
                       :before-upload="beforeUpload" :on-success="uploadSuccess"
                       accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
              <el-button>批量导入</el-button>
            </el-upload>

            <el-button v-auth="'organize.user|func.import'" @click="getUserStecilFileByDeptId">下载模板</el-button>
            <el-button v-auth="'organize.user|func.export'" style="margin-left:0px;"
                       @click="getUserExcelFileAboutDeptInfo">批量导出
            </el-button>

            <router-link v-auth="'organize.user|func.add'" :to="{name:'support.users.add', query:{'deptId':deptId}}">
              <el-button type="primary" icon="plus">添加用户</el-button>
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
          <el-table-column show-overflow-tooltip prop="roleNames" label="角色"></el-table-column>
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
              <router-link v-auth="'organize.user|func.edit'"
                           :to="{name:'support.users.edit',query:{'id':scope.row.id}}">
                <a href="javascript:;" class="operate-a">编辑</a>
              </router-link>
              <a v-auth="'organize.user|func.delete'" href="javascript:;" class="operate-a"
                 @click="userEnable(scope.row.id,'DELETE')">删除</a>
              <a v-auth="'organize.user|func.edit'" href="javascript:;" v-if="scope.row.enable == 'YES'"
                 @click="userEnable(scope.row.id,'NO')" class="operate-a">
                禁用
              </a>
              <a v-auth="'organize.user|func.edit'" href="javascript:;" v-else @click="userEnable(scope.row.id,'YES')"
                 class="operate-a">
                启用
              </a>
              <a v-auth="'organize.user|func.edit'" href="javascript:;" class="operate-a"
                 @click="resetPwd(scope.row.id)">重置密码</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[8,10,20,30,50]" :page-size="userPage.pageSize" :total="userPage.total"
                         @size-change="userPageSizeChange" @current-change="userPageCurrentChange"
                         layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
      <div class="progress-box" v-if="isShowProgress">
        <el-progress type="circle" :percentage="percentage" :status="percentageType"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
  import * as organizeApi from 'api/support/organize';
  import {downloadFile} from 'api/common';

  export default {
    mounted() {
      this.userTableSearch();
      this.getDeptList();
      this.getPostList();

    },
    methods: {
      beforeUpload(file) {
        this.$message({message: '数据上传中,请稍后!', type: 'info'});
      },
      uploadSuccess(response, file, fileList) {
        this.$message({message: '数据导入中,请勿关闭此页面', type: 'info'});
        if (response.status) {
          const data = response.data;
          this.uploadExcelFile(data.id)
        } else {
          this.$message({message: response.message, type: response.level});
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
          id: id
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
              this.$message({message: result.message, type: result.level});
            }
          }
        });
      },
      userSearchClick() {
        this.userTableSearch();
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
      userTableSearch(num = 1) {
        const params = {
          deptId: this.deptId,
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
      getDeptList() {
        organizeApi.getSubDeptList().then((results) => {
          this.DeptList = results.data
        });
      },
      getPostList() {
        organizeApi.getPostList().then((results) => {
          this.PostList = results.data
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
          organizeApi.updateUser({id: id, enable: value}).then((result) => {
            this.$message({message: "用户" + msg + "成功!", type: 'success'});
            this.userTableSearch();
          }).catch(() => {
          });
        });
      },
      resetPwd(id) {
        this.$confirm('是否要重置该用户密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          organizeApi.restPwd(id).then((result) => {
            this.$message({message: "重置密码成功!", type: 'success'});
          });
        });
      },
      getUserExcelFileAboutDeptInfo() {
        organizeApi.getExcelFileAboutDeptInfo({deptId: this.deptId, type: 'USER'}).then((result) => {
          downloadFile(result.data, '人员导出');
        })
      },
      getUserStecilFileByDeptId() {
        organizeApi.getUserStecilFileByDeptId().then((result) => {
          downloadFile(result.data, '人员导入模版');
        })
      },
    },
    computed: {
      deptId() {
        return this.$store.getters.user.deptId;
      },
    },

    data() {
      return {
        percentage: 0,
        percentageType: "",
        isShowProgress: false,
        userPage: {
          pageSize: 8,
          total: 0,
          num: 1
        },
        //列表数据
        userTableData: [],
        //列表搜索框Model
        userSearchValue: '',
        subDeptId: '',
        postId: '',
        DeptList: {},
        PostList: {}


      }
    }
  }
</script>

<style scoped lang="sass">
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
</style>
