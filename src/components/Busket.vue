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
            <div class="total-amount" :class="currentClass">{{ totalAmount }} / руб.</div>
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
        let currentClass = ref('');
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
        watch(totalAmount, (current, prev) => {
            currentClass.value = current > prev ? 'cost--expensive':'cost--chipper';
            console.log(currentClass.value);
        });

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
            updateAmount,
            currentClass
        }
    }
}
</script>
<style>
.cost--chipper {
    box-shadow:  0px 0px 13px 0px rgba(50, 142, 50, 0.75);
    transition: 1s;
}
.cost--expensive {
    box-shadow:  0px 0px 13px 0px rgba(232, 48, 50, 0.75);
    transition: 1s;
}
.busket {
    padding: 20px;
    width: 600px;
    background: #e9ecef;
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
.busket-table__header {
    font-size: 18px;
    background: #d1e7dd;
    padding: 10px;
}
.busket-table__row {
    padding: 0 10px;
    border: 1px solid #ced4da;
}
.busket-table__header,
.busket-table__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.total {
    display: flex;
    justify-content: flex-end;
}
</style>