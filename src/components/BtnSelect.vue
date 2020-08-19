<template>
  <div>
    <div class="btn-select" v-for="item in data" :key="item.name">
        <div>
            <span class="btn" style="cursor: pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;"
                  :class="item.active?'active':''"
                  @click.stop="btnClick(item)">{{item.name}}</span>
            <span v-if="item.hasChildren" style="margin-left:30px;float:right;display: inline-block;text-align: left;width: 120px;">{{item.cname}}</span>
        </div>
        <ul class="list" v-if="item.hasChildren && item.listShow">
            <li class="selectItem" v-for="item2 in item.children" :key="item2.name" @click="itemClick(item,item2)">
                {{item2.name}}
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
// import ElInput from "../../node_modules/element-ui/packages/input/src/input";

export default {
  // components: { ElInput },
  mounted() {
    document.body.addEventListener('click', () => {
      this.cancelChange();
    }, false);
  },
  props: [
    'data',
    'itemData',  //传入的数据
    'childField',   //子数据的字段
    'showFiled',     //需要显示出来的数据的字段
    'model'],  //数据对应模型
  data() {
    return {
      change: false
    }
  },
  computed: {
    //子数据
    childrenData() {
      if (this.hasChildren) {
        return this.itemData[this.childField]
      }
      return []
    },
    //最终返回的数据
    lastData() {
      let obj = {};
      obj.checked = this.active;
      obj.data = this.itemData;
      return obj
    }
  },
  methods: {
    reset(){
            for(let item of this.data){
              item.active = false;
              item.hasChildren = false;
            }
    },
    cancelChange() {
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i];
        item.listShow = false;
        if (!item.cname && item.cname == '') {
          item.active = false;
        }
      }
    },

    btnClick(item) {
      this.cancelChange();

      for (let i = 0; i < this.data.length; i++) {
        let item2 = this.data[i];
        if (item != item2) {
          item2.listShow = false;
        }
      }

      item.active = !item.active;
      item.listShow = item.active;
      if (!item.active) {
        item.cname = '';
        item.ccode = '';
      }
      if (item.active && !item.hasChildren) {
        item.cname = item.name;
        item.ccode = item.code;
      }
      //         if (!item.hasChildren){
      //
      //         }
      this.change = !this.change;
    },
    itemClick(item, item2) {
      item.listShow = false;
      item.cname = item2.name;
      item.ccode = item2.code;
      this.change = !this.change;
    }
  },
  watch: {
    change(val) {
      this.$emit("changeData", this.data)
    }
  },

}
</script>

<style lang="scss" scoped>
.btn-select {
  height: 39px;
  margin-bottom: 10px;
  position: relative;
  .btn {
    padding: 11px 19px;
    font-size: 16px;
    color: #6d7787;
    text-align: center;
    background: #ebeff2;
    cursor: default;
    &:hover {
      color: #20a0ff;
    }
  }
  .active {
    background: #0db5ef;
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
  .selectItem {
    font-size: 14px;
    padding: 8px 30px 8px 10px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #48576a;
    height: 36px;
    line-height: 1.5;
    box-sizing: border-box;
    cursor: pointer;
    width: 160px;
    &:hover {
      background: #e4e8f1;
    }
  }
  .list {
    position: absolute;
    padding: 6px 0;
    top: 40px;
    left: 0px;
    border: 1px solid #cbcbcb;
    height: 204px;
    box-sizing: border-box;
    overflow-y: auto;
    z-index: 3;
    background: #fff;
  }
}
</style>

