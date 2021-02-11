<template>
  <div class="todo-list">
    <TodoItem
      v-on:deleteItem="deleteItem"
      v-for="item in sortedItemList"
      v-bind:key="item.id"
      :item="item"
    />
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";

export default {
  name: "TodoList",
  components: {
    TodoItem,
  },
  computed: {
    sortedItemList: function() {
      return [...this.itemList].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
    },
  },
  methods: {
    deleteItem: function(item) {
      this.itemList.find((x) => x == item).isDeleted = true;
    },
  },
  data() {
    return {
      itemList: [
        {
          id: 1,
          title: "Task1",
          deadline: "2021-02-11T12:23:34",
          isDone: true,
          isDeleted: false,
        },
        {
          id: 2,
          title: "Task2",
          deadline: "2021-03-06T12:23:34",
          isDone: false,
          isDeleted: false,
        },
        {
          id: 3,
          title: "Task3",
          deadline: "2021-02-12T12:23:34",
          isDone: true,
          isDeleted: false,
        },
        {
          id: 4,
          title: "Task4",
          deadline: "2021-02-11T19:46:34",
          isDone: false,
          isDeleted: false,
        },
      ],
    };
  },
};
</script>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 1em 0 0 1em;
}
</style>
