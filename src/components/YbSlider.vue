<template>
    <div class="yb-slider" :style="{'width':width+'%','height':height+'px'}" ref="ybSlider" >
        <div class="content-box" :style="{'height':height+'px'}">
            <div class="content" ref="content">
                 <slot slot="key"></slot>
            </div>
        </div>
        <div class="slider-bar" ref="sliderBar" v-if="barShow">
            <img :src="imgsrc" alt="" class="drag-button" ref="dragBtn">
        </div>
    </div>
</template>

<script>
export default {
  updated(){
      const component =this.$refs.ybSlider;
      const btn = this.$refs.dragBtn;
      const bar = this.$refs.sliderBar;
      const content = this.$refs.content;
      const self = this;
      let oldX = 0;
      let newX = 0;
      let currentX = 0;
      
        //如果组件不存在则结束 
      if(!component){return false}
      
      let containerW = component.offsetWidth //容器的宽度
   
      //如果图片的长度大于容器宽度则出现滚动条。
      if(this.echartsWidth>=containerW){
        this.barShow = true;
      }else{
          this.barShow = false;
          return false
      }

     //如果组件不存在则结束 
      if(!bar) return false

      let w = bar.offsetWidth; //移动条的总长度

      //鼠标按下激活移动的按钮
      btn.onmousedown = function(e){
          oldX = e.pageX;
          newX =  e.pageX;
          if(self.isActive) return
          self.isActive = true;
      }
      //鼠标弹起禁用移动
      document.body.addEventListener('mouseup',function(){
          self.isActive = false;
      },false) 
      
      //阻止图片拖拽的默认行为
      btn.ondragstart = function(e){
         return false
      }
      btn.ondrag = function(e){
         return false
      }
     

      document.body.addEventListener('mousemove',function(e){
          e.preventDefault();
          //处于激活状态开始滚动
          if(self.isActive){
              oldX = newX
              newX = e.pageX;
              currentX += (newX - oldX); 
              let left = (currentX/w)*100;
              if(left<0){left = 0;currentX=0;}
              if(left>100){left = 100;currentX = w;}
              btn.style.left = left + '%';
              content.style.left = -(left/100*(self.echartsWidth-containerW)) + 'px';
          }
      },false)
  },
  props:{
      height:{
          default:function(){
              return 200
          }
      },
      width:{
          default:function(){
              return 100
          }
      },
      //echarts的宽度   
      echartsWidth:{
          default:function(){
              return 0
          },
      }
  },
  data(){
      return{
          imgsrc:require('assets/img/drag_button.png'),
          barShow:false,
          isActive:false  //移动按钮是否被激活
      }
  }
}
</script>

<style scoped lang="sass">
.yb-slider{
    width: 100%;
}
.yb-slider .content-box{
   overflow: hidden;
   position: relative;
   width: 100%;
}
.yb-slider .content{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
.yb-slider .slider-bar{
    height: 4px;
    background: #E5E9F2;
    width: 95%;
    margin: 20px auto 0;
    position: relative;
}
.yb-slider  .drag-button{
    position: absolute;
    left: 0%;
    top: -9px;
    cursor: pointer;
}
</style>


