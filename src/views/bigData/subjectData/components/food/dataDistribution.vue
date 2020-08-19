<template>
  <div style="height:100%;padding: 40px;box-sizing: border-box;background: #050C17;">
    <div class="bigBox">
      <div class="headBox">
        <div class="headLeft">
          <p>阳光厨房数据分布</p>
          <img src="../../../../../assets/img/subjectData/titleLine.png" alt="">
        </div>
        <div class="headRight">
          <span><img src="../../../../../assets/img/subjectData/minBG-blue.png" alt="">摄像头总数</span>
          <span style="margin-left: 60px"><img src="../../../../../assets/img/subjectData/minBG-green.png" alt="">阳光厨房覆盖率</span>
        </div>
      </div>
      <div style="overflow:hidden;height: calc(100% - 190px);" v-if="datas.cameraCountMap && datas.cameraCountMap.length < 3">
        <div class="BGBigBox" :class="jishuNum%2 == 0 ? '':'now'">
          <div class="mainBGBox" v-for="(item, index) in datas.cameraCountMap[chosse]" :key="index" :class="index%5 == 0 ? 'mt10': ''">
            <div class="titleBox">
              <p class="floatL">
                <span>{{item.cameraCount}}</span>
                <span>{{item.areaName}}</span>
              </p>
              <p class="floatR">
                <span>{{datas.cameraCoverageRateMap[chosse][index].areaName}}</span>
                <span>{{datas.cameraCoverageRateMap[chosse][index].coverageRate*100}}%</span>
              </p>
            </div>
            <div class="bGBox floatL BlueBox">
              <div class="minBGBox" :style="{'width': item.cameraCountRate*100 + '%'}"></div>
            </div>
            <div class="bGBox floatR GreenBox">
              <div class="minBGBox" :style="{'width': datas.cameraCoverageRateMap[chosse][index].coverageRate*100 + '%'}"></div>
            </div>
          </div>
        </div>
        <div class="BGBigBox" style="margin-top: 80px;">
          <div class="mainBGBox" v-for="(item, index) in datas.cameraCountMap[chosse+1]" :key="index" :class="index%5 == 0 ? 'mt10': ''">
            <div class="titleBox">
              <p class="floatL">
                <span>{{item.cameraCount}}</span>
                <span>{{item.areaName}}</span>
              </p>
              <p class="floatR">
                <span>{{datas.cameraCoverageRateMap[chosse+1][index].areaName}}</span>
                <span>{{datas.cameraCoverageRateMap[chosse+1][index].coverageRate * 100}}%</span>
              </p>
            </div>
            <div class="bGBox floatL BlueBox">
              <div class="minBGBox" :style="{'width': item.cameraCountRate*100 + '%'}"></div>
            </div>
            <div class="bGBox floatR GreenBox">
              <div class="minBGBox" :style="{'width': datas.cameraCoverageRateMap[chosse+1][index].coverageRate*100 + '%'}"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="overflow:hidden;height: calc(100% - 126px);" v-if="datas.cameraCountMap && datas.cameraCountMap.length >= 3">
        <div class="BGBigBox" :class="jishuNum%2 == 0 ? '':'now'" :style="{'transition': jishuNum%2 == 0 ? 'all 0s':'all 2s'}">
          <div class="mainBGBox" v-for="(item, index) in datas.cameraCountMap[chosse]" :key="index" :class="index%5 == 0 ? 'mt10': ''">
            <div class="titleBox">
              <p class="floatL">
                <span>{{item.cameraCount}}</span>
                <span>{{item.areaName}}</span>
              </p>
              <p class="floatR">
                <span>{{datas.cameraCoverageRateMap[chosse][index].areaName}}</span>
                <span>{{datas.cameraCoverageRateMap[chosse][index].coverageRate * 100}}%</span>
              </p>
            </div>
            <div class="bGBox floatL BlueBox">
              <div class="minBGBox" :style="{'width': item.cameraCountRate*100 + '%'}"></div>
            </div>
            <div class="bGBox floatR GreenBox">
              <div class="minBGBox" :style="{'width': datas.cameraCoverageRateMap[chosse][index].coverageRate*100 + '%'}"></div>
            </div>
          </div>
        </div>
        <div class="BGBigBox">
          <div class="mainBGBox" v-for="(item, index) in datas.cameraCountMap[chosse == maxNum ? 0:chosse+1]" :key="index" :class="index%5 == 0 ? 'mt10': ''">
            <div class="titleBox">
              <p class="floatL">
                <span>{{item.cameraCount}}</span>
                <span>{{item.areaName}}</span>
              </p>
              <p class="floatR">
                <span>{{datas.cameraCoverageRateMap[chosse][index].areaName}}</span>
                <span>{{datas.cameraCoverageRateMap[chosse][index].coverageRate * 100}}%</span>
              </p>
            </div>
            <div class="bGBox floatL BlueBox">
              <div class="minBGBox" :style="{'width': item.cameraCountRate*100 + '%'}"></div>
            </div>
            <div class="bGBox floatR GreenBox">
              <div class="minBGBox" :style="{'width': datas.cameraCoverageRateMap[chosse][index].coverageRate * 100 + '%'}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getReportCameraData } from 'api/bigData/subjectData'
  export default {
    data() {
      return {
        intev: null,
        chosse: 0,
        maxNum: 0,
        jishuNum:0,
        datas: []
      }
    },
    mounted() {
      this.getReportCameraData()
    },
    methods: {
      getReportCameraData(){
        getReportCameraData({ pageSize: 5}).then(r => {
          if (!r.status) {
            return
          }
          this.datas = r.data;
          this.maxNum = this.datas.cameraCountMap.length - 1;
          if (this.datas.cameraCountMap.length == 2) {
            this.intev = setInterval(() => {
              this.jishuNum++;
            }, 10000);
          } else if (this.datas.cameraCountMap.length >= 3) {
            this.intev = setInterval(() => {
              this.jishuNum++;
              setTimeout(() => {
                this.chosse++;
                this.jishuNum++;
                if (this.chosse >= this.datas.cameraCountMap.length) {
                  this.chosse = 0;
                }
              }, 2000);
            }, 10000);
          }
        })
      }
    },
  }
