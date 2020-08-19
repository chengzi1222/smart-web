<template>
    <div class="AttachmentUpload">
         <div>
            <el-checkbox-group v-model="checked" style="width:100%;" @change="handleChange">
                 <el-checkbox-button v-for="item in btns" :label="item" :key="item">{{item}}</el-checkbox-button>
            </el-checkbox-group>
            <div v-for="fieldItem in slField" :key="fieldItem.field" class="AttachmentUpload-box">
                  <div style="color:#999;margin-right:20px;font-size:12px;">
                      <p style="font-size:18px;color:#777;margin-bottom:10px;">{{fieldItem.label}}</p>
                      <p>图片格式：png、jpg、jpeg</p>
                      <p>附件大小：每张图片小于10M</p>
                      <p>注：每个附件最多上传20张图片</p>
                  </div>
                  <upload-pic @delete="handleDelete" @change="uploadChange" :field="fieldItem.field" v-model="photo[fieldItem.field]"></upload-pic>
            </div>
         </div>
    </div>
</template>

<script>
import UploadPic from "./UploadPic";

export default {
  components:{
      UploadPic
  },
  props:{
     options:{
        type:Array,
        default:function(){
            return []
        }
     },
     // v-model绑定的值,当前上传的图片
     value:{
        default:function(){
            return []
        }
     }
  },
  mounted(){
       this.init();
  },
  data(){
      return{
        checked: [], //选中的按钮
        photo:{},
        first:true, //第一次外部传进来的数据不为空

      }
  },
  computed:{
      //所有的按钮组
      btns(){
          let arr = [];
          for(let item of this.options){
              arr.push(item['label']);
          }
          return arr
      },
      //选中的图片类型List<Object>
      slField(){
          let arr = [];
          let sortArr = [];
          for(let item of this.checked){
              for(let optItem of this.options){
                  if(optItem['label'] == item){
                    //   arr.push({...optItem});
                      arr.push(Object.assign(optItem));
                      break;
                  }
              }
          }
          for(let optItem of this.options){
              for(let item of arr){
                  if(item["field"] == optItem["field"]){
                      sortArr.push(item);
                      break;
                  }
              }
          }

          return sortArr
      }
  },
  methods:{
      handleDelete(item){
        this.$emit("delete",[item]);
      },
      //上传图片组件发生变化
      uploadChange(){
          this.input();
          this.$emit("uploadChange")
      },
      //通知上级组件，并改变值
      input(){
          let arr = [];
          for(let key in this.photo){
              let item = this.photo[key];
              for(let subItem of item){
                  let { field,id,url } = subItem;
                  arr.push({ field,id,url});
              }
          }
          this.$emit("input",arr);
      },
      handleChange(ck){
           //取消的时候删除已上传
           let sub = [];
           for(let i = 0;i< ck.length;i++){
                let item = ck[i];
                for(let optItem of this.options){
                    if(optItem.label == item){
                        sub.push(optItem.field);
                        break;
                    }
                }
           }

            let deleteID = [];

            for(let key in this.photo){
                if(!sub.includes(key)){
                    let subArr = this.photo[key];
                    let arr = subArr.splice(0,subArr.length);
                    for(let item of arr){
                        deleteID.push(item.id);
                    }
                    continue;
                }
            }

            this.$emit("delete",[...deleteID]);
            this.input();
      },
      // 初始化
      init(){
          //checkbox初始化
          if(this.first && this.value.length>0){
              let sub = [];
              for(let item of this.value){
                 if(sub.includes(item.field)) continue
                  for(let optItem of this.options){
                      if(optItem.field == item.field){
                          this.checked.push(optItem.label);
                          sub.push(item.field);
                          break;
                      }
                  }
              }
              this.first = false;
          }

        //photo初始化
        if(Object.prototype.toString.call(this.value).slice(8,-1).toLowerCase() != 'array') return
        for(let item of this.value){
             if(Object.prototype.toString.call(this.photo[item.field]).slice(8,-1).toLowerCase() != 'array'){
                 this.$set(this.photo,item.field,[]);
             }

            let tag = true;
            for(let i of this.photo[item.field]){
                if(i.id == item.id){
                    tag = false;
                    break;
                }
            }
            if(tag)  this.photo[item.field].push(item);

         }
      }
  },
  watch:{
      //监听已上传的图片，更新类
      value(val){
          this.init()
      },
  }
}
</script>


<style lang="scss" scoped>
.AttachmentUpload{
    .el-checkbox-button{
        margin-right: 10px;
    }
}
.AttachmentUpload-box{
    overflow-x: auto;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 180px;
    align-items: center;
    background: #f1f5f8;
    border:1px solid #ccc;
    margin: 20px 0;
    padding-left: 20px;
}
</style>
