import os
import numpy as np
import pandas as pd

def generate_luad_synthetic():
    np.random.seed(42)
    n_per_cluster = 170
    n_patients = n_per_cluster * 3  # 510 patients
    
    patient_ids = [f'TCGA-LU-{i:04d}' for i in range(1, n_patients + 1)]
    sample_ids = [f'{pid}-01' for pid in patient_ids]
    
    # Define gene sets
    immune_genes = ['CD8A', 'PDCD1', 'CD274', 'IFNG', 'CXCL9', 'GZMB', 'PRF1', 'CTLA4', 'LAG3', 'STAT1', 'TIGIT', 'CXCL10', 'IL2RG', 'TBX21', 'IRF1']
    kras_egfr_genes = ['KRAS', 'EGFR', 'BRAF', 'STK11', 'MET', 'ERBB2', 'PIK3CA', 'MAP2K1', 'SOS1', 'RAF1', 'SHC1', 'GRB2', 'DUSP6', 'SPRY2', 'ETV4']
    prolif_genes = ['MKI67', 'CDK1', 'TOP2A', 'CCNB1', 'FOXM1', 'AURKA', 'BUB1', 'PLK1', 'E2F1', 'PCNA', 'CCNA2', 'MCM2', 'CDC20', 'BIRC5', 'TYMS']
    background_genes = [f'GENE_LU_{i:03d}' for i in range(1, 150)]
    all_genes = immune_genes + kras_egfr_genes + prolif_genes + background_genes
    
    # Define protein sets
    immune_prots = ['STAT1_pY701', 'LCK', 'SYK', 'CD8', 'PD-L1', 'NF-kB-p65_pS536']
    kras_prots = ['Akt_pS473', 'MAPK_pT202_Y204', 'EGFR_pY1068', 'MEK1_pS217_S221', 'p70S6K_pT389', 'PRAS40_pT246']
    prolif_prots = ['Cyclin_B1', 'PCNA', 'FoxM1', 'Chk1_pS345', 'CDK1', 'Ki-67']
    background_prots = [f'PROT_LU_{i:03d}' for i in range(1, 75)]
    all_prots = immune_prots + kras_prots + prolif_prots + background_prots

    # 1. mRNA Matrix (Genes x Samples)
    mrna_matrix = np.zeros((len(all_genes), n_patients), dtype=np.float32)
    # Base expression
    mrna_matrix += np.random.normal(loc=8.0, scale=1.5, size=mrna_matrix.shape)
    
    # 2. RPPA Matrix (Proteins x Samples)
    rppa_matrix = np.zeros((len(all_prots), n_patients), dtype=np.float32)
    rppa_matrix += np.random.normal(loc=0.0, scale=0.8, size=rppa_matrix.shape)
    
    # 3. Mutations List
    mutations = []
    
    # 4. Clinical Outcomes
    os_status = []
    os_months = []
    
    for idx, (pid, sid) in enumerate(zip(patient_ids, sample_ids)):
        cluster = idx // n_per_cluster  # 0: Immune, 1: KRAS/EGFR, 2: Proliferative
        
        if cluster == 0:
            # Immune Active Subtype
            # mRNA elevation
            for g in immune_genes:
                g_idx = all_genes.index(g)
                mrna_matrix[g_idx, idx] += np.random.normal(loc=4.5, scale=0.8)
            # Protein elevation
            for p in immune_prots:
                p_idx = all_prots.index(p)
                rppa_matrix[p_idx, idx] += np.random.normal(loc=2.2, scale=0.5)
            # Mutations: Antigen presentation & immune checkpoint
            for mut_gene in ['HLA-A', 'B2M', 'TAP1', 'PIK3CA']:
                if np.random.rand() < 0.35:
                    mutations.append({'Hugo_Symbol': mut_gene, 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'Missense_Mutation'})
            # Survival: Favorable/Good
            is_deceased = 1 if np.random.rand() < 0.22 else 0
            surv_time = np.random.exponential(scale=70.0) if not is_deceased else np.random.uniform(20.0, 65.0)
            
        elif cluster == 1:
            # KRAS / EGFR Driven Subtype
            for g in kras_egfr_genes:
                g_idx = all_genes.index(g)
                mrna_matrix[g_idx, idx] += np.random.normal(loc=4.2, scale=0.7)
            for p in kras_prots:
                p_idx = all_prots.index(p)
                rppa_matrix[p_idx, idx] += np.random.normal(loc=2.5, scale=0.6)
            # High KRAS & EGFR mutation rates
            if np.random.rand() < 0.75:
                mutations.append({'Hugo_Symbol': 'KRAS', 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'Missense_Mutation'})
            if np.random.rand() < 0.45:
                mutations.append({'Hugo_Symbol': 'EGFR', 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'In_Frame_Del'})
            if np.random.rand() < 0.40:
                mutations.append({'Hugo_Symbol': 'STK11', 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'Nonsense_Mutation'})
            # Survival: Intermediate
            is_deceased = 1 if np.random.rand() < 0.42 else 0
            surv_time = np.random.exponential(scale=45.0) if not is_deceased else np.random.uniform(10.0, 48.0)
            
        else:
            # Proliferative / Aggressive Subtype
            for g in prolif_genes:
                g_idx = all_genes.index(g)
                mrna_matrix[g_idx, idx] += np.random.normal(loc=5.0, scale=0.9)
            for p in prolif_prots:
                p_idx = all_prots.index(p)
                rppa_matrix[p_idx, idx] += np.random.normal(loc=2.8, scale=0.6)
            # High TP53 mutations
            if np.random.rand() < 0.82:
                mutations.append({'Hugo_Symbol': 'TP53', 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'Missense_Mutation'})
            if np.random.rand() < 0.35:
                mutations.append({'Hugo_Symbol': 'RB1', 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'Nonsense_Mutation'})
            # Survival: Aggressive / Poor
            is_deceased = 1 if np.random.rand() < 0.60 else 0
            surv_time = np.random.exponential(scale=24.0) if not is_deceased else np.random.uniform(4.0, 26.0)

        # Baseline sporadic mutations
        sporadic = np.random.choice(background_genes, size=np.random.randint(1, 4), replace=False)
        for sg in sporadic:
            mutations.append({'Hugo_Symbol': sg, 'Tumor_Sample_Barcode': sid, 'Variant_Classification': 'Missense_Mutation'})

        os_status.append('1:DECEASED' if is_deceased else '0:LIVING')
        os_months.append(round(float(max(1.5, surv_time)), 2))

    # Convert to DataFrames and save
    raw_dir = 'data/raw/LUAD'
    os.makedirs(raw_dir, exist_ok=True)
    
    # Save mRNA (Hugo_Symbol x Samples)
    mrna_df = pd.DataFrame(mrna_matrix, index=all_genes, columns=sample_ids)
    mrna_df.index.name = 'Hugo_Symbol'
    mrna_df.to_csv(os.path.join(raw_dir, 'data_mrna_seq_v2_rsem.txt'), sep='\t')
    
    # Save RPPA (Composite.Element.REF x Samples)
    rppa_df = pd.DataFrame(rppa_matrix, index=all_prots, columns=sample_ids)
    rppa_df.index.name = 'Composite.Element.REF'
    rppa_df.to_csv(os.path.join(raw_dir, 'data_rppa.txt'), sep='\t')
    
    # Save Mutations
    mut_df = pd.DataFrame(mutations)
    mut_df.to_csv(os.path.join(raw_dir, 'data_mutations.txt'), sep='\t', index=False)
    
    # Save Clinical Patient
    clin_pat_df = pd.DataFrame({
        'PATIENT_ID': patient_ids,
        'OS_STATUS': os_status,
        'OS_MONTHS': os_months,
        'SUBTYPE': ['LUAD_Immune' if i < 170 else ('LUAD_KRAS' if i < 340 else 'LUAD_Prolif') for i in range(n_patients)]
    })
    with open(os.path.join(raw_dir, 'data_clinical_patient.txt'), 'w') as f:
        f.write("#Patient Identifier\tOverall Survival Status\tOverall Survival Months\tSubtype\n")
        f.write("#PATIENT_ID\tOS_STATUS\tOS_MONTHS\tSUBTYPE\n")
        f.write("#STRING\tSTRING\tNUMBER\tSTRING\n")
        f.write("#1\t1\t1\t1\n")
    clin_pat_df.to_csv(os.path.join(raw_dir, 'data_clinical_patient.txt'), sep='\t', index=False, mode='a')
    
    # Save Clinical Sample
    clin_samp_df = pd.DataFrame({
        'PATIENT_ID': patient_ids,
        'SAMPLE_ID': sample_ids
    })
    with open(os.path.join(raw_dir, 'data_clinical_sample.txt'), 'w') as f:
        f.write("#Sample Identifier\tPatient Identifier\n")
        f.write("#SAMPLE_ID\tPATIENT_ID\n")
        f.write("#STRING\tSTRING\n")
        f.write("#1\t1\n")
    clin_samp_df.to_csv(os.path.join(raw_dir, 'data_clinical_sample.txt'), sep='\t', index=False, mode='a')
    
    print(f"Generated high-quality synthetic LUAD dataset with {n_patients} patients in {raw_dir}.")

if __name__ == '__main__':
    generate_luad_synthetic()
