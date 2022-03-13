<script>
import { useActions } from "vuex-composition-helpers/dist";
import { useStore } from 'vuex';
import Items from "@/components/Items.vue";
import Busket from "@/components/Busket.vue";

import names from './../data/names.json';

const namesItems = names;

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

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
                currency: currentExchangeRate,
				totalAmount: i.P
            }
        })
    
        return {
            nameGroup: nameItem[1].G,
            items: formattedItems
        }
    });

    return allData;
}

export default {
	components: {
		Items,
		Busket
	},
	setup() {
		const store = useStore();
		const { setNewItems } = useActions(['setNewItems']);

		const setData = () => {
			const data = import('./../data/data.json').then((res) => {
				const items = res.Value.Goods;
				const currencyRate = random(20, 80);
				const allData = formattingData(items, namesItems, currencyRate);
				setNewItems(allData);
			});
		};
		setData();

		const queries = setInterval(() => {
			setData();
		}, 3000);
	}
}

</script>

<template>
	<div class="wrapper">
		<Items />
		<Busket />
	</div>
</template>

<style>
.wrapper {
	font-family: 'Roboto', sans-serif;
	font-family: 'Roboto Slab', serif;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
