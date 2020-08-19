<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>计划详情{{planInfo.planName?'-'+planInfo.planName:''}}</span>
    </div>
    <div style="margin-bottom: 200px;">
      <el-form  label-width="130px" class="demo-ruleForm">
        <toggle-form title="计划内容">
          <div class="content">

            <div class="row">
              <el-form-item label="计划名称:" >
                <span>{{planInfo.planName}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="计划编号:">
                <span>{{planInfo.planNum}}</span>
              </el-form-item>

              <el-form-item label="制定机构:">
                <span>{{planInfo.agenciesName }}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="计划时间:">
                <span><span>{{planInfo.startDate}}</span></span>&nbsp;  至  &nbsp;<span>{{planInfo.endDate}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="主体类型:">
                <div v-for="(item,index) in entityTypes" :key="index">
                  <div >{{item.bizType}}({{item.projectName}})</div>
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="风险分级:">
                <span>{{planInfo.quantifyLevelName }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="计划描述:">
                <span class="over-y">{{planInfo.desz}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="相关文件:">
                <div class="show-success-file">
                  <div class="file-item" v-for="(item,index) in planFiles" :key="index">
                    <span class="file-name not-pic" @click.stop="downloadFile(index,item)" v-if="['png','jpg','jpeg'].indexOf(item.type)==-1" >{{item.fileName}}</span>
                    <span class="file-name" @click.stop="showBigPic=index" v-if="~['png','jpg','jpeg'].indexOf(item.type)">{{item.fileName}}</span>
                    <div class='big-img' v-show="showBigPic==index" @click.stop="showBigPic = -1" v-if="~['png','jpg','jpeg'].indexOf(item.type)">
                      <img :src="pathFile + item.path" alt="">
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>

          </div>
        </toggle-form>


        <toggle-form title="任务分配" v-if="planInfo.areaCode.length <= 6">
          <el-table :data="workTableData" v-loading="loading" element-loading-text="数据正在努力加载中"   :border="true" :resizable="true" style="margin-top:20px" class="table-div" >
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="dept_name" min-width="100" label="下级部门"></el-table-column>
            <el-table-column v-if="planInfo.state != 'PEND_START'" show-overflow-tooltip prop="plan_num" min-width="100" label="子计划编号"></el-table-column>
            <el-table-column v-if="planInfo.state != 'PEND_START'" show-overflow-tooltip prop="ent_cnt" min-width="120" label="已巡查主体数"></el-table-column>
            <el-table-column v-if="planInfo.state != 'PEND_START'" show-overflow-tooltip min-width="100" label="子计划状态">
             <template slot-scope="scope">
               {{PlanStateList[scope.row.state]}}
              </template>
            </el-table-column>
          </el-table>
        </toggle-form>

      </el-form>
    </div>

    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="default" @click="backBtn">返回</el-button>
        <el-button type="primary" v-auth="'food.special.plan|func.edit'" v-if="planInfo.state == 'PEND_START'" @click="edit">编辑</el-button>
        <el-button type="primary" v-auth="'food.special.plan|func.edit'" v-if="planInfo.areaCode.length==4 && planInfo.state == 'PEND_START'" @click="start">启动</el-button>
         <el-button type="primary" v-auth="'food.special.plan|func.edit'" v-if="planInfo.areaCode.length==6 && planInfo.state == 'EXECUTING'" @click="complete">完成</el-button>
      </div>
    </div>

  </div>
</template>

<script type="module">

  import ToggleForm from "components/ToggleForm.vue";
  import {getInfo,getChilds, startPlan} from "api/medi/patrol/plan";
  import {downloadFile} from 'api/common';
  import * as api from "api/medicalDevices/patrolPlan";

  export default {
    async mounted(){
      this.loading=true;
      let id = this.$route.query.id;
      if (!id){
        return;
      }
      this.pathFile = this.$store.getters.filePath;
      await api.getInfo(id).then((r) =>{
        this.planInfo = r.data.planInfo;
        this.planInfo.agenciesName=r.data.agenciesName;
        this.planFiles = r.data.files;
          //处理图片
        if (this.planFiles && this.planFiles.length > 0) {
          this.planFiles.forEach(item=>{
            item.path=item.fileId;
            item.type=item.fileName.substring(item.fileName.indexOf(".")+1);
          })
        }

        if(r.data.patrolTableList && r.data.patrolTableList.length > 0){
          for(let i = 0;i<r.data.patrolTableList.length ;i++){
            let labels = {
              bizType:r.data.patrolTableList[i].biz_type_name,
              projectName:r.data.patrolTableList[i].name,
            };
            this.entityTypes.push(labels);
          }
        }
      });
      //处理任务分配
      let formdata=new FormData();
      formdata.append('loadType','DETAIL');
      formdata.append('planId', this.$route.query.id);
      await api.getExecutesArray(formdata).then(r=>{
        let allDept = r.data;
        // 无执行部门就返回
        if (!allDept || allDept.length < 2) return;
        // 有执行部门executor才放入列表this.workTableData
        for (let i = 0; i < allDept.length; i++) {
          if (!allDept[i].executor) {
            continue;
          }
          this.workTableData.push(allDept[i]);
        }
        // 待启动时不显示总计巡查
        if (this.planInfo.state == 'PEND_START') {
          this.workTableData.forEach(item=>{
            if(item.dept_name=='总计'){
               this.workTableData=this.workTableData.slice(0,-1);
            }
          })
        }

        this.loading=false;
      })
    },
    components: {
      ToggleForm,
    },
    methods:{
      complete(){//完成按钮
        this.$confirm('是否确认该计划已完成？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              api.complete(this.$route.query.id).then(d=>{
                if(d.status){
                  this.$message({
                      message: '已修改为完成状态！',
                      type: 'success'
                    });
                  this.backBtn();
                }else{
                    this.$message({
                      message: d.message,
                      type:  d.level
                    });
                }
              })
            })

        },
      backBtn(){
        this.$router.push({name: "medicalDevices.specialList", params: {index:this.$route.query.index}});
      },
      view(id){
//        this.$router.push({path:"info",query:{id:id}});
      },
      downloadFile(index,file){
        let fileName = file.fileName;
        if(fileName) {
          fileName = fileName.substr(0,fileName.lastIndexOf('.'));
        }
        downloadFile(file.fileId,fileName);
      },
      edit(){
        this.$router.push({path: "add", query: {opt: 'edit', id: this.planInfo.id, index:this.$route.query.index}});
      },
      start(){
        this.$confirm('确定启动该专项巡查计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          api.startPlan(this.$route.query.id).then(r => {
            if(!r.status){
              this.$message({
                message: r.message,
                type: r.level
              });
              return;
            }
            this.$message({
              message: "启动成功",
              type: 'success'
            });
            this.backBtn();
          })
        }).catch(_ =>{});
      }
    },
    data() {
      return {
        loading: false,
        showBigPic:-1,//是否展示大图
        planInfo:{
          areaCode:''
        },
        planFiles:[],
        workTableData:[],
        entityTypes:[],
        filePath: "",
        PlanStateList:{
          'EXECUTING':'执行中',
          'PEND_START':'待启动',
          'ALREADY_COMPLETED':'已完成',
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .table-div {
    width: 100%;
    text-align: center;
  }

   .content {
     padding-left: 25%;
     margin-top: 20px;
   }

  .operate-a {
    color: #1787AD;
  }


  .tag {
    border-radius: 0;
    background: #EFF7F9;
    border: 1px solid #C2EAF8;
    padding: 8px 10px;
    line-height: 0px;
    line-height: 16px;
    margin: 5px  0;
    color: #33b2df;
    font-size: 14px;
    display: block !important;
  }

  .show-success-file{
  .file-item{
  .el-progress{
    display: inline-block;
    width: 130px;
  }
  .file-name{
    cursor: pointer;
    margin-right: 20px;
    color: #1787AD;
  }
  .not-pic{
    // color: #6D7787;
  }
  .delete-btn{
    color: #1787AD;
    cursor: pointer;
  }
  }
  .big-img{
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
  >img{
    display: block;
    max-height: 700px;
  }
  }
  }

</style>
