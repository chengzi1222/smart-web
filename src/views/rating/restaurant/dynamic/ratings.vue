<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">动态评分</span>
    </div>
    <div class="container">
      <el-form :model="repatrol" :rules="rules" ref="repatrol" label-width="140px" class="demo-ruleForm">
        <!-- 基本信息 -->
        <toggle-form title="基本信息">
          <div class="content ">
            <div class="row rowDjpd">
              <el-form-item label="主体名称:">
                <span>{{baseInfo.entityName ? baseInfo.entityName  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row rowDjpd">
              <el-form-item label="地址:">
                <span>{{baseInfo.address ? baseInfo.address  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="许可备案号:">
                <span> {{baseInfo.licNo ? baseInfo.licNo  : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="社会信用代码:">
                <span>{{baseInfo.creditCode ? baseInfo.creditCode  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="负责人:">
                <span>{{baseInfo.corpName ? baseInfo.corpName  : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="联系方式:">
                <span>{{baseInfo.mobile ? baseInfo.mobile  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="主体类型:">
                <span>{{baseInfo.entityTypeStr ? baseInfo.entityTypeStr  : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="主体业态:" v-if="baseInfo.entityType=='RESTAURANT'">
                <span>{{baseInfo.subTypeStr ? baseInfo.subTypeStr  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="监管类型:" v-if="baseInfo.entityType=='RESTAURANT'">
                <span>{{baseInfo.superviseTypeStr ? baseInfo.superviseTypeStr  : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="分管网格:">
                <span>{{baseInfo.grid ? baseInfo.grid  : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 巡查项 -->
        <toggle-form title="检查项">
          <div class="content row ">
            <el-form-item :label="tableList.length > 0? '更换要点表:':'选择要点表:'">
              <el-button size="medium" round @click="showTip = true">{{formName}}</el-button>
            </el-form-item>
          </div>
          <div class="mT35" v-if="tableList">
            <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''" :data="item"
              :span-method="tableOption" border class="table-div brN">
              <el-table-column show-overflow-tooltip prop="projectsNo" label="检查项编号" min-width="120"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="检查项目" min-width="120"></el-table-column>
              <el-table-column show-overflow-tooltip prop="ruleStr" label="分值统计" min-width="120"></el-table-column>
              <el-table-column show-overflow-tooltip prop="contextNo" label="检查内容编号" min-width="120"></el-table-column>
              <el-table-column show-overflow-tooltip prop="context" label="检查内容" min-width="200"></el-table-column>
              <el-table-column show-overflow-tooltip prop="score" label="分值" min-width="50"></el-table-column>
              <el-table-column align="center" label="评价结果" min-width="250">
                <template slot-scope="scope">
                  <single-checkbox :absent='scope.row.absent' :currentRowData="scope.row"
                    @singlecheckboxchange="singlecheckboxchange">
                  </single-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注" min-width='180'>
                <template slot-scope="scope">
                  <input type="text" class="w140" v-model="scope.row.remark" :maxlength="100"
                    :disabled="scope.row.result=='NOTSELECT'" placeholder="备注前先选择评价结果">
                </template>
              </el-table-column>
              <el-table-column align="center" label="附件" min-width='80'>
                <template slot-scope="scope">
                  <el-upload action="/api/upload" :before-upload="beforeUpPic" :on-success="picSuccess"
                    :on-error="uploadError" :data="{type:'',field:'PHOTO'}" :show-file-list="false">
                    <el-button type="default" style="background:#F6F7F8;margin-right:20px;" @click="getRow(scope.row)">
                      上传
                    </el-button>
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column label="附件" min-width="120">
                <template slot-scope="scope" v-if="scope.row.isShowFile">
                  <div class="accessoryList">
                    <span class="movePoin" @mouseenter="accessoryList($event,scope.row)"
                      @mouseleave="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form label-width="140px" class="demo-ruleForm">
            <div class="content">
              <div class="row ">
                <el-form-item label="分数统计选项:">
                  {{tableBaseData.statisticsOptions=='YES'?'是':'否'}}
                </el-form-item>
              </div>
              <div class="row ">
                <el-form-item label="备注:">
                  {{tableBaseData.remark?tableBaseData.remark:'暂无'}}
                </el-form-item>
              </div>
            </div>
          </el-form>
        </toggle-form>
        <!-- 检查结果 -->
        <toggle-form title="检查结果">
          <div class="content">
            <div class="row ml30 mb20 textC" style="color: #6D7787;">
              本次检查，检查项{{project.total}}项，总分{{project.totalScore}}分，经检得分：<span
                style="font-size:24px;color:#0DB5EF">{{project.score}}</span> 分
            </div>
            <div class="row bottomContent">
              <el-form-item label="检查人：" prop="inspectorId">
                <el-select v-model="repatrol.inspectorId" class="w250 " placeholder="请输入搜索复查人员" filterable remote
                  reserve-keyword :remote-method="inspectorUserIdMethod" :loading="inspectorListLoading"
                  @change="inspectorUserIdChange">
                  <el-option :data-tel='item.inspectedUserTel' v-for="item in inspectorList" :key="item.inspectorUserId"
                    :label="item.inspectorUserName" :value="item.inspectorUserId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="手机号：" prop="tel">
                <el-input v-model="repatrol.tel" class="w250" @input="change($event)" :maxlength="11"
                  placeholder="请输入手机号">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="备注：">
                <el-input v-model="repatrol.remarks" class="w250" :maxlength="200" type="textarea"
                  placeholder="请输入备注，200以内" :rows="4">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="食品安全负责人：" prop="foodSafetyPerson">
                <el-input v-model="repatrol.foodSafetyPerson" class="w250" :maxlength="20" placeholder="请输入食品安全负责人">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="手机号：" prop="foodSafetyPersonTel">
                <el-input v-model="repatrol.foodSafetyPersonTel" class="w250" :maxlength="11" placeholder="请输入手机号">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="企业电子签名：" prop="cooperateSign">
                <el-radio-group v-model="repatrol.cooperateSign" size="medium" @change="rulesChange()">
                  <el-radio-button label="YES">企业配合上传</el-radio-button>
                  <el-radio-button label="NO">企业拒绝配合</el-radio-button>
                </el-radio-group>
                <!--  -->
                <el-upload :class="{'hide':signLimit}" :file-list="signList" class="mt20" action="/api/upload"
                  v-if="repatrol.cooperateSign === 'YES'" list-type="picture-card" :on-success="signSuccess"
                  :on-error="uploadError" :data="{type:'', field: 'SIGN'}" :before-upload="beforeSignUpload"
                  :on-preview="signPreview" :on-remove="signRemove" :limit="1">
                  <i class="avatar-uploader-icon el-icon-plus">
                    <p class="upload-p">点击上传签名</p>
                  </i>
                </el-upload>
                <Preview v-if='signId' :key='"signId"' :showImg="PreviewShow" @close="PreviewShow = false"
                  :currentIndex='PreviewIndex' :title='PreviewTitle' :imgList="PreviewFileList"></Preview>
                <p class="bz" v-if="repatrol.cooperateSign === 'YES'" style="margin-top: 10px;">支持jpg、png、gif格式，1张，5m以内
                </p>
              </el-form-item>
            </div>
            <div class="row bottomContent" v-if="repatrol.cooperateSign === 'NO'">
              <el-form-item label="拒绝签名理由：" prop="refuseSignReason" :required='true'>
                <el-input v-model="repatrol.refuseSignReason" class="w250" :maxlength="100" type="textarea"
                  placeholder="请输入理由，100字以内" :rows="4">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

      </el-form>
    </div>


    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>

        <el-button @click="$router.go(-1)" style="width:120px;">返回
        </el-button>
        <el-button :disabled="updateSuccess" type="primary" @click="submit">保存
        </el-button>
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseenter="accessoryListIf = true"
      @mouseleave="accessoryListIf = false">
      <div>
        <p v-for="(item,index) in itemPicList" :key="item.picSrc">
          <span @click.stop="previewImg(itemPicList,index,'巡查项附件')">
            <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
              {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
            </a>
          </span>
          <span @click="deletePic(item.id,item.contextId)" style="color: #1787AD;cursor:pointer;"> 删除</span>
        </p>
      </div>
    </div>
    <Preview v-if='itemPicList.length>0' :key='"itemPicList"' :showImg="PreviewShow" @close="PreviewShow = false"
      :currentIndex='PreviewIndex' :title='PreviewTitle' :imgList="PreviewFileList"></Preview>
    <Select-form :showTip="showTip" :businessType='baseInfo.entityType' v-if="showTip" @cancel="cancel"
      @addConfirm="addConfirm" :entityId='repatrol.entityId'></Select-form>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import SingleCheckbox from "../static/SingleCheckbox.vue";
  import SelectForm from './seletForm';
  import Preview from 'components/togOss/previewImg';
  import {
    removeFile
  } from 'api/cfda/add'
  import * as api from "api/rating/restaurantRating";
  import {
    phoneValid
  } from 'utils/validate'

  export default {
    components: {
      ToggleForm,
      SingleCheckbox,
      Preview,
      SelectForm
    },
    data() {
      return {
        inspectorListLoading: false,
        inspectorList: [],
        baseInfo: {}, //init 数据
        tableList: [],
        tableBaseData: {},
        filePath: "",
        //巡查项图片显示相关
        accessoryListIf: false,
        itemPicList: [],
        PreviewShow: false,
        PreviewFileList: [],
        PreviewIndex: 0,
        PreviewTitle: '',
        //巡查项图片地址
        photoJson: {},
        rowId: '',
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        row_: {},
        project: {
          totalScore: 0,
          total: 0,
          score: 0,
        },
        rules: {
          inspectorId: {
            required: true,
            message: '请输入搜索选择检查人',
            trigger: 'change'
          },
          tel: [{
            required: true,
            message: '请输入检查人电话',
            trigger: 'change'
          }, {
            validator: phoneValid,
            trigger: 'blur'
          }],
          foodSafetyPerson: {
            required: true,
            message: '食品安全负责人',
            trigger: 'change'
          },
          foodSafetyPersonTel: [{
            required: true,
            message: '食品安全负责人手机号',
            trigger: 'change'
          }, {
            validator: phoneValid,
            trigger: 'blur'
          }],
          cooperateSign: {
            required: true,
            message: '请选择是否配合上传',
            trigger: 'change'
          },

        },
        contentRule: {
          'SINGLE': '单选计分',
          'MULTIPLE': '多选计分',
          'HIGHEST': '多选最高计分',
        },
        updateSuccess: false,
        signId: "", //签名图片
        signList: [],
        signLimit: false,
        loading: false,
        formName: '请选择要点表',
        showTip: false,
        //sumbit 数据集合
        repatrol: {
          contentFormDto: [],
          cooperateSign: '',
          entityId: '',
          inspector: '',
          inspectorId: '',
          tel: '',
          foodSafetyPerson: '',
          foodSafetyPersonTel: '',
          refuseSignReason: '',
          remarks: "",
          score: "",
          result: '',
          scoreType: 'DYNAMIC',
          sign: '',
          statisticsOptions: ''
        },
      };
    },
    mounted() {
      this.filePath = this.$store.getters.filePath;
      this.repatrol.entityId = this.$route.query.id;
      api.recordInfo({
        entityId: this.repatrol.entityId,
        scoreType: 'DYNAMIC'
      }).then(d => {
        if (d.status) {
          this.baseInfo = d.data;
        }
      })
    },
    methods: {
      cancel() {
        this.showTip = false
      },
      async addConfirm(id, name) {
        this.showTip = false
        this.formName = name
        api.projectInfo(id).then(result => {
          if (result.status) {
            this.baseInfo.tableInfo = result.data
            this.tableList = [];
            this.project.total = 0;
            this.project.totalScore = 0;
            this.baseInfo.tableInfo.map(item => {
              let lis = []
              this.project.totalScore += item.score / 1;
              this.project.total += 1;
              item.contentList.map(item2 => {
                this.photoJson[item2.id] = [];
                let obj = {
                  projectsNo: item.no,
                  name: `${item.name}（${item.score}分）`,
                  rule: item.rule,
                  ruleStr: this.contentRule[item.rule],
                  contextNo: item.no + '.' + item2.no,
                  context: item2.content,
                  score: item2.score,
                  absent: item2.absent,
                  result: 'NOTSELECT',
                  remark: '',
                  files: [],
                  id: item2.id,
                  parentId: item.id,
                }
                lis.push(obj)
              })
              this.tableList.push(lis)
            })
          }
        })
        this.repatrol.patrolTableId = id
        let result = await api.projectBaseData(id)
        this.tableBaseData = result.data
      },
      submit() {
        // 检查项校验
        for (let item in this.tableList) {
          let num = this.tableList[item].length;
          let count = 0;
          for (let item2 in this.tableList[item]) {
            if (this.tableList[item][item2].result == 'NOTSELECT') {
              count += 1
            }
          }
          if (count == num) {
            this.$message.error('检查项为必填项！！！')
            return false;
          }
        }
        if (this.tableList.length <= 0) {
          this.$message.error('检查项为必填项！！！')
          return false;
        }
        // 
        if (this.repatrol.cooperateSign == 'YES' && this.signId == '') {
          this.$message.error('请添加企业电子签名!')
          return false
        }

        this.$refs['repatrol'].validate((valid) => {
          //校验完成弹出提示框
          if (valid) {
            this.$confirm('是否要提交动态评分?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.repatrol.sign = ''
              this.repatrol.contentFormDto = []
              this.tableList.forEach(item => {
                item.forEach(context => {
                  let obj = {};
                  obj.projectId = context.parentId;
                  obj.contentId = context.id;
                  obj.evaluationResult = context.result;
                  obj.remark = context.remark;
                  obj.score = context.score;
                  //图片
                  if (this.photoJson[context.id]) {
                    let jsons = this.photoJson[context.id];
                    obj.annex = jsons.map(json => json.id);
                  }
                  this.repatrol.contentFormDto.push(obj);
                })
              })
              this.repatrol.sign = this.signId;
              this.repatrol.score = this.project.score;
              this.repatrol.statisticsOptions = this.tableBaseData.statisticsOptions;
              api.commit(this.repatrol).then(result => {
                if (result && result.status) {
                  this.$message({
                    message: '添加成功,正在返回列表页！',
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.$router.go(-1)
                  }, 2000)
                } else {
                  this.$message({
                    message: result.message,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
      },
      change() {
        this.$forceUpdate()
      },
      rulesChange() {
        this.signId = '';
        this.repatrol.refuseSignReason = '';
        this.signLimit = false;
        if (this.repatrol.cooperateSign == 'NO') {
          this.rules.refuseSignReason = {
            required: true,
            message: '请输入拒绝签名理由',
            trigger: 'change'
          }
        } else {
          this.rules.refuseSignReason = ''
          if (this.rules.refuseSignReason) {
            delete this.rules.refuseSignReason
          }
        }
      },
      inspectorUserIdMethod(query) {
        if (query !== '') {
          this.inspectorListLoading = true;
          api.inspectorList(query).then(d => {
            if (d.status && d.data) {
              this.inspectorList = d.data.list;
            }
            this.inspectorListLoading = false;
          })
        } else {
          this.inspectorList = [];
        }
      },
      inspectorUserIdChange(userId) {
        let list = this.inspectorList.map(obj => obj.inspectorUserId)
        this.repatrol.tel = this.inspectorList[list.indexOf(userId)].inspectedUserTel
        this.repatrol.inspector = this.inspectorList[list.indexOf(userId)].inspectorUserName;
      },
      tableOption({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        let rownum = 0;
        for (var i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].indexOf(row) >= 0) {
            rownum = this.tableList[i].length;
            break;
          }
        }
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
          if (rowIndex % rownum == 0) {
            return {
              rowspan: rownum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },

      //点击电子签名预览
      signPreview(file) {
        this.PreviewFileList = []
        this.PreviewFileList[0] = file.url
        this.PreviewIndex = 0;
        this.PreviewTitle = '电子签名';
        this.PreviewShow = true;
      },
      //签名和图片公用删除图片
      signRemove(file, fileList) {
        this.$confirm('是否确认删除电子签名吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          removeFile(this.signId).then(res => {
            if (!res.status) {
              this.$message.error('电子签名删除失败！');
              return
            } else {
              this.$message.success('电子签名删除成功！');
              this.signId = '';
              this.signLimit = false;
            }

          })
        })
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      //签名成功提示
      signSuccess(res, file) {
        if (res.data.colu === "SIGN" && res.status) {
          this.signId = res.data.id;
          this.signLimit = true;
          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败！');
        }
      },
      //签名
      beforeSignUpload(file) {
        this.updateSuccess = true
        return new Promise(async (resolve, reject) => {
          //类型和大小限制
          var picType = ["gif", "jpg", "png", "jpeg"];
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
          if (!this.IsInArray(picType, testmsg)) {
            this.$message.warning(`仅可上传gif,jpg,png格式的图片`);
            this.updateSuccess = false
            return reject(false);
          }
          if (file.size / 1024 / 1024 > 5) {
            this.$message.warning(`上传图片大小不能超过5M`);
            this.updateSuccess = false
            return reject(false);
          }
          this.updateSuccess = false
          return resolve(true)
        });
      },
      //表格（是否符合）触发事件
      singlecheckboxchange(args) {
        this.$set(args.row, 'result', args.result);
        this.project.score = 0;

        let opt = this.tableBaseData.statisticsOptions;
        this.baseInfo.tableInfo.forEach((item, index) => {
          let contextScore = 0

          if (item.rule == 'SINGLE') {
            let flag = false;
            this.tableList[index].forEach(context => {
              if (context.result == opt && flag == false) {
                contextScore += context.score / 1;
                flag = true;
              } else if (context.result == opt && flag == true) {
                this.$message.error(`检查项[${context.projectsNo}]为${this.contentRule[context.rule]},请注意你的选择！`)
              }
            })
          } else if (item.rule == 'MULTIPLE') {
            this.tableList[index].forEach(context => {
              if (context.result == opt) {
                contextScore += context.score / 1;

              }
            })
          } else if (item.rule == 'HIGHEST') {
            let arr = []
            this.tableList[index].forEach(context => {
              if (context.result == opt) {
                arr.push(context.score / 1)

              }
            })
            if (arr.length > 0) {
              contextScore += this.max(arr)
            }
          }
          this.project.score += contextScore / 1
        })
      },
      max(arr) {
        var max = arr[0];
        for (var i = 1; i < arr.length; i++) {
          if (arr[i] > max) {
            max = arr[i];
          }
        }
        return max
      },
      //判断数组是否包含字符串
      IsInArray(arr, val) {
        var testStr = arr.join(",");
        return testStr.indexOf(val) != -1;
      },
      //附件上传相关
      beforeUpPic(file) {
        this.updateSuccess = true
        return new Promise(async (resolve, reject) => {
          //类型和大小限制
          var picType = ["gif", "jpg", "png", "jpeg"];
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
          if (!this.IsInArray(picType, testmsg)) {
            this.$message.warning(`仅可上传gif,jpg,png格式的图片`);
            this.updateSuccess = false
            return reject(false);
          }
          if (file.size / 1024 / 1024 > 5) {
            this.$message.warning(`上传图片大小不能超过5M`);
            this.updateSuccess = false
            return reject(false);
          }
          //个数限制
          let id = this.rowId;
          let list = this.photoJson[id];
          if (this.photoJson[id]) {
            if (list.length > 3) {
              this.$message.warning(`当前限制选择 4 个文件`);
              this.updateSuccess = false
              return reject(false);
            }
          }
          this.updateSuccess = false
          return resolve(true)
        });
      },
      //附件图片上传成功
      picSuccess(file, fileList) {
        if (file.status) {
          //图片地址
          let fileId = file.data.id;
          //图片名称
          let fileName = file.data.fileName;
          //图片地址
          let picSrc = file.data.fileId
          let id = this.rowId;
          let array = [];
          let json = {};
          if (!this.photoJson[id]) {
            json["id"] = fileId;
            json["fileName"] = fileName;
            json["picSrc"] = picSrc;
            json["contextId"] = id;
            array.push(json);
            this.photoJson[id] = array;
          } else {
            json["id"] = fileId;
            json["fileName"] = fileName;
            json["picSrc"] = picSrc;
            json["contextId"] = id;
            array = this.photoJson[id];
            array.push(json)
            this.photoJson[id] = array;
          }
          this.$set(this.row_, 'isShowFile', true);
          this.$message.success('图片上传成功！');
        } else {
          this.$message.error('图片上传失败！');
        }
      },
      //删除图片
      deletePic(id, itemId) {
        this.$confirm('是否确认删除该图片吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          removeFile(id).then(res => {
            let itemPicList = this.photoJson[itemId];
            let newItemPicList = [];
            for (let obj of itemPicList) {
              if (id != obj.id) {
                newItemPicList.push(obj);
              }
            }
            if (newItemPicList.length == 0) {
              this.$set(this.row_, 'isShowFile', false);
            }
            //更新记录列表
            this.photoJson[itemId] = newItemPicList;
            //更新显示列表
            this.itemPicList = newItemPicList;
            this.$message.success('图片删除成功！');
          })
        })
      },
      //add鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = this.photoJson[content.id];
        this.row_ = content;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
      },
      //附件上传按钮得到这一行的id
      getRow(row) {
        this.rowId = row.id;
        this.row_ = row;
      },
      //显示巡查项图片
      previewImg(imgList, index, title) {
        this.PreviewFileList = []
        imgList.map(item => {
          this.PreviewFileList.push(this.filePath + item.picSrc)
        })
        this.PreviewIndex = index;
        this.PreviewTitle = title;
        this.PreviewShow = true;
      },

    },

  }
</script>

<style lang="scss" scoped>
  .mT35 {
    margin-top: 35px;
  }

  .mainbody {
    margin-left: 20px;
    margin-bottom: 30px;
    background: #EFF7F9;
    border: 1px solid #C2EAF8;
    padding: 10px;
    width: 720px;
    color: #1FABDC;

    .form-item {
      margin: 10px 0;
      display: inline-block;
      width: 350px;

      .title {
        width: 100px;
        display: inline-block;
        text-align: right;
      }
    }
  }

  .result {
    margin: 20px auto;
    width: 402px;
    height: 90px;
    border: 1px solid #C2CAD2;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;

      .number {
        font-size: 26px;
        color: #3B3B3B;
      }

      .project-name {
        font-size: 14px;
        color: #A2AAB6;
      }
    }
  }

  .bz {
    line-height: 20px;
    font-size: 12px;
    color: #A2AAB6;
  }

  // 图片上传
  .upload-pic {
    border: 1px solid #cbcbcb;
    width: 130px;
    height: 130px;
    border-radius: 6px;
    margin-left: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-pic-left {
    margin-left: 0px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    background: #0DB5EF;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }

  .container {
    position: relative;
    margin-bottom: 300px;
  }

  $c: #0db5ef;

  .right-info {
    width: 100%;
  }

  .content {
    margin: 20px auto 0px;
    width: 750px;
  }

  .table-div {
    text-align: center;

    input {
      background: #FFFFFF;
      border: 1px solid #C2CAD2;
      height: 34px;
      font-size: 12px;
      color: #A2AAB6;
      padding-left: 12px;
      box-sizing: border-box;
    }
  }

  .diva {
    background: #F6F7F8;
    border: 1px solid #C2CAD2;
    font-size: 14px;
    color: #393939;
    height: 34px;
    width: 150px;
    text-align: center;
    line-height: 34px;
    box-sizing: border-box;
  }

  .block {
    width: 252px;
    font-size: 14px;
    color: #6D7787;
    line-height: 26px;
  }

  .brN .is-leaf {
    border-right: 0;
  }

  .brN tr td {
    border-right: 0;
  }

  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }

  /*.table-div .el-table__body-wrapper{
    max-height: 350px;
  }*/
  .imgdiv {
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;

    img {
      transition: all 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }

    span {
      display: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.40);
      border-radius: 0 0 5px 5px;
      font-size: 14px;
      color: #FFFFFF;
      position: absolute;
      bottom: 0;
    }
  }

  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .imgbig {
    z-index: 999;

    span {
      display: none !important;
    }

    img {
      transform: scale(2);
      border-radius: 0;
    }
  }

  .marNo {
    margin: 0 !important;
  }

  .accessoryList span:hover {
    border-bottom: 1px solid #ccc;
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
  }

  .big-img {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;

    >img {
      display: block;
      max-height: 700px;
    }
  }

  .bottomContent {
    margin: 0 auto;
    width: 475px;
  }

  .upload-p {
    color: rgb(162, 170, 182);
    font-size: 14px;
    line-height: 20px;
    width: 148px;
    position: relative;
    left: -57px;
    top: 25px;
  }

  .bottomContent {
    margin: 0 auto;
    width: 475px;
  }
</style>
<style lang='scss'>
  // 隐藏上传按钮
  .hide .el-upload--picture-card {
    display: none;
  }
</style>