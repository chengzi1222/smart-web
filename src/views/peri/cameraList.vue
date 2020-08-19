<template>
  <div class="boxDiv">
    <div class="headDiv">
      <ul class="headUl floatL">
        <li v-for="(item,index) in patternList" :class="index==patternIndex?'pattern':''" class="movePoin" @click="patternChange(index)">
          <img :src="item">
        </li>
      </ul>
      <p class="titP floatL">{{$route.query.name.length>20?$route.query.name.slice(0,9)+'...':$route.query.name}}</p>
      <p class="numP floatR">
        <img src="./img/iconleft.png" class="none" v-if="nonum==1">
        <img src="./img/iconleft.png" class="movePoin" @click="back" v-else>
        <span>{{nonum}}/{{total}}</span>
        <img src="./img/iconright.png" class="none" v-if="total==nonum">
        <img src="./img/iconright.png" class="movePoin" @click="next" v-else>
      </p>
    </div>
    <div class="onlyBox" id="onlyBox" v-if="patternIndex==0"></div>
    <div class="fourBox" v-if="patternIndex==1">
      <div class="fourDiv" id="fourDiv0"></div>
      <div class="fourDiv" id="fourDiv1"></div>
      <div class="fourDiv" id="fourDiv2"></div>
      <div class="fourDiv" id="fourDiv3"></div>
    </div>
    <div class="sixBox" v-if="patternIndex==2">
      <div class="sixDiv" id="sixDiv0"></div>
      <div class="sixDiv" id="sixDiv1"></div>
      <div class="sixDiv" id="sixDiv2"></div>
      <div class="sixDiv" id="sixDiv3"></div>
      <div class="sixDiv" id="sixDiv4"></div>
      <div class="sixDiv" id="sixDiv5"></div>
    </div>
    <div class="nineBox" v-if="patternIndex==3">
      <div class="nineDiv" id="nineDiv0"></div>
      <div class="nineDiv" id="nineDiv1"></div>
      <div class="nineDiv" id="nineDiv2"></div>
      <div class="nineDiv" id="nineDiv3"></div>
      <div class="nineDiv" id="nineDiv4"></div>
      <div class="nineDiv" id="nineDiv5"></div>
      <div class="nineDiv" id="nineDiv6"></div>
      <div class="nineDiv" id="nineDiv7"></div>
      <div class="nineDiv" id="nineDiv8"></div>
    </div>
    <div class="maxBox" v-if="patternIndex==4">
      <div class="maxDiv" id="maxDiv0"></div>
      <div class="maxDiv" id="maxDiv1"></div>
      <div class="maxDiv" id="maxDiv2"></div>
      <div class="maxDiv" id="maxDiv3"></div>
      <div class="maxDiv" id="maxDiv4"></div>
      <div class="maxDiv" id="maxDiv5"></div>
      <div class="maxDiv" id="maxDiv6"></div>
      <div class="maxDiv" id="maxDiv7"></div>
      <div class="maxDiv" id="maxDiv8"></div>
      <div class="maxDiv" id="maxDiv9"></div>
      <div class="maxDiv" id="maxDiv10"></div>
      <div class="maxDiv" id="maxDiv11"></div>
      <div class="maxDiv" id="maxDiv12"></div>
      <div class="maxDiv" id="maxDiv13"></div>
      <div class="maxDiv" id="maxDiv14"></div>
      <div class="maxDiv" id="maxDiv15"></div>
    </div>
  </div>
</template>

