<template>
  <div class="slideBox clear_a">
    <div class="innerBox relative " ref='innerBox'>
        <div class="line1 absolute" v-if='isShowBig'></div>
        <div class="line2 absolute" v-if='isShowBig'></div>
        <ul ref='innerUl' class="innerUl clear_a absolute" v-if='isShowBig' :style="{
             width: `${ innerUlW }px`,left:`${ positionLeftW }px`}">
            <li :style="{width: `${innerLiWidth }px`}" class="transform_special">
                <div class="component movePoin" 
                :class="{'left_transform':activaIndex==0&&isShowBig,}" @click.stop="liClick(datas.length-1,$event)">
                    <!-- <component :is='datas[datas.length-1].componentName'></component> -->
                    <img :src="datas[datas.length-1].src" style="width:100%;height:100%">
                </div>
            </li>
            <!-- :style="computeStyleBigIndex" 'bigBox':bigIndex==i,'_bigBox':bigIndex==null,-->
            <li v-for='(item,i) in datas' ref="liIten" :key="item.componentName+i" :class="{'transform_special':activaIndex==i+1||activaIndex==i-1}" :style="{width: `${innerLiWidth }px`}">
                <div class="component movePoin" @click.stop="liClick(i,$event,'isItem')"
                 
                :class="{'isActive':activaIndex==i,
                'left_transform':activaIndex==i+1&&isShowBig,'right_transform':activaIndex==i-1&&isShowBig,}">
                    <!-- <component :is='item.componentName'></component> -->
                    <img :src="item.src" style="width:100%;height:100%">
                </div>
            </li>
            <li :style="{width: `${innerLiWidth }px`}" class="transform_special">
                <div class="component movePoin" @click.stop="liClick(0,$event)"
                :class="{'right_transform':activaIndex==datas.length-1&&isShowBig,}" >
                    <!-- <component :is='datas[0].componentName'></component> -->
                    <img :src="datas[0].src" style="width:100%;height:100%">
                </div>
            </li>

        </ul>
        <ul ref='innerUl' class="innerUl clear_a absolute innerUl_screen" v-if='!isShowBig' :style="{
             width: `${ innerUlW }px`,left:`${ positionLeftW }px`}">
            <li :style="{width: `${innerLiWidth }px`}" class="transform_special">
                <div class="component movePoin" 
                :class="{'left_transform_screen':activaIndex==0&&!isShowBig,}" @click.stop="liClick(datas.length-1,$event)">
                    <div>
                        <p class="icon iconfont" :class="datas[datas.length-1].icon"></p>
                        {{datas[datas.length-1].name}}
                    </div>
                </div>
            </li>
            <!-- :style="computeStyleBigIndex" 'bigBox':bigIndex==i,'_bigBox':bigIndex==null,-->
            <li v-for='(item,i) in datas' ref="liIten" :key="item.name+i" :class="{'transform_special':activaIndex==i+1||activaIndex==i-1}" :style="{width: `${innerLiWidth }px`}">
                <div class="component" @click.stop="liClick(i,$event,'isItem')"
                :class="{'isActive':activaIndex==i,'movePoin':activaIndex!=i,
                'left_transform_screen':activaIndex==i+1&&!isShowBig,'right_transform_screen':activaIndex==i-1&&!isShowBig}">
                    <div>
                        <p class="icon iconfont" :class="item.icon"></p>
                        {{item.name}}
                    </div>
                </div>
            </li>
            <li :style="{width: `${innerLiWidth }px`}" class="transform_special">
                <div class="component movePoin" @click.stop="liClick(0,$event)"
                :class="{'right_transform_screen':activaIndex==datas.length-1&&!isShowBig,}" >
                    <div>
                        <p class="icon iconfont" :class="datas[0].icon"></p>
                        {{datas[0].name}}
                    </div>
                </div>
            </li>

        </ul>
    </div>
  </div>
</template>

