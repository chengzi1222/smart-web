<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150">
    <!-- 责任落实 -->
    <toggle-form title="责任落实">
      <div class="content">

        <div class="row">
          <el-form-item label="所属食药所:" prop="syj">
            <el-select class="w200" v-model="entity.syj" @change="getGridChange" placeholder="请选择食药所">
              <el-option v-for="item in syjSelect" :key="item.id" :label="item.deptName" :value="item.id">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <el-form-item label="所在网格:" prop="grid">
            <el-select class="w200" v-model="entity.grid" @change="gridSelectChange" @blur="validated" placeholder="请选择所属网格">
              <el-option v-for="item in gridSelect" :key="item.id" :label="item.deptName.replace('\t','')" :value="item.id">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="监督人员:" prop="so">
            <el-select class="w200" v-model="entity.so" @change="soSelectChange" placeholder="请选择监督人员">
              <el-option v-for="item in soSelect" :key="item.id" :label="item.realName" :value="item.id">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>

          <span style="margin-left:6px;color:#48576a" v-if="entity.grid != ''">监督人员联系方式:
            <span style="margin-left:12px;">{{entity.soPhone}}</span>
          </span>
        </div>

        <div class="row">
          <el-form-item label="网格信息员:" prop="infoAssi">
            <el-select class="w200" v-model="entity.infoAssi" @change="infoAssiSelectChange" placeholder="请选择信息员">
              <el-option v-for="item in infoAssiSelect" :key="item.id" :label="item.realName" :value="item.id">
              </el-option>
            </el-select>
            <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
          </el-form-item>
          <span style="margin-left:-7px;color:#48576a" v-if="entity.infoAssi != ''">网格信息员联系方式:
            <span style="margin-left:12px;">{{entity.infoAssiPhone}}</span>
          </span>
        </div>

        <div class="row">
          <el-form-item label="第一负责人:">
            <el-input class="w120" @blur="validated" :maxlength="32" v-model="entity.firstPl" placeholder="例：王维"></el-input>
          </el-form-item>
          <el-form-item label="联系方式:" prop="firstPlTel">
            <el-input class="w150" @blur="validated" :maxlength="11" v-model="entity.firstPlTel" placeholder="例：18722649176"></el-input>
          </el-form-item>
        </div>

        <div class="row">
          <el-form-item label="管理人员:">
            <el-input @blur="validated" class="w120" :maxlength="32" v-model="entity.manager" placeholder="例：王维"></el-input>
          </el-form-item>

          <el-form-item label="联系方式:">
            <el-input @blur="validated" class="w150" :maxlength="11" v-model="entity.managerTel" placeholder="例：18722649176"></el-input>
          </el-form-item>
        </div>

      </div>
    </toggle-form>

  </el-form>
</template>

