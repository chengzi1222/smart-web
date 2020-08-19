<template>
  <div>
    <div class="mb200">
      <el-form  ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="姓名:" prop="name">
                张三
              </el-form-item>
              <el-form-item label="手机号(账号)：" prop="name">
                1828097500002
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="性别：" prop="name">
                女
              </el-form-item>
              <el-form-item label="身份证号：" prop="name">
                511622199356568855
              </el-form-item>
            </div>
             <div class="row">
              <el-form-item label="单位名称：" prop="name">
                电饭煲刚拿到房地方
              </el-form-item>
              <el-form-item label="许可备案号" prop="name">
                511622199356568855
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="所属区域：" prop="name">
                电饭煲刚拿到房地方
              </el-form-item>
              <el-form-item label="主体类型：" prop="name">
                511622199356568855
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="岗位职务：" prop="name">
                电饭煲刚拿到房地方
              </el-form-item>
              <el-form-item label="人员类型" prop="name">
                511622199356568855
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="行业类型：" prop="name">
                电饭煲刚拿到房地方
              </el-form-item>
              <el-form-item label="从业年限" prop="name">
                2015年-2019年
              </el-form-item>
            </div>
            <el-form-item label="从业经历：" prop="name">
              2000-08 — 2003-10  在鱼香茄子餐馆工作
              2000-08 — 2003-10  在鱼香茄子餐馆工作
            </el-form-item>
            <el-form-item label="从业禁止情况：" prop="name">
              暂无
            </el-form-item>
            <el-form-item label="健康证有效期：" prop="name">
             2021-02-05
            </el-form-item>
          </div>
        </ToggleForm>
        <ToggleForm title="附件上传">
          <div class="content">
            <el-form-item label="健康证：" prop="">
              <div class="imgbox" v-if="fileIdList.length >= 1">
                  <div v-for="(item,index)  in fileIdList" @click.stop="ifbig(item)" class="imgdiv" >
                      <img :src="pathFile + item" alt="">
                      <span>预览</span>
                  </div>
              </div>
              <div v-if="fileIdList.length == 0">
                  <span>无</span>
              </div>
            </el-form-item>
            <el-form-item label="免冠照片：" prop="">
              <div class="imgbox" v-if="fileIdList.length >= 1">
                  <div v-for="(item,index)  in fileIdList" @click.stop="ifbig(item)" class="imgdiv" >
                      <img :src="pathFile + item" alt="">
                      <span>预览</span>
                  </div>
              </div>
              <div v-if="fileIdList.length == 0">
                  <span>无</span>
              </div>
            </el-form-item>
            <el-form-item label="身份证：" prop="">
              <div class="imgbox" v-if="fileIdList.length >= 1">
                  <div v-for="(item,index)  in fileIdList" @click.stop="ifbig(item)" class="imgdiv" >
                      <img :src="pathFile + item" alt="">
                      <span>预览</span>
                  </div>
              </div>
              <div v-if="fileIdList.length == 0">
                  <span>无</span>
              </div>
            </el-form-item>
          </div>
        </ToggleForm>
      </el-form>
    </div>
    <!--图片放大 -->
    <div class='big-img' v-show="showBigPic" @click.stop="handlePictureCardPreview('-1')">
      <img :src="bigImgSrc">
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button class="w100 mr10">返回</el-button>
        <el-button type="primary w100">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  export default {
    data() {
      return {
        pathFile: this.$store.getters.filePath,
       
        bigImgSrc: '',
        showBigPic: false,
        fileIdList: [],
      };
    },
    components: {
      ToggleForm,
    },
    mounted() {
      this.pathFile = this.$store.getters.filePath;
    },
    methods: {
      ifbig(file) {
        let i = file.url;
        if (this.bigImgSrc == null || this.bigImgSrc != i) {
          this.bigImgSrc = i;
          this.showBigPic = true;
        } else {
          this.bigImgSrc = null;
        }
        if (file == -1) {
          this.showBigPic = false;
        }
      },
      
    },
    watch: {}
  };
</script>

<style scoped lang="scss">
  .content {
    width: 700px;
    margin: 30px auto 0;
  }

  .w550 {
    width: 550px !important;
  }

  .w180 {
    width: 180px !important;
  }

  .mb200 {
    margin-bottom: 200px;
  }
  .big-img {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;

    >img {
      max-height: 700px;
      display: block;
    }
  }
    .imgbox{
    // display: flex;
    width: 650px;
    // overflow: hidden;
    margin-left: 100px;
}
.imgdiv{
    float:left;
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
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
        left: 0;
     }
    }
    .imgdiv:hover{
     span{
        display: inline-block;
     }
    }
    .imgbig{
    position: relative;
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