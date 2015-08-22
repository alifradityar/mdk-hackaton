angular.module('versinfocus.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $ionicSideMenuDelegate, $state, $rootScope) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.width = $window.innerWidth;

  $scope.openMenu = function() {
    $ionicSideMenuDelegate.toggleLeft(true);
  };

  $scope.isWalletShown = false;
  $scope.toggleWallet = function () {
    $scope.isWalletShown = $scope.isWalletShown === false ? true : false;
    console.log('Toggled');
  }

  $scope.activeMenu = 'app.home';

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $scope.activeMenu = toState.name;
  });

  // ionic.on('resize',function() {
  //   ionic.off('resize',null,window);
  //   self.positionView(target,modalEl);
  // },window);
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('HomeCtrl', function($scope, ArchiveImage) {
  $scope.archives = [];
  $scope.years = [];
  $scope.year = parseInt(moment().format('YYYY'));
  for (var i = $scope.year; i >= $scope.year - 2; i--) {
    $scope.years.push({id: i, label: i});
  }

  $scope.monthList = [
    { title: 'January', id: 1 },
    { title: 'February', id: 2 },
    { title: 'March', id: 3 },
    { title: 'April', id: 4 },
    { title: 'May', id: 5 },
    { title: 'June', id: 6 },
    { title: 'July', id: 7 },
    { title: 'August', id: 8 },
    { title: 'September', id: 9 },
    { title: 'October', id: 10 },
    { title: 'November', id: 11 },
    { title: 'December', id: 12 }
  ];

  $scope.months = $scope.monthList;

  $scope.refreshMonth = function() {
    if ($scope.archives.length > 0) {
      angular.forEach($scope.months, function (item, i) {
        $scope.months[i].image = $scope.archives[i].custom_fields['3colmediaSplashImg_value'][0];
      });
    }
  }

  $scope.changeYear = function(year) {
    console.log(year);
    var currentYear = parseInt(moment().format('YYYY'));
    var currentMonth = parseInt(moment().format('M'));
    if (year == currentYear) {
      $scope.months = _.filter($scope.monthList, function (item) {
        return item.id <= currentMonth;
      });
    } else {
      $scope.months = $scope.monthList;
    }
    $scope.refreshMonth();
  }
  $scope.changeYear($scope.years[0].id);

  ArchiveImage.getAll().then(function (data) {
    $scope.archives = data;
    $scope.refreshMonth();
  });
})

.service('VerseService', function(Verse, Favorites, $sce, $cordovaSocialSharing) {
  return function($scope) {
    $scope.isLike = false;
    $scope.verse = {};

    $scope.like = function() {
      console.log('like');
      $scope.isLike = !$scope.isLike;
      if ($scope.isLike) {
        Favorites.add($scope.verse);
      } else {
        Favorites.remove($scope.verse);
      }
    }

    $scope.share = function() {
      $cordovaSocialSharing
        .shareViaFacebook("Read encouraging words here", null, "http://warungsatekamu.org/")
        .then(function(result) {
          alert('Sharing succeed.');
        }, function(err) {
          alert('Sharing failed.');
        });
    }
  };
})

.controller('VerseCtrl', function($scope, $stateParams, Verse, Favorites, $sce, VerseService) {
  VerseService($scope);

  Verse.findById($stateParams.id).then(function (data) {
    $scope.verse = data;
    $scope.verse.content = $sce.trustAsHtml($scope.verse.content);
    $scope.isLike = Favorites.isLike($scope.verse);
  });
})

.controller('TodayCtrl', function($scope, Verse, Favorites, VerseService) {
  VerseService($scope);

  Verse.findByToday().then(function (data) {
    $scope.verse = data;
    $scope.isLike = Favorites.isLike($scope.verse);
  });

})

.controller('DevotionsCtrl', function($scope, Devotions, $stateParams, $ionicLoading, $timeout) {
  $scope.devotions = [];
  $scope.page = 1;
  $scope.finish = false;

  $scope.loadMore = function() {
    if (!$scope.finish) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      Devotions.findByMonth($stateParams.month, $stateParams.year, $scope.page).then(function(data) {
        if (data.length == 0) {
          $scope.finish = true;
        }
        $scope.devotions = Devotions.all($stateParams.month, $stateParams.year);
        $scope.page++;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $timeout(function() {
          $ionicLoading.hide();
        }, 1500);
      }, function () {
        $ionicLoading.hide();
      });
    } else {
      $ionicLoading.hide();
    }
  }
  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });
})

.controller('FavoritesCtrl', function($scope, Favorites, $stateParams) {
  $scope.devotions = [];
  $scope.load = function() {
    Favorites.getAll().then(function(data) {
      // console.log('happy');
      console.log(data);
      $scope.devotions = data;
    });
  }
  $scope.$on('$ionicView.beforeEnter', $scope.load);
  $scope.confirmDelete = function(item) {
    console.log(item);
    Favorites.remove(item);
    $scope.load();
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MarketCtrl', function($scope, $state, $stateParams, $ionicSideMenuDelegate) {
  console.log("Hello");
  $ionicSideMenuDelegate.canDragContent(false)
  var lat  = '-6.2398054';
  var long = '106.8113921';
  $scope.map = {center: {latitude: lat, longitude: long }, zoom: 16 };
  $scope.options = {
    scrollwheel: false,
    overviewMapControl: false,
    panControl: true,
    scaleControl: true,
    scrollwheel: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: true
  };
  $scope.markets = [{
    id: 1,
    coords: {
      latitude: -6.2398054,
      longitude: 106.8113921
    },
    options: { draggable: false },
  },{
    id: 2,
    coords: {
      latitude: -6.2398054,
      longitude: 106.8114000
    },
    options: { draggable: false },
  },{
    id: 3,
    coords: {
      latitude: -6.2430470,
      longitude: 106.8247076
    },
    options: { draggable: false },
  }];

  $scope.test = {
    forceToMarket : function(){
    console.log("HEHE");
    $state.go('app.marketSingle');
  }}
})

.controller('MarketSingleCtrl', function($scope, $stateParams) {
});
