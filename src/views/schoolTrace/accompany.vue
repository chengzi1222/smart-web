<template>
  <div class="wrap">
    <div class="title clear_a">
      <div class="title_left">{{isSchool === true? '食堂陪餐':'就餐情况'}}</div>
      <div class="title_right">
        <el-date-picker
          class="w200 fr"
          @change="getPageData"
          v-model="month"
          type="month"
          :clearable="false"
          align="right"
          :picker-options="option"
          value-format="yyyy-MM"
        ></el-date-picker>
      </div>
    </div>

    <div class="content" v-loading="loading" element-loading-text="拼命加载中">
      <el-scrollbar style="height: 100%">
        <div v-for="(item, index) in pageData" :key="index" v-if="pageData.length > 0">
          <p class="innerBoxTitie">
            <span class="line"></span>
            {{item.mealDate}} {{item.weekDay}}
          </p>
          <div class="imgBox">
            <div class="image" v-for="(array, index1) in item.dtoList" :key="index1">
              <div class="singleImg">
                <img :src="schoolTraceBaseUrl + array.fileDTOList[0].fileUrl" />
                <div>
                  <img
                    class="icon"
                    src="../../assets/img/schoolTrace/tag_breakfast.png"
                    v-if="array.mealOrder == '01'"
                  />
                  <img
                    class="icon"
                    src="../../assets/img/schoolTrace/tag_lunch.png"
                    v-if="array.mealOrder == '02'"
                  />
                  <img
                    class="icon"
                    src="../../assets/img/schoolTrace/tag_dinner.png"
                    v-if="array.mealOrder == '03'"
                  />
                  <span>{{isSchool === true?'陪餐':'上传'}}人员: {{array.attenderName}}{{isSchool === true?`(${array.attenderJob})`:''}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="imgNull" v-if="!pageData.length > 0">
          <img src="../../assets/img/schoolTrace/imgNull.png" />
          <p>当月暂无{{isSchool === true? '陪餐':'就餐'}}记录</p>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/schoolTrace/home";
import config from "../../utils/config";
import { getData } from "../../utils/sessionStorage";

export default {
  name: "accompany",
  data() {
    return {
      pageData: [],
      month: "",
      option: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: false,
      entityId: "",
      schoolTraceBaseUrl: "",
      isSchool:true
    };
  },
  methods: {
    async getPageData() {
      this.loading = true;
      let result = await api.getAccompany({
        entityId: this.entityId,
        queryDate: this.month
      });
      if (result.code == 200) {
        this.pageData = result.data;
        this.month = result.timestamp;
        this.loading = false;
      }
    }
  },
  mounted() {
    if (this.$route.query.entityId) {
      this.entityId = this.$route.query.entityId;
    }
    this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
    this.getPageData();
    this.isSchool = getData("isSchool");
  }
};
</script>

<style lang="scss" scoped>
.el-scrollbar_wrap {
  overflow-x: hidden;
}

.wrap {
  height: 100%;
  width: 100%;
  .title {
    height: 80px;
    line-height: 80px;
    padding: 20px;
    box-sizing: border-box;
    .title_left {
      font-size: 20px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      width: 50%;
      height: 100%;
    }
    .title_right {
      width: 50%;
      height: 100%;
      text-align: right;
    }
  }
  .content {
    width: calc(100% - 40px);
    height: 830px;
    margin: 20px auto;
    background: #ffffff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    p.innerBoxTitie {
      font-size: 16px;
      color: #333;
      margin-bottom: 30px;
      span.line {
        height: 18px;
        width: 4px;
        display: inline-block;
        background: #34c5d7;
        margin-right: 10px;
        position: relative;
        top: 2px;
      }
    }
    .imgNull {
      width: 100%;
      height: 100%;
      text-align: center;
      margin-top: 200px;
      img {
        width: 500px;
        height: 300px;
      }
      p {
        font-size: 18px;
        color: #999999;
        margin-top: 10px;
      }
    }
    .imgBox {
      /*display: -webkit-box;*/
      /*overflow-x: scroll;*/
      /*-webkit-overflow-scrolling: touch;*/
      .tag {
        width: 4px;
        height: 16px;
        display: inline-block;
      }
      .image {
        display: inline-block;
        margin: 15px 0;
        img {
          width: 430px;
          height: 270px;
          margin-right: 10px;
        }
        p {
          margin-left: 5px;
          font-size: 18px;
          color: #333333;
          font-weight: 400;
        }
        .singleImg {
          .icon {
            width: 40px;
            height: 20px;
            margin-top: 5px;
            margin-bottom: -5px;
          }
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
