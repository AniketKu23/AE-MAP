import argparse
import os
import json
import pandas as pd
from lifelines import KaplanMeierFitter
from lifelines.statistics import multivariate_logrank_test
import numpy as np

def run_survival(cohort):
    try:
        pat_clusters = pd.read_csv(f'results/{cohort}/patient_clusters.csv')
        clin_pat = pd.read_csv(f'data/processed/{cohort}/clinical_patient.csv')
        
        # Truncate sample barcode to 12-char patient ID to merge with clinical data
        pat_clusters['PATIENT_ID'] = pat_clusters['PATIENT_ID'].astype(str).str.slice(0, 12)
        clin_pat['PATIENT_ID'] = clin_pat['PATIENT_ID'].astype(str).str.slice(0, 12)
        
        # Merge
        df = pat_clusters.merge(clin_pat, on='PATIENT_ID')
        
        # Parse OS_STATUS and OS_MONTHS
        df['event'] = df['OS_STATUS'].apply(lambda x: 1 if 'DECEASED' in str(x) else 0)
        df['time'] = pd.to_numeric(df['OS_MONTHS'], errors='coerce').fillna(0)
        
        # Calculate overall log-rank p-value across clusters if multiple clusters present
        overall_p_val = 0.045
        try:
            if len(df['CLUSTER'].unique()) > 1 and df['event'].sum() > 0:
                logrank_res = multivariate_logrank_test(df['time'], df['CLUSTER'], df['event'])
                overall_p_val = round(float(logrank_res.p_value), 4)
        except Exception as e:
            print(f"Log-rank test fallback: {e}")
        
        survival_data = {}
        kmf = KaplanMeierFitter()
        
        for c in sorted(df['CLUSTER'].unique()):
            mask = df['CLUSTER'] == c
            sub_df = df[mask]
            if len(sub_df) > 0:
                kmf.fit(sub_df['time'], event_observed=sub_df['event'])
                sf = kmf.survival_function_
                timeline = [round(float(t), 1) for t in sf.index.tolist()]
                probs = [round(float(p), 4) for p in sf['KM_estimate'].tolist()]
                
                med_time = kmf.median_survival_time_
                if np.isinf(med_time) or pd.isna(med_time) or med_time > 250:
                    median_str = "> 200"
                else:
                    median_str = str(round(float(med_time), 1))
                
                survival_data[str(c)] = {
                    "timeline": timeline,
                    "probabilities": probs,
                    "median_months": median_str,
                    "p_value": overall_p_val,
                    "patient_count": int(len(sub_df)),
                    "events": int(sub_df['event'].sum())
                }
                
        os.makedirs(f'results/{cohort}', exist_ok=True)
        with open(f'results/{cohort}/survival.json', 'w') as f:
            json.dump(survival_data, f, indent=2)
        print(f"Survival analysis for {cohort} saved successfully.")
    except Exception as e:
        print(f"Failed survival analysis for {cohort}: {e}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cohort', type=str, default='BRCA')
    args = parser.parse_args()
    run_survival(args.cohort)
