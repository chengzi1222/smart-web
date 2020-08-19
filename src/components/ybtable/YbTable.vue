<template>
  <div  class="yb-table">


    <div class="head">
      <div v-if="thitem.prop != listField" v-for="(thitem,index) in column" :key="index+'th'" style="width:151px;">{{thitem.label}}</div>
      <div v-if="thitem.prop == listField" v-for="(thitem,index) in column" :key="index+'th'" class="subList">
        <div v-for="(subitem,i) in thitem.subColumn" :key="i" class="flex1" v-if="subitem.prop!=[statusField]" >{{subitem.label}}</div>
      </div>
      <div v-if="entryTypeField != 'detail'" class="handle">操作</div>
    </div>

    <!-- </table> -->
    <div class="content">
      <div class="item" v-for="(item,index) in translatedData" :key='index+"item"'>
        <div  :style="{'height':40*(item[2].length)+'px','lineHeight':40*(item[2].length)+'px'}" :title="item[0]">{{item[0]}}</div>
        <div  :style="{'height':40*(item[2].length)+'px','lineHeight':40*(item[2].length)+'px'}" :title="item[1]">{{item[1]}}</div>
        <div class="list">
          <div class="list-item" v-for="(subitem,i) in item[2]" >

             <div class="miniitem" :title='miniItem' v-for="(miniItem,key) in subitem" v-if="key!=[statusField]" :class="{context:key==='context'}">
                 {{miniItem}}
             </div>
               <div v-if="entryTypeField != 'detail'" class="btn-box">
                   <span v-if="subitem[statusField]=='YES'">
                      <el-button type="text" @click="editFn(index,i,subitem)">编辑</el-button>
                      <span class="line">|</span>
                      <el-button type="text" @click="statusFn(index,i,subitem)">禁用</el-button>
                    </span>
                  <span v-if="subitem[statusField]=='NO'">
                    <el-button type="text"  @click="editFn(index,i,subitem)">编辑</el-button>
                      <span class="line">|</span>
                    <el-button type="text" @click="statusFn(index,i,subitem)">启用</el-button>
                        <span class="line">|</span>
                    <el-button type="text" @click="deleteFn(index,i,subitem)">删除</el-button>
                  </span>

              <!-- <slot></slot> -->
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="total">
      <span class="floatL">总计：</span>
      <span>{{score+'分'}}</span>
    </div>
  </div>

</template>

<script>
  export default{
    props:{
      column:{
        type:Array
      },
      tableData:{
        type:Array
      },
      align:{
        type:String,
        default:function(){
          return "center"
        }
      },
      //是否有最后的操作按钮
      lastBtn:{
        default:function(){
          return false;
        }
      },
      // 表格中第二级list的字段
      listField:{
        type:String
      },
      //判断状态的标识
      statusField:{
        type:String
      },
      //编辑的回调函数
      editFn:{
        default:function () {
          return function(){}
        }
      },
      //启用禁用的回调函数
      statusFn:{
        default:function () {
          return function(){}
        }
      },//删除的回调函数
      deleteFn:{
        default:function () {
          return function(){}
        }
      },
      scoreField:{
        type:String,
        default:function () {
          return 'score'
        }
      },
      entryTypeField:{
        type:String,
        default:function () {
          return 'edit'
        }
      }
    },
    computed:{
      // 处理数据格式
      translatedData(){
        this.score = 0;
        let arr1 = [];
        let data = this.tableData;

        for(let item1 of data){
          let arr2 = [];
          for(let key of this.keyObj.keys){

            if(key != this.listField){
              arr2.push(item1[key]);
            }
            else{

              let  arr3 = []
              let list = item1[this.listField];
              for(let subItem of list){
                let obj = {};
                for(let subKey of this.keyObj.subKeys){
                  let val = subItem[subKey];
                  obj[subKey] = val;
                }
                 if(obj[this.statusField]=== 'YES'){
                      this.score += obj[this.scoreField];
                  }
                 arr3.push(obj)
              }
               arr2.push(arr3);

            }
          }
          arr1.push(arr2);
        }

        return arr1;
      },
      //返回所有的key值的对象，有两级
      keyObj(){
        let obj = {};
        let keyArr = [];
        let subKeyArr = [];
        for(let item of this.column){
          if(item.prop == this.listField){
            keyArr.push(item.prop)
            for(let i of item.subColumn){
              subKeyArr.push(i.prop)
            }
          }else{
            keyArr.push(item.prop)
          }
        }
        obj.keys = keyArr;
        obj.subKeys = subKeyArr;
        return obj
      }
    },
    data(){
      return {
        score:0
      }
    }
  }
</script>

<style scoped lang='scss'>
  .yb-table{
    width: 100%;
    border:1px solid #C2CAD2;
    text-align:center;
    box-sizing: border-box;

  }

  .head{
    display:flex;
    background:#F2F5F8;
    div:nth-child(1),div:nth-child(2){
      width:150px;

    }
    div{
      height:40px;
      line-height:40px;
      color: #787878;
    }
    .subList{
      display:flex;
      flex:1;
    }
  }

  .content{
    width:100%;
    .item{
      border-top:1px solid #C2CAD2;
      display:flex;
      >div:nth-child(1),>div:nth-child(2){
        width:150px;
        height:40px;
        line-height:40px;
        border-right:1px solid #C2CAD2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list{
        flex:1;
        display:flex;
        flex-wrap:wrap;
        flex-direction:column;
        .list-item{
          border-top:1px solid #C2CAD2;
          flex: 1;
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          height:40px;
          .miniitem{
            flex:1;
          }
        }
        .list-item:nth-child(1){
          border-top:0px;
        }
      }
    }
  }
.context{
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
  .btn-box,.handle{
    width:250px;
    line-height:40px;
    .line{
      color:#cbcbcb;
    }
  }
  .total{
    height:60px;
    line-height:60px;
    padding:0 60px;
    border-top:1px solid #C2CAD2;
  }
</style>

