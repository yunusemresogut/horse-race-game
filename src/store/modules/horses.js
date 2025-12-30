import generateHorses from '@/utils/generateHorses'

const state = {
  horses: [],
  loading: false
}
const mutations = {
  SET_HORSES(state, horses) {
    state.horses = horses
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  generateHorses({ commit }) {
    return new Promise((resolve) => {
      commit('SET_LOADING', true)
      setTimeout(() => {
        commit('SET_HORSES', generateHorses())
        commit('SET_LOADING', false)
        resolve()
      }, 300)
    })
  }
}

const getters = {
  horses: (state) => state.horses,
  loading: (state) => state.loading,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

