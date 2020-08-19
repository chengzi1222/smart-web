<template>
    <div class="checkgroup">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{groupLabel}}</el-checkbox>
        <el-checkbox-group v-model="checkedArr" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in allData" :label="item.name" :key="item.id" :title="item.name">{{item.name}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>



export default {
    mounted(){
        this.allData.forEach(item=>{this.nameArr.push(item.name)});

        if(this.checkedList.length>0){

          for(let i=0;i<this.checkedList.length;i++){
            if(this.checkedList[i].group === this.group){

              if(this.checkedList[i].group.length > 0) {
                this.isIndeterminate = true;
              }

              if(this.checkedList[i].list.length == this.allData.length){
                this.isIndeterminate = false;
                this.checkAll = true;
              }

              let list = this.checkedList[i].list;
              for(let j = 0;j<list.length;j++){
                  this.checkedArr.push(list[j].name);
              }
              break;
            }
          }
        }

        //回显
        this.$emit("cheackChange",this.translate());

    },
    props:{
        //子数据
        allData:{
            type:Array,
            default:function(){
                return [];
            }
        },
        group:{
            type:String,
            default:function(){
                return "";
            }
        },
        groupLabel:{
            type:String,
            default:function(){
                return "";
            }
        },
        //已经被选中的所有值
        checkedList:{
            type:Array,
            default:function(){
                return [];
            }
        }
    },
    data() {
        return {
            //是否全选
            checkAll: false,
            //已选中
            checkedArr: [],
            isIndeterminate: false,
            nameArr : []
        };
    },
    methods: {
        handleCheckAllChange(event) {
            this.checkedArr = event ? this.nameArr : [];
            this.isIndeterminate = false;

             //把新数据给上级
            this.$emit("cheackChange",this.translate())
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.allData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.allData.length;

            //把新数据给上级
            this.$emit("cheackChange",this.translate())
        },
        translate(){
            let arr = [];
            this.checkedArr.forEach((item,index)=>{
                this.allData.forEach(obj=>{
                    //用name进行判断
                    if(obj.name === item){
                        arr.push(obj);
                    }
                })
            })
           return {group:this.group,list:arr};
        }
    },

};
</script>

<style scoped lang="sass">
.form-block .el-checkbox-group{
    width: 340px;
}
.checkgroup{
    margin-bottom:20px;

}
.checkgroup>.el-checkbox{
    width: 100px;
    text-align: right;
    margin-right: 10px;
}
.el-checkbox{
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
    white-space: nowrap;
}
.el-checkbox__label{
    display: inline !important;
}
</style>
