<template>
<!-- 附件上传组件的例子 -->
  <div>
      <toggle-form>
          <attachment-upload-detail :options="options" v-model="imgData"></attachment-upload-detail>
      </toggle-form>
  </div>
</template>

<script>
import AttachmentUploadDetail from 'components/AttachmentUploadDetail/index';
import ToggleForm from 'components/ToggleForm';

export default {
  components:{
      AttachmentUploadDetail,
      ToggleForm
  },
  data(){
      return {
          options:[
              {
                  label:"备案申请书",
                  field:"a"
              },
               {
                  label:"营业执照副本",
                  field:"b"
              },
               {
                  label:"场地证明",
                  field:"c"
              },
               {
                  label:"健康证",
                  field:"d"
              },
               {
                  label:"身份证",
                  field:"e"
              },
          ],
          imgData:[
              {
                   colu:'a',
                   url:'ddddds'
              },
               {
                   colu:'d',
                   url:'dddds'
              },
             
          ]
      }
  }
}
</script>


<style lang="scss" scoped>

</style>


