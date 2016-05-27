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

  // Convert to a table
  let ingressantes = new Object();
  let concluintes = new Object();

  for(let inst in institutionData) {
    ingressantes[inst] = institutionData[inst][0];
    concluintes[inst] = institutionData[inst][1];
  }

  x.domain([0, d3.max(institutionData, function(d) {return d.value;})]);
  svgContainer.attr("height", barHeight * Object.keys(institutionData).length);

  let bars = svgContainer.selectAll("g")
              .data(ingressantes)
              .enter()
              .append("g");

  bars.append("rect")
    .attr("x", function(d) {return x(d.value); })
    .attr("height", barHeight - 1);

  bars.append("text")
    .attr("x", function(d) {return x(d.value) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) {return d.value;});

  // Exemplo de JSON com círculos
  var jsonCircles = [
    { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
    { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
    { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}];

  var circles = svgContainer.selectAll("circle")
                            .data(jsonCircles)
                            .enter()
                            .append("circle");

  var circleAttributes = circles
                           .attr("cx", function (d) { return d.x_axis; })
                           .attr("cy", function (d) { return d.y_axis; })
                           .attr("r", function (d) { return d.radius; })
                           .style("fill", function(d) { return d.color; });
});
}());

