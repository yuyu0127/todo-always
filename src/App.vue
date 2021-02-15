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
:root {
  --app-bg-color: rgba(16, 16, 16, 0.9);
  --main-color: rgba(255, 255, 255, 0.8);
  --gray-color: rgba(255, 255, 255, 0.3);
  --danger-font-color: rgba(255, 32, 32, 0.9);
  --theme-color: rgba(108, 192, 229, 0.9);
}

html {
  background-color: var(--app-bg-color);
}

body {
  margin: 0;
  height: 100%;
}

#app {
  height: 100%;
}

.bar {
  background-color: rgba(32, 64, 80, 0.8);
  height: 16px;
  width: 100%;
  -webkit-app-region: drag;
}
</style>
