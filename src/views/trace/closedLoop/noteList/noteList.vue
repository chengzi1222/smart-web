<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>短信发送记录</span>
    </div>
    <div class="dining mt20">
      <div>
        <h3>2</h3>
        <p>短信发送数量</p>
      </div>
      <div>
        <h3>1</h3>
        <p>发送成功</p>
      </div>
      <div>
        <h3>3</h3>
        <p>发送失败</p>
      </div>
    </div>
    <div class="mt20">
      <el-input placeholder="主体名称、姓名、手机号" class="w260 seekIpt" v-model="subName" @keyup.native="seekEnter">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="seekEnter"></i>
      </el-input>
      <el-select class="w130 ml20" v-model="subName" @change="seekEnter" placeholder="请选择">
        <el-option v-for="item in patternLis" :key="item.type" class="w140" :label="item.type" :value="item.key"></el-option>
      </el-select>
      <el-date-picker class="ml20" v-model="subName" type="date" @change="seekEnter" placeholder="选择日期" :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <el-table :data="dataPage" class="pointerTab mt20 text-center" @row-click="seekEnter">
      <el-table-column show-overflow-tooltip prop="orderCode" min-width="50" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dlrName" min-width="100" label="短信发送时间" sortable></el-table-column>
      <el-table-column show-overflow-tooltip prop="buyerName" min-width="100" label="主体名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" min-width="80"  label="姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" min-width="100" label="手机号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" min-width="150" label="短信内容"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" min-width="100" label="发送状态"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" label="操作">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer">重发短信</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subName: '',
      patternLis: [{
        type: '1',
        key: '1'
      }],
      dataPage: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  methods: {
    seekEnter() {

    }
  },
}
</script>

<style scoped lang="scss">
  .dining {
    border:1px solid #C2CAD2;
    display: flex;
    justify-content: space-between;
  }
  .dining div {
    width: 33.33%;
    text-align: center
  }
  .dining div h3{
    font-size:28px;
    color:rgba(59,59,59,1);
    margin-top: 14px;
  }
  .dining div p{
    font-size:14px;
    color:#A2AAB6;
    margin-bottom: 16px;
  }
</style>