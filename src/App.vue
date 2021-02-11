<template>
  <div id="app">
    <div class="bar"></div>
    <TodoList />
  </div>
</template>

<script>
import TodoList from "./components/TodoList.vue";

export default {
  name: "App",
  components: {
    TodoList,
  },
};
</script>

<style>
html {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.8);
  height: 100%;
  backdrop-filter: blur(3px);
}

body {
  margin: 0;
  height: 100%;
}

.bar {
  background-color: rgba(32, 64, 80, 0.7);
  height: 1em;
  width: 100%;
  -webkit-app-region: drag;
}
</style>
