var evaApp = angular.module('eva', []);

evaApp.controller("evaController", function ($scope) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 700 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;


        var randomX = d3.random.normal(width / 2, 100),
            randomY = d3.random.normal(height / 2, 100),
            points = d3.range(2000).map(function () {
                return [randomX(), randomY()];
            });




    $scope.data = points;


    var dataGen = function () {

        points.forEach(function(d,index,points){
            points[index]=[d[0]+0.5,d[1]+0.5];
        });
        return points;
    }


    var color = d3.scale.linear()
        .domain([0, 15])
        .range(["white", "red"])
        .interpolate(d3.interpolateLab);

    var hexbin = d3.hexbin()
        .size([width, height])
        .radius(15);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("class", "mesh")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll(".hexagon")
        .data(hexbin($scope.data))
        .enter().append("path")
        .attr("class", "hexagon")
        .attr("d", hexbin.hexagon())
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .style("fill", function (d) {
            return color(d.length);
        });

     var x = 200;
    var timer = setInterval(function () {
        if(x>2){
            x=x-2;
        svg.selectAll(".hexagon")
            .data(hexbin(dataGen()))
            .transition(2000)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).style("fill", function (d) {
                return color(d.length);
            });
        }        else{
            clearInterval(timer);

        }
    }, 2000);

});





