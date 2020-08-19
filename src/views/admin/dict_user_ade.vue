<template>
  <div class="user-box" style="margin-bottom:220px;">
    <div class="page-tilt">
      <b></b>
      <span>用户字典{{curdStr}}</span>
      <i @click="goBack();" class="icon iconfont icon-back" style="cursor: pointer;
          display: inline-block;
          color: rgb(96, 105, 121);
          height: 22px;
          width: 22px;
          line-height: 22px;">
      </i>
    </div>
    <div class="big-box">

      <div style=" display: inline-block; margin: 20px 10px;  border: 1px solid silver;" v-if="curd == 'add'">
        <div style="background-color: #606979; width: 100%; height: 35px;">
          <span style="line-height: 35px; margin-left: 10px; font-weight: bold;">标准字典库</span>
        </div>
        <div style="width: 100%; height: 100%;">
          <el-tree :data="dictList" :props="dictProps" :highlight-current="true" @node-click="handleNodeClick" class="tree-box"></el-tree>
        </div>
      </div>

      <div style="display: inline-block;" :class="{'add-div':curd == 'add', 'not-add-div': curd != 'add', 'flex1': true}">
        <toggle-form title="基本信息">
          <div class="form-box">
            <el-form :model="dictUser" :rules="rules" ref="dictUser" label-width="100px" class="demo-ruleForm">

              <el-form-item label="用户字典名称:" prop="alias">
                <el-input v-if="curd != 'detail'" class="w200" v-model="dictUser.alias" placeholder="请输入用户字典名称"></el-input>
                <span v-if="curd == 'detail'" class="w200">{{dictUser.alias ? dictUser.alias: dictUser.name}}</span>
              </el-form-item>
              <el-form-item label="备注:" prop="remark">
                <el-input v-if="curd != 'detail'" class="w200" type="textarea" v-model="dictUser.remark" placeholder="请输入备注"></el-input>
                <span v-if="curd == 'detail'" class="w200" type="textarea">{{dictUser.remark}}</span>
              </el-form-item>

            </el-form>
          </div>
        </toggle-form>

        <toggle-form title="字典项">
          <div style="margin: 20px; margin-bottom: 200px;" v-if="curd != 'detail'">

            <transfer-edit @getTransferEditData="getTransferEditData" :transferData_left="transferData_left" :transferData_right="transferData_right"
              showFlied="name" childFlid="children" idFlid="dictItemId" titleleft="标准字典项" titleright="用户字典项">


            </transfer-edit>
          </div>

          <div v-if="curd == 'detail'" style="margin: 20px; margin-bottom: 200px;">
            <div>
              <sync-tree-grid :columns="columns" :tree-structure="true" :datainit="datainit" :ade="curd">
              </sync-tree-grid>
            </div>
          </div>
        </toggle-form>

      </div>
      <div class="foot-btn">
        <div>
          <el-button @click="goBack();">取消</el-button>
          <el-button v-if="curd != 'detail'" type="primary" @click="sumbitDictUser();">保存</el-button>
          <el-button v-if="curd == 'detail'" type="primary" @click="goEdit();">编辑</el-button>
        </div>
      </div>
    </div>

  </div>
</template>



