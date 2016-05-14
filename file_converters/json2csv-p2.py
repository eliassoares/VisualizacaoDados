import json

# The structure of the CSV will be:
# YEAR | CODE | ENTRANT | LEAVING

def main():
    SRC_FILENAME = 'pergunta2.json'

    with open(SRC_FILENAME, 'r') as fp:
        collected_data = json.loads(json.load(fp, encoding='utf-8'))

    csv_lines = []
    # Headers
    csv_lines.append('Universidade, Ingressantes, Concluintes\n')

    for universidade in collected_data:
        data = collected_data[universidade]
        ingressantes = data[0]
        concluintes = data[1]
        # print universidade, ingressantes, concluintes
        csv_lines.append('{},{},{}\n'.format(universidade, ingressantes, concluintes))

    with open('pergunta2.csv', 'w+') as pfp:
       for line in csv_lines:
          pfp.write(line)

if __name__ == '__main__':
    main()
