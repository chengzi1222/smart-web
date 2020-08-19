<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{randomTable.name}}</span>
      <i @click="goBack();" class="icon iconfont icon-back" style="cursor: pointer;
          display: inline-block;
          color: rgb(96, 105, 121);
          height: 22px;
          width: 22px;
          line-height: 22px;">
      </i>
    </div>

    <div class="ipt-btn-box">
      <div>
        <el-input placeholder="请输入抽查项目名称" v-model="page.keywords" class="w250 seekIpt" @keyup.enter.native="handleIconClick">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>
      </div>

      <div>
        <el-button class="selectHeight" type="primary" @click="showAdd">添加抽查项
        </el-button>
      </div>

      <!--添加弹窗-->
      <transition name="dialog-fade">
        <popupBody class="popup-body" v-if="isShow">
          <!-- 功能模块添加到这一区域 -->
          <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShow = false; isAdd = false; isEdit = false;"></i>

          <el-form :model="randomProject" :rules="rules" ref="randomProject" label-width="100px" class="demo-ruleForm">

            <el-form-item label="抽查项目:" prop="name">
              <el-input placeholder="请输入抽查项目" v-model="randomProject.name" maxlength="50" class="w200"></el-input>
            </el-form-item>

            <el-form-item label="编号:" prop="no">
              <el-input placeholder="请输入编号" v-model="randomProject.no" @keyup.enter.native="onlyNum" class="w200"></el-input>
              <span style="color: #bbbbbb; font-size: 12px;" v-if="this.showMaxNo === true ">当前最大编号为{{maxNo}}, 建议编号{{maxNo
                + 1}}</span>
              <span style="color: #bbbbbb; font-size: 12px;" v-if="this.showMaxNo === false ">当前最大编号为{{maxNo}}, 已达到最大值</span>
            </el-form-item>

            <el-form-item label="状态:" prop="enable">
              <el-select v-model="randomProject.enable" class="w200">
                <el-option v-for="item in enableList" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>

          <div class="form-btn">
            <el-button @click="hideAdd();">取消</el-button>
            <el-button type="primary" :disabled="disabled" @click="addRandomProject();">确定</el-button>
          </div>
        </popupBody>
      </transition>

    </div>
    <el-table :data="tableData" class="table-div">
      <el-table-column prop="name" label="抽查项目名称"></el-table-column>
      <el-table-column prop="no" label="抽查项编号"></el-table-column>
      <el-table-column prop="projectTotalScore" label="项目总分值"></el-table-column>
      <el-table-column prop="enableStr" label="状态"></el-table-column>

      <el-table-column label="操作" :width="200">
        <template slot-scope="scope">
          <a href="javascript:;" @click="showEdit(scope.row)" class="operate-a">编辑</a>
          <a v-if="scope.row.enable === 'YES'" href="javascript:;" @click="ifEnable(scope.row, 'NO', '禁用');" class="operate-a">禁用</a>
          <a v-else href="javascript:;" @click="ifEnable(scope.row, 'YES', '启用');" class="operate-a">启用</a>
          <a v-if="scope.row.enable === 'NO'" href="javascript:;" @click="deleteProject(scope.row);" class="operate-a">删除</a>

        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background :page-sizes="[5,8,10,15,20,25,30]" :page-size="pagination.pageSize" :current-page="pagination.pageNum"
        :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @current-change="pageCurrentChange" @size-change="pageSizeChange"></el-pagination>
    </div>
  </div>
</template>