<script>
import six from './center.vue';
import subjectDistribution from './subjectDistribution';
import foodsub from './foodsub/index.vue';
  export default {
    components:{
        six,subjectDistribution,foodsub
    },
    props: {
      datas: {
        type: Array,
      },
      isShowBig:{//是否放大选中
          type: Boolean,
          default:false
      },

    },
    watch:{
        datas(val){
            this.datas=val;
        },
        screenWidth(){
            this.resize();
        }
    },
    data() {
      return {
          innerLiWidth:0,//每个元素的宽
          positionLeftW:0,//定位left的值
          throttle:true,//节流
          bigIndex:null,//放大的索引
          screenWidth: document.documentElement.clientWidth,
          
      }
    },
    mounted(){
        this.$nextTick(()=>{
            this.innerLiWidth=Math.round(this.$refs.innerBox.clientWidth/3);
        })
        window.onresize(()=>{ 
            this.resize();
        });
    },
    computed: {
        innerUlW(){
            let num=this.datas.length+2
            return num*this.innerLiWidth;
        },
        activaIndex(){//返回的索引
            let index= Math.abs(this.positionLeftW)/this.innerLiWidth;
            return index;
        },
        computeStyleBigIndex(){
            if(this.activaIndex==this.bigIndex){    
                let parentH=this.$parent.$el.offsetHeight+'px';
                let parentW=this.$parent.$el.offsetWidth+'px';
                let parentL=this.$parent.$el.offsetLeft;
                let parentT=this.$parent.$el.offsetTop;
                return { left:parentL,top:parentT,width:parentW,height:parentH,}
            }else{
                return { width:'84%',height:'90%',};
            }
        }
    },
    methods:{
        liClick(i,event,w){
                if(!w&&i==this.datas.length-1||w&&this.activaIndex>i){
                    this.leftbtn()
                }else if(!w&&i==0||w&&this.activaIndex<i){
                    this.rightbtn()
                }else{
                    if(i==this.activaIndex && this.throttle){
                        console.log("执行放大功能",i,this.activaIndex,event);
                        this.$emit("animating")
                    }
                }
           
        },
        leftbtn(){
            if(!this.throttle){
                return;
            }
            this.throttle = false;
            setTimeout(()=>{
                if(this.positionLeftW==0){
                    this.positionLeftW=0-(this.datas.length*this.innerLiWidth-this.innerLiWidth);
                }else{
                    this.positionLeftW=this.positionLeftW+this.innerLiWidth;
                }
                setTimeout(()=>{              
                    this.throttle = true;
                }, 500);
                this.$emit("activeIndex",this.activaIndex);
            }, 500);
        },
        rightbtn(){
            if(!this.throttle){
                return;
            }
            this.throttle = false;
            setTimeout(()=>{
                let is;
                    is=this.positionLeftW==0-(this.datas.length*this.innerLiWidth-this.innerLiWidth)
                if(is){
                    this.positionLeftW=0;
                }else{
                    this.positionLeftW=this.positionLeftW-this.innerLiWidth;
                }               
                setTimeout(()=>{              
                    this.throttle = true;
                }, 500);
                this.$emit("activeIndex",this.activaIndex);
            }, 500);
        },
        resize(){
            let leftIndex=this.positionLeftW/this.innerLiWidth;
            this.$nextTick(()=>{
                this.innerLiWidth=Math.round(this.$refs.innerBox.clientWidth/3);
                this.positionLeftW=leftIndex*this.innerLiWidth;
            })
        }
    },
    
  }
</script>
<style lang='scss' scoped>
.slideBox{
    width: 100%;
    height: 100%;
    background: transparent;
}
.innerBox{
    width:100%;
    height: 100%;
    overflow: hidden;
    .line1,.line2{
        width: 54px;
        height: 344px;
        top: calc((100% - 344px) / 2);
        background: url("~@/assets/img/bigData/subjectData/line.png") no-repeat center;
        background-size:100% 100%;
    }
    .line1{
        left:calc((100% / 3) - 27px);
    }
    .line2{
        left: calc(((100% / 3) * 2) - 27px);
    }
}
.innerUl{
    width: 100%;
    height: 100%;
    transition: left 0.5s;
    z-index: 2;
}
.innerUl>li{
    height: 100%;
    .component{
        /* width: 800px; */
        width: 550px;
        /* height: 452px; */
        height: 300px;
        /* margin: 80px auto; */
        margin: 50px auto;
        background: transparent;
        border-radius: 2px;
        overflow: hidden;
        >div{
            width: 100%;
            height:100%;
        }
    }
}
.transform_special{
    transform-style: preserve-3d;
    perspective: 600px;
}
.isActive{
    box-shadow: #2AA3D1 0px 0px 15px 3px;
}
.left_transform{
    transform: rotateY(8deg);
}
.right_transform{
    transform: rotateY(-8deg);
}
.left_transform_screen{
    transform: rotateY(-28deg);
}
.right_transform_screen{
    transform: rotateY(28deg);
}
// .innerUl>li .bigBox{
//     position: fixed;
//     z-index: 8;
//     margin: 0;
//     transition:all 1s;
// }
// ._bigBox{
//     width: 84%;
//     height: 90%;
//     transition:width height 1s;
// }
.innerUl_screen{
    li>.component{
        /* width: 144px;
        height: 114px; */
        width: 134px;
        height: 83px;
        margin: 0px auto;
        background: transparent;
        border-radius: 2px;
        overflow: hidden;
    }
    .component>div{
        width: 100%;
        height: 100%;
        font-size: 16px;
        color: #3FCCFC;
        background: url("~@/assets/img/bigData/subjectData/btn_default.png") no-repeat center;
        background-size: 100% 100%;;
        text-align: center;
        p{
            /* font-size: 24px;
            padding: 27px 0 7px; */
            font-size: 20px;
            padding: 19px 0 4px;
        }
    }
    .isActive{
        box-shadow:none;
    }
    .isActive>div{
        background: url("~@/assets/img/bigData/subjectData/btn_selected.png") no-repeat center;
        background-size: 100% 100%;
    }
}
</style>
