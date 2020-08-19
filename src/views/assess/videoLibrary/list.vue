<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>视频库</span>
    </div>

    <div class="user-box" v-loading='loading'>
      <div class="mt20 mb20 clear_a">
        <el-input placeholder="视频名称" class="w250 seekIpt" v-model="queryLimit.name" @keyup.enter.native="changeSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch"></i>
        </el-input>
        <el-button class="selectHeight floatR mr20" type="primary" @click="pop('add',null)"><i
            style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
      </div>
      <ul class="videoList clear_a" v-if="videoList.length>0">
        <li class="relative movePoin" :key="index" v-for="(item,index) in videoList" @click="pop('info',item)">
          <div class="shade">
            <img :src="require('assets/img/play_icon.png')">
          </div>
          <img :src="pathFile+item.coverFileId" alt="logo" />
          <p class="textell">{{item.name}}</p>
        </li>
      </ul>
      <div class="mt20 mb20 textC" v-if="videoList.length<=0">暂无数据</div>
      <div class="pagination-box fr mt20">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
          :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!-- 弹框 -->
    <yb-popup @close="cancel" :isShow="popShow" :title="title" width="500">
      <div slot="body">
        <div class="row clear_a">
          <div class="left textR"><span class="red">*</span>视频名称：</div>
          <div class="right">
            <el-input v-if="type!='info'" placeholder="30字以内" maxlength=30 v-model="obj.name" class="w250"></el-input>
            <div v-else> {{obj.name}}</div>
          </div>
        </div>
        <div class="row clear_a">
          <div class="left textR"><span class="red">*</span>视频封面：</div>
          <div class="right">
            <togOssUpload v-if="type!='info'" :maxLength=1 @uploadSuccess='getFiles' @uploadError="getFiles"
              @remove='getFiles' :filesArr='coverFiles'></togOssUpload>
            <div class="imgVideo" v-else>
              <img :src="pathFile+obj.coverUrl" alt="加载失败">
            </div>
            <p v-if="type!='info'">格式支持jpg，png，gif，10M以内</p>
          </div>
        </div>
        <div class="row clear_a">
          <div class="left textR"><span class="red">*</span>上传视频：</div>
          <div class="right">
            <videoOssUpload v-if="type=='add'" :maxLength=1 @uploadSuccess='getVideo' @uploadError="getVideo"
              @remove='getVideo' :filesArr='videoFiles'></videoOssUpload>
            <div class="imgVideo " v-else>
              <video :src="pathFile+obj.videoUrl" controls autoplay alt="加载失败"></video>
            </div>
            <p v-if="type!='info'">格式支持m3u8，3gp，mp4，1个G以内</p>
            <p v-if="type=='info'&&obj.isDel">此视频关联的课程正在使用中，不可删除。</p>
          </div>
        </div>
      </div>
      <div slot="foot" v-if="type!='info'">
        <el-button class="w80" type="default" @click="cancel">取消</el-button>
        <el-button class="w80" type="primary" :disabled="disabled" @click="submit">确定</el-button>
      </div>
      <div slot="foot" v-else>
        <el-button class="w80" type="default" :disabled='obj.isDel' @click="del">删除</el-button>
        <el-button class="w80" type="primary" @click="edit()">编辑</el-button>
      </div>
    </yb-popup>

  </div>