<script>
  import {getListCamerasByEntityId} from 'api/peri/camera'
  export default {
    mounted() {
      getListCamerasByEntityId(this.$route.query.id, "detail").then(r=>{
        if(r.status){
          this.playerCarema = r.data;
          if(r.data.length>0){
            this.mo();
            this.playFlow('onlyBox', this.playerCarema[0].playerAddr);
            this.createElementName('onlyBox',this.playerCarema[0].name,14);
          }
        }
      })
    },
    methods: {
      mo(){
        this.total = Math.floor(this.playerCarema.length / this.sunNum);
        if ((this.playerCarema.length % this.sunNum) >= 1) {
          this.total++;
        }
      },
      patternChange(index) {
        for(let i=0; i<this.player.length; i++){
          this.player[i].dispose();
        }
        this.player = [];
        this.patternIndex = index;
        var elements = document.getElementsByClassName('appendDom');
        for (var i = elements.length - 1; i >= 0; i--) {
          elements[i].parentNode.removeChild(elements[i]);
        }
        setTimeout(() => {
          if (index == 0) {
            this.nonum = 1;
            this.sunNum = 1;
            if(this.playerCarema.length>0){
              this.playFlow('onlyBox', this.playerCarema[0].playerAddr);
              this.createElementName('onlyBox', this.playerCarema[0].name, 14);
            } else {
              this.createElement('onlyBox', '240px auto 0', '70px', '40px');
            }
          } else if (index == 1) {
            this.nonum = 1;
            this.sunNum = 4;
            for (let i = 0; i < 4; i++) {
              if(i>=this.playerCarema.length){
                this.createElement('fourDiv' + i, '100px auto 0', '60px', '20px');
              } else {
                this.playFlow('fourDiv' + i, this.playerCarema[i].playerAddr);
                this.createElementName('fourDiv' + i, this.playerCarema[i].name, 14);
              }
            }
          } else if (index == 2) {
            this.nonum = 1;
            this.sunNum = 6;
            for (let i = 0; i < 6; i++) {
              if (i >= this.playerCarema.length) {
                this.createElement('sixDiv' + i, '100px auto 0', '50px', '20px');
              } else {
                this.playFlow('sixDiv' + i, this.playerCarema[i].playerAddr);
                this.createElementName('sixDiv' + i, this.playerCarema[i].name, 14);
              }
            }
          } else if (index == 3) {
            this.nonum = 1;
            this.sunNum = 9;
            for (let i = 0; i < 9; i++) {
              if (i >= this.playerCarema.length) {
                this.createElement('nineDiv' + i, '70px auto 0', '40px', '15px','16px');
              } else {
                this.playFlow('nineDiv' + i, this.playerCarema[i].playerAddr);
                this.createElementName('nineDiv' + i, this.playerCarema[i].name, 14);
              }
            }
          } else if (index == 4) {
            this.nonum = 1;
            this.sunNum = 16;
            for (let i = 0; i < 16; i++) {
              if (i >= this.playerCarema.length) {
                this.createElement('maxDiv' + i, '50px auto 0', '30px', '10px','14px');
              } else {
                this.playFlow('maxDiv' + i, this.playerCarema[i].playerAddr);
                this.createElementName('maxDiv' + i, this.playerCarema[i].name, 12);
              }
            }
          }
          this.mo();
        }, 100);
      },
      playFlow(id, playerAddr) {
        var videoObj = {
          "id": id,
          "source": playerAddr,
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
              ]
            }
          ]
        }
        var player = new Aliplayer(videoObj, function (player) {
          console.log("播放器创建了。");
        })
        this.player.push(player);
      },
      back(){
        for (let i = 0; i < this.player.length; i++) {
          this.player[i].dispose();
        }
        this.player = [];
        this.nonum--;
        if (this.patternIndex == 0) {
          this.playFlow('onlyBox', this.playerCarema[this.nonum - 1].playerAddr);
          this.createElementName('onlyBox', this.playerCarema[this.nonum - 1].name, 14);
        }else if (this.patternIndex == 1) {
          for (let i = 0; i < 4; i++) {
            if(i+4*(this.nonum-1)>=this.playerCarema.length){
              this.createElement('fourDiv' + i, '100px auto 0', '60px', '20px');
            } else {
              this.playFlow('fourDiv' + i, this.playerCarema[i+4*(this.nonum-1)].playerAddr);
              this.createElementName('fourDiv' + i, this.playerCarema[i+4*(this.nonum-1)].name, 14);
            }
          }
        }else if (this.patternIndex == 2) {
          for (let i = 0; i < 6; i++) {
            if(i+6*(this.nonum-1)>=this.playerCarema.length){
              this.createElement('sixDiv' + i, '100px auto 0', '50px', '20px');
            } else {
              this.playFlow('sixDiv' + i, this.playerCarema[i+6*(this.nonum-1)].playerAddr);
              this.createElementName('sixDiv' + i, this.playerCarema[i+6*(this.nonum-1)].name, 14);
            }
          }
        }else if (this.patternIndex == 3) {
          for (let i = 0; i < 9; i++) {
            if(i+9*(this.nonum-1)>=this.playerCarema.length){
              this.createElement('nineDiv' + i, '70px auto 0', '40px', '15px','16px');
            } else {
              this.playFlow('nineDiv' + i, this.playerCarema[i+9*(this.nonum-1)].playerAddr);
              this.createElementName('nineDiv' + i, this.playerCarema[i+9*(this.nonum-1)].name, 14);
            }
          }
        }else if (this.patternIndex == 4) {
          for (let i = 0; i < 16; i++) {
            if(i+16*(this.nonum-1)>=this.playerCarema.length){
              this.createElement('maxDiv' + i, '50px auto 0', '30px', '10px','14px');
            } else{
              this.playFlow('maxDiv' + i, this.playerCarema[i+16*(this.nonum-1)].playerAddr);
              this.createElementName('maxDiv' + i, this.playerCarema[i + 16 * (this.nonum - 1)].name, 12);
            }
          }
        }
      },
      next(){
        for (let i = 0; i < this.player.length; i++) {
          this.player[i].dispose();
        }
        this.player = [];
        this.nonum++;
        if(this.patternIndex==0){
          this.playFlow('onlyBox', this.playerCarema[this.nonum - 1].playerAddr);
          this.createElementName('onlyBox', this.playerCarema[this.nonum - 1].name, 14);
        } else if (this.patternIndex == 1) {
          for (let i = 0; i < 4; i++) {
            if (i + 4 * (this.nonum - 1) >= this.playerCarema.length) {
              this.createElement('fourDiv' + i, '100px auto 0', '60px', '20px');
            } else {
              this.playFlow('fourDiv' + i, this.playerCarema[i + 4 * (this.nonum - 1)].playerAddr);
              this.createElementName('fourDiv' + i, this.playerCarema[i+4*(this.nonum-1)].name, 14);
            }
          }
        } else if (this.patternIndex == 2) {
          for (let i = 0; i < 6; i++) {
            if (i + 6 * (this.nonum - 1) >= this.playerCarema.length) {
              this.createElement('sixDiv' + i, '100px auto 0', '50px', '20px');
            } else {
              this.playFlow('sixDiv' + i, this.playerCarema[i+6* (this.nonum-1)].playerAddr);
              this.createElementName('sixDiv' + i, this.playerCarema[i+6*(this.nonum-1)].name, 14);
            }
          }
        } else if (this.patternIndex == 3) {
          for (let i = 0; i < 9; i++) {
            if (i + 9 * (this.nonum - 1) >= this.playerCarema.length) {
              this.createElement('nineDiv' + i, '70px auto 0', '40px', '15px','16px');
            } else {
              this.playFlow('nineDiv' + i, this.playerCarema[i + 9 * (this.nonum - 1)].playerAddr);
              this.createElementName('nineDiv' + i, this.playerCarema[i+9*(this.nonum-1)].name, 14);
            }
          }
        } else if (this.patternIndex == 4) {
          for (let i = 0; i < 16; i++) {
            if (i + 16 * (this.nonum - 1) >= this.playerCarema.length) {
              this.createElement('maxDiv' + i, '50px auto 0', '30px', '10px','14px');
            } else {
              this.playFlow('maxDiv' + i, this.playerCarema[i + 16 * (this.nonum - 1)].playerAddr);
              this.createElementName('maxDiv' + i, this.playerCarema[i + 16 * (this.nonum - 1)].name, 12);
            }
          }
        }
      },
      createElement(id,margin,width,marginTop,size){
        let dom = document.getElementById(id);
        let img = document.createElement("img");
        let _p = document.createElement("p");
        img.src = require("./img/iconcamera.png");
        img.style = `display: block;margin: ${margin};width: ${width};`;
        _p.textContent = '暂无摄像头';
        _p.style = `text-align: center;color: #fff;margin-top: ${marginTop};font-size: ${size?size:'18px'};`;
        img.className = 'appendDom';
        _p.className = 'appendDom';
        dom.appendChild(img);
        dom.appendChild(_p);
      },
      createElementName(id, name, size){
        let dom = document.getElementById(id);
        let _p = document.createElement("p");
        _p.textContent = name;
        _p.style = `font-size:${size}px;position:absolute;bottom:0px;left:50%;width:${name.length * size}px;text-align:center;
                    margin-left:-${name.length * size / 2}px;color:#fff;padding:8px;background:rgba(51,51,51,.3);`;
        _p.className = 'appendDom';
        dom.appendChild(_p);
      }
    },
    data() {
      return {
        total: 0,
        nonum: 1,
        sunNum: 1,
        patternIndex: 0,
        patternList: [
          require("./img/iconone.png"), 
          require("./img/iconfour.png"),
          require("./img/iconsix.png"),
          require("./img/iconnine.png"),
          require("./img/iconmax.png")],
        player: [],
        playerCarema: []
      }
    },
    beforeDestroy(){
       for (let i = 0; i < this.player.length; i++) {
          this.player[i].dispose();
        }
    }
  }
