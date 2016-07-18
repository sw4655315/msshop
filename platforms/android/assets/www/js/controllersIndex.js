angular.module('starter.controllersIndex', [])

.controller('index', function($scope, $ionicModal, $timeout) {

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
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
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

.controller('PlaylistsCtrl', function($scope,$rootScope,http,$stateParams) {
  $scope.paras = $stateParams;
  $scope.pLists = [];
  $scope.loadOver = false;
  $scope.load = function(){
    http.autoPost('/product/promote',{a:1},function(json){
      $scope.pLists = $scope.pLists.concat(json.pLists);
      $scope.page = json.page;
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
.controller('accountCtrl', function($scope, $stateParams,$ionicActionSheet,ionicToast) {
  $scope.user = {sex:'男'};
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

    $scope.showToastTop = function(){
      ionicToast.show('This is a toast at the top.', 'top', true, 2000);
    };

    $scope.showToastMiddle = function(){
      ionicToast.show('This is a toast at the middle.', 'middle',false, 1000);
    };

    $scope.showToastBottom = function(){
      ionicToast.show('This is a toast at the bottom.', 'bottom',false, 2000);
    };
  }
  $scope.paras = $stateParams;
})
.controller('addressCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
.controller('addressEditCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
})
.controller('orderListCtrl', function($scope, $stateParams) {
  $scope.paras = $stateParams;
  switch ($stateParams.op) {
    case 'all':
      // statements_1
      break;
    case '123':
      // statements_1
      break;
    default:
      // statements_def
      break;
  }

})
;



// Generated by CoffeeScript 1.7.1
// (function() {
//   (function() {
//     var app;
//     app = angular.module('app', []);
//     Mock.mockjax(app);
//     return app.controller('appCtrl', function($scope, $http) {
//       var box;
//       box = $scope.box = [];
//       $scope.get = function() {
//         $http({
//           url: 'http://g.cn',
//           method: 'POST',
//           params: {a: 1},
//           data  : {b:1}
//         }).success(function(data) {
//           return box.push(data);
//         });

//         $http({
//           url: 'http://baidu.com'
//         }).success(function(data) {
//             console.log(data);
//         });
//       };
//       return $scope.get();
//     });
//   })();

// }).call(this);