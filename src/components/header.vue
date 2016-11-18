<template>
  <div id="header">
   <div class="ui  inverted menu">
  <div class="header item teal"><router-link  to="/">会鸽</router-link></div>
    <router-link class="item green" to="/event">发现活动     <i class="dropdown icon"></i>
    </router-link>
     <div class="ui pointing dropdown link item">
    <span class="text">Shopping</span>
    <i class="dropdown icon"></i>
    <div class="menu">
      <div class="header">Categories</div>
      <div class="item">
        <i class="dropdown icon"></i>
        <span class="text">Clothing</span>
        <div class="menu">
          <div class="header">Mens</div>
          <div class="item">Shirts</div>
          <div class="item">Pants</div>
          <div class="item">Jeans</div>
          <div class="item">Shoes</div>
          <div class="divider"></div>
          <div class="header">Womens</div>
          <div class="item">Dresses</div>
          <div class="item">Shoes</div>
          <div class="item">Bags</div>
        </div>
      </div>
      <div class="item">Home Goods</div>
      <div class="item">Bedroom</div>
      <div class="divider"></div>
      <div class="header">Order</div>
      <div class="item">Status</div>
      <div class="item">Cancellations</div>
    </div>
  </div>
    <router-link class="item" to="/downApp">下载APP</router-link>
    <router-link class="item" to="/about_us">关于会鸽</router-link>
    <a class="ui dropdown item">
      Messages
      <i class="dropdown icon"></i>
      <div class="menu">
        <div class="item">
          <i class="dropdown icon"></i>
          <span class="text">Categories</span>
          <div class="menu">
            <div class="item">Unread</div>
            <div class="item">Promotions</div>
            <div class="item">Updates</div>
          </div>
        </div>
        <div class="item">Archive</div>
      </div>
    </a>

  <div class="right menu">
    <div class="item">
  <div class="ui icon input">
      <input type="text" placeholder="Search...">
      <i class="search icon"></i>
    </div>
    </div>
    <a class="item ui button" href="/protocol">创建活动</a>
    <router-link class="item" to="/reg">注册</router-link>
    <router-link class="item" to="/login" >登录 </router-link>

  </div>
</div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'headers',
  data () {
    return {
      msg: 'Welcome to Event Dove'
    }
  },
  mounted () {
    $('.ui.dropdown').dropdown({
      on: 'hover'
    })
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
