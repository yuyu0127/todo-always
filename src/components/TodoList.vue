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
    addItem: function(title, deadline) {
      this.itemList.push({
        id: this.itemList.length + 1,
        title: title,
        deadline: deadline,
        isDone: false,
        isDeleted: false,
      });
    },
    saveJson: function() {
      const data = JSON.stringify(this.itemList);
      window.requires.fs.writeFile("todo.json", data, (err) => {
        if (err) {
          console.log(err);
        }
      });
    },
  },
  mounted: function() {
    this.axios.get("todo.json").then((response) => {
      this.itemList = response.data;
    });
  },
  data() {
    return {
      itemList: [],
    };
  },
  watch: {
    itemList: {
      handler: function() {
        this.saveJson();
      },
      deep: true,
    },
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
