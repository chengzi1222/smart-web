<template>
  <div style="margin-bottom: 120px;">
    <!-- 左边信息悬浮栏 start-->
    <div class="left-info">
      <div class="head-block">
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 左边信息悬浮栏 end-->
    <div class="ml250">
      <el-form :model="entity" label-width="130px" class="demo-ruleForm labW150 right-info">
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:">
                <span>{{data.entityName ? data.entityName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="统一社会信用代码:" title="(组织机构代码证)">
                <span>{{data.creditCode ? data.creditCode : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="data.entityType=='MAAI_EMPLOY'">
              <el-form-item label="医疗机构执业许可证:">
                <span>{{data.employNo ? data.employNo : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="法人姓名:">
                <span>{{data.legalPerson ? data.legalPerson : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="法人身份证:">
                <span>{{data.legalNo ? data.legalNo : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="法人电话:">
                <span>{{data.legalMobile ? data.legalMobile : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="负责人:">
                <span>{{data.corpPerson ? data.corpPerson : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="联系人:">
                <span>{{data.contactPerson ? data.contactPerson : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="联系电话:">
                <span>{{data.contactMobile ? data.contactMobile : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="经营信息">
          <div class="content">
            <div class="row red">
              <el-form-item label="注册经营地址">
                <span>{{data.registerAddr ? data.registerAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="实际经营地址:">
                <span>{{data.realityAddr ? data.realityAddr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="生产地址:" v-if="data.entityType=='MAAI_PRODUCT'">
                <span>{{data.otherAddr ? data.otherAddr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="仓库地址:" v-else>
                <span>{{data.otherAddr ? data.otherAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="营业状态:">
                <span>{{data.manageStateStr ? data.manageStateStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="营业方式:"  v-if="data.entityType=='MAAI_MANAGER'">
                <span>{{data.manageTypeStr ? data.manageTypeStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="企业形态:"  v-if="data.entityType!=='MAAI_PRODUCT'">
                <span>{{data.enterpriseFormStr ? data.enterpriseFormStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="是否网络经营:"  v-if="data.entityType=='MAAI_MANAGER'">
                <span>{{data.onlineStr ? data.onlineStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="data.entityType=='MAAI_MANAGER' && data.online === 'YES'">
              <el-form-item label="网络经营备注:">
                <span>{{data.onlineRemark ? data.onlineRemark : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="使用类别：" v-if="data.entityType === 'MAAI_EMPLOY'">
                <span>{{data.categoryStr ? data.categoryStr : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="data.entityType !== 'MAAI_EMPLOY'" title="许可备案信息">
          <div class="content">
            <div class="row">
              <el-form-item label="是否多证合一:" v-if="data.entityType == 'MAAI_MANAGER'" >
                <span>{{data.multInOneStr ?data.multInOneStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item :label="data.entityType === 'MAAI_MANAGER' ? '经营类别：' : '生产类别：'">
                <span>{{data.categoryStr ? data.categoryStr : '暂无'}}</span>
              </el-form-item>
            </div>
            <Card v-if="data.entityType === 'MAAI_PRODUCT'" v-for="(value, key, index) in data.maaiLicenceMap" :key="index" :licence="value" :showType="'info'"></Card>
            <manager-card v-if="data.entityType === 'MAAI_MANAGER' && data.multInOne === 'NO'" v-for="(value, key, index) in data.maaiLicenceMap" :key="index" :licence="value" :showType="'info'"></manager-card>
            <mult-in-one-card v-if="data.entityType === 'MAAI_MANAGER' && data.multInOne === 'YES'" v-for="(value, key, index) in data.maaiLicenceMap" :key="index" :licence="value" :showType="'info'"></mult-in-one-card>
          </div>
        </toggle-form>

        <toggle-form title="责任落实">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:">
                <span>{{data.syjName ? data.syjName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="所在网格:">
                <span>{{data.gridName ? data.gridName : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="监管人员:">
                <span>{{data.soName ? data.soName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="监管人员联系方式:">
                <span>{{data.soPhone ? data.soPhone : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{data.infoAssiName ? data.infoAssiName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:">
                <span>{{data.infoAssiPhone ? data.infoAssiPhone : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button type="primary" style="width:120px;" @click="del(data.id)">删除</el-button>
        <el-button type="primary" @click="review(data.id)">提交审核</el-button>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script type="module">
  import scroll from "utils/scroll"
  import ToggleForm from "components/ToggleForm.vue";
  import ManagerCard from './managerCard'
  import multInOneCard from './multInOneCard'
  import { page, review, del} from 'api/medicalDevices/importentity'
  import Card from './card'
  export default {
    mounted() {
      scroll.call(this, 'slideIndex');
      if (this.entityType !== 'MAAI_EMPLOY') {
        this.progress = [{
          title: '基础信息',
          successNum: 0,
          totalNum: 0
        },
          {
            title: '经营信息',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '责任落实',
            successNum: 0,
            totalNum: 0
          }]
      } else {
        this.progress = [{
          title: '基础信息',
          successNum: 0,
          totalNum: 0
        },
          {
            title: '经营信息',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '许可备案信息',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '责任落实',
            successNum: 0,
            totalNum: 0
          }]
      }
    },
    methods: {
      review(id) {
        this.$confirm('是否确认审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = new Array()
          ids.push(id)
          review(ids).then(r => {
            if (r.status) {
              this.$message.success("审核成功!")
              this.$emit('back')
            }else {
              this.$message.success("审核失败!")
            }
          })
        })
      },
      del(id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = new Array()
          ids.push(id)
          del(ids).then(r => {
            if (r.status) {
              this.$message.success("删除成功")
              this.$emit('back')
            }else {
              this.$message.success("删除失败")
            }
          })
        })
      },
      pageSearch() {
        this.loading=true;
        page(this.page, this.searchMap).then(r => {
          this.tableData = r.data.list
          this.page.total = r.data.total
          this.loading=false;
        })
      },
      goBack() {
        this.$emit('back')
      },
      back(){
        if(this.$route.query.ratingIndexRisk||this.$route.query.ratingIndexQuantity){//风险分级跳过来
          if(this.$route.query.ratingIndexRisk){
            // this.$router.push({name: "cosmetics.rating.riskLevel", query: {index: this.$route.query.ratingIndexRisk}});
          }else{
            // this.$router.push({name: "cosmetics.rating.quantifyLevel", query: {index: this.$route.query.ratingIndexQuantity}});
          }
        }else{
          this.$router.go(-1)
        }
      },
      recursion(arr,arr2){
        for (let item in arr) {
          if (
            Object.prototype.toString
              .call(arr[item])
              .slice(8, -1)
              .toLowerCase() === "function"
          ) {
            continue;
          }
          for(let v in arr2 ){
            if (
              Object.prototype.toString
                .call(arr2[v])
                .slice(8, -1)
                .toLowerCase() === "function"
            ) {
              continue;
            }
            if(arr2[v]==arr[item].code){
              this.entity.detailedEngageStr+=arr[item].name+',';
            }
          }
        }
      },
    },
    watch: {
      // entity () {
      //   this.$emit("getEntityName", this.entity.entityName)
      // },
      'data.entityType'(){

      }
    },
    props: {
      data: Object,
      entityId: {
        type: String
      },
      entityType: {
        type: String
      }
    },
    data() {
      return {
        detailedEngageItem:[],
        detailedEngageText:'',
        manageRangeText:'',
        entity: {},
        slideIndex: -1,
        progress: [

        ]
      }
    },
    components: {
      ToggleForm,
      ManagerCard,
      multInOneCard,
      Card
    }
  }
</script>

<style scoped lang="scss">
  // 左边悬浮信息栏的样式 start
  $c: #0db5ef;
  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: 27px;
    z-index: 2;

    .head-block {
      // background: #f2f5f8;
      // height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
      .num {
        color: $c;
      }
    }
    .main-block {
      margin-top: 20px; // border-right: 2px solid #EBF1F5;
      // min-height: 470px;
      > li {
        border-right: 2px solid #ebf1f5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #f2f5f8;
        }
        .right {
          color: #a2aab6;
        }
      }
      .activePosition {
        border-right: 2px solid $c;
        .left {
          color: $c;
        }
      }
    }
  }
  .ml250{
    margin-left: 250px;
  }

  .right-info .content {
    width: 870px;
    margin: 20px auto 0;
  }
  .row .el-form-item {
    min-width: 400px;
  }
</style>
