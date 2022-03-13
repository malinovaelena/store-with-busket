<template>
  <div class="items">
    <div class="items-group" v-for="group in allData" :key="group.id">
      <slot v-if="group.items.length">
        <div class="items-group__name" @click="closed = !closed">
          {{ group.nameGroup }}
        </div>
        <div class="items-group__items" :class="{ hidden: closed }">
          <Item
            v-for="item in group.items"
            :value="item"
            :key="item.title"
            @click="addToBusket(item)"
          />
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import Item from "./Item.vue";
import { useActions } from "vuex-composition-helpers/dist";
import { useStore } from "vuex";

export default {
  name: "Items",
  components: {
    Item,
  },
  setup() {
    const store = useStore();
    const { addToBusket } = useActions(["addToBusket"]);
    const closed = ref(false);
    const allData = computed(() => store.getters.allDataState);

    return {
      allData,
      Item,
      closed,
      addToBusket,
    };
  },
};
</script>
<style>
.items {
  width: 600px;
  border: 3px solid rgb(218, 212, 212);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}
.items-group {
  margin: 10px;
}

.items-group__name {
  background: lightyellow;
  border: 1px solid grey;
  border-radius: 3px;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.hiden {
  display: none;
}
</style>
