angular.module(
  'starter.kit', 
  [])
.factory('$kit',function($ionicPopup,$http){
	var kit = {};
	kit.uri = 'http://rap.taobao.org/mockjsdata/5933/app/';

// http://rap.taobao.org/mockjsdata/5933/app/product/list
	kit.isEmpty = function(obj){
		return obj === void 0 
			|| typeof obj  === "undefined"
			|| obj === null 
			|| obj === ''
			|| obj === 'null';
	}
	kit.isExist = function(obj){
		if(kit.isEmpty(obj)) return !1;
		if(angular.isArray(obj)) return obj.length > 0;
		if(angular.isObject(obj)) return !isEmptyObject(obj);
		return !0;
	}

	function isEmptyObject(e){
		var t;
		for (t in e) 
			return !1;
		return !0;
	}

	kit.alert = function(msg,yes,title){
		//  alert（警告） 对话框
	    $ionicPopup.alert({
	       title: title || '提示',
	       template: msg || '操作失败'
	    })
	    .then(yes || function(){});
	};
	kit.confirm = function(msg,title,yes,no){
		var confirmPopup = $ionicPopup.confirm({
	       title: title || '提示',
	       template: msg || '确认操作？'
	    });
	    confirmPopup.then(function(res) {
	       if(res && yew) {
	         yes();
	       } else if(!res && no) {
	         no();
	       }
	    });
	}
	kit.toast = function(msg,yes){
		kit.alert(msg,yes);
	}

	kit.post = function(url,data,successFun,errorFun,finallyFun){
		$http({
			url: kit.uri + url,
	        method: 'POST',
	        params: {},
	        data  : data || {}
		})
		.success(successFun|| function(){})
		.error(errorFun || function(){})
		.finally(finallyFun||function(){});
	};
	kit.ap = kit.autoPost = function(url,data,success,error,finallyFun){
		kit.post(url,data
			,function(res,header,config,status){
				if(!res || res.resCode !== 200){
					kit.alert(res.resMsg);
					return false;
				} 
				success(res.resObj);
			},function(res,header,config,status){
				console.error(res);
		},finallyFun);
	};
	kit.get = function(url,data,success,error,finallyFun){
		$http({
			url: kit.uri + url,
	        method: 'GET',
	        params: data || {},
	        data  : {}
		})
		.success(success|| function(){})
		.error(error || function(){})
		.finally(finallyFun||function(){});
	};
	kit.ag = kit.autoGet = function(url,data,success,error,finallyFun){
		kit.get(url,data
			,function(res,header,config,status){
				if(!res || res.resCode !== 200){
					kit.alert(res.resMsg);
					return false;
				}
				success(res.resObj);
			},function(res,header,config,status){
				console.error(res);
		},finallyFun);
	};
	return kit;
})
.factory('_stg',function(localStorageService,$kit){
	console.info(localStorageService);
	/**
     * 缓存服务
     */
    var stg = angular.extend({},localStorageService);
    //缓存的sessionid
    stg.sid = function(){
        return stg.get('sid');
    }
    //缓存的用户
    stg.user = function(){
        return stg.get('user');
    }
    //清除用户信息
    stg.signout = function(){
        stg.set('sid',null);
        stg.set('user',null);
        $state.reload();
    }

    stg.isSignin = function(){
        return !isEmpty(stg.get('sid'));
    }

    stg.needSignin = function(flag){
        if(isEmpty(stg.get('sid'))){
            $state.go('login',{flag:flag || 0});
            return !1;
        }
        return !0;
    }
    stg.search_histry={
    	get:function(){
    		return stg.get('search_histry');
    	},
    	put:function(str){
    		var h = stg.get('search_histry') || [];
    		h.push(str);
    		stg.set('search_histry',h);
    	},
    	remove:function(str){
    		var h = stg.get('search_histry') || [];
    	}
    }
    return stg;
})
.config(function(localStorageServiceProvider){
        //本地存储设置
        localStorageServiceProvider.prefix = 'msshop';
        // localStorageServiceProvider.storageType = "sessionStorage";
    })
;


