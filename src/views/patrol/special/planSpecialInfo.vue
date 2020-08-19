<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>计划详情{{planInfo.planName?'-'+planInfo.planName:''}}</span>
    </div>
    <div style="margin-bottom: 200px;">
      <el-form label-width="130px" class="demo-ruleForm">
        <toggle-form title="计划内容">
          <div class="content">

            <div class="row">
              <el-form-item label="计划名称:">
                <span>{{planInfo.planName}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="计划编号:">
                <span>{{planInfo.planNum}}</span>
              </el-form-item>

              <el-form-item label="制定机构:">
                <span>{{planInfo.deptName}}</span>
              </el-form-item>
            </div>

            <div class="row" >
              <el-form-item label="计划时间:">
                <span><span>{{planInfo.startDateStr}}</span></span>&nbsp; 至 &nbsp;<span>{{planInfo.endDateStr}}</span>
              </el-form-item>
            </div>

            <div class="row" >
              <el-form-item label="主体类型:">
                <div v-for="(item,index) in entityTypes" :key="index">
                  <div>{{item.bizType}}({{item.projectName}})</div>
                </div>
              </el-form-item>
            </div>

            <div class="row" >
              <el-form-item label="详细经营信息:">
                <span>{{planInfo.attributeStr}}</span>
              </el-form-item>
            </div>

            <div class="row" >
              <el-form-item label="场所分布:">
                <span>{{planInfo.spaceDstStr}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="计划描述:">
                <span>{{planInfo.desz}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="相关文件:">
                <div class="show-success-file">
                  <div class="file-item" v-for="(item,index) in planFiles" :key="index">
                    <span class="file-name not-pic" @click.stop="downloadFile(index,item)" v-if="['png','jpg','jpeg'].indexOf(item.type)==-1">{{item.fileName}}</span>
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


        <toggle-form title="任务分配" v-if="planInfo.areaLevel <= 6">
          <el-table :data="workTableData" style="margin-top:20px" class="table-div">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="deptName" min-width="100" label="下级部门"></el-table-column>
            <el-table-column v-if="planInfo.state != 'PEND_START'" show-overflow-tooltip prop="planNum" min-width="100" label="子计划编号"></el-table-column>
            <el-table-column v-if="planInfo.state != 'PEND_START'" show-overflow-tooltip prop="patrolNum" min-width="120" label="已巡查主体数"></el-table-column>
            <el-table-column v-if="planInfo.state != 'PEND_START'" show-overflow-tooltip prop="state" min-width="100" label="子计划状态"></el-table-column>
          </el-table>
        </toggle-form>

      </el-form>
    </div>

    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="default" @click="backBtn">返回</el-button>
        <el-button type="primary" v-auth="'food.special.plan|func.edit'" v-if="planInfo.state == 'PEND_START'" @click="edit">编辑</el-button>
        <!-- <el-button type="primary" v-auth="'food.special.plan|func.edit'" v-if="planInfo.areaLevel == 4 && planInfo.state == 'PEND_START'"
          @click="start">启动</el-button> -->
      </div>
    </div>

  </div>
</template>

<script>

  import ToggleForm from "components/ToggleForm.vue";
  import { getInfo, getChilds, startPlan } from "api/patrol/special/planSpecial";
  import { downloadFile } from 'api/common';

  export default {
    async mounted() {
      let id = this.$route.query.id;
      if (!id) {
        return;
      }
      await getInfo(id).then((r) => {
        this.pathFile = this.$store.getters.filePath;
        this.planInfo = r.data;
        this.planFiles = r.data.file;
        if (r.data.specialTables && r.data.specialTables.length > 0) {
          for (let i = 0; i < r.data.specialTables.length; i++) {
            let labels = {
              bizType: r.data.specialTables[i].entityTypeStr,
              projectName: r.data.specialTables[i].name,
            };
            this.entityTypes.push(labels);
          }
        }
      });

      getChilds(id).then((r) => {
        this.workTableData = r.data;
      });
    },
    components: {
      ToggleForm,
    },
    methods: {
      backBtn() {
        this.$router.push({ name: "specialList", params: { index: this.$route.query.index } });
      },
      downloadFile(index, file) {
        let fileName = file.fileName;
        if (fileName) {
          fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        }
        downloadFile(file.fileId, fileName);
      },
      edit() {
        this.$router.push({ path: "edit", query: { opt: 'edit', id: this.planInfo.id, index: this.$route.query.index } });
      },
      start() {
        this.$confirm('确定启动该专项巡查计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let planId = this.planInfo.id;
          startPlan(planId).then(r => {
            if (!r.status) {
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
        }).catch(_ => { });
      }
    },
    data() {
      return {
        showBigPic: -1,//是否展示大图
        planInfo: {},
        planFiles: [],
        workTableData: [],
        entityTypes: [],
        filePath: "",
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
    margin: 5px 0;
    color: #33b2df;
    font-size: 14px;
    display: block !important;
  }

  .show-success-file {
    .file-item {
      .el-progress {
        display: inline-block;
        width: 130px;
      }
      .file-name {
        cursor: pointer;
        margin-right: 20px;
        color: #1787AD;
      }
      .not-pic {
        // color: #6D7787;
      }
      .delete-btn {
        color: #1787AD;
        cursor: pointer;
      }
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
  }
</style>