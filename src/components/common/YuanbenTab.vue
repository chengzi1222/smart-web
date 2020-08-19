<template>
  <ul class="tab-box">
    <li class="tabLi" :style="{width:width}" v-for="item in tabs" :key="item[value]" :class="{'li-bott': currentTab==item[value]}" @click="choose(item[value])">
      <div>
        <span :class="{'li-span': currentTab==item[value]}">{{item[label]}}</span>
        <span>{{ item[num] }}</span>
      </div>
    </li>
    <li class="tab-bott"></li>
  </ul>
</template>

<script>
export default {
  props: {
    tabs: Array,
    label: {
      type: String,
      default: "label"
    },
    value: {
      type: String,
      default: "value"
    },
    num: {
      type: String,
      default: "num"
    },
    tab: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "160px"
    }
  },
  data() {
    return {
      currentTab: ""
    }
  },
  mounted() {
    this.currentTab = this.tab;
  },
  methods: {
    choose(tab) {
      // this.currentTab = this.tab;
      this.$emit("tab-change", tab)
    }
  },
  watch: {
    tab() {
      this.currentTab = this.tab;
    }
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
  color: #9a9a9a;
  text-align: center;
}
.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}
.tab-box .li-span {
  color: #393939;
}
.tab-box span:first-child {
  margin-right: 10px;
}
</style>
