<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{entity.entityName}} {{showName}}</span>
      <el-button v-auth="'food.peri.camera|func.add'" type="default" @click="goEdit()">编辑
      </el-button>
      <!--<el-button v-if="this.deviceId" v-auth="'food.peri.camera'" type="default"-->
      <!--@click="screenPic()">点击截图-->
      <!--</el-button>-->
      <el-button v-auth="'food.peri.camera'" type="default" @click="check()">查看截图</el-button>
      <el-button class="w120" type="default">
        <router-link class="golist"
          :to="{name: 'cameraList',query: {id: this.$route.query.id,name: this.entity.entityName}}" target="_blank">
          九宫格模式</router-link>
      </el-button>
      <!-- <el-button class="w140" type="default">
        <router-link class="golist" :to="{name: 'AICamera.subScreen',query: {id: this.$route.query.id,name: this.entity.entityName}}" target="_blank">主体食安指数</router-link>
      </el-button> -->
      <!-- <el-button class="w140" type="default">
        <router-link class="golist" :to="{name: 'AICamera.AIScreen'}" target="_blank">AI智能后厨</router-link>
      </el-button>
      <el-button class="w140" type="default">
        <router-link class="golist" :to="{name: 'bigData.xcws.AIAccompanyScreen'}" target="_blank">AI智能校长陪餐</router-link>
      </el-button> -->
      <el-button class="w140" type="default" v-if='tobId!=""&&tobId!=null'>
        <router-link class="golist" :to="{path: '/xcws/subjectAssess/detail',query:{entityId:tobId}}">食安指数</router-link>
      </el-button>
      <el-button class="w140" type="default" v-if='cameraType=="AI"&&tobId!=""&&tobId!=null'>
        <router-link class="golist" :to="{path:'/xcwsWarn/AIWarnList/detail',query:{entityId:tobId}}" target='_blank'>
          AI预警</router-link>
        <!-- <router-link class="golist" :to="{path:AIscreenshotList.length>0 ? '/xcwsWarn/AIWarnList/detail':'/xcwsWarn/AIWarnList',query:{entityId:tobId}}"  target='_blank'>AI预警</router-link> -->
      </el-button>
      <el-button class="w140" type="default" v-if='cameraType=="AI"&&entityId=="674cbcfffc7c11e9b37cec0d9a37059e"'>
        <router-link class="golist"
          :to="{path: '/AIAccompanyScreen',query: {name:entity.entityName,entityId:'674cbcfffc7c11e9b37cec0d9a37059e'}}"
          target='_blank'>AI校长陪餐</router-link>
      </el-button>
    </div>

    <div class="main-body  video-box clear_a">
      <div class="left">
        <div class="prism-player" style="width:100%;position:relative;" ref='height' id="player">

        </div>
        <div class="handleBtns" v-show="this.ocx.buttonShow">
          <div class="handleBtn" style="width:88%">
            <div :class="this.default_class.bt_1" id="btn01" @click="callOcx"></div>
            <div class="btn_ygcf btn03 ml20" id="btn03" @click="changeClarity()"></div>
          </div>
          <!-- 按ESC退出全屏 -->
          <div class="handleBtn textR" style="width:10%">
            <div class="btn_ygcf btn04 " id="btn04" @click="enableFullScreen()"></div>
          </div>
        </div>
      </div>
      <div class="right h500" ref="right">
        <p class="title">{{entity.entityName}}</p>
        <div class="content">
          <p><span>所属辖区：</span><span>{{entity.deptName}}</span></p>
          <p><span>地址：</span><span>{{entity.realityAddr}}</span></p>
          <p><span>法人：</span><span>{{entity.corpName}}</span></p>
          <p><span>联系方式：</span><span>{{entity.mobile}}</span></p>
        </div>
        <p class="title">直播频道：</p>
        <div class="h280">
          <div v-for="(item,index) in cameraList" :key="index" @click="showNow(item,index);" style="cursor: pointer;"
            :class="{'video-item-active ':index===defaultIndex}" class="video-item clearfix">
            <div class="video-item-pic floatL">
              <div style="width:100%;position:relative;">
                <img :src="item.imgAddr?item.imgAddr+'?x-oss-process=image/resize,h_110':require('assets/img/noFindImg.png')" style="width:100%;height:110px" alt="" />
                <div class="shade">
                  <img style="top: 65%;" :src="require('assets/img/play_icon.png')" class="movePoin">
                </div>
              </div>
            </div>
            <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
              <p class="floatL video-item-title textell">{{item.name}}</p>
            </el-tooltip>
            <el-button type="default" v-if="item.type === 'HK' || item.type === 'DH_CUSTOMIZATION'" class="mt20 ml20" @click.stop="playback(item)">回放
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <yb-popup :isShow="isShow" :title="pop.title" @close="choseMenuPop">
      <div slot="body">
        <div style="width:680px;margin:20px auto 0;">
          <el-form label-width="110px" class="demo-ruleForm ml35">
            <div class="row">
              <el-form-item label="截图预览">
                <img :src="screenshot.picUrl" class="popImg" @error="jtError" @click.stop="ifbig"
                  :class="imgbig ? 'imgbig':''" style="position: relative;z-index: 99;border: 1px solid #a29f9f;">
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="问题描述:(必填)" prop="screenshot.problemItem">
                <el-checkbox-group v-model="screenshot.problemItem" size="large">
                  <el-checkbox-button v-for="item in DictProblemItem" :label="item.code" :key="item.id">{{item.name}}
                  </el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="截图备注：" :prop="screenshot.remark">
                <el-input type="textarea" :rows="5" v-model="screenshot.remark" class="w400" :maxlength="300"
                  placeholder="请输入截图备注，不超过300字，选填"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="foot" style="height:32px;">
        <el-button type="default" @click="choseMenuPop();">取消</el-button>
        <el-button type="primary" @click="confirm();" :disabled="isConfirm">确定</el-button>
      </div>
    </yb-popup>
    <toggle-form title="当前直播点回放视频" v-show="this.backList.length>0">
      <div style="margin-top: 20px;">
        <div class="slideBox mb20" v-loading="backloading" element-loading-text="数据正在努力加载中">
          <ul class="ULbox clear_a">
            <li v-for="(data,index) in backList" @click="onBackBegan(data,index)">
              <div class="flag" v-if="index==backIndex">当前回放</div>
              <div class="hover"><img :src="hoverImg"></div>
              <div class="imgbox"><img :src="moRenImg"></div>
              <el-tooltip effect="dark" placement="top-start">

                <div slot="content">{{data.beginTime}} 至 {{data.endTime}}</div>
                <p class="textell imgp">回放时间:{{data.beginTime}} 至 {{data.endTime}}</p>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div style="text-align:center;">
          <el-button @click="loadmore" type="primary">加载更多</el-button>
        </div>
      </div>
    </toggle-form>
    <toggle-form title="AI摄像头" v-if='cameraType=="AI"'>
      <div class="user-box">
        <ul class="AIulbox clear_a" v-if="AiHotList.length>0">
          <li v-for="(item,index) in AiHotList" :key="item.id" class="maR20">
            <router-link
              :to="{name: 'AICamera.AIScreen',query: {index: index,name:entity.entityName,entityId:entityId}}"
              target="_blank">
              <div class="imgbox" style="cursor: pointer">
                <div style="width:100%;position:relative;">
                  <img :src="item.imgAddr" style="width:100%;height:200px;" @error="AiHotListNotFindImg(index)" />
                  <div class="shade">
                    <img :src="require('assets/img/play_icon.png')" class="movePoin">
                  </div>
                  <div class="line">{{item.channelName}}</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
        <p v-else style="font-size: 18px;text-align: center;line-height: 40px;color: #9a9494;margint-top:20px;">暂无数据</p>
      </div>
    </toggle-form>
    <toggle-form title="AI预警截图" v-if='cameraType=="AI"'>
      <div style="margin-top: 20px;">
        <div class="clear_a" id="jt">
          <el-select v-model="AIscreenshot.picNames" collapse-tags class="mr20" placeholder="问题类型" multiple
            @change="getAIscreenshotSearch">
            <el-option v-for="item in picNamesList" :key="item.key" :label="item.key" :value="item.key">
            </el-option>
          </el-select>
          <el-select v-model="AIscreenshot.channelNames" collapse-tags class="mr20" placeholder="摄像头点位" multiple
            @change="getAIscreenshotSearch">
            <el-option v-for="item in channelNameList" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <enum-select v-model="AIscreenshot.order" placeholder="排序方式" @change="getAIscreenshotSearch"
            enum="com.ybveg.govx.enums.SortEnum"></enum-select>
          <div class="clear_a">
            <el-date-picker @change="getAIscreenshotSearch" value-format="yyyy-MM-dd" class="selectHeight" type="date"
              v-model="AIscreenshot.startTime" placeholder="起始时间" :picker-options="beforeDate1"></el-date-picker>
            <div style="line-height:34px;text-align:center;width:30px;">至</div>
            <el-date-picker @change="getAIscreenshotSearch" value-format="yyyy-MM-dd" v-model="AIscreenshot.endTime"
              class="selectHeight" style="margin-left:0 !important;" type="date" placeholder="截止时间"
              :picker-options="afterDate1"></el-date-picker>
          </div>
        </div>
        <div class="slideBox mb20" v-loading="AIpicloading" v-if="AIscreenshotList.length>0">
          <ul class="ULbox clear_a">
            <li v-for="(item,index) in AIscreenshotList" @click="goDetail(item,'AI');" style="cursor: pointer">
              <div class="flag" :title="item.channelName">{{item.channelName}}</div>
              <img v-if="item.aIPlatform === 'HK'" :src="pathFile+item.bgUrl+'?x-oss-process=image/resize,h_200'" style="width:100%;height:200px;" />
              <img v-if="item.aIPlatform === 'AL'" :src="AIscreenshotUrl+item.bgUrl+'?x-oss-process=image/resize,h_200'" style="width:100%;height:200px;" />
              <img v-if="item.aIPlatform === 'DH'" :src="item.bgUrl" style="width:100%;height:200px;" />
              <div class="shade">
                <el-tooltip class="item" effect="dark" :content="item.warningTime" placement="top-start">
                  <p class="textell">截图时间:{{item.warningTime}}</p>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="item.picName" placement="top-start">
                  <p class="textell">问题描述:{{item.picName}}</p>
                </el-tooltip>
              </div>
              <div class="line"></div>
            </li>
          </ul>
        </div>
        <p v-if="AIscreenshotList.length==0" style="text-align:center;margin-top: 25px;">暂无数据</p>
        <div class="pagination-box " style=" text-align: right;margin-top: 20px;">
          <el-pagination background @size-change="AIscreenPagecChange" @current-change="AIscreenCurrentChange"
            :current-page="AIscreenshot.pageNum" :page-sizes="[10,25,50,75,100]" :page-size="AIscreenshot.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="AIscreenshot.total">
          </el-pagination>
        </div>
      </div>
    </toggle-form>
    <toggle-form title="视频截图">
      <div style="margin-top: 20px;">
        <div class="clear_a" style="margin-left:-20px;" id="jt">
          <enum-select v-model="condition.sort" placeholder="排序方式" @change="searchScreenshot"
            enum="com.ybveg.govx.enums.SortEnum"></enum-select>
          <el-select v-model="condition.imgdescription" collapse-tags placeholder="问题描述" class="selectHeight" multiple
            @change="searchScreenshot">
            <el-option v-for="item in DictProblemItem" :key="item.id" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
          <div class="clear_a">
            <el-date-picker @change="searchScreenshot" value-format="yyyy-MM-dd" class="selectHeight" type="date"
              v-model="condition.beginDate" placeholder="起始时间" :picker-options="beforeDate"></el-date-picker>
            <div style="line-height:34px;text-align:center;width:30px;">至</div>
            <el-date-picker @change="searchScreenshot" value-format="yyyy-MM-dd" v-model="condition.endDate"
              class="selectHeight" style="margin-left:0 !important;" type="date" placeholder="截止时间"
              :picker-options="afterDate"></el-date-picker>
          </div>
        </div>
        <div class="slideBox mb20" v-loading="picloading" v-if="screenshotList.length>0">
          <ul class="ULbox clear_a">
            <li v-for="(item,index) in screenshotList" @click="goDetail(item,'');" style="cursor: pointer">
              <div class="flag" :title="item.cameraName">{{item.cameraName.length > 5
                ? item.cameraName.substring(0, 5) + "..." : item.cameraName}}
              </div>
              <img :src="pathFile+item.fileId+'?x-oss-process=image/resize,h_200'" style="width:100%;height:200px;" />
              <div class="shade">
                <el-tooltip class="item" effect="dark" :content="item.shotTime" placement="top-start">
                  <p class="textell">截图时间:{{item.shotTime}}</p>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="item.picName" placement="top-start">
                  <p class="textell">问题描述:{{item.picName}}</p>
                </el-tooltip>
              </div>
              <div class="line"></div>
            </li>
          </ul>
        </div>
        <p v-if="screenshotList.length==0" style="text-align:center;margin-top: 25px;">暂无数据</p>
        <div class="pagination-box mb20" style=" text-align: right;margin-top: 20px;">
          <el-pagination background @size-change="screenPagecChange" @current-change="screenCurrentChange"
            :current-page="screenshotPage.pageNum" :page-sizes="[10, 15, 20]" :page-size="screenshotPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="screenshotPage.total">
          </el-pagination>
        </div>
      </div>
    </toggle-form>
    <yb-popup :isShow="screenpop.isShow" :title="screenpop.title" @close="choseScreenPop" width="940">
      <div slot="body">
        <div style="margin:20px;" class="clear_a">
          <div class="leftImg" @click="showImg=!showImg" :class="{'bigImg':showImg}">
            <img v-if='screenpop.type!="AI"' :src="pathFile+screenpop.url">
            <img v-if='screenpop.type=="AI" && screenpop.aIPlatform =="HK"' :src="pathFile+screenpop.url">
            <img v-if='screenpop.type=="AI" && screenpop.aIPlatform =="AL"' :src="AIscreenshotUrl+screenpop.url">
            <img v-if='screenpop.type=="AI" && screenpop.aIPlatform =="DH"' :src="screenpop.url">
          </div>
          <ul class="rightText">
            <li>主体名称：{{screenpop.entityName}}</li>
            <li>直播点位：{{screenpop.cameraName}}</li>
            <li>截图时间：{{screenpop.shotTime}}</li>
            <li>联系方式：{{screenpop.mobile}}</li>
            <li>实际地址：{{screenpop.realityAddr}}</li>
            <li>问题描述：{{screenpop.picName}}</li>
            <li v-if='screenpop.type!="AI"' style="max-height: 150px;overflow-y: auto;">截图备注：{{screenpop.remark}}</li>
          </ul>
        </div>
      </div>
      <div slot="foot" style="height:32px;">
        <el-button type="default" @click="confirmDown(screenpop.type,screenpop.url,screenpop.shotTime,screenpop.aIPlatform);"
          v-if="screenpop.url">下载
        </el-button>
        <el-button type="default" @click="choseScreenPop();">关闭</el-button>
      </div>
    </yb-popup>
    <hk-playback :url="hkPlaybackUrl" :entityName="entity.entityName" :cameraName="cameraName" :token="hkToken" 
      v-if="playFlag" @close="close"></hk-playback>
    <dh-playback :entityName="entity.entityName" :cameraName="cameraName" :token="hkToken"  :id="cameraId"
      v-if="playFlagDH" @close="closeDH"></dh-playback>
  </div>
