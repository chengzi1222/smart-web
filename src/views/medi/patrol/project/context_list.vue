<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b><span>{{patrolTable.name}}</span>
      <i @click="goBack();" class="icon iconfont icon-back" style="cursor: pointer;
          display: inline-block;
          color: rgb(96, 105, 121);
          height: 22px;
          width: 22px;
          line-height: 22px;">
      </i>
    </div>
    <div class="floatR" style="margin-bottom:20px;">
      <el-button type="primary" @click="isPatrolTableShow = true;">编辑最少巡查重点项</el-button>
      <el-button type="primary" @click="goProject()">编辑巡查项目</el-button>
      <el-button type="primary" @click="showAdd();" class="selectHeight">添加巡查内容</el-button>

    </div>

    <yb-table :tableData="tableData" :column="column" :editFn="editFn" :statusFn="statusFn" :deleteFn="deleteFn"
              statusField='enable'
              style="clear:both;" listField='children' scoreField="score">
    </yb-table>

    <transition name="dialog-fade">
      <yb-popup :isShow='isShow' @close="hideAdd()" :title="handleStr + '巡查内容'">
        <div slot="body">
          <div style="width:630px;margin:30px auto 0;">
            <el-form :model="patrolContext" :rules="rules" ref="patrolContext" label-width="100px"
                     class="demo-ruleForm">

              <el-form-item label="巡查项目:" prop="" v-if="isAdd">
                <el-select :disabled="manual" v-model="patrolContext.patrolProjectId" placeholder="请选择巡查项目" class="w440"
                           @change="handleChange">
                  <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
                <span class="manual" @click="manualShow()">手动添加</span>
                <p v-if="tag" style="color:#f56c6c;font-size:12px;margin: 0;line-height:0;padding-top: 4px;">请选择</p>

                <div class="manualAdd" v-if="manual">
                  <input type="text" @blur="validate" style="background-color: #fff;" v-model="patrolProject.name"
                         maxlength="50" placeholder="请输入项目名称">
                  <input type="text" @blur="validate" @keyup="numCheck" style="background-color: #fff;" maxlength="3"
                         v-model="patrolProject.no"
                         placeholder="请输入项目编号">
                  <span @click="manualHide()" style="cursor:pointer">X</span>
                </div>
                <p v-if="tag2" style="color:#f56c6c;font-size:12px;margin: 0;line-height:0;padding-top: 10px;">请完整输入</p>
              </el-form-item>

              <el-form-item label="巡查内容:" prop="context">
                <el-input type="textarea" placeholder="请填写巡查内容" class="w440" maxlength="500"
                          v-model="patrolContext.context"></el-input>
              </el-form-item>

              <el-row>
                <el-col :span="10">
                  <el-form-item label="编号:" prop="no">
                    <el-input type="text" placeholder="请输入分类编号" class="w150" maxlength="3" @keyup.native="numberCheck"
                              v-model="patrolContext.no"></el-input>
                  </el-form-item>
                  <span v-if="myShow" style="color: #bbbbbb; font-size: 12px; margin-left: 100px; margin-top: -20px;">当前最大编号为{{maxNo}}, 建议编号{{maxNo+ 1}}</span>
                  <span v-if="myShow1" style="color: #bbbbbb; font-size: 12px; margin-left: 100px; margin-top: -20px;">当前最大编号为{{maxNo}}, 已达到最大值</span>
                </el-col>

                <el-col :span="10">
                  <el-form-item label="分值:" prop="score">
                    <el-select v-model="scoreStr" placeholder="请选择分值" class="w150">
                      <el-option v-for="item in scoreList" :key="item.name" :label="item.name"
                                 :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="10">
                  <el-form-item label="重点项:" prop="important">
                    <el-switch v-model="important" on-text="" off-text="">
                    </el-switch>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label="状态:" prop="enable">
                    <el-select v-model="patrolContext.enable" placeholder="请选择状态" class="w150">
                      <el-option v-for="item in enableList" :key="item.key" :label="item.name"
                                 :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="快捷巡查:" prop="quick">
                <el-input type="textarea" placeholder="可配置巡查时的快速录入项，每次换行为一个录入项" maxlength="500" class="w440"
                          v-model="quick"></el-input>
              </el-form-item>

              <div style="text-align:right">
                <el-form-item>
                  <el-button type="default" @click="hideAdd();">取消</el-button>
                  <el-button type="primary" @click="updateContext();" :disabled="disButton">确定</el-button>
                </el-form-item>
              </div>

            </el-form>
          </div>
        </div>

      </yb-popup>
    </transition>

    <!--添加弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isPatrolTableShow">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isPatrolTableShow = false;"></i>

        <el-form label-width="100px" class="demo-ruleForm">

          <el-form-item label="名称:">
            <span class="w200">{{patrolTable.name}}</span>
          </el-form-item>

          <el-form-item label="最少重点项:">
            <el-input v-model="patrolTable.minImportant" @keyup.native="onlyNum" @change="onlyNum" class="w200"
                      maxlength="5"></el-input>
            <span v-if="errorMinImportant" style="color: red; font-size: 12px;">请输入正整数</span>
          </el-form-item>

        </el-form>

        <div class="form-btn">
          <el-button @click="isPatrolTableShow = false;">取消</el-button>
          <el-button type="primary" @click="addPatrolTable();">确定</el-button>
        </div>
      </popupBody>
    </transition>

  </div>
