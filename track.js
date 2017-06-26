function track(){

	function main(){
		var data = d3.csv('adria.csv', draw)
	}
	function draw(data){
		data = data.slice(23)
		console.log(data[0])
		d3.select('svg#track')
	}
	return {
		main: main
	}
}