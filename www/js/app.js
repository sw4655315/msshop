// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ionicapp = angular.module('starter', [
  'ionic'
  ,'starter.constant'
  ,'starter.controllers'
  ,'starter.kit'
  ,'ionicLazyLoad']);
// Mock.mockjax(ionicapp);
ionicapp.run(function($ionicPlatform,$rootScope,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.loading = function(){
    $ionicLoading.show();
  }
  $rootScope.loaded = function(){
    $ionicLoading.hide();
  }
})

;
