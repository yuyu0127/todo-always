<template>
  <div class="overlay">
    <div class="content">
      <input
        v-model="item.title"
        ref="title"
        type="text"
        placeholder="タスクを入力しよう！"
        @focus="textFocused = true"
        @blur="textFocused = false"
      />
      <div class="input-underline" :class="{ focused: textFocused }"></div>
      <input
        v-model="item.deadline"
        type="datetime-local"
        @focus="datetimeFocused = true"
        @blur="datetimeFocused = false"
      />
      <div class="input-underline" :class="{ focused: datetimeFocused }"></div>
      <div class="button-wrapper">
        <button @click="confirmEdit">
          <font-awesome-icon icon="check" />
        </button>
        <button @click="cancelEdit">
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow",
  props: {
    item: Object,
    confirmEdit: Function,
    cancelEdit: Function,
  },
  data: function() {
    return {
      textFocused: false,
      datetimeFocused: false,
    };
  },
  watch: {
    item: function() {
      this.$refs.title.focus();
    },
  },
  computed: {},
  mothods: {},
  mounted: function() {},
};
</script>

<style scoped>
.overlay {
  z-index: 1;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  z-index: 2;
  width: 100%;
  min-width: 210px;
  margin: 5em;
  padding: 1em;
  background: rgba(32, 32, 32, 1);
}

input {
  font: inherit;
  width: 100%;
  background: none;
  border: none;
  color: var(--main-color);
}

input:focus {
  outline: none;
}

.input-underline {
  position: relative;
  margin-bottom: 1em;
  height: 1px;
  background: var(--gray-color);
}

.input-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 0%;
  background: var(--gray-color);
  transition: all 300ms;
}

.input-underline.focused::after {
  content: "";
  width: 100%;
  background: var(--theme-color);
}

.button-wrapper {
  display: flex;
  justify-content: space-evenly;
}

button {
  width: 50px;
  color: var(--theme-color);
  background: none;
  border: none;
  font-size: 1em;
}
button:focus {
  outline: none;
}
</style>
