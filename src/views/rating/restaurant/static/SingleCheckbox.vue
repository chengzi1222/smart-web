<template>
  <div class="single-checkbox">
    <div class="one" style="width: 50px" :class="{'oneActive':oneActive}" @click="handleClick('YES')">是</div>
    <div class="two" style="width: 50px" :class="{'twoActive':twoActive}" @click="handleClick('NO')">否</div>
    <div class="three" style="width: 70px" v-if="absent=='YES'" :class="{'threeActive':threeActive}" @click="handleClick('ABSENT')">合理缺项
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      currentResult: {
        type: String,
        default: function () {
          return ''
        }
      },
      currentTableIndex: {
        type: Number,
        default: function () {
          return -1
        }
      },
      //当前行的数据
      currentRowData: {
        default: function () {
          return {}
        }
      },
      //清除选项
      clearChoose: {
        type: Boolean
      },
      absent: {
        type: String,
        default: function () {
          return 'NO'
        }
      },
    },
    data() {
      return {
        result: '',
      }
    },
    computed: {
      oneActive() {
        return this.result == 'YES' ? true : false;
      },
      twoActive() {
        return this.result == 'NO' ? true : false;
      },
      threeActive() {
        return this.result == 'ABSENT' ? true : false;
      }
    },
    methods: {
      handleClick(val) {
        if (val === this.result) {
          this.result = "NOTSELECT"
        } else {
          this.result = val;
        }
        this.$emit('singlecheckboxchange', {
          result: this.result,
          index: this.currentTableIndex,
          row: this.currentRowData
        });
      }
    },
    watch: {
      currentResult(val) {
        this.result = val;
      }
    },
    mounted() {

    }

  }
</script>

<style lang="scss" scoped>
  .single-checkbox {
    display: inline-block;

    .one,
    .two,
    .three {
      background: #EBEFF2;
      font-size: 14px;
      color: #6D7787;
      width: 70px;
      height: 34px;
      line-height: 34px;
      display: inline-block;
      text-align: center;
      margin: 0 2px;
      cursor: pointer;
    }

    .oneActive {
      background: #0DB5EF;
      color: #fff;
    }

    .twoActive {
      background: #FA503B;
      color: #fff;
    }

    .threeActive {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(13, 181, 239, 1);
      color: #0DB5EF;
    }
  }
</style>