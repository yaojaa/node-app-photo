var Event=function() {
	var obj,
		one,
		remove,
		trigger,
		_this;

	obj={};

	listen=function(key,evtfn){

	
		if(!obj[key]){
			obj[key]=[]
		}
		return obj[key].push(evtfn)
	};
	remove=function(key){

		obj[key].length=0

	};
	trigger=function(){

		var key = Array.prototype.shift.call( arguments );
		var stack=obj[key];
		if (!stack) {
            return false;
        }
        var len=stack.length || 0;
        while(len--) {
			stack[len].apply(this,arguments)
		};

	};

	return {
		listen:listen,
		trigger:trigger,
		remove:remove
	}
}