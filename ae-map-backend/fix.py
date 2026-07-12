import os
import glob
import re

files = glob.glob('src/*.py')
for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Fix missing f-strings
    content = content.replace("'data/processed/{args.cohort}/", "f'data/processed/{args.cohort}/")
    content = content.replace("'data/processed/{cohort}/", "f'data/processed/{cohort}/")
    content = content.replace("ff'results", "f'results")
    content = content.replace("f'results/{args.cohort}/{args.cohort}'", "f'results/{args.cohort}'")
    
    with open(file, 'w') as f:
        f.write(content)

# Fix argparse import in survival.py
with open('src/survival.py', 'r') as f:
    code = f.read()
if "import argparse" not in code:
    code = "import argparse\n" + code
with open('src/survival.py', 'w') as f:
    f.write(code)

# Fix argparse import in explain.py
with open('src/explain.py', 'r') as f:
    code = f.read()
if "import argparse" not in code:
    code = "import argparse\n" + code
with open('src/explain.py', 'w') as f:
    f.write(code)
    
print("Fixed missing f-strings and imports.")
