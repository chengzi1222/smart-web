<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>查看轮播图详情</span><div class="back" @click="backList()"><i class="icon iconfont icon-back"></i></div>
    </div>
    <div class="right-info right-info-news">
      <el-form label-width="130px" class="demo-ruleForm" ref="ruleForm">
        <!-- 基本信息 -->
        <toggle-form title="基本信息">
          <div class="content">
            <div class="row row-title">
              <el-form-item label="标题：">
                <el-tooltip class="item" effect="dark" placement="top-start" :content="dto.title">
                  <span class="textell">{{ dto.title }}</span>
                </el-tooltip>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="发布部门：">
                <span>{{ dto.pub_dept_name }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="发布状态：">
                <span>{{ dto.pub_yes == 'YES' ? '已发布' : '未发布' }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="轮播图封面：">
                <div class="imgbox" v-if="photo.length >= 1">
                  <div v-for="(item,index) in photo" @click.stop="ifbig(item)" class="imgdiv">
                    <img :src="item" alt="">
                    <span>预览</span>
                  </div>
                </div>
                <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                  <img :src="bigImgSrc">
                </div>
                <div v-if="photo.length == 0">
                  <span>无</span>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="链接类型：">
                <span>{{ dto.local_yes == 'YES' ? '本地资讯': '第三方链接' }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="链接地址：">
                <span>{{ dto.outside_url }}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <!--浮动的保存按钮层-->
      <div class="foot-btn">
        <div>
          <el-button @click="backList()">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import * as newsApi from 'api/news/news'

  export default {
    methods: {
      backList() {
        this.$router.push({ name: 'news.list', query: { tab_type: 'sliderImg' } });
      },
      ifbig(item) {
        let i = item;
        if (this.bigImgSrc == null || this.bigImgSrc != i) {
          this.bigImgSrc = i;
          this.showBigPic = true;
        } else {
          this.bigImgSrc = null;
        }
        if (item == -1) {
          this.showBigPic = false;
        }
      },
      loadDetail() {
        if (!this.$route.query.id) {
          return;
        }
        newsApi.detailPic({ id: this.$route.query.id }).then((r) => {
          if (r.status) {
            this.dto = r.data;
            let imgflag = '@#';
            if (this.dto.imgurls) {
              let str = this.dto.imgurls;
              let tempPhoto = str.toString().split(",");
              let tmpArr = [];
              for (let i = 0; i < tempPhoto.length; i++) {
                if (tempPhoto[i].indexOf(imgflag + "NEWSBIG") != -1) {
                  tmpArr.push(this.pathFile + tempPhoto[i].split(imgflag)[0]);
                }
              }
              this.photo = tmpArr;
            }
          }
        });
      }
    },

    mounted() {
      this.loadDetail();
    },
    data() {
      return {
        pathFile: this.$store.getters.filePath,
        newsId: this.$route.query.id,
        dto: {
          title: "感受到帮到你肥牛饭",
          pub_dept_name: "什么科室",
          imgurls: []
        },
        photo: [],
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
      }
    },
    components: {
      ToggleForm
    }
  }
</script>

<style scoped lang="scss">
  .back{
    cursor: pointer;
    display: inline-block;
    color: #606979;
    height: 22px;
    width: 22px;
    line-height: 22px;
  }
  .back i{
    font-size: 22px !important;
  }
  .bz {
    line-height: 20px;
    font-size: 12px;
    color: #A2AAB6;
  }

  .editorBox {
    border: 1px solid rgba(194, 202, 210, 1);
    padding: 20px;
    margin: 20px 50px;
  }

  .imgbox {
    width: 300px;
    min-height: 50px;
  }

  .imgdiv {
    float: left;
    width: 180px;
    height: 120px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
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
      left: 0;
    }
  }

  .imgbig {
    position: relative;
    z-index: 999;
    span {
      display: none !important;
    }
    img {
      transform: scale(2);
      border-radius: 0;
    }
  }

  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .row-title>div {
    margin-bottom: 7px;
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
</style>
