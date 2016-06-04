"use strict";

$(document).ready(function() {
  let margin = {
    top : 20,
    right : 20,
    bottom : 30,
    left : 40
  };

  let width = 360;
  let height = 190;

  let x = d3.time.scale().range([0, width]);
  let y = d3.scale.linear().range([height, 0]);
  let color = d3.scale.ordinal().range(["#6699ff", "#1a66ff"]);
  let xAxis = d3.svg.axis().scale(x).orient("bottom");
  let yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
  let svg = d3.select("#chartEmpregadosGraduadosAno");

  // Carga de dados
  d3.json("dados/empregos_graduados_computacao_ano.json", function(error, data) {
    if (error) {
      throw error;
    }

    let dadosColetados = d3.keys(data[0]);

    data.forEach(function(d) {
      d.arrayDados = dadosColetados.map(function(name) {
        return {
          name : name,
          value : +d[name]
        };
      });
    });

    x.domain(d3.extent(data, function(d) {
      return d.ano;
    }));

    y.domain(d3.extent(data, function(d) {
      return d.value;
    }));

    // Dados para as linhas
    let linhaEntrantes = d3.svg.line()
      .x(function(d) {return x(d.ano); })
      .y(function(d) {return d.graduados; });

    // Eixo x
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Eixo y
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Graduandos");

    // Linha
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", linhaEntrantes);

  }); // Fim d3.json
}); // Fim $(document).ready()

