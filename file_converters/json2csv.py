import json

# The structure of the CSV will be:
# YEAR | CODE | ENTRANT | LEAVING

def main():
    SRC_FILENAME = 'pergunta1.json'

    with open(SRC_FILENAME, 'r') as fp:
        collected_data = json.loads(json.load(fp, encoding='utf-8'))

    csv_lines = []
    # Headers
    csv_lines.append('Year,Code,Leaving,Entrant\n')

    for year in collected_data:
        data_of_year = collected_data[year]
        for code in data_of_year:
            leaving = data_of_year[code][0]
            entrant = data_of_year[code][1]

            csv_lines.append('{},{},{},{}\n'.format(year, code, leaving, entrant))

    with open('pergunta1.csv', 'w+') as pfp:
       for line in csv_lines:
          pfp.write(line)

if __name__ == '__main__':
    main()

