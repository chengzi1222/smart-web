<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>XX算法开启时间配置</span>
    </div>
    <ToggleForm title="学校配置">
      <el-form label-width="250px">
        <div class="content">
          <el-form-item label="非工作日（仅作用于学校）:" prop="name">
            <el-select class="selectHeight" v-model="obj.a">
              <el-option v-for="item in option" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="寒暑假（仅作用于学校）:" prop="name">
            <el-select class="selectHeight" v-model="obj.b">
              <el-option v-for="item in option" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </ToggleForm>
    <ToggleForm title="定时开关配置">
      <p class="mt20" style="font-size:14px;color:rgba(109,119,135,1);">提示：开关配置生效无法立刻生效，生效时间可能会延后几个小时!</p>
      <div class="mb20 mt20">
        <el-button class="w120" type="primary" @click="popShow=true">
          <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
        </el-button>
      </div>
      <el-table :data="data" class="table-div">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="90" prop="a" label="开启时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="关闭时间"></el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" class="operate-a">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </ToggleForm>
    <yb-popup @close="popShow=false" :isShow="popShow" title="添加定时开关时间端" width="400">
      <div slot="body">
        <el-form label-width="100px">
          <div class="content_">
            <el-form-item label="开启时间:" prop="name">
              <el-select class="selectHeight" v-model="obj.a">
                <el-option v-for="item in timeArr" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关闭时间:" prop="name">
              <el-select class="selectHeight" v-model="obj.b">
                <el-option v-for="item in timeArr" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="foot">
        <el-button  @click='popShow=false'>取消</el-button>
        <el-button type="primary" @click='popShow=false'>确定</el-button>
      </div>
    </yb-popup>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
 import YbPopup from 'components/ybpopup/YbPopup.vue'
 const time=['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',]
  export default {
    data() {
      return {
        timeArr:[
        ],
        popShow: false,
        data: [],
        obj: {
        },
        option: [{
            name: '关闭',
            key: false
          },
          {
            name: '开启',
            key: true
          }
        ]
      }
    },
    mounted() {
      time.map(item=>{
        this.timeArr.push({
          name:item,
          key:item
        })
      })
    },
    methods: {

    },
    components: {
      ToggleForm,YbPopup
    },
  }
</script>

<style scoped lang="scss">
  .content {
    width: 500px;
    margin: 30px auto 0;
  }

  .content_ {
     width: 260px;
    margin: 30px auto 0;
  }
</style>