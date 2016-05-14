# _*_ coding: utf-8 _*_
import json
import sys
reload(sys)
sys.setdefaultencoding("utf-8")


def converte_pergunta_1():
    # The structure of the CSV will be:
    # YEAR | CODE | ENTRANT | LEAVING
    SRC_FILENAME = 'pergunta1.json'

    with open(SRC_FILENAME, 'r') as fp:
        collected_data = json.loads(json.load(fp, encoding='utf-8'))

    csv_lines = []
    # Headers
    csv_lines.append('Year,Code,Leaving,Entrant\n')

    for year in collected_data:
        data_of_year = collected_data[year]
        for curso in data_of_year:
            leaving = data_of_year[curso][0]
            entrant = data_of_year[curso][1]

            csv_lines.append('{},{},{},{}\n'.format(year, curso, leaving, entrant))

    with open('pergunta1.csv', 'w+') as pfp:
       for line in csv_lines:
          pfp.write(line)

def converte_pergunta_45(p):
    SRC_FILENAME = 'pergunta{}.json'.format(p)

    with open(SRC_FILENAME, 'r') as fp:
        collected_data = json.loads(json.load(fp, encoding='utf-8'))

    csv_lines = []
    # Headers
    csv_lines.append('Curso,Entrantes,Graduandos\n')

    for curso in collected_data:
        entrando = collected_data[curso][0]
        saindo = collected_data[curso][1]

        csv_lines.append('{},{},{}\n'.format(curso, entrando, saindo))

    with open('pergunta{}.csv'.format(p), 'w+') as pfp:
       for line in csv_lines:
          pfp.write(line)

if __name__ == '__main__':
    # converte_pergunta_2()
    converte_pergunta_45(p=5)

