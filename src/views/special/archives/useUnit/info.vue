<template>
  <div>
    <el-form label-width="130px" class="demo-ruleForm labW150 right-info">
      <toggle-form title="基础信息">
        <div class="content">
          <div class="row">
            <el-form-item label="生产使用单位名称：">
              <el-input v-if="edit" placeholder="请输入生产使用单位名称" class="w312" @blur="autoAccount" v-model="datas.entityName"></el-input>
              <b v-if="edit">(必填)</b>
              <span v-else>{{datas.entityName?datas.entityName:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="生产使用单位编码：">
              <el-input v-if="edit" placeholder="请输入生产使用单位编码" class="w312" v-model="datas.code"></el-input>
              <span v-else>{{datas.code?datas.code:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="统一社会信用代码：">
              <el-input v-if="edit" placeholder="请输入统一社会信用代码" class="w312" v-model="datas.creditCode"></el-input>
              <span v-else>{{datas.creditCode?datas.creditCode:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="生产使用单位账号：">
              <el-input v-if="edit" placeholder="请输入生产使用单位账号" class="w312" v-model="datas.userName"></el-input>
              <b v-if="edit">(必填)</b>
              <span v-else>{{datas.userName?datas.userName:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="单位类别：">
              <el-select v-if="edit" class="w162" v-model="datas.unitCategoryList" placeholder="单位类别" clearable multiple collapse-tags>
                <el-option v-for="item in unitOptions" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <span v-else>{{datas.unitCategoryStr?datas.unitCategoryStr:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="场所类型：">
              <el-select v-if="edit" class="w162" v-model="datas.placeTypeList" placeholder="场所类型" clearable multiple collapse-tags>
                <el-option v-for="item in placeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
              <span v-else>{{datas.placeTypeStr?datas.placeTypeStr:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="设备大类：" class="onlyDiv">
              <span class="onlyDiv">{{datas.entityTypeStr?datas.entityTypeStr:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="负责人：">
              <el-input v-if="edit" placeholder="请输入负责人" class="w312" v-model="datas.corpPerson"></el-input>
              <span v-else>{{datas.corpPerson?datas.corpPerson:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="负责人联系电话：">
              <el-input v-if="edit" placeholder="请输入负责人联系电话" class="w312" v-model="datas.corpMobile"></el-input>
              <span v-else>{{datas.corpMobile?datas.corpMobile:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="安全管理部门：">
              <el-input v-if="edit" placeholder="请输入安全管理部门" class="w312" v-model="datas.safeManageDept"></el-input>
              <span v-else>{{datas.safeManageDept?datas.safeManageDept:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="安全管理人员：">
              <el-input v-if="edit" placeholder="请输入安全管理人员" class="w312" v-model="datas.safeManager"></el-input>
              <span v-else>{{datas.safeManager?datas.safeManager:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="安全管理手机：">
              <el-input v-if="edit" placeholder="请输入安全管理手机" class="w312" v-model="datas.safeManageMobile"></el-input>
              <span v-else>{{datas.safeManageMobile?datas.safeManageMobile:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="安全管理座机：">
              <el-input v-if="edit" placeholder="请输入安全管理座机" class="w312" v-model="datas.safeManageTel"></el-input>
              <span v-else>{{datas.safeManageTel?datas.safeManageTel:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item v-if="streetShow" label="所属街道：">
              <el-cascader v-if="edit" v-model='codeList' style="margin-left: 0 !important;" class="selectHeight w162" clearable
                placeholder="所属辖区" :options="deptsOptions.options" :props="deptsOptions.props" :change-on-select="true"
                :show-all-levels="false" @change="det">
              </el-cascader>
              <b v-if="edit">(必填)</b>
              <span v-else>{{datas.streetName?datas.streetName:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="所属网格：">
              <el-select v-if="edit" class="w162" v-model="datas.gridCode" placeholder="所属网格" clearable>
                <el-option v-for="item in streetCodeList" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
                </el-option>
              </el-select>
              <span v-else>{{datas.gridName?datas.gridName:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row w80content">
            <el-form-item label="生产使用单位地址：" class="onlyDiv">
              <el-input v-if="edit" placeholder="请输入生产使用单位地址，100字以内" maxlength="100" class="w300" v-model="datas.address"></el-input>
              <span v-else class="onlyDiv">{{datas.address?datas.address:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="经度：">
              <el-input v-if="edit" placeholder="请输入经度" class="w312" v-model="datas.lng"></el-input>
              <span v-else>{{datas.lng?datas.lng:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="纬度：">
              <el-input v-if="edit" placeholder="请输入纬度" class="w312" v-model="datas.lat"></el-input>
              <span v-else>{{datas.lat?datas.lat:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row w80content">
            <el-form-item label="备注：" class="onlyDiv">
              <el-input v-if="edit" placeholder="请输入备注，300字以内" maxlength="300" type="textarea" rows="5" class="w300" v-model="datas.remark"></el-input>
              <span v-else class="onlyDiv">{{datas.remark?datas.remark:'暂无'}}</span>
            </el-form-item>
          </div>
        </div>      
      </toggle-form>
    </el-form>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button v-if='edit' @click="add" :disabled="addStatus" type="primary">保存</el-button>
        <el-button v-else @click="editFun" type="primary">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { postEmployFind, postEmployEntityUpdate, postEmployGridList, autoAccount } from 'api/special/archives'
  import { findDeptGridNotStreet, getDicts } from 'api/common'

  import ToggleForm from "components/ToggleForm.vue";
  export default {
    data() {
      return {
        datas: {},
        edit:false,
        addStatus: false,
        streetCodeList: [],
        codeList: [],
        deptsOptions: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        },
        streetShow: true,
        placeOptions: [],
        unitOptions: [],
      }
    },
    mounted() {
      getDicts(['TZSB_PLACE_TYPE']).then(r => {
        this.placeOptions = r.data[0].list
      })
      getDicts(['TZSB_UNIT_TYPE']).then(r => {
        this.unitOptions = r.data[0].list
      })
      postEmployFind(this.$route.query.id).then(r => {
        this.datas = r.data;
      })
      findDeptGridNotStreet().then(r => {
        this.deptsOptions.options = r.data
      })
    },
    methods: {
      autoAccount(){
        autoAccount({"unitName":this.datas.entityName,"unitType":"EMPLOY"}).then(r => {
          if(r.status){
            this.datas.userName = r.data
          }
        })
      },
      add() {
        this.datas.account = this.datas.userName;
        if (this.datas.entityName == '') {
          this.$message.error('生产使用单位名称不能为空');
          return
        }
        if (this.datas.account == '') {
          this.$message.error('生产使用单位账号不能为空');
          return
        } else if (this.datas.account.length < 4) {
          this.$message.error('生产使用单位账号长度为4-16以内');
          return
        }
        if (this.datas.streetCode == undefined || this.datas.streetCode == "") {
          this.$message.error('请选择所属街道');
          return
        }
        this.addStatus = true;
        postEmployEntityUpdate(this.datas).then(r => {
          this.addStatus = false;
          if(r.status){
            this.edit = false;
            this.streetShow = true;
            if (r.status) {
              this.$message.success('编辑成功')
              postEmployFind(this.$route.query.id).then(r => {
                this.datas = r.data;
              })
            }
          }
        })
      }, 
      det(deptId) {
        if (deptId.length>0 && deptId[deptId.length - 1].length >= 10) {
          this.datas.streetCode = deptId[1];
          this.postEmployGridList(deptId[1])
          this.datas.gridCode = '';
        } else {
          this.datas.streetCode = '';
          this.streetCodeList = [];
          this.datas.gridCode = '';
        }
      },
      editFun() {
        if (this.$store.getters.user.areaCode.length == 2) {
          this.codeList.push(this.datas.streetCode.slice(0, 2));
          this.codeList.push(this.datas.streetCode.slice(0, 4));
          this.codeList.push(this.datas.streetCode.slice(0, 6));
          this.codeList.push(this.datas.streetCode);
          this.postEmployGridList(this.datas.streetCode)
        } else if (this.$store.getters.user.areaCode.length == 4) {
          this.codeList.push(this.datas.streetCode.slice(0, 4));
          this.codeList.push(this.datas.streetCode.slice(0, 6));
          this.codeList.push(this.datas.streetCode);
          this.postEmployGridList(this.datas.streetCode)
        } else if (this.$store.getters.user.areaCode.length == 6) {
          this.codeList.push(this.datas.streetCode.slice(0, 6));
          this.codeList.push(this.datas.streetCode);
          this.postEmployGridList(this.datas.streetCode)
        } else if (this.$store.getters.user.areaCode.length == 10) {
          this.datas.streetCode = this.$store.getters.user.areaCode;
          this.postEmployGridList(this.datas.streetCode)
          this.streetShow = false;
        } else if (this.$store.getters.user.areaCode.length >= 14) {
          this.datas.streetCode = this.$store.getters.user.areaCode.slice(0, 10);
          this.postEmployGridList(this.datas.streetCode)
          this.streetShow = false;
        }
        this.edit = true;
      },
      postEmployGridList(code) {
        postEmployGridList({ streetCode: code }).then(r => {
          this.streetCodeList = r.data[0].children
        })
      }
    },
    components: {
      ToggleForm
    }
  }
</script>

<style scoped lang="sass">
  .labW150{
    margin-bottom: 60px;
  }
  .onlyDiv{
    width: 100%;
    max-width: 100% !important;
  }
  .row{
    b{
      position: absolute;
      font-weight: 100;
      font-size: 12px;
      color: #A2AAB6;
      top: 0px;
      right: -45px;
    }
  }
</style>