var data;
$.getJSON("dados/empregos_graduados_computacao_ano.json", function(json){
    data = json;
});

console.log(data)

$(document).ready(function(){
	$(data).each(function(index, element){
		$('#pergunta1_data').append('<tr><td class="text-center"> '+element['ano']+' </td> <td class="text-center">'+element['entrantes']+' </td> <td class="text-center">'+element['graduados']+' </td> <td class="text-center">'+element['num_total_jobs']+' </td></tr>');
    })
});    
    
    