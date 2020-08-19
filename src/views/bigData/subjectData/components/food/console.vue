<template>
  <div class="console relative">
    <div class="componentId absolute"  ref='componentId' v-if="setDivShow">
          <component :is='"foodsub"' class="activeComponentName" v-if="activeComponentName=='foodsub'"></component>
          <component :is='"overview"' class="activeComponentName"  v-if="activeComponentName=='overview'"></component>
          <component :is='"ali_one"' class="activeComponentName"  v-if="activeComponentName=='ali_one'"></component>
          <component :is='"ali_two"' class="activeComponentName"  v-if="activeComponentName=='ali_two'"></component>
          <component :is='"kitchen"' class="activeComponentName"  v-if="activeComponentName=='kitchen'"></component>
          <!-- 返回按钮-->
          <div class="Btn_bottom absolute" ref='Btn_bottom'>
            <div class="btn absolute" @click="setAnimatingOut"></div>
            <div class="line absolute"></div>
          </div>
    </div>
    <div class="titleBox relative" ref='titleBox'>
      <div class="text absolute">
        <!-- {{title}} -->
       天府新区市场监管城市大脑
      </div>
    </div>
    <div class="controlPanel relative" ref="controlPanel">
      <!-- 滚动 -->
      <div class="slide absolute">
        <consoleSlide :datas='data' @activeIndex="getActiveIndex" :isShowBig='true' @animating='setAnimating'></consoleSlide>
      </div>
      <!-- 操作切换系统按钮 -->
      <div class="Btn_screen absolute" ref="Btn_screen">
        <div class="screenBg absolute" ref='screenBg'>
          <div class="textModule textModuleT">选择系统</div>
          <div class="slideScreen">
              <consoleSlide :datas='Btn_screen_data' @activeIndex="getActiveslideScreen" :isShowBig='false'></consoleSlide>
          </div>
          <div  class="textModule textModuleB">当前选择：{{moduleName}}</div>
        </div>
        <div class="screen absolute"  ref='screen'>
          <div @click="setAnimating"></div>
        </div>
      </div>
      
    </div>

  </div>
</template>

<script>
import consoleSlide from './consoleSlide';
import six from './center.vue';
import foodsub from './foodsub/index.vue';
import overview from './overview/index';
import ali_one from './overview/ali_one';
import ali_two from './overview/ali_two';
import kitchen from './overview/kitchen';
  export default {
    components: {
      consoleSlide,six,foodsub,overview,ali_one,ali_two, kitchen
    },
    data() {
      return {
        setDivShow: false,
        data:[{
          name:'四川省智慧监管中心',
          componentName:'foodsub',
          src:require('assets/img/subjectData/oneplus/test2.png')
        },
        {
          name:'四川省智慧监管中心',
          componentName:'overview',
          src:require('assets/img/subjectData/oneplus/test1.png')
        },{
          name:'四川省智慧监管中心',
          componentName:'ali_one',
          src:require('assets/img/subjectData/oneplus/test3.png')
        }
        ,{
          name:'四川省智慧监管中心',
          componentName:'ali_two',
          src:require('assets/img/subjectData/oneplus/test4.png')
        }
        ,{
          name:'四川省智慧监管中心1',
          componentName:'kitchen',
          src: require('assets/img/bigData/subjectData/kitchen.png')
        }
        // ,{
        //   name:'四川省智慧监管中心',
        //   componentName:'foodsub',
        //   src:require('assets/img/bigData/subjectData/meihekou.png')
        // },{
        //   name:'四川省智慧监管中心',
        //   componentName:'foodsub',
        //   src:require('assets/img/bigData/subjectData/meihekou.png')
        // },{
        //   name:'四川省智慧监管中心',
        //   componentName:'foodsub',
        //   src:require('assets/img/bigData/subjectData/meihekou.png')
        // }
        ],
        Btn_screen_data:[
          {
            name:'食品',
            icon:'icon-food',
            key:'food',
          },
          {
            name:'药品',
            icon:'icon-drug',
            key:'medi'
          },
          {
            name:'医疗器械',
            icon:'icon-medical',
            key:'medicalDevices'
          },
          {
            name:'化妆品',
            icon:'icon-cosmetic',
            key:'cosmetics',
          },
          {
            name:'工商',
            icon:'icon-administration',
            key:'Administration'
          },
          {
            name:'特种设备',
            icon:'icon-devices',
            key:'SpecialEquipment'
          }, {
            name:'大事记',
            icon:'icon-bill',
            key:'bigEvents'
          },
          {
            name:'数据管理中心',
            icon:'icon-transaction',
            key:'db'
          }
        ],
        title:'',
        moduleName:'',
        activeComponentName:'',
      }
    },
    mounted(){
      this.title=this.data[0].name;
      this.activeComponentName=this.data[0].componentName;
      this.moduleName=this.Btn_screen_data[0].name;
      setTimeout(() => {
        this.setDivShow = true;
      }, 8000);
    },
    methods:{
      getActiveIndex(i){
        this.title=this.data[i].name;
        this.activeComponentName=this.data[i].componentName;
      },
      getActiveslideScreen(i){
        this.moduleName=this.Btn_screen_data[i].name;
      },
      setAnimating(){
        this.setDivShow = true;
          this.$refs.screenBg.style.opacity=0;
          this.$refs.titleBox.style.opacity=0;
        setTimeout(()=>{
          this.$refs.screen.style.bottom='-87%';
        },500);
        setTimeout(()=>{
          this.$refs.controlPanel.style.top='75%';
        },1000);
        setTimeout(()=>{
          this.$refs.componentId.style.top='0';
        },1300);
        setTimeout(()=>{
          this.$refs.Btn_bottom.style.opacity=1;
        },2000);
      },
      setAnimatingOut(){
        this.$refs.Btn_bottom.style.opacity=0;
        setTimeout(()=>{
          this.$refs.componentId.style.top='-100%';
        },500);
        setTimeout(()=>{
          this.$refs.controlPanel.style.top='0';
        },700);
        setTimeout(()=>{
          this.$refs.titleBox.style.opacity=1;
          this.$refs.screenBg.style.opacity=1;
        },2000);
        setTimeout(()=>{
          this.$refs.screen.style.bottom=0;
        },1500);

      }
    }
  }
