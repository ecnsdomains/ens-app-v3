# ECNS Self-Hosted Subgraph Infrastructure

Complete guide for deploying Graph Node infrastructure on Ethereum Classic with a shared archival node.

## Overview

Since The Graph Protocol does not support Ethereum Classic, ECNS requires self-hosted infrastructure:

1. **Archival Node** - Full historical ETC blockchain data (shared across all projects)
2. **Graph Node** - Indexes blockchain data based on subgraph definitions
3. **PostgreSQL** - Stores indexed subgraph data
4. **IPFS** - Hosts subgraph manifests and schemas
5. **Nginx** - Reverse proxy with IP whitelisting for security

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
│  (ECNS App, ETCswap, etc. - whitelisted IPs only)          │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│         (IP Whitelist, Rate Limiting, SSL/TLS)              │
└────────────┬────────────────────────────────────────────────┘
             │
             ├──→ Graph Node (GraphQL API :8000)
             │    ├─→ PostgreSQL (:5432)
             │    ├─→ IPFS (:5001)
             │    └─→ Archival Node RPC (:8545)
             │
             └──→ Archival Node RPC (:8545)
                  └─→ Blockchain Data (archive mode)
```

---

## Infrastructure Requirements

### Hardware Specifications

#### Archival Node (Shared)

**Minimum Specs:**
| Component | Requirement | Notes |
|-----------|-------------|-------|
| CPU | 8 cores (16 threads) | Intel Xeon or AMD EPYC |
| RAM | 32 GB | 64 GB recommended |
| Storage | 2 TB NVMe SSD | ETC archive ~1.5TB + growth |
| Bandwidth | 1 Gbps | Unmetered preferred |
| Network | 100+ peers | Good connectivity essential |

**Recommended VPS:**
- Hetzner AX52: AMD Ryzen 7 3700X, 64GB RAM, 2x 1TB NVMe RAID1 (~€50/month)
- OVH Advance-4: Intel Xeon, 64GB RAM, 2TB NVMe (~€80/month)
- Contabo VPS XL: 12 vCPU, 60GB RAM, 1.6TB NVMe (~€35/month)

#### Graph Node Server

**Minimum Specs:**
| Component | Requirement | Notes |
|-----------|-------------|-------|
| CPU | 4 cores | 8 cores recommended |
| RAM | 16 GB | 32 GB recommended for multiple subgraphs |
| Storage | 500 GB SSD | PostgreSQL database growth |
| Bandwidth | 1 Gbps | Queries can be bandwidth-intensive |

**Recommended VPS:**
- Hetzner CPX41: 8 vCPU, 16GB RAM, 240GB NVMe (~€20/month)
- DigitalOcean Droplet: 8 vCPU, 32GB RAM, 200GB SSD (~$80/month)
- Vultr High Frequency: 6 vCPU, 16GB RAM, 384GB NVMe (~$96/month)

**Total Monthly Cost:** ~$70-130/month (€65-115) for both servers

---

## Software Stack

### Archival Node Options

#### Option 1: core-geth (Recommended)

**Pros:**
- Battle-tested, stable
- Full ETC support with archive mode
- Currently running locally (familiar)
- Active maintenance

**Cons:**
- Go-based (higher memory usage)
- Slower sync than some alternatives

**Installation:**
```bash
# Download latest release
wget https://github.com/etclabscore/core-geth/releases/download/v1.12.20/core-geth-linux-amd64-v1.12.20.tar.gz
tar -xzf core-geth-linux-amd64-v1.12.20.tar.gz
sudo mv geth /usr/local/bin/geth-etc
```

**Configuration:**
```bash
# Create data directory
sudo mkdir -p /data/etc-archive
sudo chown -R etcnode:etcnode /data/etc-archive

# Start archival node
geth-etc \
  --classic \
  --datadir /data/etc-archive \
  --gcmode archive \
  --syncmode full \
  --http \
  --http.addr 127.0.0.1 \
  --http.port 8545 \
  --http.api eth,net,web3,debug,txpool \
  --http.vhosts '*' \
  --ws \
  --ws.addr 127.0.0.1 \
  --ws.port 8546 \
  --ws.api eth,net,web3 \
  --cache 8192 \
  --maxpeers 100
