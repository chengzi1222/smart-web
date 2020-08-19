<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>医疗器械生产主体档案</span>
    </div>
    <div class="ipt-btn-box">
      <el-input placeholder="社会信用代码、许可备案号、名称、地址" class="w300 seekIpt" v-model="searchMap.keysWork">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="pageSearch"></i>
      </el-input>
      <select-area-grid class="ml20 w150" placeholder="所属辖区" @change="areaCodeChange"></select-area-grid>
      <el-select multiple clearable class="ml20 w150" :collapse-tags="true" v-model="searchMap.category" placeholder="生产类别" @change="pageSearch">
        <el-option v-for="item in categoryList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select multiple clearable class="ml20" style="width: 180px" :collapse-tags="true" v-model="searchMap.manageState" placeholder="营业状态" @change="pageSearch">
        <el-option v-for="item in manageStateList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select multiple clearable class="ml20" style="width: 180px" :collapse-tags="true" v-model="searchMap.optState" placeholder="操作状态" @change="pageSearch">
        <el-option v-for="item in subStateSelect" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
        <el-button type="primary" class="w100 ml20 floatR"  @click="$router.push({name: 'medicalDevices_sub.product.add'})">添加</el-button>
    </div>
    <div class="tabOffTop120">
      <el-table v-loading="loading" element-loading-text="数据正在努力加载中"  :border="true" :resizable="true"  @sort-change="sortChange" :cell-class-name="handleStyle" :data="tableData" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="90" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="category" min-width="120" label="生产类别"></el-table-column>
        <el-table-column show-overflow-tooltip prop="productNo" min-width="120" label="生产许可编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="oneNo" min-width="120" label="Ⅰ类生产备案编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="registerAddr" min-width="120" label="注册经营场所"></el-table-column>
        <el-table-column show-overflow-tooltip prop="contactMobile" min-width="120" label="联系电话"></el-table-column>
        <el-table-column min-width="120" label="生产范围">
          <template slot-scope="scope">
            <p v-for="(value, key, index)  in scope.row.categoryMap" :key="index" class="spaceNowrap" :title="(key === 'ONE_CATEGORY' ? 'Ⅰ类' : (key === 'TWO_CATEGORY' ? 'Ⅱ类' : 'Ⅲ类')) + ':' + (value ? value : '暂无')">
              {{(key === 'ONE_CATEGORY' ? 'Ⅰ类' : (key === 'TWO_CATEGORY' ? 'Ⅱ类' : 'Ⅲ类')) + ':' + (value ? value : '暂无')}}
            </p>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="suboDeptName" min-width="120" label="所属辖区"></el-table-column>
        <el-table-column show-overflow-tooltip prop="manageState"  min-width="100" label="营业状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="optStateStr" min-width="100" label="操作状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="optTime" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="$router.push({name: 'medicalDevices_sub.product.detail', query: {entityType: scope.row.entityType, ext: 'INFO', entityId: scope.row.id}})" class="operate-a">详情</a>
            <a href="javascript:;" v-if="scope.row.optState === 'ALREADY_FILE'" v-auth="'maai.biz.pb|func.edit'"
              @click="$router.push({name: 'medicalDevices_sub.product.detail', query: {entityType: scope.row.entityType, ext: 'CHANGE', entityId: scope.row.id}})" class="operate-a">编辑</a>
            <a href="javascript:;" v-auth="'maai.biz.pb|func.delete'" v-if="scope.row.optState === 'ALREADY_FILE'" @click="show(scope.row.id)" class="operate-a">删除</a>
          </template>
        </el-table-column> 
      </el-table>
      <yuanben-page :page="page" @size-change="pageSizeChange" @current-change="pageCurrentChange" style="margin-top:10px;">
      </yuanben-page>
    </div>
    <popup-body v-if="isShow">
      <p>请输入删除原因(必填,300字以内)</p>
      <i @click="isShow = false" class="popup-hide movePoin el-dialog__close el-icon el-icon-close" style="position: absolute;top: 10px;right: 15px;"></i>
      <!-- <el-input class="w350" placeholder="请输入删除原因" v-model="popupValue"></el-input> -->
      <textarea v-model="popupValue" placeholder="请输入删除原因" style="width: 100%;min-height: 100px;">
          </textarea>
      <div v-if="!popupValue" class="fontRed">删除原因不能为空</div>
      <div v-if="popupValue && popupValue.length > 300" class="fontRed">删除原因超过规定长度</div>
      <div style="text-align: right;">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="del(false)" :disabled="!(popupValue && popupValue.length > 0 && popupValue.length <= 300)">确定删除</el-button>
        <el-button v-if="isReview" @click="del(true)" :disabled="!(popupValue && popupValue.length > 0 && popupValue.length <= 300)">删除并审核通过</el-button>
      </div>
    </popup-body>
  </div>
