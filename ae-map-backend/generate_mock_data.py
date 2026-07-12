import os
import pandas as pd
import numpy as np

import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--cohort', type=str, default='BRCA')
args = parser.parse_args()

raw_dir = f'data/raw/{args.cohort}'
os.makedirs(raw_dir, exist_ok=True)

# Generate 50 dummy patients
patient_ids = [f'TCGA-XX-00{i:02d}' for i in range(50)]
sample_ids = [f'{pid}-01' for pid in patient_ids] # The -01 denotes tumor sample

# 1. mRNA data
# Rows are genes, columns are samples
genes = [f'GENE_{i}' for i in range(100)]
mrna_data = pd.DataFrame(
    np.random.poisson(lam=100, size=(100, 50)),
    index=genes,
    columns=sample_ids
)
mrna_data.index.name = 'Hugo_Symbol'
mrna_data.to_csv(os.path.join(raw_dir, 'data_mrna_seq_v2_rsem.txt'), sep='\t')

# 2. RPPA data
# Rows are proteins, columns are samples
proteins = [f'PROT_{i}' for i in range(50)]
rppa_data = pd.DataFrame(
    np.random.normal(loc=0, scale=1, size=(50, 50)),
    index=proteins,
    columns=sample_ids
)
rppa_data.index.name = 'Composite.Element.REF'
rppa_data.to_csv(os.path.join(raw_dir, 'data_rppa.txt'), sep='\t')

# 3. Mutations data
# Rows are mutations. We'll just generate a few random mutations per sample
mut_data = []
for sample in sample_ids:
    # random number of mutations
    num_muts = np.random.randint(1, 10)
    mutated_genes = np.random.choice(genes, num_muts, replace=False)
    for g in mutated_genes:
        mut_data.append({
            'Hugo_Symbol': g,
            'Tumor_Sample_Barcode': sample,
            'Variant_Classification': 'Missense_Mutation'
        })
pd.DataFrame(mut_data).to_csv(os.path.join(raw_dir, 'data_mutations.txt'), sep='\t', index=False)

# 4. Clinical Patient
# Columns: PATIENT_ID, OS_STATUS, OS_MONTHS
clin_pat = pd.DataFrame({
    'PATIENT_ID': patient_ids,
    'OS_STATUS': np.random.choice(['0:LIVING', '1:DECEASED'], 50),
    'OS_MONTHS': np.random.exponential(scale=24, size=50)
})
# cBioPortal files have header lines starting with #
with open(os.path.join(raw_dir, 'data_clinical_patient.txt'), 'w') as f:
    f.write("#Patient Identifier\n")
    f.write("#PATIENT_ID\n")
    f.write("#STRING\n")
    f.write("#1\n")
clin_pat.to_csv(os.path.join(raw_dir, 'data_clinical_patient.txt'), sep='\t', index=False, mode='a')

# 5. Clinical Sample
clin_samp = pd.DataFrame({
    'PATIENT_ID': patient_ids,
    'SAMPLE_ID': sample_ids
})
with open(os.path.join(raw_dir, 'data_clinical_sample.txt'), 'w') as f:
    f.write("#Sample Identifier\n")
    f.write("#SAMPLE_ID\n")
    f.write("#STRING\n")
    f.write("#1\n")
clin_samp.to_csv(os.path.join(raw_dir, 'data_clinical_sample.txt'), sep='\t', index=False, mode='a')

print(f"Mock data generated successfully in {raw_dir}")
