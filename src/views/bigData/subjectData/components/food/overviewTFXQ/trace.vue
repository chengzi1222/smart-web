<template>
  <div class="box">
    <h3>今日溯源数据</h3>
    <ul class="infoBox" :class="next? 'next':''">
      <li class="one">
        <h3>溯源信息</h3>
        <h2>{{datas[indexs].product}}</h2>
        <p class="status">{{datas[indexs].status}}</p>
        <img src="~assets/img/subjectData/screen2line.png" alt="">
        <div class="titInfo">
          <p class="tit">种养殖/生产环节</p>
          <p class="info">{{datas[indexs].production}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">流通环节</p>
          <p class="info">{{datas[indexs].circulate}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">消费环节</p>
          <p class="info">{{datas[indexs].consumption}}</p>
        </div>
        <div class="detectionInfo">
          <h4>检测信息</h4>
          <p><span>检测人：</span>{{datas[indexs].name}}</p>
          <p><span>抑制率：</span>{{datas[indexs].restrain}}</p>
          <p><span>检测时间：</span>{{datas[indexs].date}}</p>
        </div>
      </li>
      <li class="two">
        <h3>溯源信息</h3>
        <h2>{{datas[indexs+1].product}}</h2>
        <p class="status">{{datas[indexs+1].status}}</p>
        <img src="~assets/img/subjectData/screen2line.png" alt="">
        <div class="titInfo">
          <p class="tit">种养殖/生产环节</p>
          <p class="info">{{datas[indexs+1].production}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">流通环节</p>
          <p class="info">{{datas[indexs+1].circulate}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">消费环节</p>
          <p class="info">{{datas[indexs+1].consumption}}</p>
        </div>
        <div class="detectionInfo">
          <h4>检测信息</h4>
          <p><span>检测人：</span>{{datas[indexs+1].name}}</p>
          <p><span>抑制率：</span>{{datas[indexs+1].restrain}}</p>
          <p><span>检测时间：</span>{{datas[indexs+1].date}}</p>
        </div>
      </li>
      <li class="three">
        <h3>溯源信息</h3>
        <h2>{{datas[indexs+2].product}}</h2>
        <p class="status">{{datas[indexs+2].status}}</p>
        <img src="~assets/img/subjectData/screen2line.png" alt="">
        <div class="titInfo">
          <p class="tit">种养殖/生产环节</p>
          <p class="info">{{datas[indexs+2].production}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">流通环节</p>
          <p class="info">{{datas[indexs+2].circulate}}</p>
        </div>
        <div class="titInfo">
          <p class="tit">消费环节</p>
          <p class="info">{{datas[indexs+2].consumption}}</p>
        </div>
        <div class="detectionInfo">
          <h4>检测信息</h4>
          <p><span>检测人：</span>{{datas[indexs+2].name}}</p>
          <p><span>抑制率：</span>{{datas[indexs+2].restrain}}</p>
          <p><span>检测时间：</span>{{datas[indexs+2].date}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    components: {
      
    },
    data() {
      return {
        items: null,
        next: false,
        datas:[{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-09 06:04',
          product: '香蒜苗',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 张冰冰',
          circulate: '牧马山农副产品有限公司',
          consumption: '天府新区第五小学',
          name: '黎庆',
          restrain: '25.6%',
          date: '2020-06-09 05:14',
          product: '白菜',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 李苗',
          circulate: '涌汇农副产品有限公司',
          consumption: '华阳中学',
          name: '吴成宏',
          restrain: '3.6%',
          date: '2020-06-09 06:54',
          product: '茄子',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '韭菜',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '胡萝卜',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '红萝卜',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '白菜',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '上海青',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '蒜苔',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘三',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '覃继红',
          restrain: '13.6%',
          date: '2020-06-10 06:04',
          product: '西兰花',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 熊欢',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '陆丹',
          restrain: '15.6%',
          date: '2020-06-10 06:24',
          product: '蒜苗',
          status: '合格'
        },{
          production: '成都农产品中心批发市场 刘君',
          circulate: '涌汇农副产品有限公司',
          consumption: '大蓉合拉德方斯店',
          name: '夏宇',
          restrain: '19.6%',
          date: '2020-06-10 06:44',
          product: '莲藕',
          status: '合格'
        },
        // {
        //   production: '成都农产品中心批发市场 刘三',
        //   circulate: '涌汇农副产品有限公司',
        //   consumption: '大蓉合拉德方斯店',
        //   name: '覃继红',
        //   restrain: '13.6%',
        //   date: '2020-06-10 06:04',
        //   product: '土豆',
        //   status: '合格'
        // }
        // ,{
        //   production: '成都农产品中心批发市场 刘三',
        //   circulate: '涌汇农副产品有限公司',
        //   consumption: '大蓉合拉德方斯店',
        //   name: '覃继红',
        //   restrain: '13.6%',
        //   date: '2020-06-10 06:04',
        //   product: '莲花白',
        //   status: '合格'
        // },{
        //   production: '成都农产品中心批发市场 刘三',
        //   circulate: '涌汇农副产品有限公司',
        //   consumption: '大蓉合拉德方斯店',
        //   name: '覃继红',
        //   restrain: '13.6%',
        //   date: '2020-06-10 06:04',
        //   product: '大头菜',
        //   status: '合格'
        // },{
        //   production: '成都农产品中心批发市场 刘三',
        //   circulate: '涌汇农副产品有限公司',
        //   consumption: '大蓉合拉德方斯店',
        //   name: '覃继红',
        //   restrain: '13.6%',
        //   date: '2020-06-10 06:04',
        //   product: '豌豆尖',
        //   status: '合格'
        // },{
        //   production: '成都农产品中心批发市场 刘三',
        //   circulate: '涌汇农副产品有限公司',
        //   consumption: '大蓉合拉德方斯店',
        //   name: '覃继红',
        //   restrain: '13.6%',
        //   date: '2020-06-10 06:04',
        //   product: '莴笋',
        //   status: '合格'
        // },{
        //   production: '成都农产品中心批发市场 刘三',
        //   circulate: '涌汇农副产品有限公司',
        //   consumption: '大蓉合拉德方斯店',
        //   name: '覃继红',
        //   restrain: '13.6%',
        //   date: '2020-06-10 06:04',
        //   product: '话才',
        //   status: '合格'
        // }
        ],
        indexs: 0
      }
    },
    mounted() {
      this.items = setInterval(() => {
        this.next = true;
        setTimeout(() => {
          this.next = false;
          this.indexs++;
          if(this.indexs >= 18){
            this.indexs = 0;
          }
        }, 800);
      }, 10000);
    },
    beforeDestroy() {
    },
    methods: {}
  }
</script>
<style lang='scss' scoped>
  .box{
    background: url('~assets/img/subjectData/screen2bg.png') no-repeat;
    background-size: 100% 100%;
    height: 100%;
    h3{
      font-weight: normal;
      color: #eee;
      font-size: 20*2px;
      padding-top: 10*2px;
      margin-left: calc(17%);
    }
    .infoBox{
      font-weight: 400;
      position: relative;
      margin-top: 30px;
      height: calc(100% - 70px);
      overflow: hidden;
      li{
        position: absolute;
        height: 360*2px;
        background: url('~assets/img/subjectData/cardbg.png') no-repeat;
        background-size: 100% 100%;
        transition: all 0s;
        left: 50%;
        top: 0;
        padding: 20*2px 30*2px;
        box-sizing: border-box;
        h3{
          font-size: 36px;
          color: #eee;
          font-weight: normal;
          margin-left: 10*2px;
          padding-top: 0*2px;
        }
        h2{
          font-size: 24*2px;
          color: #eee;
          font-weight: normal;
          position: absolute;
          right: 30*2px;
          top: 20*2px;
        }
        .status{
          font-size: 24*2px;
          color: #59AC67;
          font-weight: normal;
          position: absolute;
          right: 30*2px;
          bottom: 20*2px;
        }
        img{
          width: 9*2px;
          height: 121*2px;
          position: absolute;
          top: 61*2px;
          left: 20*2px;
        }
        .titInfo{
          margin-top: 16*2px;
          margin-left: 10*2px;
          .tit{
            color: #ddd;
            font-size: 24px;
          }
          .info{
            color: #eee;
            font-size: 14*2px;
            margin-top: 5*2px;
          }
        }
        .detectionInfo{
          position: absolute;
          bottom: 20*2px;
          left: 40*2px;
          color: #eee;
          h4{
            font-size: 36px;
            margin-bottom: 20*2px;
          }
          p{
            font-size: 28px;
            margin-top: 10*2px;
          }
        }
      }
      .one{
        width: 330*2px;
        top: 20*2px;
        margin-left: -165*2px;
        z-index: 1;
      }
      .two{
        width: 280*2px;
        top: 10*2px;
        margin-left: -140*2px;
        opacity: .4;
      }
      .three{
        width: 220*2px;
        top: 0;
        margin-left: -110*2px;
        opacity: .4;
      }
    }
    .next{
      li{
        transition: all .8s !important;
      }
      .one{
        width: 330*2px;
        top: 180*2px;
        margin-left: -165*2px;
        opacity: 0;
      }
      .two{
        width: 330*2px;
        top: 20*2px;
        margin-left: -165*2px;
        opacity: 1;
        z-index: 2;
      }
      .three{
        width: 280*2px;
        top: 10*2px;
        margin-left: -140*2px;
        opacity: .4;
      }
    }
  }
</style>