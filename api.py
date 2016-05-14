#!/usr/bin/env python
# *-* coding: utf-8 *-*

#11/04/16
#coding
import requests
import json
linkBase = 'http://en.dataviva.info'


def retornaJson(link):
	conexoes = 0
	while conexoes < 100:
		try:
			req = requests.get(link)
			return json.loads(req.content)
		except:
			print conexao,"Erro na conexao:",link

		conexoes += 1
	return None

#Quantidade de pessoas que entraram e formaram por ano/:
def pergunta1():
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
	
	js = json.dumps(dicionarioAnoRegiao, ensure_ascii=False)
	with open('pergunta1.json', 'wb') as file:
		json.dump(js, file)

#As 10 faculdades com menor proporcao entraram/sairam
#As 10 faculdades com maior proporcao entraram/sairam
def pergunta2_3():
	universidades = {}
	proporcoes = {}
	with open('attrs_university.csv', 'rb') as u:
		for un in u:
			aux0 = un.split(',')
			idUniversidade = aux0[0].strip('\"')
			nome = aux0[1].strip('\"')
			universidades.setdefault(idUniversidade, [])
			universidades[idUniversidade] = [nome, 0, 0]
			proporcoes[idUniversidade] = 0.

	for idUniversidade in universidades:
		pesquisa = '/hedu/all/all/'+ idUniversidade + '/show/'
		respostaJson = retornaJson(linkBase + pesquisa)
		print universidades[idUniversidade][0]
		for i in respostaJson['data']:
			entrants = int(i[2])
			graduates = int(i[1])
			universidades[idUniversidade][1] += entrants
			universidades[idUniversidade][2] += graduates
			try:
				proporcoes[idUniversidade] += float(entrants) / graduates
			except ZeroDivisionError:
				pass
	p = sorted(proporcoes.items(), key=lambda x: x[1])
	
	#pergunta 2
	#procurando o primeiro onde a proporcao e diferente de zero
	aux0 = []
	for i in p:
		if (i[1] != 0.0):
			aux0.append(i[0])
		if(len(aux0) == 10):
			break

	aux1 = {}
	for i in aux0:
		aux1[universidades[i][0]] = [universidades[i][1], universidades[i][2]]

	with open('pergunta2.json', 'wb') as file:
		js = json.dumps(aux1, ensure_ascii=False)
		json.dump(js, file)
	
	aux1 = {}
	for i in p[-10:]:
		aux1[universidades[i[0]][0]] = [universidades[i[0]][1], universidades[i[0]][2]]
	
	with open('pergunta3.json', 'wb') as file:
		js = json.dumps(aux1, ensure_ascii=False)
		json.dump(js, file)

#As 10 cursos com menor proporcao entraram/sairam
#As 10 cursos com maior proporcao entraram/sairam
def pergunta4_5():
	dicionarioCursos = {}
	proporcoes = {}
	with open('attrs_course_hedu.csv', 'rb') as cursos:
		for curso in cursos:
			aux1 = curso.split(',')
			idCurso = aux1[0].strip('\"')
			nome = aux1[4].strip('\"')
			dicionarioCursos.setdefault(idCurso, [])
			dicionarioCursos[idCurso] = [nome, 0, 0]
			proporcoes[idCurso] = 0.
	
	for regiao in range(1,6):
		pesquisa = '/hedu/all/' + str(regiao) + '/all/show/'

		respostaJson = retornaJson(linkBase + pesquisa)
		for i in respostaJson['data']:
			idCurso = i[12]
			entrants = int(i[2])
			graduates = int(i[1])
			dicionarioCursos[idCurso][1] += entrants
			dicionarioCursos[idCurso][2] += graduates
			try:
				proporcoes[idCurso] += float(entrants)/graduates
			except ZeroDivisionError:
				pass

	p = sorted(proporcoes.items(), key=lambda x: x[1])

	#pergunta 4:
	aux1 = {}
	#da posicao 0 a 287 sao zeros:
	for i in p[288:298]:
		aux1[dicionarioCursos[i[0]][0]] = [dicionarioCursos[i[0]][1], dicionarioCursos[i[0]][2]]

	with open('pergunta4.json', 'wb') as file:
		js = json.dumps(aux1, ensure_ascii=False)
		json.dump(js, file)

	#pergunta 5:
	aux1 = {}
	for i in p[-10:]:
		aux1[dicionarioCursos[i[0]][0]] = [dicionarioCursos[i[0]][1], dicionarioCursos[i[0]][2]]

	with open('pergunta5.json', 'wb') as file:
		js = json.dumps(aux1, ensure_ascii=False)
		json.dump(js, file)

			
#Quantidade de formandos e empregadas em computacao por ano
def pergunta6():
	pass

if __name__ == '__main__':
	pergunta4_5()
	pergunta2_3()
