<template>
  <div class="mapA2 relative">
      <div class="top clear_a">
          <div class="title">天府新区市场监管城市大脑</div>
          <div class="time textR">{{time}}</div>
      </div>
      <ul class="bottom clear_a" >
          <li class="map relative">
              <!-- <div  class="btn absolute"  @click="switch_">模式切换</div> -->
              <mapEcharts @getCode="getCode_"></mapEcharts>
              <ul class="map_dataShow absolute clear_a">
                  <li  v-for="(item,index) in data" :key="item+index">
                      <p>{{item.name}}</p>
                      <p class="pB">{{item.num}}</p>
                  </li>
              </ul>
            <div class="radiusGif absolute">
                    <div class="box1"></div>
                    <div class="box2"></div>
            </div>
            <div class="radiusGifCenter absolute">
            </div>
          </li>
          <li>
              <Type></Type>
          </li>
          <li>
            <Grow></Grow>
          </li>
          <li>
            <Subject></Subject>
          </li>
      </ul>
  </div>
</template>

<script>
import mapEcharts from './map_echarts.vue';
import {getSubjectDistribution,getSubOrdinateEntityDistribution} from 'api/bigData/subjectData'
import Type from '../../../oneTFXQ/type'
import Grow from '../../../oneTFXQ/grow'
import Subject from '../../../oneTFXQ/subject'
  export default {
    components: {
        mapEcharts,
        Type,
        Grow,
        Subject
    },
    data() {
      return {
            time:"",
            data:[
              {
                  name:'主体总数',
                  num:0,
                  type:'totalMap'
              },
              {
                  name:'生产主体',
                  num:0,
                  type:'PRODUCT'
              },{
                  name:'流通主体',
                  num:0,
                  type:'CIRCULATION'
              },{
                  name:'餐饮主体',
                  num:0,
                  type:'RESTAURANT'
              },{
                  name:'药品',
                  num:0,
                  type:'MEDI'
              },{
                  name:'医疗器械',
                  num:0,
                  type:'MEDIDEV'
              },{
                  name:'其他主体',
                  num:0,
                  type:'CFDA'
              }
              // {
              //     name:'重点监管对象',
              //     num:276,
              //     type:'maxTotal'
              // }
              ]
              ,willDestroy:false,
              timer:[]
      }
    },
    mounted(){
        this.setInterval_time()
        this.load("");
    },
    beforeDestroy(){
      this.willDestroy = true;
      this.timer.forEach(item => {
        clearInterval(item);
        item = null;
      });
    },
    methods:{
        switch_(){
            console.log(0)
            this.$emit("switchFun","mapb");
        },
        async load(code){
            if(code.lastIndexOf('00')>0){
                code=code.substring(0,code.lastIndexOf('00'));
            }
            this.data.forEach(el=>{
                el.num=0;
            })
           await getSubjectDistribution({"type":"All","areaCode":code}).then((r)=>{
               if (!r.status) {
                    this.$message({
                        message: r.message,
                        type: r.level
                    });
                    return;
                }
                this.data[0].num=r.data.total + 1358;
                r.data.list.push({num: 542, type: "MEDI"})
                r.data.list.push({num: 816, type: "MEDIDEV"})
                r.data.list.forEach(element => {
                    if(element.type=="流通主体"){
                        this.data[2].num=element.num;
                    }
                    if(element.type=="生产主体"){
                        this.data[1].num=element.num;
                    }
                    if(element.type=="餐饮主体"){
                        this.data[3].num=element.num;
                    }
                    if(element.type=="CFDA"){
                        this.data[6].num=element.num;
                    }
                    if(element.type=="MEDI"){
                        this.data[4].num=element.num;
                    }
                    if(element.type=="MEDIDEV"){
                        this.data[5].num=element.num;
                    }
                });
           })
        },
        getCode_(code){
             this.load(code);
        },
        setInterval_time(){
            this.$nextTick(() => {
                if (this.willDestroy) return;
                var t=setInterval(()=>{
                    this.timeShow();
                },1000);
                this.timer.push(t);
            });
        },
        timeShow(){
		　　let mydate = new Date();
		　　let str = "" + mydate.getFullYear() + "年";
		    let M=mydate.getMonth()+1;
			if(M<10){
				M="0"+M;
			};
		　　str += M + "月";
			 let D=mydate.getDate();
			if(D<10){
				D="0"+D;
			};
		　　	str += D + "日";
		 let h=mydate.getHours();
			if(h<10){
				h="0"+h;
			};
			str += " "+h + " : ";
			let s=mydate.getMinutes();
			if(s<10){
				s="0"+s;
			};
		　　	str += s;
		 let se=mydate.getSeconds();
			if(se<10){
				se="0"+se;
			};
			str += " : "+se ;
			this.time=str;
        }
      
    }
  }
