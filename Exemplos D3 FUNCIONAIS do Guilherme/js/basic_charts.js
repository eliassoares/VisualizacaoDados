"strict"
//// VARIAVEIS GLOBAIS ////
var margin = {top:20,right:20,bottom:30,left:50};
var width = 960-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;

//////////////////////////////////////
//// PRÉ PROCESSAMENTO DOS DADOS ////
////////////////////////////////////

// TREE MAP
d3.json("data/protein.json", function(error, data) {

	mainTreeMap(data);
	
});

// STACKED BAR
d3.csv("data/estudantes.csv", function(error,data){
	
	var color = d3.scale.category10();
	
	/*var color = d3.scale.ordinal()
    	.range(["blue", "yellow", "red"]);*/
	
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Ano"; }));
	
	data.forEach(function(d) {
    	var y0 = 0;
    	d.cursos = color.domain().map(function(name) { 
    		return {name: name, y0: y0, y1: y0 += +d[name]}; 
    	});
    	d.total = d.cursos[d.cursos.length - 1].y1;
  	});
  	
  	mainEstudantes(data,color);
	
});

//BASIC CHARTS
d3.json("data/tweets.json", function(error, data){
	
	var dados = data.tweets;
	var formataData = d3.time.format("%m-%d-%Y");
	
	dados.forEach(function(d){
		d.timestamp = formataData.parse(d.timestamp);
	});
	
	var dadosAninhados = d3.nest()
		.key(function (d) {return d.timestamp.getFullYear();})
		.entries(dados); 

	//console.log(dadosAninhados);
	
	//pq eh assincrono neh
	main(dadosAninhados);
	
});

////////////////////////////////////
//// CRIAÇÃO DAS VISUALIZAÇÕES ////
//////////////////////////////////
function criaLineChart(dados, container) {
	//nao preciso de uma variavel, pois so sera usado uma vez, apenas para criar o container
	//var svg;
	
	d3.select(container)
		.append("svg")
		//.attr("width",800) nao precisa quando tem o valor responsivo
		//.attr("height",600)
		.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
		.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
}

function criaBarChart(dados, container) {
	//nao preciso de uma variavel, pois so sera usado uma vez, apenas para criar o container
	//var svg;
	
	var svg = d3.select(container)
		.append("svg")
		//.attr("width",800) nao precisa quando tem o valor responsivo
		//.attr("height",600)
		.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
		.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    	
    svg.selectAll("rect")
    	.data(dados)
    	.enter()
    	.append("rect");   		
}


////////////////////////////////////
//// DESENHO DAS VISUALIZAÇÕES ////
//////////////////////////////////
function desenhaLineChart(data, container){
	var x = d3.time.scale()
			.range([0,width])
			.domain(d3.extent(data, function(d) {
				//console.log(d.key);
				return new Date(d.key);
				
			}));
			
			
			
	teste = d3.min(data, function(d) {
				return d.values.length;
		});
		
		
		//console.log(teste);
			
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0, d3.max(data, function(d) {
				return +d.values.length;
			})]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(d3.time.year,1);
		
	var yAxis = d3.svg.axis()
		.scale(y)	
		.orient("left");
	
	var line = d3.svg.line()
			//eh legal mas nao eh bom :( deforma os dados
			//.interpolate("basis")
		.x(function(d){return x(new Date(d.key));}) //x representa o ano, pego pela var data
		.y(function(d){return y(d.values.length);}); // y representa o usuario
	
	var svg = d3.select(container)
		.select("svg g");
		
	svg.append("g")
		.attr("class", "x eixo")
		.attr("transform", "translate(0," + (height) + ")")
      	.call(xAxis);
      	
    svg.append("g")
		.attr("class", "y eixo")
		//.attr("transform", "translate(" + width + ", 0)")
      	.call(yAxis);
	
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
}

function desenhaBarChart(data, container){

	var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .1)
			.domain(data.map(function(d) { 
				return d.key; 
			}));
			
	//console.log(x.domain());
	
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0, d3.max(data, function(d) {
				return +d.values.length;
			})]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(10);
		
	var yAxis = d3.svg.axis()
		.scale(y)	
		.orient("left");
	
	var svg = d3.select(container)
		.select("svg g");
		
	svg.append("g")
		.attr("class", "x eixo")
		.attr("transform","translate(0,"+height+")")
		.call(xAxis);
		
	svg.append("g")
		.attr("class", "y eixo")
		.call(yAxis);
	
	svg.selectAll("rect")
		.attr("class","barra")
		.attr("x",function(d) { return x(d.key); })
		.attr("y",function(d) { return y(d.values.length); })
		.attr("width", x.rangeBand())
		.attr("height", function(d) { return height - y(d.values.length); });
}

function criaScatterplotChart(data,container){
	
	var svg = d3.select(container)
		.append("svg")
			.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
			.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + (margin.top+10) + ")");
    
    svg.selectAll("circle")
    	.data(data)
    	.enter()
    	.append("circle");
}

