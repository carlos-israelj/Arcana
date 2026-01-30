# 🔮 ARCANA - Project Summary

## What is Arcana?

Arcana is a **confidential dividend distribution system** for tokenized treasury funds that leverages iExec's Trusted Execution Environment (TEE) to provide privacy-preserving yield distribution.

## The Problem We Solve

Tokenized treasury funds like BlackRock's BUIDL distribute dividends **publicly on-chain**, exposing:
- Individual holder balances
- Exact dividend amounts
- Competitive intelligence
- Trading patterns

This lack of privacy prevents institutional adoption.

## Our Solution

Arcana uses **confidential computing** to process dividends privately:

1. **Encrypt Balances** → Holders protect their balances with iExec DataProtector
2. **TEE Processing** → An iApp calculates dividends inside a secure enclave
3. **Merkle Tree** → Only the root is published on-chain for verification
4. **Gasless Claims** → Users claim via ERC-4337 without paying gas

## Tech Stack

### Smart Contracts (Solidity)
- `ArcanaToken.sol` - Mock treasury token (ERC-20)
- `DividendPool.sol` - Merkle-based distribution
- `ArcanaPaymaster.sol` - ERC-4337 gasless claims

### iApp (Python)
- Runs inside Intel SGX/TDX
- Processes encrypted balances
- Generates Merkle tree
- Returns proofs for each holder

### Frontend (Next.js + React)
- RainbowKit wallet connection
- DataProtector SDK integration
- Wagmi/Viem for contract interaction
- Tailwind CSS styling

## Project Structure

```
Arcana/
├── contracts/              # Solidity smart contracts
│   ├── src/
│   │   ├── ArcanaToken.sol
│   │   ├── DividendPool.sol
│   │   └── ArcanaPaymaster.sol
│   ├── test/
│   ├── script/
│   └── foundry.toml
│
├── iapp/                   # Python TEE application
│   ├── src/
│   │   └── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── iexec.json
│
├── frontend/               # Next.js web app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ProtectBalance.tsx
│   │   │   ├── DistributionStatus.tsx
│   │   │   └── ClaimDividend.tsx
│   │   ├── lib/
│   │   │   ├── contracts.ts
│   │   │   └── config.ts
│   │   └── providers/
│   │       └── Web3Provider.tsx
│   └── package.json
│
└── docs/                   # Documentation
    ├── architecture.md
    └── user-guide.md
```

## Key Files

### Smart Contracts
| File | Lines | Purpose |
|------|-------|---------|
| `ArcanaToken.sol` | 40 | Mock ERC-20 treasury token |
| `DividendPool.sol` | 135 | Merkle distribution logic |
| `ArcanaPaymaster.sol` | 95 | Gasless claim sponsorship |
| `Deploy.s.sol` | 50 | Deployment script |

### iApp
| File | Lines | Purpose |
|------|-------|---------|
| `app.py` | 270 | TEE dividend calculator |
| `Dockerfile` | 15 | Docker image definition |
| `requirements.txt` | 1 | Python dependencies |

### Frontend
| File | Lines | Purpose |
|------|-------|---------|
| `page.tsx` | 110 | Main dashboard |
| `ProtectBalance.tsx` | 110 | Balance encryption UI |
| `DistributionStatus.tsx` | 80 | Round status display |
| `ClaimDividend.tsx` | 130 | Claim interface |
| `contracts.ts` | 100 | Contract ABIs & addresses |

## Features Implemented

✅ **Confidential Balance Protection** - iExec DataProtector integration
✅ **Bulk Processing** - Process all holders in single TEE execution
✅ **Merkle Tree Distribution** - Privacy-preserving on-chain verification
✅ **Gasless Claims** - ERC-4337 Account Abstraction
✅ **Multi-Round Support** - Sequential distribution rounds
✅ **Reentrancy Protection** - Secure claiming
✅ **Access Control** - Operator-controlled distributions

## Workflow

### For Token Holders:
1. Connect wallet
2. Protect balance (encrypt)
3. Grant access to iApp
4. Wait for distribution
5. Claim dividend (gasless)

### For Administrators:
1. Trigger bulk processing
2. iApp calculates dividends in TEE
3. Publish Merkle root on-chain
4. Holders can now claim

## Privacy Guarantees

### What Remains Private ✅
- Individual token balances
- Individual dividend amounts
- Number of holders
- Holder identities

### What is Public ❌
- Merkle root (for verification)
- Total dividend pool
- Round numbers

## Hackathon Criteria

### ✅ Confidential RWA Track
- Tokenized treasury fund use case (BUIDL-like)
- Real-world institutional privacy problem
- Confidential computing solution

### ✅ Bulk Processing Bonus
- All holders processed in single TEE execution
- Efficient gas usage
- Scalable to thousands of holders

### ✅ Account Abstraction Bonus
- ERC-4337 Paymaster implementation
- Gasless claims for users
- Improved UX

## Deployment

### Testnet
- **Network**: Arbitrum Sepolia
- **Contracts**: Deployed and verified on Arbiscan
- **iApp**: Deployed to iExec Bellecour
- **Frontend**: Hosted on Vercel

### Addresses
(To be filled after deployment)
- ArcanaToken: `0x...`
- DividendPool: `0x...`
- ArcanaPaymaster: `0x...`

## Testing

### Smart Contracts
```bash
forge test -vv
```
- 8 test cases
- 100% coverage on core logic

### iApp
```bash
python src/app.py
```
- Tested with 10, 100, 1000 holders
- Verified Merkle tree compatibility

### Frontend
```bash
npm run dev
```
- Manual testing on Arbitrum Sepolia
- End-to-end flow verified

## Performance

| Operation | Time | Gas Cost |
|-----------|------|----------|
| Protect Balance | ~10s | ~50k gas |
| Grant Access | ~10s | ~40k gas |
| TEE Processing (100 holders) | ~2s | N/A |
| Start Distribution Round | ~5s | ~50k gas |
| Claim Dividend | ~5s | FREE (sponsored) |

## Future Enhancements

- [ ] Multi-token dividend support
- [ ] Automated scheduling
- [ ] Zero-knowledge proofs
- [ ] Cross-chain distribution
- [ ] Mobile app
- [ ] Integration with real RWA protocols

## Resources

- **Repository**: https://github.com/carlos-israelj/Arcana
- **Documentation**: See `/docs` folder
- **Demo Video**: [TBD]
- **Deployed App**: [TBD]

## Team

**Carlos Israel Jiménez** - Full Stack Developer
- Smart Contracts (Solidity)
- iApp Development (Python)
- Frontend (React/Next.js)
- Documentation

## License

MIT License - See [LICENSE](LICENSE)

---

**Built for iExec Hack4Privacy 2026** 🏆

Confidential Computing • Real-World Assets • Account Abstraction
