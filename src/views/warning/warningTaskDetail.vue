<template>
  <div class="randomTask" style="padding:0 0 40px 0">
    <div class="page-tilt">
      <b></b><span>{{ taskInfo.taskName }}预警任务</span>
    </div>
    <toggle-form title="任务内容">
      <div class="detal-box">
        <taskInfo :taskInfo="taskInfo"></taskInfo>
      </div>
      <!-- 底部按钮taskBase -->
      <div class="foot-btn" style="z-index:1">
        <div>
          <el-button type="default" @click="goBack">返回</el-button>
          <el-button type="primary" @click="toSituation">执行情况</el-button>
        </div>
      </div>
    </toggle-form>
  </div>
</template>

<script>
  import taskInfo from "./taskInfo.vue";
  import ToggleForm from 'components/ToggleForm'
  import { getWarningTaskById } from 'api/warning/warning'

  export default {
    async mounted() {
      console.log(this.$route.query.warningTaskId)
      getWarningTaskById(this.$route.query.warningTaskId).then(result =>{
        this.taskInfo = result.data
        this.taskInfo.warningInfo = this.replaceTextareaT(this.taskInfo.warningInfo)
        console.log(this.taskInfo.warningInfo.length)
        if(this.taskInfo.warningInfo.length > 120){
          this.taskInfo.info = this.replaceTextarea(this.taskInfo.warningInfo.substring(0,120))
          this.taskInfo.isOpen = true
          this.taskInfo.isToLong = true
        }else {
          this.taskInfo.info = this.replaceTextarea(this.taskInfo.warningInfo)
          this.taskInfo.isOpen = false
          this.taskInfo.isToLong = false
        }
        this.taskInfo.warningInfo = this.replaceTextarea(this.taskInfo.warningInfo)
        this.taskInfo.fileList.forEach(s =>{
          s.ext =  s.fileName.split(".")[1]
        })
      })
    },
    methods: {
      toSituation() {
        this.$router.push({name: 'warning.info', query: {'warningTaskId': this.$route.query.warningTaskId,'warningTaskName': this.taskInfo.taskName}})
      },
      goBack () {
        this.$router.go(-1)
      },
      replaceTextarea (str) {
        str = str.replace(/\r\n/g, '<br/>'); //IE9、FF、chrome
        str = str.replace(/\s/g, '&nbsp;'); //空格处理
        return str;
      },
      replaceTextareaT (str) {
        str = str.replace(/&nbsp;/g," ");
        return str;
      },
    },
    data() {
      return {
        taskInfo: {
          taskName: "",
          taskLevel: "",
          warningInfo: "",
          createTime:"",
          deptName:"",
          url: "",
          enterpriseFormList: [],
          fileList: [],
          isOpen: true,
          isToLong: true
        },
      }
    },
    components: {
      taskInfo,
      ToggleForm,
    }
  }
</script>
<style scoped lang="sass">
  .detal-box{
    width: 600px;
    margin: 50px auto;
  }
</style>
