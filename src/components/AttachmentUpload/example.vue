<template>
<!-- 附件上传组件的例子 -->
  <div>
      <toggle-form>
          <attachment-upload :options="options" v-model="Updated"></attachment-upload>
      </toggle-form>
  </div>
</template>

<script>
import AttachmentUpload from 'components/AttachmentUpload/index';
import ToggleForm from 'components/ToggleForm';

export default {
  components:{
      AttachmentUpload,
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
          Updated:[
              {
                   field:'a',
                   id:1,
                   url:'ddddds'
              },
               {
                   field:'d',
                   id:2,
                   url:'ddddds'
              }

          ]
      }
  }
}
</script>


<style lang="scss" scoped>

</style>