</template>
<script>
  import * as api from "api/assess/index";
  import YbPopup from "components/ybpopup/YbPopup.vue";
  import videoOssUpload from "components/togOss/videoUpload";
  import togOssUpload from "components/togOss/imgUpload";
  export default {
    components: {
      YbPopup,
      videoOssUpload,
      togOssUpload,
    },

    data() {
      return {
        type: 'add',
        title: '添加视频',
        queryLimit: {
          pageNum: 1,
          pageSize: 10,
          name: ''
        },
        total: 0,
        videoList: [{
          url: require("../../../assets/img/pic_loading.png"),
          name: "餐饮安全卫生视频",
          videoUrl: "https://ybveg.com/video1",
          order: 2
        }],
        loading: false,
        popShow: false,
        obj: {
          name: '',
          cover: '',
          coverUrl: "",
          video: '',
          videoUrl: '',
          id: '',
          isDel: false
        },
        coverFiles: [],
        videoFiles: [],
        disabled:false,

      };
    },
    computed: {
      pathFile() {
        return this.$store.getters.filePath;
      }
    },
    mounted() {
      this.searchPage();
    },
    methods: {
      pop(type, row) {
        this.type = type;
        this.title = type == 'add' ? '添加视频' : '编辑视频';
        this.popShow = true;
        this.obj = {
          name: '',
          cover: '',
          video: '',
          id: '',
          isDel: false
        }
        this.coverFiles = []
        this.videoFiles = []
        if (type == 'info') {
          this.obj = {
            name: row.name,
            cover: row.cover[0].id,
            coverUrl: row.cover[0].fileId,
            video: row.video[0].id,
            videoUrl: row.video[0].fileId,
            id: row.id,
            isDel: row.correlation ? true : false
          }
          this.coverFiles = [{
            fileId: row.cover[0].fileId,
            id: row.cover[0].id,
            url: this.pathFile + row.cover[0].fileId,
            name: row.cover[0].fileName
          }]
          this.videoFiles = [{
            fileId: row.video[0].fileId,
            id: row.video[0].id,
            url: this.pathFile + row.video[0].fileId,
            name: row.video[0].fileName
          }]
        }
      },
      edit() {
        this.type = 'edit';
        this.title = '编辑视频';
      },
      del() {
        this.$confirm("是否确定删除该视频?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.videoDel(this.obj.id).then(r => {
            if (r.status) {
              this.$message.success("删除成功")
              this.popShow = false;
              this.changeSearch()
            }
          })
        })
      },
      submit() {
        if (this.obj.name == '') {
          this.$message.error('视频名称必须上传')
          return
        }
        if (this.obj.video.length <= 0 || this.obj.cover.length <= 0) {
          this.$message.error('视频封面和视频必须上传')
          return
        }
        this.disabled=true
        api.videoUpdate(this.obj).then((r) => {
          if (!r.status) {
            this.$message({
              message: r.message,
              type: r.level
            });
            this.disabled=false
            return;
          }
          let str = this.type == 'add' ? '添加视频' : '编辑视频'
          this.$message({
            message: str + '成功!正在返回列表',
            type: 'success'
          });
          this.popShow = false;
          this.changeSearch()
          this.disabled=false
        })

      },
      cancel() {
        // 清空数据
        this.popShow = false;
      },
      getVideo(files, state) {
        this.obj.video = files.map(item => item.id).toString()
      },
      getFiles(files, state) {
        this.obj.cover = files.map(item => item.id).toString()
      },
      searchPage() {
        this.loading = true;
        api.videolist(this.queryLimit).then(result => {
          if (result.status) {
            this.videoList = result.data.list;
            this.videoList.map(item => {
              item.coverFileId = item.cover[0].fileId
            })
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      changeSearch() {
        this.queryLimit.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.queryLimit.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.queryLimit.pageSize = size;
        this.changeSearch();
      },

    }
  };
</script>
<style lang="scss" scoped>
  .videoList li {
    width: 18.8%;
    margin-top: 20px;
    height: 170px;
    margin-right: 1.5%;
    margin-bottom: 20px;

    img {
      width: 100%;
      height: 128px;
      border-radius: 8px;
      overflow: hidden;
    }

    p {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #393939;
      line-height: 42px;
    }

    .shade {
      width: 100%;
      height: 128px;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 8px;
      overflow: hidden;
      background: rgba(9, 9, 9, 0);
      transition: all 0.5s;
      opacity: 0;

      img {
        width: 44px;
        height: 44px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -22px;
        margin-left: -22px;
      }
    }

  }

  .videoList li:hover .shade {
    background: rgba(9, 9, 9, 0.25);
    opacity: 1;
  }

  .videoList li:nth-child(5n+5) {
    margin-right: 0px;
  }

  .imgVideo {
    width: 180px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    >img {
      width: 100%;
      height: 100%;
    }

    >video {
      width: 100%;
      height: 100%;
    }
  }

  .row {
    margin-bottom: 20px;

    .left {
      color: #393939;
      width: 150px;
      font-size: 14px;
    }

    .right {
      width: 340px;
      color: #A2AAB6;

      p {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(162, 170, 182, 1);
        margin-top: 10px;
      }
    }
  }
</style>