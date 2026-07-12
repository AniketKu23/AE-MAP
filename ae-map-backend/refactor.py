import os
import re

def process_train():
    with open('src/train.py', 'r') as f:
        code = f.read()
    code = code.replace("data/processed/mrna_train.csv", f"data/processed/{{args.cohort}}/mrna_train.csv")
    code = code.replace("data/processed/rppa_train.csv", f"data/processed/{{args.cohort}}/rppa_train.csv")
    code = code.replace("data/processed/mut_train.csv", f"data/processed/{{args.cohort}}/mut_train.csv")
    code = code.replace("data/processed/mrna_val.csv", f"data/processed/{{args.cohort}}/mrna_val.csv")
    code = code.replace("data/processed/rppa_val.csv", f"data/processed/{{args.cohort}}/rppa_val.csv")
    code = code.replace("data/processed/mut_val.csv", f"data/processed/{{args.cohort}}/mut_val.csv")
    code = code.replace("'models/best_model.pth'", "f'models/{args.cohort}_best_model.pth'")
    code = code.replace("'models/training_history.csv'", "f'models/{args.cohort}_training_history.csv'")
    if "parser.add_argument('--cohort'" not in code:
        code = code.replace("parser.add_argument('--epochs'", "parser.add_argument('--cohort', type=str, default='BRCA')\n    parser.add_argument('--epochs'")
    with open('src/train.py', 'w') as f:
        f.write(code)

def process_analyze():
    with open('src/analyze.py', 'r') as f:
        code = f.read()
    code = code.replace("def load_all_data():", "def load_all_data(cohort):")
    code = code.replace("'data/processed/", "f'data/processed/{cohort}/")
    code = code.replace("def analyze():", "def analyze(cohort):")
    code = code.replace("load_all_data()", "load_all_data(cohort)")
    code = code.replace("'models/best_model.pth'", "f'models/{cohort}_best_model.pth'")
    code = code.replace("os.makedirs('results'", "os.makedirs(f'results/{cohort}'")
    code = code.replace("'results/metrics.json'", "f'results/{cohort}/metrics.json'")
    code = code.replace("'results/clusters.json'", "f'results/{cohort}/clusters.json'")
    code = code.replace("'results/patient_clusters.csv'", "f'results/{cohort}/patient_clusters.csv'")
    
    if "import argparse" not in code:
        code = code.replace("if __name__ == '__main__':", "if __name__ == '__main__':\n    import argparse\n    parser = argparse.ArgumentParser()\n    parser.add_argument('--cohort', type=str, default='BRCA')\n    args = parser.parse_args()")
    code = code.replace("analyze()", "analyze(args.cohort)")
    with open('src/analyze.py', 'w') as f:
        f.write(code)

def process_others(filename):
    with open(f'src/{filename}.py', 'r') as f:
        code = f.read()
    
    code = code.replace("os.makedirs('results'", "os.makedirs(f'results/{args.cohort}'")
    code = code.replace("'results/", "f'results/{args.cohort}/")
    code = code.replace("'data/processed/", "f'data/processed/{args.cohort}/")
    
    if "import argparse" not in code:
        code = code.replace(f"def {filename}():", f"import argparse\ndef {filename}(args):")
        if "if __name__ == '__main__':" in code:
            code = code.replace("if __name__ == '__main__':", "if __name__ == '__main__':\n    parser = argparse.ArgumentParser()\n    parser.add_argument('--cohort', type=str, default='BRCA')\n    args = parser.parse_args()")
            code = code.replace(f"    {filename}()", f"    {filename}(args)")
            
    with open(f'src/{filename}.py', 'w') as f:
        f.write(code)

process_train()
process_analyze()
for script in ['pathways', 'survival', 'explain']:
    process_others(script)
print("Scripts refactored.")
