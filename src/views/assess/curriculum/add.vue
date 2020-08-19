<template>
  <div>
    <div class="page-tilt">
      <b></b><span>{{baseObj.id!=''?'课程编辑':'课程添加'}}</span>
    </div>
    <div class="mb200">
      <el-form :model="baseObj" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
          <div class="content">
            <el-form-item label="课程名称：" prop="name" required>
              <el-input placeholder="30字以内" class="w300" :disabled='baseObj.correlation' maxlength="30" v-model="baseObj.name"></el-input>
            </el-form-item>
            <el-form-item label="学时：" prop="period" required>
              <el-input-number class="w300" :disabled='baseObj.correlation'  placeholder="大于0小于12小时，保留一位小数" :precision="1" v-model="baseObj.period"
                controls-position="right" :min="0.1" :max="12"></el-input-number>
            </el-form-item>
            <el-form-item label="课程描述：" prop="description" required>
              <el-input placeholder="100字以内" class="w300" :rows="5" maxlength="100" type="textarea"
                v-model="baseObj.description"></el-input>
            </el-form-item>
            <el-form-item label="行业类型：" prop="entityType" required>
              <el-checkbox-group class="w550" v-model="baseObj.entityType">
                <el-checkbox-button class="mr20" v-for="item in entityType" :label="item.key" :key="item.key">
                  {{item.name}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input placeholder="300字以内" maxlength="300" class="w300" :rows="5" type="textarea"
                v-model="baseObj.remark"></el-input>
            </el-form-item>
            <el-form-item label="课程附件：">
              <attachmentUpload :maxLength=5 @uploadSuccess='getAttachment' @uploadError="getAttachment"
                @remove='getAttachment' :filesArr='filesArr'></attachmentUpload>
              <p class="tip">最多5个附件，支持pdf文档格式，附件最大为5M</p>
            </el-form-item>
            <el-form-item label="视频附件：">
              <el-button @click="popShow=true;">上传视频</el-button>
              <div v-if='video.videoFileId' style="text-align: left;">
                <video width="180px" height="120px" :src="pathFile+video.videoFileId" controls autoplay
                  alt="加载失败"></video>
                <p>{{video.name}} <i class="el-icon-delete ml20 fs18 movePoin" style="color:#0DB5EF"
                    @click="video={}"></i></p>
              </div>
            </el-form-item>

          </div>
        </ToggleForm>
      </el-form>
      <ToggleForm title="课程内容">
        <div class="editorBox">
          <editor-demo @EditorChange="editHmtl" :type_='"PXKH"' :resetHtml="resetHtml"
            @getPicIdToParent="getPicIdFromChild">
          </editor-demo>
        </div>
      </ToggleForm>
    </div>
    <!-- 视频弹窗-->
    <el-dialog title="添加视频" :visible.sync="popShow" :append-to-body="true" top="100px" width="800px">
      <div class=" clear_a">
        <el-input placeholder="视频名称" class="w250 seekIpt" v-model="queryLimit.name"  @keyup.enter.native="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
      <div class="clear_a" v-loading='loading'>
        <div class="videoList movePoin" v-if="videoList.length>0" :class="{'activeVideoList':video.id==item.id}"
          @click="video=item;popShow=false;" v-for="(item,index) in videoList" :key="index+1" :label="index+1">
          <i class="el-icon-success"></i>
          <img :src="pathFile+item.coverFileId" alt="logo" />
          <p class="textell">{{item.name}}</p>
        </div>
        <div class="textC mt20" style="width:100%"  v-if="videoList.length<=0">
          <p>抱歉，没有搜索到与“食品教育”相关的视频。</p>
          <p class="mt20 mb20">您可以点击按钮去视频库上传视频。</p>
          <el-button @click="$router.push({name: 'assess.videoLibrary'});" type='primary'>去上传视频</el-button>
        </div>
        <div class="pagination-box fr mt20">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="queryLimit.pageNum" :page-sizes="[6, 12, 18]" :page-size="queryLimit.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button class="w100 mr10" @click="$router.go(-1)">返回</el-button>
        <el-button type="primary w100" @click="add">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import * as api from "api/assess/index";
  import EditorDemo from "components/EditorDemo.vue";
  import attachmentUpload from "components/togOss/attachmentUpload";
  import {
    getPublic,
    getEntityType,
    getYear
  } from "../com.js";
  export default {
    data() {
      return {
        filesArr: [],
        keyword: '',
        popShow: false,
        video: {},
        videoList: [{
          url: require("../../../assets/img/boxBG.png"),
          name: "餐饮安全卫生视频",
          videoUrl: "https://ybveg.com/video1",
          order: 2
        }, ],
        queryLimit: {
          pageNum: 1,
          pageSize: 6,
          name: ''
        },
        total: 0,
        loading: false,
        entityType: [],
        resetHtml: "",
        rules: {
          name: [{
              required: true,
              message: '请输入课程名称',
              trigger: 'blur'
            },

          ],
          period: [{
            type: 'number',
            required: true,
            message: '请输入学时，大于0小于12小时，保留一位小数',
            trigger: 'blur'
          }, ],
          description: [{
            required: true,
            message: '请输入课程描述',
            trigger: 'blur'
          }, ],
          entityType: [{
            required: true,
            type: 'array',
            message: '请选择行业类型',
            trigger: 'change'
          }]
        },
        baseObj: {
          courseAccessory: [],
          entityType: [],
          name: '',
          period: '',
          content: "",
          description: "",
          id: '',
          remark: '',
          videoAccessory: ''
        },
      };
    },
    components: {
      ToggleForm,
      EditorDemo,
      attachmentUpload
    },
    computed: {
      pathFile() {
        return this.$store.getters.filePath;
      }
    },
    async mounted() {
      this.entityType = await getEntityType()
      this.getVideo()
      if (this.$route.query.id) {
        this.baseObj.id = this.$route.query.id;
        this.get()
      }
    },
    methods: {
      pagecCurrentChange(num) {
        this.queryLimit.pageNum = num;
        this.getVideo();
      },
      pageSizeChange(size) {
        this.queryLimit.pageSize = size;
        this.queryLimit.pageNum = 1;
        this.getVideo();
      },
      search() {
        this.queryLimit.pageNum = 1;
        this.getVideo();
      },
      getVideo() {
        this.loading = true;
        api.videolist(this.queryLimit).then(result => {
          if (result.status) {
            this.videoList = result.data.list;
            this.videoList.map(item => {
              item.videoFileId = item.video[0].fileId
              item.coverFileId = item.cover[0].fileId
            })
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      get() {
        api.courseDetail(this.baseObj.id).then(r => {
          if (r.status) {
            this.baseObj = r.data;
            this.resetHtml = this.baseObj.content
            this.filesArr = []
            this.baseObj.courseAccessory.map(item => {
              this.filesArr.push({
                fileId: item.fileId,
                id: item.id,
                url: this.pathFile + item.fileId,
                name: item.fileName
              })
            })
            this.baseObj.courseAccessory=this.baseObj.courseAccessory.map(item => item.id)
            this.baseObj.videoAccessory.map(item => {
              this.video = {
                videoFileId: item.fileId,
                name:this.type=='add'? item.fileName :this.baseObj.videoName,
                id: item.issueId,
              }
            })
             this.baseObj.videoAccessory=this.baseObj.videoAccessory.map(item => item.id)
          }
        })
      },
      add() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.video.id) {
              this.baseObj.videoAccessory = this.video.id
            }
            api.courseUpdate(this.baseObj).then((r) => {
              if (!r.status) {
                this.$message({
                  message: r.message,
                  type: r.level
                });
                return;
              }
              let str = this.baseObj.id != '' ? '编辑' : '添加'
              this.$message({
                message: '课程' + str + '成功!正在返回列表',
                type: 'success'
              });
              this.$router.push({
                name: 'assess.curriculum'
              })
            })
          }
        })
      },
      getAttachment(files, state) {
        this.baseObj.courseAccessory = files.map(item => item.id)
      },
      //获得富文本编辑器上传的图片文件的id,并添加到this.dto.picIdList中去
      getPicIdFromChild(data) {
        // console.log(data)
        // if (!data) {
        //   return;
        // }
        // this.dto.picIdList.push(data);
      },
      editHmtl(html) {
        // console.log(html, 8888)
        this.baseObj.content = html;
      },
    },
    watch: {}
  };
