<!--oss-jc-->
<template>
  <div>
    <el-upload :file-list="picList" :class="{'upload-hide':picList.length>=maxLength,'togOssUpload':size=='big'}"
      :action="obj.host" list-type="picture-card" :on-success="uploadSuccess" :on-error="uploadError"
      :before-upload="beforeUpload" :on-preview="handlePictureCardPreview" :on-remove="removePic" :data="uploadData"
      :limit='maxLength' :disabled="disabled_">
      <i class="el-icon-circle-plus fs30" style="color:#0DB5EF" type="primary"></i>
    </el-upload>
    <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
      <img :src="imageUrl" alt="" class="big-img">
    </div>
  </div>
</template>

<script>
  import * as api from "api/common";
  import config from "utils/config"
  export default {
    name: "imgUpload",
    props: {
      filesArr: {
        //编辑回显时必须
        type: Array,
        default: () => []
      },
      maxLength: { //最大上传数量
        type: Number,
        default: 5
      },
      size: { //上传样式卡片大小
        type: String,
        default: 'big'
      }
    },
    watch: {
      filesArr(val) {
        this.picList = [];
        this.filesArr.map(item => {
          this.picList.push({
            name: item.name,
            fileId: item.fileId,
            id: item.id,
            url: item.url
          })
        })
      }
    },
    data() {
      return {
        disabled_: false,
        imageUrl: "",
        dialogVisible: false,
        picList: [], //存图片相关的内容
        obj: {
          accessid: "",
          host: "", //地址
          policyBase64: "",
          signature: "", //时间
          expire: 0,
          callback: "",
          key: "",
          now: Date.parse(new Date()) / 1000,
          dir: "" //key
        },
        uploadData: {}
      };
    },
    computed: {
      pathFile() {
        return this.$store.getters.filePath;
      }
    },
    methods: {
      random_string(len, type) {
        //随机名字
        len = len || 32;
        var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        var maxPos = chars.length;
        var pwd = "";
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let fullDate = year + seperator1 + month + seperator1 + strDate;
        return fullDate + pwd + "." + type;
      },
      //图片上传前
      async beforeUpload(file) {
        this.disabled_ = true;
        return new Promise(async (resolve, reject) => {
          if (["image/png", "image/jpg", "image/jpeg", "image/gif"].indexOf(file.type) == -1) {
            this.$message.error("请选择png、jpg、gif格式的图片！");
            this.disabled_ = false;
            return reject(false);
          }
          if (file.size > 10485760) {
            this.$message.error("上传失败、每张图片大小最多10M！");
            this.disabled_ = false;
            return reject(false);
          }
          await this.get_signature();
          this.uploadData = {
            key: this.obj.key +
              this.random_string(
                20,
                file.type.substring(file.type.lastIndexOf("/") + 1)
              ),
            policy: this.obj.policyBase64,
            OSSAccessKeyId: this.obj.accessid,
            success_action_status: "200", //让服务端返回200,不然，默认会返回204
            callback: this.obj.callbackbody,
            signature: this.obj.signature,
            "x:original_filename": file.name
          };
          return resolve(true)
        });
      },
      //图片上传成功
      uploadSuccess(response, file, fileList) {
        console.log(response.data, file, fileList, "uploadSuccess");
        let data=response.data
        this.picList.push({
          name: data.fileName,
          fileId: data.fileId,
          id: data.id,
          url: this.pathFile + data.fileId
        });
        this.$message.success("图片上传成功！");
        this.disabled_ = false;
        this.$emit('uploadSuccess', this.picList, '上传成功')
      },
      //图片上传失败
      uploadError(err, file, fileList) {
        //   console.log(err, file, fileList, "uploadError");
        this.$message.error("图片上传失败！");
        this.disabled_ = false;
        this.$emit('uploadError', this.picList, '上传失败')
      },
      //点击已上传的文件链接
      handlePictureCardPreview(file) {
        //   console.log(file, "handlePictureCardPreview");
        this.imageUrl = file.url;
        this.dialogVisible = true;
      },
      //删除图片
      removePic(file, fileList) {
        //   console.log(file, fileList, "removePic");
        const url = file.url;
        for (let i = 0; i < this.picList.length; i++) {
          let obj = this.picList[i];
          if (obj.url == url) {
            this.picList.splice(i, 1);
            break;
          }
        }
        this.$emit('remove', this.picList, '删除')
      },
      async get_signature() {
        //获取是否超时
        // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
        this.obj.now = Date.parse(new Date()) / 1000;
        let obj_ = {};
        console.log(this.obj.expire, this.obj.now);
        if (this.obj.expire < this.obj.now + 3) {
          obj_ = await this.send_request();
          this.obj.host = obj_["host"];
          this.obj.policyBase64 = obj_["policy"];
          this.obj.accessid = obj_["accessId"];
          this.obj.signature = obj_["signature"];
          this.obj.expire = parseInt(obj_["expire"]);
          this.obj.callbackbody = obj_["callback"];
          this.obj.key = obj_["dir"];
        }
      },
      async send_request() {
        //向后端得到签名
        let data = {};
        await api.policy('IMAGE').then(r => {
          if (r.status && r.data && r.data !== null) {
            data = r.data;
          }
        });
        return data;
      }
    },
    created() {
      this.get_signature();
    },
    mounted() {
      this.picList = [];
      this.filesArr.map(item => {
        this.picList.push({
          name: item.name,
          fileId: item.fileId,
          id: item.id,
          url: item.url
        })
      })
    }
  };
</script>

<style lang='scss'>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 990;
    display: flex;
    justify-content: center;
    align-items: center;

    .big-img {
      min-width: 30%;
      max-width: 800px;
      max-height: 500px;
    }
  }

  .upload-hide .el-upload {
    display: none;
  }

  .togOssUpload .el-upload,
  .togOssUpload .el-upload-list__item {
    width: 180px !important;
    height: 120px !important;
    line-height: 120px !important;
  }

  .togOssUpload .el-upload-list__item-status-label {
    display: none !important;
  }
</style>