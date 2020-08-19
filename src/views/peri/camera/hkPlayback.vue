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
              v-model="startTime"
              class="w120"
              type="datetime"
              placeholder="开始时间" 
              value-format="yyyyMMddHHmmss"
              @change="player">
            </el-date-picker>
            至
            <el-date-picker
              v-model="endTime"
              class="w120"
              type="datetime"
              placeholder="截至时间"
              value-format="yyyyMMddHHmmss"
              @change="player" >
            </el-date-picker>
          </div>
        <div class="posDiv mt20" id="myPlayer"></div>
      </div>
    </div>
  </div>
</template>
<script>
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
      }
    },
    data() {
      return {
        isShow: true,
        startTime: null,
        endTime: null,
        play: null
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
      player () {
        if (this.endTime && this.startTime && (this.endTime <= this.startTime)) {
          this.$message.warning("截至时间不能小于起始时间")
          return
        }
        if (this.play) {
          this.play.stop()
        }
        let url
        if (this.startTime && this.endTime) {
          url = this.url + '?begin=' + this.startTime + '&end=' + this.endTime
        } else if (this.startTime) {
          url = this.url + '?begin=' + this.startTime
        } else if (this.endTime) {
          url = this.url + '?end=' + this.endTime
        } else {
          url = this.url
        }
        console.log(url)
        //获取当前网址，
        let curPath = window.document.location.href
        //获取主机地址之后的目录，
        let pathName = window.document.location.pathname
        let pos = curPath.indexOf(pathName)
        //获取主机地址
        let localhostPaht = curPath.substring(0, pos) + '/static/hkCamera'
        console.log(localhostPaht)
        this.play = new EZUIPlayer({
          id: 'myPlayer',
          url: url,
          autoplay: true,
          accessToken: this.token,
          decoderPath: localhostPaht,
          width: 982,
          height: 500
        });
        this.play.play();
      }
    },
    mounted() {
      this.player()
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
    margin: 0 20px;
  }
</style>