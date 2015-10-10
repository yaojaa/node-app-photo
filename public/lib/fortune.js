var fortune=['aaaaa','bbbbbbb','ccccccccc','ddddddddddd']

exports.init=function () {
	var index=Math.floor(Math.random()*fortune.length)
	return fortune[index]
}