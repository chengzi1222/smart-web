<template>
<div>
    <div class="page-tilt">
      <b></b>
      <span>证照管理</span>
    </div>
  <div class="user-box">
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="主体名称" class="w250 seekIpt" v-model="condition.keyword" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <enum-select class="selectHeight" v-model="condition.buyerType" placeholder="主体类型" enum="com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum" @change="searchTab"></enum-select>

      <!--<enum-select class="selectHeight" v-model="condition.scType" placeholder="公立私立" enum="com.ybveg.govx.enums.sub.GuardSchoolPropEnum" @change="searchTab"></enum-select>-->

      <!--<el-cascader class="selectHeight" clearable :change-on-select="true" :options="options" @change="areaChange" :props="props"></el-cascader>-->

      <enum-select class="selectHeight" v-model="condition.licenceState" placeholder="许可证状态" enum="com.ybveg.govx.enums.food.GuardLicenseStateEnum" @change="searchTab"></enum-select>

      <enum-select class="selectHeight" v-model="condition.healthState" placeholder="健康证状态" enum="com.ybveg.govx.enums.food.GuardLicenseStateEnum" @change="searchTab"></enum-select>

      <el-button @click="exportFile" class="floatR" type="primary" style="margin-left:20px;">导出</el-button>
    </div>
    <div class="tabOffTop120">
      <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"  :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" :key="maxheight">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="buyerName" min-width="190" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="buyerType" min-width="100" label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区县"></el-table-column>
        <el-table-column show-overflow-tooltip prop="legalPerson" min-width="100" label="负责人"></el-table-column>
        <!--<el-table-column show-overflow-tooltip prop="scType" min-width="120" label="公立私立"></el-table-column>-->
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="营业执照"></el-table-column>
        <el-table-column show-overflow-tooltip prop="license" min-width="100" label="许可证"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licenceExpdate" min-width="100" label="许可证有效期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="kitchenNum" min-width="100" label="后厨人员数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="healthNum" min-width="100" label="健康证数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="soonPastHealthNum" min-width="100" label="即将过期健康证数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="hadPastHealthNum" min-width="100" label="已过期健康证数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="hasOrNotHealth" min-width="100" label="是否有过期健康证"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showLicense(scope.row)" class="operate-a">查看证照</a>
          </template>
        </el-table-column>

      </el-table>

      <!-- 弹框 -->
      <yb-popup @close="close" :isShow="popShow" :title="entity.entityName" width="900">
        <div slot="body">
          <div class="popBody">
               <p class="titlePop">证照</p>
               <div class="clear_a imgBoxPop">
                 <div class="li">
                    <img :src="entity.licenseInfo.credit?entity.licenseInfo.credit:require('assets/img/schoolTrace/noCredit.png')" alt="">
                    <p>营业执照</p>
                 </div>
                 <div class="li">
                    <span class="tip">{{entity.licenseInfo.licenceState}}</span>
                    <img :src="entity.licenseInfo.licence?entity.licenseInfo.licence:require('assets/img/schoolTrace/noLicence.png')" alt="">
                    <p>许可证</p>
                   <p>有效期:{{entity.licenseInfo.licenceExpDate}}</p>
                 </div>
               </div>
                
                <p class="titlePop">健康证:</p>‘
                <ul class="clear_a imgBoxPop">
                  <li v-for="(item, index) in entity.healthInfo" :key="index">
                     <span class="tip">{{item.healthState}}</span>
                    <img :src="item.healthCard?item.healthCard:require('assets/img/schoolTrace/noHealth.png')" alt="">
