# Arcana Deployment Guide

Complete guide for deploying Arcana to production networks.

## Prerequisites

- Foundry installed
- Python 3.11+
- Node.js 18+
- Docker installed
- iExec CLI installed: `npm install -g @iexec/iapp`
- DockerHub account
- Wallet with funds:
  - Arbitrum Sepolia ETH (for gas)
  - RLC tokens on Bellecour (for iExec)

## Step 1: Configure Credentials

### A. Smart Contracts

Create `contracts/.env`:
```bash
PRIVATE_KEY=your_private_key_here
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your_arbiscan_api_key
ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
```

### B. iApp Configuration

Update `iapp/iapp.config.json`:
```json
{
  "defaultChain": "bellecour",
  "projectName": "arcana-dividend-calculator",
  "template": "Python",
  "dockerhubUsername": "your_dockerhub_username",
  "walletPrivateKey": "your_wallet_private_key",
  "appSecret": "",
  "dockerhubAccessToken": "your_dockerhub_token"
}
```

Get DockerHub access token:
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Copy the token

### C. Frontend Environment

Create `frontend/.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS=
NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS=
NEXT_PUBLIC_PAYMASTER_ADDRESS=
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=
NEXT_PUBLIC_IAPP_ADDRESS=
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_IEXEC_CHAIN_ID=134
```

## Step 2: Deploy Smart Contracts

```bash
cd contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test -vv

# Deploy to Arbitrum Sepolia
forge script script/Deploy.s.sol \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --broadcast \
  --verify

# Save the output addresses!
# Example output:
# ArcanaToken: 0x1234...
# PaymentToken: 0x5678...
# DividendPool: 0x9abc...
# ArcanaPaymaster: 0xdef0...
```

**Important:** Save all contract addresses - you'll need them later.

## Step 3: Deploy iApp to iExec

### A. Local Testing First

```bash
cd ../iapp

# Install Python dependencies
pip install -r requirements.txt

# Create test data
mkdir -p test_input
cat > test_input/holder1.json << EOF
{
  "holder": "0x1234567890123456789012345678901234567890",
  "balance": 1000000000
}
EOF

# Test locally
IEXEC_IN=./test_input IEXEC_OUT=./test_output IEXEC_ARGS="1000000000" python src/app.py

# Verify output
cat test_output/result.json
```

### B. Build Docker Image

```bash
# Build image
docker build -t your_dockerhub_username/arcana-dividend-calculator:latest .

# Test Docker image locally
docker run \
  -v $(pwd)/test_input:/iexec_in \
  -v $(pwd)/test_output:/iexec_out \
  -e IEXEC_ARGS="1000000000" \
  your_dockerhub_username/arcana-dividend-calculator:latest

# Push to DockerHub
docker login
docker push your_dockerhub_username/arcana-dividend-calculator:latest
```

### C. Deploy to iExec Network

```bash
# Make sure iapp.config.json is configured correctly

# Import or select wallet
iapp wallet import
# OR
iapp wallet select

# Get RLC tokens from faucet
# Visit: https://faucet.iex.ec/

# Deploy app
iapp deploy

# Save the deployed app address!
# It will be in: cache/bellecour/deployments.json
```

Example `deployments.json`:
```json
[
  {
    "image": "carlosisraelj/arcana-dividend-calculator:0.0.1-tee-scone-5.9.1-v16-prod-abc123",
    "app": "0x69FA601DcF9264929d68c80b125f33b225505B9E",
    "owner": "0x648a3e5510f55B4995fA5A22cCD62e2586ACb901",
    "date": "2026-01-30T12:00:00.000Z"
  }
]
```

## Step 4: Update Frontend Configuration

Update `frontend/.env.local` with all addresses:

```bash
# Contract addresses from Step 2
NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS=0x1234...
NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS=0x5678...
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x9abc...
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0xdef0...

# iApp address from Step 3
NEXT_PUBLIC_IAPP_ADDRESS=0x69FA...

# Other configs
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_IEXEC_CHAIN_ID=134
```

## Step 5: Deploy Frontend

### A. Local Testing

```bash
cd ../frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Visit http://localhost:3000 and test:
# 1. Connect wallet
# 2. Protect balance
# 3. Check distribution status
```

### B. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# https://vercel.com/your-project/settings/environment-variables
```

Or use Vercel GitHub integration:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Step 6: End-to-End Testing

### A. Mint Test Tokens

```bash
cd contracts

# Mint ARCANA tokens to test users
cast send $ARCANA_TOKEN_ADDRESS \
  "mint(address,uint256)" \
  YOUR_ADDRESS \
  1000000000 \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY

# Mint payment tokens for dividend pool
cast send $PAYMENT_TOKEN_ADDRESS \
  "mint(address,uint256)" \
  YOUR_ADDRESS \
  1000000000 \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY
