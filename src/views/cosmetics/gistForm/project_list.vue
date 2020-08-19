<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{$route.query.name}}</span>
      <i @click="goBack" class="icon iconfont icon-back" style="cursor: pointer;
                display: inline-block;
                color: rgb(96, 105, 121);
                height: 22px;
                width: 22px;
                line-height: 22px;">
      </i>
    </div>
    <div class="ipt-btn-box">
      <div>
        <el-input placeholder="请输入巡查项目名称"  v-model="projectName" class="w250 seekIpt" @keyup.enter.native="handleIconClick">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>
      </div>
      <div>
        <el-button class="selectHeight" type="primary" @click="showAdd">添加巡查项</el-button>
      </div>

      <!--添加弹窗-->
      <transition name="dialog-fade">
        <popupBody class="popup-body" v-if="isShow">
          <!-- 功能模块添加到这一区域 -->
          <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close"
             @click="isShow = false; isAdd = false; isEdit = false;"></i>

          <el-form :model="patrolProject" :rules="rules" ref="patrolProject"
                   label-width="100px"
                   class="demo-ruleForm">

            <el-form-item label="巡查项目:" prop="name">
              <el-input placeholder="请输入巡查项目" v-model="patrolProject.name" :maxlength="50" class="w200"></el-input>
            </el-form-item>

            <el-form-item label="编号:" prop="no">
              <el-input placeholder="请输入编号" v-model="patrolProject.no" @keyup.enter.native="onlyNum" class="w200"></el-input>
              <span style="color: #bbbbbb; font-size: 12px;"v-if="this.showMaxNo === true ">当前最大编号为{{maxNo}}, 建议编号{{maxNo + 1}}</span>
              <span style="color: #bbbbbb; font-size: 12px;"v-if="this.showMaxNo === false ">当前最大编号为{{maxNo}}, <span v-if="maxNo >= 100">已达到最大值</span></span>
            </el-form-item>

            <el-form-item label="状态:" prop="enable">
              <el-select v-model="patrolProject.enable" class="w200" :disabled="true">
                <el-option v-for="item in enableList" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

          </el-form>

          <div class="form-btn">
            <el-button @click="hideAdd">取消</el-button>
            <el-button type="primary" :disabled="confirm" @click="addPatrolProject" v-if="FormStatus == 'add'">确定</el-button>
            <el-button type="primary" :disabled="confirm" @click="editPatrolProject" v-if="FormStatus == 'edit'">确定</el-button>
          </div>
        </popupBody>
      </transition>

    </div>
    <el-table :data="tableData" class="table-div" >
      <el-table-column prop="name" label="巡查项目名称"></el-table-column>
      <el-table-column prop="no" label="巡查项编号"></el-table-column>
      <el-table-column prop="scoreTotal" label="项目总分值"></el-table-column>
      <el-table-column prop="enableStr" label="状态">
        <template slot-scope="scope">
          {{scope.row.enable == 'YES' ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="200">
        <template slot-scope="scope">
          <a href="javascript:;" @click="showEdit(scope.row)" class="operate-a">编辑</a>
          <a v-if="scope.row.enable == 'YES'" href="javascript:;" @click="ifEnable(scope.row, 'NO', '禁用');" class="operate-a">禁用</a>
          <a v-else href="javascript:;" @click="ifEnable(scope.row, 'YES', '启用');" class="operate-a">启用</a>
          <a v-if="scope.row.enable == 'NO'" href="javascript:;" @click="deleteProject(scope.row);" class="operate-a">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background :page-sizes="[5,8,10,15,20,25,30]" :page-size="pagination.pageSize" :current-page="pagination.pageNum" :total="pagination.total"
                     layout="total, sizes, prev, pager, next, jumper" @current-change="pageCurrentChange" @size-change="pageSizeChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  import popupBody from 'components/popup/popupdata';
  import transfer from 'components/transfer/transfer';
  import * as plan from 'api/cosmetics/gistForm'

  import {
    getPatrolProjectPage,
    submitPatrolProject,
    deletePatrolProject,
    getPatrolTable,
    getMaxNoProject
  } from "api/medi/patrol/project";

  import {listEnable} from "api/common";

  export default {
    async mounted() {
      this.patrolTableId = this.$route.query.patrolTableId;

      // this.page.pageNum = 0;
      this.page.patrolTableId = this.patrolTableId;

      // getPatrolTable(this.patrolTableId).then((result) => {
      //   if(result && result.status) {
      //     this.patrolTable = result.data;
      //   }
      // })
      this.getList()
    },
    methods: {
      getList(){
        let prams =  {
          patrolTableId: this.$route.query.patrolTableId,
          projectName: this.projectName,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        }
        plan.postProjectGet(prams).then((result) => {
          console.log(0)
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },
      showAdd() {
        this.FormStatus = 'add'
        listEnable().then((results) => {
          this.enableList = results.data;
        })

        plan.postProjectGetMaxNoProject({patrolTableId: this.patrolTableId}).then((result) => {
          let maxNum = result.data;
          if(maxNum == null){
            this.maxNo = 0;
          } else if(maxNum == '100'){
            this.showMaxNo = false;
            this.maxNo = maxNum;
            this.patrolProject.no = "";
          }else{
            this.maxNo = maxNum;
            this.patrolProject.no = this.maxNo + 1;
          }
        });
        this.isShow = true;
        this.isAdd = true;
        this.isEdit = false;
        this.patrolProject = {
          name: "",
          no: "",
          patrolTableId: this.patrolTableId,
          enable: "YES",
        }

      },
      showEdit(projectData) {
        this.FormStatus = 'edit'
        listEnable().then((results) => {
          this.enableList = results.data;
        })
        plan.postProjectGetMaxNoProject({ patrolTableId: this.patrolTableId }).then((result) => {
          let maxNum = result.data;
          if (maxNum == null) {
            this.maxNo = 0;
          } else if (maxNum == '100') {
            this.showMaxNo = false;
            this.maxNo = maxNum;
          } else {
            this.maxNo = maxNum;
          }
        });
        this.isShow = true;
        this.isAdd = false;
        this.isEdit = true;
        let {enable, id, name, patrolTableId,no} = projectData;
        this.patrolProject = {enable, id, name, patrolTableId,no};
        //this.patrolProject.no = projectData.no + "";

      },

      hideAdd() {
        this.isShow = false;
        this.isAdd = false;
        this.isEdit = false;
      },

      ifEnable(projectData, enable, enableStr) {
        this.$confirm('是否确认'+ enableStr + '该巡查项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let {id, name, patrolTableId} = projectData;
          this.patrolProject = {id, name, patrolTableId};
          this.patrolProject.no = projectData.no + "";
          this.patrolProject.enable = enable;

          plan.postProjectIsenable({enable: enable, id: id}).then(result => {
            if (result && result.status) {
              this.$message({
                message: enableStr + '成功',
                type: 'success'
              })
              setTimeout(() => {
                this.getList()
              }, 200);
            } else {
              this.$message({
                message: result.message,
                type: 'error'
              });
            }
          })
        });
      },
      addPatrolProject() {
        this.$refs.patrolProject.validate(function (data) {
          if (data) {
            this.patrolProject.patrolTableId = this.$route.query.patrolTableId;
            this.confirm = true; 
            plan.postProjectAdd(this.patrolProject).then(result => {
              if (result && result.status) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.isShow = false;
                  this.isAdd = false;
                  this.confirm = false; 
                  this.getList()
                }, 200);
              } else {
                this.$message({
                  message: result.message,
                  type: 'error'
                });
                this.confirm = false; 
              }
            })
          }
        }.bind(this))
      },
      editPatrolProject() {
        this.$refs.patrolProject.validate(function (data) {
          if (data) {
            this.patrolProject.patrolTableId = this.$route.query.patrolTableId;
            this.confirm = true; 
            plan.postProjectUpdate(this.patrolProject).then(result => {
              if (result && result.status) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })

                setTimeout(() => {
                  this.isShow = false;
                  this.isAdd = false;
                  this.confirm = false; 
                  this.getList()
                }, 200);
              } else {
                this.$message({
                  message: result.message,
                  type: 'error'
                });
                this.confirm = false; 
              }
            })
          }
        }.bind(this))
      },
      deleteProject(projectData) {
        this.$confirm('删除该巡查项目，则该巡查项目下所有的巡查内容项都会删除，是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          plan.postProjectIseffective({id: projectData.id}).then((result => {
            this.$message({
              message: "删除成功.",
              type: 'success'
            });
            setTimeout(() => {
              this.getList()
            }, 200);
          }))
        });
      },

      handleIconClick() {	//搜索框按钮点击搜索
        this.getList();
      },

      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.pagination.pageNum = num;
        let prams = {
          patrolTableId: this.$route.query.patrolTableId,
          projectName: this.projectName,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        }
        plan.postProjectGet(prams).then((result) => {
          this.tableData = result.data.list;
          console.log(1)
        });
      },
      pageSizeChange(num) {
        this.page.pageSize = num;
        this.pagination.pageSize = num;
        let prams = {
          patrolTableId: this.$route.query.patrolTableId,
          projectName: this.projectName,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
        }
        plan.postProjectGet(prams).then((result) => {
          console.log(2)
          this.tableData = result.data.list;
          this.pagination.pageSize = num;
        });
      },

      goBack(){
        history.back();
      },

      onlyNum(){
        this.patrolProject.no =  this.patrolProject.no.replace(/[^\d+]/g,'');
      },
    },
    components: {
      popupBody,
      transfer
    },
    data() {
      var reg = new RegExp("^(\\d{1,2}|100)$");
      var validateNo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入编号'));
        }else if(value === '0'){
          callback(new Error('请输入100以内的正整数'));
        }else{
          if(!reg.test(value)) {
            callback(new Error('请输入100以内的正整数'));
          }else {
            callback();
          }
        }
      };

      return {
        patrolTableId: "",
        patrolTable: {},

        maxNo: 1,
        showMaxNo: true,

        //添加 编辑弹窗
        isShow: false,
        isAdd: false,
        isEdit: false,

        patrolProject: {
          name: "",
          no: "",
          enable: "YES"
        },
        enableList: [],
        FormStatus: '',

        //校验
        rules: {
          name: [{required: true, message: '请输入巡查项目', trigger: 'blur'}],
          no: [{validator: validateNo, trigger: 'blur'}],
          enable: [{required: true, message: '请选择状态', trigger: 'blur'}],
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
          patrolTableId: "",
          keywords: ""
        },               //后端分页
        projectName:'',
        confirm: false         
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
