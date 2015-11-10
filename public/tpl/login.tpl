<div id="login" class="accounts-form">
        <h2>会员登录</h2>
        <form id="login" name="login" method="POST" action="" onsubmit="return checklogin();">
          <input id="action" name="action" value="login" type="hidden">
          <p class="text-error"> 请输入用户名和密码</p>
          <div class="input">
            <input id="name" value="" placeholder="昵称/邮箱" maxlength="75" name="name" type="text" class="form-control">
          </div>
          <div class="input">
            <input id="password" placeholder="密码" name="password" type="password" class="form-control">
          </div>
          <div class="actions clearfix">
            <input id="submitlogin" value="登 录" onclick="this.value='登录中...'" type="submit" class="btn btn-success">
          </div>
        </form>
        <p class="text-center"><a href="/web/index/getpwd">忘记密码？</a><a href="reg.html">注册新用户</a></p>
</div>