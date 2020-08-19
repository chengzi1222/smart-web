<template>
  <div class="user-box" style="margin-bottom:220px;">
    <div class="page-tilt">
      <b></b>
      <span>标准字典{{curdStr}}</span>
      <Back></Back>
    </div>
    <toggle-form title="基本信息">
      <div class="form-box">
        <el-form :model="dict" :rules="rules" ref="dict" label-width="100px" class="demo-ruleForm">

          <el-form-item label="标准字典名称:" prop="name">
            <el-input v-if="curd == 'add'" class="w200" v-model="dict.name" placeholder="请输入标准字典名称"></el-input>
            <el-input v-if="curd == 'edit'" class="w200" v-model="dict.name" :disabled="true"></el-input>
            <span v-if="curd == 'detail'" class="w200">{{dict.name}}</span>
          </el-form-item>
          <el-form-item label="标准字典编码:" prop="code">
            <el-input v-if="curd == 'add'" class="w200" v-model="dict.code" placeholder="请输入标准字典编码"></el-input>
            <el-input v-if="curd == 'edit'" class="w200" v-model="dict.code" :disabled="true"></el-input>
            <span v-if="curd == 'detail'" class="w200">{{dict.code}}</span>
          </el-form-item>
          <el-form-item label="字典类型:" prop="type">
            <el-select v-if="curd == 'add'" v-model="dictType" @change="selectType();" placeholder="请选择字典类型" class="w200">
              <el-option v-for="item in dictTypeList" :key="item.id" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <!--<el-input v-if="curd == 'add'" class="w200 success" v-model="dict.type" placeholder="请输入标准字典库名"></el-input>-->
            <el-input v-if="curd == 'edit'" class="w200" v-model="dict.type" :disabled="true"></el-input>
            <span v-if="curd == 'detail'" class="w200">{{dict.type}}</span>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <!--<span class="input-t">角色简介:</span>-->
            <el-input v-if="curd != 'detail'" class="w200" type="textarea" v-model="dict.remark" placeholder="请输入备注"></el-input>
            <span v-if="curd == 'detail'" class="w200" type="textarea">{{dict.remark}}</span>
          </el-form-item>

        </el-form>
      </div>
    </toggle-form>

    <toggle-form title="字典项">
      <div style="margin: 20px; margin-bottom: 200px;" v-if="curd != 'detail'">

        <sync-tree-grid :columns="columns" :tree-structure="true" :datainit="datainit" :buttons="buttons" :ade="curd" @syncTreeGridData="syncTreeGridData">
        </sync-tree-grid>

      </div>
      <div v-if="curd == 'detail'" style="margin: 20px; margin-bottom: 200px;">
        <div>
          <sync-tree-grid :columns="columns" :tree-structure="true" :datainit="datainit" :buttons="buttons" :ade="curd" @syncTreeGridData="syncTreeGridData">
          </sync-tree-grid>
        </div>
      </div>
    </toggle-form>

    <div class="foot-btn">
      <div>
        <el-button @click="$router.go(-1);">取消</el-button>
        <el-button v-if="curd != 'detail'" type="primary" @click="sumbitDict();">保存</el-button>
        <el-button v-if="curd == 'detail'" type="primary" @click="goEdit();">编辑</el-button>
      </div>
    </div>

  </div>
</template>

<script>

  import Back from 'utils/back.vue';		//返回上一个页面按钮
  import ToggleForm from 'components/ToggleForm';  //列表块
  import SyncTreeGrid from 'components/SyncTreeGrid';
  import popupBody from 'components/popup/popupdata';
  import { getDictById, listDictItemById, updateDict, listDictType } from 'api/admin/dict'

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

      this.dictId = this.$route.query.id;

      if (this.curd != 'add') {
        let response = await getDictById(this.dictId);
        if (response.status) {
          this.dict = response.data;
        }

        await listDictItemById(this.dictId).then(result => {
          if (result.status) {
            this.datainit = result.data;
            this.dictItem = result.data;
          }
        })
      }

      //字典类型
      let resultData = await listDictType();
      this.dictTypeList = resultData.data;
    },

    methods: {
      goEdit() {
        this.curd = 'edit';

        listDictItemById(this.dictId).then(result => {
          if (result.status) {
            this.datainit = result.data;
            this.dictItem = result.data;
          }
        })
      },
      syncTreeGridData(arr) {
        this.dictItem = arr;
      },

      selectType() {
        this.dict.type = this.dictType;
      },

      sumbitDict() {
        this.$refs.dict.validate(function (result) {
          if (result) {
            let params = {};
            params.dict = this.dict;
            params.dictItem = this.dictItem;

            updateDict(params).then(result => {
              if (result.status) {
                this.$message({
                  message: this.curdStr + '标准字典成功',
                  type: 'success'
                });

                setTimeout(() => {
                  this.$router.push('/dict/manager/list');
                }, 2000);
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

    },
    data() {
      return {
        curd: "",
        curdStr: "",

        dictId: "",
        dict: {},
        dictItem: [],
        dictTypeList: [],
        dictType: "",

        columns: [
          {
            text: '字典项名称',
            dataIndex: 'name'
          },
          {
            text: '字典项编码',
            dataIndex: 'code'
          },
          {
            text: '字典项等级',
            dataIndex: 'level'
          }
        ],
        datainit: [
        ],
        buttons: [
          //          {
          //            type: "success",
          //            text: "删除",
          //          },
          {
            type: "success",
            text: "编辑",
          },
          {
            type: "success",
            text: "添加子字典项",
          },

        ],

        //校验
        rules: {
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          code: [{ required: true, message: '请输入', trigger: 'blur' }],
          type: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    components: {
      Back, ToggleForm, popupBody, SyncTreeGrid
    }
  }
</script>

<style scoped lang="sass">
  .user-box {
    overflow: hidden;
    position: relative;
  }

  .form-box {
    width: 460px;
    margin: 0 auto 40px;
    overflow: hidden;
  }
</style>