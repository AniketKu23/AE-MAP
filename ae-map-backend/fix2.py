import os
import glob
import re

files = glob.glob('src/*.py')
for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    content = content.replace("ff'", "f'")
    
    with open(file, 'w') as f:
        f.write(content)

# Fix argparse import in pathways.py
with open('src/pathways.py', 'r') as f:
    code = f.read()
if "import argparse" not in code:
    code = "import argparse\n" + code
with open('src/pathways.py', 'w') as f:
    f.write(code)

print("Fixed syntax errors.")