</script>
<style lang='scss' scoped>
.console{
  overflow: hidden;
  /* width: calc(100% - 40px);
  height:  calc(100% - 40px); */
  width: 100%;
  height: 100%;
  /* left: 20px;
  top: 20px; */
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: url("~@/assets/img/bigData/subjectData/bigBoxBg.png") no-repeat center;
  background-size: 100% 100%;
  .titleBox{
    height: 25%;
    width: 100%;
    transition: opacity 0.5s;
    .text{
      width:91.88%;
      height:34%;
      line-height: 237%;
      /* font-size: 60px; */
      font-size: 36px;
      color:#37B1DC;
      text-align: center;
      top: calc(66% / 2);
      left: 4.06%;
      background: url("~@/assets/img/bigData/subjectData/title_bg.png") no-repeat center;
      background-size: 100% 100%;
    }
  }
  .controlPanel{
    height: 75%;
    width: 100%;
    top: 0;
    background: url("~@/assets/img/bigData/subjectData/consoleBg.png") no-repeat center;
    background-size:  100% 100%;
    transition: top 0.5s;
    .slide{
      /* height: 612px; */
      height: 400px;
      // height: 47%;
      width: 100%;
      top: 19%;
    }
     .Btn_screen{
      /* height: 387px;
      width: 780px;
      bottom: 0;
      left: calc((100% - 780px) / 2); */
      height: 269px;
      width: 720px;
      bottom: 0;
      left: calc((100% - 752px) / 2);
      
      .screen{
        background: url("~@/assets/img/bigData/subjectData/screen.png") no-repeat center bottom;
        background-size: 100% 100%;
        z-index: 1;
        height:225px;
        bottom: 0;
        width: 660px ;
        left: 55px;
        transition: bottom 1s;
        >div{
          background: url("~@/assets/img/bigData/subjectData/arrow1.png") no-repeat center;
          background-size: 100% 100%;
          /* height: 52px;
          left: calc((100% - 52px) / 2);
          position: absolute;
          bottom: 18px;
          width: 54px; */

          height: 36px;
          left: calc((100% - 52px) / 2);
          position: absolute;
          bottom: 6px;
          width: 45px;
        }
      }
      .screenBg{
        width: 100%;
        height: 205px;
        top: 0;
        left: 30px;
        background: url("~@/assets/img/bigData/subjectData/screen_bg.png") no-repeat center top;
        background-size:  100% 100%;
        z-index: 2;
        transition:opacity 1s;
        .slideScreen{
          /* width: 496px;
          height: 114px;
          margin: 98px auto 40px; */
            width: 496px;
          height: 78px;
          margin: 73px auto 30px;
        }
        .textModule{
          width: 496px;
          left: calc((100% - 496px) / 2);
          height: 40px;
          font-size: 16px;
          color:#37B1DC;
          text-align: center;
          position: absolute;
        }
        .textModuleT{
          /* top: 55px; */
          top: 35px;
          line-height: 0px;
          background: url("~@/assets/img/bigData/subjectData/screen_line2.png") no-repeat center bottom;
          background-size: 100%;
        }
        .textModuleB{
          /* top:219px; */
          top: 155px;
          background: url("~@/assets/img/bigData/subjectData/screen_line1.png") no-repeat center top;
          background-size: 100%;
          line-height: 58px;
        }
      }
      
    } 
  }
}
.Btn_bottom{
  width: 100%;
  height: 30px;
  bottom: 0;
  left: 0;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.5s;
  .line{
    background: url("~@/assets/img/bigData/subjectData/bottom_line.png") no-repeat center bottom;
    background-size:  100% 100%;
    width: 100%;
    height: 10px;
    bottom: 0;
    z-index: 1;
  }
  .btn{
    background: url("~@/assets/img/bigData/subjectData/bottom_btn.png") no-repeat center top;
    background-size: cover;
    width: 170px;
    height: 100%;
    margin: 0 auto;
    left:calc((100% - 170px) / 2);
    z-index: 2;
  }
}
.componentId{
  width: 100%;
  height: 100%;
  top: -100%;
  overflow: hidden;
  // background: pink;
  transition: top 1s;
  z-index: 9;
  transition: top 0.5s;
  .activeComponentName{
    width: 100%;
    height: 100%;
  }
}

</style>