</script>

<style scoped lang="scss">
  .content {
    width: 700px;
    margin: 30px auto 0;
  }

  .w550 {
    width: 550px !important;
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
      }

      .file-name:hover {
        color: #1fabdc;
      }

      .not-pic {
        // color: #6d7787;
      }

      .delete-btn {
        color: #1787ad;
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

  .mb200 {
    margin-bottom: 200px;
  }

  .videoList {
    width: 30%;
    margin-top: 20px;
    height: 180px;
    margin-right: 5%;
    margin-bottom: 15px;
    position: relative;

    img {
      width: 100%;
      height: 135px;
      border-radius: 8px;
      overflow: hidden;
      box-sizing: border-box;
    }

    p {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #393939;
      line-height: 42px;
    }

    .el-icon-success {
      font-size: 30px;
      color: #0DB5EF;
      position: absolute;
      right: 10px;
      top: 10px;
      display: none;
    }

  }

  .videoList:hover img {
    border: #0DB5EF 3px solid;
  }

  .videoList:hover .el-icon-success {
    display: block;
  }

  .activeVideoList img {
    border: #0DB5EF 3px solid;
  }

  .activeVideoList .el-icon-success {
    display: block;
  }

  .videoList:nth-child(3n+3) {
    margin-right: 0px;
  }
</style>