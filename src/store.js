import { createStore } from "vuex";

const store = createStore({
    state: {
        count: 0,
        busketItems: [],
        storeItems: []
    },
    mutations: {
        CHANGE_BUSKET(state, {payload, amount}) {
            const itemIndex = state.busketItems.findIndex((i) => i.id === payload.id);
            state.busketItems[itemIndex].amount = amount;
        },
        ADD_TO_BUSKET(state, payload) {
            if (payload.leftover < 1) return;
            const itemIndex = state.busketItems.findIndex((i) => i.id === payload.id);
            if (itemIndex > -1) {
                state.busketItems[itemIndex].amount += 1;
            } else {
                state.busketItems.push({
                    ...payload,
                    amount: 1
                })
            }
            const ind = state.storeItems.findIndex((i) => i.nameGroup === payload.groupName);
            const indItem = state.storeItems[ind].items.findIndex((i) => i.id === payload.id);
            if (payload.leftover > 0) state.storeItems[ind].items[indItem].leftover -= 1;
        },
        REMOVE_BUSKET_ITEMS(state, payload) {
            const ind = state.busketItems.findIndex((i) => i.id === payload.id);
            state.busketItems.splice(ind, 1);
        },
        CHANGE_STORE(state, { payload, amount }) {
            const ind = state.storeItems.findIndex((i) => i.nameGroup === payload.groupName);
            const indItem = state.storeItems[ind].items.findIndex((i) => i.id === payload.id);
            const leftover = state.storeItems[ind].items[indItem].totalAmount - amount;
            if (amount > 0 && leftover > -1) {
                state.storeItems[ind].items[indItem].leftover = leftover;
            } else state.storeItems[ind].items[indItem].leftover = state.storeItems[ind].items[indItem].totalAmount;
        },
        UPDATE_STORE(state, payload) {
            if (state.storeItems.length) {
                state.storeItems.forEach((group) => {
                    group.items.forEach((item) => {
                        const groupInd = payload.findIndex((k) => k.nameGroup === item.groupName);
                        if (groupInd > -1) {
                            const itemInd = payload[groupInd].items.findIndex((t) => t.id === item.id);
                            item.currency = payload[groupInd].items[itemInd].currency;
                        }
                    });
                })
            } else {
                state.storeItems = payload;
            }
        }
    },
    actions: {
        setNewItems(context, payload) {
            context.commit("UPDATE_STORE", payload);
        },
        changeBusket(context, {payload, amount}) {
            context.commit("CHANGE_BUSKET", {payload: payload, amount: amount});
            context.commit("CHANGE_STORE", {payload: payload, amount: amount});
        },
        addToBusket(context, payload) {
            context.commit("ADD_TO_BUSKET", payload);
        },
        removeBusketItems(context, payload) {
            context.commit("CHANGE_STORE", {payload: payload, amount: 0});
            context.commit("REMOVE_BUSKET_ITEMS", payload);
        }
    },
    getters: {
        allDataState(state) {
            return state.storeItems;
        },
        busketDataState(state) {
            return state.busketItems;
        }
    },
});

export default store;
