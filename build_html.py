from jinja2 import Environment, FileSystemLoader
import os

root = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(root, 'html', 'templates')
env = Environment(loader=FileSystemLoader(templates_dir))
template = env.get_template('index.html')

debug = True
filename = os.path.join(root, 'docs', 'index.html')
with open(filename, 'w', encoding="utf8") as fh:
    fh.write(template.render(
        h1="Hello Jinja2",
        show_one=True,
        show_two=False,
        names=["Foo", "Bar", "Qux"],
        VERSION=open('VERSION', 'r', encoding="utf8").read(),
        DEBUG=debug,
    ))
