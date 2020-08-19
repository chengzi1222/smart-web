<template>
  <div v-if="accountLevel == 3" class="wrap">
  <!-- <div class="wrap"> -->
    <div class="page-tilt">
      <b></b>
      <span>预警短信模块配置</span>
    </div>
    <toggle-form title="监管部门预警模块配置">
      <div style="margin: 20px;">
        <el-table :data="tableDataSupervise" class="table-div mt20" v-loading="isPageLoading">
          <el-table-column type="index" min-width="120" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="预警类型" prop="ewTypeStr"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="短信预警状态" prop="ewStatus">
            <template slot-scope="scope">
              <div v-if="!scope.row.isChanging">{{scope.row.ewStatusStr}}</div>
              <el-select v-else v-model="scope.row.ewStatus" class="w180" placeholder="请选择短信预警状态">
                <el-option v-for="(ewStatus,index) in ewStatusOptions" :key="index" :label="ewStatus.name" :value="ewStatus.key"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="短信预警模式" prop="ewModel">
            <template slot-scope="scope">
              <div v-if="scope.row.ewType === '020205'">
                <div>实时预警</div>
              </div>
              <div v-if="scope.row.ewType === '0202'">
                <div v-if="!scope.row.isChanging">{{scope.row.ewModelStr}}</div>
                <el-select v-else v-model="scope.row.ewModel" class="w180" placeholder="请选择短信预警模式">
                  <el-option v-for="(ewModel, index) in ewModelOptions" :key="index" :label="ewModel.name" :value="ewModel.key"></el-option>
                </el-select>
              </div>
              <div v-if="scope.row.ewType !== '020205' && scope.row.ewType !== '0202'">
                <div v-if="!scope.row.isChanging">{{scope.row.ewModelStr}}</div>
                <el-select v-else v-model="scope.row.ewModel" class="w180" placeholder="请选择短信预警模式">
                  <el-option v-for="(ewModel, index) in ewModelOptionsWithoutRealTime" :key="index" :label="ewModel.name" :value="ewModel.key"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <a v-if="scope.row.isChanging" href="javascript:;" @click="cancle(scope.row)" class="operate-a">取消</a>
              <a v-if="scope.row.isChanging" href="javascript:;" @click="save(scope.row, 'SUPERVISION')" class="operate-a">保存</a>
              <a v-if="!scope.row.isChanging" href="javascript:;" @click="dispose(scope.row)" class="operate-a">配置</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </toggle-form>
    <toggle-form title="食品主体预警模块配置" style="margin-bottom: 100px !important;">
      <div style="margin: 20px;">
        <el-table :data="tableDataSubject" class="table-div mt20" v-loading="isPageLoading">
          <el-table-column type="index" min-width="120" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="预警类型" prop="ewTypeStr"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="短信预警状态" prop="ewStatus">
            <template slot-scope="scope">
              <div v-if="!scope.row.isChanging">{{scope.row.ewStatusStr}}</div>
              <el-select v-else v-model="scope.row.ewStatus" class="w180" placeholder="请选择短信预警状态">
                <el-option v-for="(ewStatus,index) in ewStatusOptions" :key="index" :label="ewStatus.name" :value="ewStatus.key"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="短信预警模式" prop="ewModel">
            <template slot-scope="scope">
              <div v-if="scope.row.ewType === '020205'">
                <div>实时预警</div>
              </div>
              <div v-if="scope.row.ewType === '0202'">
                <div v-if="!scope.row.isChanging">{{scope.row.ewModelStr}}</div>
                <el-select v-else v-model="scope.row.ewModel" class="w180" placeholder="请选择短信预警模式">
                  <el-option v-for="(ewModel, index) in ewModelOptions" :key="index" :label="ewModel.name" :value="ewModel.key"></el-option>
                </el-select>
              </div>
              <div v-if="scope.row.ewType !== '020205' && scope.row.ewType !== '0202'">
                <div v-if="!scope.row.isChanging">{{scope.row.ewModelStr}}</div>
                <el-select v-else v-model="scope.row.ewModel" class="w180" placeholder="请选择短信预警模式">
                  <el-option v-for="(ewModel, index) in ewModelOptionsWithoutRealTime" :key="index" :label="ewModel.name" :value="ewModel.key"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <a v-if="scope.row.isChanging" href="javascript:;" @click="cancle(scope.row)" class="operate-a">取消</a>
              <a v-if="scope.row.isChanging" href="javascript:;" @click="save(scope.row, 'ENTITY')" class="operate-a">保存</a>
              <a v-if="!scope.row.isChanging" href="javascript:;" @click="dispose(scope.row)" :disabled="isDisposing && isLoading" class="operate-a" :class="isDisposing && isLoading ? 'disable' : ''">配置</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </toggle-form>
  </div>
