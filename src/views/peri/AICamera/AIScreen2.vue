<!--源本AI智能后厨第2版 王涛旁边那个电脑-->
<template>
  <div class="AISCreen">
    <div class="title">源本AI智能后厨</div>
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
          分析结果
        </div>
        <ul class="tagList clear_a">
          <li v-for='(val,key,i) in NoType'
            :class="{ 'hat': key=='hat', 'mask': key=='mask','gloves': key=='gloves', 'phone': key=='phone','mouse': key=='mouse', 'smoking': key=='smoking'}">
            {{val}}</li>
        </ul>
        <div class="SideBar">
          <el-scrollbar style="height:100%" ref="elscrollbar">
            <ul>
              <li v-for="(item,index) in list" class="card" :class="{'zoomIn':id==item.dataUrl}">
                <div class="photo">
                  <img :src="item.dataUrl" alt="">
                  <div class='screenshot'
                    :style="{ width: item2.width*w+'px',height: item2.height*h+'px',top: item2.top*h+'px',left: item2.left*w+'px' }"
                    v-for='item2 in item.objectsa'></div>
                </div>
                <div class="row clear_a">
                  <ul class="detail clear_a">
                    <li v-for='val in item.typeArrStr'
            :class="{ 'hat': val=='hat', 'mask': val=='mask','gloves': val=='gloves', 'phone': val=='phone','mouse': val=='mouse', 'smoking': val=='smoking'}">
            {{NoType[val]}}</li>
                  </ul>
                  <div class="time textell">{{item.timestamp}}</div>
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
        cameraW: 1920,
        cameraH: 1080,
        // w: 438 / 1920,
        // h: 327 /1080,
        NoType: {
          'hat': '无帽子',
          'mask': '无口罩',
          'gloves': '无手套',
          'phone': '玩手机',
          'mouse': '有老鼠',
          'smoking': '抽烟'
        },
        url:'http://aivideoplay.ybveg.com/live/aivideoplay.m3u8?auth_key=1572755326-0-0-ca66efa6e2af324f754eaba37c83ff47'
          ,
      };
    },
    computed: {
      w() {
        return 438 / this.cameraW
      },
      h() {
        return 327 / this.cameraH
      }
    },
    async mounted() {
      this.playFlow(this.url)
      this.getList();
      this.setInterval(5000);
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
      filterStr(arr) {
        // let str = ''
        let newArr = this.unique(arr);
        // for (let a in newArr) {
        //   for (let j in this.NoType) {
        //     if (newArr[a] == j) {
        //       str = str + this.NoType[j] + ' '
        //     }
        //   }
        // }
        // return str;
        return newArr;
      },
      filterData(data) {
        if (data.length <= 0) {
          return [];
        }
        for (let i = 0; i < data.length;) {
          if (
            Object.prototype.toString
            .call(data[i])
            .slice(8, -1)
            .toLowerCase() === "function"
          ) {
            continue;
          }
          data[i].typeArr = [];
          if (data[i].format.width && data[i].format.height) {
            this.cameraW = data[i].format.width * 1;
            this.cameraH = data[i].format.height * 1;
          }
          let objectsa = data[i].objectsa;
          for (let j = 0; j < objectsa.length;) {
            if (
              Object.prototype.toString
              .call(objectsa[j])
              .slice(8, -1)
              .toLowerCase() === "function"
            ) {
              continue;
            }
            let properties = objectsa[j].properties
            for (let h = 0; h < properties.length;) {
              if (
                Object.prototype.toString
                .call(properties[h])
                .slice(8, -1)
                .toLowerCase() === "function"
              ) {
                continue;
              }
              console.log('所有类型', properties[h].type)
              console.log('properties', properties[h].result)
              if (properties[h].result == false) {
                data[i].typeArr.push(properties[h].type)
                h++
              } else {
                properties.splice(h, 1);
              }
            }
            if (objectsa[j].properties.length <= 0) {
              objectsa.splice(j, 1);
            } else {
              j++
            }
            console.log("objectsa", objectsa, "typeArr", data[i].typeArr)
          }
          if (data[i].objectsa.length <= 0) {
            data.splice(i, 1);
          } else {
            data[i].typeArrStr = this.filterStr(data[i].typeArr)
            i++;
          }
        }
        return data
      },
      getList() {
        api.getAIAccompany3({
          // batchSize: 100
        }).then(r => {
          let data = this.filterData(r)
          data.map(itrm => {
            this.list.unshift(itrm)
            var div = this.$refs['elscrollbar'].$refs['wrap'];
            this.$nextTick(() => {
              div.scrollTop = 0;
              this.id = itrm.dataUrl;
            })
          })
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
        if (h > 0 && h < 9) {
          meal = '早'
        }
        if (h > 9 && h < 15) {
          meal = '中'
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
            // console.log('新进图片')
          }
        }
      }
    },
  };
</script>
<style>
  #video>* {
    background: linear-gradient(90deg, rgba(14, 73, 92, 0.4), rgba(4, 92, 87, 0.4));
  }
</style>
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
    height: calc(100% - 154px);
    width: calc(100% - 40px);

    .leftBox {
      width: 1400px;
      margin-right: 20px;
      height: 100%;

      .camera {
        width: calc(100% - 20px);
        height: calc(100% - 150px);
        padding: 38px 10px;
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

      .tagList {
        height: 60px;

        >li {
          width:66px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          font-family: Alibaba PuHuiTi;
          font-weight: 400;
          margin-bottom: 19px;
          margin-right: calc((100% - 6 * 66px) / 5);
        }
        >li:last-child{
          margin-right: 0;
        }
      }

      .SideBar {
        width: 100%;
        height: calc(100% - 130px);
        overflow-y: auto;

          .card{
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
              // text-align: left;
               li {
                width:66px;
                height: 34px;
                border-radius: 4px;
                line-height:34px;
                text-align: center;
                font-size: 16px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                margin:8px 5px 8px 0;
              }
              li:last-child{
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