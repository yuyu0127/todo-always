<template>
  <div
    class="item"
    :class="[
      { done: item.isDone },
      { deleted: item.isDeleted },
      { passed: remainingTime < 0 },
      {
        hidden:
          (item.isDeleted && hideDeletedTask) || (item.isDone && hideDoneTask),
      },
    ]"
  >
    <input type="checkbox" :id="item.id" v-model="item.isDone" />
    <label class="content" :for="item.id">
      <div class="title">
        {{ item.title ? item.title : localize.taskNameNotSet }}
      </div>
      <div class="timeinfo">
        <div class="deadline">{{ deadlineStr }}</div>
        <div class="remain">{{ remainingTimeStr }}</div>
      </div>
      <button class="edit" @click="$emit('editItem', item)">
        <font-awesome-icon :icon="['far', 'edit']" />
      </button>
      <button
        class="delete"
        @click="$emit('deleteItem', item)"
        v-show="!item.isDeleted"
      >
        <font-awesome-icon :icon="['far', 'trash-alt']" />
      </button>
      <button
        class="restore"
        @click="$emit('restoreItem', item)"
        v-show="item.isDeleted"
      >
        <font-awesome-icon icon="trash-restore-alt" />
      </button>
    </label>
  </div>
</template>

<script>
import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

export default {
  name: "TodoItem",
  props: {
    item: Object,
  },
  data() {
    return {
      remainingTime: Date.now(),
      setIntervalId: null,
      hideDoneTask: this.$config.hideDoneTask,
      hideDeletedTask: this.$config.hideDeletedTask,
      localize: this.$config.localize,
    };
  },
  computed: {
    deadlineStr() {
      if (!this.item.deadline) {
        return this.localize.deadlineNotSet;
      }
      return dayjs(this.item.deadline).format(this.localize.dateFormat);
    },

    remainingTimeStr() {
      if (isNaN(this.remainingTime)) {
        return "";
      }
      const isPassed = this.remainingTime < 0;
      const sec = Math.abs(this.remainingTime) / 1000;
      const min = sec / 60;
      const hour = min / 60;
      const day = hour / 24;
      const secMod = sec % 60;
      const minMod = min % 60;
      const hourMod = hour % 24;
      let timeStr = "";
      if (day > 1) {
        timeStr += `${Math.floor(day)}${this.localize.day}`;
        timeStr += `${Math.floor(hourMod)}${this.localize.hour}`;
      } else if (hour > 1) {
        timeStr += `${Math.floor(hourMod)}${this.localize.hour}`;
        timeStr += `${Math.floor(minMod)}${this.localize.min}`;
      } else if (min > 1) {
        timeStr += `${Math.floor(minMod)}${this.localize.min}`;
        timeStr += `${Math.floor(secMod)}${this.localize.sec}`;
      } else {
        timeStr += `${Math.floor(secMod)}${this.localize.sec}`;
      }
      if (isPassed) {
        return this.localize.overFormat.replace("%s", timeStr);
      } else {
        return this.localize.remainingFormat.replace("%s", timeStr);
      }
    },
  },
  mothods: {},
  mounted() {
    let self = this;
    this.setIntervalId = setInterval(function() {
      const rt = dayjs(self.item.deadline).diff(dayjs());
      self.remainingTime = rt;
    }, 100);
  },
  destroyed() {
    clearInterval(this.setIntervalId);
  },
};
</script>

<style scoped>
.item {
  height: 3em;
  margin-bottom: 0.5em;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.2s;
}
.item:last-child {
  margin-bottom: 0;
}
.item.done {
  height: 1.5em;
}
.item.hidden {
  height: 0;
  margin-bottom: 0;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 20px;
  font: 14px/20px "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", Meiryo, sans-serif;
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
  border: 1px solid rgba(var(--theme-color), var(--theme-alpha));
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
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
  transform: rotate(45deg);
}

label {
  color: rgba(var(--main-foreground-color), var(--main-foreground-alpha));
  transition: all 0.3s;
}
.passed label {
  color: rgba(
    var(--highlighted-foreground-color),
    var(--highlighted-foreground-alpha)
  );
}
.done label {
  color: rgba(var(--quiet-foreground-color), var(--quiet-foreground-alpha));
}
.deleted label {
  color: rgba(var(--quiet-foreground-color), var(--quiet-foreground-alpha));
}

.title {
  font-size: 1.3em;
  display: inline-block;
  width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.title::after {
  position: absolute;
  left: 30px;
  top: 10px;
  width: 0;
  height: 1px;
  background-color: rgba(
    var(--quiet-foreground-color),
    var(--quiet-foreground-alpha)
  );
  content: "";
  transition: all 0.3s;
}
.done .title::after {
  width: calc(100% - 30px - 60px);
}

.deadline {
  display: inline-block;
  width: 105px;
}
.remain {
  display: inline-block;
  width: auto;
}

button {
  border: none;
  background: none;
  color: rgba(var(--theme-color), var(--theme-alpha));
}
.edit {
  right: 25px;
}
.delete,
.restore {
  right: 5px;
}
button {
  position: absolute;
  cursor: pointer;
  height: 3em;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s;
  opacity: 0;
  pointer-events: none;
}
label:hover button {
  opacity: 1;
  pointer-events: auto;
}
.done button {
  top: 10px;
}
button:focus {
  outline: none;
}
</style>
