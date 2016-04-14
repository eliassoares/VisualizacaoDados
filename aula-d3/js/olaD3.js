/**
 * Data preprocessing 
 */
d3.csv("data/dados_educacao.csv", function(error, data) {
  data.forEach(function(d) {
    console.log(d);
    // Gentleman typecast
    // d.matriculas = parseInt(d.matriculas);
    // Typecast safado
    d.matriculas = +d.matriculas;
    console.log(d);
  });
});
