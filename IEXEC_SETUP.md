# iExec Setup Guide for Arckana

Complete guide for setting up Arckana on iExec Arbitrum Sepolia testnet.

## Prerequisites

### 1. Get Tokens

You need RLC tokens to run confidential computing tasks on iExec.

**Step 1: Get RLC from iExec Faucet**
- Visit: https://explorer.iex.ec/arbitrum-mainnet/faucet
- Request testnet RLC tokens

**Step 2: Bridge RLC to Arbitrum Sepolia**
- Visit: https://portal.arbitrum.io/bridge
- Select: Sepolia → Arbitrum Sepolia
- Bridge your RLC tokens

**Step 3: Verify on Explorer**
- Check your balance: https://explorer.iex.ec/arbitrum-sepolia-testnet

### 2. Install iApp CLI

```bash
npm install -g @iexec/iapp
```

## Frontend Setup

### 1. DataProtector Configuration

The frontend is already configured with DataProtector and Arbitrum Sepolia experimental support.

Key configuration in `ProtectBalance.tsx`:

```typescript
const dataProtector = new IExecDataProtector(window.ethereum, {
  allowExperimentalNetworks: true, // Required for Arbitrum Sepolia
});
```

### 2. Network Configuration

iExec Arbitrum Sepolia configuration is in `frontend/src/lib/iexec-config.ts`:

```typescript
export const IEXEC_CONFIG = {
  chainId: 421614,
  name: 'arbitrum-sepolia-testnet',
  prodWorkerpoolAddress: '0xB967057a21dc6A66A29721d96b8Aa7454B7c383F',
  dataProtectorSubgraph: 'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/5YjRPLtjS6GH6bB4yY55Qg4HzwtRGQ8TaHtGf9UBWWd',
  ipfsGateway: 'https://ipfs-gateway.arbitrum-sepolia-testnet.iex.ec',
  ipfsUploadUrl: 'https://ipfs-upload.arbitrum-sepolia-testnet.iex.ec',
  isExperimental: true,
};
```

### 3. Protected Data Schema

Our protected data follows this schema:

```typescript
const protectedData = {
  holder: "0x...",     // Ethereum address
  balance: 1000000000  // Token balance (6 decimals)
};
```

## iApp Setup

### 1. Import Wallet

```bash
cd iapp
iapp wallet import <your-private-key>
```

Or select existing wallet:
```bash
iapp wallet select
```

### 2. Test Locally

Create test data:

```bash
mkdir -p test_input

# Create args.txt
echo "1000000000" > test_input/args.txt

# Create protectedData.json
cat > test_input/protectedData.json << EOF
{
  "holder": "0x1234567890123456789012345678901234567890",
  "balance": 1000000000
}
EOF
```

Run test:
```bash
iapp test
```

Check output:
```bash
cat output/result.json
```

### 3. Deploy to Arbitrum Sepolia

**Important:** Make sure `iapp.config.json` is configured:

```json
{
  "defaultChain": "arbitrum-sepolia-testnet",
  "projectName": "arcana-dividend-calculator",
  "template": "Python",
  "dockerhubUsername": "your_username",
  "walletPrivateKey": "your_private_key",
  "dockerhubAccessToken": "your_token"
}
```

Deploy:
```bash
iapp deploy --chain arbitrum-sepolia-testnet
```

Save the deployed app address from the output!

### 4. Check Deployment

View deployment info:
```bash
cat cache/arbitrum-sepolia-testnet/deployments.json
```

## Data Access Management

### 1. Using DataProtector (Automatic)

When you use `protectData()` and `grantAccess()` in the frontend, DataProtector automatically:
- Creates protected data
- Deploys orders on the network
- Manages access permissions

Example in `ProtectBalance.tsx`:

```typescript
// Protect data
const protectedData = await dataProtector.protectData({
  data: {
    holder: address,
    balance: parseInt(balance) * 1000000,
  },
  name: `Arckana Balance - ${address.slice(0, 8)}`,
});

// Grant access to iApp
const grantedAccess = await dataProtector.grantAccess({
  protectedData: protectedDataAddress,
  authorizedApp: IAPP_ADDRESS,
  authorizedUser: '0x0000000000000000000000000000000000000000',
  numberOfAccess: 1000,
});
```

