<template>
  <div class="transferPop_user" >
      <YbPopup :title='title+"成员"' :isShow="true" :ischoose="false">
          <div slot="body" class="PopBody mt20">
              <el-transfer filterable v-model="value1" :data="data" :titles='transfer_title'></el-transfer>
          </div>
          <div slot="foot" class="mt20">
            <el-button type="default" @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </div>
      </YbPopup>
  </div>
</template>
<script>
import * as api from "api/admin/userSystem";
import YbPopup from "components/ybpopup/YbPopup";
export default {
  props: {
    popIsShow: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    type: {
      type: String, 
      default: function() {
        return null;
      }
    },
     id: {
      type: String, 
      default: function() {
        return '';
      }
    }
  },
  watch: {

  },
  mounted() {
      this.getData(this.type);
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    getData(t) {
        api.getData_transfer(t,this.id).then(r => {
           if (!r.status) {
          this.$message.error(r.message);
          return;
        }
        this.data = r.data.data;
        this.value1 =r.data.model;
        });
    },
    submit(){
      api.userUpdate(this.type,this.id,this.value1).then(r => {
           if (!r.status) {
          this.$message.error(r.message);
          return;
        }
        this.$message.success("添加成功");
        this.$emit('success',this.type)
        });

    }
  },
  components: {
    YbPopup
  },
  data() {
   
    return {
      data: [],
      value1: [],
      transfer_title: ["人员名单", "已添加人员"],
      title: "添加"
    };
  }
};
</script>
<style scoped lang='scss'>
.transferPop_user {
  //   width: 100%;
  //   height: 100%;
  .PopBody {
    width: 630px;
    margin: 0 auto;
  }
}
</style>
<style lang="sass">
.transferPop_user .el-transfer-panel__list.is-filterable {
  height: 284px;
}
.transferPop_user .el-transfer-panel__body {
  height: 338px;
}
.transferPop_user .el-transfer-panel{
  width: 260px;
}
.transferPop_user .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
  font-size: 14px;
}
</style>

