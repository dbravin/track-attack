function track(){

	function main(){
		var data = d3.csv('adria_cleaned.csv', function(d){draw(d, gen_lines(d))})
		var points = [{LAT: 10, LON: 10}, {LAT: 15, LON: 15}, {LAT: 25, LON: 15}] 
		// draw(points, gen_lines(points))

	}
	function gen_lines(dots){
		return dots.reduce(function(acc, v, i){
			acc.push(i===0 ? 
				{LAT: v.LAT, LON: v.LON, OLD_LAT: null, OLD_LON: null}
				:
				{LAT: v.LAT, LON: v.LON, OLD_LAT: acc[i-1].LAT, OLD_LON: acc[i-1].LON}
				)
			return acc
		}, [])
		.filter(function(e){return e.OLD_LAT})
		.map(function(e){
			return {x1: e.OLD_LAT, x2: e.LAT, y1: e.OLD_LON, y2: e.LON}
		})
	}

	function draw(points, lines){
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
		g.selectAll('.point')
		.data(points)
		.enter()
		.append('circle')
		.attr('class', 'point')
		.attr('r', 0)
		.attr('cx', function(e){
			return scale_x(e.LAT)
		})
		.attr('cy', function(e){return scale_y(e.LON)})

		g.selectAll('.lines')
		.data(lines)
		.enter()
		.append('line')
		.attr('x1',function(e){return scale_x(e.x1)})
		.attr('y1',function(e){return scale_y(e.y1)})
		.attr('x2',function(e){return scale_x(e.x2)})
		.attr('y2',function(e){return scale_y(e.y2)})
		.style('stroke', '#000')
		.style('stroke-width', '0.5')
		// .on('click', function(target){
		// 	console.log(arguments)
		// })
		.on('mouseover', function(target){
			console.log('in',arguments)
		})
		.on('mouseout', function(target){
			console.log('out',arguments)
		})

	}
	return {
		main: main
	}
}