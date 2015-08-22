// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('versinfocus', [
  'ionic',
  'versinfocus.controllers',
  'versinfocus.services',
  'versinfocus.directives',
  'ngStorage',
  'ngCordova',
  'uiGmapgoogle-maps'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.today', {
    url: "/today",
    views: {
      'menuContent': {
        templateUrl: "templates/verse.html",
        controller: 'TodayCtrl'
      }
    }
  })

  .state('app.verse', {
    url: "/verse/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/verse.html",
        controller: 'VerseCtrl'
      }
    }
  })

  .state('app.devotions', {
    url: "/devotions/:month/:year",
    views: {
      'menuContent': {
        templateUrl: "templates/devotions.html",
        controller: 'DevotionsCtrl'
      }
    }
  })

  .state('app.favorites', {
    url: "/favorites",
    views: {
      'menuContent': {
        templateUrl: "templates/favorites.html",
        controller: 'FavoritesCtrl'
      }
    }
  })

  .state('app.help', {
    url: "/help",
    views: {
      'menuContent': {
        templateUrl: "templates/help.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })
  .state('app.market', {
    url: "/market",
    views: {
      'menuContent': {
        templateUrl: "templates/market.html",
        controller: 'MarketCtrl'
      }
    }
  })
  .state('app.marketSingle', {
    url: "/market/single",
    views: {
      'menuContent': {
        templateUrl: "templates/marketsingle.html",
        controller: 'MarketSingleCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
