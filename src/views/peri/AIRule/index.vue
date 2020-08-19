<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>AI算法规则配置</span>
    </div>
    <ToggleForm title="源本AI算法开启时间配置">
      <el-table :data="startTime" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="90" prop="a" label="算法模型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="非工作日（仅作用于学校）"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="120" label="寒暑假（仅作用于学校）"></el-table-column>
        <el-table-column show-overflow-tooltip prop="typeStr" min-width="100" label="定时开启时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="100" label="定时关闭时间"></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a" @click="$router.push({name: 'AIRule.setting'});">配置</a>
          </template>
        </el-table-column>
      </el-table>
    </ToggleForm>
    <ToggleForm title="源本AI算法检测频次配置">
      <el-table :data="frequencyCheck" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="90" prop="a" label="算法模型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="检测频次">
          <template slot-scope="scope">
            <el-select class="selectHeight" v-model="scope.row.b">
              <el-option v-for="item in frequencyCheckOption" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a">配置</a>
            <a href="javascript:;" class="operate-a">取消</a>
            <a href="javascript:;" class="operate-a">保存</a>
          </template>
        </el-table-column>
      </el-table>
    </ToggleForm>
    <ToggleForm title="源本AI算法预警去重配置">
      <el-table :data="filtration" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="90" prop="a" label="算法模型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="去重规则"></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a">配置</a>
            <a href="javascript:;" class="operate-a">取消</a>
            <a href="javascript:;" class="operate-a">保存</a>
          </template>
        </el-table-column>
      </el-table>
    </ToggleForm>
    <ToggleForm title="源本AI算法预警原始信息保存时间配置">
      <el-table :data="saveTime" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="90" prop="a" label="算法模型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="保存时间"></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a">配置</a>
            <a href="javascript:;" class="operate-a">取消</a>
            <a href="javascript:;" class="operate-a">保存</a>
          </template>
        </el-table-column>
      </el-table>
    </ToggleForm>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  export default {
    data() {
      return {
        startTime: [{
          a: '所有预测'
        }, {
          a: '有老鼠'
        }],
        frequencyCheck: [{
          a: '所有预测'
        }],
        filtration: [{
          a: '所有预测'
        }],
        saveTime: [{
          a: '所有预测'
        }],
        frequencyCheckOption:[{
          name:'1/300',
          key:'88'
        }]
      }
    },
    mounted() {},
    methods: {

    },
    components: {
      ToggleForm
    },
  }
</script>

<style scoped lang="scss">
  .table-div {
    margin-top: 20px;
  }
</style>