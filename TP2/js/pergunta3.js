"use strict";
(function() {
var width = 400;
var barHeight = 20;
var x = d3.scale.linear()
  .range([0, width]);
var svgContainer = d3.select("#chartPergunta3")
  .attr("width", width);

d3.json("dados/pergunta3.json", function(error, data){
  /* Os dados são obtidos como uma string. Este método JSON.parse
     os transforma em um objeto Javascript normal, que podemos
     utilizar como chave/valor, o que é bem natural para quem já
     programa em Python.
     */
  let institutionData = JSON.parse(data);

  // Converte dados para uma tabela
  let instNames = new Array();
  let ingressantes = new Array();
  let concluintes = new Array();

  for(let inst in institutionData) {
    instNames.push(inst);
    ingressantes.push(institutionData[inst][0]);
    concluintes.push(institutionData[inst][1]);
  }

  x.domain([0, d3.max(ingressantes)])
   .range([0, width]);

  svgContainer.attr("height", barHeight * instNames.length);

  let bar = svgContainer.selectAll("g")
              .data(ingressantes)
              .enter()
              .append("g")
              .attr("transform", function(d, i) {return "translate(20," + i * barHeight + ")";});

  bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

  bar.append("text")
    .attr("x", function(d) {return x(d);})
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) {return d;});

  svgContainer.append("text")
      .attr("y", barHeight / 2)
      .attr("dy", ".55em")
      .attr("transform", "translate(150,200)")
      .text('Batatinha quando nasce');

  svgContainer.append("text")
      .attr("transform", "rotate(90)")
      .attr("dy", "-.15em")
      .attr("dx", "1.75em")
      .text('Se esparrama pelo chão');

});
}());

