<template>
    <div class="transfer">
        <div class="left">
            <div class="title">
                <el-checkbox class="mr10" v-model="leftCheckedAll" @change="handleLeftChackedAll()">全选</el-checkbox>{{titleleft}}
            </div>
            <div class="content-body">
                <slot name="search1"></slot>
                <check-block direction='left' @Itemchange='Itemchange' :needEdit='needEditL' @watchSave="watchSave" v-for="(item,index) in left" :key="item[showFlied]+Math.random().toFixed(2)" :currentData="item" :showFlied="showFlied" :childFlid="childFlid">
                </check-block>
            </div>
            <div class="foot">
                <el-checkbox v-model="leftCheckedAll" @change="handleLeftChackedAll()">全选</el-checkbox>
            </div>
        </div>
        <div class="center">
            <el-button class="el-icon-arrow-right toright" type="primary" :disabled="btn_toright" @click="toright"></el-button>
            <el-button class="el-icon-arrow-left toleft" type="primary" :disabled="btn_toleft" @click="toleft"></el-button>
        </div>
        <div class="right">
            <div class="title">
                <el-checkbox class="mr10" v-model="rightCheckedAll" @change="handleRightChackedAll()">全选</el-checkbox>{{titleright}}
            </div>
            <div class="content-body">
                <slot name="search2"></slot>
                <check-block direction='right' @Itemchange='Itemchange' :needEdit='needEditR' @watchSave="watchSave" v-for="(item,index) in right" :key="item[showFlied]+Math.random().toFixed(2)" :currentData="item" :showFlied="showFlied" :childFlid="childFlid">
                </check-block>
            </div>
            <div class="foot">
                   <el-checkbox v-model="rightCheckedAll" @change="handleRightChackedAll()">全选</el-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
import CheckBlock from "./CheckBlock";

//每个数据项添加children，expand，parent,checked字段
function tanslate(data) {
  // 先把原来的keys存起来
  if (this.first) {
    this.keys = Object.keys(data[0]);
    this.first = false;
  }

  //记录之前层级的元素的索引
  let level = {};
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    level[item.level] = i;

    if (item.expand === undefined) {
      this.$set(item, "expand", false);
    }

    if (item.alias === undefined) {
      this.$set(item, "alias", item[this.showFlied]);
    }

    this.$set(item, "checked", false);
    if (item.leaf == "NO") {
      if (!item.children) this.$set(item, "children", []);
    }

    if (item.level !== 1) {
      // if (item.leaf == "NO" && !item.children) item.children = [];
      this.$set(item, "parent", data[level[item.level - 1]]);
      data[level[item.level - 1]].children.push(item);
    }
  }
}

//取两个数组的差集
Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

//获取所有被选中的值
let getChecked = (function() {
  // let arr = [];  //每次点击切换的时候清空掉。暴露一个清空的方法，或者watch，外部数据变化，清空
  function getChecked(data, arrName) {
    if (!data || data.length == 0) return [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        if (this[arrName].indexOf(data[i]) == -1) {
          this[arrName].push(data[i]);
        }
      } else {
        let index = this[arrName].indexOf(data[i]);
        if (index != -1) this[arrName].splice(index, 1);
      }
    }
    return this[arrName];
  }
  return getChecked;
})();

function move(checked, current, target) {
  //追加
  let arr = [];
  for (let item of checked) {
    //把每个选中的元素添加到追加的数组中去
    arr.push(item);
    if (item.leaf === "YES") {
      handleArr(arr, item);
    }
  }
  //添加到目标去 start
  for (let item of arr) {
    let flag = true; //用于判断在目标是否已经有了
    for (let i of target) {
      if (item[this.idFlid] == i[this.idFlid]) flag = false;
    }
    if (flag) {
      let obj = {};
      //新克隆个元素
      deepCopy(obj, item);
      //如果这个元素有父亲的话，就添加到父亲下面，没有的话直接往后追加

      if (obj.parent) {
        let dictItemId = obj.parent[this.idFlid];
        let index = -1;
        for (let j = 0; j < target.length; j++) {
          if (target[j][this.idFlid] == dictItemId) {
            index = j;
            //break;
          }
        }
        if (index != -1) {
          target.splice(index + 1, 0, obj);
        } else {
          target.push(obj);
        }
      } else {
        target.push(obj);
      }
    }
  }
  let obj = {};
  //把最初的原始数据给右边，且重新加工,保留expand
  deepCopyOrign.call(this, obj, target, ["expand", "alias"]);
  this.rightTag = true; //允许重新加工数据
  target = obj;

  //添加到目标去  end

  //删除当前 start
  for (let item of checked) {
    let index = current.indexOf(item);
    current.splice(index, 1);
  }
  let obj2 = {};
  deepCopyOrign.call(this, obj2, current, ["expand", "alias"]);
  this.leftTag = true; //允许重新加工数据
  current = obj2;
  //删除当前 end

  //清空选项
  checked.splice(0, checked.length);

  this.sendData();
}

//处理move中的追加数组
function handleArr(arr, item) {
  if (item.parent) {
    let index = arr.indexOf(item);
    if (arr.indexOf(item.parent) == -1) {
      //如果追加数组中不存在当前元素的父就添加进追加数组并且在该元素之前
      arr.splice(index, 0, item.parent);
    }
    handleArr(arr, item.parent);
  }
}

