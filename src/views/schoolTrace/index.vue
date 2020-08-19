<template>
  <div class="wrap_ipadBg" v-loading="loading" element-loading-text="拼命加载中">
    <div class="homeTop clear_a">
      <div class="left">{{h5Title}}</div>
      <div class="time">{{time}}</div>
    </div>
    <el-row>
      <el-col :span="5">
        <!--学校信息-->
        <div class="nav">
          <div class="navHeader">
            <img :src="pageData.fileUrl"  v-if="pageData.fileUrl !== ''">
            <img src="../../assets/img/schoolTrace/school.png" v-if="pageData.fileUrl === ''">
            <p class="schoolName">{{pageData.entityName}}</p>
            <p class="principal">法人/负责人: {{pageData.legalPerson}}</p>
          </div>
 
          <!--导航-->
          <div class="nav_content">
            <div class="single_nav" @click="goDetail(item.key)" v-for="(item) in nav" :key="item.key" v-if="item.show === true">
              <img :src="item.activeImg" v-if="index == item.key">
              <img :src="item.img" v-else> 
              <p :class="index === item.key? 'active' : ''">{{isSchool === true&& item.alias?item.alias:item.name}}</p>
            </div>
          </div>

          <!--底部信息-->
          <div class="footer">
            <div class="footer_box">
              <div class="imgBox rectangle">
                <img src="../../assets/img/schoolTrace/ybLogo.png">
                <p>源本生鲜</p>
              </div>
              <div class="imgBox square">
                <img src="../../assets/img/schoolTrace/xc_mini_app.jpg">
                <p>小程序二维码</p>
              </div>
              <div class="imgBox rectangle">
                <div class="box">
                  <p>联系电话:</p>
                  <p>400-028-3272</p>
                  <p>13688176712</p>
                </div>
                <p>商务合作</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="content">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from "../../api/schoolTrace/home";
