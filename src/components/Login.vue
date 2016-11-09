<template>
<div class="ui container middle aligned center aligned grid two">
  <div class="column">
    <h2 class="ui teal image header">
      <div class="content">
      <br><br>
        Log-in to your account
      </div>
    </h2>
    <form class="ui large form">
      <div class="ui stacked segment">
        <div class="field">
          <div class="ui left icon input">
            <i class="user icon"></i>
            <input type="text" name="email" placeholder="E-mail address">
          </div>
        </div>
        <div class="field">
          <div class="ui left icon input">
            <i class="lock icon"></i>
            <input type="password" name="password" placeholder="Password">
          </div>
        </div>
        <div class="ui fluid large teal submit button">Login</div>
      </div>

      <div class="ui error message"></div>

    </form>

    <div class="ui message">
      New to us? <a href="#">Sign Up</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: 'Welcome to login '
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gongyong_logout {
    width: 710px;
    margin: 30px auto;
    overflow: hidden;
    background: #fff;
    border: 1px solid #dbe0eb;
    border-top: 3px solid #19b915;
    padding: 50px 70px;
}
.gongyong_logout .left {
    width: 285px;
    float: left;
    border-right: 1px solid #dbe0eb;
    padding-right: 70px;
}
.gongyong_logout .login_right {
    float: left;
    padding-left: 70px;
}
</style>
