<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>检查要点配置</span>
    </div>
    <el-table :data="dataPage" class="mt20">
      <el-table-column show-overflow-tooltip prop="value" min-width="200" label="检查业务" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="200" label="要点表" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tableName ? scope.row.tableName : '暂未配置'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="180" label="操作" align="center">
        <template slot-scope="scope">
          <span style="color: #1787AD;" @click="$router.push({ name: 'patrolDetail', query: { patrolTableId: scope.row.tableId }});"
            v-if="scope.row.tableId">预览</span>
          <span style="color: #FA503B;" @click="open(scope.row.key, scope.row.value)" v-if="$store.getters.user.areaCode.length === 6">配置</span>
        </template>
      </el-table-column>
    </el-table>
    <popupBody class="peizhi popup-body" v-show="isShow">
      <p>{{ title }}检查要点表配置</p>
      <el-input class="w200" placeholder="要点表名称" v-model="searchMap.name"></el-input>
      <enum-select class="vitMid" v-model="searchMap.type" @change="getPage()" :enum="'com.ybveg.govx.enums.ConfigTypeEnum'"></enum-select>
      <el-button type="primary" @click="getPage()">搜索</el-button>
      <el-table v-loading="loading" :data="tableData" class="mt10">
        <el-table-column show-overflow-tooltip min-width="50" type="index" label="序号" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" min-width="250" label="要点表名称" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="type" min-width="100" label="类型" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateTime" min-width="120" label="更新时间" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="180" label="操作" align="center">
          <template slot-scope="scope">
            <span style="color: #1787AD;" v-if="scope.row.default">当前配置</span>
            <span style="color: #FA503B;" @click="update(scope.row.id)" v-else>配置</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box mt20 textR">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="page.total" @size-change="pageSizeChange" @current-change="pageNumChange">
        </el-pagination>
      </div>
      <el-button class="floatR w100 mt10" @click="colse()">关闭</el-button>
    </popupBody>
  </div>
</template>

<script>
  import popupBody from 'components/popup/popupdata';
  import { getTable, page, update } from 'api/activity/table'
  import EnumSelect from 'components/common/EnumSelect'
  export default {
    methods: {

    },
    mounted() {
      getTable().then(r => {
        this.dataPage = r.data
      })
    },
    data() {
      return {
        dataPage: [],
        title: '',
        Use: '',
        isShow: false,
        useLis: [{
          type: '全部使用情况',
          key: ''
        }, {
          type: '正常使用',
          key: 'TRUE'
        }, {
          type: '未正常使用',
          key: 'FALSE'
        }],
        page: {
          pageSize: 5,
          pageNum: 1,
          total: 0
        },
        searchMap: {
          activeType: '',
          type: '',
          name: ''
        },
        tableData: [],
        loading: false
      };
    },
    components: {
      popupBody,
      EnumSelect
    },
    methods: {
      getPage() {
        page(this.page, this.searchMap).then(r => {
          this.tableData = r.data.list
          this.page.total = r.data.total
        })
      },
      open(type, value) {
        this.isShow = true
        this.title = value
        this.searchMap.activeType = type
        this.getPage()
      },
      colse() {
        getTable().then(r => {
          this.dataPage = r.data
          this.isShow = false
          this.searchMap.activeType = ''
        })
      },
      pageSizeChange(size) {
        this.page.pageSize = size
        this.getPage()
      },
      pageNumChange(num) {
        this.page.pageNum = num
        this.getPage()
      },
      update(id) {
        let _this = this
        _this.loading = true
        new Promise(function (resolve, reject) {
          try {
            update(_this.searchMap.activeType, id).then(r => {
              page(_this.page, _this.searchMap).then(response => {
                _this.tableData = response.data.list
                _this.page.total = response.data.total
                resolve()
              })
            })
          } catch (err) {
            reject()
          }
        }).then(function () {
          _this.loading = false
        }).catch(function () {
          _this.loading = false
        })
      }
    }
  }
</script>

<style lang="sass">
  .peizhi .popup-div {
    margin-left: -390px !important;
  }
</style>
<style scoped lang="sass">
  .vitMid {
    vertical-align: -96%;
  }
</style>