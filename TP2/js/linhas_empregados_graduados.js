$( document ).ready(function() {
// definicao do posicionamento do grafico d;
var margin = {top: 20, right: 195, bottom: 30, left: 65},
    width = 560 - margin.left - margin.right,
    height = 380 - margin.top - margin.bottom;

// normalmente e %Y%M%D mas estou usando apenas ano;
var parseano = d3.time.format("%Y").parse;

// var x = d3.scale.ordinal() não deu certo com ordinal;
//     .range([1, width]);
// scala para o eixo x
var x = d3.time.scale()
      .range([0,width]);
// scalta para o eixo y - acho que y é sempre linear;
var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10(); // scala automatica do d3 para as linhas 

var xAxis = d3.svg.axis()  // para o eixo x;
    .scale(x)
    .orient("bottom")
    .ticks(5); // como se fosse a quantidade de objetos se fosse 12 seria os 12 meses;

var yAxis = d3.svg.axis()  // para o eixo y pega a scala e o posicionamento;
    .scale(y)
    .orient("left");

var line = d3.svg.line()    // é o que desenha a linha;
    .interpolate("basis")   // tipo de interpolacao;
    .x(function(d) { return x(d.ano); }) // retornar os pontos de x;
    .y(function(d) { return y(d.pessoas); }); // retornar os pontos de y;

var svg = d3.select("#chartEmpregadosGraduadosAno").append("svg")  // para onde vai no index.html,
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/* exemplo com csv que funciona

d3.csv("dados/entrantes_graduados.csv", function(error, data) {
  if (error)
  throw error;

var ageNames = d3.keys(data[0]).filter(function(key) {
  return key !== "year";
});
*/

d3.csv("./dados/graduados_empregados.csv", function(error, data){
  if(error)
  throw error;

 color.domain(d3.keys(data[0]).filter(function(key) { return key !== "ano"; })); // especifico para o grafico de linhas dominio de cores da var color;


  data.forEach(function(d) {      // for para transformar o ano e apresentar somente o ano - gambiarra transformando de 2009 - 2013 para plotar apenas isso;
    d.ano = parseano( d.ano.toString() );
  });

  var dados = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {ano: d.ano, pessoas: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.ano; })); // dominio de x
  y.domain([ // dominio de y
    d3.min(dados, function(c) { return d3.min(c.values, function(v) { return v.pessoas; }); }), // veio do exemplo que peguei fazia uma transformacao para temperatura eu tirei e ñão funcionou entao deixei assim
    d3.max(dados, function(c) { return d3.max(c.values, function(v) { return v.pessoas; }); })
  ]);

  svg.append("g")   // para pendurar no gráfico no eixo x do grafico;
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g") // para pendurar no grafico no eixo y do grafico;
      .attr("class", "y axis")
      .call(yAxis) 
      .append("text") // pendurar no grafico
      .attr("transform", "rotate(-90)") // para colocar a escrita  Estudantes ou Vagas na vertical 
      .attr("y", 4) // distancia para a escrita
      .attr("dy", ".71em") // deslocamento para a escrita
      .style("text-anchor", "end")
      .text("Estudantes ou Vagas");

  var grupodados = svg.selectAll(".grupodados")
      .data(dados)
    .enter().append("g")
      .attr("class", "grupodados");

  grupodados.append("path") // pendurar as linhas;
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  grupodados.append("text") // pendurar os nomes de cada linha;
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.ano) + "," + y(d.value.pessoas) + ")"; }) // o que vai ser escrito mais posicionamento
      .attr("x", 4) 
      .attr("y", function(d){  // para o posicionmamento do texto em y 
        if ( d.name === "diferenca_graduados_jobs") return 12; // gambiarra porque dois texto ficaram na mesma posicao no grafico
        else 0;          // se for legenda diferenca_graduandos vai retornar para a posicao y +12(valor que ficou bom) se nao é o fim da linha mesmo; 
                         // se nao é +0 e vai para fim da linha a legenda m         
      })
      .attr("dy", ".20em")
      .text(function(d) { return d.name; });
});

}); // fim on ready