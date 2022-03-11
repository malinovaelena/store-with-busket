<script>
import Items from "@/components/Items.vue";
import Busket from "@/components/Busket.vue";

import names from './../data/names.json';
const data = await import('./../data/data.json');
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

export default {
  components: {
    Items,
    Busket
  },
  setup() {

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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
