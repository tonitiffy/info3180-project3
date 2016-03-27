var app = angular.module('wishlistApp', []);



app.controller('wishlistCtrl', function ($scope, $http) {
    $scope.items = []; 
    
    $http.post('/wishlist/')
        .success(function(data){
            console.log(data['items']);
            $scope.items = data['items'];
        });
        
    $scope.deleteItem = function (item) {
        console.log($scope.items[item].id);
        $scope.itemId = $scope.items[item].id;
        $http.post('/wishlist/removefromwishlist/'+$scope.itemId)
            .success(function(data) {
                console.log('item deleted');
                $scope.items.splice(item,1);
            });  
        
   };
   
});

app.controller('sharedWishlistCtrl', function ($scope, $http) {
    
    
});

app.controller('addToWishlistCtrl', function ($scope, $http, $window) {
    $scope.button = "Get Details";
    $scope.imgInstruct = "";
    $scope.images = [];    
    $scope.getItemInfo = function () {
        $scope.button = "Getting the details...";
        console.log('attempting to get product info');
        $http.post('/wishlist/getitemdata/', { url: $scope.itemUrl })
            .success(function(data) {
                console.log(data);
                $scope.title = data.data.title;
                $scope.images = data.data.images;
                console.log($scope.images);
                $scope.button = "Get Details";
                $scope.imgInstruct= "Select an image";
            });   
   };
   $scope.getImgUrl = function (item) {
        console.log(item);
        $scope.imgUrl = $scope.images[item];
        $scope.row = item;
        
   };
   $scope.addItemInfo = function () {
        console.log($scope.itemUrl);
        console.log($scope.imgUrl);
        console.log($scope.title);
        console.log($scope.descript);
        
        $http({
        url: '/wishlist/addtowishlist/',
        method: "POST",
        data: { itemUrl: $scope.itemUrl,  imgUrl: $scope.imgUrl, title: $scope.title, description: $scope.descript }
        })
        .then(function(response) {
                console.log("Item added to wishlist");
                $window.location.href = '/wishlist/';
        });
   };
   
});