```

#### Option 2: Fukuii (Future Alternative)

**Pros:**
- Scala/JVM-based (potentially better memory management)
- Modern architecture
- ECNS already familiar with codebase

**Cons:**
- Alpha stage (not production-ready yet)
- Nightly builds broken
- Requires building from source

**Current Status:** Not recommended for production archival node until stable release

---

### Graph Node Stack

#### Graph Node

**Version:** graph-node v0.34.0 (latest stable)

**Installation:**
```bash
# Install dependencies
sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev libpq-dev postgresql-client

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Clone and build Graph Node
git clone https://github.com/graphprotocol/graph-node
cd graph-node
git checkout v0.34.0
cargo build --release

# Install binary
sudo cp target/release/graph-node /usr/local/bin/
```

#### PostgreSQL

**Version:** PostgreSQL 16 (latest LTS)

**Installation:**
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Install PostgreSQL 16
sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16

# Configure for Graph Node
sudo -u postgres psql -c "CREATE USER graph WITH PASSWORD 'changeme';"
sudo -u postgres psql -c "CREATE DATABASE graph;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE graph TO graph;"
```

**PostgreSQL Tuning:**
```bash
# Edit /etc/postgresql/16/main/postgresql.conf
sudo nano /etc/postgresql/16/main/postgresql.conf

# Recommended settings for Graph Node:
shared_buffers = 8GB             # 25% of total RAM
effective_cache_size = 24GB       # 75% of total RAM
maintenance_work_mem = 2GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1            # For SSD storage
effective_io_concurrency = 200
work_mem = 64MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
```

#### IPFS

**Version:** Kubo v0.27.0 (official IPFS implementation)

**Installation:**
```bash
# Download Kubo
wget https://dist.ipfs.tech/kubo/v0.27.0/kubo_v0.27.0_linux-amd64.tar.gz
tar -xzf kubo_v0.27.0_linux-amd64.tar.gz
cd kubo
sudo bash install.sh

# Initialize IPFS
ipfs init

# Configure for Graph Node
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001
ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8080

# Start IPFS daemon
ipfs daemon &
```

---

## Deployment Guide

### Step 1: Deploy Archival Node

**1.1. Provision VPS:**
- Choose provider (Hetzner recommended for price/performance)
- Select server specs (8 cores, 32GB RAM, 2TB NVMe)
- Ubuntu 24.04 LTS
- Add SSH key
- Configure firewall (allow 22, 30303)

**1.2. Initial Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create dedicated user
sudo useradd -m -s /bin/bash etcnode
sudo usermod -aG sudo etcnode

# Install dependencies
sudo apt install -y build-essential git wget curl
```

**1.3. Install core-geth:**
```bash
# Download and install
wget https://github.com/etclabscore/core-geth/releases/download/v1.12.20/core-geth-linux-amd64-v1.12.20.tar.gz
tar -xzf core-geth-linux-amd64-v1.12.20.tar.gz
sudo mv geth /usr/local/bin/geth-etc
sudo chmod +x /usr/local/bin/geth-etc

# Verify installation
geth-etc version
```

**1.4. Create systemd service:**

Create `/etc/systemd/system/etc-archive.service`:

```ini
[Unit]
Description=Ethereum Classic Archival Node
After=network.target

[Service]
Type=simple
User=etcnode
Group=etcnode
ExecStart=/usr/local/bin/geth-etc \
  --classic \
  --datadir /data/etc-archive \
  --gcmode archive \
  --syncmode full \
  --http \
  --http.addr 127.0.0.1 \
  --http.port 8545 \
  --http.api eth,net,web3,debug,txpool \
  --http.vhosts '*' \
  --ws \
  --ws.addr 127.0.0.1 \
  --ws.port 8546 \
  --ws.api eth,net,web3 \
  --cache 8192 \
  --maxpeers 100 \
  --metrics \
  --metrics.addr 127.0.0.1 \
  --metrics.port 6060
Restart=on-failure
RestartSec=10
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

**1.5. Start archival node:**
```bash
# Create data directory
sudo mkdir -p /data/etc-archive
sudo chown -R etcnode:etcnode /data/etc-archive

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable etc-archive
sudo systemctl start etc-archive

# Monitor sync progress
sudo journalctl -u etc-archive -f
```

**Sync Time:** ~7-14 days for full archive sync (depending on hardware)

---

### Step 2: Deploy Graph Node Infrastructure

**2.1. Provision VPS:**
- Hetzner CPX41 or similar
- Ubuntu 24.04 LTS
- Configure firewall (allow 22, 80, 443, 8000)

