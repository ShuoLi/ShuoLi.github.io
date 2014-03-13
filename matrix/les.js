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
var margin = {top: 80, right: 0, bottom: 10, left: 30},
    width = 800,
    height = 800;
var x = d3.scale.ordinal().rangeBands([0, width]),
    y = d3.scale.ordinal().rangeBands([0, height]),
    z = d3.scale.linear().domain([0, 256]).clamp(true),
    c = d3.scale.category10().domain(d3.range(10));


var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("video.json", function (miserables) {
    var matrix = [],
        xnodes = miserables.xnodes,
        ynodes = miserables.ynodes,
        n = xnodes.length;
    m = ynodes.length;



// Compute index per node.
//    nodes.forEach(function(node, i) {
//        node.index = i;
//        node.count = 0;
//        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
//    });

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
            return xnodes[i].name;
        });
    var column = svg.selectAll(".column")
        .data(ynodes)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function (d, j) {
            return "translate(" + y(j) + ")rotate(-90)";
        });

    column.append("text")
        .attr("x", 6)
        .attr("y", y.rangeBand()/2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function (d, j) {
            return ynodes[j].date;
        });


    function row(row) {

        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function (d) {
                return d.z;
            }))
            .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function (d) {
                return y(d.y);
            }).attr("y",function(d){
                return x(d.x)/ x.rangeBand();
            })
            .attr("width", y.rangeBand())
            .attr("height", x.rangeBand())
            .style("fill-opacity", function (d) {
                return 0.6;

            })
            .style("fill", function (d) {
                if(d.z==0) {
                    return "green"  ;
                }else if(d.z==1){
                    return "green" ;
                } else if(d.z==2){
                    return "green" ;
                }  else if(d.z==3){
                    return "red" ;
                }              else{
                    return "green";
                }

            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousedown",mousedown);
//             .on("mousemove", function() { if (!dragging){
//                 console.log("not dragging");
// return;
//             }
//              console.log("dragging: " + dragging); });




    }


    function mouseover(p) {
        d3.selectAll(".row text").classed("active", function (d, i) {
            return i == p.x;
        });
        d3.selectAll(".column text").classed("active", function (d, i) {
            return i == p.y;
        });

    }

    function mouseout() {
        d3.selectAll("text").classed("active", false);

    }
    var startX;
    var startY;
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


    // function mousedown(){
    //      var dragging = true;
    // }






});
d3.select('#change').on("mousedown",function(){
    d3.json("video2.json", function (miserables) {

        var matrix = [],
            xnodes = miserables.xnodes,
            ynodes = miserables.ynodes,
            n = xnodes.length;
        m = ynodes.length;



// Compute index per node.
//    nodes.forEach(function(node, i) {
//        node.index = i;
//        node.count = 0;
//        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
//    });

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
            .attr("x", function(d) { return x(d.y); })
            .attr("y",function(d){return y(d.x)/ x.rangeBand();});
        t.selectAll(".column")
            .delay(function(d, i) { return y(i) * 4; })
            .attr("transform", function(d, i) { return "translate(" + y(i) + ")rotate(-90)"; });

        t.selectAll(".cell")
            .style("fill", function (d) {
                if(d.z==0) {
                    return "yellow"  ;
                }else if(d.z==1){
                    return "yellow" ;
                } else if(d.z==2){
                    return "yellow" ;
                }  else if(d.z==3){
                    return "blue" ;
                }              else{
                    return "green";
                }

            })
    });
});

d3.select('#backward').on("mousedown",function(){
 var t = svg.transition().duration(800);
        t.selectAll(".row")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .selectAll(".cell")
            .delay(function(d) { return x(d.x) * 4; })
            .attr("x", function(d) { return x(d.y-10); });
        t.selectAll(".column")
            .delay(function(d, i) { return y(i) * 4; })
            .attr("transform", function(d, i) { return "translate(" + y(i) + ")rotate(-90)"; });

});


d3.select('#forward').on("mousedown",function(){
 var t = svg.transition().duration(800);
        t.selectAll(".row")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .selectAll(".cell")
            .delay(function(d) { return x(d.x) * 4; })
            .attr("x", function(d) { return x(d.y+10); });
        t.selectAll(".column")
            .delay(function(d, i) { return y(i) * 4; })
            .attr("transform", function(d, i) { return "translate(" + y(i) + ")rotate(-90)"; });
});
