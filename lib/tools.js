/**
 * _tools.js v0.0.1
 * @js底层工具库
 * @yaojia yaojaa@vip.qq.com
 */

(function() {


    var root = this

    var _ = function(obj) {
        if (obj instanceof _) return obj
        if (!(this instanceof _)) return new _(obj)
    }

    //for node

     if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = _;
        }
        exports._ = _;
      } else {
        root._ = _;
      }

    _.VERSION = _.V= '0.0.1'

    var class2type = {}
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    var nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind,
        nativeCreate       = Object.create;

   var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;
   var typeOpt=['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error','Array']

    var noop = function(){};
    /**
     * 抛出错误
     * @param {String} 错误信息
     */
    _.error = function(msg) {
            throw new Error(msg)
        }


           // 生成class2type map 替换[object typename]为name 



        /**
         * 类型判断
         * @param {} 任意类型的参数
         * @returns {} Boolean Number String Function Array Date RegExp Object Error
         */
     _.type = function(obj) {
            if (obj == null) {
                return obj + ""
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" : // {}.prototype.toSting()
                typeof obj

        }
        /**
         * 迭代器
         * @param {} 
         * @returns {} 
         */
    _.each = function(obj, callback) {
        var length, i = 0

        if (isArrayLike(obj)) {
            length = obj.length
            for (;i < length ;i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break
                }
            }
        }

        return obj
    }



    _.each(typeOpt, function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();

         _['is' + name] = function(obj) {
          return _.type(obj)==name.toLowerCase()
        };
    })


  




    /**
     * 字符串转JSON
     * @param {} 
     * @returns {} 
     */

    _.parseJSON = function(str) {
        //如果是 object类型 解析会报错，所以直接返回 
        if (_.type(str) === "function") {
            _.error('parseJSON的参数不能是function类型')
        }
        if (_.type(str) === "object") {
            return str
        }


        // Support: Android 2.3
        if (window.JSON && window.JSON.parse) {
            return JSON.parse(str + "")
        }
    }

 







    /**
     * 是否为数组或类数组
     * @param {} 
     * @returns { } 
     */

    function isArrayLike(obj) {

        var length = !!obj && "length" in obj && obj.length,
            type = _.type(obj);

        if (type === "function" || isWindow(obj)) {
            return false
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj
    }





    /**
     * 是否为window对象
     * @param {} 
     * @returns {} 
     */

    function isWindow(obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window
    }



    /**
     * 合并数组
     * @param {Array} 
     * @returns { Array} 
     */

    _.merge = function(first, secend) {
        var i = 0
        var l = first.length

        while (secend[i] !== 'undefined') {
            first[l++] = secend[i++]

        }

        first.length = l
        return first
    }



    /**
     * reduce
     * @param {Array} 
     * @returns { Array} 
     * Array.prototype.reduce 被添加到 ECMA-262 标准第 5 版；因此可能在某些实现环境中不被支持。
     * 可以将下面的代码插入到脚本开头来允许在那些未能原生支持 reduce 的实现环境中使用它。
     */

     _.reduce=function(){

     }


    /**
     * pick _.pick(object, *keys)
     * @param {object} 
     * @param { Array} 
     * Return a copy of the object only containing the whitelisted properties.
     *  返回一个object副本，只过滤出keys(有效的键组成的数组)参数指定的属性值。或者接受一个判断函数，指定挑选哪个key。 
     */


     _.pick = function(object, keys) {
     object = Object(object);
     var result={};

     if(typeof keys ==='undefined'){

        for(key in object){
          result[key]=object[key]

        }
        return result
     }

     if(_.type(keys)!=='array'){
        _.error('_.pick,第二个参数必须为数组')
     }
     _.each(keys,function(k,key){
        if(key in object){
          result[key]=object[key]

        }

     })

      return result;
  };





    //返回_对象
    root._ = _


}.call(this))
