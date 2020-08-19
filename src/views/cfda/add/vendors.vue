<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <div class="head-block">
        <span>信息完成度:<span class="num" style="margin-left:20px;">{{cfda.percentageNumber}}%</span></span>
        <el-progress :show-text="false" :percentage="cfda.percentageNumber" style="margin-top:5px;"></el-progress>
      </div>
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
          <p class="floatR right"><span>{{item.successNum}}</span>/<span>{{item.totalNum}}</span></p>
        </li>
      </ul>
    </div>
    <!-- 左边信息悬浮栏 end-->
    <div class="right-info">
      <el-form :model="cfda" :rules="rules" ref="cfda" label-width="110px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="三小名称:" prop="entityName">
                <el-input class="w200" :maxlength="200" v-model="cfda.entityName" placeholder="请输入三小名称"></el-input>
              </el-form-item>
            </div>


            <div class="row">
              <el-form-item label="三小备案时间:" prop="recordBegin">
                <el-date-picker class="w140"
                                v-model="cfda.recordBegin"
                                type="date"
                                placeholder="选择日期范围">
                </el-date-picker>
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 经营者信息 -->
        <toggle-form title="经营者信息">
          <div class="content">
            <div class="row">
              <el-form-item label="经营者姓名:" prop="corpName">
                <el-input class="w120" :maxlength="200" v-model="cfda.corpName" placeholder="例:张四李三"></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="mobile">
                <el-input class="w150" :maxlength="11" v-model="cfda.mobile" placeholder="例:13579246810"></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="身份证号:" prop="idNo">
                <el-input class="w300" v-model="cfda.idNo" :maxlength="18"  placeholder="请输入18位身份证号"></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="户籍地址:" prop="censusReg">
                <el-input class="w300" :maxlength="255" v-model="cfda.censusReg" placeholder="请输入户籍所在地址"></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="通讯地址:" prop="address">
                <el-input class="w300" :maxlength="255" v-model="cfda.address" placeholder="请输入通讯地址"></el-input>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">
            <div class="row">
              <el-form-item label="经营形态:" prop="mngType">
                <el-select v-model="cfda.mngType" placeholder="请选择">
                  <el-option
                    v-for="item in mngTypeSelect"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="从业人数:" prop="empNumber">
                <el-input class="w120" :maxlength="11" v-model="cfda.empNumber"  placeholder="例:20"></el-input>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="营业状态:" prop="manageState">
                <el-select class="w200" v-model="cfda.manageState" placeholder="请选择营业状态">
                  <el-option  v-for="item in manageStateSelect" :label="item.name" :value="item.key" :key="item.key">{{item.name}}</el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="食品销售:">
                <btn-select :data="projectSidBtn"
                            @changeData="projectSidChange">
                </btn-select>
                <!--<p style="color: #ff4949;font-size: 12px;" v-if="cfda.foodSales.length == 0">请至少选择一项</p>-->

              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="食品制售:">
                <el-checkbox-group @change="blurCount" v-model="cfda.foodProd" size="large">
                  <el-checkbox-button v-for="item in foodSalesBtn" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="详细经营信息:">
                <yb-select
                  @getSelectData="getDetailedSelect"
                  :selectData="detailedEngageItem"
                  :checkedData="detailedEngage"
                  showFlied="name"
                  childFlid="children"
                  id='id'>
                </yb-select>
              </el-form-item>
              <span style="color: #A2AAB6;font-size:12px;margin-right:40%;float: right;margin-top: 10px;">(选填)</span>
            </div>
          </div>
        </toggle-form>

        <!-- 场地信息 -->
        <toggle-form title="场地信息">
          <div class="content">
            <div class="row">
              <el-form-item label="摊贩类型:">
                <el-radio-group @change="blurCount" v-model="cfda.pedlarType">
                  <el-radio-button label="FLOW" name="pedlarType">流动摊贩</el-radio-button>
                  <el-radio-button label="FIXE" name="pedlarType">固定摊贩</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

            <div v-if="cfda.pedlarType == 'FLOW'">
              <div class="row">
                <el-form-item label="经营区域:" prop="placeBiz">
                  <el-input class="w150"  :maxlength="255" v-model="cfda.placeBiz"  placeholder="请输入经营区域"></el-input>
                </el-form-item>
              </div>
            </div>

            <div v-if="cfda.pedlarType == 'FIXE'">
              <div class="row">
                <el-form-item label="场所分布:" prop="spaceDst">
                  <el-checkbox-group v-model="cfda.spaceDst" size="large">
                    <el-checkbox-button v-for="item in spacedstSelect" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="加工地址:" prop="placeWork">
                  <el-input class="w150"  :maxlength="255" v-model="cfda.placeWork"  placeholder="请输入加工地址"></el-input>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="经营区域:" prop="placeBiz">
                  <el-input class="w150"  :maxlength="255" v-model="cfda.placeBiz"  placeholder="请输入经营区域"></el-input>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="经营时间段:" prop="placeTime">
                  <el-time-select class="w150" :editable="false"
                                  :picker-options="{start: '00:00',step: '00:30',end: '23:30'}"
                                  v-model="cfda.placeTimeBegin"  placeholder="请选择经营时间"></el-time-select>
                  到
                  <el-time-select :editable="false"
                                  class="w150" v-model="cfda.placeTimeEnd" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}"  placeholder="请选择经营时间"></el-time-select>
                </el-form-item>
              </div>
            </div>

          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form title="责任落实">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:" prop="syj">
                <el-select class="w200" v-model="cfda.syj" @change="getGridChange" placeholder="请选择食药所">
                  <el-option
                    v-for="item in syjSelect"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所在网格:" prop="grid" >


                <el-select class="w200" v-model="cfda.grid" placeholder="请选择所属网格" @change="gridSelectChange" :disabled="cfda.syj == ''">
                  <el-option
                    v-for="item in gridSelect"
                    :key="item.id"
                    :label="item.deptName.replace('\t','')"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="监管人员:" prop="so">
                <el-select class="w200" v-model="cfda.so" @change="soSelectChange" placeholder="请选择监管人员" :disabled="cfda.grid == ''">
                  <el-option
                    v-for="item in soSelect"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="cfda.so != ''" style="margin-left:80px;">监管人员联系方式:
                                    <span style="margin-left:20px;">{{cfda.soPhone}}</span>
                                </span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="网格信息员:" prop="infoAssi">
                <el-select class="w200" v-model="cfda.infoAssi" @change="infoAssiSelectChange" placeholder="请选择信息员" :disabled="cfda.grid == ''">
                  <el-option
                    v-for="item in infoAssiSelect"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="cfda.infoAssi != ''" style="margin-left:80px;">网格信息员联系方式:
                                    <span style="margin-left:20px;">{{cfda.infoAssiPhone}}</span>
                                </span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 人员信息 -->
        <toggle-form title="人员信息">
          <div class="ipt-btn-box" style="margin:20px 0 20px 0">
            <el-button type="primary" @click="addEmp">添加人员 </el-button>
          </div>

          <el-table :data="cfda.emps" style="width: 100%" v-if="cfda.emps && cfda.emps.length > 0">

            <el-table-column  label="姓名" width="150">
              <template slot-scope="scope">
                <el-input  class="w120" :maxlength="200" v-model="scope.row.empName" @blur="empNameBlur" placeholder="例:王维"></el-input>
              </template>
            </el-table-column>


            <el-table-column  label="身份证号"  >
              <template slot-scope="scope">
                <el-input  class="w200" :maxlength="18" v-model="scope.row.empIdNo" @blur="idNoBlur" placeholder="请输入18位身份证号"></el-input>
              </template>

            </el-table-column>

            <el-table-column  label="有无健康证明">
              <template slot-scope="scope">
                <el-select class="w150" v-model="scope.row.hasHealthyCard" @change="empsHealthyCardNoBlur">
                  <el-option label="有" value="YES" ></el-option>
                  <el-option label="无" value="NO" ></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column  label="健康证号">
              <template slot-scope="scope" >
                <el-input  class="w200" v-model="scope.row.healthyCardNo" @blur="empsHealthyCardNoBlur" :disabled="scope.row.hasHealthyCard == 'NO'" :maxlength="32"  placeholder="请输入健康证号"></el-input>
              </template>
            </el-table-column>

            <el-table-column  label="备注">
              <template slot-scope="scope">
                <el-input  class="w200" v-model="scope.row.remark"  :maxlength="255" placeholder="请输入备注"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="removeEmp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p style="color: #ff4949" v-if="cfda.empsNameError">请输入姓名</p>
          <p style="color: #ff4949" v-if="cfda.empsIdNoEmptyError">请输入身份证号</p>
          <p style="color: #ff4949" v-if="cfda.empsIdNoError">请输入正确的身份证号</p>
          <p style="color: #ff4949" v-if="cfda.empsHealthyCardNo">请输入健康证号</p>

        </toggle-form>

        <!-- 附件上传 -->
        <toggle-form title="附件上传">
          <attachment-upload @delete="handleRemoveFile" @uploadChange="uploadChange" style="margin-top: 20px;" :options="options" v-model="updated"></attachment-upload>
        </toggle-form>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1000">
      <div>
        <el-button style="width:120px;" @click="addBackup">保存到草稿箱</el-button>
        <el-button type="primary" :disabled="yes" :class="yes ? 'no':''" @click="addCfda">提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import BtnSelect from "components/BtnSelect.vue";
  import { addCfda, addAutoSave, getSyj, getGrid, getSoEmp, getInfoAssi, getAutoSave, addBackup, getBackup, removeFile } from "api/cfda/add.js";
  import { floatValid, idNoValid, phoneValid, intValid } from 'utils/validate'
  import { listDictUserItemByDictCode, listDictUserItemByCodeAll,getEnums } from 'api/common.js';
  import scroll from "utils/scroll";
  import YbPopup from 'components/ybpopup/YbPopup';
  import YbSelect from 'components/ybselect/YbSelect.vue'
  import AttachmentUpload from 'components/AttachmentUpload/index';
  import { getBase }from "api/enforce/punish";

  export default {
    components: {
      ToggleForm,
      BtnSelect,
      YbPopup,
      YbSelect,
      AttachmentUpload
    },
    beforeDestroy(){
    },
    async mounted(){
      //滚动效果
      scroll.call(this,'slideIndex');
      // 图片服务器地址
      getBase().then(result =>{
        this.filePath = result.data.filePath;

      })

      //拉取字典
      //经营业态
      listDictUserItemByDictCode("CFDA_W_SUB").then((r) =>{
        this.mngTypeSelect = r.data;
      });
      //拉取字典
      //主营项目
      listDictUserItemByDictCode("CFDA_W_MAKE").then((r) =>{
        this.foodSalesBtn = r.data;
      });

      //详细经营信息
      listDictUserItemByCodeAll("OTHER_MANAGEMENT").then((r) =>{
        this.detailedEngageItem = r.data;
      });

      //获取经营状态
      getEnums(['com.ybveg.govx.enums.ManageStateEnum'],false).then((r) => {
        this.manageStateSelect = r.data
      });
      //拉取字典
      listDictUserItemByDictCode("CFDA_W_SALE").then((r) =>{
        let list1 = r.data;
        let list2 = [];
        for (let i = 0;i < list1.length;i++){
          let item = list1[i];
          let indexof = item.path.indexOf('.');
          if (indexof == -1 ){
            let path = item.path + '.';
            list2.push(item);
            for (let j = 0;j < list1.length;j++){
              let item2 = list1[j];
              indexof = item2.path.indexOf(path);
              if (indexof == 0){
                item.children = item.children?item.children:[];
                item.children.push(item2);
              }
            }
          }
        }
        for (let i = 0;i < list2.length;i++){
          let item = list2[i];
          if (item.children && item.children.length > 0){
            this.$set(item, 'hasChildren', true);
          }else {
            this.$set(item, 'hasChildren', false);
          }
          if (item.check){
            this.$set(item, 'active', true);
            this.$set(item, 'cname', item.check.name);
            this.$set(item, 'ccode', item.check.code);
          }else {
            this.$set(item, 'active', false);
            this.$set(item, 'cname', '');
            this.$set(item, 'ccode', '');
          }
        }
        this.projectSidBtn = list2;
      });
      //拉取字典
      //场所分布
      listDictUserItemByDictCode("OTHER_PLACE").then((r) =>{
        this.spacedstSelect = r.data;
      });
      let syjData = await getSyj();
      this.syjSelect = syjData.data;

      if (this.$route.query.edit){
          this.flag=true;
        getBackup(this.$route.query.edit).then((r) => {
          let data = r.data;
          if (data.recordBegin){
            data.recordBegin = new Date(data.recordBegin);
          } else{
            data.recordBegin = new Date();
          }
          let psb = this.projectSidBtn;
          for (let i = 0; i < r.data.foodSales.length;i++){
            let fs = r.data.foodSales[i];
            for (let j = 0;j < psb.length;j++){
              let psbitem = psb[j];
              let indexof = fs.indexOf(psbitem.code);
              if (indexof == 0){
                if(psbitem.code == fs){
                  psbitem.active = true;
                  psbitem.ccode = psbitem.code;
                  psbitem.cname = psbitem.name;
                }else {
                  let children = psbitem.children
                  for (let o = 0;o < children.length;o++){
                    if(fs == children[o].code){
                      psbitem.active = true;
                      psbitem.ccode = children[o].code;
                      psbitem.cname = children[o].name;
                    }
                  }
                }
              }
            }
          }
          r.data.grid_a = r.data.grid;
          r.data.infoAssi_a = r.data.infoAssi;
          this.cfda = r.data;
          this.detailedEngage = r.data.detailedEngage;
          this.getGridChange(this.cfda.syj)
          // 附件上传
          this.handleFile(r.data.fileList);
           this.$nextTick(() => {
             this.flag=false;
             this.addAutoSave()
           });
        })
      }else{
        if(this.syjSelect[0]&&this.syjSelect.length>0){
          this.cfda.syj=this.syjSelect[0].id
          this.getGridChange(this.cfda.syj)
        }
      }
      if (this.$route.query.auto){

        this.flag=true;
        getAutoSave().then((r) =>{
          if(!r.status){
            this.$message({
              message: r.message,
              type: r.level
            });
            return;
          }
          let data = r.data;
          if (data.type != 'VENDORS') return;
          if (data.recordBegin){
            data.recordBegin = new Date(data.recordBegin);
          } else{
            data.recordBegin = new Date();
          }
          let psb = this.projectSidBtn;
          for (let i = 0; i < r.data.foodSales.length;i++){
            let fs = r.data.foodSales[i];
            for (let j = 0;j < psb.length;j++){
              let psbitem = psb[j];
              let indexof = fs.indexOf(psbitem.code);
              if (indexof == 0){
                if(psbitem.code == fs){
                  psbitem.active = true;
                  psbitem.ccode = psbitem.code;
                  psbitem.cname = psbitem.name;
                }else {
                  let children = psbitem.children
                  for (let o = 0;o < children.length;o++){
                    if(fs == children[o].code){
                      psbitem.active = true;
                      psbitem.ccode = children[o].code;
                      psbitem.cname = children[o].name;
                    }
                  }
                }
              }
            }
          }
          r.data.grid_a = r.data.grid;
          r.data.infoAssi_a = r.data.infoAssi;
          this.cfda = r.data;
          this.detailedEngage = r.data.detailedEngage;
          this.getGridChange(this.cfda.syj)
          // 附件上传
          this.handleFile(r.data.fileList);
          this.$nextTick(() => {
            this.flag=false;
            this.addAutoSave()
          });
        })
      }

    },
    methods: {
      handleRemoveFile(id){
        for(var i = 0;i< id.length;i++){
          removeFile(id[i]);

        }
        // this.addAutoSave()
      },
      uploadChange () {
        this.addAutoSave()
      },
      getDetailedSelect(val) {
        this.cfda.detailedEngage = val;
        this.blurCount();
      },
      gridSelectChange(id){
        this.getSoEmp(id)
        this.getInfoAssi(id);
      },
      placeTimeValid(rule,value,callback) {
        if (this.cfda.placeTimeBegin != '' && this.cfda.placeTimeEnd != ''){
          callback();
        }else{
          callback(new Error('请选择经营时间段'));
        }
      },

      addBackup(){
        addBackup(this.cfda).then((r) => {
          if(!r.status){
            this.$message({
              message: r.message,
              type: r.level
            });
            return;
          }
          this.cfda.backupId = r.data;
          this.$message({
            message:'保存草稿成功!',
            type: 'success'
          });
        });
      },
      async getGrid(syj){
        await getGrid(syj).then((results) => {
          let grid = results.data;
          this.gridSelect = grid;
          if (grid && grid.length > 0){
            let grid0 = grid[0];
            if (this.cfda.grid_a && this.cfda.grid_a != ''){
              this.cfda.grid_a = '';
          }else{
            this.cfda.grid = grid0.id;
          }
          this.gridSelectChange(this.cfda.grid)
          }else{
            //重置数据.
            this.cfda.grid = '';
            this.cfda.so = '';
            this.cfda.soPhone = '';
            this.cfda.infoAssi = '';
            this.cfda.infoAssiPhone = '';
            this.gridSelect = [];
            this.soSelect = [];
            this.infoAssiSelect = [];
          }
        });
      },
      getGridChange(id){
        for (let i = 0;i < this.syjSelect.length > 0;i++){
          if(this.syjSelect[i].id  == id){
            this.getGrid(this.syjSelect[i].areaCode);
            return;
          }
        }
      },
      handleFile(fileList) {
        for (var i = 0; i < this.options.length; i++) {
          for(var j = 0; j< fileList.length; j++){
            if (this.options[i].field === fileList[j].colu) {
              this.updated.push({"field":fileList[j].colu,"id":fileList[j].id,"url":this.filePath+fileList[j].fileId});
            }
          }
        }
      },
      async getSoEmp(id){
        await getSoEmp(id).then((results) => {
          let so = results.data;

          this.soSelect = so;
          if (so && so.length > 0){
            let so0 = so[0];
            this.cfda.so = so0.id;
            this.cfda.soPhone = so0.phoneNumber;
          }else {
            this.cfda.so = '';
            this.cfda.soPhone = '';
          }
        });
      },
      async getInfoAssi(id){
        await getInfoAssi(id).then((results) => {
          let infoAssi = results.data;
          this.infoAssiSelect = infoAssi;
          if (infoAssi && infoAssi.length > 0){
            let infoAssi0 = infoAssi[0];
            if (this.cfda.infoAssi_a && this.cfda.infoAssi_a != ''){
              for (let i = 0;i < infoAssi.length;i++){
                if (this.cfda.infoAssi_a == infoAssi[i].id){
                  infoAssi0 = infoAssi[i];
                  break;
                }
              }
              this.cfda.infoAssi_a = '';
            }
            this.cfda.infoAssi = infoAssi0.id;
            this.cfda.infoAssiPhone = infoAssi0.phoneNumber;
          }else {
            this.cfda.infoAssi = '';
            this.cfda.infoAssiPhone = '';
          }
        });
      },

      soSelectChange(val){
        if (this.soSelect){
          for (let i = 0;i < this.soSelect.length;i++){
            let so = this.soSelect[i];
            if (val && val == so.id) {
              this.cfda.soPhone = so.phoneNumber
              return
            }
          }
        }
      },
      infoAssiSelectChange(val){
        if (this.infoAssiSelect){
          for (let i = 0;i < this.infoAssiSelect.length;i++){
            let infoAssi = this.infoAssiSelect[i];
            if (infoAssi.id == val){
              this.cfda.infoAssiPhone = infoAssi.phoneNumber;
              return;
            }
          }
          this.cfda.infoAssiPhone = '';
        }
      },
      projectSidChange(data){
        let project = [];
        for (let i = 0;i < data.length;i++ ){
          let item = data[i];
          if (item.ccode && item.ccode != ''){
            project.push(item.ccode);
          }
        }
        this.cfda.foodSales = project;
        this.blurCount();
      },
      addEmp(){
        let len = this.cfda.empsIndex++;
        this.cfda.emps.push({
          id:len,
          empName:'',
          empIdNo:'',
          healthyCardNo:'',
          remark:'',
          hasHealthyCard:"YES"
        });
        this.blurCount();
      },
      removeEmp(val){
        let index = this.cfda.emps.indexOf(val);
        if (index > -1) {
          this.cfda.emps.splice(index, 1);
        }
        this.empNameBlur();
        this.idNoBlur();
        this.empsHealthyCardNoBlur();
        this.blurCount();
      },
      addCfda(){
        // if (this.cfda.foodSales.length == 0){
        //   return;
        // }

        this.empNameBlur();
        this.idNoBlur();
        this.empsHealthyCardNoBlur();
        if(this.cfda.empsNameError
          || this.cfda.empsIdNoEmptyError
          || this.cfda.empsIdNoError
          || this.cfda.empsHealthyCardNo){
          return;
        }

        this.flag = true;
        this.$refs['cfda'].validate((valid) => {
          this.flag = false;
          if (valid){
            this.$confirm('是否要提交审核?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              addCfda(this.cfda).then((r) =>{
                if(!r.status){
                  this.$message({
                    message: r.message,
                    type: r.level
                  });
                  return;
                }
                this.$message({
                  message:'三小提交审核成功!!',
                  type: 'success'
                });
                this.$refs['cfda'].resetFields();
                this.$router.push({ name: "cfda.add.draft" });
              })
            });
          }
        });
      },
      addAutoSave(){
        if(this.flag==false && this.cfda.percentageNumber > 40){
          addAutoSave(this.cfda);
        }
      },

      idNoBlur(){
        let emps = this.cfda.emps;
        for (let i = 0;i < emps.length;i++){
          let emp = emps[i];
          let empIdNo = emp.empIdNo;
          if ( !empIdNo && empIdNo == ''){
            this.cfda.empsIdNoEmptyError = true;
            this.cfda.empsIdNoError = false;
            return;
          }

          if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(empIdNo)){
            this.cfda.empsIdNoError = true;
            this.cfda.empsIdNoEmptyError = false;
            return;
          }
        }
        this.cfda.empsIdNoEmptyError = false;
        this.cfda.empsIdNoError = false;
      },

      empsHealthyCardNoBlur(){
        let emps = this.cfda.emps;
        for (let i = 0;i < emps.length;i++){
          let emp = emps[i];
          let no = emp.healthyCardNo;
          let has = emp.hasHealthyCard;
          if (has == 'YES'){
            if (!no && no == ''){
              this.cfda.empsHealthyCardNo = true;
              return;
            }
          }else{
            this.cfda.emps[i].healthyCardNo = '';
          }
        }
        this.cfda.empsHealthyCardNo = false
      },

      empNameBlur(){
        let emps = this.cfda.emps;
        for (let i = 0;i < emps.length;i++) {
          let emp = emps[i];
          let name = emp.empName;
          if (!name && name == ''){
            this.cfda.empsNameError = true;
            return true;
          }
        }
        this.cfda.empsNameError = false;
        return false;
      }

      ,

      blurCount(rule,value,callback){
        if(callback){
          callback();
        }
        let cnt1 = 0;
        if (this.cfda.entityName != '') cnt1++;
        if (this.cfda.recordBegin != '') cnt1++;
        this.progress[0].successNum = cnt1;

        cnt1 = 0;
        if (this.cfda.corpName != '') cnt1++;
        if (this.cfda.mobile != '') cnt1++;
        if (this.cfda.idNo != '') cnt1++;
        if (this.cfda.censusReg != '') cnt1++;
        if (this.cfda.address != '') cnt1++;
        this.progress[1].successNum = cnt1;

        cnt1 = 0;
        if (this.cfda.mngType != '') cnt1++;
        if (this.cfda.empNumber != '') cnt1++;
        if (this.cfda.manageState != '') cnt1++;
        if (this.cfda.foodSales.length > 0) cnt1++;
        if (this.cfda.foodProd.length > 0) cnt1++;
        if (this.cfda.detailedEngage.length > 0) cnt1++;
        this.progress[2].successNum = cnt1;

        cnt1 = 0;
        if (this.cfda.pedlarType == 'FLOW'){
          this.progress[3].totalNum = 0;
        }else{
          this.progress[3].totalNum = 5;
          if (this.cfda.spaceDst.length > 0) cnt1++;
          if (this.cfda.placeWork != '') cnt1++;
          if (this.cfda.placeBiz != '') cnt1++;
          if (this.cfda.placeTimeBegin != '') cnt1++;
          if (this.cfda.placeTimeEnd != '') cnt1++;
        }
        this.progress[3].successNum = cnt1;

        cnt1 = 0;
        if (this.cfda.syj != '') cnt1++;
        if (this.cfda.grid != '') cnt1++;
        if (this.cfda.so != '') cnt1++;
        if (this.cfda.infoAssi != '') cnt1++;
        this.progress[4].successNum = cnt1;

        if (this.cfda.emps.length > 0) {
          this.progress[5].successNum = 1;
        }else{
          this.progress[5].successNum = 0;
        };

        let total = 0;
        let success = 0;
        for (let i = 0; i< this.progress.length;i++){
          total += this.progress[i].totalNum;
          success += this.progress[i].successNum;
        }
        this.cfda.percentageNumber = new Number(((success / total)* 100).toFixed(0)) * 1;
        if (this.cfda.percentageNumber > 40){          this.addAutoSave();        }
      }
    },
    data() {
      return {
        flag:false,
        //百分比
        percentageNumber:0,
        slideIndex:-1,
        syjSelect:[],
        gridSelect:[],
        soSelect:[],
        infoAssiSelect:[],
        projectSidBtn:[],
        detailedEngage:[],
//        licStateSelect: [],
        manageStateSelect: [],
        //备案有效期时间选择
        recordDateSelect:[{
          label:'三年',
          value:3
        },{
          label:'二年',
          value:2
        },{
          label:'一年',
          value:1
        }],



        mngTypeSelect:[],
        spacedstSelect:[],
        detailedEngageItem:[],
        foodSalesBtn:[],

        checkboxGroup1: [],
        radio3: "",
        yes: false,

        rules: {
          entityName: [
            { required: true, message: '请输入主体名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          bizLic:[
            { required: true, message: '请输入营业执照注册号', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          creditCode:[
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          recordBegin:[
            { type: 'date',required: true, message: '请选择主体备案日期', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          manageState: [
            { required: true, message: '请选择经营状态', trigger: 'change' },
            { validator: this.blurCount, trigger: 'change' }
          ],
          corpName:[
            { required: true, message: '请输入经营者姓名', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: phoneValid, trigger:'blur' },
            {validator:this.blurCount,trigger:'blur'}
          ],
          idNo:[
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { validator: idNoValid, trigger:'blur' },
            {validator:this.blurCount,trigger:'blur'}
          ],
          censusReg:[
            { required: true, message: '请输入户籍地址', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          address:[
            { required: true, message: '请输入通讯地址', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          mngType:[
            { required: true, message: '请选择经营形态', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          empNumber:[
            { required: true, message: '请输入从业人数', trigger: 'blur' },
            { validator: intValid, trigger:'blur' },
            { min: 1, max: 7, message: '长度为在 1 到 7 位的整数', trigger: 'blur' },
            {validator:this.blurCount,trigger:'blur'}
          ],
          projectMain:[
            { type:'array',required: true, message: '请选择主营项目', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          spaceDst:[
            { type:'array',required: true, message: '请选择场所分布', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          spaceArea:[
            { required: true, message: '请输入经营面积数值', trigger: 'blur' },
            {validator:floatValid,trigger:'blur'},
            {validator:this.blurCount,trigger:'blur'}
          ],
          spaceAddr:[
            { required: true, message: '请输入场所地址', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          syj:[
            { required: true, message: '请选择食药所', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          grid:[
            { required: true, message: '请选择网格', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          so:[
            { required: true, message: '请选择监管人员', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          infoAssi:[
            { required: true, message: '请选择网格信息员', trigger: 'change' }
            ,{validator:this.blurCount,trigger:'change'}
          ],
          landlordName:[
            { required: true, message: '请输入房东姓名', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          landlordPhone:[
            { required: true, message: '请输入房东手机号', trigger: 'blur' },
            { validator: phoneValid, trigger:'blur' },
            {validator:this.blurCount,trigger:'blur'}
          ],
          placeWork:[
            { required: true, message: '请输入加工地址', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          placeBiz:[
            { required: true, message: '请输入经营区域', trigger: 'blur' }
            ,{validator:this.blurCount,trigger:'blur'}
          ],
          placeTime:[
            { validator: this.placeTimeValid, trigger:'change' },
            { validator: this.placeTimeValid, trigger:'blur' },
            {validator:this.blurCount,trigger:'change'}
          ]

        },
        cfda: {
          percentageNumber:0,
          emps: [],
          empsIndex:0,

          empsNameError:false,
          empsIdNoEmptyError:false,
          empsIdNoError:false,
          empsHealthyCardNo:false,

          deptId:'',
          areaCode:'',
          type:'VENDORS',

          //基础信息
          entityName:'',
          bizLic:'',
          creditCode:'',
          recordBegin:new Date(),
          recordEnd:3,
          recordNum:3,

          //经营者信息
          corpName:'',
          mobile:'',
          idNo:'',
          censusReg:'',
          address:'',

          //创建信息
          createUser:'',
          createTime:'',

          //经营信息
          mngType: '',
          empNumber: '',
          projectMain: [],
          projectSid: [],
          prodForm: [],
          prodType: [],
          prodVariety:[],
          foodSales: [],
          foodProd: [],
          detailedEngage:[],
          manageState: '',

          //场所信息
          pedlarType:'FLOW',
          spaceDst: [],
          spaceArea: '',
          spaceAddr: '',
          placeWork: '',
          placeBiz: '',
          placeTimeBegin: '',
          placeTimeEnd: '',


          //责任落实信息
          syj: '',
          grid: '',
          so: '',
          soPhone:'',
          infoAssi: '',
          infoAssiPhone: '',
          landlordName: '',
          landlordPhone: '',

          //附件
          fileList: []

        },
        filePath: "",

        // 左边悬浮栏的数据
        progress:[
          {
            title:'基础信息',
            successNum:0,
            totalNum:2
          },
          {
            title:'经营者信息',
            successNum:0,
            totalNum:5
          },
          {
            title:'经营信息',
            successNum:0,
            totalNum:6
          },
          {
            title:'场地信息',
            successNum:0,
            totalNum:1
          },
          {
            title:'责任落实',
            successNum:0,
            totalNum:4
          },
          {
            title: '人员信息',
            successNum: 0,
            totalNum: 1
          },
          {
            title: '附件上传',
            successNum: 0,
            totalNum: 5
          },
        ],

      options:[
        {
          label:"备案申请书",
          field:"FILING_APPLICATION"
        },
        {
          label:"营业执照副本",
          field:"BUSINESS_LICENSE_COPY"
        },
        {
          label:"场地证明",
          field:"PLACE_PROOF"
        },
        {
          label:"健康证",
          field:"HEALTH_CARD"
        },
        {
          label:"身份证",
          field:"IDENTITY_CARD"
        },
      ],
      updated:[]

    }
  },

  watch: {
    updated(val) {
      let sub = [];
      for(let item of val){
        if(sub.includes(item.field)) continue;
        sub.push(item.field);
      }
      this.progress[6].successNum = sub.length;
      this.cfda.fileList = val;
    }
  }
  }
</script>

<style lang="scss" scoped>
  // 左边悬浮信息栏的样式 start
  $c:#0db5ef;

  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: -100px;
  // z-index: 2;

  .head-block{
    background: #F2F5F8;
    height: 70px;
    padding:14px 20px;
    box-sizing: border-box;
  .num{
    color: $c;
  }
  }
  .main-block{
    margin-top: 20px;
  // border-right: 2px solid #EBF1F5;
  // min-height: 470px;
  >li{
    border-right: 2px solid #EBF1F5;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    cursor: default;
  &:hover{
     background: #F2F5F8;
   }
  .right{
    color: #A2AAB6;
  }
  }
  .activePosition{
    border-right: 2px solid $c;
  .left{color:$c}
  }
  }
  }
  // 左边悬浮信息栏的样式 end

     .right-info {
       width: 100%;
     }

  // .content {
     //   padding-left: 25%;
     //   margin-top: 20px;
     // }
</style>
