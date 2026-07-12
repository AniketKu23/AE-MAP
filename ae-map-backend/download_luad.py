import urllib.request
import os

files = [
    "data_mutations.txt",
    "data_mrna_seq_v2_rsem.txt",
    "data_rppa.txt",
    "data_clinical_patient.txt",
    "data_clinical_sample.txt"
]

base_url = "https://raw.githubusercontent.com/cBioPortal/datahub/master/public/luad_tcga_pan_can_atlas_2018/"
os.makedirs("data/raw/LUAD", exist_ok=True)

for file in files:
    print(f"Downloading {file}...")
    try:
        urllib.request.urlretrieve(base_url + file, f"data/raw/LUAD/{file}")
    except Exception as e:
        print(f"Failed to download {file}: {e}")
        
print("Done.")