</template>

<script  type="module">
import popupBody from 'components/popup/popupdata';
import hasAuth from 'utils/checkAuth'
import SelectAreaGrid from 'components/common/SelectAreaGrid';
import YuanbenPage from 'components/common/YuanbenPage';
import { getEnums, getDicts } from 'api/common';
import { postReviewDelete } from 'api/maai/workflow/workedit'
import * as entity from 'api/medicalDevices/entity';
export default {
    components: { SelectAreaGrid,YuanbenPage,popupBody },
    async mounted() {
      if (this.$route.query.statistics) {
        this.searchMap.manageState.push("NORMAL")
      }
      await this.getenumsFun()
    },
    methods: {
      pageSearch(){
        this.loading = true;
        entity.page(this.page, this.searchMap).then(r => {
          this.tableData = r.data.list;
          this.page.total = r.data.total;
          this.loading = false;
        });
      },
      getenumsFun(){
        this.isReview = hasAuth('maai.biz.pb|func.review')
        getEnums(['com.ybveg.govx.enums.maai.MaaiEntityStateEnum'], false).then(r => {
          this.subStateSelect = r.data;
          for (let i = 0; i < this.subStateSelect.length; i++) {
            if (this.subStateSelect[i].key === 'FIRST') {
              this.subStateSelect.splice(i, 1);
            };
          };
        });
        
        getEnums(['com.ybveg.govx.enums.maai.MaaiInstruRankEnum'], false).then(r => {
          this.categoryList = r.data;
        });
        getEnums(['com.ybveg.govx.enums.ManageStateEnum'], false).then(r => {
          this.manageStateList = r.data;
        });

        this.pageSearch();
      },
      areaCodeChange (value) {
        if (value[value.length - 1]) {
          this.searchMap.areaCode = value[value.length - 1];
        } else {
          this.searchMap.areaCode = '';
        };
        this.pageSearch();
      },
      pageCurrentChange (num) {
        if (num !== this.page.pageNum) {
          this.page.pageNum = num;
          this.pageSearch();
        }
      },
      pageSizeChange (size) {
        if (size !== this.page.pageSize) {
          this.page.pageSize = size;
          this.pageSearch();
        };
      },
      sortChange () {
        // descending下降 ascending上升
        // console.log(arguments)
        this.searchMap.sortColu = arguments[0].prop;
        this.searchMap.sort = arguments[0].order;
        this.pageSearch();
      },
      handleStyle (item) {
        if (item.column.label === "主体状态") {
          let text='licStateLabel'
          return text;
        };
      },
      del (isReview) {
        entity.del(this.entityId, this.popupValue).then(r => {
          if (r.status) {
            if (isReview) {
              postReviewDelete(r.data, {state: 'ALREADY_FILE', entityId: this.entityId}).then(response => {
                if (response.status) {
                  this.$message({message: '主体删除并审核成功', type: 'success'})
                  this.isShow = false
                  this.pageSearch()
                } else {
                  this.$message({message: response.message, type: 'warning'})
                }
              })
            } else {
              this.$message({message: '主体删除成功', type: 'success'})
              this.isShow = false
              this.pageSearch()
            }
          } else {
            this.$message({message: r.message, type: 'warning'})
          }
        })
      },
      show (entityId) {
        this.isShow = true
        this.entityId = entityId
      },
      cancel () {
        this.isShow = false
        this.popupValue = ''
      }
    },
    data () {
      return {
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        loading:false,
        manageStateList:[],
        subStateSelect:[],
        categoryList: [],
        tableData:[],
        searchMap:{
          areaCode:'',
          keysWork:'',
          optState:[],
          manageState:[],
          category: [],
          entityType: 'MAAI_PRODUCT'
        },
        isShow:false,
        popupValue: '',
        entityId: '',
        isReview: false
      };
    }
  };
</script>

<style scoped lang="sass">
  .ipt-btn-box {
    margin: 20px 0;
    overflow: hidden;
  }
  .selBox{
    text-align: right;
    width: 80%;
    float: right;
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
  .licStateLabel .cell {
    overflow: visible !important;
  }
  .fontRed{
    color: red;
    font-size: 12px;
    margin-top: -5px;
  }
</style>
