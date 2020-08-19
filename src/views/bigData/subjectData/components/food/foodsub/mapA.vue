<template>
  <div  class="fooSubMapA relative" >
      <p class="title absolute">{{ areaName }}智慧城市主体情况</p>
      <div  class="btn absolute"  @click="switch_">模式切换</div>
      <ul class="left absolute clear_a">
          <li v-for="(item,index) in data" :key="item.type+index" @click="leftClick(index,item)" 
          :class="{'leftActive':leftActiveIndex==index,'mbNone':index==data.length-1}" >
              <p>{{item.name}}</p>
              <p  class="pB">{{item.num}}</p>
          </li>
      </ul>
      <div  class="absolute foosubMid">
          <mapEcharts @getCode="getCode_"></mapEcharts>
      </div>
      <div  class="right absolute">
          <p>{{rightTitle}}排名</p>
          <div class="relative">
              <ul class="rightUlBox absolute" :style="{'top':rightObj.top+'px'}">
                  <li  @click="rightLiClick(data1.length-4)" >
                      <p><span>{{data1.length-3}}</span>{{data1[data1.length-4].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[data1.length-4].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[data1.length-4].total,data1[data1.length-4].rate}}</div>
                      </div>
                  </li>
                  <li  @click="rightLiClick(data1.length-3)">
                      <p><span>{{data1.length-2}}</span>{{data1[data1.length-3].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[data1.length-3].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[data1.length-3].total}}</div>
                      </div>
                  </li>
                  <li  @click="rightLiClick(data1.length-2)" >
                      <p><span>{{data1.length-1}}</span>{{data1[data1.length-2].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[data1.length-2].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[data1.length-2].total}}</div>
                      </div>
                  </li>
                  <li  @click="rightLiClick(data1.length-1)">
                      <p><span>{{data1.length}}</span>{{data1[data1.length-1].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[data1.length-1].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[data1.length-1].total}}</div>
                      </div>
                  </li>
                  <!-- s -->
                  <li v-for="(item,index) in data1"  @click="rightLiClick(index)" :key="index+'rigeht'" :class="{'rightActiveLi':rightObj.id==index}">
                      <p><span :class="{'rank1_3':index<3}">{{index+1}}</span>{{item.areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ item.rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{item.total}}</div>
                      </div>
                  </li>
                  <!-- e -->
                   <li  @click="rightLiClick(0)" >
                      <p><span>{{1}}</span>{{data1[0].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[0].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[0].total}}</div>
                      </div>
                  </li>
                  <li  @click="rightLiClick(1)" >
                      <p><span>{{2}}</span>{{data1[1].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[1].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[1].total}}</div>
                      </div>
                  </li>
                  <li  @click="rightLiClick(2)">
                      <p><span>{{3}}</span>{{data1[2].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[2].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[2].total}}</div>
                      </div>
                  </li>
                  <li  @click="rightLiClick(3)">
                      <p><span>{{4}}</span>{{data1[3].areaName}}</p>
                      <div class="clear_a">
                          <div class="progress">
                              <div class="top" :style="{width: `${ data1[3].rate}%`}"></div>
                              <div  class="bott"></div>
                          </div>
                          <div class="num">{{data1[3].total}}</div>
                      </div>
                  </li>
              </ul>
              <div class="activeBg absolute"></div>
          </div>
      </div>
        <div class="radiusGif absolute">
                <div class="box1"></div>
                <div class="box2"></div>
        </div>
        <div class="radiusGifCenter absolute">

        </div>
  </div>
</template>

<script type="module">
import mapEcharts from './map_echarts.vue';
import {getSubjectDistribution,getSubOrdinateEntityDistribution} from 'api/bigData/subjectData'
import {getAreaName} from './china-main-city-map';
  export default {
    components: {
        mapEcharts
    },
    data(){
      return{
          leftActiveIndex:0,
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
                  name:'其他主体',
                  num:0,
                  type:'CFDA'
              },{
                  name:'重点监管对象',
                  num:0,
                  type:'maxTotal'
              }
          ],
          rightTitle:'主体总数',
          areaRatioData:{},
          data1:[
              {
                  areaName:"",
                  total:0,
                  rate:0
              },
              {
                  areaName:"",
                  total:0,
                  rate:0
              },
              {
                  areaName:"",
                  total:0,
                  rate:0
              },{
                  areaName:"",
                  total:0,
                  rate:0
              },{
                  areaName:"",
                  total:0,
                  rate:0
              }
          ],
          rightObj:{
            top:0,
            id:0,
            activeId:4,
            cha:4*90,
          },
          areaName:"四川省",
      }
    },
    mounted(){
        if(this.$store.state.common.user.areaCode.length>=10){
            console.error("当前用户级别不允许访问");
            return;
        }
        this.areaName=getAreaName(this.$store.state.common.user.areaCode)
        this.load("");
    },
    methods:{
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
                this.data[0].num=r.data.total;
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
                        this.data[4].num=element.num;
                    }
                });
           })
           await this.areaRatio(code);
           
        },
        async areaRatio(code){
            await getSubOrdinateEntityDistribution({"areaCode":code}).then((r)=>{
               if (!r.status) {
                    this.$message({
                        message: r.message,
                        type: r.level
                    });
                    return;
                }
                this.areaRatioData=r.data;
               
           });
           await this.leftClick(0,this.data[0])
        },
        switch_(){
            this.$emit("switchFun","mapb")
        },
        leftClick(i,item){
            this.rightObj.top=0;
            this.leftActiveIndex=i;
            this.data1=[];
            this.rightTitle=item.name;
            let testOBJ=[{
                  "areaName":'test地区',
                  "total":180,
                  "rate":30
              },
              {
                  "areaName":'test地区',
                  "total":160,
                  "rate":25
              },
              {
                  "areaName":'test地区',
                  "total":150,
                  "rate":20
              },
              {
                  "areaName":'test地区',
                  "total":100,
                  "rate":15
              }]
            if(item.type=='maxTotal'){
              let arr=[
              {
                  "areaName":'重点对象',
                  "total":this.areaRatioData.maxTotal,
                  "rate":100
              },]
              arr=arr.concat(testOBJ);
              this.data1=arr;
            }else{
                let arr1=this.areaRatioData[item.type];
               
                arr1.forEach(el=>{
                    this.$set(el,"rate", ((el.total/item.num)*100).toFixed(2)*1)
                    // el.rate=((el.total/item.num)*100).toFixed(2)*1;
                });
                arr1=arr1.concat(testOBJ);
                this.data1=arr1;
               
            }
        },
        rightLiClick(i){
            this.rightObj.id=i;
            if(i<this.rightObj.activeId){
                let num=(this.rightObj.activeId-i)*90;
                this.rightObj.top=num-this.rightObj.cha;
            }else if(i>=this.rightObj.activeId){
                let num=(i-this.rightObj.activeId)*90;
                this.rightObj.top=-num-this.rightObj.cha;
            }
        },
        getCode_(code){
             this.load(code);
        }
    }
  }
