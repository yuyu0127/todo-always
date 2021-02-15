<template>
  <div class="todo-list">
    <div class="todo-items">
      <TodoItem
        v-on:deleteItem="deleteItem"
        v-on:editItem="editItem"
        v-on:confirmEdit="confirmEdit"
        v-on:cancelEdit="cancelEdit"
        v-for="item in sortedItemList"
        v-bind:key="item.id"
        :item="item"
      />
    </div>
    <ModalWindow
      v-show="showModal"
      :item="activeItem"
      :confirmEdit="confirmEdit"
      :cancelEdit="cancelEdit"
    />
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";
import ModalWindow from "./ModalWindow.vue";

export default {
  name: "TodoList",
  data() {
    return {
      itemList: [],
      showModal: false,
      activeItem: {},
    };
  },
  components: {
    TodoItem,
    ModalWindow,
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
    editItem: function(item) {
      this.activeItem = item;
      this.showModal = true;
    },
    confirmEdit: function() {
      console.log("confirm");
      this.showModal = false;
    },
    cancelEdit: function() {
      console.log("cancel");
      this.showModal = false;
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
    window.requires.fs.readFile(
      "todo.json",
      { encoding: "utf8" },
      (err, data) => {
        if (err) {
          console.log(err);
          this.saveJson();
        } else {
          this.itemList = JSON.parse(data);
        }
      }
    );
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
.todo-items {
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 1em 0 0 1em;
}
</style>
