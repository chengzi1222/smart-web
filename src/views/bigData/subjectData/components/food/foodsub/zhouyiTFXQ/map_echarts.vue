<template>
<div class="map relative">
    <div class="nameBox movePoin">
      <span  @click="areaArrFun(areaArr[0])">{{areaArr[0]}}</span>
      <span v-if="areaArr[1]"  @click="areaArrFun(areaArr[1])"> >> {{areaArr[1]}}</span>
      <span  v-if="areaArr[2]"  @click="areaArrFun(areaArr[2])"> >> {{areaArr[2]}}</span>
    </div>
    <div  id="foosubMid" >
    </div>
</div>
</template>

<script type="module">
import axios from 'axios';
import echarts from 'echarts';

import {cityMapCode,chengduCode} from '../china-main-city-map';
import {chengdu_area_code} from '../510100';
import {tonghua_area_code} from '../220500';
  export default {
    components: {

    },
    data(){
      return{
        areaArr:[],
        chart:null,
        option:null,
        areaCode:null,
        isarea:false,
        http:'https://stg-res.ybveg.com/backup/area/citys/'
      }
    },
    mounted(){
        this.areaCode=this.$store.state.common.user.areaCode;
        let areaName;
        if(this.areaCode != '220581'){//针对梅河口
            for(let i in cityMapCode){
                if(cityMapCode[i]==this.areaCode||cityMapCode[i]==this.areaCode+'00'){
                    areaName=i;
                    break;
                }
            }
            
            for(let i in chengduCode){
                if(chengduCode[i]==this.areaCode){
                    areaName=i;
                    this.isarea=true;
                    break;
                }
            } 
        }else{
            areaName='梅河口市';
            this.isarea=true;
        }
       
        this.init('foosubMid',cityMapCode,areaName,this.isarea);
    },
    methods:{
        areaArrFun(name){
          if(!name){
            console.error('点击城市未得到');
            return false;
          }
          let num = this.areaArr.indexOf(name);
          this.isarea=false;
          this.resetOption(this.chart,this.option, name,this.opt);
          this.areaArr.splice(num+1);
        },
        registerMap(name,response){
          echarts.registerMap(name, response);
        },
        resetOption(i,o,n,opt){
            o.geo.map = n;
            o.geo.zoom = 0.4;
            i.clear();
            i.setOption(o);
            this.zoomAnimation();
            opt.callback(n, o, i);
        },
        createBreadcrumb(name, opt, instance){
          this.areaArr.push(name);
            for(let i in cityMapCode){
                if(i==name){
                    this.$emit("getCode",cityMapCode[i])
                    break;
                }
            }
            
            for(let i in chengduCode){
                if(i==name){
                    this.$emit("getCode",chengduCode[i])
                    break;
                }
            }
        },
        zoomAnimation(){
            var count = null;
            var zoom = (per)=>{
                if (!count) count = per;
                count = count + per;
                // console.log(per,count);
                this.chart.setOption({
                    geo: {
                        zoom: count
                    }
                });
                if (count < 0.6) window.requestAnimationFrame(function() {
                    zoom(0.2);
                });
            };
            window.requestAnimationFrame(function() {
                zoom(0.2);
            });
        },
        init(id,cityMapCode,initcity,isarea){
          
          let this_=this;
          this.areaArr.push(initcity)
  
         
          echarts.extendsMap = function(id, opt) {
            // 实例
            this_.chart = this.init(document.getElementById(id));
          
            var defaultOpt = {
                mapName: 'china', // 地图展示
                goDown: true, // 是否下钻
                bgColor: '#404a59', // 画布背景色
                activeArea: [], // 区域高亮,同echarts配置项
                data: [],
                // 下钻回调(点击的地图名、实例对象option、实例对象)
                callback: function(name, option, instance) {
                }
            };
            if (opt) opt = this.util.extend(defaultOpt, opt);
            // 层级索引
            this_.option = {
                backgroundColor: opt.bgColor,
                geo: {
                    map: opt.mapName,
                    roam: true,
                    zoom: 0.6,
                    top:"-5%",
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize:32,
                                color: '#fff',
                                fontWeight: 400
                            }
                        },
                        emphasis: {
                            textStyle: {
                                fontSize:32,
                                color: '#fff'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#37b4dd',
                            borderWidth: 1,
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: '#00294b' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#011c34' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: '#22a5db',
                            shadowOffsetX: -4,
                            shadowOffsetY: 4,
                            shadowBlur: 20
                        },
                        emphasis: {
                            areaColor: '#0db5ef',
                            borderWidth: 0
                        }
                    },
                    regions: opt.activeArea.map(function(item) {
                        if (typeof item !== 'string') {
                            return {
                                name: item.name,
                                itemStyle: {
                                    normal: {
                                        areaColor: item.areaColor || '#389BB7'
                                    }
                                },
                                label: {
                                    normal: {
                                        show: item.showLabel,
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        } else {
                            return {
                                name: item,
                                itemStyle: {
                                    normal: {
                                        borderColor: '#91e6ff',
                                        areaColor: '#389BB7'
                                    }
                                }
                            }
                        }
                    })
                },

                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    showEffectOn: 'render',
                    rippleEffect: {
                        period:15,
                        scale: 4,
                        brushType: 'fill'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#FFC848',
                            shadowBlur: 20,
                            shadowColor: '#333'
                        }
                    },
                    data:[]
                }]
            };

            this_.chart.setOption(this_.option);
            // 添加事件
            this_.chart.on('click', function(params) {
                var _self = this;
                if (opt.goDown && params.name) {
                        if (cityMapCode[params.name]){
                              var code = cityMapCode[params.name];
                              axios.get(this.http+code+".json").then(function(res){
                                this_.isarea=false;
                                let response=res.data;
                              this_.registerMap(params.name, response);
                              this_.resetOption(_self,this_.option, params.name,opt);
                          });
                        }else{
                            if(this_.isarea){return}
                            let city_=chengdu_area_code.features;
                            for(let i in city_){
                                if(city_[i].properties.name==params.name){
                                    let obj={};
                                        obj={
                                        "type": "FeatureCollection",
                                        "features": []
                                        }
                                        this_.isarea=true;
                                        obj.features.push(city_[i]);
                                        this_.registerMap(params.name, obj);
                                        this_.resetOption(_self,this_.option, params.name,opt);
                                        break;
                                }
                            }
                        }
                }
            });

            this_.chart.setMap = function(mapName) {
                var _self = this;
                if (mapName.indexOf('市') < 0) mapName = mapName + '市';
                var citySource = cityMapCode[mapName];
                if (citySource) {
                    var url = this.http+citySource+".json";
                    axios.get(url).then(function(res){
                        this_.isarea=false;
                        let response=res.data;
                        this_.registerMap(mapName, response);
                        this_.resetOption(_self,this_.option, mapName,opt);
                    });
                }else{
                    if(this_.isarea){return}
                        let city_=chengdu_area_code.features;
                        for(let i in city_){
                            if(city_[i].properties.name==params.name){
                                let obj={};
                                    obj={
                                    "type": "FeatureCollection",
                                    "features": []
                                    }
                                    this_.isarea=true;
                                    obj.features.push(city_[i]);
                                    this_.registerMap(params.name, obj);
                                    this_.resetOption(_self,this_.option, params.name,opt);
                                    break;
                            }
                        }
                }
                
            };

            window.addEventListener('resize', function () {
              this_.chart.resize();
            }, false)
            return this_.chart;
          };
        if(this_.isarea){
              let city_= this_.areaCode=="220581"?tonghua_area_code.features:chengdu_area_code.features;
              this_.opt={
                  bgColor: 'transparent', // 画布背景色
                  mapName: initcity, // 地图名
                  goDown: true, // 是否下钻
                  // 下钻回调
                  callback: function(name, option, instance) {
                     this_.createBreadcrumb(name, option, instance)
                  },
                  // 数据展示            	
                  data: []
              }
                for(let i in city_){
                    if(city_[i].properties.name==initcity){
                        let obj={};
                            obj={
                            "type": "FeatureCollection",
                            "features": []
                            }
                            obj.features.push(city_[i]);
                            this_.registerMap(initcity, obj);
                            break;
                    }
                }

              var myChart = echarts.extendsMap(id, this_.opt);
          }else{
                axios.get(this.http+cityMapCode[initcity]+".json").then(function(response){
                    let geoJson=response.data;
                    this_.registerMap(initcity, geoJson);
                    this_.opt={
                        bgColor: 'transparent', // 画布背景色
                        mapName: initcity, // 地图名
                        goDown: true, // 是否下钻
                        // 下钻回调
                        callback: function(name, option, instance) {
                            this_.createBreadcrumb(name, option, instance)
                        },
                        // 数据展示            	
                        data: []
                    }
                    var myChart = echarts.extendsMap(id, this_.opt);
                });
          }
        },
    },
    computed: {

    },
  }
</script>
<style lang='scss' scoped>
  #foosubMid{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0
  }
  .map{
     width: 100%;
     height: 100%;
    .nameBox{
      height: 40*2px;
      line-height: 40*2px;
      min-width: 40*2px;
      padding: 0 30*2px;
      background: url("~@/assets/img/bigData/subjectData/areaboxbg.png") no-repeat center;
      background-size: 100% 100%;
      font-size:16*2px;
      color:rgba(221,221,221,1);
      position: absolute;
      top: 30*2px;
      // left: 159*2px;
      left: 29*2px;
      z-index: 2;
    }
  }
</style>

