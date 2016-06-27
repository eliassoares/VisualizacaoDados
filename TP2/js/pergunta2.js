$( document ).ready(function() {

    var margin = {
            top : 20,
            right : 20,
            bottom : 30,
            left : 40
        },
        width = 440 - margin.left - margin.right,
        height = 240 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.ordinal().range(["#ee6913","#1a66ff"]);

    var xAxis = d3.svg.axis().scale(x0).orient("bottom").tickFormat("").ticks(false); // acrescentei o ticks com falso na gambiarra para retirar os rotulos das legendas no eixo x

    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

    var svg = d3.select("#pergunta2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var valor_barra = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d)
        {
            // console.log(d);
            return "<h5>"+ d.faculdade+"</h5>Quantidade: <span class='tip-value'>" + d.value + "</span>";
        });

    svg.call(valor_barra);   // call chama funcao e instanciar d3.tip

    d3.csv("dados/pergunta2.csv", function(error, data) {
        if (error)
            throw error;

        var alunos = d3.keys(data[0]).filter(function(key) {
            return key !== "Faculdade";
        });

        data.forEach(function(d) {
            d.dados = alunos.map(function(name) {
                return {
                    name : name,
                    value : +d[name],
                    faculdade: d["Faculdade"]   // acrescentei faculadade para ter a faculdade em dados para jogar para o tip
                };
            });

        });

        x0.domain(data.map(function(d) {
            return d.Faculdade;
        }));
        x1.domain(alunos).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) {
            return d3.max(d.dados, function(d) {
                return d.value;
            });
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append('text')
            .attr("text-anchor", "middle")
            .attr("transform", "translate(180," + 220 + ")")
            .text("universities");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis).append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".76em")
            .style("text-anchor", "end")
            .text("students");

        var year = svg.selectAll(".year")
            .data(data).enter()
            .append("g")
            .attr("class", "year")
            .attr("transform", function(d) {
                return "translate(" + x0(d.Faculdade) + ",0)";
            });

        year.selectAll("rect")
            .data(function(d) {
                return d.dados;})
            .enter()
            .append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) {
                return x1(d.name);
            }).attr("y", function(d) {
            return y(d.value);
        }).attr("height", function(d) {
            return height - y(d.value);
        }).style("fill", function(d) {
            return color(d.name);
        })

            .on("mouseover",function(d) {
                //        		destacar_barra(d);
                valor_barra.show(d);
            })
            .on("mouseout",function(d) {
                //        		sair_mouse();
                valor_barra.hide();
            });

        var legend = svg.selectAll(".legend")
            .data(alunos.slice()
                .reverse())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                console.log("translate(0," + i * 20 + ")");
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 810)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

         legend.append("text")
            .attr("x", width - 19)
            .attr("y", 9)
            .style("text-anchor", "end")
            .style("fill", color)
            .text(function(d) {
                //  alert(d);
                //console.log(d);
                return d;
            });

    });


}); // fim on ready



