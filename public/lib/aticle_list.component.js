/**
 * vue 自定义组件   之 图文列表
 **/



Vue.component('my-component', function(resolve, reject) {

		$.get('api/v1/getAticles', function(res) {

			if (res.errorno == 0) {

				resolve({
					template: '<li  class="vision-item clearfix" v-for="item in items">'+
					 '<a href="/a/{{item._id}}" class="item-cover" target="_blank"><img :src="item.thumb"></a>' 
					 	+ '<div class="item-info">'
						+ '<a href="/a/{{item._id}}" class="item-title" target="_blank"> {{item.title}}</a>'
						+ '<p class="item-author"><a href="/userspace/{{item.author._id}}">{{item.author.nickname}}</a> 发表于 {{item.update_at }}</p>'
						+ '<p class="item-desc">{{item.des}}</p>'
						+ '</div>'
						+'</li>',
					data: function () {
					    return { items: res.aticles }
					  }
				})

			} else {
				reject(

					{
						template: '加载失败',
					}

				)
			}

		})

	})



	+ '<a :href="/a/item._id" class="item-cover" target="_blank"> <img :src="item.thumb"></a>'
						+ '<div class="item-info">'
						+ '<a :href="/a/item._id" class="item-cover" target="_blank"> {{item.title}}</a>'
						+ '<p class="item-author"><a href="">{{author.nickname}}</a> {{create_at }}</p>'
						+ '<p class="item-desc">{{des }}</p>'