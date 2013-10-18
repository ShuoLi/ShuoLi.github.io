/**
 * Created by sli on 10/18/13.
 */
var app = angular.module('myApp', ['ngAnimate']);

app.controller("MyController",function($scope){
    $scope.shouldShowHello=false;

    $scope.showHello = function(){
        $scope.shouldShowHello= true;
    };

    $scope.reset = function(){
        $scope.shouldShowHello = false;
    }
});

