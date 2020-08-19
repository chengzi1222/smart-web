<template>
  <div>
    <div class="titBox" :style="styleObject">
      <p>当前量化等级：{{dataLis.quantificat}}；当前风险等级：{{dataLis.risk}}；</p>
      <p v-if="dataLis.administrative && dataLis.administrative != ''">行政处罚：{{dataLis.administrative}}；刑事案件：{{dataLis.criminal}}；</p>
      <p>动态评级：
        <span v-if="dataLis.grade && dataLis.grade.length > 0">
          <span v-for="(item,index) in dataLis.grade" :key="item.key">{{item.name}}：{{item.count}}，</span>
        </span>
        <span v-else>暂无</span>
      </p>
      <p>巡查：共{{patrol}}次<span v-for="(item,index) in dataLis.result" :key="item.key">，{{item.name}}：{{item.count}}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.addEventListener('mousemove', (event) => {
      let e = event || window.event;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      this.styleObject.left = e.pageX + 10 + 'px' || e.clientX + scrollX + 10 + 'px';
      this.styleObject.top = e.pageY + 10 + 'px' || e.clientY + scrollY + 10 + 'px';
    }, false);
  },
  props: [
    'dataLis',  //传入的数据
  ],
  data() {
    return {
      styleObject: {
        left: '-500px',
        top: '-500px'
      },
      patrol:0
    }
  },
  methods: {
    numChange(){
      this.patrol = 0;
      for(let i=0;i<this.dataLis.result.length;i++){
        this.patrol += this.dataLis.result[i].count*1;
      }
    }
  },
  watch:{
    dataLis(){
      this.numChange();
    }
  }

}
</script>

<style lang="scss" scoped>
  .titBox{
    position: fixed;
    background: #f5f7fa;
    z-index: 999;
    padding: 10px 5px;
  }
</style>

