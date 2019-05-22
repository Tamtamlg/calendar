<template>
  <div class="calendar">
    <div class="calendar__events" ref="calendar">
      <p>
        <strong>All tasks</strong>
      </p>

      <Task
        v-for="task in tasks"
        :key="task.id"
        :date="task.date"
        :eventTitle="task.eventTitle"
        :projectName="task.projectName"
        :u="task.u"
        :h="task.h"
        :colored="task.colored"
        :id="task.id"
      />
    </div>

    <div class="calendar__table">
      <FullCalendar
        class="demo-app-calendar"
        ref="fullCalendar"
        defaultView="timeGridWeek"
        :header="header"
        :plugins="calendarPlugins"
        :weekends="calendarWeekends"
        :events="plans"
        :editable="true"
        :nowIndicator="true"
        :hiddenDays="hiddenDays"
        :businessHours="businessHours"
        :eventConstraint="businessHours"
        @drop="handleDrop"
        @eventResize="handleEventResize"
        @eventDrop="handleEventDrop"
        @eventClick="handleEventClick"
        @eventRender="eventRender"
        @eventLeave="eventLeave"
      />
    </div>
  </div>
</template>

<script>
// // @ is an alias to /src
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Draggable } from "@fullcalendar/interaction";
import Task from "@/components/planning/Task.vue";

export default {
  name: "planningCalendar",
  components: {
    FullCalendar,
    Task
  },
  data: function() {
    return {
      header: {
        left: "prev,next",
        center: "title",
        right: ""
        // right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      calendarWeekends: true,
      hiddenDays: [0, 6],
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: "08:00",
        endTime: "17:00"
      }
    };
  },
  computed: {
    calendarApi() {
      return this.$refs.fullCalendar.getApi();
    },
    plans() {
      return this.$store.state.planning.plans;
    },
    tasks() {
      return this.$store.state.planning.tasks;
    }
  },
  methods: {
    handleDrop(dropInfo) {
      const filteredTask = this.tasks.filter(item => {
        return item.id === dropInfo.draggedEl.firstChild.id;
      })[0];
      const addedEvent = {
        eventTitle: filteredTask.eventTitle,
        h: filteredTask.h,
        u: filteredTask.u,
        colored: filteredTask.colored,
        date: filteredTask.date,
        projectName: filteredTask.projectName,
        start: dropInfo.dateStr,
        end: "",
        taskId: dropInfo.draggedEl.firstChild.id,
        // id: dropInfo.draggedEl.firstChild.id,  // id assigned by database
        editable: true,
        durationEditable: true
      };
      this.$store
        .dispatch("planning/create", addedEvent)
        .then(
          this.$store.dispatch("planning/getPlannings", this.getActiveDate())
        );
    },

    eventLeave(info) {
      console.log(info)
    },

    handleEventResize(eventResizeInfo) {
      const filteredTask = this.plans.filter(item => {
        return item.id === eventResizeInfo.event.id;
      })[0];
      const resizedEvent = {
        id: eventResizeInfo.event.id,
        taskId: filteredTask.taskId,
        end: eventResizeInfo.event.end,
        start: eventResizeInfo.event.start,
        eventTitle: filteredTask.eventTitle,
        h: filteredTask.h,
        u: filteredTask.u,
        colored: filteredTask.colored,
        date: filteredTask.date,
        projectName: filteredTask.projectName,
        editable: true,
        durationEditable: true
      };
      this.$store.dispatch("planning/update", resizedEvent);
    },

    handleEventDrop(eventDropInfo) {
      const filteredTask = this.plans.filter(item => {
        return item.id === eventDropInfo.event.id;
      })[0];
      const resizedEvent = {
        id: eventDropInfo.event.id,
        taskId: filteredTask.taskId,
        end: eventDropInfo.event.end || "",
        start: eventDropInfo.event.start,
        eventTitle: filteredTask.eventTitle,
        h: filteredTask.h,
        u: filteredTask.u,
        colored: filteredTask.colored,
        date: filteredTask.date,
        projectName: filteredTask.projectName,
        editable: true,
        durationEditable: true
      };
      this.$store.dispatch("planning/update", resizedEvent);
    },

    handleEventClick(eventClickInfo) {
      if (eventClickInfo.jsEvent.target.className === "fc-event__remove") {
        const id = eventClickInfo.event.id;
        this.calendarApi.getEventById(id).remove();
        this.$store.dispatch("planning/delete", {id: id, date: this.getActiveDate()});
      }
    },

    initDraggable() {
      const containerEl = this.$refs.calendar;
      new Draggable(containerEl, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          return {
            title: eventEl.innerText,
            create: false
          };
        }
      });
    },

    getActiveDate() {
      const activeStart = new Date(this.calendarApi.view.activeStart).toISOString().split('T')[0];
      const activeEnd = new Date(this.calendarApi.view.activeEnd).toISOString().split('T')[0];
      return { dateStart: activeStart, dateEnd: activeEnd };
    },

    clickPrevOrNextBtn() {
      const prevBtn = document.querySelector(".fc-prev-button");
      const nextBtn = document.querySelector(".fc-next-button");
      prevBtn.addEventListener("click", () => {
        this.$store.dispatch("planning/getPlannings", this.getActiveDate());
      });
      nextBtn.addEventListener("click", () => {
        this.$store.dispatch("planning/getPlannings", this.getActiveDate());
      });
    },

    eventRender(eventRenderInfo) {
      const plan = this.plans.find(item => {
        return item.id === eventRenderInfo.event.id;
      })
      const el = eventRenderInfo.el;
      const titleHtml = plan ? `
        <div class="fc-event__inner ${plan.colored ? "colored" : ""} ${
          plan.icon ? "fc-img" : ""
        }">
          <div class="fc-event__wrap">
            <strong class="fc-event__title">${plan.eventTitle}</strong>
            <div class="fc-event__img-wrap ${plan.icon ? plan.icon : ""}"></div>
          </div>
          <div class="fc-event__info">
            <div class="fc-event__date">${plan.date}</div>
            <div class="fc-event__hint">${plan.projectName}</div>
          </div>
          <span class="fc-event__remove">remove</span>
        </div>` : '';
      el.querySelector('.fc-content').insertAdjacentHTML('beforeend', titleHtml);
    },

    eventReceive(info) {
      console.log(info)
    }
  },

  mounted() {
    this.initDraggable();
    this.$store.dispatch("planning/getTasks");
    this.$store.dispatch("planning/getPlannings", this.getActiveDate());

    this.clickPrevOrNextBtn();
  }
};
</script>

