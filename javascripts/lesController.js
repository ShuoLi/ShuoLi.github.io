/**
 * Created by sli on 10/31/13.
 */

function HashTable(obj) {
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function (key, value) {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function (key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function (key) {
        return this.items.hasOwnProperty(key);
    }

    this.removeItem = function (key) {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function () {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function () {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function (fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function () {
        this.items = {}
        this.length = 0;
    }
}


var videoModule = angular.module("videoModule", ['$strap.directives','mongolabResourceHttp','ngCookies','ngRoute']);

videoModule.constant('MONGOLAB_CONFIG', (function () {
    var protocol = 'http://'
    return {
        videoService: {API_KEY: 'zEDRommfBrs-_CwfE0v6bgz0-bHE76VF', DB_NAME: 'videoindexer'}
    }
})());

//try to use promise to prvide a service here
videoModule.factory('videoProject', function ($mongolabResourceHttp) {
    return $mongolabResourceHttp('data', 'videoService');
});


videoModule.value('$strapConfig', {
    datepicker: {
        format: 'M D, yyyy'
    }
});

videoModule.directive('ghVisualization', function () {

    var margin = {top: 80, right: 0, bottom: 10, left: 45},
        width = 800,
        height = 800;
    var x = d3.scale.ordinal().rangeBands([0, width]),
        y = d3.scale.ordinal().rangeBands([0, height]),
        z = d3.scale.linear().domain([0, 256]).clamp(true),
        c = d3.scale.category10().domain(d3.range(10));
    var areaChoose=false;

    d3.select('#areaOption').on("mousedown",function(){
        areaChoose=!areaChoose;
        console.log(areaChoose);
        if(areaChoose==true){
            d3.select(this).classed("btn-success", false);
            d3.select(this).classed("btn-warning", true);
        }else{
            d3.select(this).classed("btn-success", true);
            d3.select(this).classed("btn-warning", false);
        }

    })

    var startX;
    var startY;

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .attr("width", "60px")
        .attr("height", "28px")
        .style("margin-left", -15 + "px")
        .style("background","lightsteelblue")
        .style("border-radius","8px")
        .style("border","0px")
        .style("padding","2px")
        .style("font","12px sans-serif")
        .style("z-index", "10")
        .style("visibility", "hidden");

    return{
        restrict: 'EA',
        replace: true,
        transclude: false,
        scope: {val: '=val'},
        link: function (scope, element, attrs) {
            d3.select("svg")
                .remove();

            var svg = d3.select(element[0])
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("margin-left", -15 + "px")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            scope.$watch('val', function (miserables, oldVal) {
                console.log(miserables);
                if (oldVal==null && miserables!=null) {
                    var matrix = [],
                        xnodes = miserables.xnodes,
                        ynodes = miserables.ynodes,
                        n = xnodes.length;
                    m = ynodes.length;
                    // Compute index per node.
                    xnodes.forEach(function (xnode, i) {
                        xnode.index = i;
                    });

                    ynodes.forEach(function (ynode, j) {
                        ynode.index = j;
                    });
                    var i, j;
                    for (i = 0; i < n; i++) {
                        matrix[i] = new Array(m);
                        for (j = 0; j < m; j++) {
                            matrix[i][j] = {x: i, y: j, z: 3};
                        }
                    }

                    //Convert links to matrix; count character occurrences.
                    miserables.links.forEach(function (link) {
                        matrix[link.source][link.target].z = link.value;
                    });


                    // Precompute the orders.
                    var orders = {
                        name: d3.range(n).sort(function (a) {
                            return d3.ascending(xnodes[a].name);
                        }),
                        group: d3.range(m).sort(function (a) {
                            return d3.ascending(ynodes[a].date);
                        })
                    };
                    // The default sort order.
                    x.domain(orders.name);
                    y.domain(orders.group);
                    svg.append("rect")
                        .attr("class", "background")
                        .attr("width", width)
                        .attr("height", height);
                    var row = svg.selectAll(".row")
                        .data(matrix)
                        .enter().append("g")
                        .attr("class", "row")
                        .attr("transform", function (d, i) {
                            return "translate(0," + x(i) + ")";
                        })
                        .each(row);

                    row.append("text")
                        .attr("x", -6)
                        .attr("y", x.rangeBand() / 2)
                        .attr("dy", ".45em")
                        .attr("text-anchor", "end")
                        .text(function (d, i) {
                            return xnodes[i];
                        });
                    var column = svg.selectAll(".column")
                        .data(ynodes)
                        .enter().append("g")
                        .attr("class", "column")
                        .attr("transform", function (d, j) {
                            return "translate(" + y(j) + ")rotate(-90)";
                        });

//                    column.append("text")
//                        .attr("x", 6)
//                        .attr("y", y.rangeBand() / 2)
//                        .attr("dy", ".32em")
//                        .attr("text-anchor", "start")
//                        .text(function (d, j) {
//                            return ynodes[j];
//                        });


                    function row(row) {
                        var cell = d3.select(this).selectAll(".cell")
                            .data(row.filter(function (d) {
                                return d.z;
                            }))
                            .enter().append("rect")
                            .attr("class", "cell")
                            .attr("x",function (d) {
                                return y(d.y);
                            }).attr("y", function (d) {
                                return x(d.x) / x.rangeBand();
                            })
                            .attr("width", y.rangeBand())
                            .attr("height", x.rangeBand())
//                            .style("fill-opacity", function (d) {
//                                return 0.6;
//
//                            })
                            .style("fill", function (d) {
                                if(d.z==null){
                                    return 'black';
                                }
                                if (d.z == 0) {
                                    return "#1E90FF";
                                } else if (d.z == 1) {
                                    return "#1E90FF";
                                } else if (d.z == 2) {
                                    return "#1E90FF";
                                } else if (d.z == 3) {
                                    return "A52A2A";
                                } else {
                                    return "#1E90FF";
                                }

                            })
//                            .on("mouseover", mouseover)
                            .on("mouseout", mouseout)
                            .on("mousedown",mousedown);
                    }
                }else if(oldVal!=null && miserables!=null){
                    var matrix = [],
                        xnodes = miserables.xnodes,
                        ynodes = miserables.ynodes,
                        n = xnodes.length;
                    m = ynodes.length;

                    xnodes.forEach(function (xnode, i) {
                        xnode.index = i;
                    });

                    ynodes.forEach(function(ynode, j) {
                        ynode.index = j;
                    });


                    var i,j;
                    for(i =0;i<n;i++){
                        matrix[i]=new Array(m);
                        for(j=0 ;j<m;j++){
                            matrix[i][j] =  {x: i, y: j, z: 10};
                        }
                    }

//Convert links to matrix; count character occurrences.
                    miserables.links.forEach(function (link) {
                        matrix[link.source][link.target].z = link.value;
                    });


// Precompute the orders.
                    var orders = {
                        name: d3.range(n).sort(function (a) {
                            return d3.ascending(xnodes[a].name);
                        }),
                        group: d3.range(m).sort(function (a) {
                            return d3.ascending(ynodes[a].date);
                        })
                    };



// The default sort order.
                    x.domain(orders.name);
                    y.domain(orders.group);


                    var t = svg.transition().duration(800);
                    t.selectAll(".row")
                        .delay(function(d, i) { return x(i) * 4; })
                        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                        .selectAll(".cell")
                        .delay(function(d) { return x(d.x) * 4; })
                        .attr("x", function(d) { return y(d.y); })
                        .attr("y",function(d){return x(d.x)/ x.rangeBand();})
                        ;
                    t.selectAll(".column")
                        .delay(function(d, i) { return y(i) * 4; })
                        .attr("transform", function(d, i) { return "translate(" + y(i) + ")rotate(-90)"; })
                        ;

                    t.selectAll(".cell")
                        .style("fill", function (d) {
                            if(d.z==null){
                                return 'black';
                            }
                            if(d.z==0) {
                                return "#1E90FF"  ;
                            }else if(d.z==1){
                                return "#1E90FF" ;
                            } else if(d.z==2){
                                return "#1E90FF" ;
                            }  else if(d.z==3){
                                return "A52A2A" ;
                            }              else{
                                return "#1E90FF";
                            }

                        });
                }

                d3.selectAll(".cell")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("mousedown",mousedown);

                function mouseover(p) {
                    tooltip
                        .style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px")
                        .text(xnodes[p.x]+":"+ynodes[p.y]);
                    tooltip.style("visibility", "visible");
                    d3.selectAll(".row text").classed("active", function (d, i) {
                        return i == p.x;
                    });
                    d3.selectAll(".column text").classed("active", function (d, i) {
                        return i == p.y;
                    });
                }

                function mouseout() {
//                    tooltip.style("visibility", "hidden");
                    d3.selectAll("text").classed("active", false);
                }


                function mousedown(p){
                    d3.select(this).style("fill","black");
                    if(areaChoose==true){
                        if(!startX){
                            startX=p.x;
                            startY=p.y;
                        }else{
                            var t = svg.transition().duration(800);
                            t.selectAll(".cell")
                                .style('fill',function(d){
                                    // console.log(startX,startY,p.x,p.y,d.x,d.y);
                                    if(d.x>=startX&&d.y>=startY&&d.x<=p.x&&d.y<=p.y){
                                        console.log(d.x>startX&&d.y>startY);
                                        return 'black';
                                    }else{
                                        return d3.select(this).style('fill');
                                    }

                                });
                            startX=null;
                            startY=null;
                        }
                    }
                }
            });
        }
    }
});


videoModule.controller('videoController', ['$scope', 'videoProject','$location','$cookieStore', function ($scope, videoProject,$location, $cookieStore) {

    console.log("select cameras:");
    console.log( $cookieStore.get('select_cameras'));
    console.log( $cookieStore.get('target_store'));
    console.log( $cookieStore.get('target_date'));

    $scope.modDate = 2013+"-"+06 + "-" + 01;
    $scope.modDate2 = 2013+"-"+06 + "-" + 02;


    $('#control_button').click(function (e) {
        e.stopPropagation();
        $('#control_panel').toggle("fast");
    });

    $scope.datepicker = {date: new Date(),date2: new Date()};
    $scope.timepicker = {time: "00:00 AM",time2: "12:00AM"};

    $scope.$watch('datepicker.date', function(v){ // using the example model from the datepicker docs
        var d = new Date(v);
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        $scope.modDate = curr_year+"-"+curr_month + "-" + curr_date;
    })

    $scope.$watch('timepicker.time', function(newVal,oldVal){
        $scope.time_stampt1 = newVal;
    })

    $scope.$watch('timepicker.time2', function(newVal,oldVal){
        $scope.time_stampt2 = newVal;
    })

    $scope.$watch('datepicker.date2', function(v){ // using the example model from the datepicker docs
        var d = new Date(v);
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        $scope.modDate2 = curr_year+"-"+curr_month + "-" + curr_date;
    })


    //RANGE QUERY METHOD
    videoProject.query({created_date: {
            $gte: {
                $date: $scope.modDate + "T"+"00:00:00.0000Z"
            },
            $lt: {
                $date: $scope.modDate2 + "T"+"23:00:00.0000Z"
            }
        }, "host": "gte-6501-01"
        }, {limit: 800},
        function (data) {
            var x_node_hash = new HashTable();
            var y_node_hash = new HashTable();
            var x_node_array = new Array();
            var y_node_array = new Array();
            var link_array = new Array();
            var source_id, target_id;
            angular.forEach(data, function (d) {
                if (x_node_hash.hasItem(d.camname)) {
                    source_id = x_node_hash.getItem(d.camname);
                } else {
                    x_node_hash.setItem(d.camname, x_node_hash.length);
                }
                if (y_node_hash.hasItem(d.created_date.$date)) {
                    target_id = y_node_hash.getItem(d.created_date.$date);
                } else {
                    y_node_hash.setItem(d.created_date.$date, y_node_hash.length);
                }
                link_array.push({source: x_node_hash.getItem(d.camname),
                    target: y_node_hash.getItem(d.created_date.$date), value: !d.isDeleted});
            });
            $scope.jsonObj =
            {xnodes: x_node_hash.keys(), ynodes: y_node_hash.keys(), links: link_array}
               ;
        }
    )
    ;

    $scope.updateData = function(){
        videoProject.query({created_date: {
                $gte: {
                    $date: $scope.modDate + "T"+"00:00:00.0000Z"
                },
                $lt: {
                    $date: $scope.modDate2 + "T"+"23:00:00.0000Z"
                }
            }, "host": "gte-6501-01"
            }, {limit: 800},
            function (data) {
                var x_node_hash = new HashTable();
                var y_node_hash = new HashTable();
                var x_node_array = new Array();
                var y_node_array = new Array();
                var link_array = new Array();
                var source_id, target_id;
                angular.forEach(data, function (d) {
                    if (x_node_hash.hasItem(d.camname)) {
                        source_id = x_node_hash.getItem(d.camname);
                    } else {
                        x_node_hash.setItem(d.camname, x_node_hash.length);
                    }
                    if (y_node_hash.hasItem(d.created_date.$date)) {
                        target_id = y_node_hash.getItem(d.created_date.$date);
                    } else {
                        y_node_hash.setItem(d.created_date.$date, y_node_hash.length);
                    }
                    link_array.push({source: x_node_hash.getItem(d.camname),
                        target: y_node_hash.getItem(d.created_date.$date), value: !d.isDeleted});
                });
                $scope.jsonObj =
                {xnodes: x_node_hash.keys(), ynodes: y_node_hash.keys(), links: link_array}
                ;
            }
        )
        ;
    }

    $scope.forward = function(){

        var date = new Date();
        date.setFullYear($scope.modDate2.split("-")[0], +$scope.modDate2.split("-")[1]-1,$scope.modDate2.split("-")[2]);
        date.setTime(date.getTime()+86400000);
        var new_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        console.log(new_date);
        $scope.modDate=$scope.modDate2;
        $scope.modDate2=new_date;

        videoProject.query({created_date: {
                $gte: {
                    $date:$scope.modDate + "T"+"00:00:00.0000Z"
                },
                $lt: {
                    $date: $scope.modDate2 + "T"+"23:00:00.0000Z"
                }
            }, "host": "gte-6501-01"
            }, {limit: 800},
            function (data) {
                var x_node_hash = new HashTable();
                var y_node_hash = new HashTable();
                var x_node_array = new Array();
                var y_node_array = new Array();
                var link_array = new Array();
                var source_id, target_id;
                angular.forEach(data, function (d) {
                    if (x_node_hash.hasItem(d.camname)) {
                        source_id = x_node_hash.getItem(d.camname);
                    } else {
                        x_node_hash.setItem(d.camname, x_node_hash.length);
                    }
                    if (y_node_hash.hasItem(d.created_date.$date)) {
                        target_id = y_node_hash.getItem(d.created_date.$date);
                    } else {
                        y_node_hash.setItem(d.created_date.$date, y_node_hash.length);
                    }
                    link_array.push({source: x_node_hash.getItem(d.camname),
                        target: y_node_hash.getItem(d.created_date.$date), value: !d.isDeleted});
                });
                $scope.jsonObj =
                {xnodes: x_node_hash.keys(), ynodes: y_node_hash.keys(), links: link_array}
                ;
            }
        )
        ;
    }

    $scope.backward = function(){

        var date = new Date();
        date.setFullYear($scope.modDate2.split("-")[0], +$scope.modDate2.split("-")[1]-1,$scope.modDate2.split("-")[2] );
        date.setTime(date.getTime()-86400000);
        var new_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        console.log(new_date);
        $scope.modDate2=$scope.modDate;
        $scope.modDate=new_date;
        videoProject.query({created_date: {
                $gte: {
                    $date:$scope.modDate + "T"+"00:00:00.0000Z"
                },
                $lt: {
                    $date: $scope.modDate2 + "T"+"23:00:00.0000Z"
                }
            }, "host": "gte-6501-01"
            }, {limit: 800},
            function (data) {
                var x_node_hash = new HashTable();
                var y_node_hash = new HashTable();
                var x_node_array = new Array();
                var y_node_array = new Array();
                var link_array = new Array();
                var source_id, target_id;
                angular.forEach(data, function (d) {
                    if (x_node_hash.hasItem(d.camname)) {
                        source_id = x_node_hash.getItem(d.camname);
                    } else {
                        x_node_hash.setItem(d.camname, x_node_hash.length);
                    }
                    if (y_node_hash.hasItem(d.created_date.$date)) {
                        target_id = y_node_hash.getItem(d.created_date.$date);
                    } else {
                        y_node_hash.setItem(d.created_date.$date, y_node_hash.length);
                    }
                    link_array.push({source: x_node_hash.getItem(d.camname),
                        target: y_node_hash.getItem(d.created_date.$date), value: !d.isDeleted});
                });
                $scope.jsonObj =
                {xnodes: x_node_hash.keys(), ynodes: y_node_hash.keys(), links: link_array}
                ;

            }
        )
        ;
    }
}]);