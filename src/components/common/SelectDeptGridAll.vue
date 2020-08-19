<template>
  <el-cascader :placeholder="placeholder" :disabled="disabled" :clearable="clearable" :change-on-select="changeOnSelect" :expand-trigger="expandTrigger" :show-all-levels="showAllLevels" :options="options" v-model="currentValue" @change="change" @blur="blur" :props="props">
  </el-cascader>
</template>

<script>

import * as common from 'api/common';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    changeOnSelect: {
      type: Boolean,
      default: true,
    },
    expandTrigger: {
      type: String,
      default: 'click',
    },
    showAllLevels: Boolean,
  },
  mounted() {
    common.findDeptGridNotStreetAll().then((data) => {
      this.options = data.data || [];
    })
  },
  data() {
    return {
      props: {
        label: 'deptName',
        value: 'areaCode',
        children: 'children',
      },
      options: [],
      currentValue: this.value || [],
    };
  },
  methods: {
    change(value) {
      this.currentValue = value;
      this.$emit('input', value);
      this.$emit('change', value);
    },
    blur(event){
      this.$emit('blur', event);
    }
  },
};
</script>