<style lang="scss">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/timegrid/main.css";

.calendar {
  display: flex;
  justify-content: space-between;
  &__events {
    width: 15%;
  }
  &__table {
    width: 84%;
  }
}

.calendar__table {
  .fc-now-indicator {
    border-color: blue;
  }
  .fc-day-grid {
    display: none;
  }
  .fc-event {
    background: #eee;
    color: #000;
    border: 0;
    box-shadow: 0 0 1px 1px #ddd;
    &:hover {
      color: #000;
      text-decoration: none;
    }
    &.fc-draggable {
      background: #fff;
      .fc-event__remove {
        display: block;
      }
    }
  }
  .fc-content .fc-time {
    display: none;
  }
  .fc-content {
    &.colored {
      border-top: 3px solid red;
    }
  }
  .fc-event__date {
    display: none;
  }
  .colored {
    .fc-event__date {
      display: inline-block;
    }
  }
}

.fc-event__remove {
  display: none;
}

.fc-event__img-wrap {
  display: none;
}

.fc-img {
  .fc-event__img-wrap {
    display: block;
    width: 25px;
    height: 25px;
    margin-left: 5px;
  }
}

.fc-event__wrap {
  display: flex;
  align-items: center;
  .fc-event__title {
    width: 100%;
  }
}

.fc-event__info {
  display: flex;
  align-items: center;
  .fc-event__date {
    margin-right: 5px;
  }
}

.g-calendar {
  background: url("../../assets/img/g-calendar.png") center no-repeat;
  background-size: contain;
}

.fc-time-grid .fc-slats td,
.fc-axis.fc-widget-content {
  height: 40px !important;
}

.fc-divider.fc-widget-header {
  display: none;
}

.fc-day-header.fc-widget-header {
  padding: 7px;
}

.fc-scroller.fc-time-grid-container {
  height: auto !important;
}

@for $i from 1 through 16 {
  .fc-slats tbody tr:nth-child(#{$i}) {
    display: none;
  }
}

@for $i from 1 through 13 {
  .fc-slats tbody tr:nth-last-child(#{$i}) {
    display: none;
  }
}
</style>