</script>

<style scoped lang="sass">
  button {
    outline: 0 none;
  }

  .BGBigBox {
    width: 100%;
    transition: all 2s;
    margin-top: 0;
  }
  .now{
    margin-top: -800px;
    /* transition: all 0s; */
    /* transform: rotateX(0deg) rotateY(0deg); */
  }

  .mainBGBox {
    overflow: hidden;
    margin-top: 70px;

    .titleBox {
      overflow: hidden;

      p {
        width: 740px;
        font-size: 24px;
        color: #eee;
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
      }
    }

    .bGBox {
      width: 740px;
      background-image: url('../../../../../assets/img/subjectData/bigBG.png');
      height: 19px;

      .minBGBox {
        height: 100%;
      }
    }

    .GreenBox {
      .minBGBox {
        background-image: url('../../../../../assets/img/subjectData/minBG-green.png');
      }
    }

    .BlueBox {
      .minBGBox {
        background-image: url('../../../../../assets/img/subjectData/minBG-blue.png');
        transform: rotate(180deg);
        float: right;
      }
    }

    .floatL {
      margin-left: 100px;
    }

    .floatR {
      margin-right: 100px;
    }
  }

  .bigBox {
    background:rgba(24,34,52,.2);
    border:1px solid rgba(53,122,162,.2);
    height: 100%;
    box-sizing: border-box;
  }

  .headBox {
    padding: 60px;
    overflow: hidden;

    .headLeft {
      float: left;
      min-width: 652px;
      width: 652px;

      p {
        font-size: 40px;
        font-weight: 400;
        color: #eee;
        margin-left: 130px;
      }

      img {
        width: 652px;
      }
    }

    .headRight {
      float: right;
      min-width: 55%;
      text-align: right;
      width: 55%;
      color: #eee;
      padding-top: 20px;
      font-size:20px;
      img{
        margin-right: 20px;
        vertical-align: middle;
      }
    }
  }

  .pieBox {
    width: 100%;
    height: calc(100% - 202px);
  }
</style>