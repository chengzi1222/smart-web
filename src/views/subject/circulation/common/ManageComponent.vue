<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm labW150">
    <toggle-form title="经营信息">
      <div class="content">
        <div class="row">
          <div class="row">
            <el-form-item label="经营面积:" prop="spaceArea">
              <el-input @blur="validated" class="w150" :maxlength="9" v-model="entity.spaceArea" placeholder="例：120"></el-input>&nbsp;m²
            </el-form-item>

            <el-form-item label="场所分布:">
              <el-checkbox-group @change="validated" v-model="entity.spaceDst" size="large">
                <el-checkbox-button v-for="item in spaceDstSelect" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="经营场所:" prop="spaceAddr">
              <el-input @blur="validated" class="w300" :maxlength="50" v-model="entity.spaceAddr" placeholder="请输入经营场所"></el-input>
              <span class="w250 tip">请真实填写，可在地理信息定位系统中展示，如：XX省XX市XX区/县XX镇XX街XX号</span>
              <span style="color: #A2AAB6;font-size:12px;margin-left:10px;float: right;">(必填)</span>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="实际经营场所地址:">
              <el-input @blur="validated" class="w300" :maxlength="50" v-model="entity.realityAddr" placeholder="请输入实际经营场所地址"></el-input>
              <span class="w250 tip">(选填：如果注册地址与实际经营地址不符，则在此处录入实际经营地址)</span>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="从业人数:" prop="empNumber">
              <el-input class="w120" @blur="validated" :maxlength="6" v-model="entity.empNumber" placeholder="例：20"></el-input>
            </el-form-item>

            <el-form-item label="主体业态:">
              <dict-select @change="validated" class="w200" v-model="entity.subType" dict="CB_SUB" placeholder="请选择主体业态"></dict-select>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="经济性质:">
              <enum-select @change="validated" class="w200" v-model="entity.econType" enum="com.ybveg.govx.enums.BusinessNatureEnum" placeholder="请选择经济性质"></enum-select>
            </el-form-item>

            <el-form-item label="营业状态:">
              <enum-select @change="validated" class="w200" v-model="entity.manageState" enum="com.ybveg.govx.enums.ManageStateEnum" placeholder="请选择营业状态"></enum-select>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="经营项目:">
              <btn-select ref="btnSelect" :data="operProBtnSelect" @changeData="operProBtnChange"></btn-select>
              <el-checkbox-group @change="validated" v-model="entity.operPro">
                <el-checkbox-button v-for="item in operProBtn" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </div>


          <div class="row">
            <el-form-item label="详细经营信息:">
              <yb-select @getSelectData="getDetailedSelect" :selectData="detailedEngageItem" :checkedData="detailedEngageChecked" showFlied="alias"
                childFlid="children" id='id'>
              </yb-select>
            </el-form-item>
          </div>

        </div>
      </div>
    </toggle-form>
  </el-form>
</template>

