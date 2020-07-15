const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
};

const actions = {
  register({ commit }, payload) {
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    commit('register', payload);
  },
  login({ commit }, payload) {
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    commit('login', payload);
  },
  logout({ commit }) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    commit('logout');
  },
};

const mutations = {
  register(state, payload) {
    state.user = payload.user;
    state.token = payload.token;
  },
  login(state, payload) {
    state.user = payload.user;
    state.token = payload.token;
  },
  logout() {
    state.user = null;
    state.token = null;
  },
};

const getters = {
  user: (state) => {
    return state.user;
  },
  token: (state) => {
    return state.token;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
