angular.module(
  'starter.kit', 
  [])
.factory('$kit',function($ionicPopup,$http){
	var kit = {};
	kit.uri = 'http://rap.taobao.org/mockjsdata/5933/app';

// http://rap.taobao.org/mockjsdata/5933/app/product/list
	kit.isEmpty = function(obj){
		return obj === void 0 
			|| typeof obj  === void 0 
			|| obj === null 
			|| obj === ''
			|| obj === 'null';
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
	kit.autoPost = function(url,data,success,error,finallyFun){
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
	kit.autoGet = function(url,data,success,error,finallyFun){
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
.factory('$picker',function($kit){
	$picker = {};
	$picker.city = function(){
		
	}
	return kit;
})
;