**2.2. Install PostgreSQL:**
```bash
# Install PostgreSQL 16
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER graph WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE graph;
GRANT ALL PRIVILEGES ON DATABASE graph TO graph;
\c graph
CREATE EXTENSION pg_trgm;
CREATE EXTENSION btree_gist;
EOF

# Tune PostgreSQL (see configuration above)
sudo nano /etc/postgresql/16/main/postgresql.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

**2.3. Install IPFS:**
```bash
# Download and install Kubo
wget https://dist.ipfs.tech/kubo/v0.27.0/kubo_v0.27.0_linux-amd64.tar.gz
tar -xzf kubo_v0.27.0_linux-amd64.tar.gz
cd kubo
sudo bash install.sh

# Initialize IPFS
sudo useradd -m -s /bin/bash ipfs
sudo -u ipfs ipfs init

# Configure IPFS
sudo -u ipfs ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001
sudo -u ipfs ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8080

# Create systemd service
sudo tee /etc/systemd/system/ipfs.service > /dev/null <<EOF
[Unit]
Description=IPFS Daemon
After=network.target

[Service]
Type=simple
User=ipfs
Group=ipfs
ExecStart=/usr/local/bin/ipfs daemon
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Start IPFS
sudo systemctl daemon-reload
sudo systemctl enable ipfs
sudo systemctl start ipfs
```

**2.4. Install Graph Node:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install dependencies
sudo apt install -y build-essential pkg-config libssl-dev libpq-dev

# Clone and build Graph Node
git clone https://github.com/graphprotocol/graph-node
cd graph-node
git checkout v0.34.0
cargo build --release

# Install binary
sudo cp target/release/graph-node /usr/local/bin/
```

**2.5. Configure Graph Node:**

Create `/etc/graph-node/config.toml`:

```toml
[store]
[store.primary]
connection = "postgresql://graph:PASSWORD@localhost:5432/graph"
pool_size = 10

[chains]
ingestor = "etc_mainnet"

[chains.etc_mainnet]
shard = "primary"
provider = [
  { label = "etc-archive", url = "http://ARCHIVAL_NODE_IP:8545", features = ["archive", "traces"] }
]

[deployment]
[[deployment.rule]]
shard = "primary"
indexers = [ "default" ]
```

**2.6. Create systemd service:**

Create `/etc/systemd/system/graph-node.service`:

```ini
[Unit]
Description=Graph Node
After=network.target postgresql.service ipfs.service

[Service]
Type=simple
User=graph
Group=graph
Environment="GRAPH_NODE_CONFIG=/etc/graph-node/config.toml"
Environment="postgres_host=localhost"
Environment="postgres_user=graph"
Environment="postgres_pass=PASSWORD"
Environment="postgres_db=graph"
Environment="ipfs=localhost:5001"
Environment="ethereum=etc:http://ARCHIVAL_NODE_IP:8545"
Environment="GRAPH_LOG=info"
ExecStart=/usr/local/bin/graph-node \
  --postgres-url postgresql://graph:PASSWORD@localhost/graph \
  --ethereum-rpc etc:http://ARCHIVAL_NODE_IP:8545 \
  --ipfs localhost:5001 \
  --node-id default
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**2.7. Start Graph Node:**
```bash
# Create user and config directory
sudo useradd -m -s /bin/bash graph
sudo mkdir -p /etc/graph-node
sudo chown -R graph:graph /etc/graph-node

# Start service
sudo systemctl daemon-reload
sudo systemctl enable graph-node
sudo systemctl start graph-node

# Monitor logs
sudo journalctl -u graph-node -f
```

---

### Step 3: Configure Nginx Reverse Proxy with IP Whitelisting

**3.1. Install Nginx:**
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

**3.2. Configure IP Whitelist:**

Create `/etc/nginx/conf.d/whitelist.conf`:

```nginx
# Whitelisted IPs for ECNS projects
geo $whitelist {
    default 0;

    # Vercel IP ranges (for ECNS app)
    76.76.21.0/24 1;      # Vercel anycast
    76.76.21.21 1;

    # Office/Development IPs
    YOUR_OFFICE_IP/32 1;
    YOUR_HOME_IP/32 1;

    # ETCswap deployment IPs
    # Add as needed

    # Emergency access (remove in production)
    127.0.0.1 1;
}
```

**3.3. Configure Graph Node endpoint:**

Create `/etc/nginx/sites-available/subgraph`:

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=graphql:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=graphql_burst:10m rate=100r/s;

upstream graph_node {
    server 127.0.0.1:8000;
    keepalive 32;
}

server {
    listen 80;
    server_name subgraph.ecns.domains;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name subgraph.ecns.domains;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/subgraph.ecns.domains/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/subgraph.ecns.domains/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # IP Whitelist check
    if ($whitelist = 0) {
        return 403;
    }

    # GraphQL endpoint
    location /subgraphs/name/ecns/registry {
        # Rate limiting
        limit_req zone=graphql burst=20 nodelay;
        limit_req zone=graphql_burst burst=100 nodelay;

        # CORS headers
        add_header Access-Control-Allow-Origin https://app.ecns.domains always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

        # Handle preflight
        if ($request_method = OPTIONS) {
            return 204;
        }

        # Proxy to Graph Node
        proxy_pass http://graph_node;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint (for monitoring)
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

**3.4. Configure Archival RPC endpoint:**

Create `/etc/nginx/sites-available/rpc`:

```nginx
# Rate limiting for RPC
limit_req_zone $binary_remote_addr zone=rpc:10m rate=10r/s;

