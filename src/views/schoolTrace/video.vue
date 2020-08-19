<template>
  <div class="rightBox" v-loading="loading" element-loading-text="拼命加载中">
    <div class="titie clear_a">
      <div class="titie_left">后厨直播</div>
    </div>
    <div class="innerBox">
      <el-scrollbar class="scrollbar">
        <el-row>
          <el-col :span="8" style="margin-bottom: 10px" v-for="(item,index) in videoData" :key="index">
            <div class="prism-player" style="width:99%;position:relative;margin-right: 10px" ref='height' :id="item.videoId">
              <div class="tag">
                {{item.name}}
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="imgNull" v-if="videoData.length <= 0">
          <img src="../../assets/img/schoolTrace/imgNull.png">
          <p>该学校暂无直播</p>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
  import "static/dhplayer/css/newStyle.css"
  import "static/dhplayer/css/plugin.css"
  import "static/dhplayer/js/jquery-1.11.3.min.js"
  import * as api from "../../api/schoolTrace/home";
  import {setCookie,setData} from "../../utils/sessionStorage";

  export default {
    name: "trace",
    data() {
      return {
        pageData: {},
        player: [],        //播放对象
        loading: false,
        guid: '',
        videoData: []
      };
    },
    methods: {
      playFlow(autostart, playerAddr, id) {
        var videoObj = {
          "id": id,
          "source": playerAddr,
          "width": "480px",
          "height": "270px",
          "autoplay": autostart,
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
            },
            {
              "name": "controlBar",
              "align": "blabs",
              "x": 0,
              "y": 0,
              "children": [
                {"name": "playButton", "align": "tl", "x": 15, "y": 12},
                {"name": "fullScreenButton", "align": "tr", "x": 10, "y": 12},
                {"name": "volume", "align": "tr", "x": 5, "y": 10},
              ]
            }
          ]
        }
        var player = new Aliplayer(videoObj, function (player) {
          // console.log("播放器创建了。");
        })
        this.player.push(player);
      },
      async getPageData() {
        this.loading = true;
        let result = await api.getVideoList({
          entityId: this.guid
        })
        this.videoData = result.data
        for(let i in this.videoData){
            this.videoData[i].videoId = 'player' + i
        }
        //是否自动播放
        this.loading = false;
      },
      async getVideoUrl(name, id) {
        let urlData = await api.getUrl({
          entityId: this.guid,
          id: id,
          name: name
        })
        return urlData.data
      },
    },
    async mounted() {
      if (this.$route.query.entityId) {
        this.guid = this.$route.query.entityId
      }
      await this.getPageData();
      if (this.videoData.length > 0) {
        const autostart = true;
        this.videoData.map(async (item) => {
          let data = await this.getVideoUrl(item.name, item.id)
          this.playFlow(autostart, data.url, item.videoId)
        })
      }
    },
    //离开页面时销毁播放器，停止流直播
    beforeDestroy: function () {
      this.player.map(item => {
        item.dispose();
      })

    }

  }
</script>

<style scoped lang='scss'>
  .rightBox {
    width: calc(100% - 60px);
    padding: 0 30px;
    height: 100%;
    .titie {
      height: 80px;
      line-height: 80px;
      .titie_left {
        font-size: 20px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        width: 50%;
        height: 100%;
      }
      .titie_right {
        width: 50%;
        height: 100%;
        text-align: right;
      }
    }
    .innerBox {
      width: calc(100% - 45px);
      padding: 30px 20px;
      height: calc(888px - 100px);
      background: #fff;
      border-radius: 10px;
      .scrollbar {
        height: 100%;
        width: 100%;
        .prism-player {
          .tag {
            position: absolute;
            bottom: 13px;
            left: 20px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 400;
            z-index: 99;
          }
        }
        .imgNull {
          width: 100%;
          height: 100%;
          text-align: center;
          margin-top: 200px;
          img {
            width: 500px;
            height: 300px;
          }
          p {
            font-size: 18px;
            color: #999999;
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>


