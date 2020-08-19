<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <toggle-form title="基础信息">
        <div class="content">
            <div class="row">
              <el-form-item label="主体名称:" prop="entityName">
                  <el-input @blur="validated" class="w200" v-model="entity.entityName" :maxlength="30" placeholder="请输入主体名称"></el-input>
                  <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
              </el-form-item>
              <el-form-item label="统一社会信用代码:" prop="creditCode" title="(组织机构代码证)">
                  <el-input @blur="creditCodeChange" class="w200" v-model="entity.creditCode" :maxlength="30" ref="creditCode" placeholder="请输入统一社会信用代码"></el-input>
                  <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
                  <div class="popupDiv" v-if="!entity.creditCode">请输入统一社会信用代码</div>
                  <div class="popupDiv" v-if="creditCodeDisplay && entity.creditCode">
                    统一社会信用代码被占用,
                    <a @click="toInfo" style="cursor: pointer">查看主体详情</a>
                  </div>
              </el-form-item>
            </div>
            <div class="row" v-if="entityType==='MAAI_EMPLOY'">
              <el-form-item label="医疗机构执业许可证:" prop="employNo">
                  <el-input @blur="validated" class="w200" v-model="entity.employNo" :maxlength="30" placeholder="请输入医疗机构执业许可证"></el-input>
              </el-form-item>
            </div>
            <div class="row">
                <el-form-item label="法人姓名:" prop="legalPerson">
                    <el-input @blur="validated" class="w200" v-model="entity.legalPerson" :maxlength="30" placeholder="请输入法人姓名"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证:" prop="legalNo">
                    <el-input @blur="validated" class="w200" v-model="entity.legalNo" :maxlength="30" placeholder="请输入法人身份证号"></el-input>
                </el-form-item>
            </div>
            <div class="row">
                <el-form-item label="质量负责人:" prop="corpPerson">
                    <el-input @blur="validated" class="w200" v-model="entity.corpPerson" :maxlength="30" placeholder="请输入负责人姓名"></el-input>
                </el-form-item>
                <el-form-item label="负责人电话:" prop="legalMobile">
                    <el-input @blur="validated" class="w200" v-model="entity.legalMobile" :maxlength="11" placeholder="请输入法人电话"></el-input>
                </el-form-item>
            </div>
            <div class="row">
                <el-form-item label="联系人:" prop="contactPerson">
                    <el-input @blur="validated" class="w200" v-model="entity.contactPerson" :maxlength="30" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="contactMobile">
                    <el-input @blur="validated" class="w200" v-model="entity.contactMobile" :maxlength="11" placeholder="请输入联系人电话"></el-input>
                </el-form-item>
            </div>
        </div>
    </toggle-form>
  </el-form>
</template>

<script  type="module">
  import ToggleForm from "components/ToggleForm.vue";
  import * as entity from 'api/medicalDevices/entity'
  export default {
    components: {
      ToggleForm
    },
    mounted() {
      this.validated();
    },
    props: {
      initData: {
        type: Object
      },
      outs: {
        type: Number
      },
      entityType:{
        type: String
      }
    },
    data() {
      const validNumber = (rule, value, callback) => {
        if (value && !/^1[0-9]{1,10}/.test(value)) {
          callback(new Error('电话格式不正确'))
        } else {
          callback()
        }
      };
      const validNo = (rule, value, callback) => {
        if (value && !/^[a-zA-Z0-9][a-zA-Z0-9]{1,18}[a-zA-Z0-9]$/.test(value)) {
          callback(new Error('身份证格式不正确'))
        } else {
          callback()
        }
      };
      return {
        //主体基础信息字段
        entity: {
          id: '', // 主体id
          entityName: '', //主体名称
          creditCode: '', //统一社会信用代码
          employNo: '', // 医疗许可证
          legalPerson: '', //法人姓名
          legalMobile: '', // 法人电话
          legalNo: '', // 法人身份证
          corpPerson: '', // 负责人,
          contactPerson: '', // 联系人,
          contactMobile: '', // 联系人电话
        },
        creditCodeDisplay: false,
        checkCreditCodeId: '',
        //验证
        rules: {
          entityName: [
            { required: true, message: "请输入主体名称", trigger: "blur" },
          ],
          legalMobile: [
            {validator: validNumber, trigger: 'blur'}
          ],
          contactMobile: [
            {validator: validNumber, trigger: 'blur'}
          ],
          legalNo: [
            {validator: validNo, trigger: 'blur'}
          ]
        },
      };
    },
    methods: {
      validated() {
        this.$emit("getData", this.entity);
      },
      submitSub() {
        return new Promise((resolve, reject) => {
          this.$refs["form"].validate(valid => {
            if (valid) {
              resolve();
            }
            throw new Error("表单验证出错")
          });
        });
      },
      reset() {
        this.$refs["form"].resetFields();
      },
      async creditCodeChange () {
        this.validated()
        if (this.entity.creditCode) {
          await entity.checkCreditCode(this.entityType, this.entity.creditCode).then(r => {
            if (r.status) {
              if (r.data) {
                if (r.data !== this.entity.id) {
                  this.checkCreditCodeId = r.data
                  this.creditCodeDisplay = true
                  // return false
                } else {
                  this.creditCodeDisplay = false
                  // return true
                }
              } else {
                this.creditCodeDisplay = false
                // return true
              }
            } else {
              this.$message({message: r.message, type: 'warning'})
              this.creditCodeDisplay = true
              // return false
            }
          })
          // setTimeout(() => { console.log('睡眠3秒') }, 3000)
          // return !this.creditCodeDisplay
        } else {
          this.creditCodeDisplay = false
          // return false
        }
      },
      toInfo () {
        let routerName
        if (this.entityType === 'MAAI_EMPLOY') {
          routerName = 'medicalDevices_sub.employ.detail'
        } else if (this.entityType === 'MAAI_PRODUCT') {
          routerName = 'medicalDevices_sub.product.detail'
        } else if (this.entityType === 'MAAI_MANAGER') {
          routerName = 'medicalDevices_sub.manager.detail'
        }
        if (routerName && this.checkCreditCodeId && this.entityType) {
          this.$router.push({name: routerName, query: {entityType: this.entityType, ext: 'INFO', entityId: this.checkCreditCodeId}})
        }
      }
    },
    watch: {
      initData () {
        Object.keys(this.entity).forEach(key => {
          this.entity[key] = this.initData[key]
        })
      },
      outs(){
        this.entity = {
          id: '', // 主体id
          entityName: '', //主体名称
          creditCode: '', //统一社会信用代码
          employNo: '', // 医疗许可证
          legalPerson: '', //法人姓名
          legalMobile: '', // 法人电话
          legalNo: '', // 法人身份证
          corpPerson: '', // 负责人,
          contactPerson: '', // 联系人,
          contactMobile: '', // 联系人电话
        }
        this.$emit('reset',0)
      }
    }
  };
</script>


<style lang="scss" scoped>
  .right-info .content {
    width: 870px;
    margin: 20px auto 0;
  }
  .row .el-form-item {
    min-width: 400px;
  }
  .popupDiv{
    position: absolute;
    top: 30px;
    left: 0;
    font-size: 12px;
    color: #f56c6c;
  }
</style>
