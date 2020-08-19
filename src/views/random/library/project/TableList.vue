<template>
  <div class="bigbox">
      <div class="page-tilt">
          <b></b><span>一单两库</span>
      </div>
      <ul class="tab-box">
          <li class="tabLi" v-for="(item,index) in patternLis" :key="index" :data-index="index"
              :class="index==mess.choose?'li-bott':''" @click="choose(index,item.type)">
              <div :data-index='index'><span :class="index==mess.choose?'li-span':''">{{item.name}}</span><span>{{item.num}}</span></div>
          </li>
          <li class="tab-bott"></li>
      </ul>
      <RandomInventory v-if="mess.choose == 0"></RandomInventory>
      <SubjectDirectories v-if="mess.choose == 2"></SubjectDirectories>
  </div>
</template>

<script>
import RandomInventory from "./RandomInventory";
import SubjectDirectories from "../subject/SubjectDirectories";
export default {
  methods: {
      //切换导航样式
      choose(index,type) {
          this.mess.choose = index;
      }
  },
  mounted() {

  },
  computed:{

  },
  data() {
      return {
          patternLis:[{
              name:'随机抽查事项清单'
          },{
              name:'执法检查人员名录库'
          },{
              name:'主体名录库不合格批次'
          }],
          mess:{
              choose:0
          }
      };
  },
  components: {
    RandomInventory,
    SubjectDirectories
  }
}
</script>

<style scoped lang="sass">
  .tab-box {
      width: 100%;
      display: flex;
      position: relative;
      margin-bottom: 20px;
  }
  .tab-box .tabLi {
      width: 165px;
      height: 50px;
      line-height: 50px;
      margin-right: 30px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #9A9A9A;
      text-align: center;
  }
  .tab-box .li-bott {
      border-bottom: 2px solid #0DB5EF;
      z-index: 666;
      position: relative;
  }
  .tab-box .li-span{
      color: #393939;
  }
  .tab-box span:first-child{
      margin-right: 10px;
  }
</style>
