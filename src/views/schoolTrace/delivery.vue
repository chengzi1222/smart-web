<<template>
  <div class="rightBox">
    <div class="titie clear_a">
      <div class="titie_left">出库登记</div>
      <div class="titie_right">
        <el-date-picker class="w200 fr" :clearable='false' @change="timeChange" v-model="time" type="month"
                        align="right"
                        :picker-options="option">
        </el-date-picker>
      </div>
    </div>
    <div class="innerBox">
      <el-scrollbar  class="scrollbar">
        <div>
          <el-table :data="tableData" class="table-div"  v-loading="loading" element-loading-text="数据正在努力加载中" >
            <el-table-column show-overflow-tooltip prop="stockOutTime" min-width="100" label="出库时间"></el-table-column>
            <el-table-column show-overflow-tooltip prop="stockOutNo" min-width="100" label="出库单编号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="handlerName" min-width="100" label="领用人"></el-table-column>
            <el-table-column show-overflow-tooltip prop="pdtNum" min-width="100" label="出库品种数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="pdt" min-width="150" label="出库食品名称"></el-table-column>
            <el-table-column show-overflow-tooltip  min-width="100" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate" @click="toInfo(scope.row.guid, scope.row.pdtNum)">查看详情</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-box mt20 fr">
          <el-pagination @size-change="pageSizeChange"
                         @current-change="pageCurrentChange"
                         :current-page="page.pageNum"
                         :page-sizes="[10,20,30,40]"
                         :page-size="page.pageSize" layout="sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </el-scrollbar>

    </div>

  </div>
</template>

<script>
  import * as api from "../../api/schoolTrace/home";
  export default {
    methods: {
      timeChange(){
        this.page.pageNum = 1;
        this.getNowTime(this.time);
        this.searchPage();
      },
      getNowTime(date){
        //  获取时间，默认为当前时间
        let dates = date || new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        this.time=dates.getFullYear() + "-" + mon;
      },
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageNum = 1;
        this.page.pageSize = size;
        this.searchPage();
      },
      searchPage(){
        this.loading=true;
        let obj={
          byGuid:this.entityId,
          pageNumber:this.page.pageNum,
          date:this.time,
          pageSize:this.page.pageSize
        }
        api.getDelivery(obj).then(r=>{
          if(r.code==200){
            this.tableData=r.data;
            this.loading=false;
          }
        })
      },
      toInfo(id,num){
        this.$router.push({
          name: "schoolTrace.deliveryInfo",
          query: {
            id: id,
            num:num
          }
        });
      }
    },
    mounted() {
      if(this.$route.query.entityId){
        this.entityId=this.$route.query.entityId;
      }
      this.getNowTime(false);
      this.searchPage();
    },
    data() {
      return {
        entityId:'',
        loading:true,
        tableData:[],
        time:'',
        option: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
      };
    }
  }
</script>

<style scoped lang='scss'>
  .rightBox{
    width:calc(100% - 60px);
    padding: 0 30px;
    height: 100%;
    .titie{
      height: 80px;
      line-height: 80px;
      .titie_left{
        font-size:20px;
        font-weight:500;
        color:rgba(51,51,51,1);
        width: 50%;
        height: 100%;
      }
      .titie_right{
        width: 50%;
        height: 100%;
        text-align: right;
      }
    }
    .innerBox{
      width:calc(100% - 40px);
      padding: 30px 20px;
      height:calc(888px - 100px);
      background:#fff;
      border-radius:10px;
      .scrollbar {
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>

