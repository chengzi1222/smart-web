<!--源本AI智能后厨改版1xxc-->
<template>
  <div class="AISCreen">
    <div class="title">{{title}}</div>
    <div class="clear_a centerBox">
      <div class="leftBox">
        <div class="minTitle">
          {{AiHotList[index]?AiHotList[index].channelName:''}}（{{currentIndex}}/{{AiHotList.length}}）
        </div>
        <div class="camera relative">
          <div id='video'>
          </div>
          <div class="pop absolute" v-if="popShow">
            <div class="photo">
              <img v-if="cameraType=='HK'" :src="pathFile+pop.bgUrl" alt="">
              <img v-if="cameraType=='AL'" :src="AIscreenshotUrl+pop.bgUrl" alt="">
              <img v-if="cameraType=='DH'" :src="pop.bgUrl" alt="">
              <div v-if="cameraType!=='DH'">
                <div class='screenshot' v-for='(item2,index2) in pop.location' :key="index2"
                  :style="{ width: (item2.width?item2.width:item2.w)*w_+'px',height: (item2.height?item2.height:item2.h)*h_+'px',top: item2.y*h_+'px',left: item2.x*w_+'px' }">
                </div>
              </div>
            </div>
            <div class="row clear_a">
              <ul class="detail clear_a">
                <li v-for='(val, index) in pop.picName' :key="index"
                  :class="{ 'hat': val=='无帽子', 'mask': val=='无口罩','gloves': val=='无手套', 'phone': val=='玩手机','mouse': val=='有老鼠', 'smoking': val=='抽烟', 'stranger': val=='陌生人'}">
                  {{NoType[val]}}</li>
              </ul>
              <div class="time textell fr">{{pop.warningTime}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="minTitle" v-if='AiHotList[index] && AiHotList[index].status=="1"'>
          分析结果
        </div>
        <div class="aiClose" v-if='AiHotList[index] && AiHotList[index].status!="1"'>
          历史分析记录（AI分析已关闭...）
        </div>
        <ul class="tagList clear_a">
          <li v-for='(val,key,i) in NoType'
            :class="{ 'hat': key=='无帽子', 'mask': key=='无口罩','gloves': key=='无手套', 'phone': key=='玩手机','mouse': key=='有老鼠', 'smoking': key=='抽烟', 'stranger': key=='陌生人'}">
            {{val}}</li>
        </ul>
        <div class="SideBar">
          <el-scrollbar style="height:100%; margin-bottom: 60px;" ref="elscrollbar">
            <ul>
              <li v-for="(item,index) in list" :key="item.id" class="card" :class="{'zoomIn':id==item.bgUrl}">
                <div class="photo">
                  <img v-if="item.type=='AL'" :src="AIscreenshotUrl+item.bgUrl" alt="">
                  <img v-if="item.type=='HK'" :src="pathFile+item.bgUrl" alt="">
                  <img v-if="item.type=='DH'" :src="item.bgUrl" alt="">
                  <div v-if="item.type=='AL'">
                    <div class='screenshot' v-for='(item2,index2) in item.location' :key="index2"
                      :style="{ width: (item2.width?item2.width:item2.w)*w+'px',height: (item2.height?item2.height:item2.h)*h+'px',top: item2.y*h+'px',left: item2.x*w+'px' }">
                    </div>
                  </div>
                  <div v-if="item.type=='HK'">
                    <div class='screenshot' v-for='(item2,index2) in item.location' :key="index2"
                      :style="{ width: (item2.width?item2.width:item2.w)*w_hk+'px',height: (item2.height?item2.height:item2.h)*h_hk+'px',top: item2.y*h_hk+'px',left: item2.x*w_hk+'px' }">
                    </div>
                  </div>
                </div>
                <div class="row clear_a">
                  <ul class="detail clear_a">
                    <li v-for='(val, index) in item.picName' :key="index"
                      :class="{ 'hat': val=='无帽子', 'mask': val=='无口罩','gloves': val=='无手套', 'phone': val=='玩手机','mouse': val=='有老鼠', 'smoking': val=='抽烟', 'stranger': val=='陌生人'}">
                      {{NoType[val]}}</li>
                  </ul>
                  <div class="time textell fr">{{item.warningTime}}</div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="btn btnLeft" v-show='index>0'>
      <div class="left" @click.stop="switch_('L')"></div>
    </div>
    <div class="btn btnRight" v-show='index<AiHotList.length-1'>
      <div @click.stop="switch_('R')"></div>
    </div>
  </div>
</template>

<script>
  import * as api from "api/bigData/AICamera.js"
  export default {
    data() {
      return {
        // wScale: 0,
        list: [],
        player: null,
        id: 0,
        index: 0,
        cameraId: '',
        entityId: '',
        entityName: '',
        AiHotList: [{
          status: 1
        }],
        setInterval_: null,
        createTime: null,
        willDestroy: false,
        cameraW: 1920,
        cameraH: 1080,
        pop: {},
        popShow: false,
        // w: 438 / 1920,
        // h: 327 /1080,
        NoType: {
          '无帽子': '无帽子',
          '无口罩': '无口罩',
          '无手套': '无手套',
          '玩手机': '玩手机',
          '有老鼠': '有老鼠',
          '抽烟': '抽烟',
          '陌生人': '陌生人'
          // 'stranger': '陌生人',
          // '人脸识别': '陌生人'
        },
        AIscreenshotUrl: 'http://aicamera-pic-res.ybveg.com/',
        cameraType: 'HK',
        aiPlatform: 'HK',
        title: '源本AI智能后厨',
        url: "http://hls01open.ys7.com/openlive/974045fb9db244e89649e13e6c0caf1d.hd.m3u8", //办公室顶部,
        timer: null
      };
    },
    beforeDestroy() {
      this.willDestroy = true;
      this.setInterval_ = null;
      clearInterval(this.setInterval_);
      this.player.dispose(); //离开页面时销毁播放器，停止流直播
    },
    computed: {
      w() {
        return 680 / this.cameraW
      },
      h() {
        return 360 / this.cameraH
      },
      w_() {
        return 1080 / this.cameraW
      },
      h_() {
        return 784 / this.cameraH
      },
      w_hk() {
        return 570 / this.cameraW
      },
      h_hk() {
        return 369 / this.cameraH
      },
      pathFile() {
        return this.$store.getters.filePath;
      },
      currentIndex() {
        return parseInt(this.index) + 1
      }
    },
    async mounted() {
      // this.entityId = '003c34f3648c4c8aaf8a8049fcc8d706';
      this.entityId = this.$route.query.entityId;
      this.index = this.$route.query.index;
      this.entityName = this.$route.query.name;
      await this.getUrl();
      this.playFlow(this.url)
      this.getList();
      this.setInterval(15000);
    },
    methods: {
      switch_(to) {
        if (to == 'L') {
          this.index = parseInt(this.index) - 1;
        } else {
          this.index = parseInt(this.index) + 1;
        }
        this.url = this.AiHotList[this.index].playerAddr;
        this.cameraId = this.AiHotList[this.index].id;
        this.aiPlatform = this.AiHotList[this.index].aiPlatform;

        this.playFlow(this.url);
        clearInterval(this.setInterval_);
        this.list = [];
        this.createTime = null;
        this.pop = {};
        clearTimeout(this.timer);
        this.popShow = false;
        this.getList();
        this.setInterval(15000);
      },
      async getUrl() {
        await api.getAiCaremaAddr(this.entityId).then(r => {
          if (!r.status || !r.data) {
            this.$message.error('AI摄像头视频流地址获取失败！')
            return
          }
          this.AiHotList = r.data.list;
          this.title = r.data.tittle
          this.url = this.AiHotList[this.index].playerAddr;
          this.cameraId = this.AiHotList[this.index].id;
          this.aiPlatform = this.AiHotList[this.index].aiPlatform;
        })
      },
      filterData(data) {
        if (data.length <= 0) {
          return [];
        }
        this.cameraType = data[0].type;
        this.createTime = data[0].warningTime;
        this.cameraW = data[0].width ? data[0].width : 1920;
        this.cameraH = data[0].height ? data[0].height : 1080;
        if (this.cameraType == 'HK') {
          // 海康数据
          for (let i = 0; i < data.length; i++) {
            if (
              Object.prototype.toString
              .call(data[i])
              .slice(8, -1)
              .toLowerCase() === "function"
            ) {
              continue;
            }
            data[i].location = JSON.parse(data[i].location);
            for (let a = 0; a < data[i].location.length; a++) {
              if (
                Object.prototype.toString
                .call(data[i].location[a])
                .slice(8, -1)
                .toLowerCase() === "function"
              ) {
                continue;
              }
              if(data[i].location[a].width && data[i].location[a].height) {
                data[i].location[a].x = data[i].location[a].x * 1920;
                data[i].location[a].y = data[i].location[a].y * 1080;
                data[i].location[a].width = data[i].location[a].width * 1920;
                data[i].location[a].height = data[i].location[a].height * 1080;
              } else {
                if(data[i].width && data[i].height) {
                  data[i].location[a].x = data[i].location[a].x * data[i].width;
                  data[i].location[a].y = data[i].location[a].y * data[i].height;
                  data[i].location[a].width = data[i].location[a].w * data[i].width;
                  data[i].location[a].height = data[i].location[a].h * data[i].height;
                } else {
                  data[i].location[a].x = data[i].location[a].x * 1280;
                  data[i].location[a].y = data[i].location[a].y * 720;
                  data[i].location[a].width = data[i].location[a].w * 1280;
                  data[i].location[a].height = data[i].location[a].h * 720;
                }
              }
            }
            data[i].picName = data[i].picName.split(",");
          }
        } else if(this.cameraType == 'DH') { // 大华
          for (let i = 0; i < data.length; i++) {
            if (
              Object.prototype.toString
              .call(data[i])
              .slice(8, -1)
              .toLowerCase() === "function"
            ) {
              continue;
            }
            data[i].picName = data[i].picName.split(",");
          }
        } else {
          // 阿里数据
          for (let i = 0; i < data.length; i++) {
            if (
              Object.prototype.toString
              .call(data[i])
              .slice(8, -1)
              .toLowerCase() === "function"
            ) {
              continue;
            }
            data[i].location = JSON.parse(data[i].location);
            data[i].picName = data[i].picName.split(",");
          }
        }
        return data
      },
      async getList() {
        await api.getAiCaremaScreenshot(this.cameraId,this.aiPlatform,this.createTime).then(r => {
          if (!r.status || !r.data) {
            this.$message.error('ai识别截图失败！')
            return
          }
          let data = this.filterData(r.data)
          this.popSetTimeout(data, 0)
          data.reverse().map(itrm => {
            this.list.unshift(itrm)
            if(this.cameraType === 'DH') 
            return;
            var div = this.$refs['elscrollbar'].$refs['wrap'];
            this.$nextTick(() => {
              div.scrollTop = 0;
              this.id = itrm.bgUrl;
              // 拿到数据中location后, 动态计算宽度比例;
              // let sidePhotoW = this.$refs['sidePhoto'][0].offsetWidth;
              // this.wScale = (sidePhotoW ? sidePhotoW : 567) / this.cameraW;
            })
          })
        })
      },
      popSetTimeout(data, i) {
        this.timer=null
        if (data&&data[i]) {
          this.pop = data[i]
          this.popShow = true;
          this.timer=setTimeout(() => {
            this.popShow = false;
            if (i<=2) {
              i++
              clearTimeout(this.timer)
              this.timer=setTimeout(() => {
                this.popSetTimeout(data, i)
              }, 2000)
            }
          }, 3000)
        }
      },
      setInterval(timer) {
        if (this.willDestroy) return;
        this.setInterval_ = setInterval(() => {
          this.getList();
        }, timer)
      },
      playFlow(playerAddr) {
        if(this.player) {
          this.player.dispose()
        }
        let videoObj = {
          "id": 'video',
          "source": playerAddr,
          "width": "100%",
          "height": "100%",
          // "videoWidth": "100px",
          // "videoHeight": "100px",
          "autoplay": true,
          "isLive": true,
          "rePlay": false,
          "playsinline": true,
          "preload": true,
          "language": "zh-cn",
          "controlBarVisibility": "hover",
          "useH5Prism": true,
          // 'useFlashPrism':true,
          "extraInfo": {
            "crossOrigin": "anonymous"
          },
          "skinLayout": [{
              "name": "bigPlayButton",
              "align": "blabs",
              "x": 30,
              "y": 80
            },
            {
              "name": "H5Loading",
              "align": "cc"
            },
            {
              "name": "infoDisplay"
            },
            {
              "name": "tooltip",
              "align": "blabs",
              "x": 0,
              "y": 56
            },
            {
              "name": "thumbnail"
            },
            {
              "name": "controlBar",
              "align": "blabs",
              "x": 0,
              "y": 0,
              "children": [{
                  "name": "playButton",
                  "align": "tl",
                  "x": 15,
                  "y": 12
                },
                {
                  "name": "fullScreenButton",
                  "align": "tr",
                  "x": 10,
                  "y": 12
                },
                {
                  "name": "volume",
                  "align": "tr",
                  "x": 5,
                  "y": 10
                },
              ]
            }
          ]
        }
        this.player = new Aliplayer(videoObj, (player) => {
          // console.log("播放器创建了。");
        })
      },
    },

    watch: {
      'list.length': {
        handler(newValue, oldValue) {
          if (newValue !== oldValue) {
            // console.log('新进图片')
          }
        }
      }
    },
  };
</script>
<style scoped lang='scss'>
  .AISCreen {
    width: 1920px;
    height: 1080px;
    background: #10161B url('~assets/img/AICamera/aiBg.png') center no-repeat;
    background-size: 100% 100%;
    position: relative;

    .title {
      width: 100%;
      height: 90px;
      line-height: 90px;
      background: url('~assets/img/AICamera/aiCameraMaxTitle.png') center no-repeat;
      background-size: 100% 100%;
      text-align: center;
      font-size: 48px;
      font-family: zcool-gdh;
      font-weight: 400;
      color: rgba(39, 197, 217, 1);
    }
  }

  .centerBox {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 20px 20px;
    height: calc(100% - 90px);
    width: calc(100% - 40px);

    .leftBox {
      width: 1260px;
      margin-right: 20px;
      height: 100%;

      .camera {
        width: calc(100% - 20px);
        height: calc(100% - 150px);
        padding: 38px 10px;
        background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));
        border: 1px solid rgba(40, 131, 146, 0.6);

        #video {
          width: 100%;
          height: 100%;
          background: transparent;

          >* {
            width: 100%;
            height: 100%;
          }
        }
      }

      .pop {
        width: 1100px;
        height: 864px;
        box-sizing: border-box;
        padding: 10px;
        top: 30px;
        left: 80px;
        background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));

        .photo {
          width: 1080px;
          height: 784px;

          >img {
            width: 100%;
            height: 100%;
          }

          .screenshot {
            position: absolute;
            border: 2px solid red;
          }
        }

        .row {
          width: 100%;
          height: 60px;
          line-height: 60px;
          margin: 0 auto;
          color: #fff;
          font-size: 24px;
          font-family: Alibaba PuHuiTi;
          font-weight: 400;

          .detail {
            li {
              width: 100px;
              height: 40px;
              border-radius: 4px;
              line-height: 40px;
              text-align: center;
              font-size: 24px;
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              margin: 15px 20px 5px 0;
            }

            li:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }

    .rightBox {
      width: calc(100% - 1280px);
      height: 100%;
      overflow: hidden;

      .tagList {
        height: 60px;

        >li {
          width: 80px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          text-align: center;
          font-size: 18px;
          font-family: Alibaba PuHuiTi;
          font-weight: 400;
          margin-bottom: 20px;
          margin-right: calc((100% - 7 * 80px) / 6);
        }

        >li:last-child {
          margin-right: 0;
        }
      }

      .SideBar {
        width: 100%;
        height: calc(100% - 60px);
        overflow-y: auto;

        .card {
          height: 429px;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
          background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));
          border: 1px solid rgba(40, 131, 146, 0.6);
          padding: 10px;

          .photo {
            width: 100%;
            height: 369px;
            margin: 0 auto;
            background: #fff;
            // color: red;
            position: relative;

            >img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
            }

            >div {
              width: 100%;
              height: 100%;
              position: absolute;
              z-index: 2;
              left: 0;
              top: 0;
            }

            .screenshot {
              position: absolute;
              border: 2px solid red;
            }
          }

          .row {
            width: 100%;
            height: 60px;
            line-height: 60px;
            margin: 0 auto;
            color: #fff;
            font-size: 20px;
            font-family: Alibaba PuHuiTi;
            font-weight: 400;

            // .time {
            //   width: 100%;
            // }

            .detail {
              // width: 100%;
              margin-top: -5px;

              li {
                width: 100px;
                height: 40px;
                border-radius: 4px;
                line-height: 40px;
                text-align: center;
                font-size: 24px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                margin: 10px 10px 10px 0;
              }

              li:last-child {
                margin-right: 0;
              }
            }
          }
        }

        .card:last-child {
          margin-bottom: 0px;
        }
      }

    }
  }

  .hat {
    background: #13463B;
    color: #19ECBD;
  }

  .mask {
    background: #60361B;
    color: #F47B1A;
  }

  .gloves {
    background: #0B4061;
    color: #33AEFC;
  }

  .phone {
    background: #505011;
    color: #F4F112;
  }

  .mouse {
    background: #444444;
    color: #CCCCCC;
  }

  .smoking {
    background: #591E68;
    color: #CA4BFF;
  }

  .stranger {
    background: #682A1E;
    color: #FF4F4B;
  }

  .minTitle {
    margin-bottom: 20px;
    width: 600px;
    height: 50px;
    font-size: 20px;
    text-align: center;
    color: #fff;
    line-height: 50px;
    background: url('~assets/img/AICamera/aiCameraMinTitle_.png') center no-repeat;
    background-size: 100% 100%;
  }

  .btn {
    height: 400px;
    width: 200px;
    position: fixed;
    top: calc((100% - 400px) / 2);

    &:hover div {
      display: block;
    }

    >div {
      margin-top: 140px;
      margin-left: 140px;
      cursor: pointer;
      height: 120px;
      width: 60px;
      background: url("~assets/img/AICamera/aiCameraRight_.png") no-repeat center;
      background-size: 100% 100%;
      display: none;
    }

    >.left {
      margin-left: 0px;
      background: url("~assets/img/AICamera/aiCameraleft_.png") no-repeat center;
      background-size: 100% 100%;
    }
  }

  .btnLeft {
    left: 0;
  }

  .btnRight {
    right: 0;
  }

  .aiClose {
    width: 100%;
    height: 51px;
    font-size: 24px;
    line-height: 51px;
    background: url('~assets/img/AICamera/titleBg.png') center no-repeat;
    background-size: 100% 100%;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  @-webkit-keyframes zoomIn {
    0% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3) translate3d(0, -500px, 0);
      transform: scale3d(.3, .3, .3) translate3d(0, -500px, 0)
    }

    50% {
      opacity: 1
    }
  }

  @keyframes zoomIn {
    0% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3) translate3d(0, -500px, 0);
      transform: scale3d(.3, .3, .3) translate3d(0, -500px, 0)
    }

    50% {
      opacity: 1
    }
  }

  .zoomIn {
    animation: zoomIn 0.5s ease-out;
    -webkit-animation: zoomIn 0.5s ease-out;
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>