</script>
<style lang='scss' scoped>
.fooSubMapA{
//   width: 100%;
//   height: 100%;
    overflow: hidden;
    width: calc(100% - 40px);
    height:  calc(100% - 40px);
    left: 20px;
    top: 20px;
//   background: url("~@/assets/img/bigData/subjectData/bigBoxBg.png") no-repeat center;
//   background-size: 100% 100%;
  .title{
        width:400px;
        height:30px;
        font-size:30px;
        color:#0DB5EF;
        text-align: center;
        top: 28px;
        left: calc((100% - 400px) / 2);
        z-index: 5;
  }
  .btn{
      width:112px;
      height:52px;
      line-height: 52px;
      font-size: 16px;
      color: #EEEEEE;
      text-align: center;
      background: url("~@/assets/img/bigData/subjectData/btn_1.png") no-repeat center;
      background-size: 100% 100%;
      &:hover{
          background: url("~@/assets/img/bigData/subjectData/btn_2.png") no-repeat center;
          background-size: 100% 100%;
      }
      z-index: 5;
      left:  calc((100% - 400px) / 2);
      top: 96px;
  }
  .left{
      width: 320px;
      height: 920px;
      top: calc((100% - 920px) / 2);
      left:50px;
      z-index: 5;
      li{
          width: 100%;
          height:120px;
          margin-bottom:40px;
          cursor: pointer;
          background: url("~@/assets/img/bigData/subjectData/tab_default.png") no-repeat center;
          background-size: 100% 100%;
         p{
            font-size:16px;
            color:#eee;
            padding: 26px 0 0px 62px;
         }
         .pB{
            font-size:36px;
            color:rgba(13,181,239,1);
            padding:0 0 0 62px;
         }
      }
      .mbNone{
          margin-bottom: none !important;
      }
      .leftActive{
          background: url("~@/assets/img/bigData/subjectData/tab_selected.png") no-repeat center;
          background-size: 100% 100%;
      }
  }
  .foosubMid{
      width: 100%;
      height: 100%;
      top: 0;
      left:0;
      z-index: 4;
  }
  .right{
      width: 360px;
      height: 910px;
      top: calc((100% - 910px) / 2);
      right:50px;
      z-index:5;
      >p{
        color: #eee;
        line-height: 65px;
        padding-left: 30px;
        width:330px;
        height:76px;
        font-size: 24px;
        background: linear-gradient(90deg,rgba(10,29,47,0.8),rgba(0,22,35,0.8),rgba(0,28,49,0.8));
        // border-bottom: 4px solid #23657E;
        // border-image:-webkit-linear-gradient(90deg,rgba(35,101,126,0.5),rgba(63,145,184,0.5),rgba(36,104,135,0.5));
        // border-image:linear-gradient(90deg,rgba(35,101,126,0.5),rgba(63,145,184,0.5),rgba(36,104,135,0.5));
        box-shadow:2px -13px 5px -7px  rgba(27,96,115,0.8) inset;
        margin-bottom: 20px
      }
      >div{
          height:810px;
          overflow: hidden;
          background:rgba(24,45,82,0.2);
          .activeBg{
            height:90px;
            width:100%;
            background: url("~@/assets/img/bigData/subjectData/roll_selected.png") no-repeat center !important;
            background-size: 100% 100%;
            left: 0;
            top: 360px;
            z-index: 1;
          }
          .rightUlBox{
            z-index: 3;
            transition: top 0.5s;
          }
          .rightUlBox li{
            height:90px;
            width:100%;
            padding-left: 30px;
            cursor: pointer;
            // &:hover{
            //     background: url("~@/assets/img/bigData/subjectData/roll_default.png") no-repeat center;
            //     background-size: 120% 100%;
            // }
            p{
                font-size:18px;
                padding: 21px 0 10px;
                color:rgba(238,238,238,1);
                span{
                    font-size:19px;
                    color:rgba(13,181,239,1);
                    margin-right: 20px;
                }
                .rank1_3{
                    color: #FBE64C;
                }
            }
            div.clear_a{
                .progress{
                   width:260px;
                   height: 8px;
                   position: relative;
                   overflow: hidden;
                    >div{
                        height: 100%;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: url("~@/assets/img/bigData/subjectData/progress1.png") no-repeat center;
                        background-size: 100% 100%;
                    }
                    .top{
                        z-index: 2;
                        background: url("~@/assets/img/bigData/subjectData/progress2.png") no-repeat center;
                        background-size: 100% 100%;
                    }
                }
                .num{
                   width: calc(100% - 260px);
                   text-align: center;
                   line-height: 15px;
                   color:#0DB5EF;
                   font-size: 12px;
                }
            } 
          }
          .rightUlBox .rightActiveLi{
               >p{
                color:#FBE64C;
                span{
                     color:#FBE64C;
                }
                }
                .progress .top{
                    background: url("~@/assets/img/bigData/subjectData/progress3.png") no-repeat center;
                    background-size: 100% 100%;
                }
               .num{
                    color: #E7CE19;
               }
          }
      }
  }
//   .radiusGif{
//       width: 950px;
//       height: 140px;
//       bottom: 40px;
//       left: calc((100% - 950px) / 2);
//     //   background: url("~@/assets/img/bigData/subjectData/radius.png") no-repeat center;
//     //   background-size: 100% 100%;
//   }
  .radiusGif{
        width: 650px;
        height: 650px;
        margin: 0 auto;
        bottom: -178px;
        left: calc((100% - 650px) / 2);
        -webkit-transform: scaleZ(1) rotateX(70deg); 
        -moz-transform: scaleZ(1) rotateX(70deg); 
        -ms-transform: scaleZ(1) rotateX(70deg); 
        -o-transform: scaleZ(1) rotateX(70deg); 
        transform: scaleZ(1) rotateX(70deg);
    }
    .box1{
        background: url("~@/assets/img/bigData/subjectData/circle2.png") no-repeat center;
        background-size: 100% 100%;
        width:500px;
        height: 500px;
        border-radius: 50%;
        position: absolute;
        left: 75.5px;
        top: 0px;
        -webkit-transform: rotate(360deg);
        animation: rotation 50s linear infinite;
        -moz-animation: rotation 50s linear infinite;
        -webkit-animation: rotation 50s linear infinite;
        -o-animation: rotation 50s linear infinite;
    }
    .box2{
        background:url("~@/assets/img/bigData/subjectData/circle3.png") no-repeat center;
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
	.radiusGifCenter{
        background:url("~@/assets/img/bigData/subjectData/circle1.png") no-repeat center;
        background-size: 100% 100%;
        width: 400px;
        height: 142px;

        bottom: 115px;
        left: calc((100% - 400px) / 2);
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

