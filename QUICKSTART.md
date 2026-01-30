# Arcana - Quick Start Guide

Get Arcana up and running in minutes!

## Prerequisites

Install the following tools:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.11+)
- [Foundry](https://getfoundry.sh/)
- [Git](https://git-scm.com/)

## 1. Clone Repository

```bash
git clone https://github.com/carlos-israelj/Arcana.git
cd Arcana
```

## 2. Smart Contracts Setup

```bash
cd contracts

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install eth-infinitism/account-abstraction

# Compile contracts
forge build

# Run tests
forge test -vv

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your_arbiscan_api_key
ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
EOF

# Deploy to Arbitrum Sepolia
forge script script/Deploy.s.sol --rpc-url $ARBITRUM_SEPOLIA_RPC --broadcast --verify

# Save the deployed addresses!
```

## 3. iApp Setup

```bash
cd ../iapp

# Install Python dependencies
pip install -r requirements.txt

# Test locally
mkdir -p test_input test_output

# Create test data
cat > test_input/holder1.json << EOF
{
  "holder": "0x1234567890123456789012345678901234567890",
  "balance": 1000000000
}
EOF

cat > test_input/holder2.json << EOF
{
  "holder": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "balance": 500000000
}
EOF

# Run locally
IEXEC_IN=./test_input IEXEC_OUT=./test_output IEXEC_ARGS="1000000000" python src/app.py

# Check output
cat test_output/result.json

# Build Docker image
docker build -t arcana-iapp .

# Test Docker image
docker run -v $(pwd)/test_input:/iexec_in -v $(pwd)/test_output:/iexec_out -e IEXEC_ARGS="1000000000" arcana-iapp

# For deployment to iExec, follow:
# https://docs.iex.ec/for-developers/your-first-app
```

## 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract Addresses (from step 2)
NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS=0x...
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x...

# iExec iApp Address (from step 3)
NEXT_PUBLIC_IAPP_ADDRESS=0x...

# Network
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_IEXEC_CHAIN_ID=134
EOF

# Run development server
npm run dev

# Visit http://localhost:3000
```

## 5. Test the Full Flow

### A. Mint Test Tokens

```bash
cd contracts

# Mint ARCANA tokens to test accounts
cast send $ARCANA_TOKEN_ADDRESS "mint(address,uint256)" 0xYourAddress 1000000000 \
  --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY

# Mint payment tokens for distribution
cast send $PAYMENT_TOKEN_ADDRESS "mint(address,uint256)" 0xYourAddress 1000000000 \
  --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY
```

### B. Protect Balances (Frontend)

1. Open http://localhost:3000
2. Connect wallet
3. Go to "1. Protect Balance" tab
4. Enter balance (e.g., 1000)
5. Click "Protect Balance"
6. Click "Grant Access for Distribution"

### C. Run Distribution (Admin)

```bash
# Approve payment tokens
cast send $PAYMENT_TOKEN_ADDRESS "approve(address,uint256)" \
  $DIVIDEND_POOL_ADDRESS 1000000000 \
  --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY

# Get merkle root from iApp output
MERKLE_ROOT=0x... # From test_output/result.json

# Start distribution round
cast send $DIVIDEND_POOL_ADDRESS "startDistributionRound(bytes32,uint256)" \
  $MERKLE_ROOT 1000000000 \
  --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY
```

### D. Claim Dividend (Frontend)

1. Go to "2. Distribution" tab - verify round is active
2. Go to "3. Claim" tab
3. Enter claim data manually (from iApp result):
   - Amount: Copy from `result.json`
   - Proof: Copy proof array
4. Click "Claim Dividend"
5. Sign transaction (gasless!)

## Common Issues

### Issue: Foundry not found
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Issue: Python dependencies fail
```bash
python -m pip install --upgrade pip
pip install pycryptodome
```

### Issue: Frontend fails to build
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Docker build fails
```bash
docker system prune -a
docker build --no-cache -t arcana-iapp .
```

## Next Steps

1. **Read Documentation**: Check `/docs` folder for detailed guides
2. **Watch Demo Video**: [Link TBD]
3. **Deploy to Production**: Follow mainnet deployment guide
4. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md)

## Getting Help

- GitHub Issues: [Report bugs](https://github.com/carlos-israelj/Arcana/issues)
- Documentation: [Read full docs](./docs/)
- iExec Discord: [Get support](https://discord.gg/iexec)

## Resources

- [iExec Documentation](https://docs.iex.ec/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Next.js Docs](https://nextjs.org/docs)
- [RainbowKit](https://www.rainbowkit.com/)
- [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)

---

**Happy Building! 🚀**
