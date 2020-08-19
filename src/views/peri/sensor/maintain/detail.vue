<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>传感器详情</span>
      <Back></Back>
    </div>
    <div class="dataBox" v-loading="dataLoading">
      <el-form :model="formData" ref="form" label-width="155px">
        <toggle-form title="基础信息">
          <div class="childBox">
            <div class="item-box">
              <el-form-item label="设备编码：" prop="no" class="item" >
                <span>{{formData.no ? formData.no : '-'}}</span>
              </el-form-item>
              <el-form-item label="设备名称：" prop="name" class="item">
                <span>{{formData.name ? formData.name : '-'}}</span>
              </el-form-item>
            </div>
            <div class="item-box">
              <el-form-item label="设备型号：" prop="model" class="item">
                <span>{{formData.model ? formData.model : '-'}}</span>
              </el-form-item>
              <el-form-item label="设备厂商：" prop="firm" class="item">
                <span>{{ formData.firmStr ? formData.firmStr : '-'}}</span>
              </el-form-item>
            </div>
            <div class="item-box">
              <el-form-item label="位置：" prop="position" class="item" style="width: 700px;">
                <span>{{formData.position ? formData.position : '-'}}</span>
              </el-form-item>
            </div>
            <div class="item-box">
              <el-form-item label="状态：" prop="state" class="item">
                <span>{{formData.stateStr ? formData.stateStr : '-'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
        <toggle-form title="参数类型">
          <el-table :data="tableData" class="table-div allDown" style="margin-top: 30px;">
            <el-table-column show-overflow-tooltip prop="label" label="参数" min-width="150">
              <template slot-scope="scope">
                <span>{{scope.row.labelStr ? scope.row.labelStr : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="value" label="预警范围" min-width="150">
              <template slot-scope="scope">
                <span>
                  {{conditionOptionObj[scope.row.condition] ? conditionOptionObj[scope.row.condition] : '-'}}
                  {{scope.row.value.toString() ? scope.row.value.toString() : '-'}}
                  <span v-if="scope.row.value && scope.row.label === 'TEMPERATURE'">℃</span>
                  <span v-if="scope.row.value && scope.row.label === 'HUMIDITY'">RH</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </toggle-form>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn">
      <div class="fr">
        <el-button @click="cancle()">返回</el-button>
        <el-button @click="toEdit()" type="primary">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as sensorApi from "api/peri/sensor"
import Back from 'utils/back.vue' // 返回上一页按钮
import ToggleForm from "components/ToggleForm"; //列表块
import { getEnums } from 'api/common';
export default {
  components: {
    Back,
    ToggleForm
  },
  data() {
    return {
      id: '',
      formData: {},
      tableData: [],
      manufacturerOptions: [],
      statusOptions: [],
      btnLoading: false,
      dataLoading: false,
      conditionOptions: [],
      conditionOptionObj: {},
    }
  },
  computed: {
      
  },
  methods: {
    cancle() {
      this.$router.push({
        name:'sensor.maintain'
      });
    },
    toEdit() {
      this.$router.push({
        name: 'sensor.maintain.update',
        query: {
          type: 'isEdit',
          id: this.id
        }
      })
    }
  },
  async mounted() {
    this.id = this.$route.query.id;
    this.dataLoading = true;
    await getEnums(['com.ybveg.govx.enums.sensor.LabelConditionEnum']).then((data) => {
      this.conditionOptions = data.data;
      this.conditionOptions.forEach(({ key, name }) => this.conditionOptionObj[key] = name);
    });

    await sensorApi.getDeviceDetail({id: this.id}).then(res => {
      if(res.status) {
        this.formData = res.data;
        this.tableData = res.data.yesLabels;
      }
      this.dataLoading = false;
    }).catch(err => {})
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
  .dataBox {
    margin-top: 20px;
    .childBox {
      margin-top: 30px;
      margin-left: 50%;
      transform: translate(-50%);
      .item-box {
        display: inline-block;
        line-height: 20px;
        position: relative;
        width: 100%;
        .item {
          display: inline-block;
          span {
            min-width: 160px;
            max-width: none;
            line-height: 34px;
          }
        }
      }
    }
  }
}

</style>
