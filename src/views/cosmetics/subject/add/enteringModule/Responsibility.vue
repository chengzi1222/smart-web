<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info mb200">
    <toggle-form title="责任落实">
      <div class="content" style="width:870px;">
        <div class="row">
          <el-form-item label="所属食药所:" prop="syj">
            <el-select @change="syjChange" class="w200" v-model="entity.syj" placeholder="请选择所属食药所">
              <el-option
                v-for="item in syjSelect"
                :key="item.id"
                :label="item.deptName"
                :value="item.id">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item label="所在网格:" prop="grid">
            <el-select @change="gridSelectChange" class="w200" @blur="validated" v-model="entity.grid" placeholder="请选择所属网格">
              <el-option
                v-for="item in gridSelect"
                :key="item.id"
                :label="item.deptName.replace('\t','')"
                :value="item.id">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="监管人员:" prop="so">
            <el-select @change="soChange" class="w200" v-model="entity.so" placeholder="请选择监管人员">
              <el-option
                v-for="item in soSelect"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监管人员联系方式">
            <span>{{soMobile}}</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="网格信息员:"  prop="infoAssi">
            <el-select @change="infoAssiChange" class="w200" v-model="entity.infoAssi" placeholder="请选择网格信息员">
              <el-option
                v-for="item in infoAssiSelect"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网格信息员联系方式">
            <span>{{infoAssiMobile}}</span>
          </el-form-item>
        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
import { floatValid, intValid } from "utils/validate";
import ToggleForm from "components/ToggleForm.vue";
import EnumSelect from "components/common/EnumSelect";
import { getTowns, getGrid, getSupervisor, getInfoAssi } from "api/sub/add";

export default {
  components: {
    EnumSelect,
    ToggleForm
  },
  async mounted() {
    this.validated();
  },
  destroyed() {

  },
  beforeDestroy() {

  },
  created() {
    getTowns().then(r => {
      this.syjSelect = r.data
      if (this.type === 'add') {
        this.entity.syj = r.data[0].id // 设置默认值
        this.syjChange(this.entity.syj);
      }
    })
  },
  props: {
    initData: {
      type: Object
    },
    outs: {
      type: Number
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      isFirst: true,
      syjSelect: [],
      gridSelect: [],
      soSelect: [],
      infoAssiSelect: [],
      soMobile: '',
      infoAssiMobile: '',
      entity: {
        syj: '',
        grid: '',
        so: '',
        infoAssi: ''
      },
      //验证
      rules: {
        syj: [
          { required: true, message: "请选择所属食药所", trigger: "change" }
        ],
        grid: [
          { required: true, message: "请选择所属网格", trigger: "change" }
        ],
      }
    };
  },
  methods: {
    validated() {
      this.$emit("getData", this.entity);
    },
    submitSub() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          console.log(valid)
          if (valid) {
            resolve();
          }
          throw new Error("表单验证出错");
        });
      });
    },
    reset() {
      this.$refs["form"].resetFields();
    },
    async syjChange (syj) {
      console.log('syj', this.isFirst, this.type)
      console.log(this.syjSelect)
      for (var i = 0; i < this.syjSelect.length; i++) {

        if (this.syjSelect[i].id === syj) {
          await getGrid(this.syjSelect[i].areaCode).then(response => {
            this.gridSelect = response.data
            if (this.type === 'add') {
              if (this.gridSelect && this.gridSelect.length > 0) {
                this.entity.grid = response.data[0].id
              } else {
                this.entity.grid = ''
              }
            } else {
              console.log(this.isFirst)
              if (this.isFirst) {
                this.entity.grid = this.initData.grid
              } else {
                this.entity.grid = response.data[0].id
              }
            }
            this.getSupervisorFunc()
            this.getInfoAssiFunc()
          })
          this.validated()
          return
        }
      }
    },
    getSupervisorFunc(){
      getSupervisor(this.entity.syj, this.entity.grid).then(r => {
              this.soSelect = r.data
              if (this.type === 'add') {
                if (this.soSelect && this.soSelect.length > 0) {
                  this.entity.so = r.data[0].id
                } else {
                  this.entity.so = ''
                }
              } else {
                if (this.isFirst) {
                  this.entity.so = this.initData.so
                } else {
                  this.entity.so = r.data[0]?r.data[0].id:''
                }
              }
              this.soChange(this.entity.so)
      })
    },
    getInfoAssiFunc(){
      getInfoAssi(this.entity.grid).then(r => {
        this.infoAssiSelect = r.data
        if (this.type === 'add') {
          if (this.infoAssiSelect && this.infoAssiSelect.length > 0) {
            this.entity.infoAssi = r.data[0].id
          } else {
            this.entity.infoAssi = ''
          }
        } else {
          if (this.isFirst) {
            this.entity.infoAssi = this.initData.infoAssi
            
          } else {
            this.entity.infoAssi = r.data[0]?r.data[0].id:''
          }
        }
        this.infoAssiChange(this.entity.infoAssi)
        if (this.isFirst) {
          this.isFirst = false
        }
      })
    },

    gridSelectChange(){
      this.getSupervisorFunc()
      this.getInfoAssiFunc()
    },

    infoAssiChange (infoAssiId) {
      this.validated()
      for (var i = 0; i < this.infoAssiSelect.length; i++) {
        if (this.infoAssiSelect[i].id === infoAssiId) {
          this.infoAssiMobile = this.infoAssiSelect[i].phoneNumber
          return
        }
      }
      this.infoAssiMobile=''
    },
    soChange (soId) {
      this.validated()
      for (var i = 0; i < this.soSelect.length; i++) {
        if (this.soSelect[i].id === soId) {
          this.soMobile = this.soSelect[i].phoneNumber
          return
        }
      }
      this.soMobile=''
    }
  },
  watch: {
    initData () {
      console.log('================watch')
      console.log(this.initData)
       let data = Object.keys(this.entity);
       for(let i = 0; i < data.length; i++){
          this.entity[data[i]] = this.initData[data[i]]
       }
        this.syjChange(this.entity.syj);
    },
    outs() {
      this.entity = {
        syj: '',
        grid: '',
        so: '',
        infoAssi: ''
      };
      this.infoAssiMobile = '';
      this.soMobile = ''
    }
  }
};
</script>


<style lang="scss" scoped>
.selectHeight {
  margin-left: 0px !important;
}
.mb200{
  margin-bottom: 200px;
}
</style>
