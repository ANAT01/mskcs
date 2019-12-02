from jinja2 import Environment, FileSystemLoader
import os

root = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(root, 'html', 'templates')
env = Environment(loader=FileSystemLoader(templates_dir))
template = env.get_template('index.html')

debug = False

JSLIBS = open('html/js/jquery-3.4.1.min.js', 'r', encoding="utf8").read() + open('html/js/bootstrap.min.js', 'r', encoding="utf8").read()
CSS = open('html/css/bootstrap.min.css', 'r', encoding="utf8").read() + open('html/css/custom.css', 'r', encoding="utf8").read()
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
    ))
