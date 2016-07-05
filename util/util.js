/**
* 工具函数 汇总
**/





/** 检测是否是作者 **/

/*
* @author_id 作者ID
* @login_user_id 登录用户的ID
*/

exports.visiter_is_author=function (req,author_id) {

	console.log('req.session.user',req.session.user);

	var login_user_id=req.session.user ? req.session.user.id : false;
	console.log( author_id,login_user_id)
	return author_id == login_user_id
}