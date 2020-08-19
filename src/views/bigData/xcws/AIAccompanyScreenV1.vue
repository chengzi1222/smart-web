<!--版本一-->
<template>
  <div class="AISCreen">
    <div class="title">源本AI智能校长陪餐</div>
    <div class="clear_a centerBox">
      <div class="leftBox">
        <div class="minTitle">
          实时视频
        </div>
        <div class="camera">
          <div id='video'>
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
              <li v-for="(item,index) in list" :class="{'zoomIn':id==item.faceUrl}">
                <div class="photo"><img style="width:100%;height:100%" :src="item.faceUrl" alt=""></div>
                <div class="row clear_a">
                  <div class="detail textell"> {{item.vipName}}</div>
                  <div class="time">{{time(item.faceTime)}}</div>
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
        oldTotal: 0,
        url:
          // 'http://hls01open.ys7.com/openlive/567585e8abb04798a102c39b865bf8a4.hd.m3u8'
          // 'http://cameralive.ybveg.com/cameraplay/34020000001310000002.m3u8?auth_key=1571824902-0-0-9acab4466a088685f93e20d285350d56'
          "http://hls01open.ys7.com/openlive/66e32042ccf24ea298d3f92b4c2c811d.hd.m3u8",
      };
    },
    async mounted() {
      this.playFlow(this.url)
      this.getList();
      this.setInterval(5000);
    },
    methods: {
      getList() {
        api.getAIAccompany().then(r => {
          if (r.status) {
            let list = r.data;
            let newTotal = r.data.length - this.oldTotal;
            let now = [];
            if (newTotal <= 0 || r.data.length <= 0) {
              now = []
            } else {
              now = list.slice(0, newTotal + 1)
            }
            console.log('new', now)
            now.reverse().map(itrm => {
              this.list.unshift(itrm)
              var div = this.$refs['elscrollbar'].$refs['wrap'];
              this.$nextTick(() => {
                div.scrollTop = 0;
                this.id = itrm.faceUrl;
              })
            })
            this.oldTotal = r.data.length;
          }
        })
      },
      setInterval(timer) {
        setInterval(() => {
          this.getList();
        }, timer)
      },
      time(timestamp) {
        let date = new Date(timestamp);
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        let meal = ""
        if (h >= 0 && h < 9) {
          meal = '早'
        }
        if (h > 9 && h < 15) {
          meal = '午'
        }
        if (h > 15 && h < 24) {
          meal = '晚'
        }
        return meal + '餐 ' + Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
      },
      playFlow(playerAddr) {
        var videoObj = {
          "id": 'video',
          "source": playerAddr,
          "width": "100%",
          "height": "100%",
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
        this.player = new Aliplayer(videoObj, function (player) {
          // console.log("播放器创建了。");
        })
      },
    },
    //离开页面时销毁播放器，停止流直播
    beforeDestroy: function () {
      this.player.dispose();

    },
    watch: {
      'list.length': {
        handler(newValue, oldValue) {
          if (newValue !== oldValue) {
            console.log('新进图片')
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
      background:  url('~assets/img/AICamera/aiCameraMaxTitle.png') center no-repeat;
      background-size: 100% 100%;
      text-align: center;
      font-size: 48px;
      font-family: zcool-gdh;
      font-weight: 400;
      color: rgba(39, 197, 217, 1);
    }
  }

  .centerBox {
    padding: 50px 20px;
    height: calc(100% - 214px);
    width: calc(100% - 40px);

    .leftBox {
      width: 1400px;
      margin-right: 20px;
      height: 100%;

      .camera {
        width: calc(100% - 20px);
        height: calc(100% - 90px);
        padding: 10px;
        background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));
        border: 1px solid rgba(40, 131, 146, 0.6);

        >div {
          width: 100%;
          height: 100%;
          background: transparent;
          >* {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .rightBox {
      width: calc(100% - 1420px);
      height: 100%;

      .SideBar {
        width: 100%;
        height: calc(100% - 70px);
        overflow-y: auto;

        li {
          height: 387px;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
          background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));
          border: 1px solid rgba(40, 131, 146, 0.6);
          padding: 10px;

          .photo {
            width: 100%;
            height: 327px;
            margin: 0 auto;
            background: #fff;
            color: red;
          }

          .row {
            width: 100%;
            height: 50px;
            line-height: 50px;
            margin: 0 auto;
            color: #fff;
            font-size: 16px;
            font-family: Alibaba PuHuiTi;
            font-weight: 400;

            .time {
              width: 220px;
              text-align: right;
            }

            .detail {
              width: calc(100% - 220px);
              text-align: left;
            }
          }
        }

        li:last-child {
          margin-bottom: 0px;
        }
      }

    }
  }

  .minTitle {
    margin-bottom: 30px;
    width: 370px;
    height: 51px;
    padding-left: 30px;
    color: #fff;
    line-height: 50px;
    background: url('~assets/img/AICamera/aiCameraMinTitle.png') center no-repeat;
    background-size: 100% 100%;
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