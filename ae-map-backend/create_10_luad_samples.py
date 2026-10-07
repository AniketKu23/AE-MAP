import os
import json
import numpy as np
import pandas as pd

def create_luad_samples():
    base_dir = '../public/samples/LUAD'
    os.makedirs(base_dir, exist_ok=True)
    
    # Gene & protein lists
    immune_genes = ['CD8A', 'PDCD1', 'CD274', 'IFNG', 'CXCL9', 'GZMB', 'PRF1', 'CTLA4', 'LAG3', 'STAT1']
    kras_genes = ['KRAS', 'EGFR', 'BRAF', 'STK11', 'MET', 'ERBB2', 'PIK3CA', 'MAP2K1']
    prolif_genes = ['MKI67', 'CDK1', 'TOP2A', 'CCNB1', 'FOXM1', 'AURKA', 'BUB1', 'PLK1']
    all_genes = immune_genes + kras_genes + prolif_genes
    
    immune_prots = ['STAT1_pY701', 'LCK', 'SYK', 'CD8', 'PD-L1']
    kras_prots = ['Akt_pS473', 'MAPK_pT202_Y204', 'EGFR_pY1068', 'MEK1_pS217_S221']
    prolif_prots = ['Cyclin_B1', 'PCNA', 'FoxM1', 'Chk1_pS345', 'Ki-67']
    all_prots = immune_prots + kras_prots + prolif_prots
    
    patients = [
        {"id": "patient_01", "subtype": 0, "name": "Patient 01 (Immune-Active High CD8)", "desc": "High cytotoxic T-cell markers (CD8A, IFNG); strong candidate for anti-PD1 therapy."},
        {"id": "patient_02", "subtype": 0, "name": "Patient 02 (Immune-Active PD-L1+)", "desc": "High PD-L1 (CD274) and STAT1 activation with elevated immune score."},
        {"id": "patient_03", "subtype": 0, "name": "Patient 03 (Immune Infiltrated)", "desc": "Robust chemokine (CXCL9) and granzyme (GZMB) expression profile."},
        {"id": "patient_04", "subtype": 1, "name": "Patient 04 (KRAS G12C Mutant)", "desc": "Oncogenic KRAS missense mutation with elevated MAPK phosphorylation."},
        {"id": "patient_05", "subtype": 1, "name": "Patient 05 (EGFR Exon 19 del)", "desc": "Activating EGFR alteration; sensitive to tyrosine kinase inhibitors."},
        {"id": "patient_06", "subtype": 1, "name": "Patient 06 (KRAS + STK11 Co-mut)", "desc": "Co-occurring KRAS and STK11 mutations with PI3K/Akt pathway activation."},
        {"id": "patient_07", "subtype": 1, "name": "Patient 07 (EGFR / MET Pathway)", "desc": "Elevated EGFR and MET protein abundance driving oncogenic growth."},
        {"id": "patient_08", "subtype": 2, "name": "Patient 08 (Proliferative High Ki-67)", "desc": "Extreme MKI67 and CDK1 expression with rapid cell division rate."},
        {"id": "patient_09", "subtype": 2, "name": "Patient 09 (TP53-Mutant / Aneuploid)", "desc": "Loss-of-function TP53 alteration and high Cyclin B1 / Topoisomerase II levels."},
        {"id": "patient_10", "subtype": 2, "name": "Patient 10 (Aggressive Cell Cycle)", "desc": "Hyperactive FOXM1 and Aurora Kinase signaling requiring intensive chemotherapy."}
    ]
    
    manifest = []
    
    for p in patients:
        p_id = p["id"]
        subtype = p["subtype"]
        p_dir = os.path.join(base_dir, p_id)
        os.makedirs(p_dir, exist_ok=True)
        
        # 1. Generate DNA mutations
        mut_list = []
        if subtype == 0:
            mut_list.append({"Hugo_Symbol": "HLA-A", "Variant_Classification": "Missense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
            mut_list.append({"Hugo_Symbol": "B2M", "Variant_Classification": "Silent", "Tumor_Sample_Barcode": f"{p_id}-01"})
        elif subtype == 1:
            mut_list.append({"Hugo_Symbol": "KRAS" if "KRAS" in p["name"] else "EGFR", "Variant_Classification": "Missense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
            if "STK11" in p["name"]:
                mut_list.append({"Hugo_Symbol": "STK11", "Variant_Classification": "Nonsense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
        else:
            mut_list.append({"Hugo_Symbol": "TP53", "Variant_Classification": "Missense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
            mut_list.append({"Hugo_Symbol": "RB1", "Variant_Classification": "Splice_Site", "Tumor_Sample_Barcode": f"{p_id}-01"})
            
        pd.DataFrame(mut_list).to_csv(os.path.join(p_dir, 'dna.csv'), index=False)
        
        # 2. Generate RNA
        rna_rows = []
        for g in all_genes:
            val = np.random.normal(8.0, 1.0)
            if subtype == 0 and g in immune_genes:
                val += np.random.normal(5.0, 0.5)
            elif subtype == 1 and g in kras_genes:
                val += np.random.normal(4.8, 0.5)
            elif subtype == 2 and g in prolif_genes:
                val += np.random.normal(5.5, 0.5)
            rna_rows.append({"Hugo_Symbol": g, "Normalized_Count": round(float(val), 2)})
        pd.DataFrame(rna_rows).to_csv(os.path.join(p_dir, 'rna.csv'), index=False)
        
        # 3. Generate Protein
        prot_rows = []
        for pr in all_prots:
            val = np.random.normal(0.0, 0.5)
            if subtype == 0 and pr in immune_prots:
                val += np.random.normal(2.5, 0.3)
            elif subtype == 1 and pr in kras_prots:
                val += np.random.normal(2.6, 0.3)
            elif subtype == 2 and pr in prolif_prots:
                val += np.random.normal(2.8, 0.3)
            prot_rows.append({"Protein_Name": pr, "Abundance": round(float(val), 2)})
        pd.DataFrame(prot_rows).to_csv(os.path.join(p_dir, 'protein.csv'), index=False)
        
        manifest.append({
            "id": p_id,
            "name": p["name"],
            "desc": p["desc"],
            "subtype": subtype,
            "dnaPath": f"/samples/LUAD/{p_id}/dna.csv",
            "rnaPath": f"/samples/LUAD/{p_id}/rna.csv",
            "proteinPath": f"/samples/LUAD/{p_id}/protein.csv"
        })
        
    # Save manifest
    with open(os.path.join(base_dir, 'patients_manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=2)
        
    # Also save top-level sample_dna.csv, sample_rna.csv, sample_protein.csv for default 1-click in LUAD
    p1_dir = os.path.join(base_dir, 'patient_01')
    pd.read_csv(os.path.join(p1_dir, 'dna.csv')).to_csv(os.path.join(base_dir, 'sample_dna.csv'), index=False)
    pd.read_csv(os.path.join(p1_dir, 'rna.csv')).to_csv(os.path.join(base_dir, 'sample_rna.csv'), index=False)
    pd.read_csv(os.path.join(p1_dir, 'protein.csv')).to_csv(os.path.join(base_dir, 'sample_protein.csv'), index=False)
    
    print(f"Created 10 LUAD test patient profiles in {base_dir}")

if __name__ == '__main__':
    create_luad_samples()