</script>

<style lang="scss" scoped>
  .boxDiv{
    height: 100%;
    min-width: 850px;
  }
  .headDiv{
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background: #25272A;
    .headUl{
      display: flex;
      width: 400px;
      li{
        width: 80px;
        text-align: center;
        img{
          vertical-align: middle;
        }
      }
      .pattern{
        background: #37393C;
        border-bottom: 4px solid #15BAF3;
        height: 50px;
        box-sizing: border-box;
      }
    }
    .titP{
      width: calc(100% - 570px);
      text-align: center;
      color: #FFFFFF;
      font-size: 18px;
    }
    .numP{
      font-size: 14px;
      color: #FFFFFF;
      img{
        vertical-align: text-bottom;
      }
      span{
        margin: 0 20px;
      }
      .none{
        cursor: not-allowed;
      }
    }
  }
  .onlyBox,.fourBox,.sixBox,.nineBox,.maxBox{
    height: calc(100% - 50px) !important;
    background: #393939;
    padding: 7px;
    box-sizing: border-box;
    overflow: hidden;
    div{
      display: inline-block;
      background: #4A4A4A;
      overflow: hidden;
      position: relative;
    }
  }
  .onlyBox{
    background: #4A4A4A;
  }
  .fourBox{
    .fourDiv{
      width: 49.5% !important;
      height: 49.5% !important;
    }
  }
  .sixBox{
    .sixDiv{
      width: 33% !important;
      height: 49.5% !important;
    }
  }
  .nineBox{
    .nineDiv{
      width: 33% !important;
      height: 33% !important;
    }
  }
  .maxBox{
    .maxDiv{
      width: 24.6% !important;
      height: 24.7% !important;
    }
  }
</style>