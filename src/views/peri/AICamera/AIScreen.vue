<!--源本AI智能后厨改版2xxc-->
<template>
  <div class="AISCreen">
    <div class="title">{{title}}</div>
    <div class="clear_a centerBox">
      <div class="leftBox ">
        <div class="urlSidebar clear_a">
          <div class="left" @click.stop="switch_('L')" :disabled='!(index>0)'></div>
          <div class="min">
            {{entityName}}-{{AiHotList[index]?AiHotList[index].channelName:''}}({{index*1+1}}/{{AiHotList.length}})
          </div>
          <div class="right" @click.stop="switch_('R')" :disabled='!(index<AiHotList.length-1)'></div>
        </div>
        <div class="camera relative">
          <div id='video'>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="minTitle" v-if='AiHotList[index].status=="1"'>
          分析结果
        </div>
        <div class="aiClose" v-if='AiHotList[index].status!="1"'>
          历史分析记录（AI分析已关闭...）
        </div>
        <ul class="tagList clear_a">
          <li v-for='(val,key,i) in NoType'
            :class="{ 'hat': key=='无帽子', 'mask': key=='无口罩','gloves': key=='无手套', 'phone': key=='玩手机','mouse': key=='有老鼠', 'smoking': key=='抽烟', 'stranger': key=='陌生人'}">
            {{val}}</li>
        </ul>
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
                <div class="row">
                  <ul class="detail clear_a">
                    <li v-for='val in item.picName' :key="val"
                      :class="{ 'hat': val=='无帽子', 'mask': val=='无口罩','gloves': val=='无手套', 'phone': val=='玩手机','mouse': val=='有老鼠', 'smoking': val=='抽烟', 'stranger': val=='陌生人'}">
                      {{NoType[val]}}</li>
                  </ul>
                  <div class="time textell">{{item.warningTime}}</div>
                </div>
              </li>
              <p class="nullData" v-if="list.length<=0"> 暂无分析记录</p>
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
        cameraId: '',
        entityId: '',
        entityName: '',
        AiHotList: [
          {
           status:1 
          }
        ],
        setInterval_: null,
        createTime: null,
        willDestroy: false,
        cameraW: 1920,
        cameraH: 1080,
        // w: 438 / 1920,
        // h: 327 /1080,
        NoType: {
          '无帽子': '无帽子',
          '无口罩': '无口罩',
          '无手套': '无手套',
          '玩手机': '玩手机',
          '有老鼠': '有老鼠',
          '抽烟': '抽烟',
          // 'stranger': '陌生人',
          '陌生人': '陌生人'
        },
        AIscreenshotUrl:'http://aicamera-pic-res.ybveg.com/',
        cameraType: 'HK',
        title:'源本AI智能后厨',
        url: "http://hls01open.ys7.com/openlive/974045fb9db244e89649e13e6c0caf1d.hd.m3u8" //办公室顶部
        // 'http://hls01open.ys7.com/openlive/567585e8abb04798a102c39b865bf8a4.hd.m3u8'
        // 'http://cameralive.ybveg.com/cameraplay/34020000001310000002.m3u8?auth_key=1571824902-0-0-9acab4466a088685f93e20d285350d56'
        // "http://hls01open.ys7.com/openlive/66e32042ccf24ea298d3f92b4c2c811d.hd.m3u8"
        // "http://cameralive.ybveg.com/cameraplay/34020000001310000002.m3u8?auth_key=1572691645-0-0-b004d80c25e9e2dc599e6312823aaabe",
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
        return 908 / this.cameraW
      },
      h() {
        return 640 / this.cameraH
      },
      pathFile() {
        return this.$store.getters.filePath;
      }
    },
    async mounted() {
      this.entityId = this.$route.query.entityId;
      this.index = this.$route.query.index;
      this.entityName = this.$route.query.name;
      await this.getUrl();
      this.playFlow(this.url)
      this.getList();
      // this.setInterval(15000);
    },
    methods: {
      unique(arr) {
        let hashTable = {};
        let data = [];
        for (let i = 0, l = arr.length; i < l; i++) {
          if (
            Object.prototype.toString
            .call(arr[i])
            .slice(8, -1)
            .toLowerCase() === "function"
          ) {
            continue;
          }
          if (!hashTable[arr[i]]) {
            hashTable[arr[i]] = true;
            data.push(arr[i]);
          }
        }
        return data
      },
      switch_(to) {
        let flag = false;
        if (to == 'L' && this.index > 0) {
          this.index = this.index * 1 - 1;
          flag = true
        }
        if (to == 'R' && this.index < this.AiHotList.length - 1) {
          this.index = this.index * 1 + 1;
          flag = true
        }
        if (!flag) {
          return
        }
        this.url = this.AiHotList[this.index].playerAddr;
        this.createTime = null;
        this.cameraId = this.AiHotList[this.index].id;
        this.player.dispose();
        this.playFlow(this.url)
        clearInterval(this.setInterval_);
        this.list = [];
        this.createTime = null;
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
        })
      },
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
            data[i].picName = this.unique(data[i].picName.split(","));
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
        api.getAiCaremaScreenshot(this.cameraId, this.createTime).then(r => {
          if (!r.status || !r.data) {
            this.$message.error('ai识别截图失败！')
            return
          }
          let data = this.filterData(r.data)
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
    watch: {},
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
      width: calc((100% - 20px) / 2);
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
    }

    .rightBox {
      width: calc((100% - 20px) / 2);
      height: 100%;
      overflow: hidden;

      .tagList {
        height: 60px;

        >li {
          width: 90px;
          height: 50px;
          border-radius: 4px;
          line-height: 50px;
          text-align: center;
          font-size: 22px;
          font-family: Alibaba PuHuiTi;
          font-weight: 400;
          margin-bottom: 20px;
          margin-right: 20px;
        }

        >li:last-child {
          margin-right: 0;
        }
      }

      .SideBar {
        width: 100%;
        height: calc(100% - 70px);
        overflow-y: auto;

        .card {
          height: 808px;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 20px;
          background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));
          border: 1px solid rgba(40, 131, 146, 0.6);
          padding: 10px;

          .photo {
            width: 100%;
            height: 640px;
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
            height: 170px;
            line-height: 50px;
            margin: 0 auto;
            color: #fff;
            font-size: 26px;
            font-family: Alibaba PuHuiTi;
            font-weight: 400;

            .time {
              width: 100%;
              line-height: 66px;
            }

            .detail {
              width: 100%;

              li {
                width: 110px;
                height: 50px;
                border-radius: 4px;
                line-height: 50px;
                text-align: center;
                font-size: 26px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                margin: 40px 20px 0px 0;
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
    line-height: 51px;
    background: url('~assets/img/AICamera/aiCameraMinTitle.png') center no-repeat;
    background-size: 100% 100%;
  }

  .urlSidebar {
    margin-bottom: 20px;
    width: 100%;
    height: 51px;
    color: #fff;
    line-height: 50px;

    .left,
    .right {
      width: 60px;
      height: 51px;
      background: url('~assets/img/AICamera/aiCameraRightMin.png') center no-repeat;
      background-size: 100% 100%;
    }

    .left {
      background: url('~assets/img/AICamera/aiCameraleftMin.png') center no-repeat;
      background-size: 100% 100%;
    }

    .min {
      width: calc(100% - 140px);
      background: rgba(20, 50, 60, 0.6);
      margin: 0 10px;
      text-align: center;
      font-size: 24px;
      line-height: 51px;
    }
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
  .nullData{
    width: 100%;
    font-size: 22px;
    color: #fff;
    text-align: center;
    margin-top: 300px;
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>