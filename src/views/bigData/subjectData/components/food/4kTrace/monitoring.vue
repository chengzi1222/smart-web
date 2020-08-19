<template>
  <div class="box">
    <h3>阳光厨房监控中心</h3>
    <div class="videosBox" ref="videosBox">
        <img class="rotateImg arrowBox movePoin" style="top:0;" src="~assets/img/subjectData/4kTrace/screenDown.png" @click="minus" v-if="tops == 1" />
        <img class="rotateImg arrowBox" style="top:0;" src="~assets/img/subjectData/4kTrace/screenDown.png" v-else />
        <img class="arrowBox movePoin" style="bottom:0;" src="~assets/img/subjectData/4kTrace/screenDown.png" @click="augment" v-if="tops == 0" />
        <img class="arrowBox" style="bottom:0;" src="~assets/img/subjectData/4kTrace/screenDown.png" v-else/>
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
        this.widths = this.$refs.videosBox.offsetWidth - 240;
      })
      this.getReportAllCameraAddr()
    },
     beforeDestroy() {
            this.player.dispose(); //离开页面时销毁播放器，停止流直播
        },
    methods: {
      playFlow(id, playerAddr) {
        var videoObj = {
          "id": id,
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
          // "extraInfo": {
          //   "crossOrigin": "anonymous"
          // },
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
              "name": "thumbnail"
            },
            {
              "name": "controlBar",
              "align": "blabs",
              "x": 0,
              "y": 0,
              "children": [
                { "name": "playButton", "align": "tl", "x": 15, "y": 12 },
                { "name": "fullScreenButton", "align": "tr", "x": 10, "y": 12 },
                { "name": "volume", "align": "tr", "x": 5, "y": 10 },
                { "name": "snapshot", "align": "tr", "x": 5, "y": 12 },
              ]
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
    background: url('~assets/img/subjectData/4kTrace/allLiB.png');
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;
    h3{
      font-weight: normal;
      color: #eee;
      font-size: 40px;
      padding-top: 20px;
      margin-left: calc(17%);
    }
    .videosBox{
      height: calc(100% - 180px);
      margin-top: 60px;
      position: relative;
      overflow: hidden;
      .arrowBox{
        width: 100%;
        height: 60px;
        position: absolute;
        z-index: 99;
      }
      .rotateImg{
        transform: rotate(180deg);
      }
      .bigVideosDivBox{
        margin-top: 0px;
        transition: all .3s;
        height: 200%;
      }
      .top50{
        margin-top: calc(-50% - 130px)
      }
      .overBox{
        margin-top: 110px;
        height: calc(100% - 180px);
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
          width: 400px;
          height: 225px;
          transition: all 0.3s;
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
          width: 284px;
          height: 216px;
          top: 0;
          left: 0;
          z-index: 199;
        }
        .nameBox{
          height:28px;
          line-height:28px;
          width: 100%;
          color: #eee;
          font-size: 24px;
          margin-top: 16px;
        }
      }
    }
  }
</style>