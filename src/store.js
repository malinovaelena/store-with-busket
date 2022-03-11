import { createStore } from "vuex";

import names from './../data/names.json';
const data = await import('./../data/data.json');
const namesItems = names;

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

// const allData = Object.entries(namesItems).map((nameItem) => {
//     const filteredItems = items.filter(itm => itm.G == nameItem[0]);
//     const formattedItems = filteredItems.map((i) => {
//         return {
//             price: i.C,
//             groupName: nameItem[1].G,
//             groupId: i.G,
//             id: i.T ,
//             name: nameItem[1].B[i.T].N,
//             leftover: i.P,
//             currency: rateCurrency
//         }
//     })

//     return {
//         nameGroup: nameItem[1].G,
//         items: formattedItems
//     }
// });

const formattingData = (items, names, currentExchangeRate) => {
    const allData = Object.entries(names).map((nameItem) => {
        const filteredItems = items.filter(itm => itm.G == nameItem[0]);
        const formattedItems = filteredItems.map((i) => {
            return {
                price: i.C,
                groupName: nameItem[1].G,
                groupId: i.G,
                id: i.T ,
                name: nameItem[1].B[i.T].N,
                leftover: i.P,
                currency: currentExchangeRate
            }
        })
    
        return {
            nameGroup: nameItem[1].G,
            items: formattedItems
        }
    });

    return allData;
}

const allData = {
    t: formattingData(data.Value.Goods, namesItems, random(20, 80))
};

const queries = setInterval(() => {
    const items = data.Value.Goods;
    const currencyRate = random(20, 80);
    allData.t = formattingData(items, namesItems, currencyRate);
}, 1000);


const store = createStore({
    state: {
        count: 0,
        busketItems: [],
        storeItems: allData.t
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
            
        }
    },
    actions: {
        changeBusket(context, payload) {
            const payloadRR = {
                payload: payload,
                amount: -1
            };
            context.commit("CHANGE_BUSKET", payload);
            context.commit("CHANGE_STORE", payloadRR);
        },
        removeBusketItems(context, payload) {
            const a = payload.amount;
            const payloadR = {
                payload: payload,
                amount: payload.amount
            }
            context.commit("CHANGE_STORE", payloadR);
            context.commit("REMOVE_BUSKET_ITEMS", payload);
        }
    },
    getters: {
        doubleCount(state, getters) {
            return state.count * 2;
        },
        doubleCountPlusOne(state, getters) {
            return getters.doubleCount + 1;
        },
        allDataState(state) {
            return state.storeItems;
        },
        busketDataState(state) {
            return state.busketItems;
        }
    },
});

export default store;