</template>

<script>
  import YbTable from "components/ybtable/YbTable"
  import popupBody from 'components/popup/popupdata';
  import YbPopup from 'components/YbPopup';

  import {
    listContext, listproject, listScore, submitPatrolContext, deletePatrolContext, getPatrolTable, submitPatrolTable,
    getMaxNoContext
  } from 'api/medi/patrol/project';
  import {listEnable} from 'api/common';

  export default {
    async mounted() {
      this.patrolTableId = this.$route.query.patrolTableId;

      await listContext(this.patrolTableId).then((result) => {
        if (result && result.status) {
          this.tableData = result.data.filter(function (data) {
            return data.children.length != 0;
          });
        }
      })

      await getPatrolTable(this.patrolTableId).then((result) => {
        if (result && result.status) {
          this.patrolTable = result.data;
        }
      })

    },
    methods: {
      numCheck() {
        this.patrolProject.no = this.patrolProject.no.replace(/\D+/g, '');
        if (this.patrolProject.no > 100) {
          this.patrolProject.no = 100
        }
      },
      handleChange() {
        if (!this.patrolContext.patrolProjectId && !this.patrolProject.name && !this.patrolProject.no && !this.manual) {
          this.tag = true;
        } else {
          this.tag = false;
        }
        if (!this.patrolContext.patrolProjectId && (!this.patrolProject.name || !this.patrolProject.no) && this.manual) {
          this.tag2 = true;
        } else {
          this.tag2 = false;
        }

        getMaxNoContext(this.patrolContext.patrolProjectId).then((result) => {
          if (result.data === null) {
            result.data = 0;
          }
          if (result.data < 100) {
            this.maxNo = result.data;
            this.myShow = true;
            this.myShow1 = false;
          } else {
            this.maxNo = result.data;
            this.myShow = false;
            this.myShow1 = true;
          }
          this.patrolContext.no = this.maxNo + 1;
        });
      },
      validate() {
        if (!this.patrolContext.patrolProjectId && !this.patrolProject.name && !this.patrolProject.no && !this.manual) {
          this.tag = true;
        } else {
          this.tag = false;
        }
        if (!this.patrolContext.patrolProjectId && (!this.patrolProject.name || !this.patrolProject.no) && this.manual) {
          this.tag2 = true;
        } else {
          this.tag2 = false;
        }
      },

      updateContextHandleData(isEnable) {
        if (this.important && this.important != "") {
          this.patrolContext.important = 'YES';
        } else {
          this.patrolContext.important = 'NO';
        }
        if (this.scoreStr == 0) {
          this.patrolContext.score = this.scoreStr;
        } else if (this.scoreStr) {
          this.patrolContext.score = this.scoreStr;
        }
        if (this.quick && this.quick != "") {
          this.patrolContext.quick = this.quick;

        }

        this.patrolProject.patrolTableId = this.patrolTableId;
        this.patrolProject.enable = "YES";

      },

      updateContextCore(isEnable) {
        this.disButton = true;
        submitPatrolContext(this.patrolContext, this.patrolProject).then(result => {
          setTimeout(() => {
            this.disButton = false;
          }, 1000)
          if (result && result.status) {
            if (isEnable === 'YES') {
              this.handleStr = '启用';
            } else if (isEnable === 'NO') {
              this.handleStr = '禁用';
            }
            this.$message({
              message: this.handleStr + '成功',
              type: 'success'
            })

            setTimeout(() => {
              listContext(this.patrolTableId).then((result) => {
                if (result && result.status) {
                  this.tableData = result.data.filter(function (data) {
                    return data.children.length != 0;
                  });
                }
              });

              getPatrolTable(this.patrolTableId).then((result) => {
                if (result && result.status) {
                  this.patrolTable = result.data;
                }
              })

              this.hideAdd();
            }, 2000)

          } else {
            this.$message({
              message: result.message,
              type: 'error'
            });
          }
        })
      },

      updateContext(isEnable) {
        if (!this.patrolContext.patrolProjectId && !this.manual) {
          this.$message({
            type: 'error',
            message: '请选择或添加一个巡查项目'
          })
          return
        }
        if (!this.patrolProject.name && !this.patrolProject.no) {
          if (!this.patrolContext.patrolProjectId) {
            this.tag = true;
          }
        }
        this.validate();
        this.updateContextHandleData(isEnable);
        this.$refs.patrolContext.validate(function (data) {
          if (data) {
            this.updateContextCore(isEnable);
          } else {
            this.$message({
              message: "请按提示输入完整信息.",
              type: 'error'
            });
          }
        }.bind(this))
      },

      deleteContext(contextData) {
        this.$confirm('是否确认删除该巡查内容？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deletePatrolContext(contextData).then((result => {
            this.$message({
              message: "删除成功.",
              type: 'success'
            });
          }))
        });
      },

      /* 添加巡查表提交 */
      addPatrolTable() {
        if (!this.patrolTable.minImportant) {
          this.patrolTable.minImportant = 0
        }
        submitPatrolTable(this.patrolTable).then(result => {
          if (result && result.status) {

            this.$message({
              message: '编辑成功',
              type: 'success'
            })

            setTimeout(() => {
              this.isPatrolTableShow = false;
            }, 2000);

          } else {
            this.$message({
              message: result.message,
              type: 'error'
            });
          }
        })
      },

      async showAdd() {
        this.isShow = true;
        this.isAdd = true;
        this.handleStr = "添加";

        await listproject(this.patrolTableId).then((result) => {
          if (result) {
            this.projectList = result.data;
          }
        });

        await listScore().then((result) => {
          if (result) {
            this.scoreList = result.data;
          }
        });

        await listEnable().then((result) => {
          if (result) {
            this.enableList = result.data;
          }
        });

      },

      hideAdd() {
        this.isShow = false;
        this.isAdd = false;
        this.manual = false;
        this.myShow = false;
        this.myShow1 = false;

        this.patrolContext = {
          context: "",
          no: "",
          quick: "",
          patrolProjectId: "",
          score: "",
          enable: "YES",
          important: false,
        };

        this.quick = "";
        this.scoreStr = "";
        this.important = false;
      },

      manualShow() {
        this.patrolContext.patrolProjectId = "";
        this.patrolProject.name = "";
        this.patrolProject.no = "";
        this.manual = true;
      },
      manualHide() {

        this.manual = false;
      },

      goProject() {
        this.$router.push({name: "mediPatrolProjectList", query: {"patrolTableId": this.patrolTableId}})
      },

      goBack() {
        this.$router.push({name: 'mediPatrolTableList'});
      },

      onlyNum() {
        this.patrolTable.minImportant = this.patrolTable.minImportant.replace(/\D+/g, '');
        console.log(this.patrolTable.minImportant)
      },
      numberCheck() {
        this.patrolContext.no = this.patrolContext.no.replace(/\D+/g, '');
        this.patrolContext.no = this.patrolContext.no.replace(/^[0]/g, '');

        this.patrolProject.no = this.patrolProject.no.replace(/\D+/g, '');
        this.patrolProject.no = this.patrolProject.no.replace(/^[0]/g, '');
      }
    },
    data() {
      return {
        disButton: false,
        tag: false,
        tag2: false,
        scoreStr: "",
        important: false,
        quick: "",

        maxNo: 1,
        myShow: false,
        myShow1: false,

        isShow: false,
        isAdd: false,
        manual: false,
        isPatrolTableShow: false,

        errorMinImportant: false,

        handleStr: "添加",

        currentPage: 1, //当前页

        patrolTable: {
          minImportant: ''
        },

        projectList: [],
        patrolProjectId: "",
        scoreList: [],
        enableList: [],

        patrolContext: {
          patrolProjectId: "",
          score: "",
          enable: "YES",
          important: "",
        },

        patrolProject: {
          enable: "YES",
          no: "",
        },


        // 点击编辑的按钮
        editFn: (index, subIndex) => {
          this.isShow = true;
          this.handleStr = "编辑";

          listScore().then((result) => {
            if (result) {
              this.scoreList = result.data;
            }
          });

          listEnable().then((result) => {
            if (result) {
              this.enableList = result.data;
            }
          });

          console.info("巡查内容编id+++++++++++++++++" +this.tableData[index].children[subIndex].id);
          let {context, enable, important, id, patrolProjectId, no} = this.tableData[index].children[subIndex];
          this.patrolContext = {context, enable, important, id, patrolProjectId, no};
          this.scoreStr = this.tableData[index].children[subIndex].score;

          this.quick = this.tableData[index].children[subIndex].quick;

          if (this.tableData[index].children[subIndex].important == 'YES') {
            this.important = true;
          } else if (this.tableData[index].children[subIndex].important == 'NO') {
            this.important = false;
          }
        },
        //点击状态切换的按钮
        statusFn: (index, subIndex) => {
          let {context, id, patrolProjectId, quick, score, no} = this.tableData[index].children[subIndex];
          this.patrolContext = {context, id, patrolProjectId, quick, score, no};
          this.scoreStr=this.patrolContext.score;
          if (this.tableData[index].children[subIndex].important == 'YES') {
            this.important = true;
          } else if (this.tableData[index].children[subIndex].important == 'NO') {
            this.important = false;
          }

          if (this.tableData[index]['children'][subIndex]['enable'] == 'YES') {
            this.tableData[index]['children'][subIndex]['enableLabel'] = '禁用'
            this.patrolContext.enable = 'NO';
          } else {
            this.tableData[index]['children'][subIndex]['enableLabel'] = '启用'
            this.patrolContext.enable = 'YES';
          }
          this.updateContextHandleData(this.patrolContext.enable)
          this.updateContextCore(this.patrolContext.enable);
        },
        //点击删除的按钮
        deleteFn: (index, subIndex) => {
          this.$confirm('是否确认删除该巡查内容？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            let {context, enable, important, id, patrolProjectId, quick} = this.tableData[index].children[subIndex];
            this.patrolContext = {context, enable, important, id, patrolProjectId, quick};
            this.patrolContext.no = this.tableData[index].children[subIndex].no;
            this.patrolContext.score = this.tableData[index].children[subIndex].score;

            deletePatrolContext(this.patrolContext).then((result => {
              this.$message({
                message: "删除成功.",
                type: 'success'
              });
              listContext(this.patrolTableId).then((result) => {
                if (result) {
                  this.tableData = result.data.filter(function (data) {
                    return data.children.length != 0;
                  });
                }
              });
            }))
          });
        },
        column: [
          {
            prop: "no",
            label: "检查项编号"
          },
          {
            prop: "name",
            label: "巡查项目"
          },
          {
            prop: "children",
            subColumn: [
              {
                prop: "completeNo",
                label: "巡查内容编号",
              },
              {
                prop: "context",
                label: "巡查内容",
              },
              {
                prop: "importantLabel",
                label: "是否重点项",
              },
              {
                prop: "score",
                label: "分值",
              },
              {
                prop: "enable",
                label: "enable",
              },
              {
                prop: "enableLabel",
                label: "状态",
              },
            ],
          },
        ],
        tableData: [],

        //校验
        rules: {
          name: [{required: true, message: '请输入', type: 'date', trigger: 'blur'}],
          context: [{required: true, message: '请输入', trigger: 'blur'}],
          no: [{required: true, message: '请输入', trigger: 'blur'}],
          //quick: [{required: true, message: '请输入', trigger: 'blur'}],
          patrolProjectId: [{required: true, message: '请选择', trigger: 'blur'}],
          scoreStr: [{required: true, message: '请选择', trigger: 'blur'}],
          enable: [{required: true, message: '请选择', trigger: 'blur'}],
          important: [{required: true, message: '请选择', trigger: 'blur'}],
        },

      };
    },

    components: {
      YbTable,
      popupBody,
      YbPopup
    },
  }
