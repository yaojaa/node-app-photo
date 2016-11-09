<template>
<div id="aticle">
<h1>{{info.title}}</h1>
<hr>
<div class="loading" v-if="loading">Loading...</div>
{{info.summary}}
</div>
</template>
<script>
export default {
  name: 'subject',
  data () {
    return {
      info: {
      }
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$http.jsonp('https://api.douban.com/v2/movie/subject/' + this.$route.params.id, {}, {
        headers: {
        },
        emulateJSON: true
      }).then(function (response) {
      // 这里是处理正确的回调
        this.loading = false
        this.info = response.data
      }, function (response) {
        // 这里是处理错误的回调
        console.log(response)
      })
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
#event{
  padding: 30px
}


</style>
