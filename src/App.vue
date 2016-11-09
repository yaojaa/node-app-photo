<template>
  <div id="app">
    <headers></headers>
   <transition name="bounce" mode="out-in">
        <router-view class="view"></router-view>
   </transition>
   <footers></footers>
  </div>
</template>

<script>
import headers from './components/header'
import footers from './components/footers'

export default {
  name: 'app',
  components: {
    footers,
    headers
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-out .2s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0);
  }
}
</style>
