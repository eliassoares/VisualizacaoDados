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

  // Carga de dados
  d3.json("dados/empregos_graduados_computacao_ano.json", function(error, data) {
    if (error) {
      throw error;
    }

    let dadosColetados = d3.keys(data[0]);

    /* Por algum motivo, este código cria um atributo dentro de cada objeto em data...
     * QUE É UM ARRAY CONTENDO OS ATRIBUTOS DO OBJETO!!!
     * Ele deve usar isso para ordenar, porque senão é insanidade.
     */
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

    y.domain([0, d3.max(data, function(d) {
      return d3.max(d.arrayDados, function(d) {
        return d.value;
      });
    })]);

    // Dados para as linhas
    var linhaEntrantes = d3.svg.line()
      .x(function(d) {return x(d.ano); })
      .y(function(d) {return y(d.graduados); });

    // << Definir segunda linha aqui >>

    // 

    });
});

