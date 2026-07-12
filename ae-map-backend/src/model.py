import torch
import torch.nn as nn
import torch.nn.functional as F

class EncoderBranch(nn.Module):
    def __init__(self, input_dim, dropout=0.2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(256, 128)
        )

    def forward(self, x):
        return self.net(x)

class DecoderBranch(nn.Module):
    def __init__(self, output_dim, dropout=0.2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(128, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(256, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(512, output_dim)
        )

    def forward(self, x):
        return self.net(x)

class MultiViewAutoencoder(nn.Module):
    def __init__(self, dim_mrna, dim_rppa, dim_mut, variational=False, dropout=0.2):
        super().__init__()
        self.variational = variational
        
        # Encoders
        self.enc_mrna = EncoderBranch(dim_mrna, dropout)
        self.enc_rppa = EncoderBranch(dim_rppa, dropout)
        self.enc_mut = EncoderBranch(dim_mut, dropout)
        
        # Shared Latent Bottleneck
        # If variational, output mean and logvar
        if self.variational:
            self.fc_mu = nn.Linear(128 * 3, 128)
            self.fc_logvar = nn.Linear(128 * 3, 128)
        else:
            self.shared = nn.Sequential(
                nn.Linear(128 * 3, 128),
                nn.BatchNorm1d(128),
                nn.ReLU()
            )
            
        # Decoders
        self.dec_mrna = DecoderBranch(dim_mrna, dropout)
        self.dec_rppa = DecoderBranch(dim_rppa, dropout)
        self.dec_mut = DecoderBranch(dim_mut, dropout)

    def encode(self, mrna, rppa, mut):
        z_mrna = self.enc_mrna(mrna)
        z_rppa = self.enc_rppa(rppa)
        z_mut = self.enc_mut(mut)
        
        # Concatenate encoded views
        z_concat = torch.cat([z_mrna, z_rppa, z_mut], dim=1)
        
        if self.variational:
            mu = self.fc_mu(z_concat)
            logvar = self.fc_logvar(z_concat)
            return mu, logvar
        else:
            z = self.shared(z_concat)
            return z

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z):
        x_hat_mrna = self.dec_mrna(z)
        x_hat_rppa = self.dec_rppa(z)
        x_hat_mut = self.dec_mut(z)
        return x_hat_mrna, x_hat_rppa, x_hat_mut

    def forward(self, mrna, rppa, mut):
        if self.variational:
            mu, logvar = self.encode(mrna, rppa, mut)
            z = self.reparameterize(mu, logvar)
            x_hat_mrna, x_hat_rppa, x_hat_mut = self.decode(z)
            return x_hat_mrna, x_hat_rppa, x_hat_mut, mu, logvar
        else:
            z = self.encode(mrna, rppa, mut)
            x_hat_mrna, x_hat_rppa, x_hat_mut = self.decode(z)
            return x_hat_mrna, x_hat_rppa, x_hat_mut
