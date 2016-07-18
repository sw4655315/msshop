angular.module(
  'starter.constant', [])
.value('port',{url : 'http://g.cn/app'})
/**
 * 配置路由
 */
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html',
    controller: 'searchCtrl'
  })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
  .state('app.detail',{
    url: '/detail',
    views:{
      'menuContent': {
        templateUrl:'templates/detail.html',
        controller: 'detailCtrl'
      }
    }
  })
    .state('app.setting', {
    url: '/setting',
    views: {
      'menuContent': {
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl'
      }
    }
  })
  .state('app.personal',{
    url: '/personal',
    views:{
      'menuContent': {
        templateUrl:'templates/personal.html',
        controller: 'personalCtrl'
      }
    }
  })
  .state('app.account',{
    url: '/account',
    views:{
      'menuContent': {
        templateUrl:'templates/account.html',
        controller: 'accountCtrl'
      }
    }
  })

  .state('app.address',{
    url: '/address',
    views:{
      'menuContent': {
        templateUrl:'templates/address.html',
        controller: 'addressCtrl'
      }
    }
  })
  .state('app.addressEdit',{
    url: '/addressEdit',
    views:{
      'menuContent': {
        templateUrl:'templates/addressEdit.html',
        controller: 'addressEditCtrl'
      }
    }
  })
    .state('app.order-list',{
    url: '/order-list/:op',
    views:{
      'menuContent': {
        templateUrl:'templates/order-list.html',
        controller: 'orderListCtrl'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
})
