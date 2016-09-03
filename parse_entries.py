from __future__ import print_function

import os
import glob
import json

import yaml

CATEGORIES = ['web_services', 'codes', 'data', 'facilities']

TITLE = {}
TITLE['facilities'] = "Observatories and Facilities"
TITLE['web_services'] = "Online/Web Services"
TITLE['codes'] = "Codes and Software"
TITLE['data'] = "Datasets"

database = []

for category in CATEGORIES:

    category_database = {}
    category_database['short'] = category
    category_database['title'] = TITLE[category]
    category_database['content'] = {}

    for entry in glob.glob(os.path.join('entries', category, '*.yaml')):
        print("Parsing {0}...".format(entry))
        with open(entry) as infile:
            content = yaml.load(infile)
        short = os.path.splitext(os.path.basename(entry))[0]
        category_database['content'][short] = {}
        for key in content:
            if content[key] is not None:
                category_database['content'][short][key] = content[key]
            else:
                if key == 'text':
                    raise ValueError("text field should not be empty: {0}".format(entry))

    database.append(category_database)

with open('database.json', 'w') as outfile:
    json.dump(database, outfile, sort_keys=True, indent=4,
              separators=(',', ': '))