<script>
  import BtnSelect from "components/BtnSelect.vue";
  import YbSelect from "components/ybselect/YbSelect.vue";
  import EnumSelect from "components/common/EnumSelect";
  import DictSelect from "components/common/DictSelect";
  import { floatValid, intValid } from "utils/validate";
  import {
    listDictUserItemByDictCode,
    listDictUserItemByCodeAll
  } from "api/common";
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    components: {
      EnumSelect,
      DictSelect,
      YbSelect,
      ToggleForm,
      BtnSelect
    },
    mounted() {
      //场所分布
      listDictUserItemByDictCode("OTHER_PLACE").then(r => {
        this.spaceDstSelect = r.data;
      });

      listDictUserItemByDictCode("CB_MANAGEMENT").then(r => {
        let managementBtn = this.groupOperBtn(r.data);
        if (managementBtn) {
          this.operProBtn = managementBtn.btn;
          this.operProBtnSelect = managementBtn.select;
        }
        this.editEcho(); //编辑回显
      });

      //详细经营信息
      listDictUserItemByCodeAll("OTHER_MANAGEMENT").then(r => {
        this.detailedEngageItem = r.data;
        this.editEcho(); //编辑回显
      });

      this.editEcho(); //编辑回显
      this.validated();
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
        spaceDstSelect: [], //场所分布
        detailedEngageItem: [],
        detailedEngageChecked: [], //详细经营信息
        operProBtn: [],
        operProBtnSelect: [],
        //主体基础信息字段
        entity: {
          spaceArea: null, //经营面积
          spaceDst: [], //场所分布
          spaceAddr: null, //经营场所
          realityAddr: null,
          empNumber: null, //从业人数
          subType: null, //主体业态
          econType: null, //经济性质
          manageState: null, //营业状态
          detailedEngage: [], //详细经营信息
          operPro: [], //经营项目
          operProMore: []
        },
        //验证
        rules: {
          spaceArea: [
            { required: false, message: "请输入经营面积数值", trigger: "blur" },
            { validator: floatValid, trigger: "blur" }
          ],
          spaceAddr: [
            { required: true, message: "请输入场所地址", trigger: "blur" }
          ],
          empNumber: [
            { required: false, message: "请输入从业人数", trigger: "blur" },
            { validator: intValid, trigger: "blur" },
          ],
        }
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
          if (
            this.operProBtnSelect.length > 0 &&
            this.initData.operPro &&
            this.initData.operPro.length > 0
          ) {
            let allNeedInitOperPro = this.initData.operPro;
            let operPro = [];
            let operProMore = [];
            let operProSelectBtn = this.operProBtnSelect;
            allNeedInitOperPro.forEach(item => {
              let isExist = false;
              if (item) {
                operProSelectBtn.forEach(allOperPro => {
                  let childIndexOf = item.indexOf(allOperPro.code);
                  if (childIndexOf == 0) {
                    isExist = true;
                    if (allOperPro.code == item) {
                      allOperPro.active = true;
                      allOperPro.ccode = allOperPro.code;
                      allOperPro.cname = allOperPro.name;
                    } else {
                      let allChildren = allOperPro.children;
                      allChildren.forEach(children => {
                        if (item == children.code) {
                          allOperPro.active = true;
                          allOperPro.ccode = children.code;
                          allOperPro.cname = children.name;
                        }
                      });
                    }
                  }
                });
              }
              if (isExist) {
                operProMore.push(item);
              } else {
                operPro.push(item);
              }
            });
            this.entity.operPro = operPro;
            this.entity.operProMore = operProMore;
          }
          if (
            this.detailedEngageItem.length > 0 && this.initData.detailedEngage.length > 0
          ) {
            this.detailedEngageChecked = [];
            this.initData.detailedEngage.forEach(checkingCode => {
              this.detailedEngageItem.forEach(allItem => {
                if (checkingCode == allItem.code) {
                  this.detailedEngageChecked.push(allItem);
                }
              });
            });
            return;
          }
          Object.keys(this.entity).forEach(key => {
            if (this.initData[key]) {
              this.entity[key] = this.initData[key];
            }
          });
          this.$refs["form"].validate();
        }
      },
      validated() {
        this.$emit("getData", this.entity);
      },
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
        this.entity.detailedEngage = [];
        this.detailedEngageChecked = [];
        this.entity.operProMore = [];
        this.entity.operPro = [];
        this.$refs["btnSelect"].reset();
        this.$refs["form"].resetFields();
      },
      getDetailedSelect(val) {
        let selectedCode = [];
        if (val && val.length > 0) {
          val.forEach(codeItem => {
            if (codeItem.level != 1) {
              selectedCode.push(codeItem.code);
            }
          });
        }
        this.entity.detailedEngage = selectedCode;
        this.validated();
      },
      groupOperBtn(rdata) {
        let list1 = rdata;
        let list2 = [];
        let list3 = [];
        for (let i = 0; i < list1.length; i++) {
          let item = list1[i];
          let indexof = item.path.indexOf(".");
          if (indexof == -1) {
            let path = item.path + ".";
            for (let j = 0; j < list1.length; j++) {
              let item2 = list1[j];
              indexof = item2.path.indexOf(path);
              if (indexof == 0) {
                item.children = item.children ? item.children : [];
                item.children.push(item2);
              }
            }
            if (item.children && item.children.length > 0) {
              list3.push(item);
            } else {
              list2.push(item);
            }
          }
        }
        this.buliderOperBtn(list2);
        this.buliderOperBtn(list3);
        return {
          btn: list2,
          select: list3
        };
      },
      buliderOperBtn(list) {
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (item.children && item.children.length > 0) {
            this.$set(item, "hasChildren", true);
          } else {
            this.$set(item, "hasChildren", false);
          }
          if (item.check) {
            this.$set(item, "active", true);
            this.$set(item, "cname", item.check.name);
            this.$set(item, "ccode", item.check.code);
          } else {
            this.$set(item, "active", false);
            this.$set(item, "cname", "");
            this.$set(item, "ccode", "");
          }
        }
      },
      operProBtnChange(data) {
        let project = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.ccode && item.ccode != "") {
            project.push(item.ccode);
          }
        }
        this.entity.operProMore = project;
        this.validated();
      }
    }
  };
</script>


<style lang="scss" scoped>
  .selectHeight {
    margin-left: 0px !important;
  }
</style>