<template>
  <div>
    <div class="popup-body" v-if="isShow">
      <div class="popup-div">
        <p class="titP">
          <span>视频回放</span>
          <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="close()"></i>
        </p>
        <div class="page-tilt floatL" style="width: 59%;">
            <b></b><span class="spaceNowrap" style="max-width: 320px;">{{entityName}}</span>
                   <span class="spaceNowrap" style="max-width: 160px">{{cameraName}}</span>
        </div>
        <div class="floatR" style="width: 40%;margin-top: 55px;">
            回放时间范围:
            <el-date-picker
              v-model="queryLimit.beginTime"
              class="w120"
              type="datetime"
              placeholder="开始时间" 
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable=false
              :picker-options="beforeDate"
              @change="player">
            </el-date-picker>
            至
            <el-date-picker
              v-model="queryLimit.endTime"
              class="w120"
              type="datetime"
              placeholder="截至时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="afterDate"
              :clearable=false
              @change="player" >
            </el-date-picker>
          </div>
        <div class="prism-player posDiv"  ref='height' id="myPlayer">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '../../../api/peri/camera'
  export default {
    props: {
      token: {
        type: String
      },
      url: {
        type: String
      },
      channel: {
        type: Number
      },
      entityName: {
        type: String
      },
      cameraName: {
        type: String
      },
      id:{
        type:String
      },
    },
    data() {
      return {
        isShow: true,
        play: null,
        queryLimit:{
          beginTime:null,
          endTime:null,
          id:''
        },
        myPlayer:null,
        afterDate: {
          disabledDate: (time) => {
              return time.getTime() > Date.now();
          }
        },
        beforeDate: {
          disabledDate: (time) => {
              return time.getTime() > Date.now();
          }
        },
      }
    },
    methods: {
      close () {
        if (this.play) {
          this.play.stop()
        }
        this.isShow = false
        this.$emit("close")
      }, 
      async player () {
        if (this.queryLimit.endTime && this.queryLimit.beginTime && (new Date(this.queryLimit.endTime) <= new Date(this.queryLimit.beginTime))) {
          this.$message.warning("截至时间不能小于起始时间")
          return
        }
        if (this.play) {
          this.play.stop()
        }
        if(this.queryLimit.endTime === null || this.queryLimit.beginTime === null){
            return
        }
        let url
        let result = await api.getDHCamera(this.queryLimit)
        url = result.data.recordUrl
       
        //获取当前网址，
        let curPath = window.document.location.href
        //获取主机地址之后的目录，
        let pathName = window.document.location.pathname
        let pos = curPath.indexOf(pathName)
        //获取主机地址
        let localhostPaht = curPath.substring(0, pos) + '/static/hkCamera'
        // console.log(localhostPaht)
        // this.play = new EZUIPlayer({
        //   id: 'myPlayer',
        //   url: url,
        //   autoplay: true,
        //   accessToken: this.token,
        //   decoderPath: localhostPaht,
        //   width: 982,
        //   height: 500
        // });
        const autostart = true;
        this.playFlow(autostart, url)
        // this.play.play();
      },
      playFlow(autostart, playerAddr) {
        var videoObj = {
          "id": "myPlayer",
          "source": playerAddr,
          "width": "95%",
          "height": "500px",
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
                // {
                //   "name": "snapshot",
                //   "align": "tr",
                //   "x": 5,
                //   "y": 12
                // },
              ]
            }
          ]
        }
        var player = new Aliplayer(videoObj, function (player) {
          console.log("播放器创建了。");
        })
        this.myPlayer = player;
      },
    },
    mounted() {
      this.queryLimit.id = this.id
    //   this.player()
    },
    beforeDestroy: function () {
      var myplayer = this.myPlayer;
      myplayer.dispose();
    },
    components:{
      
    }
  }
</script>

<style scoped lang="sass">
  .popup-body{
    position: absolute;
    background: rgba(0,0,0,.5);
    top: 0px;
		bottom:0;
		left:0;
		right:0;
    z-index: 3000;
	}
	.popup-div{
    border: 1px solid #ccc;
    position: fixed;
    background: #fff;
    width: 1024px;
    box-sizing: border-box;
    left: 50%;
    margin-left: -512px;
    height: 622px;
    top: 50%;
    margin-top: -311px;
	}
  .titP{
    position: absolute;
    top: 0;
    height:40px;
    line-height: 40px;
    background:rgba(242,245,248,1);
    width: 100%;
    left: 0;
    span{
      font-size:14px;
      color: #393939;
      margin-left: 20px;
    }
    i{
      float: right;
      margin-right: 7px;
      font-size: 20px;
      color: #9A9A9A;
      margin-top: 10px;
    }
  }
  .page-tilt{
    margin-top: 40px;
    padding: 20px;
    box-sizing: border-box;
    span{
      display: inlin-block;
    }
  }
  .posDiv{
    height: 500px;
    // background: #ccc;
    margin: 100px 20px 0 20px;
  }
</style>