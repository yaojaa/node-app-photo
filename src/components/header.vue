<template>
  <div id="header">
   <div class="ui menu">
  <div class="header item"><router-link  to="/">会鸽</router-link></div>
    <router-link class="item" to="/event">发现活动</router-link>

  <div class="right menu">
    <div class="item">
      <div class="ui action left icon input">
        <i class="search icon"></i>
        <input type="text" placeholder="Search">
        <button class="ui button">搜索</button>
      </div>
    </div>
    <a class="item">创建活动</a>
        <router-link class="item" to="/login">注册</router-link>
    <router-link class="item" to="/login" >登录 </router-link>

  </div>
</div>
  </div>
</template>

<script>
export default {
  name: 'headers',
  data () {
    return {
      msg: 'Welcome to Event Dove'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search{
  background: url('http://www.eventdove.com/img/refactor2/image/search_event_top_bg05.jpg');
}
h1, h2 {
  font-weight: normal;
}


</style>