This automatically handles order deployment and access management! ✅

## Running the iApp

### Option 1: With Protected Data (Recommended)

Since we use DataProtector, everything is managed automatically through the frontend.

The flow:
1. User protects balance in frontend
2. User grants access to iApp
3. Admin triggers distribution (backend/script)
4. iApp processes encrypted data in TEE
5. Results published on-chain

### Option 2: CLI Testing

For testing without frontend:

```bash
# Run with test data
iapp run <YOUR_APP_ADDRESS> --chain arbitrum-sepolia-testnet

# Run with arguments
iapp run <YOUR_APP_ADDRESS> --args "1000000000" --chain arbitrum-sepolia-testnet

# Debug a task
iapp debug <TASK_ID> --chain arbitrum-sepolia-testnet
```

## Important Addresses

### Arbitrum Sepolia Testnet

| Resource | Address/URL |
|----------|-------------|
| Workerpool | 0xB967057a21dc6A66A29721d96b8Aa7454B7c383F |
| Explorer | https://explorer.iex.ec/arbitrum-sepolia-testnet |
| IPFS Gateway | https://ipfs-gateway.arbitrum-sepolia-testnet.iex.ec |
| Subgraph | https://thegraph.arbitrum-sepolia-testnet.iex.ec/... |

## Workflow Summary

### For End Users:

1. **Connect Wallet** (Arbitrum Sepolia)
2. **Protect Balance**
   ```typescript
   // Frontend automatically uses DataProtector
   await dataProtector.protectData({...})
   ```
3. **Grant Access**
   ```typescript
   // Orders deployed automatically
   await dataProtector.grantAccess({...})
   ```
4. **Wait for Distribution** (Admin runs iApp)
5. **Claim Dividend** (Frontend with Merkle proof)

### For Admins/Developers:

1. **Deploy iApp**
   ```bash
   iapp deploy --chain arbitrum-sepolia-testnet
   ```
2. **Trigger Distribution**
   ```bash
   # Run iApp with dividend pool amount
   iapp run <APP_ADDRESS> --args "1000000000"
   ```
3. **Get Results**
   ```bash
   # Debug and get merkle root + proofs
   iapp debug <TASK_ID>
   ```
4. **Publish Merkle Root On-Chain**
   ```bash
   # Smart contract: DividendPool.startDistributionRound()
   ```

## Troubleshooting

### "Insufficient RLC balance"
- Get RLC from faucet
- Bridge to Arbitrum Sepolia
- Check balance on explorer

### "Network not supported"
- Ensure `allowExperimentalNetworks: true` in DataProtector
- Verify you're on Arbitrum Sepolia (Chain ID: 421614)

### "App not found"
- Verify app was deployed successfully
- Check `cache/arbitrum-sepolia-testnet/deployments.json`
- Use correct app address

### "Protected data access denied"
- Ensure `grantAccess()` was called
- Verify authorized app address is correct
- Check numberOfAccess hasn't been exhausted

## Resources

- **iExec Docs**: https://docs.iex.ec/
- **DataProtector**: https://docs.iex.ec/get-started/quick-start
- **iApp Guide**: https://docs.iex.ec/guides/build-iapp/deploy-&-run
- **Explorer**: https://explorer.iex.ec/arbitrum-sepolia-testnet
- **Faucet**: https://explorer.iex.ec/arbitrum-mainnet/faucet
- **Bridge**: https://portal.arbitrum.io/bridge

## Next Steps

1. ✅ Get RLC tokens and bridge to Arbitrum Sepolia
2. ✅ Configure `iapp.config.json` with credentials
3. ✅ Test iApp locally with `iapp test`
4. ✅ Deploy iApp with `iapp deploy`
5. ✅ Update frontend with deployed app address
6. ✅ Test full flow end-to-end

---

**Note**: Since Arbitrum Sepolia deployment is early, always use `allowExperimentalNetworks: true` in DataProtector configuration.
