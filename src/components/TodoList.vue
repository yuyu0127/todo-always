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
    <button class="add-button" @click="addItem"></button>
    <ModalWindow
      v-show="showModal"
      :item="copiedItem"
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
      copiedItem: {},
    };
  },
  components: {
    TodoItem,
    ModalWindow,
  },
  computed: {
    sortedItemList: function() {
      return [...this.itemList].sort((a) => -new Date(a.deadline));
    },
  },
  methods: {
    deleteItem: function(item) {
      this.itemList.find((x) => x == item).isDeleted = true;
    },
    editItem: function(item) {
      this.activeItem = item;
      this.copiedItem = Object.assign({}, item);
      this.showModal = true;
    },
    confirmEdit: function() {
      this.activeItem.title = this.copiedItem.title;
      this.activeItem.deadline = this.copiedItem.deadline;
      this.showModal = false;
    },
    cancelEdit: function() {
      this.showModal = false;
    },
    addItem: function() {
      const newItem = {
        id: this.itemList.length + 1,
        title: "新しいタスク",
        deadline: "",
        isDone: false,
        isDeleted: false,
      };
      this.itemList.push(newItem);
      this.editItem(newItem);
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
  box-sizing: border-box;
  height: 100%;
}
.todo-list {
  height: calc(100% - 16px);
}
.add-button {
  width: 100%;
  height: 20px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  cursor: pointer;
  background: none;
  border: none;
  position: relative;
}
.add-button:focus {
  outline: none;
}
.add-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  height: 1px;
  background: var(--theme-color);
  opacity: 0.3;
  transition: all 300ms;
}

.add-button:hover::after {
  left: 12px;
  right: 12px;
}
</style>
