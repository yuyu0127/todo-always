<template>
  <div class="todo-list">
    <div class="todo-items">
      <transition-group name="item">
        <TodoItem
          v-on:deleteItem="deleteItem"
          v-on:restoreItem="restoreItem"
          v-on:editItem="editItem"
          v-on:confirmEdit="confirmEdit"
          v-on:cancelEdit="cancelEdit"
          v-for="item in sortedItemList"
          v-bind:key="item.id"
          :item="item"
        />
      </transition-group>
    </div>
    <button class="add-button" @click="addItem"></button>
    <transition name="modal">
      <ModalWindow
        v-show="showModal"
        :item="copiedItem"
        :confirmEdit="confirmEdit"
        :cancelEdit="cancelEdit"
      />
    </transition>
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
    sortedItemList() {
      let list = [...this.itemList];
      list = list.sort((a) => a.id);
      if (this.$config.sortByDeadline) {
        list = list.sort((a) => (isNaN(new Date(a.deadline)) ? 1 : -1));
        list = list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      }
      if (this.$config.sortByStatus) {
        list = list.sort((a, b) => {
          if (a.isDone == b.isDone) {
            return 0;
          } else if (a.isDone && !b.isDone) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      return list;
    },
  },
  methods: {
    deleteItem: function(item) {
      this.itemList.find((x) => x == item).isDeleted = true;
    },
    restoreItem: function(item) {
      this.itemList.find((x) => x == item).isDeleted = false;
    },
    editItem: function(item) {
      this.activeItem = item;
      this.copiedItem = Object.assign({}, item);
      this.showModal = true;
    },
    confirmEdit() {
      this.activeItem.title = this.copiedItem.title;
      this.activeItem.deadline = this.copiedItem.deadline;
      this.showModal = false;
    },
    cancelEdit() {
      this.showModal = false;
    },
    addItem() {
      const newItem = {
        id: this.itemList.length + 1,
        title: "",
        deadline: "",
        isDone: false,
        isDeleted: false,
      };
      this.itemList.push(newItem);
      this.editItem(newItem);
    },
    saveJson() {
      const data = JSON.stringify(this.itemList);
      window.electron.fs.writeFile("todo.json", data, (err) => {
        if (err) {
          console.log(err);
        }
      });
    },
  },
  mounted() {
    window.electron.fs.readFile(
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
      handler() {
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
  margin-top: 16px;
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
  background: rgba(var(--theme-color), var(--theme-alpha));
  opacity: 0.3;
  transition: all 300ms;
}

.add-button:hover::after {
  left: 12px;
  right: 12px;
}

.item-enter-active,
.item-leave-active {
  transition: all 600ms;
}
.item-move {
  transition: all 300ms;
}
.item-enter,
.item-leave-to {
  height: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 200ms ease-in-out;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
