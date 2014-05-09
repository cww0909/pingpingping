var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//var tracker = analytics.getService("pingpingping").getTracker("UA-50661920-1");

//TODO: look into d3.time.forat.multi x axis tick labels

var x = d3.time.scale()
    .range([width, 0]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%H:%M:%S"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var area = d3.svg.area()
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.rtt); });

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var path = svg.append("path")
 	.attr("class", "area");

var chartX = svg.append("g")
	 .attr("class", "x axis")
	 .attr("transform", "translate(0," + height + ")"),
 chartXLabel = chartX.append("text");

var chartY = svg.append("g")
      .attr("class", "y axis"),
 chartYLabel = chartY.append("text");

var that = this;
var data=[],
    dataRange = 100,
    interval = 1000,
    timeout = 2000,
    inUse = false,
    intervalID;

//tracker.sendAppView('MainView');

$("#host_form").on("submit", function(event){
	var host = $("select").val();
	data = [];
	intervalID = setInterval(function(){
		ping(host);
		draw();	
	}, interval);
	event.preventDefault();
});

function draw(){	
	x.domain(d3.extent(data, function(d) { return d.time; }));
	y.domain([0, d3.max(data, function(d) { return d.rtt; })]);

	path.datum(data)
	 .attr("d", area);
	chartX.call(xAxis);
	chartXLabel.attr("y", 30)
     .attr("x", width/2)
     .style("text-anchor", "middle")
	 .text("Time");
	chartY.call(yAxis);
    chartYLabel.attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .text("Ping (ms)");
}

function ping(host){
	if(!inUse){
		inUse = true;
		this.start = Date.now();
		$.ajax({
			url: host,
			timeout: timeout
		})
		.done(successCallback)	
		.fail(failCallback)
		.always(alwaysCallback);			
	}

}

function successCallback(){
	var end = Date.now();
	data.push({
		time: end,
		rtt: end - that.start
	});
}

function failCallback(jqXHR, textStatus, e){
	var end = Date.now();
	data.push({
		time: end,
		rtt: timeout
	});
}

function alwaysCallback(){
	if(data.length >= dataRange) data.shift();	
	inUse = false;
}