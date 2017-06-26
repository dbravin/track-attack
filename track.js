function track(){

	function main(){
		var data = d3.csv('adria_cleaned.csv', draw)
	}
	function draw(data){
		var svg = d3.select('svg#track')
		var x = d3.extent(data, function(e){
			return e.LAT
		})
		var y = d3.extent(data, function(e){
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
			.attr('transform', 'translate(0,0) scale(1)')
			.append('path')
			.attr('d', line(data))
			.style('stroke', '#000')
			.style('fill', 'none')

	}
	return {
		main: main
	}
}