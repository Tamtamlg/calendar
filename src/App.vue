<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Calendar</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
    
    <flash-message class="flash-message"></flash-message>
  </div>
</template>

<style lang="scss">
@import "../node_modules/vue-flash-message/dist/vue-flash-message.min.css";
.flash-message {
  display: flex;
  position: fixed;
  top: 10px;
  right: 10px;
}
.flash__message {
  width: 260px;
  transition: all .5s;
  font-size: 13px;
  line-height: 130%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}


</style>
