angular.module('FYR', ['ui.bootstrap', 'ngAnimate', 'uiGmapgoogle-maps', 'ui.router', 'register'])

.config(function(uiGmapGoogleMapApiProvider , $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main');
  $stateProvider
    .state('main', {
      url: '/',
      controller: 'appController',
      templateUrl: 'index.html'
    })
    .state('signup', {
      url: '/signup',
      controller: 'formController',
      templateUrl: './client/register/register.html'
    });
    //NEED TO INSERT GOOGLE MAPS API
  uiGmapGoogleMapApiProvider.configure({
    key: '',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})

// .controller('menuController', function($scope, $http) {

//   // $scope.findMenu();
// })

.controller('appController', function($scope, $http, $location, uiGmapGoogleMapApi) {

  $scope.list = [];
  $scope.menu = [];

  $scope.findMenu = function(name, postal) {
    console.log(name, postal);
    return $http({
      method: 'POST',
      url: '/menu',
      headers: {
        "Content-Type": "application/JSON"
      },
      data: {name: name, postal_code: postal}
    }).then(function(res) {
      console.log(res.data);
      $scope.menu = res.data;
    });
  };
  console.log('test');

  $scope.sendZipCode  = function(searchParam) {
    // var params = '{enter query}';
    var integers = ['0','1','2','3','4','5','6','7','8','9'];
    var data;
    if(integers.indexOf(searchParam[0]) >= 0) {
    	data = {zipCode: searchParam};
    } else {
    	data = {city: searchParam};
    }
    console.log(data);
    return $http({
      method: 'POST',
      url: '/list',
      headers: {
        "Content-Type": "application/JSON"
      },
      data: data
    }).then(function(res) {
      $scope.list = res.data;

      //---Google Maps start---
      $scope.markerList = [];
      var markers = [];
      var sumLat = 0;
      var sumLong = 0;
      var count = 0;

      for (var key in $scope.list) {
        var latitude = $scope.list[key].location.coordinate.latitude;
        var longitude = $scope.list[key].location.coordinate.longitude;
        var name = $scope.list[key].name;
        var ratings = $scope.list[key].rating_img_url_small;
        var reviewCount = $scope.list[key].review_count;
        var url = $scope.list[key].url;

        markers.push({id: key, latitude: latitude, longitude: longitude, name: name, url: url, ratings: ratings, show: false });


        markers.push({id: key, latitude: latitude, longitude: longitude, name: name, url: url, ratings: ratings, reviewCount: reviewCount, show: false });


        sumLat += latitude;
        sumLong += longitude;
        ++count;
      }

      var avgLat = sumLat / count;
      var avgLong = sumLong / count;

      $scope.map = {center: { latitude: avgLat, longitude: avgLong }, zoom: 10 };
      $scope.markerList = markers;

      $scope.onClick = function(marker, eventName, model) {
        console.log("Clicked!");
        model.show = !model.show;
      };

      uiGmapGoogleMapApi.then(function(maps) {
        console.log("Working");
      });
      //---Google Maps End---

    });
  };


  $scope.logout = function() {
    $http({
      method: "GET",
      url: "user/logout",
    })
    .then(function(res) {
      console.log(res.data);
      $location.path('/signup');
    });
  };


  $scope.mapZoom = function(index) {
    $scope.map = {center: { latitude: $scope.list[index].location.coordinate.latitude, longitude: $scope.list[index].location.coordinate.longitude }, zoom: 17 };
  };
})

.controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  // $scope.groups = [
  //   {
  //     title: 'Dynamic Group Header - 1',
  //     content: 'Dynamic Group Body - 1'
  //   },
  //   {
  //     title: 'Dynamic Group Header - 2',
  //     content: 'Dynamic Group Body - 2'
  //   }
  // ];

  // $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  // $scope.addItem = function() {
  //   var newItemNo = $scope.items.length + 1;
  //   $scope.items.push('Item ' + newItemNo);
  // };

  // $scope.status = {
  //   isFirstOpen: true,
  //   isFirstDisabled: false
  // };
})

.controller('UibAccordionController', ['$scope', '$attrs', 'uibAccordionConfig', function($scope, $attrs, accordionConfig) {
  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ?
      $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if (closeOthers) {
      angular.forEach(this.groups, function(group) {
        if (group !== openGroup) {
          group.isOpen = false;
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function(event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  };
}]);
