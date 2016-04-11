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


if __name__ == '__main__':
	linkBase = 'http://en.dataviva.info'
	pesquisa = '/rais/2012/4mg.show.9/all/all/'

	dicionarioJson = retornaJson(linkBase + pesquisa)

	print dicionarioJson