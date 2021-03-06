angular.module('starter.controllersIndex', [])

.controller('index', function($scope, $ionicModal, $timeout, $state) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
    })
    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicSideMenuDelegate) {

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
        //登录
        $scope.login = {
            hide: function() {
                $scope.loginModal.hide();
            },
            show: function() {
                $scope.loginModal.show();
            },
            login: function() {
                console.log('Doing login', $scope.loginData);
                $scope.closeLogin();
            }
        };
        //搜索
        $scope.search = {
            word: '',
            hide: function() {
                $scope.searchModal.hide();
            },
            show: function() {
                $scope.searchModal.show();
            },
            search: function() {
                $timeout(function() {
                    $scope.searchModal.hide();
                }, 400);
                $ionicSideMenuDelegate.toggleLeft(false);
                $state.go('app.playlists', { 'a': 1 }, { 'b': 2 });
            }
        };
    })

.controller('PlaylistsCtrl', function($scope, $rootScope, $kit, $stateParams) {
    $scope.pageNumber = $stateParams.pageNumber || 1;
    $scope.pLists = [];
    $scope.loadOver = false;
    $scope.load = function() {
        $kit.autoGet('product/list/' + $scope.pageNumber++, { a: 1 }, function(json) {
            $scope.pLists = $scope.pLists.concat(json.pLists);
            $scope.page = json.page;
        }, false, function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    }
    $scope.reload = function() {
        $scope.pLists = [];
        $scope.load();
    }
    $scope.getNext = function(_index) {
        return $scope.pLists[(_index + 1)];
    }
    $scope.onTap = function() {
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
    .controller('accountCtrl', function($scope, $stateParams, $ionicActionSheet, $kit) {
        $scope.user = { sex: '请选择' };
        $scope.choseSex = function() {
            // 显示操作表
            $ionicActionSheet.show({
                buttons: [
                    { text: '男' },
                    { text: '女' },
                ],
                titleText: '选择性别',
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            $scope.user.sex = "男";
                            break;
                        case 1:
                            $scope.user.sex = "女";
                            break;
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
        // var area1 = new LArea();
        // area1.init({
        //     'trigger': '#cityText', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
        //     'valueTo': '#cityValue', //选择完毕后id属性输出到该位置
        //     'keys': {
        //         id: 'id',
        //         name: 'name'
        //     }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
        //     'type': 1, //数据源类型
        //     'data': LAreaData //数据源
        // });
        // area1.value = [1, 13, 3]; //控制初始位置，注意：该方法并不会影响到input的value
        $scope.paras = $stateParams;
        setTimeout(function(){
          /*不带默认值*/
          $('#cityArea').areapicker({}, function (areaArr) {
              //确定时回调方法:
              //areaArr:已经选择的地区
              $('#cityArea').text(areaArr[0] + " " + areaArr[1] + " " + areaArr[2]);
          }, function (areaArr) {
              //取消时回调方法:
              //areaArr:上次选择的地区
              $('#cityArea').text(areaArr[0] + " " + areaArr[1] + " " + areaArr[2]);
          });
        },0);
    })
    .controller('orderListCtrl', function($scope, $stateParams) {
        $scope.paras = $stateParams;
    })
    .controller('loginCtrl', function($scope, $stateParams) {
        $scope.paras = $stateParams;
    })
    .controller('cartCtrl', function($scope, $stateParams) {
        $scope.paras = $stateParams;
    });
