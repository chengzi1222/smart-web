<template>
  <div class="box">
    <h3>阳光厨房监控中心</h3>
    <div class="videosBox" ref="videosBox">
        <img class="rotateImg arrowBox movePoin" style="top:0;" src="~assets/img/subjectData/screenicondown.png" @click="minus" v-if="tops == 1" />
        <img class="rotateImg arrowBox" style="top:0;" src="~assets/img/subjectData/screenicondown.png" v-else />
        <img class="arrowBox movePoin" style="bottom:0;" src="~assets/img/subjectData/screenicondown.png" @click="augment" v-if="tops == 0" />
        <img class="arrowBox" style="bottom:0;" src="~assets/img/subjectData/screenicondown.png" v-else/>
        <div class="overBox">
          <div class="bigVideosDivBox" :class="tops == 1? 'top50':''">
            <div class="videosDiv" v-for="(item,index) in datas" :key="index">
              <div v-for="(itemDiv,indexDiv) in item" :key="indexDiv" :class="index == indexs && indexDiv == indexDivs ? 'magnify':''">
                <div :id="'video' + index + indexDiv" style="z-index:9;" :class="index == indexs && indexDiv == indexDivs ? 'magnify':''"></div>
                <div class="zhezhao" @click="magnifyFun(index, indexDiv)" :class="index == indexs && indexDiv == indexDivs ? 'magnify':''"></div>
                <p class="nameBox">
                  <span>{{itemDiv.name}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { getReportAllCameraAddr } from 'api/bigData/subjectData'
  export default {
    components: {

    },
    data() {
      return {
        indexs: null,
        indexDivs: null,
        datas: [],
        widths: 0,
        tops: 0,
        player:null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.widths = this.$refs.videosBox.offsetWidth - 120;
      })
      this.getReportAllCameraAddr()
    },
    beforeDestroy() {
       this.player.dispose(); //离开页面时销毁播放器，停止流直播
    },
    methods: {
//      playFlow(id, url) {
//        const $script = document.createElement('script');
//        document.getElementById(id).appendChild($script);
//        var videoObject = {
//          "container": '#' + id,
//          "variable": id,
//          "autoplay": true,
//          "live": true,
//          "html5m3u8": true,
//          "video": url
//        };
//        var player = new ckplayer(videoObject);
//        $script.src = player;
//      },
      playFlow(id,url){
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
          "skinLayout": [
            {
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
            }
          ]
        }
        this.player = new Aliplayer(videoObj, function (player) {
          console.log("播放器创建了。");
        })
      },
      minus() {
        this.tops--;
      },
      augment() {
        this.tops++;
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
        getReportAllCameraAddr({ pageSize: 4 }).then(r => {
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
    }
  }
</script>
<style lang='scss' scoped>
  .box{
    background: url('~assets/img/subjectData/screen2bg.png');
    height: 100%;
    h3{
      font-weight: normal;
      color: #eee;
      font-size: 20px;
      padding-top: 10px;
      margin-left: calc(17%);
    }
    .videosBox{
      height: calc(100% - 90px);
      margin-top: 30px;
      position: relative;
      overflow: hidden;
      .arrowBox{
        width: 100%;
        height: 30px;
        position: absolute;
        z-index: 99;
      }
      .rotateImg{
        transform: rotate(180deg);
      }
      .bigVideosDivBox{
        margin-top: 0px;
        transition: all 1s;
        height: 200%;
      }
      .top50{
        margin-top: calc(-50% - 4px)
      }
      .overBox{
        margin-top: 55px;
        height: calc(100% - 90px);
        overflow: hidden;
      }
      .videosDiv{
        height: 50%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        position: relative;
        div{
          width: 192px;
          height: 108px;
          transition: all 0.5s;
          position: relative;
        }
        .magnify{
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 100;
          margin-left: 0;
        }
        .zhezhao{
          position: absolute;
          width: 192px;
          height: 108px;
          top: 0;
          left: 0;
          z-index: 199;
        }
        .nameBox{
          height:14px;
          line-height:14px;
          width: 100%;
          color: #eee;
          font-size: 12px;
          margin-top: 8px;
        }
      }
    }
  }
</style>
