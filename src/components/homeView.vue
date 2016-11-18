<template>
  <div id="home">
<div class="pusher">
  <div style="height:300px">
    <!-- 幻灯内容 -->
<swiper :options="swiperOption">
      <swiper-slide style="background-image:url(http://eventdove.com/resource/20160926/420953_20160926105847630.jpg)">1</swiper-slide>
      <swiper-slide style="background-image:url(http://eventdove.com/resource/20161104/420953_20161104173104887.jpg)">2</swiper-slide>
      <swiper-slide style="background-image:url(http://eventdove.com/resource/20161018/420953_20161018162413525.jpg)">3</swiper-slide>
      <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      <div class="swiper-scrollbar"   slot="scrollbar"></div>
</swiper>
</div>
</div>
<!--block-->
<div id="imageContext">
    <div class="ui secondary menu"">
      <a class="item active" data-tab="first">First</a>
      <a class="item" data-tab="second">Second</a>
      <a class="item" data-tab="third">Third</a>
    </div>
    <div class="ui bottom attached tab segment active" data-tab="first">
      First
    </div>
    <div class="ui bottom attached tab segment" data-tab="second">
      Second
    </div>
    <div class="ui bottom attached tab segment" data-tab="third">
      Third
    </div>
</div>
<!--block-->

<div class="ui modal">
  <i class="close icon"></i>
  <div class="header">
    Profile Picture
  </div>
  <div class="image content">
    <div class="ui medium image">
      <img src="/images/avatar/large/chris.jpg">
    </div>
    <div class="description">
      <div class="ui header">We've auto-chosen a profile image for you.</div>
      <p>We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a> image associated with your registered e-mail address.</p>
      <p>Is it okay to use this photo?</p>
    </div>
  </div>
  <div class="actions">
    <div class="ui black deny button">
      Nope
    </div>
    <div class="ui positive right labeled icon button">
      Yep, that's me
      <i class="checkmark icon"></i>
    </div>
  </div>
</div>

<div class="ui styled fluid accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    What is a dog?
  </div>
  <div class="content">
    <p class="transition hidden">A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
  </div>
  <div class="title">
    <i class="dropdown icon"></i>
    What kinds of dogs are there?
  </div>
  <div class="content">
    <p class="transition hidden">There are many breeds of dogs. Each breed varies in size and temperament. Owners often select a breed of dog that they find to be compatible with their own lifestyle and desires from a companion.</p>
  </div>
  <div class="title active">
    <i class="dropdown icon"></i>
    How do you acquire a dog?
  </div>
  <div class="content active">
    <p class="transition visible">Three common ways for a prospective owner to acquire a dog is from pet shops, private owners, or shelters.</p>
    <p class="transition visible">A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner allows you to assess the pedigree and upbringing of your dog before choosing to take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog who may not find one so readily.</p>
  </div>
</div>

  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import $ from 'jquery'
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Event Dove',
      articles: [],
      swiperOption: {
        // 如果你后续需要找到当前实例化后的swiper对象以对其进行一些操作的话，可以自定义配置一个名字
        name: 'currentSwiper',
        // 所有配置均为可选（同Swiper配置）
        autoplay: 3000,
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: false,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
        scrollbar: '.swiper-scrollbar',
        mousewheelControl: true,
        observeParents: true,
        effect: 'fade',
        // if you need use plugins in the swiper, you can config in here like this
        debugger: true
        // swiper callbacks
        // onTransitionStart: function(swiper){
        //   console.log(swiper)
        // }
        // more Swiper config ...
        // ...
      }
    }
  },
  mounted: function () {
    this.$http.get('/api/v1/getAticles', {}, {
      headers: {
      },
      emulateJSON: true
    }).then(function (response) {
      console.dir(response)
      // 这里是处理正确的回调
      this.articles = response.data.aticles
    }, function (response) {
        // 这里是处理错误的回调
      console.log(response)
    })
    console.log($.fn.tab)
    $('.menu .item').tab()
    $('.ui.modal').modal('show')
    $('.accordion').accordion({
      selector: {
        trigger: '.title'
      }
    })
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .swiper-slide {
    background-position: center;
    background-size: cover;
    height:360px
  }
  #imageContext{
    margin-top: 150px
  }
</style>
