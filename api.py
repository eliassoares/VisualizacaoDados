#11/04/16
import requests
import json

def retornaJson(link):
	conexoes = 0
	while conexoes < 100:
		try:
			req = requests.get(link)
			return json.loads(req.content)
		except:
			print "Erro na conexao:",link

		conexoes += 1
	return None

#Para cada ano, pega a quantidade de alunos que entraram na faculdade
# e a quantidade que formaram para cada regiao.
def pegaAnoRegiao():
	#descricao da URL:
	#http://en.dataviva.info/hedu/identificacao_ano/identificacao_regiao/identificacao_universidade/show/
	#Colocando 'all' no lugar dos identificadores, voce pega todos os identificadores.
	linkBase = 'http://en.dataviva.info'

	dicionarioAnoRegiao = {}
	for regiao in range(1,6):
		pesquisa = '/hedu/all/' + str(regiao) + '/all/show/'

		#"headers": ["enrolled", "graduates", "entrants", "morning", "afternoon", "night", "full_time", "age", "graduates_growth", "enrolled_growth", "year", "bra_id", "course_hedu_id"]
		respostaJson = retornaJson(linkBase + pesquisa)
		for i in respostaJson['data']:
			ano = int(i[10])
			entrants = i[2]
			graduates = i[1]
			dicionarioAnoRegiao.setdefault(ano, {}).setdefault(regiao, [0, 0])
			dicionarioAnoRegiao[ano][regiao][0] += graduates
			dicionarioAnoRegiao[ano][regiao][1] += entrants
		
			


	return dicionarioAnoRegiao

if __name__ == '__main__':

	d = pegaAnoRegiao()
	j = json.dumps(d, ensure_ascii=False)
	
	with open('pergunta1.json', 'wb') as file:
		json.dump(j, file)

	'''for i in d:
		print 'Ano:', str(i)
		for j in d[i]:
			print '\tRegiao:',j
			print '\t\tGraduados:',d[i][j][0],'\n\t\tEntraram:',d[i][j][1], '\n\t\tEntrou - Saiu:',d[i][j][1]-d[i][j][0]
			'''
	print j