<script>
  import popupBody from 'components/popup/popupdata';

  import {
    getRandomProjectPage,
    submitRandomProject,
    deleteRandomProject,
    getRandomTable,
    getMaxNoProject
  } from "api/random/project";

  import { listEnable } from "api/common";

  export default {
    async mounted() {
      this.randomTableId = this.$route.query.randomTableId;

      this.page.pageNum = 1;
      this.page.randomTableId = this.randomTableId;

      getRandomProjectPage(this.page).then((result) => {
        this.tableData = result.data.list;
        this.pagination.total = result.data.total;
      });

      getRandomTable(this.randomTableId).then((result) => {
        if (result && result.status) {
          this.randomTable = result.data;
        }
      })
    },
    methods: {
      showAdd() {
        this.disabled = false;

        listEnable().then((results) => {
          this.enableList = results.data;
        })

        getMaxNoProject(this.randomTableId).then((result) => {
          let maxNum = result.data;
          if (maxNum == null) {
            this.maxNo = 0;
          } else if (maxNum == '100') {
            this.showMaxNo = false;
            this.maxNo = maxNum;
            this.randomProject.no = "";
          } else {
            this.maxNo = maxNum;
            this.randomProject.no = this.maxNo + 1;
          }
        });

        this.isShow = true;
        this.isAdd = true;
        this.isEdit = false;
        this.randomProject = {
          name: "",
          no: "",
          randomTableId: this.randomTableId,
          enable: "YES",
        }
      },

      showEdit(projectData) {
        this.disabled = false;

        listEnable().then((results) => {
          this.enableList = results.data;
        })

        this.isShow = true;
        this.isAdd = false;
        this.isEdit = true;
        let { enable, id, name, randomTableId } = projectData;
        this.randomProject = { enable, id, name, randomTableId };
        this.randomProject.no = projectData.no + "";

      },

      hideAdd() {
        this.isShow = false;
        this.isAdd = false;
        this.isEdit = false;
      },

      ifEnable(projectData, enable, enableStr) {
        this.$confirm('是否确认' + enableStr + '该抽查项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let { id, name, randomTableId } = projectData;
          this.randomProject = { id, name, randomTableId };
          this.randomProject.no = projectData.no + "";
          this.randomProject.enable = enable;

          submitRandomProject(this.randomProject).then(result => {
            if (result && result.status) {
              this.$message({
                message: enableStr + '成功',
                type: 'success'
              })

              getRandomProjectPage(this.page).then((result) => {
                this.tableData = result.data.list;
                this.pagination.total = result.data.total;
              });
            } else {
              this.$message({
                message: result.message,
                type: 'error'
              });
            }
          })
        });
      },

      addRandomProject() {
        this.$refs.randomProject.validate(function (data) {
          if (data) {
            this.disabled = true;
            submitRandomProject(this.randomProject).then(result => {
              if (result && result.status) {
                let handleStr = '添加';
                if (this.isEdit) {
                  handleStr = '编辑'
                }
                this.$message({
                  message: handleStr + '成功',
                  type: 'success'
                })

                setTimeout(() => {
                  getRandomProjectPage(this.page).then((result) => {
                    this.tableData = result.data.list;
                    this.pagination.total = result.data.total;
                  });

                  this.isShow = false;
                  this.isAdd = false;
                }, 2000);

              } else {
                this.$message({
                  message: result.message,
                  type: 'error'
                });
              }
            })
          }
        }.bind(this))
      },

      deleteProject(projectData) {
        this.$confirm('删除该抽查项目，则该抽查项目下所有的抽查内容项都会删除，是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteRandomProject(projectData).then((result => {
            if (result && result.status) {
              this.$message({
                message: "删除成功.",
                type: 'success'
              });
            } else {
              this.$message({
                message: result.message,
                type: 'error'
              });
            }

            getRandomProjectPage(this.page).then((result) => {
              this.tableData = result.data.list;
              this.pagination.total = result.data.total;
            });
          }))
        });
      },

      handleIconClick() {	//搜索框按钮点击搜索
        getRandomProjectPage(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },

      pageCurrentChange(num) {
        this.page.pageNum = num;
        getRandomProjectPage(this.page).then((result) => {
          this.tableData = result.data.list;
        });
      },
      pageSizeChange(num) {
        this.page.pageSize = num;
        getRandomProjectPage(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.pageSize = num;
        });
      },

      goBack() {
        this.$router.push({ name: 'random.library.context', query: { randomTableId: this.randomTableId } });
      },

      onlyNum() {
        this.randomProject.no = this.randomProject.no.replace(/[^\d+]/g, '');
      },
    },
    components: {
      popupBody
    },
    data() {
      var reg = new RegExp("^(\\d{1,2}|100)$");
      var validateNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入编号'));
        } else if (value === '0') {
          callback(new Error('请输入100以内的正整数'));
        } else {
          if (!reg.test(value)) {
            callback(new Error('请输入100以内的正整数'));
          } else {
            callback();
          }
        }
      };

      return {
        disabled: false,

        randomTableId: "",
        randomTable: {},

        maxNo: 1,
        showMaxNo: true,

        //添加 编辑弹窗
        isShow: false,
        isAdd: false,
        isEdit: false,

        randomProject: {
          name: "",
          no: "",
          enable: "YES"
        },
        enableList: [],

        //校验
        rules: {
          name: [{ required: true, message: '请输入抽查项目', trigger: 'blur' }],
          no: [{ validator: validateNo, trigger: 'blur' }],
          enable: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        },

        a: false,
        tableData: [],
        pagination: {
          pageNum: 1,
          pageSize: 10
        },          //前端分页
        page: {
          pageNum: 1,
          pageSize: 10,
          randomTableId: "",
          keywords: ""
        },               //后端分页
      };
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

  /*popup start*/

  .popup-hide {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .dialog-fade-enter-active {
    animation: dialog-fade-in .3s
  }

  .dialog-fade-leave-active {
    animation: dialog-fade-out .3s
  }

  @keyframes dialog-fade-in {
    0% {
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
  }

  @keyframes dialog-fade-out {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
    100% {
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
  }

  /*popup end*/
</style>