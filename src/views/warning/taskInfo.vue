<template>
  <div>
    <div class="content">
      <div class="base fs14">
        <div class="clear_a">
          <span>任务名称： </span>
          <div>
            <span>{{taskInfo.taskName}}</span>
          </div>
        </div>
        <div class="clear_a">
          <span>预警级别： </span>
          <div>
            <span>{{taskInfo.taskLevel}}</span>
          </div>
        </div>
        <div class="clear_a">
          <span>企业形态： </span>
          <div>
            <span>{{taskInfo.enterpriseForm}}</span>
          </div>
        </div>
        <div class="clear_a">
          <span>预警信息： </span>
          <div>
            <div v-if="isOpen">
              <p v-html="reversedInfo">{{ reversedInfo }}</p>
              <span v-if="taskInfo.isToLong" class="openBt"  @click="change">展开</span>
            </div>
            <div v-if="!isOpen">
              <p v-html="reversedWarningInfo">{{ reversedWarningInfo }}</p>
              <span v-if="taskInfo.isToLong" class="openBt"  @click="change">收起</span>
            </div>
          </div>
        </div>
        <div class="clear_a">
          <span>相关链接： </span>
          <div>
            <a :href="taskInfo.url" target="_blank" v-if="taskInfo.url">{{taskInfo.url}}</a>
            <span v-if="!taskInfo.url">暂无</span>
          </div>
        </div>
        <div class="clear_a">
          <span>相关文件： </span>
          <div>
            <div class="show-success-file" v-if="taskInfo.fileList.length !== 0">
              <div class="file-item" v-for="(item,index) in taskInfo.fileList" :key="index">
                <span class="file-name not-pic" @click.stop="downloadFile(index,item)">
                  <a href="javascript:;">{{item.fileName}}</a></span>
              </div>
            </div>
            <span v-if="taskInfo.fileList.length === 0">暂无</span>
          </div>
        </div>
        <div class="clear_a" v-if="taskInfo.createTime">
          <span>发布时间： </span>
          <div>
            <span>{{ taskInfo.createTime }}</span>
          </div>
        </div>
        <div class="clear_a" v-if="taskInfo.deptName">
          <span>发布部门： </span>
          <div>
            <span>{{taskInfo.deptName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
      <img class="bigImg"  :src="dialogImageUrl" alt="">
    </div>
  </div>
</template>
<script>
  import {downloadFile} from 'api/common';
  export default {
    async mounted() {
      this.pathFile = this.$store.getters.filePath;
    },
    data () {
      return {
        showUrl:true,
        showPic:true,
        isOpen:true,
        dialogVisible: false,
        pathFile: "",
      }
    },
    props: {
      taskInfo: Object
    },
    watch: {
      taskInfo: {
        handler() {
          this.isOpen = this.taskInfo.isOpen
        },
        deep: true
      }
    },
    computed: {
      reversedWarningInfo: function () {
        return this.taskInfo.warningInfo
      },
      reversedInfo: function () {
        return this.taskInfo.info
      },
    },
    methods: {
      change() {
        if(this.isOpen){
          this.isOpen = false
        }else{
          this.isOpen = true
        }
      },
      downloadFile(index,file){
        console.log(file)
        let type = file.fileName.substr(file.fileName.lastIndexOf('.'));
        let isJPG =
          type === '.png' ||
          type === '.jpg' ||
          type === '.jpeg';
        if (isJPG) {
          this.dialogVisible = true;
          this.dialogImageUrl = this.pathFile + file.fileId;
        } else {
          downloadFile(file.fileId, file.fileName.substring(0, file.fileName.lastIndexOf(file.ext) - 1));
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    width: 86%;
    padding: 10px 7%;
    font-size: 14px;
  }
  .clear_a{
    display: table;
    width: 100%;
  }
  .clear_a>div{
    position: relative;
    color: #393939;
    top: -10px;
    margin: 10px;
    line-height: 30px;
    display: table-cell;
    vertical-align: top;
    width: 360px;
    word-wrap:break-word;
    word-break:break-all;
  }
  .clear_a>span{
    color: #6D7787;
    line-height: 30px;
    display: table-cell;
    vertical-align: top;
  }

  .openBt{
    color: #1787AD;
    cursor: pointer;
  }
  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top: 0;
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,.5);
  }
  .bigImg{
    min-width: 450px;
    max-width: 80%;
  }
</style>


