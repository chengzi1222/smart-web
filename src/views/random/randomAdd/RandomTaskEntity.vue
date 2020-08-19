<template>
  <div id="dialog" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="user-box">
    <span class="movePoin elButton" @click="close">
      <i class="el-icon-close"></i>
    </span>
    <div class="page-tilt">
      <b></b>
      <span>管理待检查主体</span>
    </div>
    <div class="ipt-btn-box">
      <el-input style="vertical-align:top;" placeholder="请输入主体名" class="w200 mr20 seekIpt" v-model="condition.entityName" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select v-model="condition.state" clearable @change="getPage" placeholder="请选择">
        <el-option v-for="item in addStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-cascader class="selectHeight w250" :clearable="true" v-model="entityAreaCodeList" placeholder="所属区域" :change-on-select="true"
        :options="areaList.options" :props="areaList.props" :show-all-levels="false" @change="handleAreaChange">
      </el-cascader>

      <enum-select v-model="condition.entityType" :retainKey="entityType" placeholder="主体类型" @change="handleIconClick" enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
    </div>

    <div style="margin-bottom:5px">
      <p>提示：每组被监管主体：{{enterpriseGroups}}个；已添加主体：{{entitys.length}}个；还需添加：{{enterpriseGroups - entitys.length}}个；</p>
    </div>

    <div :class="down?'tabOffTop170':'tabOffTop120'">
      <el-table :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" :key="maxheight" :max-height="maxheight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>

        <el-table-column show-overflow-tooltip prop="entityName" label="主体名"></el-table-column>

        <el-table-column show-overflow-tooltip prop="entityType" label="主体类型"></el-table-column>

        <el-table-column show-overflow-tooltip prop="areaName" label="所属辖区"></el-table-column>

        <el-table-column show-overflow-tooltip prop="spaceAddr" width="70" label="地址"></el-table-column>

        <el-table-column show-overflow-tooltip resizable width="90" label="状态">
          <template slot-scope="data">
            <span>{{data.row.state == 'YES' ? '已添加' : '未添加'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <a v-if="scope.row.state == 'YES'" @click="deleteEntity(scope.row)" href="javascript:;" class="operate-a">删除</a>
            <a v-if="scope.row.state == 'NO'" @click="addEntity(scope.row)" href="javascript:;" class="operate-a">添加</a>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.num" :page-sizes="[5,8,10,15,20,25,30]"
          :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>

    </div>

  </div>
</template>

<script>
  import { randomEntityList, findTaskAreaList } from "api/random/random";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import { calcTableHeight, boxShadow } from 'utils/utils';

  export default {
    props: {
      entitys: {
        type: Array
      },
      entityType: {
        type: Array
      },
      checkedAreaCode: {
        type: String,
      },
      enterpriseGroups: {
        type: Number
      },
      groupNum: {
        type: Number
      }
    },
    components: {
      EnumSelect,
    },
    async mounted() {
      this.initData();
      this.getPage();
      this.maxheight = calcTableHeight(this.tableHeight, 240);
      setTimeout(() => {
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth, document.getElementsByClassName("el-table__body")[0].clientWidth);
      }, 0);
    },
    methods: {
      close() {
        if (this.enterpriseGroups - this.entitys.length != 0) {
          this.$message({ message: '请完善主体添加!', type: 'warning' });
        } else {
          this.$emit("close");
        }
      },
      deleteEntity(row) {
        row.state = '';
        this.$emit("deleteEntity", this.groupNum, row.id, row.entityName);
        this.getPage();
      },
      addEntity(row) {
        if (this.enterpriseGroups - this.entitys.length > 0) {
          row.state = '';
          this.$emit("addEntity", this.groupNum, row.id, row.entityName);
          this.getPage();
        } else {
          this.$message({ message: '无需添加主体', type: 'warning' });
        }

      },
      downSeleBox() {
        this.down = !this.down;
        if (this.down) {
          this.maxheight = calcTableHeight(this.tableHeight, 240);
        } else {
          this.maxheight = calcTableHeight(this.tableHeight, 190);
        }
      },
      handleAreaChange() {
        this.condition.areaCode = this.entityAreaCodeList[this.entityAreaCodeList.length - 1]
        this.getPage();
      },
      //页面查询
      async getPage() {
        let entityTypes = [];

        if (this.condition.entityType) {
          entityTypes.push(this.condition.entityType);
        } else {
          entityTypes = entityTypes.concat(this.entityType);
        }
        let formData = {
          entitys: this.entitys,
          areaCode: this.condition.areaCode ? this.condition.areaCode : this.checkedAreaCode,
          entityType: entityTypes,
          entityName: this.condition.entityName,
          state: this.condition.state,
        }
        randomEntityList(formData, this.page.pageSize, this.page.num).then(r => {
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      handleIconClick() {
        this.getPage();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.num = num;
        this.getPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPage();
      },
      async initData() {
        await findTaskAreaList(this.checkedAreaCode).then(result => {
          this.areaList.options = result.data;
        })

      },
    },
    computed: {

      tableHeight() {
        return this.$store.state.layout.tableHeight;
      },
      tableWidth() {
        return this.$store.state.layout.tableWidth;
      }
    },
    watch: {
      checkedAreaCode() {

      },
      tableHeight() {
        this.maxheight = calcTableHeight(this.tableHeight, 240);
      },
      tableWidth() {
        setTimeout(() => {
          this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth, document.getElementsByClassName("el-table__body")[0].clientWidth);
        }, 0)
      }
    },
    data() {
      return {
        down: true,
        maxheight: 0,
        shadowShow: false,
        entityAreaCodeList: [],
        addStatus: [
          {
            value: 'YES',
            label: '已添加'
          },
          {
            value: 'NO',
            label: '未添加'
          }
        ],
        //所属区域下拉列表
        areaList: {
          options: [],
          props: {
            label: 'areaName',
            value: 'areaCode',
            children: "children"
          }
        },
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        condition: {
          entityName: '',
          entityType: '',
          areaCode: '',
          state: ''
        },
        //列表数据
        tableData: [],
        loading: false,
      };
    }
  }
</script>

<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .down {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #C2CAD2;
    color: #A2AAB6;
    text-align: center;
    line-height: 32px;
    font-size: 18px;
    margin-left: 20px;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    line-height: 34px;
  }

  .ipt-btn-box button {
    position: absolute;
    right: 40px;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box a {
    color: #9A9A9A;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    /*display: flex;*/
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9A9A9A;
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
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    /*display: flex;*/
    /*justify-content: space-between;*/
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
    color: #1787AD;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .sleq {
    margin: 0 10px 0 20px;
  }

  .slez {
    margin-left: 10px;
  }

  #content {
    margin-top: 100px;
    /* opacity: 0; */
  }

  @media print {
    .cut {
      page-break-after: always;
      padding-bottom: 30px;
      min-height: 800px;
    }
  }

  #dialog {
    width: 760px;
    height: 560px;
    position: fixed;
    left: calc(50% - 400px);
    top: calc(50% - 300px);
    background: #fff;
    padding: 20px;
    border: 2px solid #000;
    border-radius: 5px;
  }

  .elButton {
    position: absolute;
    top: 20px;
    right: 20px;
  }
</style>