<!--                    <img :src="item.healthCard" alt="">-->
                    <p>{{item.realName}}</p>
                    <p>有效期:{{item.pastDate}}</p>
                  </li>
                </ul>
          </div>
        </div>
        <div slot="foot" style="height:32px;">
          <el-button @click="close">关闭</el-button>
        </div>
      </yb-popup>
      <!-- end -->
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import * as common from 'api/common';
import EnumSelect from 'components/common/EnumSelect';
import * as guard from 'api/guard'
import YbPopup from 'components/ybpopup/YbPopup.vue'
export default {

  mounted() {
    guard.getAreaTree('').then(r => {
      if (r.status) {
        let data = JSON.parse(r.data)
        data.data.forEach(element => {
          element.children = []
        })
        this.options = data.data
      } else {
        this.$message.warning(r.message)
      }
    })
    this.searchTab()
  },
  methods: {
    submit(){},
    close(){
      this.popShow = false
    },
    exportFile () {
      guard.licenseExport(this.page.pageNum, this.page.pageSize, this.condition).then(r => {
        if (r.status) {
          let data = JSON.parse(r.data)
          let fileId = data.data.fileId
          if (fileId) {
            window.open(fileId)
          } else {
            this.message.warning("找不到文件id")
          }
        } else {
          this.$message.warning(r.message)
        }
      })
    },
    handleIconClick() {	//搜索框按钮点击搜索
      this.a = !this.a;
      this.searchTab();
    },
    searchPage() {
      this.loading=true;
      guard.licensePage(this.page.pageNum, this.page.pageSize, this.condition).then(r => {
        if (r.status) {
          let data = JSON.parse(r.data)
          this.tableData = data.data.records
          this.page.total = data.data.total
        } else {
          this.$message.warning(r.message)
        }
        this.loading = false
      })

    },
    searchTab() {
      this.page.pageNum = 1;
      this.searchPage();
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchPage();
    },
    handleItemChange(val) {
      let nodes = this.options
      let node
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].areaId == val[i]) {
            if (i == val.length - 1) {
              node = nodes[j]
            }
            nodes = nodes[j].children
            break
          }
        }
      }
      guard.getAreaTree(val[val.length - 1]).then(r => {
        if (r.status) {
          let data = JSON.parse(r.data)
          let children = data.data
          children.forEach(element => {
            element.children = []
          })
          if (children.length == 0) {
            node.children = ''
          } else {
            node.children = children
          }
        } else {
          this.$message.warning(r.message)
        }
      })
    },
    showLicense (entity) {
      guard.getLicense(entity.guid).then(r => {
        if (r.status) {
          this.entity.entityName = entity.buyerName
          let data = JSON.parse(r.data)
          this.entity.licenseInfo = data.data.liceseInfo
          this.entity.healthInfo = data.data.healthInfo
          this.popShow = true
        } else {
          this.$message.warning(r.message)
        }
      })
    },
    areaChange (val) {
      if (!val || val.length == 0) {
        this.condition.areaId = ''
      } else {
        this.condition.areaId = val[val.length - 1]
        this.handleItemChange(val)
      }
      this.searchTab()
    }
  },
  components: { EnumSelect,YbPopup },
  computed: {
    tableHeight() {
      return this.$store.state.layout.tableHeight;
    },
    tableWidth() {
      return this.$store.state.layout.tableWidth;
    }
  },
  watch: {

  },
  filters:{
    // buyerType:function (val) {
    //     switch (val){
    //       case "KINDSC":
    //         return "幼儿园";
    //       case "PRISC":
    //         return "小学";
    //       case "MIDSC":
    //         return "初中";
    //       case "HIGSC":
    //         return "高中";
    //       case "UNVSC":
    //         return "大学";
    //     }
    // },
    // scType:function (val) {
    //   switch (val) {
    //     case "PUBLIC":
    //       return "公立";
    //     case "PRIVATE":
    //       return "私立";
    //   }
    // }
  },

  data() {
    return {
      popShow: false,
      dialogVisible: false,
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      loading:false,
      a: false,
      shadowShow: false,
      tableData: [],
      options: [],
      condition: {
        appType: '2',  // 放心食安
        keyword: '',
        buyerType: '',
        scType: '',
        areaId: '',
        healthState: '',
        licenceState: ''
      },
      entity: {
        entityName: '',
        licenseInfo: {
          credit: '',
          licence: '',
          licenceState: '',
          licenceExpDate:''
        },
        healthInfo: {
          healthCard: '',
				  healthState: '',
				  pastDate: '',
				  realName: ''
        }
      },
      props: {
        value: 'areaId',
        label: 'areaName',
        children: 'children'
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.tab-box {
  width: 100%;
  display: flex;
  position: relative;
}

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;

  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}

.li-bott span {
  color: #393939;
}

.tab-box .tab-bott {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #ebf1f5;
}

.ipt-btn-box {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
}

.table-div {
  width: 100%;
  text-align: center;
}

.operate-a {
  color: #1787ad;
}

table tr td:last-child .cell a {
  border-right: 1px solid #ccc;
  padding-right: 5px;
}
table tr td:last-child .cell a:last-child {
  border-right: none;
  padding-right: 0px;
}
.popBody{
  width: calc(100% - 40px);
  height: 480px;
  overflow-y: auto;
  padding:0 20px;
  .titlePop{
    line-height: 30px;
    color: #333;
    font-size: 16px;
    margin-bottom: 10px;
  }
.imgBoxPop{
  width: 100%;
  
    li,.li{
      position: relative;
      width: 23%;
      height: 150px;
      margin-right: calc(8% / 3);
      margin-bottom: 20px;
      img{
        height:100px;
        width: 100%;
      }
      p{
        line-height: 25px;
        font-size: 14px;
      }
      .tip{
        position: absolute;
        width: 50px;
        color: #fff;
        background: red;
        display: block;
        top: 10px;
        right: 10px;
        border-radius: 3px;
        }
    }
    li:nth-child(4n+0){
      margin-right: 0;
    }
  }
}

</style>
