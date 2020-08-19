const layout = {
  state: {
    tableHeight: 0,
    tableWidth:0,
    // loading:false
  },
  mutations: {
    SET_CLIENT_HEIGHT:(state, tableHeight) => state.tableHeight = tableHeight,
    SET_CLIENT_WIDTH:(state, tableWidth) => state.tableWidth = tableWidth,
    // SET_CLIENT_LOADING:(state, loading) => state.loading = loading,
  },
  actions: {
    setClientHeight: ({ commit }, tableHeight) => {
      commit("SET_CLIENT_HEIGHT", tableHeight);
    },
    setClientWidth: ({ commit }, tableWidth) => {
      commit("SET_CLIENT_WIDTH", tableWidth);
    },
    // setLoading: ({ commit }, loading) => {
    //   commit("SET_CLIENT_LOADING", loading);
    // },
  }
}

export default layout;
