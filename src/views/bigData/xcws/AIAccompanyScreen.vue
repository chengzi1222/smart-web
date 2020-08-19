<!--源本AI智能后厨改版2xxc-->
<template>
  <div class="AISCreen">
    <div class="title">源本AI智能校长陪餐</div>
    <div class="clear_a centerBox">
      <div class="leftBox ">
        <div class="minTitle">
          实时视频
        </div>
        <div class="camera relative">
          <div class="subTitle absolute">
            <div>{{entityName}}</div>
          </div>
          <div id='video'>
          </div>
          <div class="pop absolute" v-show="popShow">
            <div class="photo">
              <img v-if="cameraType=='HK'" :src="pathFile+pop.bgUrl" alt="">
              <img v-if="cameraType=='AL'" :src="AIscreenshotUrl+pop.bgUrl" alt="">
              <div class='screenshot' v-for='(item2,index2) in pop.location' :key="index2"
                :style="{ width: item2.width*w_+'px',height: item2.height*h_+'px',top: item2.y*h_+'px',left: item2.x*w_+'px' }">
              </div>
            </div>
            <div class="row clear_a">
              <ul class="detail clear_a">
                <li v-for='val in pop.userName' :key="val" class="gloves">
                  {{val}}</li>
              </ul>
              <div class="time textell fr">{{pop.warningTime}}-{{time(pop.warningTime)}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="minTitle">
          陪餐记录
        </div>
        <div class="SideBar">
          <el-scrollbar style="height:100%" ref="elscrollbar">
            <ul>
              <li v-for="(item,index) in list" :key="item.id" class="card" :class="{'zoomIn':id==item.bgUrl}">
                <div class="photo">
                  <img v-if="cameraType=='HK'" :src="pathFile+item.bgUrl" alt="">
                  <img v-if="cameraType=='AL'" :src="AIscreenshotUrl+item.bgUrl" alt="">
                  <div class='screenshot' v-for='(item2,index2) in item.location' :key="index2"
                    :style="{ width: item2.width*w+'px',height: item2.height*h+'px',top: item2.y*h+'px',left: item2.x*w+'px' }">
                  </div>
                </div>
                <div class="row clear_a">
                  <ul class="detail clear_a">
                    <li v-for='val in item.userName' :key="val" class="gloves">
                      {{val}}</li>
                  </ul>
                  <div class="time textell fr">{{item.warningTime}}-{{time(item.warningTime)}}</div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from "api/bigData/AICamera.js"
  export default {
    data() {
      return {
        list: [],
        player: null,
        id: 0,
        index: 0,
        cameraId: '96149726ffa011e98b9e000c29fc5d43',
        entityId: '003c34f3648c4c8aaf8a8049fcc8d706',
        entityName: '',
        AiHotList: [],
        setInterval_: null,
        createTime: null,
        willDestroy: false,
        cameraW: 1920,
        cameraH: 1080,
        pop: {},
        popShow: false,
        // w: 438 / 1920,
        // h: 327 /1080,
        cameraType: 'HK',
        AIscreenshotUrl: 'http://aicamera-pic-res.ybveg.com/',
        url: "http://hls01open.ys7.com/openlive/66e32042ccf24ea298d3f92b4c2c811d.hd.m3u8",
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
        return 578 / this.cameraW
      },
      h() {
        return 340 / this.cameraH
      },
      w_() {
        return 1080 / this.cameraW
      },
      h_() {
        return 740 / this.cameraH
      },
      pathFile() {
        return this.$store.getters.filePath;
      }
    },
    async mounted() {
      // this.entityId = this.$route.query.entityId;
      // this.entityName = this.$route.query.name;
      this.entityName = '某某学校';
      this.playFlow(this.url)
      this.getList();
      this.setInterval(15000);

    },
    methods: {
      filterData(data) {
        if (data.length <= 0) {
          return [];
        }
        this.cameraType = data[0].type;
        this.createTime = data[0].warningTime;
        if (data[0].width !== null && data[0].height !== null) {
          this.cameraW = data[0].width;
          this.cameraH = data[0].height;
        }
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
              data[i].location[a].x = data[i].location[a].x * 1920;
              data[i].location[a].y = data[i].location[a].y * 1080;
              data[i].location[a].width = data[i].location[a].width * 1920;
              data[i].location[a].height = data[i].location[a].height * 1080;
            }
            data[i].userName = data[i].userName.split(",");
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
      getList() {
        api.getAIAccompanyV2(this.cameraId, this.createTime).then(r => {
          if (!r.status || !r.data) {
            this.$message.error('ai识别截图失败！')
            return
          }
          let data = this.filterData(r.data)
          this.popSetTimeout(data, 0)
          data.reverse().map(itrm => {
            this.list.unshift(itrm)
            var div = this.$refs['elscrollbar'].$refs['wrap'];
            this.$nextTick(() => {
              div.scrollTop = 0;
              this.id = itrm.bgUrl;
            })
          })
        })
      },
      popSetTimeout(data, i) {
        let timer = null
        if (data && data[i]) {
          this.pop = data[i]
          this.popShow = true;
          timer = setTimeout(() => {
            // this.popShow = false;
            // if (i <= 2) {
            //   i++
            //   clearTimeout(timer)
            //   timer = setTimeout(() => {
            //     this.popSetTimeout(data, i)
            //   }, 2000)
            // }
          }, 3000)
        }
      },
      time(timestamp) {
        let date = new Date(timestamp);
        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        let meal = ""
        if (h >= 0 && h < 10) {
          meal = '早'
        }
        if (h >= 10 && h < 15) {
          meal = '午'
        }
        if (h >= 15 && h < 24) {
          meal = '晚'
        }
        return meal + '餐';
      },
      setInterval(timer) {
        if (this.willDestroy) return;
        this.setInterval_ = setInterval(() => {
          this.getList();
        }, timer)
      },
      playFlow(playerAddr) {
        var videoObj = {
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
    padding: 20px 20px;
    height: calc(100% - 130px);
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

        .pop {
          width: 1100px;
          height: 820px;
          box-sizing: border-box;
          padding: 10px;
          top: 30px;
          left: 80px;
          background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));

          .photo {
            width: 1080px;
            height: 740px;

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
    }

    .rightBox {
     width: calc(100% - 1280px);
      height: 100%;
      overflow: hidden;

      .SideBar {
        width: 100%;
        height: calc(100% - 70px);
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
            height: 340px;
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
            height: 77px;
            line-height: 77px;
            margin: 0 auto;
            color: #fff;
            font-size: 26px;
            font-family: Alibaba PuHuiTi;
            font-weight: 400;
            .detail {

              li {
                width: 110px;
                height: 50px;
                border-radius: 4px;
                line-height: 50px;
                text-align: center;
                font-size: 26px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                margin: 15px 20px 0px 0;
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
    width: 370px;
    height: 51px;
    padding-left: 30px;
    color: #fff;
    line-height: 50px;
    background: url('~assets/img/AICamera/aiCameraMinTitle.png') center no-repeat;
    background-size: 100% 100%;
  }

  .subTitle {
    height: 50px;
    left: 0;
    top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    >div {
      padding: 0 20px;
      min-width: 240px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: rgba(11, 22, 30, 0.7);
      font-size: 26px;
      font-family: Alibaba PuHuiTi;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
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