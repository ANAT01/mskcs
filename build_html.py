from jinja2 import Environment, FileSystemLoader
import os
import glob, os
import yaml
import json

# Собираем все *.CS.YAML в одну строку
allcs = ''
for file in glob.glob("data\*.cs.yaml"):
    print(file)
    with open(file, encoding='UTF-8') as infile:
        for line in infile:
           allcs += line

# Собираем все *.ZONE.YAML в одну строку
allzones = ''
for file in glob.glob("data\*.zone.yaml"):
    print(file)
    with open(file, encoding='UTF-8') as infile:
        for line in infile:
            allzones += line

# преобразуем YAML -> JSON -> строка
csstr = json.dumps(yaml.safe_load(allcs), ensure_ascii=False)
# грязный хак так как yaml ругаетсы на слэщ '\'
zonestr = json.dumps(yaml.safe_load(allzones.replace('\\', "$$$")), ensure_ascii=False).replace('$$$', '\\')



root = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(root, 'html', 'templates')
env = Environment(loader=FileSystemLoader(templates_dir))
template = env.get_template('index.html')

debug = False

JSLIBS = open('html/js/jquery-3.4.1.min.js', 'r', encoding="utf8").read() + open('html/js/bootstrap.min.js', 'r',
                                                                                 encoding="utf8").read()
CSS = open('html/css/bootstrap.min.css', 'r', encoding="utf8").read() + open('html/css/custom.css', 'r',
                                                                             encoding="utf8").read()
JSDATA = open('tmp/data.js', 'r', encoding="utf8").read()
JSAPP = open('html/js/app.js', 'r', encoding="utf8").read()
VERSION = open('VERSION', 'r', encoding="utf8").read()
print("PRODUCTION BUILD" if not debug else "DEBUG BUILD")
print("VERSION %s" % VERSION)

filename = os.path.join(root, 'docs', 'index.html')
with open(filename, 'w', encoding="utf8") as fh:
    fh.write(template.render(
        VERSION=VERSION,
        DEBUG=debug,
        JSLIBS=JSLIBS,
        CSS=CSS,
        JSDATA=JSDATA,
        JSAPP=JSAPP,
        ALLCS="var CSS =%s" % csstr,
        ALLZONE="var CADASTRE =%s" % zonestr,
    ))
