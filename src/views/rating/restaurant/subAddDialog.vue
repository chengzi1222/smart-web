<template>
  <div>
    <el-dialog v-if="subAddDialogVisible" class="addsub-dialog" :visible.sync="subAddDialogVisible"
      :close-on-click-modal="false" :modal-append-to-body="false" title="添加主体" :before-close="handleCloseDialog" style="padding-top: 0px;">
      <div class="addsub-top">
        <ul class="tab-box">
          <li class="tabLi" v-for="(item,index) in patternList" :data-index="index" :key="index" :class="index==chosenIndex?'li-bott':''" @click="choose(index,item.key)">
            <div :data-index='index'>{{item.type}}</div>
          </li>
          <li class="tab-bott"></li>
        </ul>
      </div>
      <div class="addsub-body">
        <div class="left">
          <div class="filtrate mt20">
            <el-input placeholder="主体名称、负责人、联系方式" class="w250 ml20" clearable v-model="leftKeyWord"
              @keyup.enter.native="leftSearch" @clear="leftSearch">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="leftSearch"></i>
            </el-input>
            <select-dept-grid class="w150 ml20" placeholder="所属网格" @change="leftDeptChange" ref="leftAreaSelect"></select-dept-grid>
          </div>
          <el-table height="526" :data="leftData" style="width: 475px; margin-top: 14px"
            :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}"
            v-loading="leftLoading" @selection-change="leftSelectChange" :row-key="getRowKey" ref="leftTable">
            <el-table-column label="" width="60" type="selection" :reserve-selection="true" :selectable="leftSelection">
            </el-table-column>
            <el-table-column prop="entityName" label="主体名称" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.entityName ? scope.row.entityName: '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="所属网格" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.deptName ? scope.row.deptName: '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="corpName" label="负责人" min-width="90" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.corpName ? scope.row.corpName: '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="联系方式" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.mobile ? scope.row.mobile: '-'}}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination background :current-page="leftPage.pageNum" :page-sizes="[10, 20, 30, 40, 50]" :page-size="leftPage.pageSize"
              layout="total, prev, pager, next" :total="leftPage.total" @size-change="leftPageSizeChange" @current-change="leftPageCurrentChange">
            </el-pagination>
          </div>
        </div>
        <div class="move-btn">
          <el-button class="ml20" :disabled="isLeftDisabled" @click="moveSubtoRight" type="primary">
            <i class="el-icon-arrow-right"></i>
          </el-button>
          <el-button class="mt20 ml20" :disabled="isRightDisabled" @click="moveSubtoLeft" type="primary">
            <i class="el-icon-arrow-left"></i>
          </el-button>
        </div>
        <div class="right ml20">
          <div class="filtrate mt20">
            <el-input placeholder="主体名称、负责人、联系方式" class="w250 ml20" v-model="rightKeyWord" clearable @keyup.enter.native="rightSearch" @clear="rightSearch">
              <i slot="prefix" class="el-input__icon el-icon-search" @click="rightSearch"></i>
            </el-input>
            <select-dept-grid class="w150 ml20" placeholder="所属网格" @change="rightDeptChange" ref="rightAreaSelect"></select-dept-grid>
          </div>
          <el-table height="526" :data="rightData" style="width: 475px; margin-top: 14px"
            :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}"
            v-loading="rightLoading" @selection-change="rightSelectChange" :row-key="getRowKey" ref="rightTable">
            <el-table-column label="序号" width="60" type="selection" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="entityName" label="主体名称" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.entityName ? scope.row.entityName: '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="所属网格" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.deptName ? scope.row.deptName: '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="corpName" label="负责人" min-width="90" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.corpName ? scope.row.corpName: '-'}}
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="联系方式" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.mobile ? scope.row.mobile: '-'}}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination background :current-page="rightPage.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="rightPage.pageSize"
              layout="total, prev, pager, next" :total="rightPage.total" @size-change="rightPageSizeChange" @current-change="rightPageCurrentChange">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button class="default-btn" @click="addSubCancle">取消</el-button>
        <el-button type="primary" :disabled="saveDisabled" @click="addSubSubmit('transferSel')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "api/rating/subManage";
