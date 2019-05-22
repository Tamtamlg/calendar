<template>
  <div class="fc-event fc-event--customised">
    <div class="fc-event__inner" :class="{'colored': colored}" :id="id">
      <div class="fc-event__header">
        <div class="fc-event__date">{{date}}</div>
        <div>
          <span>{{u}}</span>/{{h}}
        </div>
      </div>
      <strong class="fc-event__title">{{eventTitle}}</strong>
      <div class="fc-event__hint">{{projectName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "task",
  props: {
    date: {
      type: String,
      required: true
    },
    id: {
      // type: String,
      required: true
    },
    u: {
      type: String,
      required: true
    },
    h: {
      type: String,
      required: true
    },
    eventTitle: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    colored: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
.fc-event.fc-event--customised {
  margin-bottom: 10px;
  background: #fff;
  color: #000;
  border: 0;
  box-shadow: 0 0 1px 1px #ddd;
  text-align: left;
  overflow: hidden;
  cursor: grab;
  &:hover {
    color: #000;
    text-decoration: none;
  }
  
}
.fc-event__inner,
.fc-mirror-container .fc-event__inner {
  padding: 7px 10px;
  &.colored {
    border-top: 3px solid red;
  }
}

.fc-event__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fc-event__date {
  padding: 0 3px;
  background: transparent;
  color: #000;
}
.colored {
  .fc-event__date {
    background: red;
    color: #fff;
  }
}

</style>
