<template>
  <div class="box">
    <img src="../assets/img/QRcode.png" alt="" @click.stop="look">
    <div class="qr" v-show="lok">
      <p>扫码查看该主体</p>
      <!--<img :src="url" alt="">-->
      <span id="qrcode"></span>
      <div style="text-align: center;margin-top: 10px;">
        <el-button type="primary" class="btn" icon="el-icon-upload" @click="down">下载二维码</el-button>
      </div>
    </div>

  </div>
</template>
<script>
  import QRCode from 'qrcodejs2';


  export default {
    mounted(){
      this.qrcode();
      document.body.addEventListener('click',()=>{
        this.lok = false;
      },false)
    },
    props:{
      //子数据
      //二维码地址
      url:{
        type:String
      },
      //下载文件名
      dname:{
        type:String
      },
      //背景文件
      backImg:{
        type:String
      },
      datas:{
        type:Object
      }
    },
    data() {
      return {
        entityUrl:"",
        lok:false,
      };
    },
    methods: {
      qrcode() {
        var qrcode = new QRCode('qrcode', {
          text: this.url,
          width: 300,
          height: 300,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      },
      look() {
        this.lok = !this.lok;
      },
      /**
       * 二维码字数换行
       * @param cavans cavans对象
       * @param t 字符串
       * @param x x轴
       * @param y y轴
       * @param w 当w字数时，执行换行
       */
      drawText(cavans,t,x,y,w){
        var chr = t.split("");
        var temp = "";
        var row = [];
        cavans.font = "20px Arial";
//        context.fillStyle = "black";
//        context.textBaseline = "middle";
        for(var a = 1; a <= chr.length; a++){
          temp += chr[a-1];
          if(a%w==0){
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);
        for(var b = 0; b < row.length; b++){
          cavans.fillText(row[b],x,y+(b+1)*25);
        }
      },
      down() {
        this.$emit('refreshbizlines');
        var span = document.getElementById("qrcode");
        //图片地址
        let urlBack = "";
        //获取二维码
        var qr = span.getElementsByTagName("img")[0];
        if(this.backImg != null){
          //创建img
          let imgBack = document.createElement("img");
          imgBack.src = this.backImg;
          imgBack.height = 1772;
          imgBack.width = 1181;
          //创建canvas
          let canvasBack = document.createElement("canvas")
          canvasBack.width  = 600;
          canvasBack.height = 850;
          let ctxBack = canvasBack.getContext("2d")
          imgBack.onload = ()=>{
            ctxBack.drawImage(imgBack,0,0,1181,1772,0,0,600,850);
            ctxBack.drawImage(qr,0,0,470,700,109,237.5,600,850);
            ctxBack.font="25px Arial";
            this.drawText(ctxBack,this.datas.entityName,245,666,12);
            if(this.datas.entityType="MEDICINE"){
              this.drawText(ctxBack,this.datas.realityAddr,245,746,12);
            }else{
              if(this.datas.type == 'VENDORS'){
                this.drawText(ctxBack,this.datas.placeBiz,245,746,12);
              }else{
                this.drawText(ctxBack,this.datas.spaceAddr,245,746,12);
              }
            }
            urlBack = canvasBack.toDataURL();

            //创建a标签，点击
            let a = document.createElement('a');
            let name = this.datas.entityName;
            a.addEventListener('click',function(e){
              a.download = name+".jpeg";
              a.href = urlBack;
            })
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', false, false)
            a.dispatchEvent(e)
//            let a = document.createElement('a');
//            a.setAttribute("href", urlBack);
//            a.setAttribute("download", this.datas.entityName+".png");
//            a.click();
          }
        }else{
          urlBack = span.getElementsByTagName("img")[0].src
        }
          //创建img
//          let imgBack = document.createElement("img");
//          imgBack.src = this.backImg;
//          imgBack.height = 1772;
//          imgBack.width = 1181;
//          //创建canvas
//          let canvasBack = document.createElement("canvas")
//          canvasBack.width  = 600;
//          canvasBack.height = 850;
//          let ctxBack = canvasBack.getContext("2d")
//          imgBack.onload = ()=>{
//            ctxBack.drawImage(imgBack,0,0,1181,1772,0,0,600,850);
//            let urlBack = canvasBack.toDataURL();
//            //创建a标签，点击
//            let a = document.createElement('a');
//            let name = this.datas.entityName;
//            a.addEventListener('click',function(e){
//              a.download = name+".jpeg";
//              a.href = urlBack;
//            })
//            var e = document.createEvent('MouseEvents')
//            e.initEvent('click', false, false)
//            a.dispatchEvent(e)
//          }
      }
    }
  };
</script>

<style scoped lang="sass">
  .box{
    display: inline-block;
    position: relative;
    margin-left: 10px;
      img{
        width: 20px;
        height: 20px;
        margin-bottom: -5px;
    }
      .qr{
        padding: 10px 18px;
        position: absolute;
        top: 0;
        left: 40px;
        width: 300px;
        z-index: 999;
        background: #FFFFFF;
        box-shadow: 0 4px 12px 0 rgba(14,24,41,0.21);
        border-radius: 5px;
          p{
            font-size: 14px;
            color: #A2AAB6;
            text-align: center;
        }
          img{
            height: 120px;
            width: 120px;
            margin:10px 0;
            display: inline-block;
        }
          .btn{
            width: 120px;
        }
    }

  }
</style>
