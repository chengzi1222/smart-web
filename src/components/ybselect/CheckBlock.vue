<template>
    <div class="block">
        <div class="selectItem" :title="currentData[showFlied]" @click.stop="handleClick" :class="{active:currentData.checked}">
            <span :style="{paddingLeft:20*(currentData.level-1)+'px'}"></span>
            <span >{{currentData[showFlied]}}</span>
            <i class="el-icon-check icon-ok" v-show="currentData.checked"></i>
        </div>
    </div>
</template>

<script>


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
    //当前的数据，显示的字段名字，子字段的名字
    props: ['currentData', 'showFlied', 'childFlid'],
    data() {
        return {
            isEdit: false,
            inputVal: ""
        }
    },
    methods: {
        //点击每个子项
        handleClick(){
            this.currentData.checked = !this.currentData.checked;
            handleCheck.call(this, this.currentData.checked, this.currentData);
            this.$emit("selectChange");
        }

    },
}

</script>

<style lang="scss" scoped>
.selectItem{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    cursor: pointer;
    position: relative;
    width: 192px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right:30px;
    &:hover{
        background: #e4e8f1;
    }
    .icon-ok{
        position: absolute;
        right: 8px;
        top:8px;
        font-size: 12px;

    }
}
.active{
    color: #20a0ff;
}
</style>
