function track(){

	function main(){
		var data = d3.csv('adria_cleaned.csv', function(d){draw(d, gen_lines(d))})
		//var points = [{LAT: 10, LON: 10}, {LAT: 15, LON: 15}, {LAT: 25, LON: 15}]
		// draw(points, gen_lines(points))

	}
	function gen_lines(dots){
		// var headers = headers =["TIME", "LAT", "LON", "GPS", "DIR", "GEAR", "ACC(X)", "ACC(Y)", "ACC(Z)", "BAT", "POWER", "SPEED1", "SPEED2", "AN1", "AN2", "AN3", "AN4", "AN5", "AN6", "AN7", "AN8", "SPEED GPS", "RPM", "TEMP"]
		var filtered_headers =["TIME", "LAT", "LON", "GPS", "DIR", "ACC(X)", "ACC(Y)", "ACC(Z)", "SPEED GPS"]
		function clone(e){
		    var k = Object.keys(e)
			return k.reduce(function(acc, v){acc[v] =e[v];return acc;},{})
		}
		function remove_useless_header(e){
		    var k = filtered_headers
			return k.reduce(function(acc, v){acc[v] =e[v];return acc;},{})
		}
		return dots
			.map(remove_useless_header)
			.reduce(function(acc, v, i){
			var res = clone(v);
			if(i===0){
				res['old'] = null;
			}else {
				var c = clone(acc[i-1]);
				delete c.old;
				res['old'] = c;
			}
			acc.push(res);
			return acc;
		}, [])
		.filter(function(e){return e.old})
	}

	function draw(points, lines){
		var from = new Date()
		var tooltip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.text("a simple tooltip");
		var svg = d3.select('svg#track')
		var x = d3.extent(points, function(e){
			return e.LAT
		})
		var y = d3.extent(points, function(e){
			return e.LON
		})
		var scale_x = d3.scaleLinear()
		.domain(x)
		.range([0, 700])
		var scale_y = d3.scaleLinear()
		.domain(y)
		.range([0, 400])
		var line = d3.line()
		.x(function (e){return scale_x(e.LAT)})
		.y(function(e){return scale_y(e.LON)})
		var g = svg.append('g')
		.attr('transform', 'translate(10,10) scale(1)')
		
		// g.append('path')
		// 	.attr('d', line(data))
		// 	.style('stroke', '#000')
		// 	.style('fill', 'none')

		// g.selectAll('.point')
		// .data(points)
		// .enter()
		// .append('circle')
		// .attr('class', 'point')
		// .attr('r', 0)
		// .attr('cx', function(e){
		// 	return scale_x(e.LAT)
		// })
		// .attr('cy', function(e){return scale_y(e.LON)})

		g.selectAll('.lines')
		.data(lines)
		.enter()
		.append('line')
		.attr('x1',function(e){return scale_x(e.old.LAT)})
		.attr('y1',function(e){return scale_y(e.old.LON)})
		.attr('x2',function(e){return scale_x(e.LAT)})
		.attr('y2',function(e){return scale_y(e.LON)})
		.style('stroke', '#000')
		.style('stroke-width', '0.5')
		.on("mouseover", function(data){
			tooltip.text(data["SPEED GPS"])
			tooltip.style("visibility", "visible");
		})
		.on("mousemove", function(data){ tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
		.on("mouseout", function(data){ tooltip.style("visibility", "hidden");});

		var to=new Date()
		console.log("duration" + (to.getTime()-from.getTime()))
	}
	return {
		main: main
	}
}