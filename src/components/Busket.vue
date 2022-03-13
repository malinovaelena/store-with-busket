<template>
    <div class="busket">
        <div class="busket-table">
            <div class="busket-table__header">
                <div class="col name">Наименование товара и описание</div>
                <div class="col amout">Количество</div>
                <div class="col price">Цена</div>
                <div class="col"></div>
            </div>
            <div class="busket-table__body">
                <div class="busket-table__row" v-for="item in dataBusket" :key="item.id">
                    <div class="col name">{{item.name}}</div>
                    <div class="col amout">
                        <label>
                            <input v-model="item.amount" @input="formatted($event, item.id)" @change="updateAmount($event, item.id)"/>
                            шт.
                        </label>
                    </div>
                    <div class="col price">{{ (item.price * item.currency).toFixed(2) }} руб/ шт.</div>
                    <div class="col">
                        <button @click="removeBusketItems(item)">Удалить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="total">
            <div class="total-amount">{{ totalAmount }} / руб.</div>
        </div>
    </div>
</template>
<script>
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { ref, computed, watch } from "vue";
import { useStore } from 'vuex';


export default {
    name: "Busket",
    setup() {
        const store = useStore();
        const totalAmount = ref(0);
        const { removeBusketItems } = useActions(["removeBusketItems"]);
        const { changeBusket } = useActions(["changeBusket"]);
        
        const dataBusket = computed(() => store.getters.busketDataState);

        const { busketDataState } = useGetters({
            busketDataState: 'busketDataState'
        })

        watch(dataBusket, (current, old) => {
            totalAmount.value = 0;
                dataBusket.value.forEach(item => {
                    totalAmount.value += ((item.price * item.currency).toFixed(2) * item.amount);
                });
            },
            {deep: true}
        );

        const formatted = (event, id) => {
            const item = dataBusket.value.find(i => i.id === id);
            if (event.target.value.match(/\D/gm)) {
                item.amount = parseInt(event.target.value.replace(/\D/gm, ''));
            }
            if (parseInt(event.target.value) > item.leftover) item.amount = item.leftover;
        };

        const updateAmount = (event, id) => {
            const value = dataBusket.value.find(i => i.id == id);
            changeBusket({payload: value, amount: parseInt(event.target.value) });
        };
        
        return {
            dataBusket,
            totalAmount,
            busketDataState,
            removeBusketItems,
            formatted,
            updateAmount
        }
    }
}
</script>
<style>
.busket {
    width: 600px;
    background: lightblue;
}
.busket-table__row {
    margin: 10px 0;
}
.col {
    width: 25%;
}
.col.name {
    width: 50%;
}
.col.amout,
.col.price {
    width: 20%;
}
.amout label,
.amout label input {
    max-width: 50px;
}
.busket-table__header,
.busket-table__row {
    display: flex;
    justify-content: space-between;
}
.total {
    display: flex;
    justify-content: flex-end;
}
</style>