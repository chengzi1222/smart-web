<template>
  <div id="dialog" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="user-box">
    <span class="movePoin elButton" @click="close">
      <i class="el-icon-close"></i>
    </span>
    <div class="page-tilt">
      <b></b>
      <span>管理执行人员</span>
    </div>
    <div class="ipt-btn-box">
      <el-input style="vertical-align:top;" placeholder="请输入姓名" class="w200 mr20 seekIpt" v-model="condition.userName" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select v-model="condition.state" clearable @change="getPage" placeholder="请选择">
        <el-option v-for="item in addStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <enum-select v-model="condition.leader" placeholder="是否有组长权限" @change="handleIconClick" enum="com.ybveg.govx.enums.YesNoEnum"></enum-select>
      <enum-select v-model="condition.entityType" :retainKey="bizs" placeholder="分管业务" @change="handleIconClick" enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>
    </div>

    <div style="margin-bottom:5px">
      <p>当前组长为：{{leaderName}}</p>
    </div>

    <div style="margin-bottom:5px">
      <p>提示：每组监管人员：{{eachGroups}}个；已添加监管人员：{{users.length}}个；还需添加：{{eachGroups - users.length}}个；</p>
    </div>

    <div :class="down?'tabOffTop170':'tabOffTop120'">
      <el-table :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" :key="maxheight" :max-height="maxheight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>

        <el-table-column show-overflow-tooltip prop="realName" label="姓名"></el-table-column>

        <el-table-column show-overflow-tooltip prop="bizLabel" label="分管业务"></el-table-column>

        <el-table-column show-overflow-tooltip prop="leaderLabel" label="是否有组长权限"></el-table-column>

        <el-table-column show-overflow-tooltip resizable width="90" label="是否组长">
          <template slot-scope="data">
            <span>{{data.row.userId == leaderId ? '是' : '否'}}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip resizable width="90" label="状态">
          <template slot-scope="data">
            <span>{{data.row.state == 'YES' ? '已添加' : '未添加'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <a v-if="scope.row.leader == 'YES' && scope.row.userId != leaderId" @click="setLeader(scope.row)" href="javascript:;" class="operate-a">设为组长</a>
            <a v-if="scope.row.state == 'YES' && scope.row.userId != leaderId" @click="deleteUser(scope.row)" href="javascript:;" class="operate-a">删除</a>
            <a v-if="scope.row.state == 'NO'" @click="addUser(scope.row)" href="javascript:;" class="operate-a">添加</a>
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
  import { randomUserList } from "api/random/random";
  import EnumSelect from 'components/common/EnumSelect.vue';
  import { calcTableHeight, boxShadow } from 'utils/utils';

  export default {
    props: {
      users: {
        type: Array
      },
      bizs: {
        type: Array
      },
      checkAreaCode: {
        type: String,
      },
      eachGroups: {
        type: Number
      },
      leaderName: {
        type: String
      },
      leaderId: {
        type: String
      },
      groupNum: {
        type: Number
      }
    },
    components: {
      EnumSelect,
    },
    async mounted() {
      this.getPage();
      this.maxheight = calcTableHeight(this.tableHeight, 240);
      setTimeout(() => {
        this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth, document.getElementsByClassName("el-table__body")[0].clientWidth);
      }, 0);
    },
    methods: {
      close() {
        if (this.eachGroups - this.users.length != 0) {
          this.$message({ message: '请完善人员添加!', type: 'warning' });
        } else {
          this.$emit("close");
        }
      },
      setLeader(row) {
        row.leader = '';
        this.$emit("setLeader", this.groupNum, row.userId, row.realName);
        this.getPage();
      },
      deleteUser(row) {
        row.state = '';
        this.$emit("deleteUser", this.groupNum, row.userId, row.realName);
        this.getPage();
      },
      addUser(row) {
        if (this.eachGroups - this.users.length > 0) {
          row.state = '';
          this.$emit("addUser", this.groupNum, row.userId, row.realName);
          this.getPage();
        } else {
          this.$message({ message: '无需添加人员', type: 'warning' });
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
      //页面查询
      async getPage() {
        let entityTypes = [];
        if (this.condition.entityType) {
          entityTypes.push(this.condition.entityType);
        } else {
          entityTypes = entityTypes.concat(this.bizs);
        }
        let userIds = [];
        if (this.users) {
          this.users.forEach(user => {
            userIds.push(user.userId);
          });
        }
        let formData = {
          users: userIds,
          areaCode: this.checkAreaCode,
          bizs: entityTypes,
          state: this.condition.state,
          userName: this.condition.userName,
          leader: this.condition.leader,
        }
        randomUserList(formData, this.page.pageSize, this.page.num).then(r => {
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
        page: {
          pageSize: 10,
          num: 1,
          total: 0
        },
        condition: {
          userName: '',
          entityType: '',
          areaCode: '',
          state: '',
          leader: '',
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