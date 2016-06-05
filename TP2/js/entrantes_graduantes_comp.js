$(document)
    .ready(function() {
      var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
          },
          width = 360 - margin.left - margin.right,
          height = 190 - margin.top - margin.bottom;
      var x0 = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);
      var x1 = d3.scale.ordinal();
      var y = d3.scale.linear()
          .range([height, 0]);
      var color = d3.scale.ordinal()
          .range(["#6699ff", "#1a66ff"]);
      var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom");
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(d3.format(".2s"));
      var time = 1000,
          delay = function(d, i) {
            return i * 50;
          };
      var svg = d3.select("#container-entrantes-graduandos-chart")
          .append("svg")
          .attr("width", width +
              margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append(
              "g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var valor_barra = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d)  {  // console.log(d);

            return "<strong>Quant:</strong> <span style='color:red'>" + d.value + "</span>";
          });
      svg.call(valor_barra); // call chama funcao e instanciar d3.tip

      d3.csv("dados/entrantes_graduados.csv", function(error, data) {
        if (error)  throw error;
        var ageNames = d3.keys(data[0])
            .filter(function(key) {
              return key !== "year";
            });
        data.forEach(function(d) {
          d.ages = ageNames.map(function(name) {
            return {
              name: name,
              value: +d[name]
            };
          });
        });
        x0.domain(data.map(function(d) {
          return d.year;
        }));
        x1.domain(ageNames)
            .rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) {
          return d3.max(d.ages, function(d) {  // d.html(function(d){return d.html});

            return d.value;
          });
        })]);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height +
                ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr(
                "transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style(
                "text-anchor", "end")
            .text("students");
        var year = svg.selectAll(".year")
            .data(data)
            .enter()
            .append("g")
            .attr("class",
                "year")
            .attr("transform", function(d) {
              console.log(d.year, x0(d.year));
              return "translate(" + x0(d.year) + ",0)";
            });
        year.selectAll("rect")
            .data(function(d) {
              return d.ages;
            })
            .enter()
            .append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) {
              return x1(d.name);
            })
            .attr("y", function(d) {
              return y(d.value);
            })
            .attr("height", function(d) {
              return height - y(d.value);
            })
            .attr("NOME", function(d) {
              return d.name + ":" + d.value;
            })
            .style("fill", function(d) {
              return color(d.name);
            })
            .on("mouseover", function(d) {  //        		destacar_barra(d);

              valor_barra.show(d);
            })
            .on("mouseout", function(d) {  //        		sair_mouse();

              valor_barra.hide();
            });
        var legend = svg.selectAll(".legend")
            .data(ageNames.slice()
                .reverse())
            .enter()
            .append(
                "g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
              return "translate(0," + i * 20 + ")";
            });
        legend.append("rect")
            .attr("x", width - 810)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);
        legend.append("text")
            .attr("x", width - 719)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style(
                "text-anchor", "end")
            .text(function(d) {
              return d;
            });
        var ordenar = function ordenar(attribute, order) {
          return x0.domain(data.sort(function(a, b) {
            if (order === "asc")  return a[attribute] - b[attribute];
            else  return b[attribute] - a[attribute];
          })
              .map(function(d) {
                return d.year;
              }))
              .copy();
        };
        var resetarOrdem = function resetarOrdem() {
          return x0.domain(data.sort(function(a, b) {
            return a.year - b.year;
          })
              .map(function(d) {
                return d.year;
              }))
              .copy();
        };
        function change(attribute, order) {
          var transition = svg.transition()
              .duration(time)
              .delay(delay);
          var myx = ordenar(attribute, order);
          transition.selectAll('.year')
              .attr("asdf", function(d) {
                console.log(d.year, x0(d.year));
              });
          transition.selectAll('.x.axis')
              .call(xAxis);
          transition.selectAll('.year')
              .attr("transform", function(d) {
                return "translate(" + myx(d.year) + ",0)";
              });
        }
        $('[name="categoria"]')
            .click(function(e) {
              var categoria = $('[name="categoria"]:checked')
                  .val();
              var ordem = $('[name="ordem"]:checked');
              if (ordem === []) {
                ordem = "asc";
              } else {
                ordem = $('[name="ordem"]:checked')
                    .val();
              }
              change(categoria, ordem);
            });
        $('[name="ordem"]')
            .click(function(e) {
              var ordem = $('[name="ordem"]:checked')
                  .val();
              var categoria = $('[name="categoria"]:checked');
              if (categoria === []) {
                categoria = "entrants";
              }
              else {
                categoria = $('[name="categoria"]:checked')
                    .val();
              }
              change(categoria, ordem);
            });
        $("#reverter")
            .click(function(e) {
              var transition = svg.transition()
                  .duration(time)
                  .delay(delay);
              $('[name="categoria"]:checked')
                  .attr("checked", false);
              $('[name="ordem"]:checked')
                  .attr("checked", false);
              resetarOrdem();
              transition.selectAll('.x.axis')
                  .call(xAxis);
              transition.selectAll('.year')
                  .attr("transform", function(d) {
                    console.log(d.year, x0(d.year));
                    return "translate(" + x0(d.year) + ",0)"
                  });
            });
      });
    }); // fim on ready
    