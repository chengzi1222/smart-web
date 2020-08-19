<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <toggle-form title="许可备案信息">
        <div class="content">
            <div class="row">
            <el-form-item label="是否多证合一:" v-if="entityType == 'MAAI_MANAGER'" prop="multInOne">
                <el-select  @change="multInOneChange"  class="w200 selectHeight" v-model="entity.multInOne" placeholder="请选择是否多证合一" style="margin-left: 0px !important;">
                  <el-option v-for="item in multInOneList" :key="item.key" :label="item.name" :value="item.key">
                  </el-option>
                </el-select>
                <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
            </el-form-item>
            </div>
            <div class="row">
              <el-form-item :label="entityType === 'MAAI_PRODUCT' ? '生产类别' : '经营类别'" prop="category">
                  <!-- <el-checkbox-group @change="categoryChange" v-model="entity.category">
                    <el-checkbox-button v-for="item in categoryList" :label="item.key" :key="item.key">{{item.name}}</el-checkbox-button>
                  </el-checkbox-group> -->
                  <el-button v-for="item in categoryList" v-show="entityType == 'MAAI_PRODUCT' || (entityType != 'MAAI_PRODUCT'&&item.name !='Ⅰ类经营备案')"
                             @click="changeBtn(item.key)" :type="entity.category.indexOf(item.key) >= 0 ? 'primary':''" :key="item.key">
                    {{item.name}}
                  </el-button>
                  <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(多选，必填)</span>
              </el-form-item>
            </div>
        </div>
        <!-- 许可证 -->
        <Card v-if="entityType === 'MAAI_PRODUCT'" v-for="licence in entity.licences" :key="licence.$index" @getData="validated" :licence="licence" :showType="'add'" :ref="entityType + licence.licenceType"></Card>
        <manager-card v-if="entityType === 'MAAI_MANAGER' && entity.multInOne === 'NO'" v-for="licence in entity.licences" :key="licence.$index" @getData="validated" :licence="licence" :showType="'add'" :ref="entityType + licence.licenceType"></manager-card>
        <mult-in-one-card v-if="entityType === 'MAAI_MANAGER' && entity.multInOne === 'YES'" v-for="licence in entity.licences" :key="licence.$index" @getData="validated" :licence="licence" :showType="'add'" :ref="entityType + licence.licenceType"></mult-in-one-card>
    </toggle-form>
  </el-form>
</template>

<script  type="module">
import ToggleForm from "components/ToggleForm.vue"
import EnumSelect from "components/common/EnumSelect"
import ManagerCard from './managerCard'
import multInOneCard from './multInOneCard'
import * as common from "api/common"
import Card from './card'

