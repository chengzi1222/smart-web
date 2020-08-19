<template>
  <div>
    <food-dashboard v-if="label== 'FOOD'"></food-dashboard>
    <system-dashboard v-if="label== 'SYSTEM'"></system-dashboard>
    <medi-dashboard v-if="label == 'MEDICINE'"></medi-dashboard>
    <news-dashboard v-if="label == 'NEWS'"></news-dashboard>
    <big-data-dashboard v-if="label == 'BIG_DATA'"></big-data-dashboard>
    <cosmetics-index  v-if="label == 'COSMETIC'"></cosmetics-index>
    <maai-dashboard v-if="label == 'MEDICAL_EQUIPMENT'"></maai-dashboard>
    <tzsb v-if="label == 'SPECIAL_EQUIPMENT'"></tzsb>
  </div>
</template>

<script>

import * as storage from "utils/sessionStorage";

import FoodDashboard from './food';
import SystemDashboard from './system';
import MediDashboard from './medi'
import NewsDashboard from './news'
import BigDataDashboard from './bigdatamap/home'
import CosmeticsIndex from './cosmetics'
import importVue from '../cfda/import/import.vue';
import MaaiDashboard from './maai'
import Tzsb from './tzsb'
export default {
  mounted() {
    this.label = storage.getCookie('system');
  },
  data() {
    return {
      label: ""
    }
  },
  components: {
    FoodDashboard,
    SystemDashboard,
    MediDashboard,
    NewsDashboard,
    BigDataDashboard,
    CosmeticsIndex,
    MaaiDashboard,
    Tzsb
  }
}
</script>

