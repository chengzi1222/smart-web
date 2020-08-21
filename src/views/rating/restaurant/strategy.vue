<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>日常检查策略</span>
    </div>
    <el-tabs v-model="activeName" class="mb20 mt20" @tab-click="tabChange">
      <el-tab-pane label="餐饮主体" name="repast"></el-tab-pane>
      <el-tab-pane label="三小(小餐饮店)" name="sx"></el-tab-pane>
    </el-tabs>
    <toggle-form title="检查频次配置">
      <el-table
        v-loading="loading"
        element-loading-text="数据正在努力加载中"
        :border="true"
        :resizable="true"
        :data="check[activeName].children"
        class="table-div"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="riskLevelStr" min-width="190" label="风险等级"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" label="风险等级范围">
          <template slot-scope="scope">
            <span v-if="!isEdit">{{scope.row.begin}}-{{scope.row.end}}</span>
            <div v-if="isEdit">
              <el-input class="w55" placeholder="请输入" v-model="scope.row.begin"></el-input>-
              <el-input class="w55" placeholder="请输入" v-model="scope.row.end"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" label="检查频次(次/年)">
          <template slot-scope="scope">
            <span v-if="!isEdit">{{scope.row.times}}</span>
            <el-select v-model="scope.row.times" placeholder="请选择" v-if="isEdit">
              <el-option v-for="item in 6" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </toggle-form>
    <toggle-form title="生效时间配置">
      <div class="content">
        <el-form
          :model="check[activeName].date"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm content"
        >
          <el-form-item label="生效日期：">
            <el-date-picker
              class="w200"
              v-model="check[activeName].effectiveDate"
              type="date"
              placeholder="选择生效日期"
              :picker-options="pickerOptions" 
              value-format="yyyy-MM-dd"  
              v-if="isEdit"
            ></el-date-picker> 
            <span v-if="!isEdit">{{check[activeName].effectiveDate}}</span>
          </el-form-item>
        </el-form>
      </div>
    </toggle-form>

    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="getDetail()" style="width:120px;" v-if="isEdit">取消</el-button>
        <el-button type="primary" @click="saveData" v-if="isEdit">保存</el-button>
        <el-button type="primary" @click="isEdit = true" v-if="!isEdit">编辑</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ToggleForm from "components/ToggleForm.vue";
import * as api from '../../../api/rating/restaurantRating2'
export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      check: {
        repast: {},
        sx: {}
      },
      activeName: 'repast',
      loading: false,
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      today: '',
      isEdit: false
    }
  },
  methods: {
    getNextYear(time) {
      var date = new Date(time);
      var y = date.getFullYear() + 2;
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ('1' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      let next = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      return new Date(next).getTime()
    },
    getNowDay() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let today = y + '-' + m + '-' + d + ' 00:00:00'
      this.today = today
    },
    disabledDate(time) {
      let _minTime = new Date(this.today).setTime(new Date(this.today).getTime()+24*60*60*1000)
      let _maxTime = this.getNextYear(this.today)
      if (_minTime && _maxTime) {
        return time.getTime() < _minTime || time.getTime() > _maxTime
      }
    },
    async getDetail() {
      this.isEdit = false
      this.loading = true
      let result = await api.getFoodDjpdDetail()
      result.data.children.map(item => {
        item.entityType == 'RESTAURANT' ? this.check.repast = item : this.check.sx = item
      })
      this.loading = false
    },
    tabChange() {
      this.isEdit ? this.getDetail() : ''
    },
    async saveData() {
      let data = {}
      let postData = {
        configs: []
      }
      this.activeName == 'repast' ? data = this.check.repast : data=this.check.sx
      if(!this.checkScore(data.children)){return}
      postData.effectiveDate = data.effectiveDate
      postData.id = data.id
      data.children.forEach(item => {
        let result = {
          begin: item.begin,
          end: item.end,
          id: item.id,
          times: item.times
        }
        postData.configs.push(result)
      })
      let result = await api.getFoodDjpdUpdate(postData)
      if (result.status) {
        this.$message({
          type: 'success',
          message: `操作成功`
        });
        this.getDetail()
      }
    },
    checkScore(data){
      let newData = {}
      data.forEach(item =>{
        newData[item.riskLevel] = {begin:Number(item.begin),end:Number(item.end)}
      })
      if(newData['A'].begin != 1 || newData['D'].end != 100){
        this.$message.error('风险等级范围为1-100');
        return false
      }
      if(newData['A'].end + 1 != newData['B'].begin || newData['B'].end + 1 != newData['C'].begin||newData['C'].end + 1 != newData['D'].begin){
        this.$message.error('风险等级范围不允许重合或空余');
        return false 
      }
      return true
    }
  },
  mounted() {
    this.getNowDay()
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.bigbox {
  width: 100%;
  position: relative;
}
.table-div {
  margin: 20px 0;
  text-align: center;
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
}
.mT0 {
  margin: 0;
}
.content {
  margin: 20px auto 0px;
  width: 750px;
}
.w55 {
  width: 55px;
}
</style>
