import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler

def load_data(raw_dir='data/raw'):
    print("Loading data...")
    # 1. Clinical Data
    clin_pat = pd.read_csv(os.path.join(raw_dir, 'data_clinical_patient.txt'), sep='\t', comment='#')
    clin_samp = pd.read_csv(os.path.join(raw_dir, 'data_clinical_sample.txt'), sep='\t', comment='#')
    
    # 2. mRNA Data
    mrna = pd.read_csv(os.path.join(raw_dir, 'data_mrna_seq_v2_rsem.txt'), sep='\t')
    if 'Hugo_Symbol' in mrna.columns:
        mrna = mrna.dropna(subset=['Hugo_Symbol'])
        mrna = mrna.drop_duplicates(subset=['Hugo_Symbol'])
        mrna = mrna.set_index('Hugo_Symbol').select_dtypes(include=[np.number])
    # Transpose so rows are samples, columns are genes
    mrna = mrna.T
    
    # 3. RPPA Data
    rppa = pd.read_csv(os.path.join(raw_dir, 'data_rppa.txt'), sep='\t')
    if 'Composite.Element.REF' in rppa.columns:
        rppa = rppa.dropna(subset=['Composite.Element.REF'])
        rppa = rppa.drop_duplicates(subset=['Composite.Element.REF'])
        rppa = rppa.set_index('Composite.Element.REF').select_dtypes(include=[np.number])
    rppa = rppa.T
    
    # 4. Mutations Data
    mut = pd.read_csv(os.path.join(raw_dir, 'data_mutations.txt'), sep='\t')
    # We'll create a gene x sample mutation count matrix
    if not mut.empty:
        mut_matrix = pd.crosstab(mut['Tumor_Sample_Barcode'], mut['Hugo_Symbol'])
    else:
        mut_matrix = pd.DataFrame()
    
    return clin_pat, clin_samp, mrna, rppa, mut_matrix

def align_and_split(mrna, rppa, mut_matrix):
    print("Aligning samples...")
    # Find common samples across all modalities
    samples = set(mrna.index) & set(rppa.index) & set(mut_matrix.index)
    samples = sorted(list(samples))
    
    if len(samples) == 0:
        # If no common samples, just use all unique samples and we'll impute
        samples = sorted(list(set(mrna.index) | set(rppa.index) | set(mut_matrix.index)))
        
    mrna = mrna.reindex(samples)
    rppa = rppa.reindex(samples)
    mut_matrix = mut_matrix.reindex(samples).fillna(0)
    
    print(f"Total samples: {len(samples)}")
    
    # Split train, val, test
    train_samples, test_samples = train_test_split(samples, test_size=0.15, random_state=42)
    train_samples, val_samples = train_test_split(train_samples, test_size=0.176, random_state=42) # 0.15/0.85 approx 0.176
    
    print(f"Train: {len(train_samples)}, Val: {len(val_samples)}, Test: {len(test_samples)}")
    return mrna, rppa, mut_matrix, train_samples, val_samples, test_samples

def preprocess_modality(data, train_samples, val_samples, test_samples, name, is_mrna=False, cohort='BRCA'):
    print(f"Preprocessing {name} for {cohort}...")
    
    train_data = data.loc[train_samples]
    val_data = data.loc[val_samples]
    test_data = data.loc[test_samples]
    
    if is_mrna:
        # Log transform mRNA: log2(x+1)
        train_data = np.log2(train_data + 1)
        val_data = np.log2(val_data + 1)
        test_data = np.log2(test_data + 1)
        
        # Keep top 2000 variable genes based on train set
        variances = train_data.var()
        top_genes = variances.nlargest(2000).index
        train_data = train_data[top_genes]
        val_data = val_data[top_genes]
        test_data = test_data[top_genes]
    
    # Drop columns that are completely all-NaN in the train set
    non_empty_cols = train_data.columns[train_data.notna().any()].tolist()
    train_data = train_data[non_empty_cols]
    val_data = val_data[non_empty_cols]
    test_data = test_data[non_empty_cols]
    
    # Impute missing values
    imputer = KNNImputer(n_neighbors=5)
    train_imputed = imputer.fit_transform(train_data)
    val_imputed = imputer.transform(val_data)
    test_imputed = imputer.transform(test_data)
    
    # Standardize
    scaler = StandardScaler()
    train_scaled = scaler.fit_transform(train_imputed)
    val_scaled = scaler.transform(val_imputed)
    test_scaled = scaler.transform(test_imputed)
    
    # Convert back to DataFrame
    cols = train_data.columns
    train_final = pd.DataFrame(train_scaled, index=train_samples, columns=cols)
    val_final = pd.DataFrame(val_scaled, index=val_samples, columns=cols)
    test_final = pd.DataFrame(test_scaled, index=test_samples, columns=cols)
    
    # Save transformers
    os.makedirs('models', exist_ok=True)
    joblib.dump(imputer, f'models/{cohort}_{name}_imputer.joblib')
    joblib.dump(scaler, f'models/{cohort}_{name}_scaler.joblib')
    
    return train_final, val_final, test_final

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--cohort', type=str, default='BRCA')
    args = parser.parse_args()
    
    raw_dir = f'data/raw/{args.cohort}'
    processed_dir = f'data/processed/{args.cohort}'
    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    clin_pat, clin_samp, mrna, rppa, mut = load_data(raw_dir=raw_dir)
    mrna, rppa, mut, train_s, val_s, test_s = align_and_split(mrna, rppa, mut)
    
    # We pass args.cohort down to preprocess_modality
    mrna_train, mrna_val, mrna_test = preprocess_modality(mrna, train_s, val_s, test_s, 'mrna', is_mrna=True, cohort=args.cohort)
    rppa_train, rppa_val, rppa_test = preprocess_modality(rppa, train_s, val_s, test_s, 'rppa', cohort=args.cohort)
    mut_train, mut_val, mut_test = preprocess_modality(mut, train_s, val_s, test_s, 'mut', cohort=args.cohort)
    
    mrna_train.to_csv(f'{processed_dir}/mrna_train.csv')
    mrna_val.to_csv(f'{processed_dir}/mrna_val.csv')
    mrna_test.to_csv(f'{processed_dir}/mrna_test.csv')
    
    rppa_train.to_csv(f'{processed_dir}/rppa_train.csv')
    rppa_val.to_csv(f'{processed_dir}/rppa_val.csv')
    rppa_test.to_csv(f'{processed_dir}/rppa_test.csv')
    
    mut_train.to_csv(f'{processed_dir}/mut_train.csv')
    mut_val.to_csv(f'{processed_dir}/mut_val.csv')
    mut_test.to_csv(f'{processed_dir}/mut_test.csv')
    
    clin_pat.to_csv(f'{processed_dir}/clinical_patient.csv', index=False)
    clin_samp.to_csv(f'{processed_dir}/clinical_sample.csv', index=False)
    
    print(f"Preprocessing completed. Processed files saved in {processed_dir}/")
