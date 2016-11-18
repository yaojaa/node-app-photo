<template>
<div id="aticleContent">
<h1>{{info.title}} </h1><small>{{info.update_at}}</small>
<hr>
<div v-html="info.content"></div>
<div class="loading" v-if="loading">Loading...</div>
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
      this.$http.get('/api/v1/getAticleById', {
        params: {
          id: this.$route.params.id
        }
      }).then(function (response) {
      // 这里是处理正确的回调
        this.loading = false
        console.log(response.data)
        this.info = response.data.data
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
#aticleContent {
    background-color: #fff;
    padding: 50px;
    line-height: 1.6;
    box-shadow: 0 0 6px #ddd;
    max-width:960px;
    margin:10px auto 40px;
    font-size: 16px;
}

#aticleContent p{
  line-height: 1.6;
    margin-bottom: 25px;
    font-size: 16px
}

#aticleContent strong{
    font-weight:bold
}

#aticleContent img{
    max-width:100%;
    margin:10px auto;
    display: inline-block;

}

#aticleContent .author-info {
    border-bottom: 1px solid #eeeeee;
    color: #999999;
    font-size: 12px;
    margin-bottom: 30px;
    overflow: hidden;
    padding: 15px 0;
}
#aticleContent .author-info .follow, #aticleContent .author-info .following {
    float: right;
    margin-top: 10px;
}
#aticleContent .author-info .follow > span, #aticleContent .author-info .following > span {
    display: inline-block;
    line-height: 13px;
}
#aticleContent .author-info .avatar {
    float: left;
    height: 40px;
    margin-right: 10px;
    width: 40px;
}

#aticleContent .author-info .avatar  img{
    margin:0
}
#aticleContent .author-info .label {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    border: 1px solid #e78170;
    color: #e78170;
    font-size: 11px;
    font-weight: normal;
    line-height: 1;
    text-shadow: none;
}
#aticleContent .author-info .author-name {
    margin: 0 5px;
}
#aticleContent .author-info > div {
    margin-top: 3px;
}

h1.heading{
    font-family: Georgia,"Times New Roman",Times,"Kai","Kaiti SC","KaiTi","BiauKai","楷体","楷体_GB2312",serif;
       font-size: 32px;
    font-weight: bold;
    line-height: 1.5;
    word-break: break-all;
    text-align: center;
}

.author-copyright{
    color: #d5d5d5
}

@media(max-width: 768px){

    .share{
        display: none;
    }
    #aticleContent{
        padding: 10px
    }
}

</style>
