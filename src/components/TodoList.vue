<template>
  <div class="todo-list">
    <TodoItem v-for="item in itemList" v-bind:key="item.id" :item="item" />
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";

export default {
  name: "TodoList",
  components: {
    TodoItem,
  },
  data() {
    return {
      itemList: [
        {
          id: 1,
          title: "Task1",
          deadline: "2021-03-05T12:23:34",
          isDone: true,
        },
        {
          id: 2,
          title: "Task2",
          deadline: "2021-03-06T12:23:34",
          isDone: false,
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
  padding: 1em;
}
</style>
