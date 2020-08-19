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
              <el-input @blur="validated" class="w120" :maxlength="6" v-model="entity.empNumber" placeholder="例：20"></el-input>
            </el-form-item>

            <el-form-item label="主体业态:">
              <dict-select @change="validated" class="w200" v-model="entity.subType" dict="PB_SUB" placeholder="请选择主体业态"></dict-select>
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
            <el-form-item label="经营类别:">
              <el-checkbox-group v-model="entity.operType" size="large" @change="validated">
                <el-checkbox-button v-for="operType1 in operTypeBtn" :label="operType1.code" :key="operType1.id">{{operType1.name}}</el-checkbox-button>
              </el-checkbox-group>
              <div>
                <el-button class="more-btn" @click="moreClick">更多食品类别</el-button>
              </div>
              <search-tap v-if="showMore" :checkbox="operTypeMoreCheck" :ajax='getOperTypeMoreItem' listFiled="data" text="name" checkedListFiled="checked"
                @searchTapChange="operTypeMoreSearchChange" placeholder="请输入搜索信息,例:酒">
              </search-tap>
            </el-form-item>
          </div>

          <div class="row mingxi">
            <el-form-item label="经营明细:">
              <search-tap :ajax='getOperDetailItem' :checkbox="operDetailCheck" listFiled="data" text="name" checkedListFiled="checked"
                @searchTapChange="detailSearchChange" placeholder="请输入搜索信息,例:酒">
              </search-tap>
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
  import SearchTap from "components/SearchTap.vue";
  import YbSelect from "components/ybselect/YbSelect.vue";
  import EnumSelect from "components/common/EnumSelect";
  import DictSelect from "components/common/DictSelect";
  import { floatValid, intValid } from "utils/validate";
  import {
    listDictUserItemByDictCode,
    listDictUserItemByCodeAll
  } from "api/common";
  import { getByAreaCode } from "api/admin/area";
  import { getOperTypes, getProd, getOperDetail } from "api/sub/add";
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    components: {
      EnumSelect,
      DictSelect,
      SearchTap,
      YbSelect,
      ToggleForm
    },
    mounted() {
      //场所分布
      listDictUserItemByDictCode("OTHER_PLACE").then(r => {
        this.spaceDstSelect = r.data;
      });

      this.editEcho();

      //详细经营信息
      listDictUserItemByCodeAll("OTHER_MANAGEMENT").then(res => {
        this.detailedEngageItem = res.data;
        this.editEcho(); //编辑回显

        //生产主体经营类别
        getOperTypes(this.entity.operType, "PB_CATEGORY").then(r => {
          //获取经营类别
          this.operTypeBtn = r.data;
        });

        //经营明细
        getOperDetail("PB_VARIETY", this.entity.operDetail).then(r => {
          this.entity.operDetail = [];
          if (r.data && r.data.length > 0) {
            this.operDetailCheck = r.data;
            r.data.forEach(item => {
              this.entity.operDetail.push(item.code);
            });
          }
        });
      });
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
        showMore: false,
        spaceDstSelect: [], //场所分布
        operDetailCheck: [], //经营经营明细搜索选中字典项
        operTypeBtn: [], //经营类别
        operTypeMoreCheck: [], //经营类别搜索选中字典项
        detailedEngageItem: [],
        detailedEngageChecked: [], //详细经营信息
        //主体基础信息字段
        entity: {
          spaceArea: null, //经营面积
          spaceDst: [], //场所分布
          spaceAddr: null, //经营场所
          realityAddr: null,//实际经营地址
          empNumber: null, //从业人数
          subType: null, //主体业态
          econType: null, //经济性质
          manageState: null, //营业状态
          operType: [], //经营类别
          operDetail: [], //经营明细
          operTypeMoreCode: [], //经营类别搜索选中字CODE
          detailedEngage: [] //详细经营信息
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
          Object.keys(this.entity).forEach(key => {
            if (this.initData[key]) {
              this.entity[key] = this.initData[key];
            }
          });
          if (
            this.detailedEngageItem &&
            this.detailedEngageItem.length > 0 &&
            this.initData &&
            this.initData.detailedEngage &&
            this.initData.detailedEngage.length > 0
          ) {
            this.detailedEngageChecked = [];
            this.initData.detailedEngage.forEach(checkingCode => {
              this.detailedEngageItem.forEach(allItem => {
                if (checkingCode == allItem.code) {
                  this.detailedEngageChecked.push(allItem);
                }
              });
            });
          }
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
        this.entity.operDetail = [];
        this.entity.operType = [];
        this.operTypeMoreCheck = [];
        this.operDetailCheck = [];
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
      moreClick() {
        this.showMore = !this.showMore;
        if (!this.showMore) {
          this.operTypeMoreCheck = [];
          this.entity.operTypeMoreCode = [];
        }
      },
      getOperTypeMoreItem(a) {
        return new Promise((resolve, reject) => {
          let tbtn = this.operTypeBtn;
          let types = [];
          for (let i = 0; i < tbtn.length; i++) {
            types.push(tbtn[i].code);
          }
          getProd("PB_CATEGORY", a, types).then(r => {
            let list = r.data;
            for (let i = 0; i < list.length; i++) {
              list[i].key = list[i].code;
            }
            let rest = {
              data: list
            };
            resolve(rest);
          });
        });
      },
      getOperDetailItem(a) {
        return new Promise((resolve, reject) => {
          getProd("PB_VARIETY", a).then(r => {
            let list = r.data;
            for (let i = 0; i < list.length; i++) {
              list[i].key = list[i].code;
            }
            let rest = {
              data: list,
              checked: this.operDetailCheck
            };
            resolve(rest);
          });
        });
      },
      //当searchTap组件选项变化时触发
      operTypeMoreSearchChange(checked) {
        this.entity.operTypeMoreCode = [];
        if (checked && checked.length > 0) {
          checked.forEach(item => {
            this.entity.operTypeMoreCode.push(item.code);
          });
        }
        this.validated();
      },
      detailSearchChange(checked) {
        let operDetail = [];
        this.operDetailCheck = checked;
        if (checked && checked.length > 0) {
          checked.forEach(item => {
            operDetail.push(item.code);
          });
        }
        this.entity.operDetail = operDetail;
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
<style lang="sass">
  .mingxi .search-tap .tab-box {
    height: 622px;
    overflow: scroll;
  }
</style>