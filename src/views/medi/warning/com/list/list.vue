<template>
  <div class="bigbox">
    <div class="count-box clear_a">
      <div class="count-box-item">
        <div><span>{{ info.unRevicedCount }}</span></div>
        <p>未收到预警消息</p>
      </div>
      <div class="count-box-item">
        <div><span>{{ info.tobeExecuteCount }}</span></div>
        <p>待处理</p>
      </div>
      <div class="count-box-item">
        <div><span>{{ info.executedCount }}</span></div>
        <p>已处理</p>
      </div>
    </div>
    <div style="margin-bottom:10px;overflow:hidden;margin-top: 20px;">
      <el-input placeholder="主体名称、许可号、姓名、手机号" class="w300 seekIpt" v-model="searchMap.keysWord" style="float:left;">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <div style="float:left;">
        <enum-select style="width: 150px" v-model="searchMap.state" @change="getPageData" enum="com.ybveg.govx.enums.medi.WarningTaskRecordSEnum" placeholder="处理状态(全部)"></enum-select>
        <enum-select style="width: 150px" v-model="searchMap.onlineStatus" @change="getPageData" enum="com.ybveg.govx.enums.medi.EnterpriseUserStateEnum" placeholder="在线状态(全部)"></enum-select>
        <enum-select style="width: 150px" v-model="searchMap.enterpriseForm" @change="getPageData" enum="com.ybveg.govx.enums.medi.EnterpriseFormEnum" placeholder="企业形态(全部)"></enum-select>
        <area-select v-model="searchMap.areaCode" class="selectHeight" placeholder="所属下级部门" @change="getPageData"> </area-select>

        <el-dropdown class="selectHeight dc w120" @command="handleCommand">
          <el-button type="primary">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="ALL">导出全部</el-dropdown-item>
            <el-dropdown-item command="BY">导出本页</el-dropdown-item>
            <el-dropdown-item command="SELECT">导出本页选中</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="w120 dc" v-auth="'medi.biz.wb|func.send'" icon="el-icon" @click="smsAll" v-if="info.state != '已完成' && info.taskL !='NOTICE'">批量短信预警</el-button>
      </div>

    </div>
    <el-table @sort-change="sortChange" :data="dataPage" :border="true" :resizable="true" class="table-div" @selection-change="changeSelect">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entity_name" min-width='100' label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="enterpriseForm" min-width='100' label="企业形态"></el-table-column>
      <el-table-column show-overflow-tooltip  min-width='100' label="姓名">
        <template slot-scope="scope">
          <span v-if="scope.row.real_name==null">已解绑</span>
          <span v-else>{{scope.row.real_name}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width='100' label="手机号">
        <template slot-scope="scope">
          <span v-if="scope.row.phone==null">已解绑</span>
          <span v-else>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="reality_addr" min-width='100' label="经营地址"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dept_name" min-width='100' label="所属下级部门"></el-table-column>
      <el-table-column show-overflow-tooltip prop="num" min-width='100' label="短信预警次数"></el-table-column>
      <el-table-column show-overflow-tooltip prop="onlineStatus" min-width='100' label="在线状态"></el-table-column>
      <el-table-column show-overflow-tooltip prop="state" min-width='100' label="预警状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.state == '已处理'">已处理</el-tag>
          <el-tag type="danger" v-if="scope.row.state == '未读'">未读</el-tag>
          <el-tag type="warning" v-if="scope.row.state == '待处理'">待处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="create_time" min-width='100' sortable="custom" label="更新时间"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="180">
        <template slot-scope="scope">
          <a href="javascript:;" class="operate-a" v-auth="'medi.biz.wb|func.send'" v-if="scope.row.num !== 2 && info.state != '已完成' && info.taskL !='NOTICE'" @click="smsOne(scope.row.entity_id,scope.row.phone)">短信预警</a>
          <a href="javascript:;" v-if="scope.row.state != '已处理'" v-auth="'medi.biz.wb|func.warning'" @click="dispose(scope.row)" class="operate-a">预警处理</a>
          <a href="javascript:;" v-if="scope.row.state == '已处理'" @click="getRecord(scope.row.id,scope.row.entity_name)" class="operate-a">处理详情</a>
          <a href="javascript:;" @click="$router.push({path: '/medi/subject/' + scope.row.entityTypeExt.toLowerCase() + '/detail', query: {entityType: scope.row.entityType, entityTypeExt: scope.row.entityTypeExt, ext: 'INFO', entityId: scope.row.entity_id}})" class="operate-a">主体档案</a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box" style="margin-bottom: 80px">
      <el-pagination background :current-page="page.pageNum"
                     :page-sizes="[10, 20, 30, 40, 50, 100, 200, 500]"
                     :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"
                     @size-change="pageSizeChange"
                     @current-change="pagecCurrentChange">
      </el-pagination>
    </div>

    <popupBody v-if="isShowDispose" class="mT-50" :width="700" :top="110">
      <p class="popTit">
        <span>预警处理</span>
        <span @click="colsePop"><i class="el-icon-close"></i></span>
      </p>
      <div class="contBox">
        <el-form :model="handleInfo" :rules="rules" ref="handleInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item label="主体名称:">
              <span>{{ handleInfo.entityName }}</span>
          </el-form-item>
          <el-form-item label="处理方式:" prop="disposeWay"  v-if="$route.query.taskLevel != '通知'">

            <el-select v-model="handleInfo.disposeWay" placeholder="处理方式(全部)" v-if="info.taskL !='NOTICE'">
              <el-option :key="'UNDISCOVERED'" :label="'未发现相关药品'" :value="'UNDISCOVERED'"></el-option>
              <el-option :key="'HANDLED'" :label="'已发现相关药品并处理'" :value="'HANDLED'"></el-option>
              <el-option :key="'OTHER'" :label="'其他'" :value="'OTHER'"></el-option>
            </el-select>

            <el-select v-model="handleInfo.disposeWay" placeholder="处理方式(全部)" v-if="info.taskL =='NOTICE'">
              <el-option :key="'ACCEPTANDREAD'" :label="'已接收并查阅该消息'" :value="'ACCEPTANDREAD'"></el-option>
            </el-select>

            <span  style="position: relative;top: -2px;color: #666666">(必填)</span>
          </el-form-item>
          <el-form-item label="相关备注:" prop="info">
            <el-input class="w350" type="textarea" placeholder="请输入相关备注，200字内" :maxlength="200" :rows="4" v-model="handleInfo.info"></el-input>
            <span style="position: relative;top: -2px;color: #666666" v-if="$route.query.taskLevel == '通知'">(选填)</span>
          </el-form-item>
          <el-form-item label="相关附件：" prop="fileList">
            <span style="position: relative;top: -2px;color: #666666" v-if="$route.query.taskLevel == '通知'">(选填)</span>
            <el-upload action="/api/upload" :data="{type:'REPATROL_RECORD', field: 'PHOTO'}" list-type="picture-card"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove"
                       :on-success="handleAvatarSuccess"
                       :limit="fileLimit"
                       :before-upload="beforeAvatarUpload"
                       :on-exceed="handleExceed">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" size="tiny" :modal="false">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，gif</p>
            <p class="bz">图片大小：每张图片小于5M</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="botBox">
        <div class="bt-bt">
          <el-button @click="colsePop" class="w100" type="primary">取消并关闭</el-button>
          <el-button @click="saveDispose" class="w100" type="primary" v-if="$route.query.taskLevel == '通知'">确认已读</el-button>
          <el-button @click="saveDispose" class="w100" type="primary" v-if="$route.query.taskLevel != '通知'">保存并提交</el-button>
        </div>
      </div>
    </popupBody>


    <popupBody v-if="isShowDt" class="mT-50" :width="700" :top="110">
      <p class="popTit">
        <span>处理详情</span>
        <span @click="colseDt"><i class="el-icon-close"></i></span>
      </p>
      <div class="contBox">
        <el-form :model="recordInfo" :rules="rules" ref="recordInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="主体名称:">
            <span>{{ infoEntityName }}</span>
          </el-form-item>
          <el-form-item label="处理方式:">
            <span>{{ records.disposeWay }}</span>
          </el-form-item>
          <el-form-item label="相关备注:">
            <p >{{ records.info ? records.info : '无' }}</p>
          </el-form-item>
          <el-form-item label="相关附件:">
            <div class="imgbox" v-if="records.fileList.length != 0">
              <div v-for="(item,index) in records.fileList"  class="imgdiv movePoin">
                <img :src="filePath + item.fileId" alt="" @click="showBigImg(item.fileId)">
              </div>
            </div>
            <span v-if="records.fileList.length == 0">无</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="botBox">
        <div class="bt-bt">
          <el-button @click="colseDt" class="w100" type="primary">关闭</el-button>
        </div>
      </div>
    </popupBody>
    <div class="showImgOv" v-if="isShowImg" @click="isShowImg = false">
      <div class="showImg">
        <img :src="showImgSrc"/>
      </div>
    </div>
  </div>
</template>

<script>
  import EnumSelect from 'components/common/EnumSelect'
  import * as warningTask from "api/warning/warning";
  import popupBody from 'components/popup/popupform';
  import AreaSelect from 'components/common/AreaSelect'
  import {downloadFile} from 'api/common';


  export default {
    props: {
      taskId: {
        type: String,
      }
    },
    methods: {
      // 分页查询
      getPageData() {
        warningTask.warningPageSituation(this.taskId,this.searchMap, this.page.pageSize, this.page.pageNum).then(r => {
          this.dataPage = r.data.list
          this.page.total = r.data.total
        })
      },
      showBigImg(src) {
        this.showImgSrc = this.filePath + src
        this.isShowImg = true
      },
      colseDt(){
        this.infoEntityName = ''
        this.records = {}
        this.isShowDt = false
      },

      getRecord(recordId,entityName){
        this.recordInfo = {}
        this.infoEntityName = entityName
        warningTask.getRecord(recordId).then(r => {
          this.records = r.data
        })
        console.log(this.recordInfo)
        this.isShowDt = true
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num
        this.getPageData()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size
        this.getPageData()
      },
      sortChange() {
        this.searchMap.sort = arguments[0].order ? arguments[0].order: 'descending'
        this.getPageData();
        this.getInfo()
      },
      init() {
        this.getPageData()
        this.getInfo()
      },
      deptChange(deptId) {
        this.searchMap.areaCode = !deptId ? "" : deptId[deptId.length - 1];
        this.getPageData();
      },
      getInfo() {
        warningTask.taskRecordInfo(this.taskId).then(r=>{
          this.info = r.data
        })
      },
      smsOne(entityId,phone){
        if (phone == null) {
          this.$message.warning("该主体已解绑,无法发送短信预警!");
          return false;
        }
        this.smsSendList = []
        this.smsSendList.push({entityId:entityId, phone:phone})
        this.$confirm("确定发送预警短信", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          warningTask.smsSend({ taskId: this.taskId, warningSmsList: this.smsSendList }).then((result) => {
            if(result.status){
              this.$message({
                message: '发送成功',
                type: 'success'
              })
              this.getPageData()
            }
          });
        });
      },
      smsAll (){
        warningTask.smsAll(this.taskId).then(r => {
          if(r.status && r.data.length > 0){
            let isttime = 0
            let sendcount = 0
            this.smsSendList = []
            r.data.forEach(s =>{
              if(s.state !== 'EXECUTED'){
                if(s.sendNum === 2 ){
                  isttime++
                }else{
                  sendcount++
                  this.smsSendList.push({entityId:s.entityId, phone:s.phone})
                }
              }
            })
            if(isttime !== 0){
              this.smsAllMsg = '本次批量短信预警将会对未读和待处理的'+ sendcount +'家企业发送预警短信。另有'+ isttime +'家企业已经短信提醒2次，此次不再发送短信提醒。是否确认发送批量短信预警？'
            }else{
              this.smsAllMsg = '本次批量短信预警将会对未读和待处理的'+ sendcount +'家企业发送预警短信。是否确认发送批量短信预警？'
            }

            this.$confirm(this.smsAllMsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              warningTask.smsSend({ taskId: this.taskId, warningSmsList: this.smsSendList }).then((result) => {
                if(result.status){
                  this.$message({
                    message: '发送成功',
                    type: 'success'
                  })
                  this.getPageData()
                }
              });
            });
          }
        })
      },
      handleAvatarSuccess(file) {
        if(file.status) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.handleInfo.fileList.push(file.data);
        }
      },
      changeSelect(val) {
        this.multipleSelection = val;
      },
      handleCommand(command) {
        if(command === "ALL"){
          warningTask.exportExcel([],this.taskId).then(r =>{
            downloadFile(r.data, this.info.taskName + '执行情况');
          })
        }else if(command === "BY"){
          if(this.dataPage.length === 0){
            this.$message({
              message: '没有相关数据',
              type: 'warning'
            })
            return
          }
          let ids = []
          this.dataPage.forEach(s=>{
            ids.push(s.id)
          })
          warningTask.exportExcel(ids,this.taskId).then(r =>{
            downloadFile(r.data, this.info.taskName + '执行情况');
          })
        }else if(command === "SELECT"){
          if(this.multipleSelection.length === 0){
            this.$message({
              message: '请选中导出数据',
              type: 'warning'
            })
            return
          }
          let ids = []
          this.multipleSelection.forEach(s=>{
            ids.push(s.id)
          })
          warningTask.exportExcel(ids,this.taskId).then(r =>{
            downloadFile(r.data, this.info.taskName + '执行情况');
          })
        }
      },
      dispose (data) {
        this.isShowDispose = true
        this.handleInfo.entityName = data.entity_name
        this.handleInfo.entityId = data.entity_id
        this.handleInfo.userId = data.seuId
      },
      saveDispose (){
        this.handleInfo.taskId = this.taskId
        if(this.$route.query.taskLevel != '通知'){
          this.$refs["handleInfo"].validate((valid) => {
            if (valid) {
              warningTask.addRecord(this.handleInfo).then(r => {
                if (r.status) {
                  this.$message({
                    message: '处理成功',
                    type: 'success'
                  })
                  this.colsePop()
                  this.getInfo()
                  this.getPageData()
                }
              })
            }
          }, () => {
          })
        } else {
          warningTask.addRecord(this.handleInfo).then(r => {
            if (r.status) {
              this.$message({
                message: '处理成功',
                type: 'success'
              })
              this.colsePop()
              this.getInfo()
              this.getPageData()
            }
          })
        }
      },
      colsePop () {
        this.isShowDispose = false
        this.$refs["handleInfo"].resetFields();
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `最多可上传 5 个文件， 当前已选择 ${fileList.length} 个文件`);
      },
      beforeAvatarUpload(file){
        let fileType = file.type.split("/")[1];
        let isLt2M = file.size / 1024 / 1024 < 5;
        console.log(isLt2M)
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        if(fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'gif') {
          this.$message({
            message: '请上传正确格式的图片(图片格式：png，jpg，gif)',
            type: 'error'
          })
          return false;
        }
      },
      handleRemove(file, fileList) {
        for (let i = 0; i < this.handleInfo.fileList.length; i++) {
          let id = this.handleInfo.fileList[i].id;
          if (file.response && id === file.response.data.id ) {
            this.handleInfo.fileList.splice(i, 1);
            break;
          }
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    },
    async mounted() {
      this.init()
      this.filePath = this.$store.getters.filePath;
      if (this.$route.query.taskLevel == '通知') {
        this.handleInfo.disposeWay = 'ACCEPTANDREAD'
      }
    },
    data() {
      return {
        filePath:'',
        isShowDispose:false,
        isShowDt:false,
        isShowImg:false,
        showImgSrc:'',
        multipleSelection:[],
        infoEntityName:'',
        records:{},
        info: {
          entityCount: 0,
          tobeExecuteCount: 0,
          unRevicedCount: 0,
          executedCount: 0,
          dispList:[],
          startTime:'',
          finishTime:'',
          state:'',
        },
        count: {
          entityCount: 0,
          tobeExecuteCount: 0,
          unRevicedCount: 0,
          executedCount: 0
        },
        smsSendList:[],
        smsAllMsg: '',
        handleInfo:{
          entityName:'',
          entityId:'',
          disposeWay : '',
          info: '',
          state: 'EXECUTED',
          fileList:[],
          taskId:'',
          userId:''
        },
        searchMap: {
          keysWord: '',
          state: '',
          sort: 'descending',
          onlineStatus: '',
          areaCode: '',
          enterpriseForm:''
        },
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        dataPage: null,
        pageObj: null,
        fileLimit: 5, //限制文件上传的个数
        rules: {
          disposeWay: [{required: true, message: '请选择处理方式', trigger: 'change'}],
        }
      };
    },
    components: {
      EnumSelect,AreaSelect,popupBody
    }
  }
