<template>
  <div id="app">
    <Bar />
    <TodoList />
  </div>
</template>

<script>
import TodoList from "./components/TodoList.vue";
import Bar from "./components/Bar.vue";

export default {
  name: "App",
  components: {
    TodoList,
    Bar,
  },
  methods: {
    setProperty: function(name, value) {
      document.querySelector(":root").style.setProperty(name, value);
    },
  },
  mounted: function() {
    const appearances = this.$config.appearances;
    Object.keys(appearances).forEach((key) => {
      const name = "--" + key.replace(/\./g, "-");
      const value = appearances[key];
      this.setProperty(name, value);
    });
  },
};
</script>

<style>
:root {
  --main-background-color: 16, 16, 16;
  --main-background-alpha: 0.9;
  --modal-background-color: 32, 32, 32;
  --modal-backgound-alpha: 0.9;
  --main-foreground-color: 255, 255, 255;
  --main-foreground-alpha: 0.8;
  --quiet-foreground-color: 255, 255, 255;
  --quiet-foreground-alpha: 0.3;
  --highlighted-foreground-color: 255, 32, 32;
  --highlighted-foreground-alpha: 0.9;
  --theme-color: rgb(108, 192, 228);
  --bar-background-color: 32, 64, 80;
  --bar-background-alpha: 0.8;
  --bar-foreground-color: 255, 255, 255;
  --bar-foreground-alpha: 0.5;
}

html {
  background-color: rgba(
    var(--main-background-color),
    var(--main-background-alpha)
  );
}
::-webkit-scrollbar {
  width: 0.2em;
}
::-webkit-scrollbar-track {
  background: rgba(var(--main-background-color), var(--main-background-alpha));
  border: none;
  border-radius: 0.2em;
}
::-webkit-scrollbar-thumb {
  background: rgba(
    var(--quiet-foreground-color),
    var(--quiet-foreground-alpha)
  );
  border-radius: 0.2em;
  box-shadow: none;
}

body {
  margin: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>
