<template>
  <div>
    <div class="titBox" :style="styleObject">
      <p>当前风险分级：{{patrolRecordData.quantifyLevel}}</p>
      <p>动态评级：
        <span v-for="(item,index) in patrolRecordData.countDynamicRating" :key="index">
          {{index}}：{{item}}；
        </span>
      </p>
      <p>巡查：
        <span v-for="(item,index) in patrolRecordData.countPatrolResult" :key="index">
          {{index}}：{{item}}；
        </span>
      </p>
    </div>
  </div>
</template>


<script>
  export default {
    mounted() {
      document.body.addEventListener("mousemove", (event) => {
        let e = event || window.event,
          scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
          scrollY = document.documentElement.scrollTop || document.body.scrollTop;

        this.styleObject.left = e.pageX + 10 + "px" || e.clientX + scrollX + 10 + "px";
        this.styleObject.top = e.pageY + 10 + "px" || e.clientY + scrollY + 10 + "px";
      }, false);
    },

    props: {
      "patrolRecordData": {
        "quantifyLevel": "",
        "countDynamicRating": [],
        "countPatrolResult": []
      }
    },

    data() {
      return {
        styleObject: {
          left: "-500px",
          top: "-500px"
        }
        // patrol: 0
      };
    },

    methods: {
      // numChange() {
      //   this.patrol = 0;
      //   for (let i = 0; i < this.dataLis.result.length; i++) {
      //     this.patrol += this.dataLis.result[i].number;
      //   }
      // }
    },

    watch: {
      // dataLis() {
      //   this.numChange();
      // }
    }
  };
</script>

<style lang="scss" scoped>
  .titBox {
    position: fixed;
    background: #f5f7fa;
    z-index: 999;
    padding: 10px 5px;
  }
</style>

