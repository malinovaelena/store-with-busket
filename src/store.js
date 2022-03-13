import { createStore } from "vuex";

const store = createStore({
  state: {
    count: 0,
    busketItems: [],
    storeItems: [],
  },
  mutations: {
    //   Change busket - in args - final amount for item in busket
    CHANGE_BUSKET(state, { payload, amount }) {
        const itemIndex = state.busketItems.findIndex((i) => i.id === payload.id);
        state.busketItems[itemIndex].amount = amount;
    },
    // Added 1 item only to busket 
    ADD_TO_BUSKET(state, payload) {
        if (payload.leftover < 1) return;
        const itemIndex = state.busketItems.findIndex((i) => i.id === payload.id);
        if (itemIndex > -1) {
            state.busketItems[itemIndex].amount += 1;
        } else {
            state.busketItems.push({
            ...payload,
            amount: 1,
            });
        }
        const ind = state.storeItems.findIndex(
            (i) => i.nameGroup === payload.groupName
        );
        const indItem = state.storeItems[ind].items.findIndex(
            (i) => i.id === payload.id
        );
        state.storeItems[ind].items[indItem].leftover -= 1;
    },
    REMOVE_BUSKET_ITEMS(state, payload) {
      const ind = state.busketItems.findIndex((i) => i.id === payload.id);
      state.busketItems.splice(ind, 1);
    },
    // Change store - in args - final amount for item in store
    CHANGE_STORE(state, { payload, amount }) {
      const indGroup = state.storeItems.findIndex(
        (i) => i.nameGroup === payload.groupName
      );
      const indItem = state.storeItems[indGroup].items.findIndex(
        (i) => i.id === payload.id
      );
      const leftover =
        state.storeItems[indGroup].items[indItem].totalAmount - amount;
      if (amount > 0 && leftover > -1) {
        state.storeItems[indGroup].items[indItem].leftover = leftover;
      } else
        state.storeItems[indGroup].items[indItem].leftover =
          state.storeItems[indGroup].items[indItem].totalAmount;
    },
    // Update busket if our currency value change
    UPDATE_BUSKET(state, payload) {
      if (state.busketItems.length) {
        state.busketItems.forEach((item) => {
          const groupInd = payload.findIndex(
            (group) => group.nameGroup === item.groupName
          );
          const itemInd = payload[groupInd].items.findIndex(
            (t) => t.id === item.id
          );
          item.currency = payload[groupInd].items[itemInd].currency;
        });
      }
    },
    // Update currency in every item of store
    UPDATE_STORE(state, payload) {
      if (state.storeItems.length) {
        state.storeItems.forEach((group) => {
          group.items.forEach((item) => {
            const groupInd = payload.findIndex(
              (k) => k.nameGroup === item.groupName
            );
            if (groupInd > -1) {
              const itemInd = payload[groupInd].items.findIndex(
                (t) => t.id === item.id
              );
              item.currency = payload[groupInd].items[itemInd].currency;
            }
          });
        });
      } else {
        state.storeItems = payload;
      }
    },
  },
  actions: {
    setNewItems(context, payload) {
      context.commit("UPDATE_STORE", payload);
      context.commit("UPDATE_BUSKET", payload);
    },
    changeBusket(context, { payload, amount }) {
      context.commit("CHANGE_BUSKET", { payload: payload, amount: amount });
      context.commit("CHANGE_STORE", { payload: payload, amount: amount });
    },
    addToBusket(context, payload) {
      context.commit("ADD_TO_BUSKET", payload);
    },
    removeBusketItems(context, payload) {
      context.commit("CHANGE_STORE", { payload: payload, amount: 0 });
      context.commit("REMOVE_BUSKET_ITEMS", payload);
    },
  },
  getters: {
    allDataState(state) {
      return state.storeItems;
    },
    busketDataState(state) {
      return state.busketItems;
    },
  },
});

export default store;