```

### B. Test Frontend Flow

1. **Protect Balance**
   - Open frontend app
   - Connect wallet
   - Go to "Protect Balance" tab
   - Enter balance (e.g., 1000)
   - Click "Protect Balance"
   - Click "Grant Access for Distribution"

2. **Run Distribution (Backend)**
   ```bash
   cd iapp

   # Run iApp on iExec network
   iapp run YOUR_IAPP_ADDRESS --args "1000000000"

   # Wait for task to complete
   # Check result with task ID
   iapp debug TASK_ID
   ```

3. **Publish Merkle Root**
   ```bash
   cd contracts

   # Approve payment tokens
   cast send $PAYMENT_TOKEN_ADDRESS \
     "approve(address,uint256)" \
     $DIVIDEND_POOL_ADDRESS \
     1000000000 \
     --rpc-url $ARBITRUM_SEPOLIA_RPC \
     --private-key $PRIVATE_KEY

   # Get merkle root from iApp result
   MERKLE_ROOT=0xabc123...  # From iApp output

   # Start distribution round
   cast send $DIVIDEND_POOL_ADDRESS \
     "startDistributionRound(bytes32,uint256)" \
     $MERKLE_ROOT \
     1000000000 \
     --rpc-url $ARBITRUM_SEPOLIA_RPC \
     --private-key $PRIVATE_KEY
   ```

4. **Claim Dividend (Frontend)**
   - Go to "Distribution" tab - verify round is active
   - Go to "Claim" tab
   - Enter claim data from iApp result
   - Click "Claim Dividend (Gasless)"
   - Sign transaction
   - Verify payment received

## Step 7: Update Documentation

Update the following with deployed addresses:

1. `README.md` - Contract addresses section
2. `PROJECT_SUMMARY.md` - Deployment section
3. `frontend/src/lib/contracts.ts` - Export actual addresses

## Troubleshooting

### Issue: Contract deployment fails
**Solution:**
- Check you have enough Arbitrum Sepolia ETH
- Verify RPC URL is correct
- Try with `--legacy` flag if gas estimation fails

### Issue: iApp deployment fails
**Solution:**
- Ensure Docker image is pushed to DockerHub
- Check you have RLC tokens on Bellecour
- Verify `iapp.config.json` credentials are correct

### Issue: iApp execution fails
**Solution:**
- Test Docker image locally first
- Check IEXEC_IN and IEXEC_OUT paths
- Verify protected data format
- Check iApp logs with `iapp debug TASK_ID`

### Issue: Frontend can't connect
**Solution:**
- Verify all environment variables are set
- Check contract addresses are correct
- Ensure wallet is on Arbitrum Sepolia network
- Clear browser cache and reconnect wallet

### Issue: Gasless claims don't work
**Solution:**
- Ensure Paymaster has ETH deposited
- Check `getDeposit()` on Paymaster contract
- Deposit more ETH with `deposit()` function
- Verify Paymaster address is correct in frontend

## Production Checklist

Before going to mainnet:

- [ ] Full security audit of smart contracts
- [ ] Gas optimization review
- [ ] Frontend security audit
- [ ] Load testing with many holders
- [ ] Backup and recovery procedures
- [ ] Monitoring and alerting setup
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] Community testing feedback

## Useful Commands

### Check Contract State
```bash
# Current round
cast call $DIVIDEND_POOL_ADDRESS "currentRound()" --rpc-url $ARBITRUM_SEPOLIA_RPC

# Round info
cast call $DIVIDEND_POOL_ADDRESS "getRoundInfo(uint256)" 1 --rpc-url $ARBITRUM_SEPOLIA_RPC

# Has claimed
cast call $DIVIDEND_POOL_ADDRESS "hasClaimed(uint256,address)" 1 YOUR_ADDRESS --rpc-url $ARBITRUM_SEPOLIA_RPC
```

### Check iApp Status
```bash
# List deployments
cat iapp/cache/bellecour/deployments.json

# List runs
cat iapp/cache/bellecour/runs.json

# Debug task
iapp debug TASK_ID
```

### Monitor Frontend
```bash
# Check Vercel logs
vercel logs

# View build logs
vercel logs --output
```

## Network Information

### Arbitrum Sepolia Testnet
- Chain ID: 421614
- RPC: https://sepolia-rollup.arbitrum.io/rpc
- Explorer: https://sepolia.arbiscan.io/
- Faucet: https://faucet.quicknode.com/arbitrum/sepolia

### iExec Bellecour Testnet
- Chain ID: 134
- Explorer: https://explorer.iex.ec/bellecour
- Faucet: https://faucet.iex.ec/

## Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [iExec Documentation](https://docs.iex.ec/)
- [Vercel Documentation](https://vercel.com/docs)
- [Arbitrum Documentation](https://docs.arbitrum.io/)

---

**Good luck with deployment! 🚀**