</template>

<script>
import ToggleForm from 'components/ToggleForm'
import * as msgWarnApi from 'api/xcws/messageWarning'
import {getEnums} from 'api/common'
import qs from 'qs'
export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      isDisposing: false,
      isLoading: false,
      isPageLoading: false,
      ewTypeOptions: [],
      tableDataSupervise: [],
      tableDataSubject: [],
      ewStatusOptions: [],
      ewModelOptions: [],
      // AI摄像头和鼠患预警没有实时预警选项
      ewModelOptionsWithoutRealTime: [],
      accountLevel: null
    }
  },
  methods: {
    dispose(row) {
      if(this.isDisposing && !this.isLoading) {
        this.$message.warning('请先保存上一次的配置')
        return
      }
      this.isDisposing = true
      row.isChanging = true
    },
    save(row, type) {
      this.isDisposing = false
      // row.isChanging = false
      if(row.ewType == "020205") { // 鼠患预警只有实时
        row.ewModel = "EVERY"
      }
      if(!row.id) { // 添加
        let addParams = {
          ewType: row.ewType,
          ewStatus: row.ewStatus,
          ewModel: row.ewModel,
          applyType: type
        }
        msgWarnApi.addModule(qs.stringify(addParams)).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success('保存成功')
            this.getTableList()
          } else {
            this.$$message.warning(res.message)
          }
        }).catch(err => {})
      } else { // 更新
        let updateParams = {
          id: row.id,
          ewStatus: row.ewStatus,
          ewModel: row.ewModel
        }
        msgWarnApi.updateModule(qs.stringify(updateParams)).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success('保存成功')
            this.getTableList()
          } else {
            this.$$message.warning(res.message)
          }
        }).catch(err => {})
      }
    },
    cancle(row) {
      row.isChanging = false
      this.getTableList();
    },
    getTableList() {
      this.isLoading = true
      this.isPageLoading = true
      msgWarnApi.getModuleList().then(res => {
        if(res.status) {
          this.isDisposing = false
          let subjectData = res.data.ENTITY
          let superviseData = res.data.SUPERVISION
          let subjectEwTypeData = []
          let superviseEwTypeData = []
          this.ewTypeOptions.forEach(item => {
            subjectEwTypeData.push({ewType: item.key, ewTypeStr: item.name, ewStatus: "OFF", ewStatusStr: "关闭", ewModel: "MONTH",ewModelStr:"统计月报"})
            superviseEwTypeData.push({ewType: item.key, ewTypeStr: item.name, ewStatus: "OFF", ewStatusStr: "关闭", ewModel: "MONTH",ewModelStr:"统计月报"})
          })
          for(let i=0; i<this.ewTypeOptions.length; i++) {

            for(let j=0; j<subjectData.length; j++) {
              if(subjectEwTypeData[i].ewType === subjectData[j].ewType) {
                subjectEwTypeData[i] = Object.assign({}, subjectEwTypeData[i], subjectData[j])
              }
            }
            subjectEwTypeData[i].isChanging = false

            for(let k=0; k<superviseData.length; k++) {
              if(superviseEwTypeData[i].ewType === superviseData[k].ewType) {
                superviseEwTypeData[i] = Object.assign({}, superviseEwTypeData[i], superviseData[k])
              }
            }
            superviseEwTypeData[i].isChanging = false
          }
          this.tableDataSubject = subjectEwTypeData
          this.tableDataSupervise = superviseEwTypeData
          this.isLoading = false
        }
        this.isPageLoading = false
      }).catch(err => {})
    }
  },

  mounted() {
    this.accountLevel = this.$store.getters.mapCenter.level
    getEnums(['com.ybveg.govx.ewcenter.enums.NoteEWTypeEnum'],false).then((r) => {
      this.ewTypeOptions = r.data
    });
    getEnums(['com.ybveg.govx.ewcenter.enums.NoteEWStatusEnum'],false).then((r) => {
      this.ewStatusOptions = r.data
    });
    getEnums(['com.ybveg.govx.ewcenter.enums.NoteEWModelEnum'],false).then((r) => {
      this.ewModelOptions = r.data
      this.ewModelOptionsWithoutRealTime = r.data.slice(0, r.data.length-1)
    });
    this.getTableList()
  },
  watch: {
    '$store.getters.mapCenter.level'() {
      if (this.$store.getters.mapCenter.level) {
        this.accountLevel = this.$store.getters.mapCenter.level
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .operate-a {
    color: #1787ad;
  }
  .disable {
    pointer-events: none;
    color: #C0C4CC;
  }
</style>