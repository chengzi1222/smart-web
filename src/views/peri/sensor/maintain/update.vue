<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{title}}传感器</span>
      <Back></Back>
    </div>
    <div class="dataBox" v-loading="dataLoading">
      <el-form :model="formData" :rules="rules" ref="form" label-width="155px">
        <toggle-form title="基础信息">
          <div class="childBox">
            <div class="item-box">
              <el-form-item label="设备编码：" prop="no" class="item">
                <el-input v-model="formData.no" :disabled="type==='isEdit'" class="w160" maxlength="40" placeholder="请输入设备编码"></el-input>
              </el-form-item>
              <el-form-item label="设备名称：" prop="name" class="item">
                <el-input v-model="formData.name" :disabled="type==='isEdit'" class="w160" maxlength="50" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </div>
            <div class="item-box">
              <el-form-item label="设备型号：" prop="model" class="item">
                <el-input v-model="formData.model" class="w160" maxlength="50" placeholder="请输入设备型号"></el-input>
              </el-form-item>
              <el-form-item label="设备厂商：" prop="firm" class="item">
                <el-select class="w160" v-model="formData.firm" placeholder="请选择设备厂商">
                  <el-option v-for="item in firmOptions" :key="item.key" :label="item.name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item-box">
              <el-form-item label="位置：" prop="position" class="item" style="width: 700px;">
                <el-input v-model="formData.position" style="width: 480px;" maxlength="50" placeholder="请输入设备位置信息"></el-input>
                <span class="tips">(选填)</span>
              </el-form-item>
            </div>
            <div class="item-box">
              <el-form-item label="状态：" prop="state" class="item">
                <el-select class="w160" v-model="formData.state" placeholder="请选择设备状态">
                  <el-option v-for="item in stateOptions" :key="item.key" :label="item.name" :value="item.key">
                  </el-option>
                </el-select>
                <span class="tips">(选填)</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
        <toggle-form title="参数类型">
          <el-button class="mt20 mb20" @click="add" :loading="btnLoading" icon="el-icon-plus" type="primary">添加</el-button>
          <el-table :data="tableData" class="table-div allDown" :header-cell-class-name="star">
            <el-table-column show-overflow-tooltip prop="label" label="参数" min-width="150">
              <template slot-scope="scope">
                <el-select class="w120" v-if="scope.row.isEditing" v-model="scope.row.label" placeholder="请选择参数" >
                    <el-option v-for="item in labelOptions" :key="item.key" :label="item.name" :value="item.key" :disabled="item.disabled">
                    </el-option>
                </el-select>
                <span v-else>{{labelOptionObj[scope.row.label] ? labelOptionObj[scope.row.label] : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="预警范围" min-width="150">
              <template slot-scope="scope">
                <div v-if="scope.row.isEditing">
                  <el-select class="w120" v-model="scope.row.condition" placeholder="请选择条件">
                    <el-option v-for="item in conditionOptions" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                  <el-input class="w100" v-model="scope.row.value" placeholder="值" maxlength="10"></el-input>
                  <span v-if="scope.row.label === '温度'">℃</span>
                  <span v-if="scope.row.label === '湿度'">RH</span>
                </div>
                <div v-else>
                  <span>{{conditionOptionObj[scope.row.condition] ? conditionOptionObj[scope.row.condition] : '-'}}</span>
                  <span>{{scope.row.value.toString() ? scope.row.value.toString() : '-'}}</span>
                  <span v-if="scope.row.label === '温度'">℃</span>
                  <span v-if="scope.row.label === '湿度'">RH</span>
                </div>
              </template>
            </el-table-column> 
            <el-table-column fixed="right" label="操作" min-width="180">
              <template slot-scope="scope">
                <a v-if="!scope.row.isEditing" href="javascript:;" @click="operate(scope.row, 'edit', scope.$index)" class="operate">编辑</a>
                <a v-else href="javascript:;" @click="operate(scope.row, 'save', scope.$index)" class="operate">保存</a>
                
                <a href="javascript:;" @click="operate(scope.row, 'del', scope.$index)" class="operate">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </toggle-form>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn">
      <div class="fr">
        <el-button @click="cancle()">取消并返回</el-button>
        <el-button @click="submit()" type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Back from 'utils/back.vue' // 返回上一页按钮
import ToggleForm from "components/ToggleForm"; //列表块
import * as sensorApi from "api/peri/sensor";
import { getEnums } from 'api/common';
export default {
  components: {
    Back,
    ToggleForm
  },
  data() {
    return {
      title: '添加',
      formData: {},
      tableData: [],
      firmOptions: [],
      stateOptions: [],
      conditionOptions: [],
      labelOptions: [],
      labelOptionObj: {},
      conditionOptionObj: {},
      rules: {
        no: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
        firm: [{ required: true, message: '请输入设备厂商', trigger: 'change' }],
      },
      type: 'isAdd',
      id: '',
      btnLoading: false,
      dataLoading: false,
      labelsName: [], // 参数名
      hasRowEditing: false // table中有某一行正处于编辑状态
    }
  },
  computed: {
      
  },
  methods: {
    star(obj) {
      if(obj.columnIndex == 0 || obj.columnIndex == 1) {
        return 'star';
      }
    },
    labelDisable () {
      // table中已有的参数，新增时禁止选择
      if (this.tableData.length > 0) {
        for(let i=0;i<this.labelOptions.length;i++) {
          this.labelOptions[i].disabled = false; // 重置禁用状态
          for(let j=0; j<this.tableData.length; j++) {
            if(this.labelOptions[i].key === this.tableData[j].label) {
              this.labelOptions[i].disabled = true;
            }
          }
        }
      }
    },
    operate(row, type, index) {
      if (this.tableData.length > 0) {
        for(let i=0;i<this.labelOptions.length;i++) {
          this.labelOptions[i].disabled = false; // 重置禁用状态
          for(let j=0; j<this.tableData.length; j++) {
            if(this.labelOptions[i].key === this.tableData[j].label && j != index) {
              this.labelOptions[i].disabled = true;
            }
          }
        }
      }
      if(type === 'save') {
        if(!row.label) {
          this.$message.warning("请选择参数");
          return;
        }
        if(!row.condition) {
          this.$message.warning("请选择判断条件");
          return;
        }
        if(!row.value.toString()) {
          this.$message.warning("请输入判断值");
          return;
        }
        row.isEditing = false;
        this.hasRowEditing = false;
      }
      if(type === 'edit') {
        if(this.hasRowEditing) {
          this.$message.warning("请先保存上一条参数");
          return;
        }
        row.isEditing = true;
        this.hasRowEditing = true;
      }
      if(type === 'del') {
        if(row.isEditing) { // 删除未保存的行
          this.hasRowEditing = false;
        }
        this.tableData.splice(index, 1);
      }
    },
    add() {
      if(this.hasRowEditing) {
        this.$message.warning("请先保存上一条参数");
        return;
      }
      this.tableData.unshift({
        label: "",
        condition: "",
        value: "",
        isEditing: true
      });
      this.labelDisable();
      this.hasRowEditing = true;
    },
    cancle() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.labelsName = [];
          this.tableData.forEach(item => {
            this.labelsName.push(item.label);
          })
          let addObj = {
            id: this.formData.id ? this.formData.id : "",
            firm: this.formData.firm,
            labels: this.labelsName,
            model: this.formData.model,
            name: this.formData.name,
            no: this.formData.no,
            position: this.formData.position ? this.formData.position : "",
            state: this.formData.state ? this.formData.state : ""
          }
          if(this.hasRowEditing) {
            this.$message.warning("请先保存参数");
            return;
          }
          if(this.tableData.length == 0) {
            this.$message.warning("参数不能为空");
            return;
          }
          this.dataLoading = true;
          if(this.type === 'isAdd') { // 添加保存
            // 添加基础信息和参数名称
            sensorApi.deviceAdd(addObj).then(res => {
              if(res.status) {
                // if(!addObj.labels) { // 没有添加参数
                //   this.$message.success("添加成功");
                //   return;
                // }
                this.getLabelId(res.data);
              } else {
                this.dataLoading = false;
              }
            }).catch(err => {
              this.dataLoading = false;
            })
          } else { // 编辑保存
            // 编辑基础信息和参数名称
            sensorApi.deviceUpdate(addObj).then(res => {
              if(res.status) {
                // if(!addObj.labels) { // 没有添加参数
                //   this.$message.success("编辑成功");
                //   return;
                // }
                this.getLabelId(addObj.id);
              } else {
                this.dataLoading = false;
              }
            }).catch(err => {
              this.dataLoading = false;
            })
          }
        }
      })
    },
    // 用deviceId请求详情， 拿到参数的id
    getLabelId(deviceId) {
      sensorApi.getDeviceDetail({id: deviceId}).then(res => {
        if(res.status) {
          let labels = res.data.allLabels;
          let labelsArr = [];
          labels.forEach(item => {
            labelsArr.push({
              id: item.id,
              label: item.label,
              deviceId: item.deviceId
            })
          })
          this.addLabels(labelsArr, deviceId);
        } else {
          this.dataLoading = false;
        }
      }).catch(err => {
        this.dataLoading = false;
      })
    },
    // 用参数id更新设备相关参数信息
    addLabels(labelsArr, deviceId) {
      if(labelsArr.length==0)
      return;
      let params;
      let lablesParams = [];
      for(let item of labelsArr) {
        for(let label of this.tableData) {
          if(item.label == label.label) {
            let labelObj = {
              condition: label.condition ? label.condition : "",
              id: item.id,
              value: label.value.toString() ? label.value.toString() : ""
            }
            lablesParams.push(labelObj);
          }
        }
      }
      params = {
        deviceId: deviceId,
        labels: lablesParams
      }
      sensorApi.deviceLabelUpdate(params).then(res => {
        if(res.status) {
          this.$message.success(this.type === 'isAdd' ? "添加成功" : "编辑成功");
          this.$router.push({
            path: '/sensor/maintain/detail',
            query: {
              id: this.type === 'isAdd' ? deviceId : this.id
            }
          });
          // if(this.type === 'isEdit') {
          //   this.getDetail();
          // }
        }
        this.dataLoading = false;
      }).catch(err=>{
        this.dataLoading = false;
      })
    },
    getDetail() {
      sensorApi.getDeviceDetail({id: this.id}).then(res => {
        if(res.status) {
          this.formData = res.data;
          this.tableData = res.data.yesLabels;
          let allLabels = res.data.allLabels;
          // 编辑时，只能选择allLabels中的已有的参数 
          if (allLabels.length > 0) {
            let usedLabels = [];
            for(let i=0;i<this.labelOptions.length;i++) {
              for(let j=0; j<allLabels.length; j++) {
                if(this.labelOptions[i].key === allLabels[j].label) {
                  usedLabels.push({key: this.labelOptions[i].key, name: this.labelOptions[i].name, disabled: false});
                }
              }
            }
            this.labelOptions = usedLabels;
          }
          for(let item of this.tableData) {
            this.$set(item, 'isEditing', false);
          }
        }
        this.dataLoading = false;
      }).catch(err => {})
    }
  },
  async mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    if(this.type === 'isEdit') {
       this.dataLoading = true;
       this.title = '编辑';
    }
    await getEnums(['com.ybveg.govx.enums.sensor.LabelConditionEnum']).then((data) => {
      this.conditionOptions = data.data;
      this.conditionOptions.forEach(({ key, name }) => this.conditionOptionObj[key] = name);
    });
    await getEnums(['com.ybveg.govx.enums.sensor.BusinessLabelTypeEnum']).then((data) => {
      this.labelOptions = data.data;
      this.labelOptions.forEach(({ key, name }) => this.labelOptionObj[key] = name);
    });
    await getEnums([ 'com.ybveg.govx.enums.sensor.FirmTypeEnum']).then((data) => {
      this.firmOptions = data.data;
    });
    await getEnums(['com.ybveg.govx.enums.SortYesNoEnum']).then((data) => {
      this.stateOptions = data.data;
    });
    if(this.type === 'isEdit') {
      this.getDetail();
    }
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
      .operate {
        color: #1787AD;
      }
      .item-box {
        display: inline-block;
        position: relative;
        width: 100%;
        margin: 0 calc((100% - 640px) / 2);
        .item {
          display: inline-block;
        }
        .tips {
          font-size: 12px;
          margin-left: 6px;
          color: #A2AAB6;
        }
      }
      .operate {
        margin-left: 6px;
        color: #1787AD;
      }
    }
  }
}

::v-deep .el-table table thead th.star div:before {
  content: '*';
  color: red;
}

</style>
