"use strict";
(function() {
var width = 400;
var barHeight = 20;
var x = d3.scale.linear()
  .range([0, width]);
var chart = d3.select("#chartPergunta3")
  .attr("width", width);

d3.json("dados/pergunta3.json", function(error, data){
  /* Os dados são obtidos como uma string. Este método JSON.parse
     os transforma em um objeto Javascript normal, que podemos
     utilizar como chave/valor, o que é bem natural para quem já
     programa em Python.
     */
  let institutionData = JSON.parse(data);
  console.log(institutionData);

  x.domain([0, d3.max(institutionData, function(d) {return d.value;})]);
  chart.attr("height", barHeight * Object.keys(institutionData).length);
});
}());