</template> 
<script>
  import {
    getEntity,
    getListCamerasByEntityId,
    getListBack,
    initToken,
    uploadBase64
  } from 'api/peri/camera'
  import {
    screenShot_,
    addscreenShot,
    listDictUserItemByCodeAll,
    findPage
  } from 'api/peri/screenshot'
  import {
    downloadFile,
    downloadFileOss,
    downloadFileDH
  } from "api/common";
  import YbPopup from 'components/ybpopup/YbPopup.vue';
  import EnumSelect from 'components/common/EnumSelect.vue';
  import ToggleForm from 'components/ToggleForm'
  import HkPlayback from './hkPlayback.vue'
  import DhPlayback from './DHPlayback.vue'
  import * as api from "api/bigData/AICamera.js"
  import {
    getEnums
  } from "api/common"

  import "static/dhplayer/css/newStyle.css"
  import "static/dhplayer/css/plugin.css"
  import "static/dhplayer/js/jquery-1.11.3.min.js"

  export default {
    computed: {
      pathFile(val) {
        return this.$store.getters.filePath
      }
    },
    created(){
      if(window.location.href.indexOf('https')!=-1){
        window.location.href = window.location.href.replace(/https/, "http")
      }
    },
    async mounted() {
      this.$message({
        type: 'warning',
        showClose: true,
        duration: 5000,
        message: this.$createElement('p', {
            style: 'width: 578px;color: #e6a23c;'
          },
          '网页端暂不支持视频回放，如有查看视频回放的需要，请使用移动监管APP')
      });
      this.cameraType = this.$route.query.cameraType;
      this.tobId = this.$route.query.tobId;
      this.entityId = this.$route.query.id;
      //主体信息
      let resultData = await getEntity(this.entityId);
      this.entity = resultData.data;

      await this.getCameraListByEntityIdForDetail(); //摄像头列表

      if (this.cameraList.length > 0) {
        this.showName = this.cameraList[0].name;
        this.screenshot.cameraId = this.cameraList[0].id;
        this.deviceId = this.cameraList[0].deviceId;
        this.getToken();
        //是否自动播放
        const autostart = true;
        this.playFlow(autostart, this.cameraList[0].playerAddr);
      }

      //Ai
      if (this.cameraType == 'AI') {
        this.AIscreenshot.entityId = this.entityId;
        getEnums(this.enum, false).then((r) => {
          this.picNamesList = r.data
        });
        this.getAiImgAddr()
      }
      //回放列表
      if (false) {
        this.backPage.beginTime = this.getDay(-2);
        this.backPage.endTime = this.getDay(0);
        this.listBcak();
      }
      this.searchScreenshot();
      listDictUserItemByCodeAll("SPD").then((r) => {
        this.DictProblemItem = r.data;
      });
    },
    //离开页面时销毁播放器，停止流直播
    beforeDestroy: function () {
      this.$message.closeAll();
      var player = this.player;
      player.dispose();
    },
    components: {
      ToggleForm,
      YbPopup,
      EnumSelect,
      HkPlayback, 
      DhPlayback
    },
    methods: {
      changeURLArg(url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
          var tmp = '/(' + arg + '=)([^&]*)/gi';
          tmp = url.replace(eval(tmp), replaceText);
          return tmp;
        } else {
          if (url.match('[\?]')) {
            return url + '&' + replaceText;
          } else {
            return url + '?' + replaceText;
          }
        }
      },
      getAIscreenshotSearch() {
        this.AIscreenshot.pageNum = 1;
        this.getAIscreenshot();
      },
      getAIscreenshot() {
        this.AIpicloading = true;
        api.getAIscreenshot(this.AIscreenshot).then(r => {
          if (r.status && r.data) {
            this.AIscreenshotList = r.data.list;
            this.AIscreenshot.total = r.data.total;
          }
          this.AIpicloading = false;
        })
      },
      AIscreenPagecChange(size) {
        this.AIscreenshot.pageSize = size;
        this.AIscreenshot.pageNum = 1;
        this.getAIscreenshot();
      },
      AIscreenCurrentChange(num) {
        this.AIscreenshot.pageNum = num;
        this.getAIscreenshot();
      },
      getAiImgAddr() {
        api.channelNameList(this.entityId).then(r => {
          if (!r.status || !r.data) {
            return
          }
          let arr = r.data;
          arr.map(item => {
            this.channelNameList.push({
              name: item,
              key: item
            })
          })
        })
        api.getAiCaremaAddr(this.entityId).then(r=>{
          if(!r.status||!r.data){this.$message.error('AI摄像头视频流地址获取失败');return}
          let list = r.data.list
          // 设置返回图片的高度, 缩减大小
          if(list.length>0) {
            list.forEach(item => {
              item.imgAddr += '?x-oss-process=image/resize,h_200'
            });
          }
          this.AiHotList = list;
        })
        this.getAIscreenshot();
      },
      AiHotListNotFindImg(i) {
        this.AiHotList[i].imgAddr = require('assets/img/noFindImg.png');
      },
      AiHotListGoDetail(item, i) {
        this.$router.push({
          name: 'AICamera.AIScreen',
          query: {
            index: i,
            name: this.entity.entityName,
            entityId: this.entityId
          }
        });
      },
      async playback(row) {
        this.cameraId = row.id
        if(row.type !== 'DH_CUSTOMIZATION'){
          this.hkPlaybackUrl = this.hkPlaybackAddress + '/' + row.deviceId + '/' + row.channel + '.rec'
          this.playFlag = true
        }else{
          this.playFlagDH = true
        }
        this.cameraName = row.name
        this.cameraNo = row.no
        this.cameraChannel = row.channel
      },
      close() {
        this.playFlag = false
      },
      closeDH(){
        this.playFlagDH = false
      },
      check() {
        let e = document.getElementsByClassName('app-container')[0]
        e.scrollTop = e.scrollHeight;
      },
      goEdit() {
        this.$router.push({
          name: "camera.manage.edit",
          query: {
            id: this.entityId
          }
        });
      },
      async getCameraListByEntityIdForDetail() {
        let result = await getListCamerasByEntityId(this.entityId, "detail");
        let list = result.data
        this.cameraList = list;
      },
      showNow(item, index) {
        this.showName = item.name;
        this.screenshot.cameraId = item.id;
        this.deviceId = item.deviceId;
        //切换播放源
        var player = this.player;
        player.loadByUrl(item.playerAddr);
        this.defaultIndex = index
      },
      playFlow(autostart, playerAddr) {
        var videoObj = {
          "id": "player",
          "source": playerAddr,
          "width": "100%",
          "height": "520px",
          "autoplay": autostart,
          "isLive": true,
          "rePlay": false,
          "playsinline": true,
          "preload": true,
          "language": "zh-cn",
          "controlBarVisibility": "hover",
          "useH5Prism": true,
          "extraInfo": {
            "crossOrigin": "anonymous"
          },
          "skinLayout": [{
              "name": "bigPlayButton",
              "align": "blabs",
              "x": 30,
              "y": 80
            },
            {
              "name": "H5Loading",
              "align": "cc"
            },
            {
              "name": "infoDisplay"
            },
            {
              "name": "tooltip",
              "align": "blabs",
              "x": 0,
              "y": 56
            },
            {
              "name": "thumbnail"
            },
            {
              "name": "controlBar",
              "align": "blabs",
              "x": 0,
              "y": 0,
              "children": [{
                  "name": "playButton",
                  "align": "tl",
                  "x": 15,
                  "y": 12
                },
                {
                  "name": "fullScreenButton",
                  "align": "tr",
                  "x": 10,
                  "y": 12
                },
                {
                  "name": "volume",
                  "align": "tr",
                  "x": 5,
                  "y": 10
                },
                {
                  "name": "snapshot",
                  "align": "tr",
                  "x": 5,
                  "y": 12
                },
              ]
            }
          ]
        }
        var player = new Aliplayer(videoObj, function (player) {
          console.log("播放器创建了。");
        })
        //截图
        player.on('snapshoted', (data) => {
          var pictureData = data.paramData.base64;
          this.isShow = true;
          if (pictureData) {
            player.fullscreenService.cancelFullScreen();
            this.screenshot.picUrl = pictureData;
            this.load_img_server = pictureData;
          } else {
            this.screenshot.picUrl = this.serverErrorJt_img;
          }
        });
        this.player = player;
      },
      //保存截图
      confirm() {
        this.isConfirm = true;
        //不让重复保存截图
        if (this.screenshot.picUrl == this.jt_load_img) { //请求太慢。已经点击确定按钮处理
          this.$message.warning('请稍等，截图请求成功后才能保存！');
          this.isConfirm = false;
          return;
        }
        if (this.screenshot.picUrl == this.serverErrorJt_img) { //请求失败。点击确定按钮处理
          this.$message.warning('获取图片失败,不可保存,请关闭弹框重新截图！');
          this.isConfirm = false;
          return;
        }
        if (this.screenshot.picUrl == this.jt_load_Error_img) { //预览失败时替换成请求回来的图片提交
          this.screenshot.picUrl = this.load_img_server
        }
        if (this.screenshot.problemItem.length <= 0) {
          this.$message.warning('问题描述必填!');
          this.isConfirm = false;
          return;
        }
        let params = this.screenshot;
        params.base64 = this.screenshot.picUrl;
        params.type = "CAMERA";
        params.field = "CAMERA_SCREENSHOT";
        params.filename = "yb" + Date.now();
        uploadBase64(params).then(result => {
          if (result.status) {
            this.$message({
              message: '截图成功',
              type: 'success'
            });
            this.searchScreenshot();
            this.choseMenuPop();
          }
        })
      },
      choseMenuPop() {
        this.isConfirm = false;
        this.isShow = false;
        this.screenshot.picUrl = this.jt_load_img;
        this.screenshot.remark = "";
        this.screenshot.problemItem = [];
        this.imgbig = false;
      },
      jtError() {
        this.screenshot.picUrl = this.jt_load_Error_img;
      },
      //图片放大
      ifbig() {
        if (this.imgbig == false) {
          this.imgbig = true;
        } else {
          this.imgbig = false;
        }
      },
      //判断插件环境
      checkSYS() {
        if (this.isWindows()) {
          return this.isIe();
        } else {
          return false;
        }
      },
      /**
       * 是否为windows系统
       * */
      isWindows() {
        return /windows|win32/i.test(navigator.userAgent);
      },
      //判断浏览器
      isIe() {
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE || isIE11) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          var fIEVersion = parseFloat(RegExp["$1"]);
          if (fIEVersion <= 8) {
            this.$message.warning("请用IE8以上的浏览器");
            return false;
          } else {
            var hasPlugin = this.hasIEPlugin('LCOPENSDKPLUGIN.LCOpenSDKPlugInCtrl.1');
            if (true == hasPlugin) { //已安装插件
              return true
            } else {
              this.$message.warning("请安装直播插件");
              return false;
            }
          }
        } else if (isEdge) {
          var hasPlugin = this.hasIEPlugin('LCOPENSDKPLUGIN.LCOpenSDKPlugInCtrl.1');
          if (true == hasPlugin) { //已安装插件
            return true
          } else {
            this.$message.warning("请安装直播插件");
            return false;
          }
        } else {
          return false;
        }
      },
      //检查系统插件
      hasIEPlugin(name) {
        try {
          var comActiveX = new ActiveXObject(name);
          //          delete comActiveX;
          return true;
        } catch (e) {
          return false;
        }

      },
      //获取token
      getToken() {
        initToken().then((result => {
          this.token = result.data.token
          this.hkToken = result.data.hkToken
          this.hkPlaybackAddress = result.data.hkPlaybackAddress
        }))
      },
      //1播放，0暂停
      callOcx() {
        console.log("播放+ ")
        //如果正处于回放播放状态
        if (0 == this.ocx.backStopOrPlay) {
          this.stopBack();
        }
        if (1 == this.ocx.stopOrPlay) {
          var ocx = document.getElementById('LCOpenSDKPlugIn');
          ocx.setAttribute("width", "1");
          ocx.setAttribute("height", "1");
          this.toPlayBtn(); //按钮状态
          LCOpenSDKPlugIn.openLog(1);
          LCOpenSDKPlugIn.initOpenApi(this.ocx.environment, this.ocx.port);
          var iRes = LCOpenSDKPlugIn.playRtspReal(this.token, this.deviceId, "0", this.clarity);
          this.playAudio();
          this.onPlayBegan();
          if (iRes == -1) {
            this.$message.success("提示：播放失败");
            return;
          }
        } else {
          this.toStopBtn();
          this.StopOcx(); //停止直播，并改变按钮状态
        }
      },
      //切换播放按钮状态
      toPlayBtn() {
        this.ocx.stopOrPlay = 0;
        this.default_class.bt_1 = "btn_ygcf btn01";
        console.log("播放" + "......." + this.ocx.stopOrPlay)
      },
      //切换暂停按钮状态
      toStopBtn() {
        this.ocx.stopOrPlay = 1;
        this.default_class.bt_1 = "btn_ygcf btn01_other";
        console.log("暂停" + "......." + this.ocx.stopOrPlay)
      },
      //停止直播
      StopOcx() {
        this.ocxallowToFullscreen = false;
        LCOpenSDKPlugIn.stopRtspReal();
        this.stopAudio();
      },
      onPlayBegan(index) {
        var ocx = document.getElementById('LCOpenSDKPlugIn');
        ocx.setAttribute("width", "100%");
        ocx.setAttribute("height", "473");
      },
      //点击回放
      onBackBegan(data, index) {
        this.backIndex = index;
        console.log("回放+ ");
        console.log("recordId====" + data.recordId)
        //如果正在播放,则先停止直播
        if (this.ocx.stopOrPlay == 0) {
          this.stopBack(); //关闭回放，改变按钮状态
        }
        //如果回放播放状态,则先停止回放
        if (0 == this.ocx.backStopOrPlay) {
          this.stopBack();
        }
        //如果正处于回放暂停状态
        if (1 == this.ocx.backStopOrPlay) {
          this.toPlayBtn(); //按钮状态
          var iRes = LCOpenSDKPlugIn.playCloud(this.token, this.deviceId, data.recordId);

          //          this.onPlayBegan();
          if (iRes == -1) {
            this.$message.success("提示：回放失败");
            return;
          }
        } else {
          this.toStopBtn(); //按钮状态
          this.stopBack(); //关闭回放，改变按钮状态
        }
      },
      //停止回放
      stopBack() {
        LCOpenSDKPlugIn.stopCloud();
      },
      //播放声音
      playAudio() {
        LCOpenSDKPlugIn.playAudio();
      },
      //关闭声音
      stopAudio() {
        LCOpenSDKPlugIn.stopAudio();
      },
      //全屏
      enableFullScreen() {
        if (this.ocx.allowToFullscreen) {
          LCOpenSDKPlugIn.enableFullScreen(1); //全屏
        } else if (this.ocx.stopOrPlay == 1) {
          this.$message.success("提示：停止播放状态不能切换全屏");
          return;
        } else {
          this.$message.success("提示：异常状态不能切换全屏");
          return;
        }
      },
      //回放列表
      listBcak() {
        this.backPage.deviceId = this.deviceId;
        this.backPage.queryRange = (this.backPage.pageNum + 1) + "-" + this.backPage.pageSize
        getListBack(this.backPage).then((result => {
          if (result.status) {
            let newlist = result.data.list;
            let oldlist = this.backList;
            oldlist.addAll(newlist);
            this.backList = oldlist;
            this.backloading = false;
          }
        }))
      },
      loadmore() {
        let endTime = this.backPage.beginTime;
        let beginTime = this.getDay(endTime, -1);
        this.listBcak();
      },
      selectByDate() {
        let endTime = new Date();
        let beginTime = this.getDay(new Date(), -1);
        this.backPage.beginTime = beginTime;
        this.backPage.endTime = endTime;
        console.log(endTime);
        console.log(beginTime);
        this.listBcak();
      },
      //获取时间
      getDay(today, hours) {
        let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * hours * 1;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        let tYear = today.getFullYear();
        let tMonth = today.getMonth();
        let tDate = today.getDate();
        let tHours = today.getHours();
        let tMinute = today.getMinutes();
        let tSecond = today.getSeconds();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        tHours = this.doHandleMonth(tHours);
        tMinute = this.doHandleMonth(tMinute);
        tSecond = this.doHandleMonth(tSecond);
        return tYear + "-" + tMonth + "-" + tDate + " " + tHours + ":" + tMinute + ":" + tSecond;
      },
      //时间，当为个位数时前面用0占位
      doHandleMonth(time) {
        let m = time;
        if (time.toString().length == 1) {
          m = "0" + time;
        }
        return m;
      },
      //      ************截图**************
      //截图列表
      searchScreenshot() {
        this.screenshotPage.pageNum = 1
        this.searchScreenshotPage()

      },
      searchScreenshotPage() {
        let params = this.condition;
        params.entityId = this.entityId;
        var formData = {
          params: params,
          num: this.screenshotPage.pageNum,
          size: this.screenshotPage.pageSize,
        };
        findPage(formData).then((result) => {
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
          this.screenshotPage.total = result.data.total;
          this.screenshotList = result.data.list;
          this.picloading = false;
        });
      },
      //截图分页
      screenPagecChange(size) {
        this.picloading = true;
        this.screenshotPage.pageSize = size;
        this.searchScreenshot();
      },
      screenCurrentChange(num) {
        this.picloading = true;
        this.screenshotPage.pageNum = num;
        this.searchScreenshotPage();
      },
      //截图详情
      goDetail(item, type) {
        this.screenpop.type = type;
        this.screenpop.isShow = true;
        this.screenpop.entityName = item.entityName;
        this.screenpop.mobile = item.mobile;
        this.screenpop.picName = item.picName;
        this.screenpop.aIPlatform = item.aIPlatform;
        if (this.screenpop.type != 'AI') {
          this.screenpop.url = item.fileId;
          this.screenpop.cameraName = item.cameraName;
          this.screenpop.shotTime = item.shotTime;
          this.screenpop.remark = item.remark;
          this.screenpop.realityAddr = item.realityAddr;
        } else {
          this.screenpop.url = item.bgUrl;
          this.screenpop.cameraName = item.channelName;
          this.screenpop.realityAddr = item.address;
          this.screenpop.shotTime = item.warningTime;
        }
        if(this.screenpop.title.indexOf('（AI截图）') == -1 && this.screenpop.title.indexOf('（手动截图）') == -1) {
          this.screenpop.title = this.screenpop.type=='AI'?this.screenpop.title +'（AI截图）':this.screenpop.title  +'（手动截图）';
        }
      },
      //关闭弹窗
      choseScreenPop() {
        document.querySelector(".app-container").scrollTop = '0';
        this.screenpop.isShow = false;

      },
      //下载图片
      confirmDown(type, fileId, time, aIPlatform) {
        if (type == 'AI') {
          if(aIPlatform === "AL") {
            downloadFileOss(fileId, "AI截图" + this.entity.entityName + time)
          } else if(aIPlatform === "HK"){
            downloadFile(fileId, "AI截图" + this.entity.entityName + time)
          } else { // DH
            downloadFileDH(fileId, "AI截图" + this.entity.entityName + time)
          }
        } else {
          downloadFile(fileId, "手动截图" + this.entity.entityName + time);
        }

      },
    },
    data() {
      return {
        cameraType: '',
        picNamesList: [],
        enum: ['com.ybveg.govx.enums.alienum.AliAICameraTypeEnum'],
        // AiEntityId:'false',
        // AiEntityId: '674cbcfffc7c11e9b37cec0d9a37059e',
        //正式主体 674cbcfffc7c11e9b37cec0d9a37059e 成都市教育科学研究院附属学校（天府实验学校）
        AiEntityId: '003c34f3648c4c8aaf8a8049fcc8d706',
        // 临时测试主体  成华区陈亚丹小吃店
        // tobId:'CD1CC08E38A44AADBC47ACCD05D41BAF',
        // 正式tobId  成都市教育科学研究院附属学校（天府实验学校）
        tobId: '03C74B33E1CF4854862A0A1CBA368379',
        // 临时tobId  成华区陈亚丹小吃店
        AiHotList: [
          //   {
          //   id: "8ffd1e77bd6611e8b1eb7cd30ae07f60",
          //   imgAddr: require('assets/img/noFindImg.png'),
          // }
        ],
        AIscreenshotUrl: 'http://aicamera-pic-res.ybveg.com/',
        AIscreenshot: {
          entityId: '',
          channelNames: [],
          endTime: '',
          startTime: '',
          order: '',
          pageNum: 1,
          pageSize: 10,
          picNames: [],
          sort: '',
          total: 0
        },
        AIscreenshotList: [],
        AIpicloading: true,
        channelNameList: [],

        // pathFile:'',
        playFlag: false,
        playFlagDH:false,
        serverErrorJt_img: require('assets/img/serverErrorJt.png'), //截图服务器请求失败图片
        load_img_server: '', //预览失败时需要一个变量保存请求回来的路径
        jt_load_img: require('assets/img/pic_loading.png'), //截图预览图片loading效果
        jt_load_Error_img: require('assets/img/jtError.png'), //截图预览失败的效果
        height: 473,
        pickerOptions: {
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 7 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;;
          }
        },
        moRenImg: require('assets/img/noFindImg.png'),
        pop: {
          title: "直播截图",
          url: require('assets/img/map/point_default_x2.png'),
          input1: '',
          input2: ''
        },
        imgbig: false,
        isShow: false,
        defaultIndex: 0,
        entityId: "",
        entity: {},
        cameraList: [],
        screenshotList: [],
        DictProblemItem: [],
        showName: "",
        player: null, //播放对象
        deviceId: "", //摄像头设备ID
        //图片列表加载
        picloading: true,
        //视屏加载
        backloading: true,
        //截图信息
        screenshot: {
          cameraId: null,
          remark: null,
          picUrl: require('assets/img/pic_loading.png'),
          problemItem: []
        },
        isConfirm: false, //截图保存按钮是否禁用,false为默认启用
        sys: null, //用于判断是否为IE
        token: "", //token
        hkToken: '', // 海康摄像头token
        hkPlaybackUrl: '', // 海康摄像头回放地址
        cameraName: '', // 摄像头名称
        hkPlaybackAddress: '', // 海康摄像头回放请求域名
        ocx: {
          buttonShow: false, //按钮是否显示
          environment: "openapi.lechange.cn",
          port: "443",
          allowToFullscreen: true, //是否允许全屏
          stopOrPlay: 1, // 0正在播放 1正在暂停
          backStopOrPlay: 1, //0正在回放  1正在暂停
          clarity: 1, //0 高清   1标清
        },
        default_class: {
          bt_1: "btn_ygcf btn01_other",
        },
        backPage: {
          deviceId: "",
          channelId: "0",
          beginTime: "",
          endTime: "",
          pageNum: 0,
          pageSize: 10,
        },
        backTimes: '',
        screenshotPage: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        afterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.condition.beginDate);
            if (this.condition.beginDate) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.condition.endDate);
            if (this.condition.endDate) {
              return time.getTime() > endDate;
            }
          }
        },
        afterDate1: {
          disabledDate: (time) => {
            let startDate = new Date(this.AIscreenshot.startTime);
            if (this.AIscreenshot.startTime) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate1: {
          disabledDate: (time) => {
            let endDate = new Date(this.AIscreenshot.endTime);
            if (this.AIscreenshot.endTime) {
              return time.getTime() > endDate;
            }
          }
        },
        condition: {
          search: "",
          sort: "DESC",
          imgdescription: [],
          beginDate: "",
          endDate: "",
          entityId: "",
        },
        backList: [],
        hoverImg: require('assets/img/play_icon.svg'),
        backIndex: null,
        //弹窗
        showImg: false,
        screenpop: {
          type: '',
          isShow: false,
          title: "截图详情",
          url: "",
          entityName: "",
          shotTime: "",
          mobile: "",
          cameraName: "",
          remark: "",
          realityAddr: "",
          picName: "",
          aIPlatform: ""
        },
        videoType:'',
        cameraId:''
      };
    }
  };
