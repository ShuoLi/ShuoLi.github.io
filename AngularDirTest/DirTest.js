/**
 * Created with JetBrains WebStorm.
 * User: sli
 * Date: 9/26/13
 * Time: 3:15 PM
 * To change this template use File | Settings | File Templates.
 */


var d3DemoApp = angular.module('expanderModule', [])
    .directive('ghVisualization', function () {

        // constants
        var margin = 20,
            width = 960,
            height = 300 - .5 - margin,
            color = d3.interpolateRgb("#f77", "#77f");

        return{
            restrict: 'EA',
            replace: true,
            transclude: false,
            scope: {val: '=val'},
            link: function (scope, element, attrs) {

                var vis = d3.select(element[0])
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin + 100);

                var circles = vis.selectAll("circle")
                    .data(scope.val)
                    .enter()
                    .append("circle");

                var circleAttributes = circles
                    .attr('cx', function (d) {
                        return d.cx;
                    })
                    .attr('cy', function (d) {
                        return d.cy;
                    })
                    .attr('r', function (d) {
                        return d.radius;
                    })
                    .attr('fill', function (d) {
                        return d.color;
                    });


                scope.$watch('val', function (newVal, oldVal) {
                    var circles = vis.selectAll("circle")
                        .data(newVal)
                            .transition(100000)
                        .attr('cx', function (d) {
                            return d.cx;
                        })
                        .attr('cy', function (d) {
                            return d.cy;
                        })
                        .attr('r', function (d) {
                            return d.radius;
                        })
                        .attr('fill', function (d) {
                            return d.color;
                        });
                });
            }
        }

    })
    .directive('ghVisualization2', function () {

        // constants
        var margin = 20,
            width = 960,
            height = 300 - .5 - margin,
            color = d3.interpolateRgb("#f77", "#77f");

        return{
            restrict: 'EA',
            replace: true,
            transclude: false,
            scope: {val: '=val2'},
            link: function (scope, element, attrs) {

                var vis = d3.select(element[0])
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin + 100);

                var circles = vis.selectAll("circle")
                    .data(scope.val)
                    .enter()
                    .append("circle");

                var circleAttributes = circles
                    .attr('cx', function (d) {
                        return d.cx;
                    })
                    .attr('cy', function (d) {
                        return d.cy;
                    })
                    .attr('r', function (d) {
                        return d.radius;
                    })
                    .attr('fill', function (d) {
                        return d.color;
                    });


                scope.$watch('val', function (newVal, oldVal) {
                    var circles = vis.selectAll("circle")
                        .data(newVal)
                        .attr('cx', function (d) {
                            return d.cx;
                        })
                        .attr('cy', function (d) {
                            return d.cy;
                        })
                        .attr('r', function (d) {
                            return d.radius;
                        })
                        .attr('fill', function (d) {
                            return d.color;
                        });
                });
            }
        }

    });


d3DemoApp.controller('dirController', function ($scope) {

    var dataFormater = function () {
        var results = [];
        for (var i = 0; i < 10; i++) {
            var temp = {"cx": parseInt(Math.random() * 600), "cy": parseInt(Math.random() * 250), "radius": 20, "color": "green" };
            results.push(temp);
        }

        return results;
    }

    var dataFormater2 = function () {
        var results = [];
        for (var i = 0; i < 10; i++) {
            var temp = {"cx": parseInt(Math.random() * 600), "cy": parseInt(Math.random() * 200), "radius": 20, "color": "red" };
            results.push(temp);
        }

        return results;
    }


    $scope.data = dataFormater();
    $scope.data2 = dataFormater2();
    $scope.show = function () {
        /*invoke http function to fetch data;
         */

        $scope.data = dataFormater();
        $scope.data2 = dataFormater2();
    };


});