//只拷贝原始的数据,need需要保留的非原始属性
function deepCopyOrign(obj, item, need = []) {
  for (let key in item) {
    let type = Object.prototype.toString
      .call(item[key])
      .slice(8, -1)
      .toLowerCase();
    let flag =
      this.keys.indexOf(key) != -1 ||
      (need.length != 0 && need.indexOf(key) != -1)
        ? true
        : false; //判断key是否是原始的key
    if (type === "array" && flag) {
      for (let i of item[key]) {
        deepCopy(i);
      }
    } else if (type === "object" && flag) {
      obj[key] = {};
      deepCopy(obj[key], item[key]);
    } else if (flag) {
      obj[key] = item[key];
    }
  }
}

//深拷贝
function deepCopy(obj, item) {
  for (let key in item) {
    let type = Object.prototype.toString
      .call(item[key])
      .slice(8, -1)
      .toLowerCase();
    if (type === "array") {
      for (let i of item[key]) {
        deepCopy(i);
      }
    } else if (type === "object") {
      obj[key] = {};
      deepCopy(obj[key], item[key]);
    } else {
      obj[key] = item[key];
    }
  }
}

export default {
  components: {
    CheckBlock
  },
  props: {
    //左边的title
    titleleft: {
      type: String,
      default: function() {
        return "";
      }
    },
    //右边的title
    titleright: {
      type: String,
      default: function() {
        return "";
      }
    },
    //穿梭框左边的数据
    transferData_left: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //穿梭框右边的数据
    transferData_right: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //穿梭框需要显示的字段
    showFlied: {
      type: String,
      default: function() {
        return "text";
      }
    },
    //子字段的名字
    childFlid: {
      type: String,
      default: function() {
        return "children";
      }
    },
    //id字段的名字
    idFlid: {
      type: String,
      default: function() {
        return "id";
      }
    }
  },
  data() {
    return {
      needEditL: false,
      needEditR: true,
      first: true,
      leftTag: true,
      rightTag: true,
      keys: [],
      arrLeft: [],
      arrRight: [],
      leftCheckedAll: false,
      rightCheckedAll: false
    };
  },
  updated(){
    this.sendData()
  },
  computed: {
    //向右的按钮状态
    btn_toright() {
      return this.leftChecked.length > 0 ? false : true;
    },
    //向左的按钮状态
    btn_toleft() {
      return this.rightChecked.length > 0 ? false : true;
    },
    // 被处理过的左边数据
    left() {
      if (this.transferData_left.length == 0) return [];
      if (this.leftTag) tanslate.call(this, this.transferData_left);
      this.leftTag = false;
      return this.transferData_left;
    },
    //被处理后的右边数据
    right() {
      if (this.transferData_right.length == 0) return [];

      tanslate.call(this, this.transferData_right);
      this.rightTag = false;
      return this.transferData_right;
    },
    // 左边选中的项
    leftChecked() {
      return getChecked.call(this, this.transferData_left, "arrLeft");
    },
    //右边选中的项
    rightChecked() {
      return getChecked.call(this, this.transferData_right, "arrRight");
    }
  },
  methods: {
    //当下级组件改变时，查看是否是全选状态
    Itemchange(direction) {
      if (direction === "left") {
        let isLeftCheckedAll = this.left.every(item => {
          return item.checked;
        });
        this.leftCheckedAll = isLeftCheckedAll;
      }

      if (direction === "right") {
        let isRightCheckedAll = this.right.every(item => {
          return item.checked;
        });
        this.rightCheckedAll = isRightCheckedAll;
      }
    },
    //左边的全选按钮
    handleLeftChackedAll() {
      for (let item of this.left) {
        item.checked = this.leftCheckedAll;
      }
    },
    //右边的全选按钮
    handleRightChackedAll() {
      for (let item of this.right) {
        item.checked = this.rightCheckedAll;
      }
    },
    //点击向右的按钮
    toright() {
      let checked = this.leftChecked;
      let left = this.transferData_left;
      let right = this.transferData_right;
      move.call(this, checked, left, right);
      this.leftCheckedAll = false;
    },
    //点击向左的按钮
    toleft() {
      let checked = this.rightChecked;
      let left = this.transferData_left;
      let right = this.transferData_right;
      move.call(this, checked, right, left);
      this.rightCheckedAll = false;
    },
    //外部监听数据
    sendData() {
      let obj = {};
      obj.left = [];
      obj.right = [];

      for (let i of this.transferData_left) {
        let o = {};
        deepCopyOrign.call(this, o, i);
        obj.left.push(o);
      }
      for (let j of this.transferData_right) {
        let o = {};
        deepCopyOrign.call(this, o, j, ["alias"]);
        obj.right.push(o);
      }
      this.$emit("getTransferEditData", obj);
    },
    watchSave() {
      this.sendData();
    },
    //重置
    reset() {
      this.first = true;
      this.leftTag = true;
      this.rightTag = true;
      this.keys = [];
      this.arrLeft = [];
      this.arrRight = [];
    }
  },
  watch: {
    transferData_left() {
      this.reset();
    }
  }
};
</script>

<style scoped lang="sass">
.transfer {
  width: 850px;
  margin: 0 auto;
}

.transfer:after {
  content: "";
  clear: both;
  height: 0;
  overflow: hidden;
  display: block;
}

.left,
.center,
.right {
  float: left;
  box-sizing: border-box;
}

.left,
.right {
  width: 350px;
  height: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #d1dbe5;
}

.center .toright,
.center .toleft {
  width: 45px;
  border-radius: 4px;
  margin: 5px 20px;
  display: block;
}

.transfer .center {
  margin-top: 150px;
}

.transfer .title {
  height: 36px;
  line-height: 36px;
  background: #fbfdff;
  padding-left: 20px;
  border-bottom: 1px solid #d1dbe5;
}

.transfer .content-body {
  height: 328px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px 20px;
}

.transfer .foot {
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
  border-top: 1px solid #d1dbe5;
}
</style>
