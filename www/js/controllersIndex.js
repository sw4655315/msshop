angular.module('starter.controllersIndex', [])

.controller('index', function($scope, $ionicModal, $timeout,$state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $state.go('app.address');
    // $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $state.go('app.address');
    // console.log('Doing login', $scope.loginData);

    // // Simulate a login delay. Remove this and replace with your login
    // // code if using a login system
    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
  };
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state,$ionicSideMenuDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(searchModal) {
    $scope.searchModal = searchModal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };


    // Triggered in the login modal to close it
  $scope.closeSearch = function() {
    $scope.searchModal.hide();
  };

  // Open the login modal
  $scope.search = function() {
    $scope.searchModal.show();
  };

    // Open the login modal
  $scope.doSearch = function() {
    $timeout(function() {
      $scope.searchModal.hide();
    }, 400);
    $ionicSideMenuDelegate.toggleLeft(false);
    $state.go('app.playlists',{'a':1},{'b':2});
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $scope.closeLogin();
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,$rootScope,$kit,$stateParams) {
  $scope.pageNumber = $stateParams.pageNumber || 1;
  $scope.pLists = [];
  $scope.loadOver = false;
  $scope.load = function(){
    $kit.autoPost('product/list/'+$scope.pageNumber++,{a:1},function(json){
      $scope.pLists = $scope.pLists.concat(json.pLists);
      $scope.page = json.page;
    },false,function(){
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    })
  }
  $scope.reload = function(){
    $scope.pLists = [];
    $scope.load();
  }

  $scope.getNext = function(_index){
    return $scope.pLists[(_index + 1)];
  }
  $scope.onTap = function(){
    alert(123);
  }
  $scope.load();

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})

.controller('personalCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})

.controller('settingCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})

.controller('searchCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
.controller('detailCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
.controller('accountCtrl', function($scope, $stateParams,$ionicActionSheet,$kit) {
  $scope.user = {sex:'请选择'};
  $scope.choseSex = function(){
    // 显示操作表
   $ionicActionSheet.show({
     buttons: [
       { text: '男' },
       { text: '女' },
     ],
     titleText: '选择性别',
     buttonClicked: function(index) {
       switch(index){
        case 0:
          $scope.user.sex="男";break;
        case 1:
          $scope.user.sex="女";break;
       }
       return true;
     }
   });
  }
  $scope.paras = $stateParams;
})
.controller('addressCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
.controller('addressEditCtrl', function($scope, $stateParams) {
  var area1 = new LArea();
  area1.init({
      'trigger': '#cityText', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
      'valueTo': '#cityValue', //选择完毕后id属性输出到该位置
      'keys': {
          id: 'id',
          name: 'name'
      }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
      'type': 1, //数据源类型
      'data': LAreaData //数据源
  });
  area1.value=[1,13,3];//控制初始位置，注意：该方法并不会影响到input的value
  $scope.paras = $stateParams;
})
.controller('orderListCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
  // switch ($stateParams.op) {
  //   case 'all':
  //     // statements_1
  //     break;
  //   case '123':
  //     // statements_1
  //     break;
  //   default:
  //     // statements_def
  //     break;
  // }
})
.controller('loginCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
.controller('cartCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
;