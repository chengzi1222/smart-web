<template>
    <div class="search-tap" >
        <el-input :placeholder="placeholder" @blur="$emit('validated')"  v-model="searchData" @click.native="handleIconClick" :style="{width:width+'px'}" @keyup.native="handleIconClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>
        <div class="tab-box" :class="{ isScroll : maxIsShowScroll }" v-if="show" @click.stop="show = true">
            <el-checkbox-group v-model="checkboxGroupName" @change="handleChange">
                <el-checkbox-button v-for="item in allItem" :label="item.name" :key="item.id">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
        </div>
        <div style="width: 470px;">
            <el-tag v-for="(tag,i) in checkboxGroup" :key="tag.id" :closable="true" type="primary" @close="closeTag(tag)">
                {{tag.name}}
            </el-tag>
        </div>
    </div>
</template>

<script>
Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

//函数节流优化
let first = true, time = null;

function http(self) {
    time = setTimeout(function() {
        fn(self)
        clearTimeout(time);
        time = null
    }, 600);
}
async function fn(self) {
    self.result = await self.ajax(self.searchData);

    if (self.tag) {
        self.loadChecked();
        self.handleChange();
        self.tag = false
    }
}


export default {
    props: {
        //输入框的placeholder
        placeholder: {
            type: String,
            default: function() {
                return "请输入"
            }
        },
        // 输入框的宽度
        width: {
            type: Number,
            default: function() {
                return 200
            }
        },
        ajax: {
            type: Function,
        },
        //所有选项的list字段名
        listFiled: {
            type: String,
            default:function() {
                return "data"
            }
        },
        //需要展示的文本的字段名
        text: {
            type: String,
            default:function() {
                return "name"
            }
        },
        //已选中的list字段名
        checkedListFiled: {
            type: String,
            default:function() {
                return "checked"
            }
        },
        checkbox:{
          type: Array,
          default:function() {
            return []
          }
        },
        //item太多的时候固定宽高，增加滚动条
        maxIsShowScroll:{
          type: Boolean,
          default:function() {
              return false
          } 
        }
    },
    watch:{
      checkbox(){
        this.checkboxGroup = this.checkbox;
        this.checkboxGroupName = this.translate(this.checkboxGroup);
      }
    },
    mounted() {
//        this.checkboxGroup = this.translate(this.checkbox);
         document.body.addEventListener("click",()=>{
              if (this.show) this.show = false;
         },false);
      this.checkboxGroup = this.checkbox;
      this.checkboxGroupName = this.translate(this.checkboxGroup);
      console.log(this.maxIsShowScroll,"754")
    },
    data() {
        return {
            // 搜索关键字
            searchData: '',
            //未加工的搜索的结果
            result: {},
            //是否是第一次搜索
            tag: true,
            //所有被选中的值。
            allChecked: [],
            //否是展示选项框
            show: false,
            checkboxGroup:[],
            checkboxGroupName:[]
        }
    },
    computed: {
        // 所有的选项
        allItem() {
            if (!this.result[this.listFiled])
              return [];
            let list = this.result[this.listFiled];
            return list;
        },

    },
    methods: {
        async handleIconClick(ev) {
            ev.stopPropagation();
            if (!this.ajax) return
            this.show = true;

            //通过函数节流优化
            if (first) {
                fn(this);
                first = false;
            }
            if (time) return
            http(this)
        },
        //数据加工
        translate(list) {
            let arr = [];
            for (let item of list) {
                arr.push(item[this.text]);
            }
            return arr
        },
        //数据还原格式
        dataRestore(list) {
            let arr = [];
            for (let item of list) {
                for (let d of this.result[this.listFiled]) {
                    if (item === d[this.text]) {
                        arr.push(d);
                        break;
                    }
                }
            }
            return arr
        },
        //把已选中添加到checkboxGroup中监听。
        loadChecked() {
            if (!this.result[this.checkedListFiled]) return []
            let list = this.result[this.checkedListFiled];
//            let newArr = this.translate(list);
            this.checkboxGroup = list;
        },

        //选项发生变化,将选中的数据传出去
        handleChange() {
            for (let i = 0; i < this.allItem.length; i++ ){
              let aitem = this.allItem[i];
              let aname = aitem.name;
              for (let j = 0;j < this.checkboxGroup.length; j++){
                let cgitem = this.checkboxGroup[j];
                let cgname = cgitem.name;
                if (aname == cgname){
                  this.checkboxGroup.splice(j,1);
                  break;
                }
              }
              for (let j = 0; j < this.checkboxGroupName.length;j++){
                let cname = this.checkboxGroupName[j];
                if (aname == cname){
                  this.checkboxGroup.push(aitem);
                  break;
                }
              }
            }

            //传出数据
            this.$emit("searchTapChange", this.checkboxGroup);
            this.$emit('validated')
            // 未选中的值
//            let diffArr = this.allItem.diff(this.checkboxGroup);

//            let checked = this.dataRestore(this.checkboxGroup);
//            this.result[this.checkedListFiled] = checked;
//
//            //将选中的值存入allChecked大容器中
//            for (let item of checked) {
//                let flag = true;
//                for (let i of this.allChecked) {
//                    if (item[this.text] === i[this.text]) {
//                        flag = false;
//                    }
//                }
//                if (flag) {
//                    this.allChecked.push(item);
//                }
//            }
//
//            //将未选中的值从allChecked中剔除
//            for (let i = 0; i < this.allChecked.length; i++) {
//                let item = this.allChecked[i];
//                if (~diffArr.indexOf(item[this.text])) {
//                    this.allChecked.splice(i, 1);
//                }
//            }


        },
        //删除tag
        closeTag(tag) {
//            let val = e.target.parentNode.innerText.trim();
            let index = this.checkboxGroup.indexOf(tag);
            this.checkboxGroup.splice(index, 1);
            index = this.checkboxGroupName.indexOf(tag.name);
            this.checkboxGroupName.splice(index,1);
            this.handleChange();

        }

    }
}




</script>

<style lang="scss" scoped>
.search-tap {
    position: relative;
    .tab-box {
        position: absolute;
        top: 40px;
        left: 0px;
        border: 1px solid #C2CAD2;
        background: #fff;
        padding: 10px;
        z-index: 4;
    }
    .isScroll{
      width: 500px;
      height: 600px;
      overflow: scroll;
    }
    .el-tag {
        border-radius: 0;
        background: #EFF7F9;
        border: 1px solid #C2EAF8;
        padding: 8px 10px;
        line-height: 0px;
        height: 32px;
        margin-left: 0px !important;
        margin: 5px 10px 5px 0;
        color: #33b2df;
    }
    .el-tag+.el-tag {
        margin-left: 10px;
    }
}
</style>


