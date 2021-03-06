import Vue from "vue";
import Vuex from "vuex";
import fb from "@/firebaseConfig.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    address: {},
    arrivalDescription: "",
    phoneNumberInput: "",
    paymentSolution: "",
    items: [],
    requests: []
  },
  getters: {
    currentUser: state => state.currentUser,
    name: state => (state.currentUser ? state.currentUser.displayName : null),
    email: state => (state.currentUser ? state.currentUser.email : null),
    phoneNumber: state =>
      state.currentUser ? state.currentUser.phoneNumber : null,
    id: state => (state.currentUser ? state.currentUser.uid : null),
    address: state => state.address,
    phoneNumberInput: state => state.phoneNumberInput,
    arrivalDescription: state => state.arrivalDescription,
    paymentSolution: state => state.paymentSolution,
    items: state => state.items,
    requests: state => state.requests
  },
  mutations: {
    SET_CURRENT_USER(state, val) {
      state.currentUser = val;
    },
    SET_ADDRESS(state, payload) {
      state.address = payload;
    },
    SET_PHONE_NUMBER_INPUT(state, payload) {
      state.phoneNumberInput = payload;
    },
    SET_ARRIVAL_DESCRIPTION(state, payload) {
      state.arrivalDescription = payload;
    },
    SET_ITEMS(state, payload) {
      state.items = payload;
    },
    SET_REQUESTS(state, payload) {
      state.requests = payload;
    },
    SET_PAYMENT_SOLUTION(state, payload) {
      state.paymentSolution = payload;
    }
  },
  actions: {
    SET_CURRENT_USER: (context, payload) => {
      context.commit("SET_CURRENT_USER", payload);
    },
    SET_ADDRESS: (context, payload) => {
      context.commit("SET_ADDRESS", payload);
    },
    SET_PHONE_NUMBER_INPUT: (context, payload) => {
      context.commit("SET_PHONE_NUMBER_INPUT", payload);
    },
    SET_ARRIVAL_DESCRIPTION: (context, payload) => {
      context.commit("SET_ARRIVAL_DESCRIPTION", payload);
    },
    SET_ITEMS: (context, payload) => {
      context.commit("SET_ITEMS", payload);
    },
    SET_REQUESTS: (context, payload) => {
      context.commit("SET_REQUESTS", payload);
    },
    SET_PAYMENT_SOLUTION: (context, payload) => {
      context.commit("SET_PAYMENT_SOLUTION", payload);
    }
  }
});
//
fb.auth.onAuthStateChanged(user => {
  if (user) {
    fb.additionalUserInfoCollection
      .doc(user.uid)
      .get()
      .then(userInfo => {
        console.log(userInfo.data());
        store.commit("SET_CURRENT_USER", { ...user, ...userInfo.data() });
      })
      .catch(() =>
        console.log("noe gikk galt da vi skulle hente brukerinfoen din")
      );
    fb.db
      .collectionGroup("requests")
      .orderBy("createdOn", "desc")
      .onSnapshot(querySnapshot => {
        const requests = querySnapshot.docs.map(request => ({
          ...request.data(),
          id: request.id
        }));
        store.commit("SET_REQUESTS", requests);
      });
  }
});

export default store;
