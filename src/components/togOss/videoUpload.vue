<!--oss-jc-->
<template>
  <div v-loading="disabled_"  element-loading-text="正在上传中...">
    <el-upload   id="videoOssUpload" :file-list="picList" :class="picList.length<maxLength ? '':'upload-hide'"
      :action="obj.host" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload"
      :show-file-list="false" :data="uploadData" :limit='maxLength' :disabled="disabled_">
      <el-button type="default">点击上传</el-button>
    </el-upload>
    <div class="show-success-file">
      <div class="file-item" v-for="(item,index) in picList" :key="index">
        <video :src="pathFile +item.url" controls autoplay></video>
        <span class="delete-btn ml20" @click="removeFile(index,item)">删除</span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from "api/common";

  Array.prototype.arrayRemove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
      return false;
    }
    this.splice(dx, 1);
  };
  export default {
    name: "videoOssUpload",
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
    computed: {
      pathFile() {
        return this.$store.getters.filePath;
      }
    },
    data() {
      return {
        disabled_: false,
        dialogVisible: false,
        picList: [], //存视频相关的内容
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
        uploadData: {},
      };
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
      //视频上传前
      async beforeUpload(file) {
        console.log(file)
        return new Promise(async (resolve, reject) => {
          this.disabled_ = true;
          if (["video/m3u8", "video/3gp", "video/3gpp", "video/mp4"].indexOf(file.type) == -1) {
            this.$message.error("请选择视频格式：m3u8，3gp，mp4！");
            this.disabled_ = false;
            return reject(false);
          }
          if (file.size > 1073741824) {
            this.$message.error("上传失败、视频大小：1个G以内！");
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
      //视频上传成功
      uploadSuccess(response, file, fileList) {
        // console.log(response.data, file, fileList, "uploadSuccess");
        let data = response.data
        this.picList.push({
          name: data.fileName,
          fileId: data.fileId,
          id: data.id,
          url: data.fileId
        });
        console.log(response, this.picList, "uploadSuccess");
        this.$message.success("视频上传成功！");
        this.disabled_ = false;
        this.$emit('uploadSuccess', this.picList, '上传成功')
      },
      //视频上传失败
      uploadError(err, file, fileList) {
        //   console.log(err, file, fileList, "uploadError");
        this.$message.error("视频上传失败！");
        this.disabled_ = false;
        this.$emit('uploadError', this.picList, '上传失败')
      },

      //删除
      removeFile(index, item) {
        this.picList.arrayRemove(index);
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
        await api.policy('VIDEO').then(r => {
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
      this.picList = this.filesArr;
      this.filesArr.map(item => {
        this.picList.push({
          name: item.name,
          id: item.id,
          fileId: item.fileId,
          url: item.url
        })
      })
    }
  };
</script>

<style lang='scss'>
  .upload-hide .el-upload {
    display: none;
  }

  .fs30 {
    font-size: 30px;
  }

  .show-success-file {
    video {
      width: 180px !important;
      height: 120px !important;
      position: relative;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

    .delete-btn {
      color: #1787ad;
      cursor: pointer;
    }
  }
</style>