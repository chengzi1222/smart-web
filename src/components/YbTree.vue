<template>
    <el-tree :data="dataSource" :props="defaultProps" @node-click="handleNodeClick">
            </el-tree>
</template>

<script>
let keys = [];
let tag = true;
export default {
    props: {
        //原始的数据
        datainit: {
            type: Array,
            default: function() {
                return []
            }
        },
        // 需要在页面展示的字段
        showField: {
            type: String,
            default: function() {
                return ""
            }
        }
    },
    data() {
        return {
            dataSource: [],
            defaultProps:{
                children: 'children',
                label: this.showField
            }
        }
    },
    watch: {
      datainit: function (val, oldVal) {
      if(tag){
        this.dataSource = tanslate(val, this.showField);
        console.log(this.dataSource)
        tag = false;
      }
    }},
    methods: {
        handleNodeClick(data) {
        }
    }

}

function tanslate(data, showField) {
    // 先把原来的keys存起来
    // keys = Object.keys(data[0]);
    let arr = [];
    //记录之前层级的元素的索引
    let level = {};
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        level[item.level] = i;
        if (item.level === 1) {
            if (item.leaf == "NO" && !item.children) item.children = [];
            arr.push(item);
        }
        if (item.level !== 1) {
            if (item.leaf == "NO" && !item.children) item.children = [];

            data[level[item.level - 1]].children.push(item);
        }
    }
    return arr
}

</script>

<style lang="scss" scoped>

</style>