</script>

<style scoped lang='scss'>
  .page-tilt {
    padding-top: 15px;
  }

  .page-tilt .el-button {
    width: 100px;
  }

  .video-box {
    margin-top: 30px;
    display: flex;
    flex-wrap: nowrap;
  }

  .video-box .left,
  .video-box .right {
    /* height: 560px; */
    box-sizing: border-box;
  }

  .video-box .left {
    flex: 1;
    /* background: black; */
  }

  .video-box .right {
    width: 450px;
    background: #394145;
    overflow-y: auto;
    padding: 20px 30px;
  }

  .video-box .title {
    font-size: 16px;
    color: #FFFFFF;
    margin-bottom: 10px;
  }

  .video-box .content {
    font-size: 14px;
    color: #A2AAB6;
    line-height: 26px;
    margin-bottom: 20px;
  }

  .video-box .video-item {
    font-size: 16px;
    color: #A2AAB6;
    margin-bottom: 20px;
  }

  .video-box .video-item .video-item-pic {
    width: 60%;
    height: 111px;
    box-sizing: border-box;
    margin-right: 5%;
    cursor: pointer;
    overflow: hidden;
  }

  .video-box .video-item .video-item-pic img {
    width: 100%;
    height: 100%;
  }

  .video-box .video-item .video-item-title {
    margin-top: 38px;
    width: 35%;
    word-break: break-all;
  }

  /* 激活的时候 */
  .video-box .video-item-active .video-item-pic {
    border: 3px solid #0DB5EF;
    border-radius: 5px;
  }

  .video-box .video-item-active .video-item-title {
    color: #0DB5EF;
  }

  .video-box .video-item .shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 6px;
    border-radius: 8px;
    right: 0;
    background: rgba(9, 9, 9, 0);
    transition: all .5s;
    opacity: 0;
  }

  .video-box .video-item:hover .shade {
    background: rgba(9, 9, 9, .35);
    opacity: 1;
  }

  .video-box .video-item .shade p {
    color: #fff;
    position: absolute;
    bottom: 10px;
    left: 15px;
  }

  .video-box .video-item .shade img {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -38px;
    margin-left: -22px;
  }

  .h500 {
    height: 520px;
  }

  .h280 {
    height: 280px;
    overflow-y: auto;
  }

  .popImg {
    width: 214px;
    height: 121px;
  }

  .imgbig {
    transform: scale(3);
    border-radius: 0;
    top: 100px;
    left: 120px;
  }

  .leftImg {
    width: 640px;
    margin-right: 20px;
    height: 360px;

    img {
      width: 100%;
      height: 100%;
    }

  }

  .rightText {
    width: 240px;

    li {
      line-height: 30px;
    }

    color: #A2AAB6;
  }

  .slideBox {
    min-height: 400px;
    margin-top: 20px;

    ul {
      height: 100% !important;

      li {
        width: 18%;
        position: relative;
        margin-right: calc((100% - 90%) / 4);
        margin-bottom: 30px;

        & :hover .hover {
          display: block;
        }

        >.flag {
          width: 82px;
          height: 24px;
          background: rgba(13, 181, 239, 1);
          border-radius: 12px;
          opacity: 0.9;
          font-size: 14px;
          font-family: PingFangSC-Regular;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
          text-align: center;
          position: absolute;
          right: 15px;
          top: 15px;
          z-index: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 10px;
        }

        >.hover {
          width: 100%;
          height: 154px;
          background: rgba(9, 9, 9, .1);
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 8px;
          overflow: hidden;
          display: none;

          img {
            width: 44px;
            height: 44px;
            margin: 55px auto;
            display: block;
          }

        }

        >.imgbox {
          background: #ddd;
          width: 100%;
          height: 165px;
          border-radius: 8px;
          margin-bottom: 10px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }

        }

        .imgp {
          font-size: 16px;
          font-family: PingFangSC-Regular;
          color: rgba(57, 57, 57, 1);
          line-height: 22px;
        }

      }

      li:nth-child(5n+5) {
        margin-right: 0;
      }

    }
  }

  .handleBtns {
    width: 100% !important;
  }

  .golist {
    color: #393939;
    font-weight: 600;
    margin-left: -10px;
  }


  .AIulbox li {
    width: 18.8%;
    margin-top: 20px;
    height: 265px;
    margin-right: 1.5%;
  }

  .AIulbox li:nth-child(5n+5) {
    margin-right: 0px;
  }

  .AIulbox li img {
    width: 100%;
  }

  /* .ulbox li:nth-child(5n + 0) {
    margin-right: 0;
  } */

  .AIulbox li h2 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #393939;
    margin-top: 5px;
  }

  .AIulbox li p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #a2aab6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .AIulbox li .imgbox {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .AIulbox li .imgbox .line {
    position: absolute;
    background: #000;
    bottom: 0;
    left: 0;
    height: 35px;
    width: 100%;
    color: #fff;
    line-height: 35px;
    text-align: center;
  }

  .AIulbox .shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 6px;
    border-radius: 8px;
    right: 0;
    background: rgba(9, 9, 9, 0);
    transition: all 0.5s;
    opacity: 0;
  }

  .AIulbox .imgbox:hover .shade {
    background: rgba(9, 9, 9, 0.35);
    opacity: 1;
  }

  .AIulbox .imgbox .shade img {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -22px;
    margin-left: -22px;
  }
</style>