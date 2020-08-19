<template>
  <div class="uploadBox">
       <el-upload
            :file-list = "value"
            action="/api/upload"
            list-type="picture-card"
            :on-success = "uploadSuccess"
            :on-error = "uploadError"
            :data="{type:'CFDA'}"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="removePic"
            :limit="20"
            :on-exceed="handleExceed"
            >
            <i class="el-icon-plus"></i>
        </el-upload>
        <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
            <img class="bigImg"  :src="imageUrl" alt="">
        </div>
  </div>
</template>

<script>
export default {
  props:{
      field:{
          type:String,
          default:function(){
              return ''
          }
      },
      //当前存在的图片
      value:{
          type:Array,
          default:function(){
              return []
          }
      }
  },
  data(){
      return {
          //图片上传
            imageUrl:"",
            dialogVisible: false,
      }
  },
  computed:{

  },
  methods:{
       //上传超出最大限度 
        handleExceed(){
            this.$message.warning('最多上传20张图片！');
        },
       //点击已上传的文件链接
        handlePictureCardPreview(file){
            this.imageUrl = file.url;
            this.dialogVisible = true;
        },
       //图片上传前
        beforeAvatarUpload(file){
            const type = file.type;
            if(['image/png','image/jpg','image/jpeg','image/jpeg'].indexOf(type) == -1){
                 this.$message.error('请选择png、jpg、jpeg格式的图片！');
                 return false
            }
        },
       //图片上传成功
        uploadSuccess(response, file, fileList){

            let { fileId,id } = response.data;
            let { url } = file;

            this.value.push({fileId:fileId,id:id,url:url,field:this.field});

            this.$emit("input",this.value)
            this.$emit("change");
            this.$message.success('图片上传成功！');
        },
         //图片上传失败
        uploadError(){
            this.$message.error('图片上传失败！');
        },
         //删除图片
        removePic(file, fileList){
          let id = file.uid;
          for(let i=0;i<this.value.length;i++){
              if(this.value[i]['uid'] == id){
                  let item = this.value.splice(i,1);
                  this.$emit("input",this.value);
                  this.$emit("change");
                  this.$emit("delete",item[0].id)
                  this.$message.success('图片删除成功！');
                  break;
              }
          }
        },
  }
}
</script>

<style lang="scss" scoped>
.modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,.5);

}
.bigImg{
   min-width: 450px;
   max-width: 80%;
}
</style>