</script>

<style scoped lang="sass">
  .form-item {
    text-align: left !important;
    padding-left: 40px;
  }

  .form-item .input-t2 {
    width: 70px;
  }

  .w440 {
    width: 440px;
  }

  .w160 {
    width: 160px;
  }

  .w45 {
    width: 45px;
  }

  .manual {
    font-size: 14px;
    color: #C5CFD9;
    margin-left: 10px;
    cursor: pointer;
  }

  .manualAdd {
    background: #F2F5F8;
    border: 1px solid #C2CAD2;
    padding: 13px 12px 13px 15px;
    width: 440px;
    margin-top: 20px;
    box-sizing: border-box;
  }

  .manualAdd input {
    width: 175px;
    background: #F1F3F6;
    margin-right: 5px;
  }

  .manualAdd span {
    color: #A2AAB6;
  }

  textarea {
    resize: none;
    background: #FFFFFF;
    border: 1px solid #C2CAD2;
    font-size: 12px;
    color: #A2AAB6;
    padding: 0 12px;
    box-sizing: border-box;
  }

  input {
    width: 160px;
    height: 34px;
    font-size: 12px;
    color: #A2AAB6;
    padding-left: 12px;
    box-sizing: border-box;
    border: 1px solid #C2CAD2;
  }

  .xcnr {
    width: 410px;
    height: 76px;
    line-height: 20px;
  }

  .popup-hide {
    position: absolute;
    top: 10px;
    right: 20px;
  }
</style>
