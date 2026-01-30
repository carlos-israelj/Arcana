# Arckana Frontend

Next.js frontend for Arckana - Confidential Dividend Distribution System.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:
- Get WalletConnect Project ID: https://cloud.walletconnect.com/app
- Add your deployed contract addresses
- Add your deployed iApp address

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem, RainbowKit
- **Privacy**: iExec DataProtector
- **State**: React Query

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main dashboard
│   └── globals.css       # Global styles
├── components/
│   ├── ProtectBalance.tsx       # Balance encryption UI
│   ├── DistributionStatus.tsx   # Distribution display
│   └── ClaimDividend.tsx        # Claim interface
├── hooks/
│   └── useDataProtector.ts      # DataProtector hooks
├── lib/
│   ├── config.ts           # Wagmi configuration
│   ├── contracts.ts        # Contract ABIs & addresses
│   └── iexec-config.ts     # iExec network config
└── providers/
    └── Web3Provider.tsx    # Web3 context provider
```

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Vercel deployment configuration

## 🌐 Deployment

See [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set root directory: `frontend`
4. Add environment variables
5. Deploy!

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS` | ArckanaToken contract address | Yes |
| `NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS` | DividendPool contract address | Yes |
| `NEXT_PUBLIC_PAYMASTER_ADDRESS` | Paymaster contract address | Yes |
| `NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS` | Payment token address | Yes |
| `NEXT_PUBLIC_IAPP_ADDRESS` | iExec iApp address | Yes |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint URL | Yes |
| `NEXT_PUBLIC_IEXEC_CHAIN_ID` | iExec chain ID (421614) | Yes |

## 🎨 Features

### Wallet Connection
- RainbowKit integration
- Multi-wallet support
- Network switching
- Persistent connection

### Data Protection
- Encrypt token balances
- Grant access to iApp
- Status updates
- Error handling

### Distribution Tracking
- View current round
- Check Merkle root
- Monitor pool size
- Distribution status

### Dividend Claims
- Gasless claims
- Merkle proof verification
- Transaction tracking
- Success feedback

## 🧪 Testing

### Test Wallet Connection
1. Connect MetaMask
2. Switch to Arbitrum Sepolia
3. Verify connection persists

### Test Data Protection
1. Enter balance
2. Click "Protect Balance"
3. Verify status updates appear
4. Check protected data address
5. Grant access to iApp

### Test Distribution
1. Go to Distribution tab
2. Verify round number displays
3. Check if Merkle root appears
4. Verify pool amount shows

### Test Claims
1. Go to Claim tab
2. Enter claim data (or wait for distribution)
3. Click claim
4. Verify transaction succeeds
5. Check token balance increased

## 🐛 Troubleshooting

### Wallet Won't Connect
- Ensure MetaMask is installed
- Check you're on Arbitrum Sepolia
- Clear browser cache
- Try different wallet

### DataProtector Error
- Verify `allowExperimentalNetworks: true` is set
- Check wallet is connected
- Ensure on correct network
- Check console for errors

### Build Errors
- Run `npm install` to ensure dependencies
- Check TypeScript errors: `npm run build`
- Verify all environment variables are set
- Clear `.next` directory and rebuild

### Runtime Errors
- Open browser console
- Check Network tab for failed requests
- Verify contract addresses are correct
- Ensure RPC endpoint is working

## 📚 Documentation

- [Main README](../README.md)
- [Deployment Guide](../VERCEL_DEPLOYMENT.md)
- [iExec Setup](../IEXEC_SETUP.md)
- [Architecture](../docs/architecture.md)

## 🔗 Links

- **GitHub**: https://github.com/carlos-israelj/Arckana
- **Live Demo**: [URL after deployment]
- **Documentation**: https://docs.iex.ec/

## 📝 License

MIT License - See [LICENSE](../LICENSE)
