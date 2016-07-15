// util
(function(global, exportName) { // JH
    if (typeof(exportName) !== "string" ) { return false; }

    /***** Private helper functions ***********************/
    // 内部的函数
    var toString = Object.prototype.toString;
    var _isDOM = function( elem ) { return true; };
    var _isFn = function( fn ){ return typeof(fn) === "function"; };
    // from underscore.js
    var _isArray = Array.isArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    /***** DOM Querying helper functions *****************/
    // 返回ctx上，符合str条件的第一个元素
    var util = function(ctx, str) {
        switch (arguments.length) {
            case 0:
                return undefined;
                break;
            case 1:
                return document.querySelector(ctx);
                break;
            case 2:
                if (_isDOM(ctx)) {
                    return ctx.querySelector(str);
                }
                else {
                    if (_isDOM(str)) {
                        return str.querySelector(ctx);
                    }
                    else {
                        var parent = util(ctx);
                        if (_isDOM(parent)) {
                            return parent.querySelector(str);
                        }
                        else {
                            return document.querySelector(str);
                        }
                    }
                }
                break;
        }
    };
    // querySelectorAll
    // 返回ctx上，所有符合str条件的对象
    util.all = function(ctx, str) {
        switch (arguments.length) {
            case 0:
                return undefined;
                break;
            case 1:
                return document.querySelectorAll(ctx);
                break;
            case 2:
                if (_isDOM(ctx)) {
                    return ctx.querySelectorAll(str);
                }
                else {
                    if (_isDOM(str)) {
                        return str.querySelectorAll(ctx);
                    }
                    else {
                        var parent = util(ctx);
                        if (_isDOM(parent)) {
                            return parent.querySelectorAll(str);
                        }
                        else {
                            return document.querySelectorAll(str);
                        }
                    }
                }
                break;
        }
    };
    // 给target对象的evn事件加上fn回调事件
    util.on = function(target, evn, fn) {
        // console.info(target + typeof(target));
        if (_isArray(target)) {
            util.each(target, function( item ){
                item.addEventListener(evn, fn, false);
            });
            return;
        }
        return target.addEventListener(evn, fn, false);
    };

    /***** Array helper functions ***********************/
    // 将Array-like的对象，转变成array
    util.toArray = function(obj) {
        if (!obj) return [];
        return Array.prototype.slice.call(obj);
    };
    util.isArray = _isArray;
    util.each = function(arr, fn) {
        // if is a array-like object
        if (!Array.isArray(arr)) {
            if (arr.length !== undefined) { console.log("JH.each receive a array-like object."); return util.each( util.toArray(arr), fn ); }
        }

        // support forEach (ECMAScript 5) feature
        if (Array.prototype.forEach !== 'undefined') {
            if (!_isFn(fn)) { return arr; }
            arr.forEach(fn);
            return arr;
        }
        // do not support forEach
        else {
            for (var i = 0; i < arr.length; i++) {
                var v = arr[i];
                fn(v, i, arr);
            }
            return arr;
        }
    };
    // 返回 用fn处理过的，arr的对应值
    util.map = function(arr, fn) {
        var mappedArr = [];
        util.each(arr, function(v, index, arr) {
            var newValue = fn(v, index, arr);
            mappedArr.push(newValue);
        });

        return mappedArr;
    };
    // 返回 用fn处理过的，arr的对应值
    util.filter = function(arr, fn) {
        var mappedArr = [];
        util.each(arr, function(v, index) {
            if (fn(v)) {
                mappedArr.push(v);
            }
        });
        return mappedArr;
    };
    // 返回数组第一个值
    util.first = function(a) {
        if (a && "length" in a) {
            return a[0] || undefined;
        }
    };
    // 返回数组最后一个值
    util.last = function(a) {
        if (a && "length" in a) {
            var lastIndex = a.length - 1;
            return a[lastIndex] || undefined;
        }
    };

    /***** Object helper functions ***********************/
    // 返回obj对象的所有key
    util.keys = function(obj) {
        var arrKeys = [];
        for (var key in obj) {
            // 只获取obj自己的属性
            if (obj.hasOwnProperty(key)) {
                arrKeys.push(key);
            }
        }
        return arrKeys;
    };
    // 返回obj对象自有属性的值
    util.values = function(obj) {
        var keys = util.keys(obj);
        return util.map(keys, function(k){
            return obj[k];
        });
    };
    // 循环obj的自有属性
    util.each4obj = function(obj, fn) {
        var prop = util.keys(obj);
        JH.each(prop, function(p){
            fn(obj[p], p, obj);
        });
        return obj;
    }
    // 用obj来扩展original对象，将会合并到default上的任何属性的值，返回新对象
    util.extend = function(original, obj) {
        var o = {};
        var key = util.keys(original);
        key = key.concat(util.keys(obj));

        JH.each(key, function(k){
            o[k] = obj[k] || original[k];
        });
        return o;
    };
    // 用obj来覆盖original上对应属性
    util.cover = function(original, obj) {
        var key = util.keys(obj);
        JH.each(key, function(k){
            original[k] = obj[k];
        });
        return original;
    };

    /***** CSS helper functions ***********************/
    util.parseToCSS = function(obj) {
        var o = {};
        var keys = JH.keys(obj);
        var rules = {
            backgroundImage: function(s){
                if (s.substr(0,4) === "url(") {
                    return s;
                }
                else {
                    return "url(" + s + ")";
                }
            }
        };

        JH.each4obj(obj, function(v, k, a){
            if (k in rules) {
                a[k] = rules[k](v);
            }
        });

        return obj;
    };
    // 暂时包装一个DOMnode以方便装上css
    util.stylify = function(node) {

    };

    /***** Format helper functions ***********************/
    util.format = function(str, fn) {
        return fn(str);
    };

    /***** Timing helper functions ***********************/
    util.NS = {};
    /***** AJAX helper functions ***********************/
    // util.ajax = function(url){
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", url);
    // };
    util.get = function(url){
        var O = function(url) {
            var me = this;

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            var state = false;
            var aSuccess = [];
            var aError = [];

            me.success = function(fn) {
                state = true;
                aSuccess.push(fn);
                return me;
            };
            me.error = function(fn) {
                state = true;
                aError.push(fn);
                return me;
            };

            xhr.onreadystatechange = function(e) {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    JH.each(aSuccess, function(fn){
                        fn(xhr.response);
                    });
                }
            };
            xhr.onerror = function(e) {
                JH.each(aError, function(fn) {
                    fn(e);
                });
            };
            xhr.send();
            return me;
        };

        return new O(url);
    };
    util.post = function(url, formData){
        var parseForm = function(form) {
            var a = [];
            JH.each4obj(form, function(v, k) {
                a.push(encodeURIComponent(k) +"="+ encodeURIComponent(v));
            });
            return a.join("&").replace( /%20/g, "+" ); // 将空格转变为 + 号
        };
        var O = function(url) {
            var me = this;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            var state = false;
            var aSuccess = [];
            var aError = [];

            me.success = function(fn) {
                state = true;
                aSuccess.push(fn);
                return me;
            };
            me.error = function(fn) {
                state = true;
                aError.push(fn);
                return me;
            };

            xhr.onreadystatechange = function(e) {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    JH.each(aSuccess, function(fn){
                        fn(xhr.response);
                    });
                }
            };
            xhr.onerror = function(e) {
                JH.each(aError, function(fn) {
                    fn(e);
                });
            };

            xhr.send(formData && parseForm(formData));
            return me;
        };

        return new O(url);
    };

    global[exportName] = util;
})(window, "JH");

