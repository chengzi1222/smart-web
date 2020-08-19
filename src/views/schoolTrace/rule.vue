<<template>
    <div class="rightBox">
        <div class="titie clear_a">
            <div class="titie_left">规章制度</div>
            <!--<div class="titie_right">-->
                <!--<el-date-picker class="w200 fr" :clearable='false' @change="timeChange" v-model="time" type="month"-->
                                <!--align="right"-->
                                <!--:picker-options="option">-->
                <!--</el-date-picker>-->
            <!--</div>-->
        </div>
        <div class="innerBox">
            <el-scrollbar  class="scrollbar">
                <div>
                    <el-table :data="tableData" class="table-div"  v-loading="loading" element-loading-text="数据正在努力加载中" >
                        <el-table-column show-overflow-tooltip prop="name" min-width="100" label="制度名称"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="type" min-width="100" label="制度类型"></el-table-column>
                        <el-table-column show-overflow-tooltip  min-width="100" label="操作">
                            <template slot-scope="scope">
                                <a href="javascript:;" class="operate" @click="traceBoxShow(scope.row)">查看详情</a>
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
        <div class="popupBox absolute" v-if="popupBoxShow">
            <div class="popupDiv">
                <h3>
                    <i style="transform: rotate(180deg);" class="icon-arrows iconfont movePoin" @click="goIndex"></i>
                    <span>规章制度详情</span>
                    <i class="icon-exit iconfont movePoin" @click="popupBoxShow = false"></i>
                </h3>
                <iframe v-if="src" :src="src" frameborder="0"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
    import * as api from "../../api/schoolTrace/index";
    import config from "../../utils/config"
    import {getCookie} from "../../utils/sessionStorage";
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
                let mon = dates.getMonth() + 1;
                if (mon <= 9) {
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
                    entityId:this.entityId,
                    current:this.page.pageNum,
                    size:this.page.pageSize,
                    keyword:''
                }
                api.getRegulation(obj).then(r=>{
                    if(r.code==200){
                        this.tableData=r.data.records;
                        this.page.total=r.data.total;
                        this.loading=false;
                    }
                })
            },
            traceBoxShow(item) {
                this.src =  `${config.getBasicUrl}/api/guard/views/h5/regulation/index.html?entityId=${item.entityId}&id=${item.id}&XCWSOpenSecret=${getCookie('XCWSOpenSecret')}`
                this.popupBoxShow = true;
            },
            goIndex() {
                let _src = this.src;
                this.src = ''
                setTimeout(() => {
                    this.src = _src
                }, 30);
            },
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
                popupBoxShow: false,
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
    .popupBox {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
    }
    .popupDiv {
        position: absolute;
        height: 600px;
        width: 373px;
        top: 50%;
        margin-top: -280px;
        left: 50%;
        margin-left: -186px;
        background: #fff;
    }

    .popupDiv h3 {
        height: 40px;
        line-height: 40px;
        background: #f2f5f8;
        font-weight: 100;
        display: flex;
        justify-content: space-between;
    }

    .popupDiv h3 span {
        color: #393939;
        font-size: 14px;
    }

    .popupDiv h3 i {
        color: #9a9a9a;
        font-size: 16px;
        margin: 0 12px;
    }

    iframe {
        width: 373px;
        height: 560px;
    }
</style>
<style>
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>

