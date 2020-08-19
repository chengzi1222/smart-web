<template>
  <div class="big-div">
    <div class="box-div">
      <h2 class="nameH2">{{table[this.type]}}</h2>
      <div class="info-div mt20">
        <div class="rowLong"
          v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'CLOSE' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">投诉标题：</span>
          <span class="info-span">{{recordData.complaintTitle}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">投诉编号：</span>
          <span class="info-span">{{recordData.complaintNo}}</span>
        </div>
        <div class="row"
          v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'CLOSE' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">被投诉主体：</span>
          <span class="info-span">{{recordData.entityName}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'ALREADY_INFO'">
          <span class="name-span">所属区县：</span>
          <span class="info-span">{{recordData.areaName}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'ALREADY_INFO'">
          <span class="name-span">经营者/负责人：</span>
          <span class="info-span">{{recordData.entityContacts}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'ALREADY_INFO'">
          <span class="name-span">被投诉主体电话：</span>
          <span class="info-span">{{recordData.entityPhone}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">投诉人：</span>
          <span class="info-span">{{recordData.complaintPerson}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'ALREADY_INFO'">
          <span class="name-span">投诉人电话：</span>
          <span class="info-span">{{recordData.complaintPhone}}</span>
        </div>
        <div class="row" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'ALREADY_INFO'">
          <span class="name-span">投诉时间：</span>
          <span class="info-span">{{recordData.createTime}}</span>
        </div>
        <div class="rowLong" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'ALREADY_INFO'">
          <span class="name-span">问题类型：</span>
          <span class="info-span">{{recordData.problemTypeStr}}</span>
        </div>
        <div class="rowLong"
          v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'CLOSE' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">投诉内容：</span>
          <span class="info-span">{{recordData.complaintContent}}</span>
        </div>
        <div class="rowLong" v-if="type === 'INFO' || type === 'FEEDINFO' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span" style="vertical-align: top;">图片附件：</span>
          <div class="info-span">
            <img v-for="(pic, index) in recordData.togFileList" style="height: 100px;width: 100px;margin-right: 10px;"
              :src="pic" alt="">
            <!-- <img src="~assets/img/subjectData/4kTrace/traceLeftB.png" alt=""> -->
          </div>
        </div>
        <div class="rowLong" v-if="type === 'FEEDINFO' || type === 'ALREADY_INFO' || type === 'ALREADY_INFO'">
          <span class="name-span">反馈时间：</span>
          <span class="info-span">{{recordData.feedbackTime?recordData.feedbackTime:'无'}}</span>
        </div>
        <div class="rowLong" v-if="type === 'FEEDINFO' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">反馈部门：</span>
          <span class="info-span"
            v-if="type === 'FEEDINFO' || type === 'ALREADY_INFO'">{{recordData.feedbackCompay?recordData.feedbackCompay:'无'}}</span>
          <el-input v-model="feedbackCompay" maxlength="20" v-if="type === 'REFEED' || type === 'FEED'" class="w200"
            placeholder="请输入反馈部门"></el-input>
        </div>
        <div class="rowLong" v-if="type === 'FEEDINFO' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">反馈人：</span>
          <span class="info-span"
            v-if="type === 'FEEDINFO' || type === 'ALREADY_INFO'">{{recordData.feedbackPerson?recordData.feedbackPerson:'无'}}</span>
          <el-input v-model="feedbackPerson" maxlength="20" v-if="type === 'REFEED' || type === 'FEED'" class="w200"
            placeholder="请输入反馈人姓名"></el-input>
        </div>
        <div class="rowLong" v-if="type === 'FEEDINFO' || type === 'REFEED' || type === 'FEED' || type === 'ALREADY_INFO'">
          <span class="name-span">反馈内容：</span>
          <span class="info-span"
            v-if="type === 'FEEDINFO' || type === 'ALREADY_INFO'">{{recordData.feedbackContent?recordData.feedbackContent:'无'}}</span>
          <el-input v-model="feedbackContent" maxlength="500" v-if="type === 'REFEED' || type === 'FEED'" class="w300"
            type="textarea" :rows="4" placeholder="请输入反馈内容，500字以内"></el-input>
        </div>
        <div class="rowLong" v-if="type === 'FEEDINFO'">
          <span class="name-span">删除时间：</span>
          <span class="info-span">{{recordData.closeTime}}</span>
        </div>
        <div class="rowLong" v-if="type === 'FEEDINFO'">
          <span class="name-span">删除原因：</span>
          <span class="info-span">{{recordData.closeCauseStr}}</span>
        </div>
        <div class="rowLong" v-if="type === 'CLOSE'">
          <span class="name-span">删除原因：</span>
          <enum-select v-model="closeCause" placeholder="请选择删除原因"
            enum="com.ybveg.govx.enums.food.GuardComplaintCloseCauseEnum" @change=""></enum-select>
        </div>
      </div>
      <div class="btn-div mt20 mb20">
        <el-button v-if="type != 'CLOSE'" type="primary" @click="close">关闭</el-button>
        <el-button v-if="type == 'CLOSE'" type="primary" @click="close">取消</el-button>
        <el-button v-if="type !== 'INFO' && type != 'FEEDINFO'" type="primary" @click="submit">确定</el-button>
        <el-button v-if="type === 'INFO'" type="primary" @click="type='FEED'">反馈</el-button>
        <el-button v-if="type === 'ALREADY_INFO'" type="primary" @click="type='REFEED'">重新反馈</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import EnumSelect from 'components/common/EnumSelect'
  import * as guard from 'api/guard'
  export default {
    components: { EnumSelect },
    props: {
      type: {
        type: String
      },
      record: {
        type: Object,
        default: {}
      }
    },
    mounted() {
      this.recordData = this.record;
      if (this.type === 'INFO' || this.type === 'FEEDINFO' || this.type === 'REFEED' 
      || this.type === 'FEED' || this.type === 'ALREADY_INFO') {
        guard.complaintInfo(this.recordData.id).then(r => {
          if (r.status) {
            let data = JSON.parse(r.data)
            let createTime = this.recordData.createTime
            let areaName = this.recordData.areaName
            this.recordData = data.data
            this.recordData.createTime = createTime
            this.recordData.areaName = areaName
          } else {
            this.$message.warning(r.message)
          }
        })
      } else if (this.type === "REFEED") {
        this.feedbackContent = this.recordData.feedbackContent;
        this.feedbackPerson = this.recordData.feedbackPerson;
        this.feedbackCompay = this.recordData.feedbackCompay;
      }
    },
    data() {
      return {
        feedbackCompay: '',
        feedbackPerson: '',
        feedbackContent: '',
        closeCause: '',
        table: {
          FEEDINFO: '详情',
          INFO: '详情',
          FEED: '反馈',
          CLOSE: '关闭',
          REFEED: '重新反馈',
          OPEN: '恢复',
          ALREADY_INFO: '详情'
        },
        recordData: {}
      }
    },
    methods: {
      close() {
        this.$emit("close")
      },
      refClose() {
        this.$emit("refClose")
      },
      submit() {
        if (this.type === 'FEED' || this.type === 'REFEED') {
          if (!this.feedbackPerson) {
            this.$message.error('请输入反馈人');
            return
          }
          if (!this.feedbackContent) {
            this.$message.error('请输入反馈内容');
            return
          }
          if (!this.feedbackCompay) {
            this.$message.error('请输入反馈部门');
            return
          }
          guard.feedbackUpdate({
            'feedbackCompay': this.feedbackCompay,
            'feedbackPerson': this.feedbackPerson,
            'feedbackContent': this.feedbackContent,
            'id': this.recordData.id
          }).then(r => {
            if (r.status) {
              this.refClose()
            } else {
              this.$message.warning(r.message)
            }
          })
        } else if (this.type === 'CLOSE') {
          if(!this.closeCause){
            this.$message.error('请选择删除原因');
            return;
          }
          guard.closeOpen(this.recordData.id, 'YES', this.closeCause).then(r => {
            if (r.status) {
              this.refClose()
            } else {
              this.$message.warning(r.message)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .big-div {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background: rgba(0, 0, 0, .8);
    overflow: auto;
  }

  .box-div {
    position: absolute;
    top: 150px;
    left: 50%;
    margin-left: -390px;
    background: #fff;
    width: 780px;
    margin-bottom: 50px;
  }

  .nameH2 {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #393939;
    background: rgba(242, 245, 248, 1);
  }

  .info-div {
    display: flex;
    flex-wrap: wrap;
  }

  .info-div div {
    min-height: 55px;
    line-height: 55px;
  }

  .info-div .rowLong {
    width: 100%;
  }

  .info-div .row {
    width: 50%;
  }

  .info-div .name-span {
    width: 150px;
    display: inline-block;
    text-align: right;
    vertical-align: top;
  }

  .info-div .info-span {
    display: inline-block;
    max-width: calc(100% - 180px);
  }

  .rowLong .info-span {
    line-height: 30px;
    margin-top: 10px;
  }

  .btn-div {
    text-align: right;
    padding-right: 20px;
  }
</style>