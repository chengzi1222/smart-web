<<template>
    <div class="rightBox">
        <div class="titie clear_a">
            <div class="titie_left">餐厨垃圾</div>
            <div class="titie_right">
                <el-date-picker class="w200 fr" :clearable='false' @change="timeChange" v-model="time" type="month"
                                align="right"
                    :picker-options="option" value-format="yyyy-MM">
                </el-date-picker>
            </div>
        </div>
        <div class="innerBox">
           <el-scrollbar  class="scrollbar">
                <div>
                    <el-table :data="tableData" class="table-div"  v-loading="loading" element-loading-text="数据正在努力加载中" >
                        <el-table-column show-overflow-tooltip prop="handleDate" min-width="100" label="处理日期"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="weight" min-width="100" label="重量/kg"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="receiveCompany" min-width="100" label="收运单位"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="receivePerson" min-width="100" label="收运人"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="deliveryPerson" min-width="150" label="交接人"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="remark" min-width="150" label="备注"></el-table-column>
                        <el-table-column show-overflow-tooltip  min-width="100" label="操作">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate" @click="toInfo(scope.row.id)">查看详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-box mt20 fr">
                    <el-pagination @size-change="pageSizeChange"
                        @current-change="pageCurrentChange"
                        :current-page="page.pageNum"
                        :page-sizes="[10,20,30,40]"
                        :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                    </el-pagination>
                </div>
            </el-scrollbar>

        </div>

    </div>
</template>

<script>
import * as api from "../../api/schoolTrace/index";
    export default {
        methods: {
            timeChange(){
                this.page.pageNum = 1;
                this.searchPage();
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
                    entityId:this.entityId,
                    current:this.page.pageNum,
                    queryDate:this.time,
                    clientType:'02',
                    size:this.page.pageSize
                }
                api.getTrash(obj).then(r=>{
                    if(r.code==200){
                        this.tableData=r.data.records;
                        this.page.total=r.data.total;
                        this.time = r.timestamp;
                        this.loading=false;
                    }
                })
            },
            toInfo(id){
                this.$router.push({
                    name: "schoolTrace.trashInfo",
                    query: {
                        id: id,
                        entityId:this.entityId
                    }
                });
            }
        },
        mounted() {
            if(this.$route.query.entityId){
                this.entityId=this.$route.query.entityId;
            }
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

