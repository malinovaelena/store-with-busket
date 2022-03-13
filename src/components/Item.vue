<template>
  <div
    class="item"
    title="Добавить в корзину"
    :class="{ 'item--out-of-stock': value.leftover === 0 }"
  >
    <span class="item-title">{{ value.name }}({{ value.leftover }})</span>
    <span class="item-price">
      {{ (value.price * value.currency).toFixed(2) }} руб.
    </span>
  </div>
</template>
<script>
export default {
  name: "Item",
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style>
.item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  cursor: pointer;
  user-select: none;
  padding: 5px;
}
.item-title {
  flex-grow: 1;
}
.item-price {
  max-width: 100px;
  min-width: 100px;
  text-align: center;
  background-color: lightgray;
}

.item--out-of-stock {
  opacity: 0.8;
  cursor: default;
}
</style>
