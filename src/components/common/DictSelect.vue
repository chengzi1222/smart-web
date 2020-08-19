<template>
  <el-select v-model="currentValue" :name="name" :multiple="multiple" :clearable="clearable" :collapse-tags="collapseTags" :placeholder="placeholder" @change="change" @blur="blur" @focus="focus">
    <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
    </el-option>
  </el-select>
</template>

<script>

import * as common from 'api/common';

export default {
  props: {
    name: String,
    multiple: Boolean,
    dict: {
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
    if (this.dict) {
      common.getDicts([this.dict]).then((data) => {
        if (data.status) {
          this.options = data.data[0].list || [];
        }
      })
    }
  },
  data() {
    return {
      options: [],
      currentValue: this.value
    }
  },
  methods: {
    change(value) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('change', value);
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
    value(val){
      this.currentValue = val
    }
  }
};
</script>

