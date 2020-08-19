<template>
    <bm-info-window  ref="overlay" :position="entityObj" :width=350 :height=190 :show="isShow"
        @close="infoWindowClose" @open="infoWindowOpen">
        <div class="bigBox">
              <el-tooltip effect="dark" :content="info.entityName" placement="top-start">
                  <p class="title textell">{{ info.entityName?info.entityName:"暂无" }}</p>
              </el-tooltip>
               <el-tooltip effect="dark" :content="info.corpName" placement="top-start">
                  <p class="textell">负责人：
                    <span>{{ info.corpName?info.corpName:"暂无" }}</span>
                  </p>
              </el-tooltip>
              <p class="textell">联系方式：
                <span>{{ info.mobile?info.mobile:"暂无" }}</span>
              </p>
               <el-tooltip effect="dark" :content="info.detpName" placement="top-start">
                   <p class="textell">辖区：
                      <span>{{ info.detpName?info.detpName:"暂无" }}</span>
                    </p>
              </el-tooltip>
               <el-tooltip effect="dark" :content="info.address" placement="top-start">
                   <p class="textell">实际地址：
                      <span>{{ info.address?info.address:"暂无" }}</span>
                    </p>
              </el-tooltip>
              <p class="textell">最后巡查时间：
                <span>{{ info.patrolTime?info.patrolTime:"暂无" }}</span>
              </p>
        </div>
        <el-button type="info" icon="el-icon-d-arrow-right" style="margin-top:10px;opacity: 0.6;" class="floatR"  circle @click="toEntity" > </el-button>
        <!-- <el-button @click="toEntity" style="margin-top:15px;" class="floatR" type="primary">主体档案详情</el-button> -->
      <button @click=""></button>
    </bm-info-window>
</template>

<script>
import { BmInfoWindow } from 'vue-baidu-map';
import * as mapApi from "api/sub/map";

export default {
  props: {
    entityObj: Object,
    isShow: {
      type: Boolean,
      default: false
    },
  },
  mounted() {

  },
  data() {
      return{
          info:{},
          activeId:"",
      }
  },
  watch: {
    isShow(val,old){
    },
    'entityObj': {
      handler() {
        if (this.$refs.overlay && this.$refs.overlay.reload) {
          this.$refs.overlay.reload();
        }
      },
      deep: true
    },
    'entityObj.id'(val,old){
       this.activeId=old;
      // console.log(val,old,this.isShow)
      if(val!=old){
        this.loadShow();
      }
    },
  },
  methods: {
    loadShow(){
        this.info = {};
         mapApi.findEntity(this.entityObj.id, this.entityObj.type).then((data) => {
            if (data.status) {
              this.info = data.data;
            }
          });
    },
    toEntity() {
        if (this.entityObj.type === 'CFDA') {
          this.$router.push({
            name: 'cfda.archives.detail',
            query: {
              id: this.entityObj.id,
              back: 'subject.map'
            }
          });
        } if (this.entityObj.type === "ENTITY") {
          const entityType = this.info.entityType.toLocaleLowerCase();
          this.$router.push({
            name: "subject.archives.detail",
            params: {
              type: entityType,
            },
            query: {
              id: this.entityObj.id
            }
          })
        }
    },
    infoWindowClose() {
        // console.log('关')
    },
    infoWindowOpen() {
        //  console.log('开')
    }
  },
  components: {
    BmInfoWindow,
  }
}
</script>
<style scoped lang='scss'>
.title{
    font-size: 16px;
    margin-bottom: 10px;
    margin-top: 5px;
}
.bigBox{
    width: 350px;
    height: 140px;
    p{
      width:95%;
    }
}
</style>



