import os
import json
import numpy as np
import pandas as pd

def create_brca_samples():
    base_dir = '../public/samples/BRCA'
    os.makedirs(base_dir, exist_ok=True)
    
    # Gene & protein lists for BRCA
    luminal_genes = ['ESR1', 'PGR', 'GATA3', 'FOXA1', 'XBP1', 'BCL2', 'KRT8', 'KRT18', 'CA12', 'SLC39A6']
    repair_genes = ['BRCA1', 'BRCA2', 'PARP1', 'RAD51', 'ATM', 'CHEK2', 'FANCD2', 'PALB2', 'BARD1', 'BRIP1']
    basal_genes = ['MKI67', 'TP53', 'ERBB2', 'CCNE1', 'AURKA', 'TOP2A', 'MYC', 'EGFR', 'FOXM1', 'CDK1']
    all_genes = luminal_genes + repair_genes + basal_genes
    
    luminal_prots = ['ER-alpha', 'PR', 'GATA3', 'Bcl-2', 'INPP4B']
    repair_prots = ['PARP1', 'RAD51', 'ATM_pS1981', 'Chk2_pT68', 'BRCA1']
    basal_prots = ['HER2_pY1248', 'Ki-67', 'Cyclin_E1', 'p53', 'EGFR_pY1068']
    all_prots = luminal_prots + repair_prots + basal_prots
    
    patients = [
        {"id": "patient_01", "subtype": 0, "name": "Patient 01 (Luminal A - High ER/PR)", "desc": "Elevated ESR1, PGR, and GATA3 expression; low proliferative activity; excellent hormone response."},
        {"id": "patient_02", "subtype": 0, "name": "Patient 02 (Luminal A - FOXA1+)", "desc": "High FOXA1 transcriptional regulator with quiescent cell cycle and favorable long-term prognosis."},
        {"id": "patient_03", "subtype": 0, "name": "Patient 03 (Luminal B - PIK3CA Mutant)", "desc": "PIK3CA oncogenic mutation with sustained estrogen receptor signaling."},
        {"id": "patient_04", "subtype": 1, "name": "Patient 04 (BRCA1 Inactivation / HRD)", "desc": "Loss of functional BRCA1, high PARP1 abundance; sensitive to PARP inhibitors (e.g. Olaparib)."},
        {"id": "patient_05", "subtype": 1, "name": "Patient 05 (BRCA2-Mutant DNA Repair Deficit)", "desc": "Biallelic BRCA2 loss with high genomic instability and spiked RAD51 expression."},
        {"id": "patient_06", "subtype": 1, "name": "Patient 06 (HRD / Platinum-Sensitive)", "desc": "Defective homologous recombination machinery; exceptional response to platinum chemos."},
        {"id": "patient_07", "subtype": 1, "name": "Patient 07 (ATM/CHEK2 Checkpoint Deficit)", "desc": "Impaired double-strand break repair checkpoint signaling and elevated DNA stress response."},
        {"id": "patient_08", "subtype": 2, "name": "Patient 08 (Basal-Like / Triple Negative)", "desc": "TP53 mutation, loss of ER/PR/HER2, extreme MKI67 and proliferation kinase levels."},
        {"id": "patient_09", "subtype": 2, "name": "Patient 09 (HER2-Enriched Subtype)", "desc": "Amplified ERBB2/HER2 expression and hyperactive receptor tyrosine kinase signaling."},
        {"id": "patient_10", "subtype": 2, "name": "Patient 10 (Aggressive Proliferative)", "desc": "Dysregulated cell cycle with high CCNE1, AURKA, and TOP2A; fast progression profile."}
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
            if "PIK3CA" in p["name"]:
                mut_list.append({"Hugo_Symbol": "PIK3CA", "Variant_Classification": "Missense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
            else:
                mut_list.append({"Hugo_Symbol": "GATA3", "Variant_Classification": "Frameshift_Del", "Tumor_Sample_Barcode": f"{p_id}-01"})
        elif subtype == 1:
            mut_list.append({"Hugo_Symbol": "BRCA1" if "BRCA1" in p["name"] else ("BRCA2" if "BRCA2" in p["name"] else "ATM"), "Variant_Classification": "Nonsense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
            mut_list.append({"Hugo_Symbol": "PARP1", "Variant_Classification": "Silent", "Tumor_Sample_Barcode": f"{p_id}-01"})
        else:
            mut_list.append({"Hugo_Symbol": "TP53", "Variant_Classification": "Missense_Mutation", "Tumor_Sample_Barcode": f"{p_id}-01"})
            if "HER2" in p["name"]:
                mut_list.append({"Hugo_Symbol": "ERBB2", "Variant_Classification": "Amplification", "Tumor_Sample_Barcode": f"{p_id}-01"})
            
        pd.DataFrame(mut_list).to_csv(os.path.join(p_dir, 'dna.csv'), index=False)
        
        # 2. Generate RNA
        rna_rows = []
        for g in all_genes:
            val = np.random.normal(8.0, 1.0)
            if subtype == 0 and g in luminal_genes:
                val += np.random.normal(5.0, 0.5)
            elif subtype == 1 and g in repair_genes:
                val += np.random.normal(4.8, 0.5)
            elif subtype == 2 and g in basal_genes:
                val += np.random.normal(5.5, 0.5)
            rna_rows.append({"Hugo_Symbol": g, "Normalized_Count": round(float(val), 2)})
        pd.DataFrame(rna_rows).to_csv(os.path.join(p_dir, 'rna.csv'), index=False)
        
        # 3. Generate Protein
        prot_rows = []
        for pr in all_prots:
            val = np.random.normal(0.0, 0.5)
            if subtype == 0 and pr in luminal_prots:
                val += np.random.normal(2.5, 0.3)
            elif subtype == 1 and pr in repair_prots:
                val += np.random.normal(2.6, 0.3)
            elif subtype == 2 and pr in basal_prots:
                val += np.random.normal(2.8, 0.3)
            prot_rows.append({"Protein_Name": pr, "Abundance": round(float(val), 2)})
        pd.DataFrame(prot_rows).to_csv(os.path.join(p_dir, 'protein.csv'), index=False)
        
        manifest.append({
            "id": p_id,
            "name": p["name"],
            "desc": p["desc"],
            "subtype": subtype,
            "dnaPath": f"/samples/BRCA/{p_id}/dna.csv",
            "rnaPath": f"/samples/BRCA/{p_id}/rna.csv",
            "proteinPath": f"/samples/BRCA/{p_id}/protein.csv"
        })
        
    # Save manifest
    with open(os.path.join(base_dir, 'patients_manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=2)
        
    # Save top-level sample files for BRCA default
    p1_dir = os.path.join(base_dir, 'patient_01')
    pd.read_csv(os.path.join(p1_dir, 'dna.csv')).to_csv(os.path.join(base_dir, 'sample_dna.csv'), index=False)
    pd.read_csv(os.path.join(p1_dir, 'rna.csv')).to_csv(os.path.join(base_dir, 'sample_rna.csv'), index=False)
    pd.read_csv(os.path.join(p1_dir, 'protein.csv')).to_csv(os.path.join(base_dir, 'sample_protein.csv'), index=False)
    
    # Also update the legacy public/samples/sample_*.csv for backwards compatibility
    legacy_dir = '../public/samples'
    pd.read_csv(os.path.join(p1_dir, 'dna.csv')).to_csv(os.path.join(legacy_dir, 'sample_dna.csv'), index=False)
    pd.read_csv(os.path.join(p1_dir, 'rna.csv')).to_csv(os.path.join(legacy_dir, 'sample_rna.csv'), index=False)
    pd.read_csv(os.path.join(p1_dir, 'protein.csv')).to_csv(os.path.join(legacy_dir, 'sample_protein.csv'), index=False)

    print(f"Created 10 BRCA test patient profiles in {base_dir}")

if __name__ == '__main__':
    create_brca_samples()
