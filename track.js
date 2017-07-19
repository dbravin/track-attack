function track(){

	function main(){
		d3.text('N45_04E012_15_ADRIA.TRK', function (d){
			var dd = d.split(';')
			var fl = [dd[0].slice(3), dd[1]]
		var data = d3.csv('adria_cleaned.csv', function(d){draw(d, gen_lines(d), fl)})
		})
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
			.slice(0, 10000) //TODO remove this develop only
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

	function draw(points, lines, finish_line){
		var from = new Date()
		var tooltip = d3.select("body")
			.append("div")
			.attr('class', 'tooltip')
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
		tooltip
			.append('div')
			.attr('class', 'speed')
		tooltip
			.append('div')
			.attr('class', 'accelaration')
		tooltip
			.append('div')
			.attr('class', 'coords')
		tooltip
			.append('div')
			.attr('class', 'time')
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

		g
		.append('circle')
		.attr('cx',function(e){return scale_x(finish_line[0])})
		.attr('cy',function(e){return scale_y(finish_line[1])})
		.attr('r',25)
		.style('stroke', 'black')
		g.selectAll('line.path')
		.data(lines)
		.enter()
		.append('line')
		.attr('class', 'path')
		.attr('x1',function(e){return scale_x(e.old.LAT)})
		.attr('y1',function(e){return scale_y(e.old.LON)})
		.attr('x2',function(e){return scale_x(e.LAT)})
		.attr('y2',function(e){return scale_y(e.LON)})
		.style('stroke', '#000')
		.style('stroke-width', '0.5')


		g.selectAll('line.border')
		.data(lines)
		.enter()
		.append('line')
		.attr('class', 'border')
		.attr('x1',function(e){return scale_x(e.old.LAT)})
		.attr('y1',function(e){return scale_y(e.old.LON)})
		.attr('x2',function(e){return scale_x(e.LAT)})
		.attr('y2',function(e){return scale_y(e.LON)})
		.style('stroke', 'red')
	    .style('stroke-opacity', 0)
	    .style('stroke-width', 5)
	    .style('stroke-linecap', 'round')
		.on("mouseover", function(data){
			tooltip
			.select('div.speed')
			.text('speed: ' + data["SPEED GPS"])
			tooltip.select('div.accelaration')
			.text('acc x: ' + data["ACC(X)"]+ ', acc y: '+ data["ACC(Y)"]+' acc z: ' + data["ACC(Z)"])
			tooltip.select('div.coords')
			.text('coords: ' + data['LAT'] + ' ' + data['LON'])
			tooltip.select('div.time')
			.text('time: ' + data['TIME'])
			tooltip.style("visibility", "visible");
		})
		.on("mousemove", function(data){ tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
		.on("mouseout", function(data){ tooltip.style("visibility", "hidden");});


		var zoom = d3.zoom()
		.scaleExtent([1, 10])
		// .translateExtent([[-100, -100], [700 + 90, 400 + 100]])
		.on("zoom", zoomed);
		svg.call(zoom);

		function zoomed() {
		  g.attr("transform", d3.event.transform);
		}
		function resetted() {
 			svg.transition()
		      .duration(750)
		      .call(zoom.transform, d3.zoomIdentity);
		}
		var to=new Date()
		console.log("duration" + (to.getTime()-from.getTime()))
		// setTimeout(resetted, 5000)
	}
	return {
		main: main
	}
}