<template>
  <el-select :disabled="disable" class="selectHeight" v-model="currentValue" :name="name" :multiple="multiple" :clearable="clearable" :collapse-tags="collapseTags" :placeholder="placeholder"  @change="change" @blur="blur" @focus="focus">
    <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key">
    </el-option>
  </el-select>
</template>

<script>

import * as common from 'api/common';

export default {
  props: {
    name: String,
    multiple: Boolean,
    filterKey: Array, //过滤字段
    retainKey: Array,//保留字段
    disable: {
      type:Boolean,
      default:false
    },
    enum: {
      required: true,
      type: String,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {
      required: true,
    },
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      options: [],
      currentValue: this.value
    }
  },
  methods: {
    init(){
      
      if (this.enum) {
        const enmus = this.enum.split(',');
        common.getEnums(enmus).then((r) => {
          if (r.status) {
            let data = [];
            if(this.filterKey && this.filterKey.length > 0){
              if(this.filterKey.indexOf(this.currentValue) != -1){
                this.currentValue = null;
              }
              for(let i = 0; i < r.data.length; i++){
                if (this.filterKey.indexOf(r.data[i].key) == -1){
                  data.push(r.data[i]);
                }
              }

              if (data.length == 0){//如果没有数据，通知父组件
                this.$emit("noData");
              }
              this.options = data;
            }else if(this.retainKey && this.retainKey.length > 0){
              for(let i = 0; i < r.data.length; i++){
                if (this.retainKey.indexOf(r.data[i].key) > -1){
                  data.push(r.data[i]);
                }
              }
              this.options = data || [];
            }else{
              this.options = r.data || [];
            }

          }
        })
      }
    },
    change(value) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('change', value);
      let name = "";
      this.options.forEach(item => {
        if(item.key == value){
          name = item.name;
        }
      });
      this.$emit('getName', name);
    },
    focus(event) {
      this.$emit('focus', event);
    },
    blur(event) {
      this.$emit('blur', event);
    },
  },
  watch:{
    options() {
      this.$emit("source-change",this.options);
    },
    value(){
      this.currentValue = this.value;
    },
    enum(){
      this.init();
    },
    filterKey(){
      this.init();
    }
  }
};
</script>

<style scoped lang="sass">
.selectHeight .el-form-item__content {
  line-height: 0px;
}
</style>
