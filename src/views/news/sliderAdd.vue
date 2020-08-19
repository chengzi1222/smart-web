<template>
    <div class="bigbox">
    	<div class="page-tilt">
    	    <b></b><span>{{isEdit ? '编辑' : '添加'}}轮播图</span> <div class="back" @click="backList()"><i class="icon iconfont icon-back"></i></div>
    	</div>
        <div class="right-info">
            <el-form  label-width="130px" class="demo-ruleForm" :model="dto" :rules="rules" ref="ruleForm">
                <!-- 基本信息 -->
                <toggle-form title="基本信息">
                <div class="content">
                    <div class="row">
                        <el-form-item label="标题：" prop="title">
                            <el-input v-model="dto.title" class="w250" placeholder="请输入资讯标题">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="row" >
                        <el-form-item label="轮播图封面：">
                            <el-upload
                                :file-list = "photo"
                                action="/api/newsUpload/img"
                                list-type="picture-card"
                                :on-success = "uploadSuccess"
                                :on-error = "uploadError"
                                :data="{type:'NEWSPIC',field:'PHOTO'}"
                                :before-upload="beforeAvatarUpload"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="removePic"
                                :limit="1"
                                :on-exceed="overflow"
                                >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                                <img   :src="imageUrl" alt="">
                            </div>
                            <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，jpeg</p>
                            <p class="bz">图片大小：每张图片小于10M</p>
                            <p class="bz">轮播图封面仅限传1张</p>
                        </el-form-item>
                    </div>
                  <div class="row" >
                    <el-form-item label="是否发布：">
                      <el-switch
                        v-model="dto.pubYes"
                        active-color="#0DB5EF"
                        inactive-color="#E7ECF2"
                        active-value="YES"
                        inactive-value="NO">
                      </el-switch>
                    </el-form-item>
                  </div>
                    <div class="row">
                        <el-form-item label="链接类型：" prop="localYes">
                            <el-radio-group @change="urlType" v-model="dto.localYes">
                                <el-radio-button label="YES" name="localYes">本地资讯</el-radio-button>
                                <el-radio-button label="NO" name="localYes">第三方链接</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                     <div class="row">
                        <el-form-item label="链接地址：" prop="outsideUrl">
                            <el-input v-model="dto.outsideUrl" class="w250" placeholder="请在这粘贴链接">
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
                </toggle-form>
            </el-form>
	    </div>
      <!--浮动的保存按钮层-->
      <div class="foot-btn">
        <div>
          <el-button @click="backList();">返回</el-button>
          <el-button type="primary" @click="sumbit('ruleForm');" v-if="submitYes == 'YES'">保存</el-button>
          <el-button type="primary" @click="sumbit('ruleForm');" v-else disabled>保存</el-button>
        </div>
      </div>
      <br/><br/><br/><br/><br/><br/><br/>
    </div>

</template>