</script>

<style scoped lang="sass">
  .bt-info{
    line-height: 32px;
    font-size: 14px;
    margin-left: 10px;
    float: left;
  }
  .dc {
    float: right;
    width: 150px;
    margin:0 5px;
    border-radius: 2px;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .operate-a {
    color: #0DB5EF;
  }
  .count-box{
    margin-top: 40px;
    height: 90px;
    width: 100%;
    text-align: center;
    border: 1px solid #C2CAD2;
  }
  .count-box .count-box-item{
    height: 90px;
    width: 33.3%;
  }
  .count-box .count-box-item div{
    margin-top: 15px;
    color: #3B3B3B;
    font-size: 28px;
    position: relative;
  }

  .count-box .count-box-item:first-of-type div:after{
    content: "";
    display: inline-block;
    width: 1px;
    height: 60px;
    position: absolute;
    border-left: 1px solid #C2CAD2;
    right: 1px;
  }
  .count-box .count-box-item p{
    color: #A2AAB6;
    font-size: 14px;
  }
  .popTit{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height:40px;
    line-height: 40px;
    background:rgba(242,245,248,1);
  }
  .popTit span:first-child{
    margin-left: 20px;
    font-size:14px;
    color:rgba(57,57,57,1);
  }
  .popTit span:last-child{
    float: right;
    margin-right: 10px;
    color:rgba(154,154,154,1);
  }
  .showImgOv{
    position: absolute;
    width: 100%;
    height:100%;
    z-index: 9998;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.5);
  }
  .showImg{
    position: absolute;
    width: 500px;
    top: 50px;
    left: 50%;
    margin-left: -250px;
    z-index: 9999;
  }
  .showImg img{
    width: 100%;
  }
  .contBox{
    width: 100%;
    margin-top: 20px;
    height: 520px;
    overflow-y: auto;
  }
  .contBox .el-form-item{
    padding-right: 30px;
  }
  .botBox{
    text-align:right;
    padding:0 40px 0 0 ;
  }
  .botBox button:first-child{
    background:rgba(246,247,248,1);
    border: 1px solid #C2CAD2;
    color: #393939;
  }
  .imgbox{
    margin-top: 10px;
    position: relative;
    overflow: hidden;
  }
  .imgdiv{
    display: inline-block;
    float: left;
    width: 120px;
    height: 120px;
    margin: 0 5px;
  }
  .imgdiv img{
    width: 100%;
  }

</style>
