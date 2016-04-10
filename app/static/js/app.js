var app = angular.module('wishlistApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate'])

.run(function($rootScope, $location, $http) {
    $rootScope.alerts = [];
    if (localStorage.token != null){
        $http({
        method: 'GET',
        url: '/api/user',
        headers: {'Authorization': 'Bearer ' + localStorage.token}
        }).then(function(response) {
            console.log(response);
        });
    }
})
.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'static/partials/home.html'
    })
    .when('/login',{
        templateUrl: 'static/partials/login.html',
        controller: 'loginController'
    })
    .when('/logout',{
        templateUrl: 'static/partials/home.html',
        controller: 'logoutController'
    })
    .when('/signup',{
        templateUrl: 'static/partials/register.html',
        controller: 'registerController'
    })
    .when('/wishlist',{
        templateUrl: 'static/partials/wishlist.html',
        controller: 'wishlistController'
    })
    .when('/wishlist/add',{
        templateUrl: 'static/partials/addItem.html',
        controller: 'addController'
    })
    .when('/wishlist/share',{
        templateUrl: 'static/partials/share.html',
        controller: 'shareController'
    })
    .when('/user/:id/wishlist/shared_view',{
        templateUrl: 'static/partials/shared_view.html',
        controller: 'sharedViewController'
    })
    .otherwise({
       redirectTo: '/' 
    });
})
.controller('loginController', function ($scope, $location, $http, $rootScope){
    
    $scope.login = function () {
        
        $http({
        url: '/api/user/login',
        method: "POST",
        data: $.param({email: $scope.login.email, password: $scope.login.password}),
        headers: {'content-type': 'application/x-www-form-urlencoded'}
        })
        .then(function(data, response) {
            
            if (data['data']['error'] == null){
                console.log(data['data']['data']['token']);
                $rootScope.loggedInUser = data['data']['data']['user']['_id'];
                localStorage.token = data['data']['data']['token'];
                $location.path('/user/'+$rootScope.loggedInUser+'/wishlist');
            }
            else{
                $scope.alerts = [{ type: 'danger', msg: data['data']['message'] }];
                $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                console.log(data['data']['message']);
            }
        });
    };
})
.controller('logoutController', function ($location, $rootScope){
    localStorage.removeItem('token');
    $rootScope.loggedInUser = null;
    $location.path('/');
})
.controller('registerController', function ($scope, $http, $location, $rootScope) {
    
    $scope.register = function () {
        var headers_ = {'content-type': 'application/x-www-form-urlencoded'};
        $http({
        url: '/api/user/register',
        method: "POST",
        data: $.param({name: $scope.reg.name, email: $scope.reg.email, password: $scope.reg.password}),
        headers: headers_
        })
        .then(function(data) {
            if (data['error'] == null){
                console.log(data['data']['data']['token']);
                localStorage.token = data['data']['data']['token'];
                $location.path('/user/'+$rootScope.loggedInUser+'/wishlist');
            }
            else{
                console.log(data['message']);
            }
        });
        
    };
   
})
.controller('wishlistController', function ($scope, $http, $rootScope) {
    $scope.items = [];
    var headers = {"Authorization": "Bearer " + localStorage.token};
    $http.get('/api/user/'+$rootScope.loggedInUser+'/wishlist', {headers:headers})
    .success(function(data){
            $scope.items = data['data']['wishes'];
            console.log($scope.items);
            $scope.alerts = $rootScope.alerts;
            $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
        });
})
.controller('addController', function ($scope, $http, $routeParams, $rootScope, $location) {
    $scope.param = $routeParams.id;
    $scope.button = "Get Details";
    $scope.addButton = "Add Wish";
    $scope.getDetails = function () {
        $scope.button = "Getting the details...";
        var headers = {"Authorization": "Bearer " + localStorage.token};
        $http.get('/api/thumbnail/process',{params:{"url": $scope.url}}, {headers:headers})
            .success(function(data) {
                console.log(data['error']);
                if (data['error'] == null){
                    $scope.alerts = [];
                    $scope.title = data['data']['title'];
                    $scope.thumbnails = data['data']['thumbnails'];
                    $scope.imgInstruct= "Select an image";
                    $scope.button = "Get Details";
                }
                else{
                    $scope.alerts = [{ type: 'danger', msg: data['message'] }];
                    $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                    $scope.thumbnails = [];
                    $scope.title = "";
                    $scope.imgInstruct = "";
                    $scope.button = "Get Details";
                }
            });
   };
   $scope.getThumbnail = function (index) {
        console.log(index);
        $scope.thumbnail = $scope.thumbnails[index];
        $scope.row = index;
   };
    $scope.add = function () {
        $scope.addButton = "Adding your wish...";
        console.log($scope.url);
        console.log($scope.thumbnail);
        console.log($scope.title);
        console.log($scope.descript);
        var headers = {'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + localStorage.token};
        $http({
        url: '/api/user/'+$rootScope.loggedInUser+'/wishlist',
        method: "POST",
        data: $.param({title: $scope.title, description: $scope.descript, url: $scope.url, thumbnail: $scope.thumbnail}),
        headers: headers
        })
        .then(function(response) {
            console.log(response['data']);
            if (response['data']['error'] == null){
                $location.path('/user/'+$rootScope.loggedInUser+'/wishlist');
                $rootScope.alerts = [{ type: 'success', msg: response['data']['message'] }];
            }
            else{
                $scope.alerts = [{ type: 'danger', msg: response['data']['message'] }];
                $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                console.log(response['data']['message']);
                $scope.addButton = "Add Wish";
            }
            $location.path('/user/'+$rootScope.loggedInUser+'/wishlist');
        });
    };
   
})
.controller('shareController', function ($scope, $http, $routeParams, $location, $rootScope) {
    $scope.param = $routeParams.id;
    
    $scope.share = function () {
        console.log($scope.email1);
        console.log($scope.email2);
        console.log($scope.email3);
        console.log($scope.email4);
        console.log($scope.email5);
        
        var headers = {'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + localStorage.token};
        $http({
        url: '/api/user/'+$rootScope.loggedInUser+'/wishlist/share',
        method: "POST",
        data: $.param({email1: $scope.email1, email2: $scope.email2, email3: $scope.email3, email4: $scope.email4, email5: $scope.email5}),
        headers: headers
        })
        .then(function(response) {
            console.log(response['data']);
            console.log("Wishlist sent");
            $location.path('/user/'+$rootScope.loggedInUser+'/wishlist');
        });
    };
})
.controller('sharedViewController', function ($scope, $http, $routeParams, $location, $rootScope) {
    $scope.param = $routeParams.id;
    
    $scope.share = function () {
        console.log($scope.email1);
        console.log($scope.email2);
        console.log($scope.email3);
        console.log($scope.email4);
        console.log($scope.email5);
        
        var headers = {'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + localStorage.token};
        $http({
        url: '/api/user/'+$rootScope.loggedInUser+'/wishlist/share',
        method: "POST",
        data: $.param({email1: $scope.email1, email2: $scope.email2, email3: $scope.email3, email4: $scope.email4, email5: $scope.email5}),
        headers: headers
        })
        .then(function(response) {
            console.log(response['data']);
            console.log("Wishlist sent");
            $location.path('/user/'+$rootScope.loggedInUser+'/wishlist');
        });
    };
});