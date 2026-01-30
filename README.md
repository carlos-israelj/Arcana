# ARCKANA 🔮

**Confidential Dividend Distribution for Tokenized Treasury Funds**

[![iExec Hack4Privacy 2026](https://img.shields.io/badge/iExec-Hack4Privacy%202026-purple)](https://hack4privacy.iex.ec)
[![Arbitrum Sepolia](https://img.shields.io/badge/Network-Arbitrum%20Sepolia-blue)](https://sepolia.arbiscan.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Problem

Tokenized treasury funds like BlackRock's BUIDL ($2.5B AUM) distribute dividends **publicly on-chain**. Every holder's balance and payout amount is visible to anyone, creating serious issues:

- **Competitive Intelligence Leak**: Competitors can see exact holdings
- **Front-running Risk**: Traders can anticipate large movements
- **Privacy Violation**: Fiduciary duty may require confidentiality
- **Institutional Adoption Barrier**: Many institutions won't use DeFi without privacy

---

## 💡 Solution

**Arckana** provides a confidential dividend distribution layer using:

1. **iExec DataProtector** - Holders encrypt their token balances
2. **TEE Processing** - An iApp processes ALL balances in a single secure execution
3. **Merkle Tree** - Only the root is published on-chain
4. **Account Abstraction** - Gasless claims via ERC-4337 Paymaster
5. **Zero Knowledge** - Individual balances and payouts remain private

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ARCKANA SYSTEM                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Next.js + RainbowKit)                        │
│  ↓ Protect Balance via DataProtector SDK                │
│                                                          │
│  iExec TEE (Python iApp)                                │
│  ↓ Bulk process encrypted balances                      │
│  ↓ Calculate dividends                                   │
│  ↓ Generate Merkle tree                                  │
│                                                          │
│  Smart Contracts (Arbitrum Sepolia)                     │
│  • ArckanaToken (Mock treasury token)                    │
│  • DividendPool (Merkle distribution)                   │
│  • ArckanaPaymaster (Gasless claims)                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔐 Privacy-First
- Token balances encrypted with iExec DataProtector
- Processing happens inside Intel SGX/TDX secure enclaves
- Only Merkle root published on-chain

### ⚡ Bulk Processing
- All holder dividends calculated in single TEE execution
- Efficient gas usage
- Scalable to thousands of holders

### 🆓 Gasless Claims
- ERC-4337 Account Abstraction
- Gas fees sponsored by Paymaster
- Frictionless user experience

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Foundry
- iExec SDK

### 1. Clone Repository

```bash
git clone https://github.com/carlos-israelj/Arckana.git
cd Arckana
```

### 2. Deploy Smart Contracts

```bash
cd contracts
forge install
forge build
forge test

# Deploy to Arbitrum Sepolia
forge script script/Deploy.s.sol --rpc-url $ARBITRUM_SEPOLIA_RPC --broadcast --verify
```

### 3. Setup iApp

```bash
cd ../iapp

# Get RLC tokens for iExec
# Visit: https://explorer.iex.ec/arbitrum-mainnet/faucet
# Bridge to Arbitrum Sepolia: https://portal.arbitrum.io/bridge

# Import wallet
iapp wallet import <your-private-key>

# Test locally
iapp test

# Deploy to iExec Arbitrum Sepolia
iapp deploy --chain arbitrum-sepolia-testnet
```

### 4. Run Frontend

```bash
cd ../frontend
npm install

# Create .env.local
cp .env.local.example .env.local
# Fill in contract addresses and API keys

npm run dev
```

Visit http://localhost:3000

---

## 📖 User Flow

### 1. Protect Balance
Connect wallet → Enter token balance → Encrypt with DataProtector → Grant access to iApp

### 2. Distribution
Admin triggers bulk processing → TEE calculates dividends → Merkle root published on-chain

### 3. Claim Dividend
User receives encrypted proof → Claims dividend using Merkle proof → Gas sponsored by Paymaster

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS |
| Web3 | RainbowKit, Wagmi, Viem |
| Smart Contracts | Solidity 0.8.20, Foundry |
| Blockchain | Arbitrum Sepolia (testnet) |
| Privacy Layer | iExec DataProtector on Arbitrum |
| TEE Processing | iExec iApp (Python) on Arbitrum Sepolia |
| Account Abstraction | ERC-4337 |
| iExec Chain ID | 421614 (Arbitrum Sepolia) |

---

## 📂 Project Structure

```
Arckana/
├── contracts/          # Solidity smart contracts
│   ├── src/
│   │   ├── ArckanaToken.sol
│   │   ├── DividendPool.sol
│   │   └── ArckanaPaymaster.sol
│   ├── test/
│   └── script/
│
├── iapp/              # iExec TEE application
│   ├── src/
│   │   └── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/          # Next.js web app
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── providers/
│   └── package.json
│
└── docs/             # Documentation
```

---

## 🎥 Demo Video

[Link to demo video will be added]

---

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
forge test -vvv
```

### iApp
```bash
cd iapp
python -m pytest tests/
```

### Frontend
```bash
cd frontend
npm run test
```

---

## 🏆 Hack4Privacy Track

**Track:** Confidential Real-World Assets (RWA)
**Bonus Target:** Bulk Processing + Account Abstraction ($300)

### How Arckana Qualifies

✅ **RWA Use Case** - Tokenized treasury funds (BUIDL-like)
✅ **Confidential Computing** - iExec TEE for private calculations
✅ **Bulk Processing** - All holders processed in single TEE execution
✅ **Account Abstraction** - ERC-4337 Paymaster for gasless claims
✅ **DataProtector Integration** - Encrypted balance storage

---

## 📝 Smart Contract Addresses

### Arbitrum Sepolia Testnet

| Contract | Address |
|----------|---------|
| ArckanaToken | `0x...` |
| DividendPool | `0x...` |
| ArckanaPaymaster | `0x...` |
| PaymentToken | `0x...` |

*(Update after deployment)*

---

## 🔒 Security Considerations

- All balance data encrypted with iExec DataProtector
- TEE attestation verifies computation integrity
- Merkle proofs prevent unauthorized claims
- Reentrancy guards on dividend claims
- Access control on critical functions

---

## 🌟 Future Enhancements

- [ ] Multi-token dividend support
- [ ] Automatic distribution scheduling
- [ ] Mobile app
- [ ] Integration with real RWA protocols
- [ ] Zero-knowledge proofs for enhanced privacy
- [ ] Cross-chain dividend distribution

---

## 👥 Team

**Carlos Israel Jiménez** - Full Stack Developer

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- iExec Team for the amazing privacy infrastructure
- BlackRock BUIDL for RWA inspiration
- Arbitrum for low-cost L2 infrastructure
- OpenZeppelin for secure smart contract libraries

---

## 📞 Contact

- GitHub: [@carlos-israelj](https://github.com/carlos-israelj)
- Project Repo: [github.com/carlos-israelj/Arckana](https://github.com/carlos-israelj/Arckana)

---

**Built with ❤️ for iExec Hack4Privacy 2026**
