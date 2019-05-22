<template>
  <div class="about">
    <PlanningCalendar />
  </div>
</template>

<script>
// // @ is an alias to /src
import PlanningCalendar from "@/components/planning/PlanningCalendar.vue";

export default {
  name: "calendar",
  components: {
    PlanningCalendar
  }
}
</script>