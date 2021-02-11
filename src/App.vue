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
  --app-bg-color: rgba(0, 0, 0, 0.8);
  --incompleted-color: rgba(255, 255, 255, 0.8);
  --completed-color: rgba(255, 255, 255, 0.3);
  --passed-color: rgba(255, 32, 32, 0.9);
  --theme-color: rgba(108, 192, 229, 0.8);
}

html {
  background-color: var(--app-bg-color);
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
}

.bar {
  background-color: rgba(32, 64, 80, 0.8);
  height: 1em;
  width: 100%;
  -webkit-app-region: drag;
}
</style>
