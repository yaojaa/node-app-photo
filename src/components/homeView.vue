<template>
  <div id="home">
<div class="pusher">
  <div class="ui inverted vertical masthead center aligned segment">
    <div class="ui text container" style="height:400px;padding:140px">
      <h1 class="ui inverted header">
        welcome back!!!
      </h1>
      <h2>Do whatever you want when you want to.</h2>
      <div class="ui huge  button"> <router-link to="/login">加入会鸽</router-link>
 </div>
    </div>

  </div>

  <div class="ui vertical stripe segment">
    <div class="ui middle aligned stackable grid container">
      <div class="row">
        <div class="eight wide column">
          <h1 class="ui header">热门活动排行榜</h1>
          <ol>
            <li v-for="article in articles" style="font-size:18px">
             <router-link :to="'/subject/'+article._id"> {{article.title}}</router-link>
            </li>
          </ol>
        </div>
        <div class="six wide right floated column">
          <img src="http://semantic-ui.com/examples/assets/images/wireframe/white-image.png" class="ui large bordered rounded image">
        </div>
      </div>
      <div class="row">
        <div class="center aligned column">
          <a class="ui huge button">Check Them Out</a>
        </div>
      </div>
    </div>
  </div>


  <div class="ui vertical stripe quote segment">
    <div class="ui equal width stackable internally celled grid">
      <div class="center aligned row">
        <div class="column">
          <h3>"What a Company"</h3>
          <p>That is what they all say about us</p>
        </div>
        <div class="column">
          <h3>"I shouldn't have gone with their competitor."</h3>
          <p>
            <img src="http://semantic-ui.com/examples/assets/images/avatar/nan.jpg" class="ui avatar image"> <b>Nan</b> Chief Fun Officer Acme Toys
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="ui vertical stripe segment">
    <div class="ui text container">
      <h3 class="ui header">Breaking The Grid, Grabs Your Attention</h3>
      <p>Instead of focusing on content creation and hard work, we have learned how to master the art of doing nothing by providing massive amounts of whitespace and generic content that can seem massive, monolithic and worth your attention.</p>
      <a class="ui large button">Read More</a>
      <h4 class="ui horizontal header divider">
        <a href="#">Case Studies</a>
      </h4>
      <h3 class="ui header">Did We Tell You About Our Bananas?</h3>
      <p>Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but its really true. It took years of gene splicing and combinatory DNA research, but our bananas can really dance.</p>
      <a class="ui large button">I'm Still Quite Interested</a>
    </div>
  </div>
</div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Event Dove',
      articles: []
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
