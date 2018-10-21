var app = angular.module('angularjsNodejsTutorial',[]);
/* To List movies from database*/
app.controller('myController', function($scope, $http) {
    $scope.data = [];
    var request = $http.get('/data');    
    request.success(function(data) {
         //var myData =  $.parseJSON(JSON.parse(data));
        $scope.data = data.Items ;
    });
    request.error(function(data){
        console.log('Error: ' + data);
    });
});

/*To add movie to database*/
app.controller('addCtrl', function($scope,$http) {
 $scope.data = {};
$scope.submitForm = function(){
    console.log('clicked submit');
    $http({
        url: 'http://localhost:4300/create',
        method: 'POST',
        data: $scope.form
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    })
   }
 });

/*To delete movie from database*/
app.controller('deleteCtrl', function($scope,$http) {
 $scope.data = {};
$scope.submitFormDelete = function(){
    console.log('clicked submit');

$http.defaults.headers.delete={"Content-Type":"application/json;charset=utf-8"};
    $http({
        url: 'http://localhost:4300/delete',
        method: 'DELETE',
        data: $scope.form
    }).then(function (httpResponse) {

        console.log('response:', httpResponse);
         
    })
   }
 });

/*To update movie in database*/
app.controller('searchCtrl', function($scope, $http) {
       $scope.title='';
       $scope.year='';
       $scope.actors='';
       $scope.directors='';
       $scope.genres='';
       $scope.nodata="false";
    
    /*To search requested movie from database and send back to client*/
     $scope.submitSearch=function(){
        $scope.nodata="true";

      var parameters = {
                title:$scope.form.title,
                year:$scope.form.year           
             };
            var config = {
                params: parameters
               };
           
$http.get('/datasearch', config)
            .success(function (data) {
               
                 $scope.title=data.Item.title;
                 $scope.year=data.Item.year;
                 $scope.actors=data.Item.info.actors;
                 $scope.directors=data.Item.info.directors;
                 $scope.genres=data.Item.info.genres;
               })
            .error(function (data) {
                console.log('Error: ' + data);
            });   
}

/*To update the changes in the database*/
 $scope.submitUpdate=function(){

$http.defaults.headers.put={"Content-Type":"application/json;charset=utf-8"};
    $http({
        url: 'http://localhost:4300/update',
        method: 'PUT',
        data: {title:$scope.title,year:$scope.year,actors:

$scope.actors,directors:$scope.directors,genres:$scope.genres}
    }).then(function (httpResponse) {

        console.log('response:', httpResponse);
         
    })

  }

});
