#11/04/16
import requests
import json

linkBase = 'http://en.dataviva.info'

pesquisa = '/rais/2012/4mg.show.9/all/all/'

requisicao = requests.get(linkBase + pesquisa)
dicionarioJson = json.loads(requisicao.content)

print dicionarioJson