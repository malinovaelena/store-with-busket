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
                <div class="busket-table__row" v-for="item in dataBusket">
                    <div class="col name">{{item.name}}</div>
                    <div class="col amout">
                        <label>
                            <input :value="item.amount" />
                            шт.
                        </label>
                    </div>
                    <div class="col price">{{item.price}} / шт.</div>
                    <div class="col">
                        <button @click="removeBusketItems(item)">Удалить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="total">
            <div class="total-amount">{{totalAmount}} / руб.</div>
        </div>
    </div>
</template>
<script>
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { ref, computed, watch, watchEffect } from "vue";
import { useStore } from 'vuex';


export default {
    name: "Busket",
    setup() {
        const store = useStore();
        const totalAmount = ref(0);
        const { removeBusketItems } = useActions(["removeBusketItems"]);
        
        const dataBusket = computed(() => store.getters.busketDataState);

        const { busketDataState } = useGetters({
            busketDataState: 'busketDataState'
        })

        watch(dataBusket, (current, old) => {
                dataBusket.value.forEach(item => {
                    totalAmount.value += (item.amount * item.price)
                });
            },
            {deep: true}
        );
        
        return {
            dataBusket,
            totalAmount,
            busketDataState,
            removeBusketItems
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