function desenhaScatterplotChart(data,container){
	
	//ordinal pq se trata dos anos, que sao dados discretos
	var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .1)
			.domain(data.map(function(d) { 
				return d.key; 
			}));
	
	//linear pq se trata de quantidade, que sao dados continuos
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0, d3.max(data, function(d) {
				//converte para inteiro a contangem dos valores no vetor
				//que representa a quantidade de tweets por ano
				return +d.values.length;
			})]);
		
	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
	
	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				//.ticks(10);
	
	var svg = d3.select(container).select("svg g");
		
	svg.append("g")
		.attr("class", "x eixo")
		.attr("transform","translate(0,"+height+")")
		.call(xAxis);
		
	svg.append("g")
		.attr("class", "y eixo")
		.call(yAxis);
		
	svg.selectAll("circle")
		.attr("class", "ponto")
		.attr("r", function(d) { return Math.sqrt(d.values.length / Math.PI)*10; })
		.attr("cx", function(d) { return x(d.key) + (x.rangeBand()/2); })
		.attr("cy", function(d) { return y(d.values.length) ; });		
		
		
}

function criaPieChart(data,container){
	
	var svg = d3.select(container)
		.append("svg")
			.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
			.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    		.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
    
    var pie = d3.layout.pie()
    	.sort(null)
    	.value(function(d) {return d.values.length; });
    	
    svg.selectAll("g")
    	.data(pie(data))
    	.enter()
    	.append("g");
}

function desenhaPieChart(data,container){
	
	var color = d3.scale.ordinal()
    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);	
	
	var radius = Math.min(width, height) / 2;
	
	var arc = d3.svg.arc()
		.outerRadius(radius-10)
		.innerRadius(0);
	
	var labelArc = d3.svg.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);
		
	var svg = d3.select(container).select("svg g");
	
	svg.selectAll("g")
		.attr("class", "fatia")
		.append("path")
			.attr("d", arc)
      		.style("fill", function(d) { return color(d.keys); });
	
	svg.selectAll("g")
	  .append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.key; })
      .style("fill","#fff");
	
	
	
}

function main(dados) {
	criaLineChart(dados,"#container-line-chart");
	desenhaLineChart(dados,"#container-line-chart");
	criaBarChart(dados,"#container-bar-chart");
	desenhaBarChart(dados,"#container-bar-chart");
	criaScatterplotChart(dados,"#container-scatterplot-chart");
	desenhaScatterplotChart(dados,"#container-scatterplot-chart");
	criaPieChart(dados,"#container-pie-chart");
	desenhaPieChart(dados,"#container-pie-chart");
	
} // Fim do método main

function criaStackedBarChart(data,color,container) {
	
	var svg = d3.select(container)
		.append("svg")	
			.attr("viewBox", "0 0 " + 
				(width + margin.left + margin.right) + " " + 
				(height + margin.top + margin.bottom))
			.attr("preserveAspectRatio","xMidYMid meet") // responsivo
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + (margin.top+10) + ")");
	
	svg.selectAll("g")
		.data(data)
		.enter()
		.append("g")
	
}

function desenhaStackedBarChart(data,color,container) {
	
	var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1)
				.domain(data.map(function(d){
					return d.Ano;
				}));
				
	var y = d3.scale.linear()
				.rangeRound([height, 0])
				.domain([0,d3.max(data,function(d) {
					return d.total;
				})]);
				
	var svg = d3.select(container)
		.select("svg g");
		
	svg.selectAll("g")
		.attr("transform", function(d) { return "translate(" + x(d.Ano) + ",0)"; })
		.selectAll("rect")
        	.data(function(d) { return d.cursos; })
	    		.enter().append("rect")
	      		.attr("width", x.rangeBand())
	      		.attr("y", function(d) { return y(d.y1); })
	      		.attr("height", function(d) { return y(d.y0) - y(d.y1); })
	      		.style("fill", function(d) { return color(d.name); });

}

function mainEstudantes(dados,cores) {
	
	criaStackedBarChart(dados,cores,"#container-stacked-bar-chart");
	desenhaStackedBarChart(dados,cores,"#container-stacked-bar-chart");
	
}

function criaTreeMapChart(data, container) {
	
	var div = d3.select(container)
		.append("div")
			.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
			.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
			.style("position", "relative")
	    	.style("width", (width + margin.left + margin.right) + "px")
	    	.style("height", (height + margin.top + margin.bottom) + "px")
	    	.style("left", margin.left + "px")
	    	.style("top", margin.top + "px");
}

function desenhaTreeMapChart(data, container) {
	
	var color = d3.scale.category20c();
	
	var treemap = d3.layout.treemap()
	    .size([width, height])
	    .sticky(true) // relacionado ao efeito de transição das divs
	    .value(function(d) { return d.size; });
	
	var div = d3.select(container).select("div");
	
	var node = div.datum(data).selectAll(".node")
	      .data(treemap.nodes)
	    .enter().append("div")
	      .attr("class", "node")
	      .call(position)
	      .style("background", function(d) { return d.children ? color(d.name) : null; })
	      .text(function(d) { return d.children ? null : d.name; });
	
	d3.selectAll("input").on("change", function change() {
	    var value = this.value === "count"
	        ? function() { return 1; }
	        : function(d) { return d.size; };
	
	    node.data(treemap.value(value).nodes)
	      .transition()
	      .duration(1500)
	      .call(position);
	  });
}

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

function mainTreeMap(dados) {

	criaTreeMapChart(dados,"#container-tree-map-chart");
	desenhaTreeMapChart(dados,"#container-tree-map-chart");
}

