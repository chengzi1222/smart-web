<template>
    <el-form label-width="100px" class="demo-ruleForm" style="margin:40px auto;width:400px;">
        <div class="row">
            <el-form-item label="域名:">
            <span>{{detail.domainName}}</span>
            </el-form-item>
        </div>
        <div class="row">
            <el-form-item label="全称:">
            <span>{{detail.fullName}}</span>
            </el-form-item>
        </div>
        <div class="row">
            <el-form-item label="简称:">
            <span>{{detail.simpleName}}</span>
            </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="登陆之前背景图:">
            <div @click.stop="ifbefore()" class="imgdiv" :class="beforeFlag?'imgbig':''">
              <img :src="detail && detail.before ? $store.getters.filePath + detail.before.fileId : ''" alt="">
              <span>预览</span>
            </div>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="登陆之后背景图:">
            <div @click.stop="ifAfter()" class="imgdiv" :class="afterFlag?'imgbig':''">
              <img :src="detail && detail.after ? $store.getters.filePath + detail.after.fileId : ''" alt="">
              <span>预览</span>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="goEdit()">编辑</el-button>
            <el-button type="primary" @click="goBack()">返回</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

  import * as home from "api/admin/home";

  export default {
    components:{
      
    },
    data() {
      return {
        detail: {
          id: "",
          domainName: "",
          fullName: "",
          simpleName: "",
          before: {},
          after: {}
        },
        afterFlag: false,
        beforeFlag: false
      }
    },
    async mounted(){
      const id = this.$route.query.id;
      home.detail({"id": id}).then(r => {
            if (r.status) {
                this.detail = r.data;
            } else {
                this.$message.warning(r.message);
            }
        })
    },
    methods: {
      goBack(){
        this.$router.push({name: 'home'});
      },
      goEdit(){
        this.$router.push({name: 'home.add', query: {id: this.detail.id, type: 'edit'}});
      },
      ifAfter() {
        this.afterFlag = !this.afterFlag;
      },
      ifbefore() {
        this.beforeFlag = !this.beforeFlag;
      }
    }
  }
</script>

<style lang="scss"  scoped>
.selectHeight{
  max-height:40px !important;
  margin-left: 0px !important;
}
.imgdiv {
    float: left;
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
    img {
      transition: all 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    span {
      display: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.40);
      border-radius: 0 0 5px 5px;
      font-size: 14px;
      color: #FFFFFF;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .imgbig {
    position: relative;
    z-index: 999;
    span {
      display: none !important;
    }
    img {
      transform: scale(2);
      border-radius: 0;
    }
  }  
</style>