upstream etc_rpc {
    server ARCHIVAL_NODE_IP:8545;
    keepalive 32;
}

server {
    listen 80;
    server_name rpc.ecns.domains;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rpc.ecns.domains;

    ssl_certificate /etc/letsencrypt/live/rpc.ecns.domains/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rpc.ecns.domains/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # IP Whitelist
    if ($whitelist = 0) {
        return 403;
    }

    location / {
        limit_req zone=rpc burst=20 nodelay;

        # CORS
        add_header Access-Control-Allow-Origin https://app.ecns.domains always;
        add_header Access-Control-Allow-Methods "POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;

        if ($request_method = OPTIONS) {
            return 204;
        }

        # Proxy to archival node
        proxy_pass http://etc_rpc;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Timeouts (archival queries can be slow)
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

**3.5. Enable sites and obtain SSL:**
```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/subgraph /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/rpc /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Obtain SSL certificates
sudo certbot --nginx -d subgraph.ecns.domains -d rpc.ecns.domains

# Reload Nginx
sudo systemctl reload nginx
```

---

## Subgraph Development

### ECNS Registry Subgraph

Create subgraph for ECNS contract events:

**Directory structure:**
```
ecns-subgraph/
├── subgraph.yaml
├── schema.graphql
├── src/
│   └── mapping.ts
└── package.json
```

**subgraph.yaml:**
```yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: BaseRegistrarImplementation
    network: etc
    source:
      address: "0x0000000000000000000000000000000000000000"  # Update with actual address
      abi: BaseRegistrarImplementation
      startBlock: 0  # Update with deployment block
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Domain
        - Registration
        - NameRegistered
        - NameRenewed
        - Transfer
      abis:
        - name: BaseRegistrarImplementation
          file: ./abis/BaseRegistrarImplementation.json
      eventHandlers:
        - event: NameRegistered(uint256,address,uint256)
          handler: handleNameRegistered
        - event: NameRenewed(uint256,uint256)
          handler: handleNameRenewed
        - event: Transfer(indexed address,indexed address,indexed uint256)
          handler: handleTransfer
      file: ./src/mapping.ts
```

**schema.graphql:**
```graphql
type Domain @entity {
  id: ID!
  name: String
  labelName: String
  labelhash: Bytes
  owner: Account!
  registrant: Account
  expiryDate: BigInt
  createdAt: BigInt!
  registrations: [Registration!]! @derivedFrom(field: "domain")
}

type Account @entity {
  id: ID!
  domains: [Domain!]! @derivedFrom(field: "owner")
  registrations: [Registration!]! @derivedFrom(field: "registrant")
}

type Registration @entity {
  id: ID!
  domain: Domain!
  registrationDate: BigInt!
  expiryDate: BigInt!
  cost: BigInt
  registrant: Account!
  labelName: String
}
```

**Deploy subgraph:**
```bash
# Install Graph CLI
npm install -g @graphprotocol/graph-cli

# Generate types
graph codegen

# Build subgraph
graph build

# Create subgraph on Graph Node
graph create ecns/registry --node http://localhost:8020

# Deploy subgraph
graph deploy ecns/registry \
  --ipfs http://localhost:5001 \
  --node http://localhost:8020 \
  --version-label v0.0.1
```

---

## Monitoring & Maintenance

### Metrics Collection

**Install Prometheus + Grafana:**

```bash
# Install Prometheus
sudo apt install -y prometheus

# Configure Prometheus to scrape Graph Node metrics
sudo tee -a /etc/prometheus/prometheus.yml > /dev/null <<EOF
  - job_name: 'graph-node'
    static_configs:
      - targets: ['localhost:8040']

  - job_name: 'etc-archive'
    static_configs:
      - targets: ['ARCHIVAL_NODE_IP:6060']
EOF

# Restart Prometheus
sudo systemctl restart prometheus

# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y grafana

# Start Grafana
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

**Access Grafana:** http://SERVER_IP:3000 (default login: admin/admin)

**Import Graph Node dashboard:** https://grafana.com/grafana/dashboards/13922

### Health Checks

**Archival node health:**
```bash
# Check sync status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://ARCHIVAL_NODE_IP:8545

# Check latest block
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://ARCHIVAL_NODE_IP:8545
```

**Graph Node health:**
```bash
# GraphQL health query
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ indexingStatuses { subgraph synced health } }"}' \
  http://localhost:8030/graphql
```

### Backup Strategy

**PostgreSQL backups:**
```bash
# Daily automated backup
sudo crontab -e -u postgres

# Add cron job (runs at 2 AM daily)
0 2 * * * pg_dump graph | gzip > /backup/graph-$(date +\%Y\%m\%d).sql.gz

# Keep only last 7 days
0 3 * * * find /backup -name "graph-*.sql.gz" -mtime +7 -delete
```

**Archival node state backup:**
- Use VPS snapshot feature (Hetzner, DigitalOcean)
- Weekly snapshots recommended
- Keep 2-4 snapshots for rollback

---

## Cost Summary

| Component | Provider | Specs | Cost/month |
|-----------|----------|-------|------------|
| **Archival Node** | Hetzner AX52 | Ryzen 7, 64GB, 2TB NVMe | €50 (~$55) |
| **Graph Node** | Hetzner CPX41 | 8 vCPU, 16GB, 240GB | €20 (~$22) |
| **Bandwidth** | Included | 1 Gbps unmetered | €0 |
| **Backups** | Hetzner Snapshots | Weekly | €5 (~$5.50) |
| **Domain** | Cloudflare DNS | subgraph.ecns.domains | €0 (free) |
| **SSL** | Let's Encrypt | Auto-renewal | €0 (free) |
| **Total** | - | - | **~$82/month** |

**Alternative (Budget):**
- Contabo VPS XL (archival): ~€35/month
- Contabo VPS M (Graph Node): ~€15/month
- **Total: ~$55/month**

---

## Security Best Practices

1. **IP Whitelisting:**
   - Only allow known application IPs
   - Regularly audit whitelist
   - Remove test/dev IPs in production

2. **Rate Limiting:**
   - 10 requests/second per IP (normal)
   - 100 requests/second burst
   - Adjust based on usage patterns

3. **Firewall Configuration:**
   ```bash
   # UFW rules
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw allow 30303/tcp # ETC P2P (archival node only)
   sudo ufw enable
   ```

4. **SSH Hardening:**
   - Disable password authentication
   - Use SSH keys only
   - Enable fail2ban
   - Use non-standard SSH port (optional)

5. **Regular Updates:**
   - OS security patches weekly
   - Graph Node updates monthly
   - core-geth updates when released

---

## Troubleshooting

### Archival Node Issues

**Sync stuck:**
```bash
# Check peers
geth-etc attach http://localhost:8545 --exec "admin.peers.length"

# If low peers, add bootnodes manually
```

**High memory usage:**
```bash
# Reduce cache size
--cache 4096  # Reduce from 8192
```

### Graph Node Issues

**Subgraph not syncing:**
```bash
# Check Graph Node logs
sudo journalctl -u graph-node -f

# Common issues:
# - Incorrect RPC URL
# - Archival node not synced
# - PostgreSQL connection issues
```

**PostgreSQL out of space:**
```bash
# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('graph'));"

# Vacuum database
sudo -u postgres psql graph -c "VACUUM FULL;"
```

---

## Deployment Checklist

- [ ] Provision archival node VPS (8 cores, 32GB RAM, 2TB NVMe)
- [ ] Install and sync core-geth in archive mode (~7-14 days)
- [ ] Provision Graph Node VPS (4-8 cores, 16-32GB RAM, 500GB SSD)
- [ ] Install PostgreSQL 16 with tuning
- [ ] Install IPFS daemon
- [ ] Build and install Graph Node
- [ ] Configure nginx with IP whitelist
- [ ] Obtain SSL certificates (Let's Encrypt)
- [ ] Deploy ECNS registry subgraph
- [ ] Configure monitoring (Prometheus + Grafana)
- [ ] Set up automated backups
- [ ] Test GraphQL queries from whitelisted IPs
- [ ] Update ECNS app to use subgraph endpoint
- [ ] Monitor performance for 1 week
- [ ] Document operational procedures

---

**Last Updated:** 2026-02-12
**Maintainer:** ECNS Development Team
**Estimated Setup Time:** 2-3 weeks (including archival node sync)
