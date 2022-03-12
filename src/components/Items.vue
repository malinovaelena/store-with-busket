<template>
    <div class="items">
        <div class="items-group" v-for="group in allData" :key="group.nameGroup">
            <div class="items-group__name" @click="closed = !closed">
                {{ group.nameGroup }}
            </div>
            <div class="items-group__items" :class="{'hidden': closed}">
                <Item v-for="item in group.items" :value="item" :key="item.title" @click="changeBusket({payload: item, amount: -1})" />
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed } from "vue";
import Item from './Item.vue';
import { useActions } from "vuex-composition-helpers/dist";
import { useStore } from 'vuex';

export default {
    name: "Items",
    components: {
        Item,
    },
    setup() {
        const store = useStore();
        const { changeBusket } = useActions(["changeBusket"]);
        const closed = ref(false);
        const allData = computed(() => store.getters.allDataState);

        return {
            allData,
            Item,
            closed,
            changeBusket
        }
    }
}
</script>
<style>
.items {
    width: 600px;
    border: 1px solid grey;
    display: flex;
    flex-direction: column;
}
.items-group {
    border: 1px solid grey;
    margin: 10px;
}

.items-group__name {
    background: lightyellow;
    border: 1px solid grey;
    font-size: 20px;
    cursor: pointer;
}

.hiden {
    display: none;
}
</style>