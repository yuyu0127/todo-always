<template>
  <div class="bar">
    <div class="buttons">
      <button @click="closeWindow" class="close">
        <font-awesome-icon icon="times" />
      </button>
      <button @click="minimizeWindow" class="minimize">
        <div class="underline"></div>
      </button>
      <button
        @click="toggleAlwaysOnTop"
        class="pin"
        :class="{ disabled: !isAlwaysOnTop }"
      >
        <font-awesome-icon icon="thumbtack" />
      </button>
      <button @click="authenticate" class="cloud">
        <font-awesome-icon icon="cloud" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bar",
  data() {
    return {
      isAlwaysOnTop: false,
    };
  },
  methods: {
    closeWindow() {
      window.electron.closeWindow();
    },
    minimizeWindow() {
      window.electron.minimizeWindow();
    },
    toggleAlwaysOnTop() {
      window.electron.toggleAlwaysOnTop().then((result) => {
        this.isAlwaysOnTop = result;
      });
    },
    authenticate() {
      window.electron
        .authenticate()
        .then((result) => {
          console.log("認証成功");
          console.log(result);
        })
        .catch(() => {
          console.log("認証エラー");
        });
    },
  },
};
</script>

<style scoped>
.bar {
  background-color: rgba(
    var(--bar-background-color),
    var(--bar-background-alpha)
  );
  height: 16px;
  width: 100%;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  z-index: 10;
}

.buttons {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
  opacity: 1;
}

.pin {
  opacity: 1;
  transition: all 100ms;
}
.pin.disabled {
  opacity: 0.33;
}

button {
  -webkit-app-region: no-drag;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 12px;
  width: 14px;
  height: 100%;
  margin: 0 3px;
  padding: 0;
  color: rgba(var(--bar-foreground-color), var(--bar-foreground-alpha));
}
button:focus {
  outline: none;
}

.underline {
  width: 12px;
  margin-left: 2px;
  margin-top: 5px;
  border-bottom: 2px solid
    rgba(var(--bar-foreground-color), var(--bar-foreground-alpha));
}
</style>