</script>
<style lang='scss' scoped>
.mapA2{
    height: 100%;
    width: 100%;
    /* background: #050c17; */
    background: url('~assets/img/bigData/subjectData/bigBoxBg.png');
    overflow: hidden;
}
.top{
    width: 100%;
    height: 90*2px;
    >div{
        padding: 0 20*2px;
        width: calc(50% - 42*2px);
        height: 100%;
        line-height: 90*2px;
    }
    .title{
        font-size:36*2px;
        color:rgba(13,181,239,1);
    }
    .time{
        font-size:18*2px;
        color:rgba(221,221,221,1);
    }
}
.bottom{
    width: 100%;
    height: calc(100% - 90*2px);
    margin-left: 700px;
    >li{
        margin-right: 20*2px;
        margin-bottom: 20*2px;
        background:rgba(24,34,52,0.2);
        border:1*2px solid rgba(53,122,162,1);
        width:770*2px;
        height: calc((100% - 60*2px) / 3);
        box-sizing: border-box;
    }
    >li.map{
        margin-left: 20*2px;
        width:1090*2px;
        height: calc(100% - 20*2px);
        .btn{
            width: 115*2px;
            height: 49*2px;
            line-height: 49*2px;
            font-size: 16*2px;
            color: #EEEEEE;
            text-align: center;
            background: url("~@/assets/img/bigData/subjectData/btn_1.png") no-repeat center;
            background-size: 100% 100%;
            z-index: 5;
            left: 29*2px;
            top: 26*2px;
            &:hover{
                background: url("~@/assets/img/bigData/subjectData/btn_2.png") no-repeat center;
                background-size: 100% 100%;
            }
        }
        .map_dataShow{
            width: 1030*2px;
            height: 100*2px;
            background: url("~@/assets/img/bigData/subjectData/mapA2TFXQ.png") no-repeat center;
            background-size: 100% 100%;
            left: calc((100% - 1030*2px) / 2);
            bottom: 55*2px;
            text-align: center;
            >li{
                width: calc(100% / 7);
                height: 100%;
                p{
                    color: #ffffff;
                    font-size:18*2px;
                    margin-top: 19*2px;
                }
                .pB{
                    margin-top: 0;
                    font-size:36*2px;
                    color:rgba(13,181,239,1);
                }
            }
            
        }
        .radiusGif{
            width: 639*2px;
            height: 639*2px;
            margin: 0 auto;
            bottom: -68*2px;
            left: calc((100% - 639*2px) / 2);
            -webkit-transform: scaleZ(1) rotateX(82deg); 
            -moz-transform: scaleZ(1) rotateX(82deg); 
            -ms-transform: scaleZ(1) rotateX(82deg); 
            -o-transform: scaleZ(1) rotateX(82deg); 
            transform: scaleZ(1) rotateX(82deg);
       
            .box1{
                background: url("~@/assets/img/bigData/subjectData/circle2.png") no-repeat center;
                background-size: 100% 100%;
                width: 520*2px;
                height: 520*2px;
                border-radius: 50%;
                position: absolute;
                left: 60*2px;
                top: 0*2px;
                -webkit-transform: rotate(360deg);
                animation: rotation 50s linear infinite;
                -moz-animation: rotation 50s linear infinite;
                -webkit-animation: rotation 50s linear infinite;
                -o-animation: rotation 50s linear infinite;
            }
            .box2{
                background:url("~@/assets/img/bigData/subjectData/circle1.png") no-repeat center;
                background-size: 100% 100%;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                margin: 0 auto;
                position: absolute;
                left: 0;
                top: 0;
                -webkit-transform: rotate(360deg);
                animation: rotation1 50s linear infinite;
                -moz-animation: rotation1 50s linear infinite;
                -webkit-animation: rotation1 50s linear infinite;
                -o-animation: rotation1 50s linear infinite;
            }
         }
        .radiusGifCenter{
            background:url("~@/assets/img/bigData/subjectData/circle3.png") no-repeat center;
            background-size: 100% 100%;
            width: 400*2px;
            height: 50*2px;
            bottom: 245*2px;
            left: calc((100% - 400*2px) / 2);
        }	

    }
}
@keyframes rotation{
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
}
@keyframes rotation1{
    from {-webkit-transform: rotate(360deg);}
    to {-webkit-transform: rotate(0deg);}
}
</style>