<script>
import ToggleForm from "components/ToggleForm.vue";
import * as newsApi from 'api/news/news';
export default {
    mounted() {
      this.loadDetail();
    },
    methods: {
      sumbit(formName){
        this.submitYes = '';
        if (!this.validateForm()) {
          this.submitYes = 'YES';
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid)  {
            let formData = JSON.stringify(this.dto);
            if (!this.isEdit) {
              newsApi.addPic(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯轮播图添加成功！');
                  this.backList();
                }
                this.submitYes = 'YES';
              });
            } else {
              delete this.dto.imgurls;
              let formData = JSON.stringify(this.dto);
              newsApi.editPic(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯轮播图编辑成功！');
                  this.backList();
                }
                this.submitYes = 'YES';
              });
            }
          } else {
            console.log('表单验证出错!');
            this.submitYes = 'YES';
            return false;
          }
        });
      },
      validateForm() {
        let dto = this.dto;
        if (!this.picList || this.picList.length == 0)  {
          this.$message.error("必须上传轮播图图片！");
          return false;
        }

        return true;
      },
      //. 加载详情
      loadDetail() {
        if (!this.isEdit) {
          return ;
        }
        newsApi.detailPic({id: this.newsPicId}).then((r) =>{
          let detail = {};
          if (r.status) {
            if (!r.data) {
              this.$message.error("未查询到资讯轮播图详情");
            } else {
              detail = r.data;
              let tmpDetail = {
                id : detail.id,
                title: detail.title,
                newsId: detail.news_id,
                outsideUrl: detail.outside_url,
                localYes: detail.local_yes,
                pubYes: detail.pub_yes,
                pubDeptName: detail.pub_dept_name,
                imgurls: detail.imgurls,
                delFileIdList: []
              };
              this.dto = tmpDetail;
              let tmpFlag = "@#";
              this.dto.picIdList = [];
              let fileId = "";
              if (this.dto.imgurls && this.dto.imgurls.length > 0) {
                for (let i = 0; i < this.dto.imgurls.length; i++) {
                  if (this.dto.imgurls[i].indexOf(tmpFlag) != -1) {
                    // 只回显大图
                    if (this.dto.imgurls[i].split(tmpFlag)[1] === 'NEWSBIG') {
                      fileId = this.dto.imgurls[i].split(tmpFlag)[0];
                      this.photo.push({url: this.pathFile + fileId}); // 只作显示作用，不参与逻辑判断这里给个url连接地址就行了
                      this.picList.push({fileId: fileId,url: this.pathFile + fileId, tmpNewsId: this.dto.id});
                    }
                  }
                }
              }
            }
          }
        });
      },
         //图片上传成功
        uploadSuccess(response, file, fileList){
          let picFileList = response.data.fileList; //返回的本批次图片文件字段集合
          if (picFileList && picFileList.length > 0) {
            // 将本次上传成功的图片
            let fileId = picFileList[0].fileId;//只看本批次图片的第一张
            let tmpNewsId = picFileList[0].tmpNewsId; //本批次图片的批次id
            this.picObjList = this.picObjList.concat(picFileList); //每次上传成功，都将picFileList数组合并到this.picObjList中去
            for (let i = 0; i < picFileList.length; i++) {
              this.dto.picIdList.push(picFileList[i].id); //将本批次图片的id存入this.dto.picIdList;
            }
            this.imageUrl = file.url;
            this.addPic = false;
            this.picList.push({fileId:fileId,url:file.url, tmpNewsId: tmpNewsId});
            this.$message.success('图片上传成功！');
          } else {
            this.uploadError();
          }
        },
        //图片上传失败
        uploadError(){
            this.$message.error('图片上传失败！');
        },
        overflow(){
            this.$message.error('最多传1张封面！');
        },
       backList() {
        this.$router.push({name: 'news.list', query:{tab_type:'sliderImg'}});
       },
        //图片上传前判断图片类型
        beforeAvatarUpload(file){
            const type = file.type;
            if(['image/png','image/jpg','image/jpeg'].indexOf(type) == -1){
                 this.$message.error('请选择png、jpg、jpeg格式的图片！');
                 return false
            }
        },
         //点击已上传的文件链接放大图片
        handlePictureCardPreview(file){
            this.imageUrl = file.url;
            this.dialogVisible = true;
        },
         //删除图片
        removePic(file, fileList){
           const url = file.url;
           for(let i=0;i<this.picList.length;i++){
               let obj = this.picList[i];
               if(obj.url == url){
                 let tmpNewsId = this.picList[i].tmpNewsId;
                 let tempArr = [];
                 let tempIdArr = [];
                 for (let m = 0; m < this.picObjList.length; m++) {
                   if (this.picObjList[m].tmpNewsId != tmpNewsId) {
                     tempArr.push(this.picObjList[m]);
                     tempIdArr.push(this.dto.picIdList[m])
                   }
                 }
                 this.picObjList = tempArr;
                 this.dto.picIdList = tempIdArr;
                 this.dto.delFileIdList.push(this.picList[i].fileId);
                 // 在picList中删除
                 this.picList.splice(i,1);
                   break;
               }
           }
        },
        urlType(){
           // console.log(this.type);
        }
    },
    data() {
        return {
          pathFile: this.$store.getters.filePath,
           submitYes: 'YES',
            newsPicId: this.$route.query.id,
            isEdit: this.$route.name == 'news.sliderEdit' && this.$route.query.id || false, //是编辑资讯,
            url:"",
            type:"本地资讯",
            photo:[], //图片
            imageUrl:"",
            picList:[],  //存图片相关的内容
            dialogVisible: false,
            picObjList: [],
            dto: {
              title: "",
              outsideUrl: '',
              pubDeptName: this.$store.getters.user.deptName,
              localYes: 'NO',
              pubYes:'YES',
              picIdList: [], //与本主体关联的资讯图片id
              delFileIdList: []
            },
            rules: {
              title: [
                { required: true, message: '请输入资讯标题', trigger: 'blur' },
                { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
              ],
              outsideUrl: [
                { required: true, message: '请输入链接地址', trigger: 'blur' },
                { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
              ]
            }
        }
    },
    components: {
        ToggleForm
    }
}
</script>

<style scoped lang="scss">
  .back{
    cursor: pointer;
    display: inline-block;
    color: #606979;
    height: 22px;
    width: 22px;
    line-height: 22px;
  }
  .back i{
    font-size: 22px !important;
  }
.bz{
  line-height: 20px;
  font-size: 12px;
  color: #A2AAB6;
}
// 图片上传
.upload-pic{
    border:1px solid #cbcbcb;
    width:130px;
    height:130px;
    border-radius:6px;
    margin-left:110px;
    display:flex;
    justify-content: center;
    align-items: center;
}

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    border-radius:50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color:#fff;
    background:#0DB5EF;
    font-size: 18px;
    margin-bottom: 5px;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
.modal{
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.5);
    z-index:998;
    display:flex;
    justify-content:center;
    align-items:center;
    .big-img{
        min-width: 30%;
        max-width: 800px;
        max-height: 500px;
    }
}
</style>
