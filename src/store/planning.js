import Vue from 'vue'
import planningApi from '../api/planning'

export default {
  namespaced: true,
  state: {
    api: 'http://localhost:3000/',
    plans: [],
    tasks: []
  },
  mutations: {
    updateCalendarEvents(state, payload) {
      state.plans.push(payload)
    },
    setCalendarEvents(state, payload) {
      state.plans = payload;
    },
    setCalendarEventAfterResize(state, payload) {
      state.plans.forEach(item => {
        if (item.id === payload.id) {
          item = payload;
        }
      });
    },
    setTasks(state, payload) {
      state.tasks = payload;
    }
  },
  actions: {
    async getPlannings({
      state,
      commit
    }, payload) {
      try {
        await planningApi.get(`${state.api}plans?dateStart=${payload.dateStart}&dateEnd=${payload.dateEnd}`).then(response => {
          commit('setCalendarEvents', response.data);
        });
      } catch (error) {
        Vue.prototype.$flashStorage.flash(error.message, 'error', {
          timeout: 3000
        });
      }
    },
    async create({
      state,
      commit
    }, payload) {
      try {
        const requestData = {
          "taskId": payload.taskId,
          "eventTitle": payload.eventTitle,
          "h": payload.h,
          "u": payload.u,
          "colored": payload.colored,
          "date": payload.date,
          "projectName": payload.projectName,
          "start": payload.start,
          "allDay": payload.allDay,
          "editable": true,
          "durationEditable": true
        }
        await planningApi.create(state.api + 'plans', requestData).then(response => {
          commit('updateCalendarEvents', response.data);
        });
      } catch (error) {
        Vue.prototype.$flashStorage.flash(error.message, 'error', {
          timeout: 3000
        });
      }
    },
    async update({
      state,
      commit
    }, payload) {
      try {
        const requestData = {
          "id": payload.id,
          "taskId": payload.taskId,
          "end": payload.end,
          "eventTitle": payload.eventTitle,
          "h": payload.h,
          "u": payload.u,
          "colored": payload.colored,
          "date": payload.date,
          "projectName": payload.projectName,
          "start": payload.start,
          "allDay": payload.allDay,
          "editable": true,
          "durationEditable": true
        }
        await planningApi.update(state.api + `plans/${payload.id}`, requestData).then(response => {
          commit('setCalendarEventAfterResize', response.data);
        });
      } catch (error) {
        Vue.prototype.$flashStorage.flash(error.message, 'error', {
          timeout: 3000
        });
      }
    },
    async delete({
      state,
      dispatch
    }, payload) {
      try {
        await planningApi.delete(state.api + `plans/${payload.id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(() => {
          dispatch('getPlannings', payload.date);
        });
      } catch (error) {
        Vue.prototype.$flashStorage.flash(error.message, 'error', {
          timeout: 3000
        });
      }
    },
    async getTasks({
      state,
      commit
    }) {
      try {
        await planningApi.get(state.api + 'tasks').then(response => {
          commit('setTasks', response.data);
        });
      } catch (error) {
        Vue.prototype.$flashStorage.flash(error.message, 'error', {
          timeout: 3000
        });
      }
    }
  }
};