/*
 * Router
 * 非嵌入试的事件处理机制
 * Router.on(event, fn)  监听某个事件，目前只支持增加单个的事件监听回调函数
 * Router.off(event, fn) 取消某个事件的监听函数，不指定fn将去除事件的所有回调函数
 * Router.trigger(event) 触发某个事件，event可以是通过 Router.Event() 建立的对象
 *                       包含 type, target, timastamp等属性
*/
(function(global, exportName){ // Router
    var O = {};

    /* 由冒号进行分割 example "type:item"
     * return {
     * ok:Boolean, type:String, item:String
     * }
    */
    var splitByColon = function(str) {
        var a = str.split(":");

        return {
            ok: a.length === 2,
            type: a[0],
            item: a[1]
        };
    };

    var Router = function(){
        if (this === window) { return new Router(); }
        var me = this;
        return me;
    };
    Router.prototype = {
        Event: function(type, target, obj) {
            var ev = {
                type:   type,
                target: target,
                timestamp:   +new Date(),
            };

            for (var i in obj) {
                if (!ev[i]) { ev[i] = obj[i]; }
            }
            return ev;
        },
        on: function(ev, fn) {
            if (!(ev in O)) {
                O[ev] = [fn];
                return this;
            }

            var a = O[ev];
            // 遍历，避免有重复的事件
            for (var i = 0; i < a.length; i++) {
                if (fn === a[i]) { return this; }
            }

            a.push(fn);
            return this;
        },
        off: function(ev, fn) {
            // 事件队列里没有ev
            if (!(ev in O)) { return this; }
            var a = O[ev];
            // 没有指定哪个函数，置空事件队列
            if (!fn) { O[ev] = []; return this; }
            // 事件队列为空
            if (a.length === 0) { return this; }
            // 遍历，删除事件
            for (var i = 0; i < a.length; i++) {
                if (fn === a[i]) {
                    a.splice(i,1);
                    return this;
                }
            }
            return this;
        },
        trigger: function(ev) {
            var a = splitByColon(ev.type);

            // 处理独立的type:item上的事件
            if (ev.type in O) {
                JH.each(O[ev.type], function(fn){
                    fn(ev);
                });
            }

            // 处理type级别上的事件
            if (a.ok) {
                var evType = a.type;
                if (evType in O) {
                    JH.each(O[evType], function(fn){
                        fn(ev);
                    });
                }
            }

            return this;
        },

        onload: function(fn){
            this.on("WINDOW:load", fn);
        },
    };

    var R = new Router();
    global[exportName] = R;
    JH.on(window, "load", function(){
        R.trigger(new R.Event("WINDOW:load"));
    });
}(window, "Router"));
// Router响应window上的一些事件
(function(){
    var listener = {};
    JH.on(window, 'resize', function(e){
        clearTimeout(listener.resize);
        listener.resize = window.setTimeout(function(){
            Router.trigger(new Router.Event("WINDOW:resize"));
        }, 600);
    });
}());



