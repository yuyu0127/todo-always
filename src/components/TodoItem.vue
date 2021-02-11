<template>
  <div class="item">
    <input type="checkbox" :id="item.id" v-model="item.isDone" />
    <label :for="item.id">
      <span class="title">{{ item.title }}</span>
      <span class="deadline">{{ item.deadline }}</span>
      <span class="remain">{{ remainingTimeStr }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "TodoItem",
  props: {
    item: Object,
  },
  data: function() {
    return {
      remainingTime: Date.now(),
    };
  },
  computed: {
    remainingTimeStr: function() {
      return "あと" + this.remainingTime.toString();
    },
  },
  mothods: {},
  mounted: function() {
    let self = this;
    setInterval(function() {
      const rt = new Date(self.item.deadline) - Date.now();
      self.remainingTime = rt;
    }, 1000);
  },
};
</script>

<style scoped>
.item {
  height: 2em;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 20px;
  font: 14px/20px "Open Sans", Arial, sans-serif;
  color: #ddd;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

input[type="checkbox"] + label:last-child {
  margin-bottom: 0;
}

input[type="checkbox"] + label:before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  border: 1px solid #6cc0e5;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.6;
  transition: all 0.2s, border-color 0.08s;
}

input[type="checkbox"]:checked + label:before {
  width: 10px;
  top: -5px;
  left: 5px;
  border-radius: 0;
  opacity: 1;
  border-top-color: transparent;
  border-left-color: transparent;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

input[type="checkbox"]:checked + label {
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

input[type="checkbox"] + label::after {
  position: absolute;
  left: 30px;
  right: calc(100% - 30px);
  top: 50%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  content: "";
  transition: all 0.3s;
}
input[type="checkbox"]:checked + label::after {
  right: 0;
}

.title {
  display: inline-block;
  width: 100px;
}
.deadline {
  display: inline-block;
  width: 150px;
}
.remain {
  display: inline-block;
  width: auto;
}
</style>
