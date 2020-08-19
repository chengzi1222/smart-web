<template>
  <div>
    <el-table class="table-div mt20" :data="tableData" border>
      <el-table-column show-overflow-tooltip type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="typeStr" label="操作类型" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createUser" label="操作人员" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip label="重要项变更" min-width="200">
        <template slot-scope="scope">
          <p v-if='scope.row.importance' v-for="item in scope.row.importance.split('$$$$')">
            {{item}}
          </p>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="操作时间" min-width="120"></el-table-column>
      <el-table-column min-width="100" label="操作">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" v-if="scope.row.type != 'ADD'"
             @click="$router.push({name:goname,query:{workId: scope.row.id,code: $route.query.code,entityType: $route.query.entityType}})">
             详情
          </a>
          <span v-else style="cursor: no-drop">详情</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box textR mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getWorkflowPaging } from "api/special/elevator";
  export default{
    data() {
      return {
        subName: '',
        tableData: [],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        goname:''
      }
    },
    mounted() {
      switch (this.$route.query.entityType) {
        case 'ELEVATOR':
          this.goname = 'specialElevator_ElevatorArchives_editInfo'
          break;
        case 'BOILER':
          this.goname = 'specialBoiler_BoilerArchives_editInfo'
          break;
        case 'PRESSURE_VESSEL':
          this.goname = 'specialpressureVessel_pressureVesselArchives_editInfo'
          break;
        case 'PRESSURE_PIPING':
          this.goname = 'specialpressurePiping_pressurePipingArchives_editInfo'
          break;
        case 'HOISTING_MACHINERY':
          this.goname = 'specialhoistingMachinery_hoistingMachineryArchives_editInfo'
          break;
        case 'PASSENGER_ROPEWAY':
          this.goname = 'specialpassengerRopeway_passengerRopewayArchives_editInfo'
          break;
        case 'LARGE_PLAYGROUND':
          this.goname = 'speciallargePlayground_largePlaygroundArchives_editInfo'
          break;
        case 'MECHANICALLY_PROPELLED_VEHICLE':
          this.goname = 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_editInfo'
          break;
      }
      this.getWorkflowPaging();
    },
    methods: {
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getWorkflowPaging();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getWorkflowPaging();
      },
      getWorkflowPaging(){
        let params = {
          entityId: this.$route.query.id,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize
        }
        getWorkflowPaging(params).then(r => {
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      }
    },
  }
</script>

<style scoped lang="sass">

</style>