<template>
  <div class="wrap" v-loading="loading" element-loading-text="拼命加载中">
    <div class="header_title">
      <p>证照公示</p>
    </div>

      <div class="content">
         <el-scrollbar style="height: 100%">
        <div class="imgBox overHide">
          <p class="innerBoxTitie"><span class="line"></span>食品经营许可证 / 营业执照</p>
          <div class="image" v-if="pageData.licenseTotal !== 0">
            <div class="singleImg" v-for="(item, index) in buyerLicenseImg" :key="index">
              <img :src='item'>
            </div>
          </div>
          <div class="image" v-if="pageData.licenseTotal == 0">
            <img src="../../assets/img/schoolTrace/imgNull.png">
          </div>
        </div>
        <div class="imgBox">
          <p class="innerBoxTitie"><span class="line"></span>后厨人员健康证</p>
          <div class="image" v-if="healthImg.length > 0">
            <div class="singleImg" v-for="(item, index) in healthImg" :key="index">
              <img :src='item'>
            </div>
          </div>
          <div class="image" v-if="!healthImg.length > 0">
            <img src="../../assets/img/schoolTrace/imgNull.png">
          </div>
        </div>
        </el-scrollbar>
      </div>

  </div>
</template>

<script>
  import * as api from "../../api/schoolTrace/home";

  export default {
    name: "license",
    data() {
      return {
        pageData: {},
        loading: false,
        guid:'',
        healthImg:[],
        buyerLicenseImg:[]
      }
    },
    methods: {
      async getPageData() {
        this.loading = true;
        let result = await api.getDetail({
          guid: this.guid
        })
        this.pageData = result.data
        if(this.pageData.hearthLicenseCnt !== 0){
          let imgList = this.pageData.healthCertificates.split(',');
          imgList.map(item =>{
            this.healthImg.push(item)    //健康证每个图片链接地址加上前缀
          })
        }

        if(result.data.buyerLicenseCnt !== 0){
          if(result.data.bsLicImg !== ''){
            this.buyerLicenseImg.push(result.data.bsLicImg)
          }
          if(result.data.foodLicense !==''){
            this.buyerLicenseImg.push(result.data.foodLicense)
          }
          //商家证照每个图片地址加上前缀,商家证照=食品许可证+营业执照
        }
        this.loading = false;

      },
    },
    mounted() {
      if(this.$route.query.entityId){
        this.guid = this.$route.query.entityId
      }
      this.getPageData()
    }
  }
</script>

<style lang="scss" scoped>

  .wrap {
    height: 100%;
    width: 100%;
    .header_title {
      width: calc(100% - 40px);
      margin: 0 auto;
      p {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        margin-top: 20px;
      }
    }
    .content {
      width: calc(100% - 40px);
      height: 860px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      padding: 20px;
      box-sizing: border-box;
      .imgBox {
        overflow-x: hidden;
        p.innerBoxTitie{
          font-size:16px;
          color: #333;
          margin-bottom: 30px;
          span.line{
            height: 18px;
            width: 4px;
            display: inline-block;
            background: #34C5D7;
            margin-right: 10px;
            position: relative;
            top: 2px;
          }
        }
        .tag {
          width: 4px;
          height: 16px;
          display: inline-block;
        }
        .image {
          /*display: -webkit-box;*/
          /*overflow-x: scroll;*/
          /*-webkit-overflow-scrolling: touch;*/
          margin: 15px 0;
          .singleImg{
            display: inline-block;
          }
          img {
            width: 436px;
            height: 270px;
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>