import config from "../../utils/config";
import { setCookie,getCookie, getData} from "../../utils/sessionStorage";
export default {
  data() {
    return {
      willDestroy: false,
      timer: [],
      time: "",
      pageData: {
        schoolName: "成都七中",
        principal: "张老师",
        imgData: ""
      },
      index: "video",
      loading: true,
      schoolTraceBaseUrl: "",
      entityId: "",
      XCWSOpenSecret:'',
      isSchool:'',
      nav:[
        {
          name:'证照公示',
          key:'license',
          img:require('../../assets/img/schoolTrace/license.png'),
          activeImg:require('../../assets/img/schoolTrace/license_selected.png'),
          show:true,
          moduleString:''
        },
        {
          name:'后厨直播',
          key:'video',
          img:require('../../assets/img/schoolTrace/video.png'),
          activeImg:require('../../assets/img/schoolTrace/video_selected.png'),
          show:false,
          moduleString:'after_cooking'
        },
        {
          name:'每日菜谱',
          key:'menu',
          img:require('../../assets/img/schoolTrace/menu.png'),
          activeImg:require('../../assets/img/schoolTrace/menu_selected.png'),
          show:false,
          moduleString:'everyday_menu'
        },
        {
          name:'食材溯源',
          key:'trace',
          img:require('../../assets/img/schoolTrace/trace.png'),
          activeImg:require('../../assets/img/schoolTrace/trace_selected.png'),
          show:false,
          moduleString:'traceability_of_ingredients'
        },
        {
          name:'晨检公示',
          key:'inspected',
          img:require('../../assets/img/schoolTrace/inspect.png'),
          activeImg:require('../../assets/img/schoolTrace/inspect_selected.png'),
          show:false,
          moduleString:'morning_inspection'
        },
        {
          name:'食堂陪餐',
          alias:'就餐情况',
          key:'accompany',
          img:require('../../assets/img/schoolTrace/accompany.png'),
          activeImg:require('../../assets/img/schoolTrace/accompany_selected.png'),
          show:false,
          moduleString:'principal_accompanying_meal'
        },
        {
          name:'清洗消毒',
          key:'clean',
          img:require('../../assets/img/schoolTrace/accompany.png'),
          activeImg:require('../../assets/img/schoolTrace/accompany_selected.png'),
          show:false,
          moduleString:'cleaning_and_disinfection'
        },
        {
          name:'食品留样',
          key:'reserved',
          img:require('../../assets/img/schoolTrace/reserved.png'),
          activeImg:require('../../assets/img/schoolTrace/reserved_selected.png'),
          show:false,
          moduleString:'food_sample'
        },
        {
          name:'餐厨垃圾',
          key:'trash',
          img:require('../../assets/img/schoolTrace/trash.png'),
          activeImg:require('../../assets/img/schoolTrace/trash_selected.png'),
          show:false,
          moduleString:'kitchen_waste'
        },
        {
          name:'培训记录',
          key:'training',
          img:require('../../assets/img/schoolTrace/training.png'),
          activeImg:require('../../assets/img/schoolTrace/training_selected.png'),
          show:false,
          moduleString:'training_record'
        },
        {
          name:'进货查验',
          key:'warehouse',
          img:require('../../assets/img/schoolTrace/warehouse.png'),
          activeImg:require('../../assets/img/schoolTrace/warehouse_selected.png'),
          show:false,
          moduleString:'buyer_stockin'
        },
        {
          name:'出库登记',
          key:'delivery',
          img:require('../../assets/img/schoolTrace/delivery.png'),
          activeImg:require('../../assets/img/schoolTrace/delivery_selected.png'),
          show:false,
          moduleString:'outbound_registration'
        },
        {
          name:'添加剂记录',
          key:'additive',
          img:require('../../assets/img/schoolTrace/delivery.png'),
          activeImg:require('../../assets/img/schoolTrace/delivery_selected.png'),
          show:false,
          moduleString:'additive_use'
        },
        {
          name:'规章制度',
          key:'rule',
          img:require('../../assets/img/schoolTrace/rule.png'),
          activeImg:require('../../assets/img/schoolTrace/rule_selected.png'),
          show:false,
          moduleString:'regulation'
        }
      ]
    };
  },
  methods: {
    timeShow() {
      let mydate = new Date();
      let str = "" + mydate.getFullYear() + "年";
      let M = mydate.getMonth() + 1;
      if (M < 10) {
        M = "0" + M;
      }
      str += M + "月";
      let D = mydate.getDate();
      if (D < 10) {
        D = "0" + D;
      }
      str += D + "日";
      let h = mydate.getHours();
      if (h < 10) {
        h = "0" + h;
      }
      str += " " + h + " : ";
      let s = mydate.getMinutes();
      if (s < 10) {
        s = "0" + s;
      }
      str += s;
      this.time = str;
    },
    setInterval_time() {
      this.$nextTick(() => {
        if (this.willDestroy) return;
        var t = setInterval(() => {
          this.timeShow();
        }, 1000);
        this.timer.push(t);
      });
    },
    goDetail(page) {
      this.index = page;
      if (page == "trace") {
        this.$router.push({
          path: "/schoolTrace/" + page,
          query: {
            entityId: this.entityId,
            deptCode: this.pageData.deptCode
          }
        });
      } else {
        this.$router.push({
          path: "/schoolTrace/" + page,
          query: {
            entityId: this.entityId
          }
        });
      }
    },
    async getInfo() {
      this.loading = true;
      let result = await api.getInfo({
        entityId: this.entityId
      });
      if (result.code == 200) {
        this.loading = false;
        this.pageData = result.data;
      }
    },
    getRoute() {
      this.index = this.$route.path.substring(13);
    },
    async getModule(){
      let result = await api.getSettingModule({
        entityId:this.entityId
      })
      if(result.code === 200){
        let data = result.data.filter(item =>{
          return item.groupString === 'function_module' || (item.groupString === 'public_module'&&item.moduleString === 'traceability_of_ingredients') || (item.groupString === 'public_module'&&item.moduleString === 'after_cooking' )
        })
        this.nav.map(item =>{
          item.show = false
          item.moduleString === ''? item.show = true:'';
          data.map(moduleItem =>{
            item.moduleString === moduleItem.moduleString ? item.show = true:''
          })
        })
      }
    }
  },
  async created() {
    // 从学校汇总过来或者大数据局
    if (this.$route.query.XCWSOpenSecret) {
      this.XCWSOpenSecret = this.$route.query.XCWSOpenSecret;
      setCookie("XCWSOpenSecret", this.XCWSOpenSecret);
    }
  },
  beforeDestroy() {
    this.willDestroy = true;
    this.timer.forEach(item => {
      clearInterval(item);
      item = null;
    });
  },
  mounted() {
    this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
    this.entityId=this.$route.query.entityId;
    this.isSchool = getData('isSchool')
    this.getModule()
    this.setInterval_time();
    this.getInfo();
    this.getRoute();
  },
  watch:{
    $route(to,from){
      this.index = to.name
    }
  },
  computed: {
    h5Title() {
      return this.$store.getters.h5Title
    },
  }
};
</script>
<style lang='scss' scoped>
.wrap_ipadBg {
  width: 1792px;
  height: 1008px;
  position: relative;
  left: 64px;
  top: 36px;
  background-color: #f5f5f5;
  .homeTop {
    width: calc(100% - 70px);
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    padding: 0 30px 0 40px;
    .left {
      width: 90%;
      height: 60px;
      font-size: 20px;
      color: rgba(51, 51, 51, 1);
    }
    .time {
      height: 60px;
      color: #999999;
      font-size: 14px;
    }
  }
  .nav {
    .navHeader {
      height: 235px;
      width: 100%;
      background: url("../../assets/img/schoolTrace/bg.png");
      background-size: cover;
      text-align: center;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-top: 30px;
      }
      .schoolName {
        color: #ffffff;
        font-size: 24px;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis; //实现超过两行就自动隐藏显示省略号
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        width: 370px;
        font-weight: 500;
      }
      .principal {
        color: #ffffff;
        font-size: 16px;
        margin: 10px 0;
        font-weight: 400;
      }
    }
    .nav_content {
      height: 590px;
      width: 100%;
      background: #ffffff;
      overflow: scroll;
      .single_nav {
        text-align: center;
        display: inline-block;
        width: 90px;
        height: 90px;
        margin-left: 7%;
        margin-top: 30px;
        img {
          width: 90px;
          height: 90px;
        }
        p {
          font-size: 16px;
          color: #666666;
        }
        .active {
          font-size: 16px;
          color: #34c5d7;
        }
      }
    }
    .footer {
      padding: 3% 0;
      width: 100%;
      .footer_box {
        width: 380px;
        margin: 0 auto;
        .imgBox {
          display: inline-block;
          text-align: center;
          p {
            color: #666666;
            font-size: 12px;
            margin-top: 5px;
          }
        }
        .rectangle {
          height: 80px;
          img {
            width: 100px;
            height: 80px;
          }
          .box {
            width: 100%;
            height: 100%;
            padding: 13px;
            background: #ffffff;
            box-sizing: border-box;
            p {
              font-size: 12px;
              color: #999999;
              margin-top: 0;
            }
          }
        }
        .square {
          margin: 0 9.5%;
          img {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
  }
}
</style>

