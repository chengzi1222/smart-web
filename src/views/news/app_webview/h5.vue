<template>
  <div>
    <div  v-loading="isloading"  v-if='isloading'
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
     id="loading"></div>
    <div class="errorImg" v-if='isError'>
      <div>
        <img :src="icon">
        <p>页面出错了~</p>
        <p class="sm">对不起，页面加载失败！</p>
        <button @click="loadDetail()">重新加载</button>
      </div>
    </div>

    <div class="body" v-if='!isError'>
      <!-- 图文新闻进来isShow为false，视频新闻进来为true -->
      <video v-if="isShow" :src="dto.video_url" preload='metadata'  controlsList="nodownload" type="video/mp4" controls="controls" width="100%" height="211px" >
        您的浏览器不支持 video 标签。
      </video>
      <p class="title">
        {{dto.title}}
      </p>
      <p class="author">
        <span class="area">{{dto.pub_level_name}}</span>
        <span class="dep">{{dto.pub_dept_name}}</span><br/>
        <span class="date">{{dto.pub_time}}</span>
      </p>
      <div id="contentNews" v-html="dto.content">
      </div>
    </div>
  </div>
</template>

<script>

  import * as newsApi from 'api/news/news';

  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    methods: {
      getUrlParam(name){
        if(!name && !this.search) {
          return "";
        }
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = this.search.substr(1).match(reg);
        if(r!=null)return decodeURI(r[2]);
        return "";
      },
      loadDetail() {
        this.isloading = true;
        let id = this.getUrlParam("id");
        if (!id) {
          this.isloading = false;
          this.isError = true;
          return ;
        }
        newsApi.detail({id: id, h5Yes:'YES'}).then((r) =>{
          if (r.status) {
            this.dto = r.data;
            /* console.log("资讯详情：");
             console.log(this.dto);*/
            if (!this.dto) {
              console.log("无详情时的处理方式");
              this.isError = true;
              this.isloading = false;
               return ;
            }
            if(this.dto.video_yes == 'YES') {
              this.isShow = true;
            }
            this.isError = false;
          } else {
            this.isError = true;
          }
          this.isloading = false;
        });
      }
    },
    data() {
      return {
        isloading: false,
        isShow:false,
        icon: require('assets/img/error.svg'),
        isError:false,
        search: window.location.search, //通过location来获得资讯id
        dto:{
          title: '',
          pub_level_name:'',
          pub_dept_name: '',
          pub_time: '',
          content: '',
          video_url: ''
        }
      };
    },
    mounted(){
      // console.log("查看地址");
      // console.log(window.location.host);
      this.loadDetail();
      // setTimeout(()=>{
      //   this.isloading=false;
      // },1000);
      // // this.$nextTick(()=>{
      //   this.isloading=false;
      // // })
    },
  }
</script>

<style scoped lang="scss">
  *{
    padding: 0;
    margin: 0;
  }
  .body{
    width: 100%;
    height: 100%;
    /*background: red;*/
  }
  #loading{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 99;
  }
  .title{
    font-size:24px;
    font-family:PingFangSC-Semibold;
    color:rgba(48,49,52,1);
    line-height:33px;
    margin:10px 5%;
    width: 90%;
  }
  .author{
    height: 20px;
    line-height: 20px;
    margin: 0 5%;
    margin-bottom: 30px;
    width: 90%;
  }
  .author .area{
    width:32px;
    height:18px;
    background:rgba(235,249,254,1);
    border-radius:4px;
    font-size:10px;
    font-family:PingFangSC-Regular;
    color:#0DB5EF;
    line-height:18px;
    display: inline-block;
    text-align: center;
  }
  .author .dep,.author .date{
    font-size:12px;
    font-family:PingFangSC-Regular;
    color:rgba(121,127,133,1);
    line-height:17px;
    height:17px;
  }
  .author .dep{
    margin: 0 10px;
  }
  #contentNews{
    margin: 0 5%;
    width: 90%;
    color: #303134;
    font-size:18px;
    font-family:PingFangSC-Regular;
    line-height:30px;
  }
  .errorImg{
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    margin-top: -30px;
    background: rgba(246, 246, 246, 1);
  >div{
    width: 250px;
    height: 300px;
    margin: 0 auto;
    margin-top:50%;
  img{
    width: 110px;
    height: 110px;
    display: block;
    margin: 0 auto 20px;
  }
  p{
    font-size:17px;
    font-family:PingFangSC-Semibold;
    color:rgba(121,127,133,1);
    line-height:24px;
    text-align: center;
    font-weight: 600;
    margin-top: 25px;
    margin-bottom: 5px;
  }
  .sm{
    font-size:12px;
    font-family:PingFangSC-Regular;
    color:rgba(165,170,180,1);
    line-height:17px;font-weight: 500;
  }
  button{
    margin: 25px auto 0;
    display: block;
    outline: none;
    border: none;
    width:105px;
    color: #fff;
    line-height: 32px;
    text-align: center;
    height:32px;
    background:rgba(13,181,239,1);
    border-radius:8px;
  }
  }
  }

video::-webkit-media-controls {
    overflow: hidden !important;
}
video::-webkit-media-controls-enclosure {
    // width: calc(100% + 32px);
    margin-left: auto;
}
video{
  background: #000;
}
</style>
<style lang="sass">
 .ql-editor img{
    width: 100% !important;
  }
  #contentNews img{
    width: 100% !important;
  }
</style>

