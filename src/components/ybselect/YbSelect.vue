<template>
    <div class="yb-select">
        <div class="select-input" @click.stop="show = !show">
            <i class="el-icon-caret-bottom icon-btn" ></i>
            <el-tag
                v-if="item.level != 1"
                v-for="(item,index) in checked"
                :key="item[showFlied]"
                :closable="true"
                type="primary"
                @close.stop='closeTag(item)'
            >
            {{item[showFlied]}}
            </el-tag>
        </div>
        <el-collapse-transition>
            <div class="content w250" v-show="show">
                <div class="content-body">
                    <check-block  @selectChange="selectChange" v-for="(item,index) in left" :key="item[showFlied]" :currentData="item" :showFlied="showFlied" :childFlid="childFlid">
                    </check-block>
                </div>
            </div>
         </el-collapse-transition>
    </div>
</template>

<script>
import CheckBlock from './CheckBlock'

let keys = [];
let first = true;



//每个数据项添加children，expand，parent,checked字段
function tanslate(data,checkedData) {

    // 先把原来的keys存起来
    if(first){
        if(data.length == 0) return []
        keys = Object.keys(data[0]);
        first = false;
    }

    //记录之前层级的元素的索引
    let level = {};
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        level[item.level] = i;

        //如果能在被选中的数组中找到则设置checked为true
         this.$set(item, 'checked', false);

        for(let j=0;j<checkedData.length;j++){
            let checkedItem = checkedData[j];
            if(checkedItem[this.id]==item[this.id]){
                this.$set(item, 'checked', true);
                break;
            }
        }

        if (item.leaf == "NO") {
            if (!item.children) this.$set(item, 'children', []);
        }

        if (item.level !== 1) {
            // if (item.leaf == "NO" && !item.children) item.children = [];
            this.$set(item, 'parent', data[level[item.level - 1]])
            data[level[item.level - 1]].children.push(item)
        }
    }
    return data
}

//取两个数组的差集
Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

//获取所有被选中的值
    function getChecked(data) {
        if (!data || data.length == 0) return []
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
                if (this.arr.indexOf(data[i]) == -1) {
                    this.arr.push(data[i])
                }
            } else {
                let index = this.arr.indexOf(data[i]);
                if (index != -1)
                    this.arr.splice(index, 1);
            }
        }
        return this.arr
    }


//只拷贝原始的数据,need需要保留的非原始属性
function deepCopyOrign(obj, item, need=[]) {
    for (let key in item) {
        let type = Object.prototype.toString.call(item[key]).slice(8, -1).toLowerCase();
        let flag = (keys.indexOf(key)!= -1 ||((need.length != 0) && (need.indexOf(key) != -1)))?true:false; //判断key是否是原始的key
        if (type === 'array' && flag) {
            for (let i of item[key]) {
                deepCopy(i);
            }
        } else if (type === 'object' && flag) {
            obj[key] = {}
            deepCopy(obj[key], item[key])
        }
        else if(flag){
            obj[key] = item[key];
        }
    }
}

//深拷贝
function deepCopy(obj, item) {
    for (let key in item) {
        let type = Object.prototype.toString.call(item[key]).slice(8, -1).toLowerCase();
        if (type === 'array') {
            for (let i of item[key]) {
                deepCopy(i);
            }
        } else if (type === 'object') {
            obj[key] = {}
            deepCopy(obj[key], item[key])
        }
        else{
            obj[key] = item[key];
        }
    }
}

// 处理单选和全选,参数tag决定走不走子的递归
function handleCheck(state, rowData, tag = false) {
    //全选与反选
    if (!tag) {
        if (rowData.children) {
            for (let i of rowData.children) {
                i.checked = state;
                handleCheck.call(this, state, i);
            }
        }
    }
    if (rowData.parent) {
        let parent = rowData.parent;
        let tag = true;
        for (let item of parent.children) {
            if (!item.checked) {
                tag = false
                break;
            }
        }
        if (tag) {
            parent.checked = true
        } else {
            parent.checked = false
        }
        handleCheck.call(this, parent.checked, parent, true);
    }
}


export default {
    mounted(){
        document.body.addEventListener('click',()=>{
            this.show = false;
        },false)
    //    this.sendData();
    },
    components: {
        CheckBlock
    },
    props: {
        //穿梭框左边的数据
        selectData: {
            type: Array,
            default: function() {
                return []
            }
        },
        //穿梭框需要显示的字段
        showFlied: {
            type: String,
            default: function() {
                return "text"
            }
        },
        //子字段的名字
        childFlid: {
            type: String,
            default: function() {
                return "children"
            }
        },
        //被选中的值
        checkedData:{
            type:Array,
            default:function(){
                return []
            }
        },
         //用于判断的id
        id:{
            type: String,
            default: function() {
                return "id"
            }
        }
    },
    data() {
        return {
           once:true, //控制第一次数据转换
           show:false,
           arr:[],
           translateData:[] //处理后的list
        }
    },
    computed: {
        // 被处理过的左边数据
        left() {
            if (this.selectData.length == 0) return []
            if (this.once){

               let data =  tanslate.call(this, [...this.selectData],[...this.checkedData]);
               this.translateData = data
               this.once = false
            }
            return this.translateData;
        },
        // 选择的项
        checked() {
            return getChecked.call(this,[...this.selectData]);
        },
    },
    methods: {
        //外部监听数据
        sendData(){
            let data = [];
            for(let i of this.checked){
                let o = {};
                deepCopyOrign(o,i);
                data.push(o);
            }
            this.$emit('getSelectData',data)
        },
        //获取选中的值
        getChecked(data){
            if (!data || data.length == 0) return []
            for (let i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    if (this.arr.indexOf(data[i]) == -1) {
                        this.arr.push(data[i])
                    }
                } else {
                    let index = this.arr.indexOf(data[i]);
                    if (index != -1)
                        this.arr.splice(index, 1);
                }
            }
            return this.arr;
        },
         //关闭tag
        closeTag(item){
           let index = this.selectData.indexOf(item);
           this.selectData[index].checked = false;
           handleCheck(this.selectData[index].checked,this.selectData[index],false);
           this.sendData();
        },
        selectChange(){
          this.sendData();
        }
    },
    watch:{
      checkedData(val){
       let data = [];
        for(let i of val){
            let o = {};
            deepCopyOrign(o,i);
            data.push(o);
        }
        this.$emit('getSelectData',data)
        this.once = true;
      }
    }
}

</script>

<style scoped lang="scss">

.select-input{
    min-height: 30px;
    width: 252px;
    border: 1px solid #d1dbe5;
    margin-top: 4px;
    box-sizing: border-box;
    position: relative;
    padding-right: 32px;
    .icon-btn{
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        color: #bfcbd9;
    }

}
.content {
    position: absolute;
    background-color: #fff;
    z-index: 999;
    width: 250px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border: 1px solid #d1dbe5;

}
.yb-select{
    width: 250px;
    display: inline-block;
    .el-tag{
        margin: 0 5px;
    }
}

.yb-select .content-body {
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px 0;
    height: 250px;
}

</style>