<script>
  import ToggleForm from 'components/ToggleForm'  //列表块
  import popupBody from 'components/popup/popupdata';
  import SyncTreeGrid from 'components/SyncTreeGrid';
  import transferEdit from 'components/transferEdit/transferEdit'
  import dataDistinct from 'utils/dataDistinct.js'

  import { listDictGroupType, getDictById, getDictUserById, listDictItemById, listDictUserItemByDictId, updateDictUser } from 'api/admin/dict'

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
    async beforeMount() {

      this.user = this.$store.getters.user;

      this.curd = this.$route.params.curd;
      this.curdStr = getCurdStr(this.curd);

      //非添加
      if (this.curd != 'add') {

        this.dictUserId = this.$route.query.id;

        let response = await getDictUserById(this.dictUserId);
        if (response.status) {
          this.dictUser = response.data;
          this.areaCode = this.dictUser.areaCode;
        }

        await listDictItemById(this.dictUser.dictId).then(result => {
          if (result.status) {
            this.getItemId = this.dataToUser(result.data);  //对比字典项id，用于更新用户字典项id
            this.transferData_left = this.dataToUser(result.data);
          }
        });

        await listDictUserItemByDictId(this.dictUserId).then(result => {
          if (result.status) {
            this.datainit = result.data;
            this.transferData_right = result.data;
          }
        })

        dataDistinct.call(this, this.transferData_left, this.transferData_right,
          'transferData_left', 'transferData_right', true);

      } else { //add
        //左侧字典列表
        this.areaCode = this.$route.query.id; // add页面获取dictId为areaCode
        let dictListResult = await listDictGroupType(this.areaCode);
        this.dictList = dictListResult.data;
        for (let i = 0; i < this.dictList.length; i++) {
          if (this.dictList[i].children.length == 0) {
            this.dictList.splice(i, 1);
            i--;
          }
        }
      }
    },

    methods: {
      dataToUser(data) {
        let result = [];
        data.forEach(item => {
          let temp = {};
          temp.alias = item.alias;
          temp.code = item.code;
          temp.dictUserCode = item.dictCode;
          temp.enable = item.enable;
          temp.dictItemId = item.id;
          temp.leaf = item.leaf;
          temp.level = item.level;
          temp.name = item.name;
          temp.path = item.path;

          result.push(temp);
        })
        return result;
      },

      handleNodeClick(dict) {
        if (dict.id) {
          let { code, name, remark, type } = dict;
          this.dictUser = { code, name, remark, type };
          this.dictUser.dictId = dict.id;
          this.dictUser.alias = dict.name;

          listDictItemById(dict.id).then(result => {
            if (result.status) {
              this.transferData_left = this.dataToUser(result.data);

              this.transferData_right = [];
            }
          })
        }
      },

      async goEdit() {
        this.curd = 'edit';
        this.curdStr = '编辑';
        this.dictUserId = this.$route.query.id;

        await listDictItemById(this.dictUser.dictId).then(result => {
          if (result.status) {
            this.getItemId = this.dataToUser(result.data);
            this.transferData_left = this.dataToUser(result.data);
          }
        });

        await listDictUserItemByDictId(this.dictUserId).then(result => {
          if (result.status) {
            this.datainit = result.data;
            this.transferData_right = result.data;
          }
        })

        dataDistinct.call(this, this.transferData_left, this.transferData_right,
          'transferData_left', 'transferData_right', true);

        this.$router.push({ name: 'dict.user.curd', query: { curd: 'edit', id: this.dictUserId } });
      },

      goBack() {
        this.$router.push({ name: 'dict.user', query: { areaCode: this.areaCode } });
      },

      sumbitDictUser() {
        this.$refs.dictUser.validate(function (valid) {
          if (valid) {
            let params = {};
            params.dictUser = this.dictUser;
            params.dictUser.areaCode = this.areaCode;   //添加dictId传参为areaCode
            params.dictItemUser = this.dictItemUser;

            params.dictItemUser.forEach(item => {
              let code = item.code;
              this.getItemId.forEach(idDate => {
                let idCode = idDate.code;
                if (code == idCode) {
                  item.dictItemId = idDate.dictItemId;
                }
              })
            })

            updateDictUser(params).then(result => {
              if (result.status) {
                this.$message({
                  message: this.curdStr + '用户字典成功',
                  type: 'success'
                });
                this.dictUser.alias = '';
                this.dictUser.remark = '';
                this.transferData_left = [];
                this.transferData_right = [];
                this.dictList = [];
                if (this.curd == 'add') {
                  setTimeout(async () => {
                    if (this.curd != 'add') {
                      this.dictUserId = this.$route.query.id;
                      let response = await getDictUserById(this.dictUserId);
                      if (response.status) {
                        this.dictUser = response.data;
                        this.areaCode = this.dictUser.areaCode;
                      }
                      await listDictItemById(this.dictUser.dictId).then(result => {
                        if (result.status) {
                          this.getItemId = this.dataToUser(result.data);  //对比字典项id，用于更新用户字典项id
                          this.transferData_left = this.dataToUser(result.data);
                        }
                      });
                      await listDictUserItemByDictId(this.dictUserId).then(result => {
                        if (result.status) {
                          this.datainit = result.data;
                          this.transferData_right = result.data;
                        }
                      })
                      dataDistinct.call(this, this.transferData_left, this.transferData_right,'transferData_left', 'transferData_right', true);
                    } else { //add
                      //左侧字典列表
                      this.areaCode = this.$route.query.id; // add页面获取dictId为areaCode
                      let dictListResult = await listDictGroupType(this.areaCode);
                      this.dictList = dictListResult.data;
                      for (let i = 0; i < this.dictList.length; i++) {
                        if (this.dictList[i].children.length == 0) {
                          this.dictList.splice(i, 1);
                          i--;
                        }
                      }
                    }
                  }, 2000);
                } else {
                  setTimeout(() => {
                    this.goBack();
                  }, 2000);
                }

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

      },
      // 监听数据
      getTransferEditData(val) {
        this.dictItemUser = val.right;
      }

    },
    data() {
      return {
        curd: "",
        curdStr: "",
        dictUserId: "",
        areaCode: "",

        dictList: [],   //左侧字典列表
        dictProps: {
          children: 'children',
          label: 'name'
        },

        dict: {},
        dictUser: {},
        dictItemUser: [],
        getItemId: [],

        datainit: [],

        columns: [
          {
            text: '字典项名称',
            dataIndex: 'name'
          },
          {
            text: '字典项别名',
            dataIndex: 'alias'
          },
          {
            text: '字典项编码',
            dataIndex: 'code'
          },
          {
            text: '字典项配置',
            dataIndex: 'option'
          },
          {
            text: '字典项等级',
            dataIndex: 'level'
          }
        ],

        transferData_left: [],
        transferData_right: [],

        //校验
        rules: {
          alias: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    components: {
      ToggleForm, popupBody, transferEdit, SyncTreeGrid
    }
  }
</script>

<style scoped lang="sass">
  .user-box {
    position: relative;
  }

  .form-box {
    width: 460px;
    margin: 0 auto 40px;
    overflow: hidden;
  }

  .add-div {
    width: 80%
  }

  .not-add-div {
    width: 99%
  }

  .big-box {
    display: flex;
    flex-wrap: nowrap;
  }

  .tree-box {
    border: none;
    background: #F2F5F8;
    max-height: 83%;
    margin-top: 10px;
    width: 250px;
  }
</style>