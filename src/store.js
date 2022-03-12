import { createStore } from "vuex";

const store = createStore({
    state: {
        count: 0,
        busketItems: [],
        storeItems: []
    },
    mutations: {
        CHANGE_BUSKET(state, payload) {
            const item = state.busketItems.findIndex((i) => i.id === payload.id);
            if (item > -1) {
                state.busketItems[item].amount += 1;
            } else {
                state.busketItems.push({
                    ...payload,
                    amount:  1
                })
            }
        },
        REMOVE_BUSKET_ITEMS(state, payload) {
            const ind = state.busketItems.findIndex((i) => i.id === payload.id);
            state.busketItems.splice(ind, 1);
        },
        CHANGE_STORE(state, { payload, amount }) {
            const ind = state.storeItems.findIndex((i) => i.nameGroup === payload.groupName);
            const indItem = state.storeItems[ind].items.findIndex((i) => i.id === payload.id);
            
            if (amount > 0) {
                state.storeItems[ind].items[indItem].leftover += amount;
            } else {
                if (payload.leftover > 0) state.storeItems[ind].items[indItem].leftover -= 1;
            }
            
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
            const payloadRR = {
                payload: payload,
                amount: amount
            };
            context.commit("CHANGE_BUSKET", payload);
            context.commit("CHANGE_STORE", payloadRR);
        },
        removeBusketItems(context, payload) {
            const payloadR = {
                payload: payload,
                amount: payload.amount
            }
            context.commit("CHANGE_STORE", payloadR);
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