<script>
  import { getTowns, getGrid, getSupervisor, getInfoAssi } from "api/sub/add.js";
  import ToggleForm from "components/ToggleForm.vue";
  import { phoneValid } from "utils/validate";

  export default {
    components: {
      ToggleForm
    },
    mounted() {

    },
    created() {
      getTowns().then(r => {
        this.syjSelect = r.data
        if (this.isInit) {
          this.getGridChange(this.entity.syj)
        }
        if (this.handleState === 'add') {
          this.entity.syj = r.data[0].id
          this.getGridChange(this.entity.syj)
        }
      });
    },
    props: {
      handleState: {
        type: String
      },
      initData: {
        type: Object
      }
    },
    data() {
      return {
        syjSelect: [], //所属食药所
        gridSelect: [], //所在网格
        soSelect: [], //监督人员
        infoAssiSelect: [], //网格信息员
        entity: {
          syj: "",
          grid: "",
          so: "",
          infoAssi: "",
          infoAssiId: "",
          infoAssiPhone: "",
          soPhone: "",
          firstPl: "",
          firstPlTel: "",
          manager: "",
          managerTel: ""
        },
        isFirst: true,
        rules: {
          syj: [{ required: true, message: "请选择食药所", trigger: "change" }],
          grid: [{ required: true, message: "请选择网格", trigger: "change" }],
          so: [{ required: true, message: "请选择监管人员", trigger: "change" }],
          infoAssi: [
            { required: true, message: "请选择网格信息员", trigger: "change" }
          ],
        },
        isInit: false
      };
    },
    watch: {
      initData() {
        this.editEcho();
      }
    },
    methods: {
      //编辑回显
      editEcho() {
        if (this.handleState === "edit" || this.handleState === "change") {
          Object.keys(this.entity).forEach(key => {
            if (this.initData[key]) {
              this.entity[key] = this.initData[key];
            }
          });
          this.getGridChange(this.entity.syj)
          this.$refs["form"].validate();
        }
      },
      //初始化责任落实
      async initSyj(syj) {
        return new Promise((resolve, reject) => {
          this.syjSelect = syj;
          if (syj && syj.length > 0) {
            //是否有食药局的数据
            let defaultFirstSyj = syj[0]; //默认取出第一个
            if (this.entity.syj) {
              //如果食药局的id不为空
              for (let i = 0; i < syj.length; i++) {
                if (this.entity.syj == syj[i].id) {
                  //匹配
                  defaultFirstSyj = syj[i];
                  this.initGrid(defaultFirstSyj.areaCode).then(() => {
                    resolve();
                  }); //初始化网格
                  return;
                }
              }
            }
            this.entity.syj = defaultFirstSyj.id;
            //拉取网格
          }
          resolve();
        });

      },
      //拉取网格信息
      async initGrid(gridAreaCode) { 
        return new Promise((resolve, reject) => {
          getGrid(gridAreaCode).then(results => {
            let grid = results.data;
            this.gridSelect = grid;
            if (grid && grid.length > 0) {
              if (this.handleState === 'add') {
                this.entity.grid = grid[0].id
              } else {
                if (this.isFirst) {
                  this.entity.grid = this.initData.grid
                } else {
                  this.entity.grid = grid[0].id
                }
              }
              this.gridSelectChange(this.entity.grid)
            } else {
              //重置数据.
              this.entity.grid = "";
              this.entity.so = "";
              this.entity.soPhone = "";
              this.entity.infoAssi = "";
              this.entity.infoAssiPhone = "";
              this.gridSelect = [];
              this.soSelect = [];
              this.infoAssiSelect = [];
            }
            this.validated();
            resolve();
          });
        });
      },
      async getSoEmp(gridId) {
        return new Promise((resolve, reject) => {
          getSupervisor(this.entity.syj, gridId).then(results => {
            let supervisor = results.data;
            this.soSelect = supervisor; //初始化监督人员下拉框值
            if (supervisor && supervisor.length > 0) {
              //监督人员默认选中
              let defaultFirstSupervisor = {};
              if (this.handleState === 'add') {
                defaultFirstSupervisor = supervisor[0]
              } else {
                if (this.isFirst) {
                  for (let i = 0; i < supervisor.length; i++) {
                    if (supervisor[i].id === this.initData.so) {
                      defaultFirstSupervisor = supervisor[i]
                      break
                    }
                  }
                } else {
                  defaultFirstSupervisor = supervisor[0]
                }
              }

              this.entity.so = defaultFirstSupervisor ? defaultFirstSupervisor.id : '';
              this.entity.soPhone = defaultFirstSupervisor ? defaultFirstSupervisor.phoneNumber : '';
            } else {
              this.entity.so = "";
              this.entity.soPhone = "";
            }
            this.validated();
            resolve();
          });
        });
      },
      async initInfoAssi(id) {
        return new Promise((resolve, reject) => {
          getInfoAssi(id).then(results => {
            let infoAssi = results.data;
            this.infoAssiSelect = infoAssi;
            if (infoAssi && infoAssi.length > 0) {
              let defaultFirstInfoAssi = {};
              if (this.handleState === 'add') {
                defaultFirstInfoAssi = infoAssi[0]
              } else {
                if (this.isFirst) {
                  for (let i = 0; i < infoAssi.length; i++) {
                    if (infoAssi[i].id == this.initData.infoAssi) {
                      defaultFirstInfoAssi = infoAssi[i];
                    }
                  }
                  this.isFirst = false
                } else {
                  defaultFirstInfoAssi = infoAssi[0]
                }
              }
              this.entity.infoAssi = defaultFirstInfoAssi.id;
              this.entity.infoAssiPhone = defaultFirstInfoAssi.phoneNumber;
            } else {
              this.entity.infoAssi = "";
              this.entity.infoAssiPhone = "";
            }
            this.validated();
          });
          resolve();
        });
      },
      //事件
      getGridChange(id) {
        this.isInit = true;
        for (let i = 0; i < this.syjSelect.length > 0; i++) {
          if (this.syjSelect[i].id == id) {
            this.isInit = false;
            this.initGrid(this.syjSelect[i].areaCode).then(() => {
              this.validated();
              return;
            });
          }
        }
      },
      gridSelectChange(id) {
        this.getSoEmp(id).then(() => {
          this.initInfoAssi(id).then(() => {
            this.validated();
          });
        });
      },
      soSelectChange(val) {
        if (this.soSelect) {
          for (let i = 0; i < this.soSelect.length; i++) {
            let supervisor = this.soSelect[i];
            if (val == supervisor.id) {
              this.entity.soPhone = supervisor.phoneNumber;
              this.validated();
              return;
            }
          }
          this.entity.soPhone = "";
        }
        this.validated();
      },
      infoAssiSelectChange(val) {
        if (this.infoAssiSelect && this.infoAssiSelect.length > 0) {
          for (let i = 0; i < this.infoAssiSelect.length; i++) {
            let infoAssi = this.infoAssiSelect[i];
            if (infoAssi.id == val) {
              this.entity.infoAssiPhone = infoAssi.phoneNumber;
              this.validated();
              return;
            }
          }
          this.entity.infoAssiPhone = "";
        }
        this.validated();
      },
      //验证
      submitSub() {
        return new Promise((resolve, reject) => {
          this.$refs["form"].validate(valid => {
            if (valid) {
              resolve();
            }
            throw new Error("表单验证出错");
          });
        });
      },
      reset() {
        this.$refs["form"].resetFields();
        getTowns().then(async r => {
          let towns = r.data;
          this.initSyj(towns).then(() => {
            this.validated();
          });;
        });
      },
      validated() {
        this.$emit("getData", this.entity);

      }
    }
  };
</script>

<style lang="scss" scoped>
  .right-info .content {
    width: 870px;
  }

  .row .el-form-item {
    min-width: 400px;
  }
</style>
