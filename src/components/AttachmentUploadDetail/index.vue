<template>
    <div class="AttachmentUpload">
         <div>
            <div v-for="(fieldItem,key) in photo" :key="key" class="AttachmentUpload-box">
                  <div style="color:#999;margin-right:20px;font-size:12px;min-width:130px;">
                      <p style="font-size:18px;color:#777;margin-bottom:10px;">{{fieldItem.label}}</p>
                  </div>
                   <div v-for="(item,index) in fieldItem.list" @click.stop="clickPic(item)" class="imgdiv" >
                            <img :src="item.url" alt="">
                            <span>预览</span>
                    </div>
            </div>
         </div>

         <div class="showBig" v-if="showPic" @click.stop="showPic=false">
            <img :src="showPicUrl" alt="" @click.stop="showPic=false">
        </div>
    </div>
</template>

<script>

export default {
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
      document.body.addEventListener("click",()=>{
           this.imgbig = null;
      },false)
  },
  methods:{
       ifbig(index){
            if (this.imgbig == null || this.imgbig != index) {
                this.imgbig = index;
            } else{
                this.imgbig = null;
            }
        },
        clickPic (item) {
            this.showPicUrl = item.url
            this.showPic = true
        }
  },
  data(){
      return{
          imgbig:-1,
          sub:[],
          showPic: false,
          showPicUrl: ''
      }
  },
  computed:{
     photo(){
         let obj = {};
         let sub = [];
         for(let item of this.value){
             if(!sub.includes(item.colu)){
                 obj[item.colu] = {};
                 obj[item.colu]["list"] = [];
                 for(let optItem of this.options){
                     if(item.colu == optItem.field){
                          obj[item.colu]["label"] = optItem.label;
                          break;
                     }
                 }
                sub.push(item.colu);
             }
             obj[item.colu]['list'].push(item)
         }
         return obj
     }
  },
}
</script>


<style lang="scss" scoped>
.showBig{
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background:rgba(0,0,0,.7);
  >img{
    max-width: 800px;
    min-width: 300px;
    max-height: 600px;
    min-height: 300px;
  }
}
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

.imgdiv{
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
     img{
        transition: all 0.5s;
        width: 100%;
        height: 100%;
        border-radius: 6px;
     }
     span{
        display: none;
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: rgba(0,0,0,0.40);
        border-radius: 0 0 5px 5px;
        font-size: 14px;
        color: #FFFFFF;
        position: absolute;
        bottom: 0;
        left:0;
     }
    }
    .imgdiv:hover{
     span{
        display: inline-block;
     }
    }
    .imgbig{
    z-index: 999;
     span{
        display: none !important;
     }
     img{
        transform:scale(2);
        border-radius: 0;
     }
    }
</style>
