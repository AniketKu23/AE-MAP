import os
import argparse
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from model import MultiViewAutoencoder

class MultiOmicsDataset(Dataset):
    def __init__(self, mrna_path, rppa_path, mut_path):
        self.mrna = pd.read_csv(mrna_path, index_col=0).values.astype(np.float32)
        self.rppa = pd.read_csv(rppa_path, index_col=0).values.astype(np.float32)
        self.mut = pd.read_csv(mut_path, index_col=0).values.astype(np.float32)
        assert len(self.mrna) == len(self.rppa) == len(self.mut), "Sample counts do not match!"
        
    def __len__(self):
        return len(self.mrna)
        
    def __getitem__(self, idx):
        return self.mrna[idx], self.rppa[idx], self.mut[idx]

def train(args):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    train_dataset = MultiOmicsDataset(f'data/processed/{args.cohort}/mrna_train.csv', f'data/processed/{args.cohort}/rppa_train.csv', f'data/processed/{args.cohort}/mut_train.csv')
    val_dataset = MultiOmicsDataset(f'data/processed/{args.cohort}/mrna_val.csv', f'data/processed/{args.cohort}/rppa_val.csv', f'data/processed/{args.cohort}/mut_val.csv')
    
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False)
    
    dim_mrna = train_dataset.mrna.shape[1]
    dim_rppa = train_dataset.rppa.shape[1]
    dim_mut = train_dataset.mut.shape[1]
    
    model = MultiViewAutoencoder(dim_mrna, dim_rppa, dim_mut, variational=args.variational).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=5)
    criterion = nn.MSELoss()
    
    # Weight reconstruction loss inversely to feature count to balance
    w_mrna = 1.0 / dim_mrna
    w_rppa = 1.0 / dim_rppa
    w_mut = 1.0 / dim_mut
    total_w = w_mrna + w_rppa + w_mut
    w_mrna, w_rppa, w_mut = w_mrna/total_w, w_rppa/total_w, w_mut/total_w
    
    os.makedirs('models', exist_ok=True)
    best_val_loss = float('inf')
    
    history = []
    
    for epoch in range(args.epochs):
        model.train()
        train_loss = 0
        for mrna, rppa, mut in train_loader:
            mrna, rppa, mut = mrna.to(device), rppa.to(device), mut.to(device)
            optimizer.zero_grad()
            
            if args.variational:
                x_hat_mrna, x_hat_rppa, x_hat_mut, mu, logvar = model(mrna, rppa, mut)
                kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
            else:
                x_hat_mrna, x_hat_rppa, x_hat_mut = model(mrna, rppa, mut)
                kl_loss = 0
                
            loss_mrna = criterion(x_hat_mrna, mrna)
            loss_rppa = criterion(x_hat_rppa, rppa)
            loss_mut = criterion(x_hat_mut, mut)
            
            loss = (w_mrna * loss_mrna) + (w_rppa * loss_rppa) + (w_mut * loss_mut) + kl_loss
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            
        train_loss /= len(train_loader)
        
        # Validation
        model.eval()
        val_loss = 0
        with torch.no_grad():
            for mrna, rppa, mut in val_loader:
                mrna, rppa, mut = mrna.to(device), rppa.to(device), mut.to(device)
                
                if args.variational:
                    x_hat_mrna, x_hat_rppa, x_hat_mut, mu, logvar = model(mrna, rppa, mut)
                    kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
                else:
                    x_hat_mrna, x_hat_rppa, x_hat_mut = model(mrna, rppa, mut)
                    kl_loss = 0
                    
                loss_mrna = criterion(x_hat_mrna, mrna)
                loss_rppa = criterion(x_hat_rppa, rppa)
                loss_mut = criterion(x_hat_mut, mut)
                loss = (w_mrna * loss_mrna) + (w_rppa * loss_rppa) + (w_mut * loss_mut) + kl_loss
                val_loss += loss.item()
                
        val_loss /= len(val_loader)
        scheduler.step(val_loss)
        
        print(f"Epoch {epoch+1}/{args.epochs} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")
        history.append({'epoch': epoch, 'train_loss': train_loss, 'val_loss': val_loss})
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), f'models/{args.cohort}_best_model.pth')
            print(f"-> Saved new best model (val loss: {val_loss:.4f})")
            
    pd.DataFrame(history).to_csv(f'models/{args.cohort}_training_history.csv', index=False)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cohort', type=str, default='BRCA')
    parser.add_argument('--epochs', type=int, default=100)
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--lr', type=float, default=1e-3)
    parser.add_argument('--variational', action='store_true')
    args = parser.parse_args()
    train(args)