/* DOM
 * 用于快速生成DOM tags
 * DOM( obj )
 *      tag:String  >> tagName
 *       id:String  >> id
 *     html:String  >> innerHTML
 *     href:String  >> href
 *    class:Array   >> classList
 * children:Array   >> childNodes
 *    style:Object  >> style [CSS style]
*/
(function(global, exportName){ // JH.DOM( object )
    function createTag(o){
        if(o['tag'] === undefined) { return; }
        var tag = document.createElement(o['tag']);
        // classList
        if(o['class']) {
            JH.each(o['class'], function(c) {
                tag.classList.add(c);
            });
        }
        // childNodes
        if(o['children']) {
            JH.each(o['children'], function(child) {
                tag.appendChild(child);
            });
        }
        // node.style, css style
        if(o['style']) {
            var cssMap = o['style'];
            for(var key in cssMap) {
                if (key in tag.style) {
                    tag.style[key] = cssMap[key];
                }
            }
        }
        // dataset
        if(o['data']) {
            var dataset = o['data'];
            for(var key in dataset) {
                tag.dataset[key] = dataset[key];
            }
        }
        if(o['id'])   { tag.id = o['id']; }
        if(o['html']) { tag.innerHTML = o['html']; }
        if(o['href']) { tag.href = o['href']; }

        return tag;
    }
    global[exportName] = createTag;
}(JH, "DOM"));
