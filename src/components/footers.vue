<template>
    <div class="copyright_div">
    <div class="touying1"></div>
    <div class="copyright_nav">
        <div class="nav3box nav3_border">
            <ul class="nav3">
                <p class="nav3_p">了解会鸽</p>
                <li><a class="nav3_a" href="http://www.eventdove.com/about_us">关于会鸽</a></li>
                <li><a href="http://www.eventdove.com/jobs" class="nav3_a">加入会鸽</a>
                </li>
                <li><a class="nav3_a" href="http://www.eventdove.com/contact_us">联系会鸽</a> <!-- 联系会鸽 --></li>
                <li><a class="nav3_a" href="http://www.eventdove.com/privacy">隐私声明</a></li>
            </ul>
            <ul class="nav3">
                <p class="nav3_p">导航</p>
                <li><a href="http://www.eventdove.com/index.html" class="nav3_a">首页</a></li>
                <li><a href="http://www.eventdove.com/eventlist/myEventList.html" class="nav3_a">我的活动</a></li>
                <li><a href="http://www.eventdove.com/my_tickets/1,2" class="nav3_a">我的门票</a></li>
                <li><a href="http://www.eventdove.com/groupdetail/myManagerGroup.html" class="nav3_a">我的群组</a></li>
                <li><a href="http://www.eventdove.com/features" class="nav3_a">特色</a></li>
            </ul>
            <ul class="nav3 disnone640">
                <p class="nav3_p">快速操作</p>
                <li><a href="http://www.eventdove.com/eventdetail/createEvent.html" class="nav3_a">创建活动</a></li>
                <!-- 创建活动 -->
                <li><a href="http://www.eventdove.com/client_down" class="nav3_a">会鸽App</a></li>
            </ul>
            <ul class="nav3 disnone640">
                <p class="nav3_p">推荐网站</p>
                <li><a href="http://www.eventown.com/" class="nav3_a" target="_blank">会唐网</a></li>
                <li><a href="http://www.woshipm.com/" class="nav3_a" target="_blank">人人都是产品经理</a></li>
                <li><a href="http://www.mobilegbc.com/" class="nav3_a" target="_blank">手机游戏商务大会</a></li>
            </ul>
        </div>
        <div class="eventdove_info disnone640" id="footer">
            <div class="eventdove_infobox">
                <ul class="eventdove_info_left">
                    <p class="eventdove_info_left_p">关注会鸽</p>
                    <li style="background-position:0 -42px;">2850609143</li>
                    <li style="background-position:0 -42px;">2850609149</li>
                    <li style="background-position:0 -82px;">400-687-6670</li>
                    <li style="background-position:0 -82px;">025-87775086</li>
                </ul>
                <ul class="eventdove_info_right">
                    <li style="background-position:0 -120px;"><a href="http://weibo.com/eventdove" target="_blank">新浪微博</a></li>
                    <li style="background-position:0 -160px;"><a href="http://t.qq.com/eventdove" target="_blank">腾讯微博</a></li>
                    <li style="background-position:0 -205px;">微信 扫一扫</li>
                    <li style="background-position:0 -247px;"><a href="http://blog.eventdove.com" target="_blank">博客</a></li>
                </ul>
                <div class="wechat"><img src="http://www.eventdove.com/img/refactor2/image/quicKmark3.png"></div>
            </div>
        </div>
        <div class="clear_div"></div>
    </div>

    <p class="copyright_p" style="line-height: 19px;"><span style="display: inline-block;padding-top: 5px;">南京海震智能科技有限公司</span><br><span>Copyright©2015 <a href="http://www.eventdove.com/index.html">EventDove.com</a>
             版权所有     苏ICP备&nbsp;<a href="http://www.miitbeian.gov.cn">10211262</a>号&nbsp;苏ICP证&nbsp;<a href="http://www.miitbeian.gov.cn">B1-20150298</a>号</span></p>
</div>
</template>

<script>
export default {
  name: 'footers',
  data () {
    return {
      msg: 'Welcome to Event Dove'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.copyright_div {
    width: 100%;
    overflow: hidden;
    background: #e6eaf2;
}

.copyright_div .copyright_nav {
    width: 1310px;
    overflow: hidden;
    margin: 0 auto;
    zoom: 1;
    margin-top: 34px;
    border-bottom: 1px solid #cfd3dd;
}

.copyright_div .nav3_border {
    border-right: 1px solid #d9dbdd;
    padding-right: 40px;
}
.copyright_div .nav3box {
    float: left;
    margin-bottom: 24px;
    zoom: 1;
    overflow: hidden;
    border-right: 1px solid #cfd3dd;
}


.copyright_div .nav3 li {
    font-size: 13px;
    line-height: 24px;
    padding: 2px 0;
}

.copyright_div .nav3_a {
    color: #333;
}

.copyright_div .nav3 {
    overflow: hidden;
    float: left;
    margin-right: 72px;
}

.copyright_div .eventdove_info {
    float: right;
    overflow: hidden;
    zoom: 1;
}

</style>
