import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import createVuexAlong from 'vuex-along'

import common from './modules/common';
import layout from './modules/layout';


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    common,
    layout
  },
  getters,
  plugins: [createVuexAlong()]
});

export default store;
