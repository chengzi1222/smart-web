<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b><span>{{randomTable.name}}</span>
      <i @click="goBack();" class="icon iconfont icon-back" style="cursor: pointer;
          display: inline-block;
          color: rgb(96, 105, 121);
          height: 22px;
          width: 22px;
          line-height: 22px;">
      </i>
    </div>
    <div class="floatR" style="margin-bottom:20px;">
      <el-button type="primary" @click="isRandomTableShow = true; disabled = false;">编辑最少抽查重点项</el-button>
      <el-button type="primary" @click="goProject()">编辑抽查项目</el-button>
      <el-button type="primary" @click="showAdd();" class="selectHeight">添加抽查内容</el-button>

    </div>

    <yb-table :tableData="tableData" :column="column" :editFn="editFn" :statusFn="statusFn" :deleteFn="deleteFn"
              statusField='enable'
              style="clear:both;" listField='children' scoreField="score">
    </yb-table>

    <transition name="dialog-fade">
      <yb-popup :isShow='isShow' @close="hideAdd()" :title="handleStr + '抽查内容'">
        <div slot="body">
          <div style="width:630px;margin:30px auto 0;">
            <el-form :model="randomContext" :rules="rules" ref="randomContext" label-width="100px"
                     class="demo-ruleForm">

              <el-form-item label="抽查项目:" prop="" v-if="isAdd">
                <el-select :disabled="manual" v-model="randomContext.randomProjectId" placeholder="请选择抽查项目" class="w440"
                           @change="handleChange">
                  <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
                <span class="manual" @click="manualShow()">手动添加</span>
                <p v-if="tag" style="color:#f56c6c;font-size:12px;margin: 0;line-height:0;padding-top: 4px;">请选择</p>

                <div class="manualAdd" v-if="manual">
                  <input type="text" @blur="validate" style="background-color: #fff;" v-model="randomProject.name"
                         maxlength="50" placeholder="请输入项目名称">
                  <input type="text" @blur="validate" @keyup="numCheck" style="background-color: #fff;" maxlength="3"
                         v-model="randomProject.no"
                         placeholder="请输入项目编号">
                  <span @click="manualHide()" style="cursor:pointer">X</span>
                </div>
                <p v-if="tag2" style="color:#f56c6c;font-size:12px;margin: 0;line-height:0;padding-top: 10px;">请完整输入</p>
              </el-form-item>

              <el-form-item label="抽查内容:" prop="context">
                <el-input type="textarea" placeholder="请填写抽查内容" class="w440" maxlength="500"
                          v-model="randomContext.context"></el-input>
              </el-form-item>

              <el-row>
                <el-col :span="10">
                  <el-form-item label="编号:" prop="no">
                    <el-input type="text" placeholder="请输入分类编号" maxlength="10" class="w150" @keyup.native="numberCheck"
                              v-model="randomContext.no"></el-input>
                  </el-form-item>
                  <span v-if="randomContext.no" style="color: #bbbbbb; font-size: 12px;
                  margin-left: 100px; margin-top: -20px; display: block;">当前最大编号为{{maxNo}}, 建议编号{{maxNo
                    + 1}}</span>
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
                    <el-select v-model="randomContext.enable" placeholder="请选择状态" class="w150">
                      <el-option v-for="item in enableList" :key="item.key" :label="item.name"
                                 :value="item.key"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="快捷抽查:" prop="quick">
                <el-input type="textarea" placeholder="可配置抽查时的快速录入项，每次换行为一个录入项" class="w440" maxlength="500"
                          v-model="quick"></el-input>
              </el-form-item>

              <div style="text-align:right">
                <el-form-item>
                  <el-button type="default" @click="hideAdd();">取消</el-button>
                  <el-button type="primary" :disabled="disabled" @click="updateContext();">确定</el-button>
                </el-form-item>
              </div>

            </el-form>
          </div>
        </div>

      </yb-popup>
    </transition>

    <!--添加弹窗-->
    <transition name="dialog-fade">
      <popupBody class="popup-body" v-if="isRandomTableShow">
        <!-- 功能模块添加到这一区域 -->
        <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="cancel()"></i>

        <el-form label-width="100px" class="demo-ruleForm">

          <el-form-item label="名称:">
            <span class="w200">{{randomTable.name}}</span>
          </el-form-item>

          <el-form-item label="最少重点项:">
            <el-input v-model="randomTable.minImportant" @keyup.native="onlyNum" @change="onlyNum"
                      class="w200"></el-input>
            <span v-if="errorMinImportant" style="color: red; font-size: 12px;">请输入正整数</span>
            <span v-if="errorImp" style="color: red; font-size: 12px;">最少重点项不能多于重点项数</span>
          </el-form-item>

        </el-form>

        <div class="form-btn">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" :disabled="disabled" @click="addRandomTable();">确定</el-button>
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
    listContext, listproject, listScore, submitRandomContext, deleteRandomContext, getRandomTable, submitRandomTable,
    getMaxNoContext
  } from 'api/random/project';
  import {listEnable} from 'api/common';

  export default {
    async mounted() {
      this.randomTableId = this.$route.query.randomTableId;

      await listContext(this.randomTableId).then((result) => {
        if (result && result.status) {
          var imp = 0;
          this.tableData = result.data.filter(function (data) {
            for (let i = 0; i < data.children.length; i++) {
              if (data.children[i].important == "YES" && data.enable == "YES") {
                imp++;
              }
            }
            return data.children.length != 0;
          });
          this.imp = imp;
        }
      })

      await getRandomTable(this.randomTableId).then((result) => {
        if (result && result.status) {
          this.randomTable = result.data;
          this.minImportant_clone = result.data.minImportant;
        }
      })

    },
    methods: {
      numCheck() {
        this.randomProject.no = this.randomProject.no.replace(/\D+/g, '');
        if (this.randomProject.no > 100) {
          this.randomProject.no = 100
        }
      },
      handleChange() {
        if (!this.randomContext.randomProjectId && !this.randomProject.name && !this.randomProject.no && !this.manual) {
          this.tag = true;
        } else {
          this.tag = false;
        }
        if (!this.randomContext.randomProjectId && (!this.randomProject.name || !this.randomProject.no) && this.manual) {
          this.tag2 = true;
        } else {
          this.tag2 = false;
        }

        getMaxNoContext(this.randomContext.randomProjectId).then((result) => {
          this.maxNo = result.data;
          if (!this.maxNo) {
            this.maxNo = 0;
          }
          this.randomContext.no = this.maxNo + 1;
        });
      },
      validate() {
        if (!this.randomContext.randomProjectId && !this.randomProject.name && !this.randomProject.no && !this.manual) {
          this.tag = true;
        } else {
          this.tag = false;
        }
        if (!this.randomContext.randomProjectId && (!this.randomProject.name || !this.randomProject.no) && this.manual) {
          this.tag2 = true;
        } else {
          this.tag2 = false;
        }
      },

      updateContextHandleData(isEnable) {
        let num = this.imp;
        if (this.important && this.important != "") {
          this.randomContext.important = 'YES';
          num++;
        } else {
          if (this.handleStr == "编辑" && num != 0) {
            --num;
          }
          this.randomContext.important = 'NO';
        }
        if (this.scoreStr && this.scoreStr != "") {
          this.randomContext.score = this.scoreStr;
        }
        if (this.quick && this.quick != "") {
          this.randomContext.quick = this.quick;

        }

        this.randomProject.randomTableId = this.randomTableId;
        this.randomProject.enable = "YES";
        return num;
      },

      updateContextCore(isEnable) {
        submitRandomContext(this.randomContext, this.randomProject).then(result => {
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
              listContext(this.randomTableId).then((result) => {
                if (result && result.status) {
                  this.tableData = result.data.filter(function (data) {
                    return data.children.length != 0;
                  });
                }
              });

              getRandomTable(this.randomTableId).then((result) => {
                if (result && result.status) {
                  this.randomTable = result.data;
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

        if (!this.randomProject.name && !this.randomProject.no) {
          if (!this.randomContext.randomProjectId) {
            this.tag = true;
          }
        }
        this.validate();
        let num = this.updateContextHandleData(isEnable);
        if (this.handleStr == "编辑") {0
          if (num < this.randomTable.minImportant) {
            this.$message({
              message: '重点项数不能少于最少重点项',
              type: 'false'
            });
            return false;
          }
        }
        this.imp = num;
        this.$refs.randomContext.validate(function (data) {
          if (data || data == 0) {
            // this.disabled = true;
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
        this.$confirm('是否确认删除该抽查内容？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteRandomContext(contextData).then((result => {
            this.$message({
              message: "删除成功.",
              type: 'success'
            });
          }))
        });
      },

      /* 添加抽查表提交 */
      addRandomTable() {
        if (!this.randomTable.minImportant) {
          this.errorMinImportant = true;
          return false;
        } else {
          if (this.randomTable.minImportant > this.imp) {
            this.errorImp = true;
            return false;
          }
        }
        this.minImportant_clone = this.randomTable.minImportant;
        this.disabled = true;

        submitRandomTable(this.randomTable).then(result => {
          if (result && result.status) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.errorMinImportant = false;
            this.errorImp = false;
            setTimeout(() => {
              this.isRandomTableShow = false;
            }, 2000);
            this.disabled = false;
          } else {
            this.$message({
              message: result.message,
              type: 'error'
            });
            this.disabled = false;
          }
        })
      },

      //      取消按钮
      cancel() {
        this.isRandomTableShow = false;
        this.errorMinImportant = false;
        this.errorImp = false;
        this.randomTable.minImportant = this.minImportant_clone;
      },

      async showAdd() {
        this.disabled = false;
        this.isShow = true;
        this.isAdd = true;
        this.handleStr = "添加";

        await listproject(this.randomTableId).then((result) => {
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

        this.randomContext = {
          context: "",
          no: "",
          quick: "",
          randomProjectId: "",
          score: "",
          enable: "YES",
          important: false,
        };

        this.quick = "";
        this.scoreStr = "";
        this.important = false;
      },

      manualShow() {
        this.randomContext.randomProjectId = "";
        this.randomProject.name = "";
        this.randomProject.no = "";
        this.manual = true;
      },
      manualHide() {

        this.manual = false;
      },

      goProject() {
        this.$router.push({name: "random.library.project", query: {"randomTableId": this.randomTableId}})
      },

      goBack() {
        history.back();
      },

      onlyNum() {
        this.randomTable.minImportant = this.randomTable.minImportant.replace(/\D+/g, '');
      },
      numberCheck() {
        this.randomContext.no = this.randomContext.no.replace(/\D+/g, '');
        this.randomContext.no = this.randomContext.no.replace(/^[0]/g, '');

        this.randomProject.no = this.randomProject.no.replace(/\D+/g, '');
        this.randomProject.no = this.randomProject.no.replace(/^[0]/g, '');
      }
    },
    data() {
      return {
        disabled: false,

        tag: false,
        tag2: false,
        scoreStr: "",
        important: false,
        quick: "",

        maxNo: 1,

        isShow: false,
        isAdd: false,
        manual: false,
        isRandomTableShow: false,

        errorMinImportant: false,
        errorImp: false,

        handleStr: "添加",

        currentPage: 1, //当前页

        randomTable: {
          minImportant: ''
        },
        minImportant_clone: '',
        projectList: [],
        randomProjectId: "",
        scoreList: [],
        enableList: [],

        randomContext: {
          randomProjectId: "",
          score: "",
          enable: "YES",
          important: "",
        },

        randomProject: {
          enable: "YES",
          no: "",
        },

        imp: 0,
        // 点击编辑的按钮
        editFn: (index, subIndex) => {
          this.disabled = false;
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

          let {context, enable, important, id, randomProjectId, no} = this.tableData[index].children[subIndex];
          this.randomContext = {context, enable, important, id, randomProjectId, no};
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
          let {context, id, randomProjectId, quick, score, no} = this.tableData[index].children[subIndex];
          this.randomContext = {context, id, randomProjectId, quick, score, no};

          if (this.tableData[index].children[subIndex].important == 'YES') {
            this.important = true;
          } else if (this.tableData[index].children[subIndex].important == 'NO') {
            this.important = false;
          }

          if (this.tableData[index]['children'][subIndex]['enable'] == 'YES') {
            this.tableData[index]['children'][subIndex]['enableLabel'] = '禁用'
            this.randomContext.enable = 'NO';
          } else {
            this.tableData[index]['children'][subIndex]['enableLabel'] = '启用'
            this.randomContext.enable = 'YES';
          }
          this.updateContextHandleData(this.randomContext.enable)
          this.updateContextCore(this.randomContext.enable);
        },
        //点击删除的按钮
        deleteFn: (index, subIndex) => {
          this.$confirm('是否确认删除该抽查内容？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            let {context, enable, important, id, randomProjectId, quick} = this.tableData[index].children[subIndex];
            this.randomContext = {context, enable, important, id, randomProjectId, quick};
            this.randomContext.no = this.tableData[index].children[subIndex].no;
            this.randomContext.score = this.tableData[index].children[subIndex].score;

            deleteRandomContext(this.randomContext).then((result => {
              this.$message({
                message: "删除成功.",
                type: 'success'
              });
              listContext(this.randomTableId).then((result) => {
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
            label: "抽查项目"
          },
          {
            prop: "children",
            subColumn: [
              {
                prop: "completeNo",
                label: "抽查内容编号",
              },
              {
                prop: "context",
                label: "抽查内容",
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
          randomProjectId: [{required: true, message: '请选择', trigger: 'blur'}],
          //score: [{ required: true, message: '请选择', trigger: 'blur' }],
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
