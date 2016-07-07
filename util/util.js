/**
 * 工具函数 汇总
 **/




/*检测是否是admin
 * @req request
 */


exports.is_admin=function(req){
	return req.session.user ? req.session.user.is_admin == true : false
} 

/*检测是否是作者
 * @author_id 作者ID
 */

exports.visiter_is_author = function(req, author_id) {
	var login_user_id = req.session.user ? req.session.user.id : false;
	return author_id == login_user_id 
}