import SelectDeptGrid from "components/common/SelectDeptGrid.vue";
export default {
  components: {
    SelectDeptGrid
  },
  props: {
    subAddDialogVisible: {
      required: true,
      type: Boolean
    }
  },
  computed: {
    leftParams() {
      return {
        areaCode: this.leftAreaCode ? this.leftAreaCode : this.$store.state.common.user.areaCode,
        type: this.type,
        pageSize: this.leftPage.pageSize,
        pageNum: this.leftPage.pageNum,
        search: this.leftKeyWord
      }
    },
    isLeftDisabled() {
      return this.leftMultipleSelection.length > 0 ? false : true;
    },
    isRightDisabled() {
      return this.rightMultipleSelection.length > 0 ? false : true;
    },
    // 右表是否有筛选条件
    isRightFilter() {
      return this.rightKeyWord.length > 0 || this.rightAreaCode.length > 0;
    },
    saveDisabled() {
      return this.rightTotalData.length == 0;
    }
  },
  data() {
    return {
      type: 'RESTAURANT',
      entityTypes: {
        'RESTAURANT': '餐饮主体',
        'CFDARESTAURANT': '三小主体（小餐饮店）'
      },
      patternList: [],
      chosenIndex: 0,
      leftKeyWord: '',
      leftAreaCode: '',
      leftData: [],
      leftLoading: false,
      leftIds: [],
      leftMultipleSelection: [],
      leftPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },

      rightKeyWord: '',
      rightAreaCode: '',
      rightData: [], // 右表当前页数据
      rightTotalData: [], // 右表全数据
      rightFilterData: [], // 右表条件筛选数据
      rightLoading: false,
      rightIds: [],
      rightMultipleSelection: [],
      rightPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      delIds: [],
      timeOut: null
    }
  },
  mounted() {
    this.patternList = new Array();
    this.patternList.push({
      type: '餐饮主体',
      key: 'RESTAURANT'
    });
    this.patternList.push({
      type: '三小（小餐饮店）',
      key: 'CFDARESTAURANT'
    });
    this.type = this.patternList[0].key;
    this.initData();
  },
  methods: {
    choose(index, key) {
      if(this.chosenIndex === index)
      return;

      if(this.rightIds.length > 0) {
        this.$confirm(`${this.entityTypes[this.type]}添加的主体尚未保存，是否确定切换？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          document.getElementsByClassName('v-modal')[0].setAttribute('style', 'display:none;');
          this.chosenIndex = index;
          this.type = key;
          this.clearParams();
          this.getLeftPageData();
          this.getRightPageData();
        }).catch(e => {
          document.getElementsByClassName('v-modal')[0].setAttribute('style', 'display:none;');
        });
      } else {
        this.chosenIndex = index;
        this.type = key;
        this.clearParams();
        this.getLeftPageData();
        this.getRightPageData();
      }
    },
    clearParams() {
      this.leftKeyWord = '';
      this.leftAreaCode = '';
      this.leftIds = [];
      this.leftMultipleSelection = [];
      this.leftData = [];
      this.leftPage = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
      
      this.rightKeyWord = '';
      this.rightAreaCode = '';
      this.rightIds = [];
      this.rightMultipleSelection = [];
      this.rightData = [];
      this.rightPage = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
      this.rightTotalData = [];
      this.rightFilterData = [];

      // 清空selection勾选
      this.$nextTick(() => {
        this.$refs.leftTable.clearSelection();
        this.$refs.leftAreaSelect.$refs.cascader.$refs.panel.clearCheckedNodes();
        this.$refs.rightTable.clearSelection();
        this.$refs.rightAreaSelect.$refs.cascader.$refs.panel.clearCheckedNodes();
      })
    },
    initData() {
      this.clearParams();
      this.getLeftPageData();
      this.getRightPageData();
    },
    addSubCancle() {
      this.handleCloseDialog();
    },
    handleCloseDialog() {
      this.$emit('closeSubAddDialog');
    },
    async addSubSubmit(transferSel) {
      // this.rightTotalData 右边全部数据
      let ids = []
      this.rightTotalData.forEach(item => {
          ids.push(item.id)
      })
      let res = await api.addSubFromSysEntity(ids)
      if (res.status) {
        this.$message.success('添加成功');
        this.handleCloseDialog();
        this.$parent.getPageData();
      }
    },
    getRowKey(row) {
      return row.id;
    },

    leftSearch() {
      this.leftPage.pageNum = 1;
      this.getLeftPageData();
    },
    async leftDeptChange(deptId) {
      this.leftAreaCode = !deptId || deptId.length == 0  ? "" : deptId[deptId.length - 1];
      this.leftPage.pageNum = 1;
      await this.getLeftPageData();
    },
    leftSelectChange(val) {
      this.leftMultipleSelection = val;
      this.leftIds = []
      if (val) {
        val.forEach(item => {
          if (item) {
            this.leftIds.push(item.id)
          }
        })
      }
    },
    leftSelection(row, index) {
      if (!this.rightIds.length) {
        return true
      } else {
        if(this.rightIds.some((item) => {
            return row.id === item
          })) {
          return false;
        } else {
          return true;
        }
      }
    },
    leftPageSizeChange(size) {
      if (size !== this.leftPage.pageSize) {
        this.leftPage.pageNum = 1;
        this.leftPage.pageSize = size;
        this.getLeftPageData();
      }
    },
    leftPageCurrentChange(num) {
      if (num !== this.leftPage.pageNum) {
        this.leftPage.pageNum = num;
        this.getLeftPageData();
      }
    },
    async getLeftPageData() {
      this.leftLoading = true;
      let res = await api.getSysEntityList(this.leftParams);
      if (res.status) {
        this.leftData = res.data.list;
        this.leftPage.total = parseInt(res.data.total);
      }
      this.leftLoading = false;
    },

    moveSubtoRight() {
      if(this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.rightLoading = true;
      this.timeOut = setTimeout(() => {
        if (this.isRightFilter) { // 有筛选条件
          for (let i = 0; i < this.leftMultipleSelection.length; i++) {
            this.rightFilterData.push(this.leftMultipleSelection[i]);
            this.rightTotalData.push(this.leftMultipleSelection[i]);
          }
          this.rightSearch();
          this.rightDeptChange(this.rightAreaCode);
        } else { // 无筛选
          for (let i = 0; i < this.leftMultipleSelection.length; i++) {
            this.rightTotalData.push(this.leftMultipleSelection[i]);
          }
        }
        this.getRightPageData();
        for (let i = 0; i < this.leftIds.length; i++) {
          this.rightIds.push(this.leftIds[i]);
        }
        this.$refs.leftTable.clearSelection();
      }, 200);
    },
    moveSubtoLeft() {
      if(this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.rightLoading = true;
      this.timeOut = setTimeout(() => {
        this.rightIds = this.rightIds.filter((item) => {
          return this.delIds.indexOf(item) == -1
        })
        if(this.isRightFilter) {
          this.rightFilterData = this.rightTotalData.filter((item) => {
                              return this.delIds.indexOf(item.id) == -1
                            })
          this.rightTotalData = this.rightTotalData.filter((item) => {
                              return this.delIds.indexOf(item.id) == -1
                            })
        } else {
          this.rightTotalData = this.rightTotalData.filter((item) => {
                              return this.delIds.indexOf(item.id) == -1
                            })
        }
        this.$refs.rightTable.clearSelection();
        if (this.rightData.length == 0) {
          this.rightPage.pageNum = 1
        }
        this.getRightPageData();
      }, 200);
    },

    rightSearch() {
      // 右表搜索, 过滤出三个对应字段包含搜索值的data
      this.rightPage.pageNum = 1;
      this.rightLoading = true;
      this.rightFilterData = this.rightTotalData.filter(item => {
        return item.entityName.indexOf(this.rightKeyWord) != -1 ||
          item.corpName.indexOf(this.rightKeyWord) != -1 ||
          item.mobile.indexOf(this.rightKeyWord) != -1;
      })
      this.rightDeptChange(this.rightAreaCode);
    },
    // 右表区域筛选
    rightDeptChange(deptId) {
      this.rightAreaCode = !deptId || deptId.length == 0 ? "" : deptId[deptId.length - 1];
      this.rightPage.pageNum = 1;
      this.rightLoading = true;
      // 先过滤搜索框数据
      let rightFilterData = this.rightTotalData.filter(item => {
                            return item.entityName.indexOf(this.rightKeyWord) != -1 ||
                              item.corpName.indexOf(this.rightKeyWord) != -1 ||
                              item.mobile.indexOf(this.rightKeyWord) != -1;
                          })
      this.rightFilterData = rightFilterData.filter(item => {
      
        if(!deptId || deptId.length === 0) { // 未选择区域 （默认账号当前areaCode）
          return item
        }

        if(deptId.length === 1) { // 选中市级 或 区级
          if(deptId[0].length === 4) { // 市级
            if(item.areaCode.slice(0,4) === deptId[0].slice(0,4)) {
              return item
            }
          } else { // 区级
            if(item.areaCode.slice(0,6) === deptId[0].slice(0,6)) {
              return item
            }
          }
        }

        if(deptId.length === 2) { // 选中区 或 街道
          if(deptId[1].length === 6) { // 区级
            if(item.areaCode.slice(0,6) === deptId[1].slice(0,6)) {
              return item
            }
          } else { // 街道级
            if(item.areaCode === deptId[1]) {
              return item
            }
          }
        }

        if(deptId.length === 3) { // 选中街道
          if(item.areaCode === deptId[2]) {
            return item
          }
        }
      })
      this.getRightPageData();
    },
    rightSelectChange(val) {
      this.rightMultipleSelection = val;
      this.delIds = [];
      if (val) {
        val.forEach(item => {
          if (item) {
            this.delIds.push(item.id);
          }
        });
      }
    },
    rightPageSizeChange(size) {
      if (size !== this.rightPage.pageSize) {
        this.rightPage.pageNum = 1;
        this.rightPage.pageSize = size;
        this.getRightPageData();
      }
    },
    rightPageCurrentChange(num) {
      if (num !== this.rightPage.pageNum) {
        this.rightPage.pageNum = num;
        this.getRightPageData();
      }
    },
    getRightPageData() {
      if(this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.rightLoading = true;
      this.rightData = [];
      let lastPageDataNum = (this.rightPage.pageNum - 1) * this.rightPage.pageSize;
      let currentPageDataNum = this.rightPage.pageNum * this.rightPage.pageSize;
      // 右表, 有筛选条件时, 数据显示rightFilterData(筛选后的数据); 无筛选时, 数据显示rightTotalData(全部数据)
      if (this.isRightFilter) { // 有筛选条件
        if (currentPageDataNum <= this.rightFilterData.length) {
          for (let i = lastPageDataNum; i < currentPageDataNum; i++) {
              this.rightData.push(this.rightFilterData[i])
          }
        } else {
          let remainingDataNum = this.rightFilterData.length - lastPageDataNum
          for (let i = lastPageDataNum; i < remainingDataNum+lastPageDataNum; i++) {
              this.rightData.push(this.rightFilterData[i])
          }
        }
        this.rightPage.total = this.rightFilterData.length;
      } else { // 筛选条件为空
        if (currentPageDataNum <= this.rightTotalData.length) { // 页面size填满
          for (let i = lastPageDataNum; i < currentPageDataNum; i++) {
              this.rightData.push(this.rightTotalData[i])
          }
        } else { // 页面size未满
          let remainingDataNum = this.rightTotalData.length - lastPageDataNum // 末页余下的data条数
          for (let i = lastPageDataNum; i < remainingDataNum+lastPageDataNum; i++) {
              this.rightData.push(this.rightTotalData[i])
          }
        }
        this.rightPage.total = this.rightTotalData.length;
      }
      this.timeOut = setTimeout(() => {
        this.rightLoading = false;
      }, 1000);
    },
  }
}
</script>

<style scoped lang="scss">

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
    padding-left: 0 !important;
    margin-bottom: 20px;
  }

  .tab-box .tabLi {
    width: 180px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }
  
  .addsub-dialog::v-deep .el-dialog {
        width: 1060px;
        margin-top: 5vh !important;
        
        .el-dialog__header {
          height: 40px;
          line-height: 40px;
          padding: 0 0 0 20px;
          background-color: #F2F5F8;
          
          .el-dialog__title {
            color: #393939;
            font-size: 14px;
            font-weight:400;
          }
          .el-icon-close:before {
            font-size: 25px;
            position: absolute;
            top: -10px;
            right: -10px;
          }
        }

        .el-dialog__body {
          padding: 10px 20px 20px;
          box-sizing: border-box;
        }

        .addsub-body {
          display: flex;
          display: -webkit-flex;
          justify-content: space-between;
          align-items: flex-start;
          
          .left,.right{
            border: 1px solid #C2CAD2;
          }
          .move-btn {
            align-self: center;
            .el-button {
              display: block;
              font-size: 16px;
              font-weight: 700;
              width: 30px;
              height: 30px !important;
              padding: 7px 7px !important;
              i {
                font-weight: 700;
              }
            }
            .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
              color: #C2CAD2 !important;
              cursor: not-allowed !important;
              background-image: none !important;
              background-color: #F1F3F6 !important;
              border-color: #C2CAD2 !important;
            }
          }

          .el-table {
            max-height: 550px;
            overflow-y: auto;
          }
        }
    }
    .pagination-box {
      margin-bottom: 14px;
      ::v-deep .el-pagination__total {
        float: left;
        margin: 0 20px;
        font-size: 14px;
        color: #A2AAB6;
      }
      ::v-deep .btn-next {
        margin: 0 20px 0 0;
      }
      ::v-deep .btn-prev {
        margin: 0;
      }
      ::v-deep .el-pager li {
        margin: 0;
      }
      ::v-deep .el-pager li:not(.disabled).active {
        background-color: #0DB5EF;
      }
    }
    .footer {
      margin-top: 20px;
      text-align: right;
      .default-btn {
        background-color: #F6F7F8;
      }
      .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
        color: #C2CAD2 !important;
        cursor: not-allowed !important;
        background-image: none !important;
        background-color: #F1F3F6 !important;
        border-color: #C2CAD2 !important;
      }
    }
</style>