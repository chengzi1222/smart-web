<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>总体配置</span>
    </div>
    <toggle-form title="页面总体结构">
      <div class="structureBox">
        <div class="structure" :class="deployType == '3x5'? 'on':''" @click="changeDeploy('3x5')">
          <div class="imgBox" :class="deploy ? 'movePoin':''">
            <img style="margin-top: 54px;" src="../../../../assets/img/subjectData/3＊5.png" alt="">
          </div>
          <p :class="deploy ? 'movePoin':''">3*5结构</p>
        </div>
        <div class="structure" :class="deployType == '4x4'? 'on':''" @click="changeDeploy('4x4')">
          <div class="imgBox" :class="deploy ? 'movePoin':''">
            <img style="margin-top: 19px;" src="../../../../assets/img/subjectData/4＊4.png" alt="">
          </div>
          <p :class="deploy ? 'movePoin':''">4*4结构</p>
        </div>
      </div>
    </toggle-form>
    <toggle-form title="业务板块配置">
      <el-table :data="tableData" class="mt20 table-div">
        <el-table-column min-width="200" label="模块名称" prop="name"></el-table-column>
        <el-table-column min-width="200" label="显示名称">
          <template slot-scope="scope">
            <span v-if="!deploy">{{scope.row.showName}}</span>
            <el-input v-else class="w250" placeholder="请输入显示名称，不超过5个字" :maxlength="5" v-model="scope.row.showName"></el-input>
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="是否显示">
          <template slot-scope="scope">
            <span v-if="!deploy">{{scope.row.isShow}}</span>
            <el-select v-else class="w200" v-model="scope.row.isShow">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="显示顺序">
          <template slot-scope="scope">
            <span v-if="!deploy">{{scope.row.order}}</span>
            <el-input v-else class="w250" placeholder="请输入显示顺序，必须是正整数" :maxlength="5" v-model="scope.row.order"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </toggle-form>
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button v-if="deploy" @click="cancel">取消</el-button>
        <el-button v-if="deploy" type="primary" @click="preserve">保存</el-button>
        <el-button v-if="!deploy" type="primary" @click="deployShow">配置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";

  export default {
    data() {
      return {
        deployType: '3x5',
        deployTypeOr: '',
        deploy: false,
        tableData: [{
          name: "食品",
          showName: "名字",
          isShow: '是',
          order: 1
        }],
        tableDataOr: []
      }
    },
    methods: {
      deployShow(){
        //点击配置保留当前数据
        this.deployTypeOr = this.deployType;
        this.tableDataOr = this.tableData;
        this.deploy = true;
      },
      changeDeploy( type) {
        //切换选择结构
        if (!this.deploy) {
          return
        }
        this.deployType = type;
      },
      cancel(){
        //点击取消回复之前数据
        this.deployType = this.deployTypeOr;
        this.tableData = this.tableDataOr;
        this.deploy = false;
      },
      preserve(){
        this.$confirm('是否确认保存配置？', '', {
          confirmButtonText: '保存',
          cancelButtonText: '取消'
        }).then(() => {
          console.log(0)
        })
      }
    },
    components: {
      ToggleForm
    }
  }
</script>

<style scoped lang="scss">
  .structureBox {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    .structure {
      width: 49%;
      .imgBox {
        height: 292px;
        background: #F2F5F8;
        border: 1px solid #fff;
        text-align: center;
      }
      p {
        text-align: center;
        margin-top: 20px;
        color: #393939;
      }
    }
    .on {
      .imgBox{
        background: #fff;
        border: 1px solid #0DB5EF;
      }
      p{
        color: #0DB5EF;
      }
    }
  }
  .table-div {
    width: 100%;
    text-align: center;
    margin-bottom: 60px;
  }
</style>
<style lang="sass">
  .el-message-box__headerbtn{
    z-index: 99;
  }
</style>