export default {
  components: {
    EnumSelect,
    ToggleForm,
    Card,
    ManagerCard,
    multInOneCard
  },
  mounted() {
    if (this.entityType == 'MAAI_MANAGER') {
      common.getEnums(['com.ybveg.govx.enums.YesNoEnum'], false).then(r => {
        this.multInOneList = r.data
      })
      common.getEnums(['com.ybveg.govx.enums.maai.MaaiManagerCategoryEnum'], false).then(r => {
        this.categoryList = r.data
      })
    }
    if (this.entityType == 'MAAI_PRODUCT') {
      common.getEnums(['com.ybveg.govx.enums.maai.MaaiProductCategoryEnum'], false).then(r => {
        this.categoryList = r.data
      })
    }
    this.validated();
  },
  props: {
    initData: {
      type: Object
    },
    outs: {
      type: Number
    },
    entityType: {
      type: String
    },
    type: {
      type: String
    },
    registerAddr: {
      type: String
    },
    otherAddr: {
      type: String
    }
  },
  data() {
    return {
      multInOneIsFirst: true,
      categoryIsFirst: true,
      registerAddrLabel:'注册经营场所：',
      registerAddrPlaceholder:'请输入注册经营场所',
      multInOneList:[],
      categoryList: [],
      //主体基础信息字段
      entity: {
        multInOne: '',
        category:[],//详细信息
        licences: [] // 许可证信息
      },
      //验证
      // 生产必须验证注册场所和营业状态
      // 经营必须验证注册场所和营业状态，经营方式，企业形态，是否网络经营
      // 使用必须验证注册场所和营业状态，企业形态
      rules: {
        multInOne: [
          { required: true, message: "请选择是否多证合一", trigger: "change" }
        ],
        category: [
          { required: true, message: "请选择使用/经营/生产类别", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    changeBtn(key) {
      if(this.entity.category.indexOf(key) < 0){
        // 添加
        this.entity.category.push(key)
        this.categoryChange()
      } else {
        // 删除
        this.$confirm('此更改操作将会造成已输入的部分许可备案信息清空，是否确认更改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.entity.category.splice(this.entity.category.indexOf(key),1)
          this.categoryChange()
        }).catch(() => {
              
        })
      }
    },
    getDetailedSelect(val) {
      this.entity.detailedEngage = val;
      this.validated()
    },
    multInOneChange() {
      this.entity = JSON.parse(JSON.stringify(this.entity))
      this.entity.licences = []
      if (this.entity.category.length !== 0) {
        if (this.entity.multInOne === 'YES') {
          this.entity.licences.push({licenceType: 'MULT_CATEGORY', licenceState: 'EFFECTIVE', maaiLicenceExts: []})
          this.entity.category.forEach(type => {
            this.entity.licences[0].maaiLicenceExts.push({licenceType: type, scopeVersion: 'TWO_THOUSAND_TWO'})
          })
        } else {
          this.entity.category.forEach(type => {
            this.entity.licences.push({licenceType: type, licenceState: 'EFFECTIVE', manageType: 'OTHER', spaceAddr: this.registerAddr, otherAddr: this.otherAddr, maaiLicenceExts: [{licenceType: type, scopeVersion: 'TWO_THOUSAND_TWO'}, {licenceType: type, scopeVersion: 'TWO_THOUSAND_SERVENTEEN'}]})
          })
        }
      }
      this.validated()
    },
    categoryChange() {
      if (this.entityType === 'MAAI_PRODUCT') {
        this.productCategoryChange()
      } else {
        this.managerCategoryChange()
      }
    },
    managerCategoryChange() {
      if (this.entity.category.length === 0) { // 清空
        this.entity.licences = []
      } else {
        const newCategoryStr = this.entity.category.join(',')
        if (this.entity.multInOne === 'YES') {
          if (this.entity.licences.length === 0) {
            this.entity.licences.push({licenceType: 'MULT_CATEGORY', licenceState: 'EFFECTIVE', maaiLicenceExts: []})
          }
          let beforCategoryStr = ''
          this.entity.licences[0].maaiLicenceExts.forEach(ext => {
            beforCategoryStr += ext.licenceType
          })

          // 增加
          this.entity.category.forEach(type => {
            if (!beforCategoryStr.includes(type)) {
              this.entity.licences[0].maaiLicenceExts.push({licenceType: type, scopeVersion: 'TWO_THOUSAND_TWO'})
            }
          })

          // 删除
          for (let i = 0; i < this.entity.licences[0].maaiLicenceExts.length; i++) {
            if (!newCategoryStr.includes(this.entity.licences[0].maaiLicenceExts[i].licenceType)) {
              this.entity.licences[0].maaiLicenceExts.splice(i, 1)
              i--
            }
          }
        } else {
          let beforCategoryStr = ''
          this.entity.licences.forEach(licence => {
            beforCategoryStr += licence.licenceType
          })

          // 增加
          this.entity.category.forEach(type => {
            if (!beforCategoryStr.includes(type)) {
              this.entity.licences.push({licenceType: type, licenceState: 'EFFECTIVE', manageType: 'OTHER', spaceAddr: this.registerAddr, otherAddr: this.otherAddr, maaiLicenceExts: [{licenceType: type, scopeVersion: 'TWO_THOUSAND_TWO'}, {licenceType: type, scopeVersion: 'TWO_THOUSAND_SERVENTEEN'}]})
            }
          })

          // 删除
          for (let i = 0; i < this.entity.licences.length; i++) {
            if (!newCategoryStr.includes(this.entity.licences[i].licenceType)) {
              this.entity.licences.splice(i, 1)
              i--
            }
          }
        }
      }
    },
    productCategoryChange () {
      if (this.entity.category.length === 0) { // 清空
        this.entity.licences = []
      } else {
        const newCategoryStr = this.entity.category.join(',')
        if (newCategoryStr.includes('ONE_CATEGORY')) {
          let isOne = false
          this.entity.licences.forEach(licence => {
            if (licence.licenceType === 'ONE_CATEGORY') {
              isOne = true
            }
          })
          if (!isOne) {
            this.entity.licences.push({licenceType: 'ONE_CATEGORY', licenceState: 'EFFECTIVE', spaceAddr: this.registerAddr, otherAddr: this.otherAddr, maaiLicenceExts: [{licenceType: 'ONE_CATEGORY', scopeVersion: 'TWO_THOUSAND_TWO'}]})
          }
        } else {
          for (let i = 0; i < this.entity.licences.length; i++) {
            if (this.entity.licences[i].licenceType === 'ONE_CATEGORY') {
              this.entity.licences.splice(i, 1)
              break
            }
          }
        }
        if (newCategoryStr.includes('TWO_CATEGORY') || newCategoryStr.includes('THREE_CATEGORY')) {
          // {licenceType: 'TWO_CATEGORY', scopeVersion: 'TWO_THOUSAND_TWO'}, {licenceType: 'THREE_CATEGORY', scopeVersion: 'TWO_THOUSAND_TWO'}
          let isProduct = false
          this.entity.licences.forEach(licence => {
            if (licence.licenceType === 'PRODUCT_CATEGORY') {
              isProduct = true
            }
          })
          if (!isProduct) {
            this.entity.licences.push({licenceType: 'PRODUCT_CATEGORY', licenceState: 'EFFECTIVE', spaceAddr: this.registerAddr, otherAddr: this.otherAddr, maaiLicenceExts: []})
          }
          let beforCategoryStr = ''
          let productIndex
          for (let i = 0; i < this.entity.licences.length; i++) {
            if (this.entity.licences[i].licenceType === 'PRODUCT_CATEGORY') {
              productIndex = i
              break
            }
          }
          this.entity.licences[productIndex].maaiLicenceExts.forEach(ext => {
            beforCategoryStr += ext.licenceType
          })

          // 增加
          this.entity.category.forEach(type => {
            if (type !== 'ONE_CATEGORY') {
              if (!beforCategoryStr.includes(type)) {
                this.entity.licences[productIndex].maaiLicenceExts.push({licenceType: type, scopeVersion: 'TWO_THOUSAND_TWO'})
              }
            }
          })

          // 删除
          for (let i = 0; i < this.entity.licences[productIndex].maaiLicenceExts.length; i++) {
            if (!newCategoryStr.includes(this.entity.licences[productIndex].maaiLicenceExts[i].licenceType)) {
              this.entity.licences[productIndex].maaiLicenceExts.splice(i, 1)
              i--
            }
          }
        } else {
          for (let i = 0; i < this.entity.licences.length; i++) {
            if (this.entity.licences[i].licenceType === 'PRODUCT_CATEGORY') {
              this.entity.licences.splice(i, 1)
              break
            }
          }
        }
      }
      this.validated()
    },
    validated() {
      if (this.entityType === 'MAAI_PRODUCT') {
        delete this.entity['multInOne']
      }
      this.$emit("getData", this.entity);
    },
    submitSub() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          let checkCard = true
          if (this.entity.category && this.entity.category.length > 0) {
            let categoryStr = this.entity.category.join(',')
            let licenceTypes = []
            if (this.entityType === 'MAAI_PRODUCT') {
              if (categoryStr.includes('ONE_CATEGORY')) {
                licenceTypes.push('ONE_CATEGORY')
              } 
              if (categoryStr.includes('TWO_CATEGORY') || categoryStr.includes('THREE_CATEGORY')) {
                licenceTypes.push('PRODUCT_CATEGORY')
              }
            } else if (this.entityType === 'MAAI_MANAGER') {
              if (this.entity.multInOne === 'YES') {
                licenceTypes.push('MULT_CATEGORY')
              } else {
                licenceTypes = this.entity.category
              }
            }
            for (let i = 0; i < licenceTypes.length; i++) {
              let md = this.$refs[this.entityType + licenceTypes[i]][0]
              if (!(md.licenceNoChange() & md.licenceStateChange())) {
                checkCard = false
              }
            }
          } else {
            checkCard = false
          }
          if (valid && checkCard) {
            resolve()
          }
          throw new Error("表单验证出错")
        })
      });
    },
    reset() {
      this.$refs["form"].resetFields();
    },
  },
  watch: {
    initData () {
      Object.keys(this.entity).forEach(key => {
        this.entity[key] = this.initData[key]
      })
    },
    outs() {
      this.entity = {
        multInOne: 'NO',
        category:[],//详细信息
        licences: [] // 许可证信息
      }
    },
    type () {
      if (this.type === 'add') {
        this.entity.multInOne = 'NO'
      }
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
</style>
