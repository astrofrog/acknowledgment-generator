import os
import glob
import json

CATEGORIES = ['facilities', 'web_services', 'codes']

TITLE = {}
TITLE['facilities'] = "Observatories and Facilities"
TITLE['web_services'] = "Online/Web Services"
TITLE['codes'] = "Codes and Software"


def parse_simple_yaml(filename):
    content = {}
    for line in open(filename):
        try:
            key, value = line.strip().split(':', 1)
        except ValueError:
            break
        if len(value) == 0:
            continue
        content[key.strip()] = value.strip()
    return content

database = []

for category in CATEGORIES:

    category_database = {}
    category_database['short'] = category
    category_database['title'] = TITLE[category]
    category_database['content'] = {}

    for entry in glob.glob(os.path.join('entries', category, '*.yaml')):
        content = parse_simple_yaml(entry)
        short = os.path.splitext(os.path.basename(entry))[0]
        category_database['content'][short] = content

    database.append(category_database)

with open('database.json', 'w') as outfile:
    json.dump(database, outfile, sort_keys=True, indent=4,
              separators=(',', ': '))
