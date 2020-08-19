<template>
  <div style="height:100%">
    <div class="bigBox">
      <div class="videosBox" ref="videosBox">
        <img class="arrowBox movePoin" src="../../../../../../assets/img/subjectData/arrow.png" @click="minus"
          v-if="lefts > 0">
        <img class="rotateImg arrowBox movePoin" src="../../../../../../assets/img/subjectData/arrow.png"
          @click="augment" v-if="lefts < datas.length - 1">
        <div class="bigVideosDivBox"
          :style="{'width': 100 * datas.length + '%','height': '100%','margin-left': lefts * -widths + 'px'}">
          <div class="videosDiv" :style="{'width': widths + 'px'}" v-for="(item,index) in datas" :key="index">
            <div v-for="(itemDiv,indexDiv) in item" :key="indexDiv" style="position:relative;"
              :class="index == indexs && indexDiv == indexDivs ? 'magnify':''">
              <div :id="'video' + index + indexDiv" style="height:100%;width:100%;margin-left: 0"
                :class="index == indexs && indexDiv == indexDivs ? 'magnify':''"></div>
              <p @click="magnifyFun(index, indexDiv)" class="nameBox">
                <span>{{itemDiv.entityName}}</span>
                <span class="floatR">{{itemDiv.name}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getReportAllCameraAddr
  } from 'api/bigData/subjectData'
  export default {
    data() {
      return {
        indexs: null,
        indexDivs: null,
        datas: [],
        widths: 0,
        player: null,
        lefts: 0
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.widths = this.$refs.videosBox.offsetWidth;
      })
      this.getReportAllCameraAddr()
    },
    beforeDestroy() {
      this.player.dispose(); //离开页面时销毁播放器，停止流直播
    },
    methods: {
      playFlow(id, url) {
        var videoObj = {
          "id": id,
          "source": url,
          "width": "100%",
          "height": "86%",
          "autoplay": true,
          "isLive": true,
          "rePlay": false,
          "playsinline": true,
          "preload": true,
          "language": "zh-cn",
          "controlBarVisibility": "hover",
          "useH5Prism": true,
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
                {
                  "name": "snapshot",
                  "align": "tr",
                  "x": 5,
                  "y": 12
                },
              ]
            }
          ]
        }
        this.player = new Aliplayer(videoObj, function (player) {
          console.log("播放器创建了。");
        })
      },
      minus() {
        this.lefts--;
      },
      augment() {
        this.lefts++;
      },
      magnifyFun(index, indexDiv) {
        if (this.indexs != index && this.indexDivs != indexDiv) {
          this.indexs = index;
          this.indexDivs = indexDiv;
        } else {
          this.indexs = null;
          this.indexDivs = null;
        }
      },
      getReportAllCameraAddr() {
        getReportAllCameraAddr({
          pageSize: 9
        }).then(r => {
          if (!r.status) {
            return
          }
          if (r.data.length >= 2) {
            this.datas.push(r.data[0]);
            this.datas.push(r.data[1]);
          } else if (r.data.length == 1) {
            this.datas.push(r.data[0]);
          }
          setTimeout(() => {
            for (let i = 0; i < this.datas.length; i++) {
              for (let j = 0; j < this.datas[i].length; j++) {
                this.playFlow('video' + i + j, this.datas[i][j].playerAddr)
              }
            }
          }, 100);
        })
      }
    },
  }
</script>

<style scoped lang="sass">
  .bigBox {
    background: rgba(24, 34, 52, .2);
    border: 1px solid rgba(53, 122, 162, .2);
    height: 100%;
    box-sizing: border-box;
  }

  .videosBox {
    height: 100%;
    position: relative;
    overflow: hidden;

    .arrowBox {
      height: 60px;
      width: 40px;
      position: absolute;
      top: 50%;
      margin-top: -30px;
      z-index: 99;
    }

    .rotateImg {
      transform: rotate(180deg);
      right: 60px;
    }

    .bigVideosDivBox {
      margin-left: 0px;
      display: flex;
      transition: all 1s;
    }

    .videosDiv {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      position: relative;

      div {
        width: 33.33%;
        height: 33.33%;
        background: #eee;
        transition: all 0.5s;
      }

      .magnify {
        position: absolute !important;
        width: 100%;
        height: 100%;
        z-index: 100;
        margin-left: 0;

        .nameBox {
          z-index: 101;
        }
      }

      .nameBox {
        position: absolute;
        height: 50px;
        line-height: 50px;
        width: 100%;
        background: rgba(0, 0, 0, .5);
        bottom: 0;
        left: 0;
        color: #eee;
        z-index: 99;
        font-size: 20px;

        span {
          margin-left: 30px;
        }

        .floatR {
          margin-right: 30px;
        }
      }
    }
  }
</style>