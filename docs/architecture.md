# Arcana Architecture Documentation

## Overview

Arcana is a confidential dividend distribution system that leverages iExec's Trusted Execution Environment (TEE) to provide privacy-preserving yield distribution for tokenized treasury funds.

## System Components

### 1. Smart Contracts (Arbitrum Sepolia)

#### ArcanaToken.sol
Mock ERC-20 token representing a tokenized treasury fund (like BlackRock's BUIDL).

**Key Features:**
- 6 decimal precision (matching USDC/BUIDL)
- Mintable for demo purposes
- Batch minting capability

#### DividendPool.sol
Main distribution contract handling confidential dividend claims.

**Key Features:**
- Merkle tree-based verification
- Per-round distribution tracking
- Reentrancy protection
- Operator-controlled distribution initiation

**Flow:**
1. Operator sets Merkle root from TEE computation
2. Holders claim using Merkle proof
3. Contract verifies proof and transfers payment token
4. Prevents double-claiming

#### ArcanaPaymaster.sol
ERC-4337 Paymaster for gasless dividend claims.

**Key Features:**
- Sponsors gas for approved operations
- Configurable gas limits
- EntryPoint integration

### 2. iExec iApp (Python TEE)

Confidential computation module that runs inside Intel SGX/TDX.

**Input:**
- Protected balance data (bulk)
- Total dividend pool amount

**Processing:**
1. Load and deserialize encrypted balances
2. Calculate total supply
3. Compute each holder's dividend share
4. Build Merkle tree from distribution
5. Generate individual proofs

**Output:**
- Merkle root (published on-chain)
- Encrypted proofs for each holder

**Security:**
- Runs in isolated TEE
- Attestation proves correct execution
- No data leakage to node operators

### 3. Frontend (Next.js)

User interface for interacting with the system.

**Key Components:**

#### ProtectBalance.tsx
- Encrypt user's token balance
- Create protected data via DataProtector SDK
- Grant access to iApp for bulk processing

#### DistributionStatus.tsx
- Display current round information
- Show Merkle root and pool size
- Track distribution progress

#### ClaimDividend.tsx
- Retrieve holder's Merkle proof
- Submit gasless claim transaction
- Handle claim status and confirmations

### 4. Data Flow

```
┌──────────────┐
│   Holder     │
│  (Frontend)  │
└──────┬───────┘
       │ 1. protectData(balance)
       ▼
┌──────────────────┐
│ DataProtector    │
│ (iExec Network)  │
└──────┬───────────┘
       │ 2. Store encrypted
       ▼
┌──────────────────┐
│ Admin triggers   │
│ distribution     │
└──────┬───────────┘
       │ 3. processBulkRequest()
       ▼
┌──────────────────┐
│  iApp (TEE)      │
│  - Decrypt       │
│  - Calculate     │
│  - Build Merkle  │
└──────┬───────────┘
       │ 4. Return merkle_root + proofs
       ▼
┌──────────────────┐
│ DividendPool.sol │
│ startRound()     │
└──────┬───────────┘
       │ 5. Store merkle root on-chain
       ▼
┌──────────────────┐
│ Holder claims    │
│ with proof       │
└──────┬───────────┘
       │ 6. claimDividend(proof)
       ▼
┌──────────────────┐
│ Verify + Transfer│
└──────────────────┘
```

## Privacy Guarantees

### What is Private
✅ Individual holder balances
✅ Individual dividend amounts
✅ Total number of holders
✅ Identity of holders (via private claims)

### What is Public
❌ Merkle root (for verification)
❌ Total dividend pool amount
❌ Current round number

## Security Model

### Threat Model

**Protected Against:**
- Curious node operators (TEE isolation)
- Front-running (private amounts)
- Unauthorized claims (Merkle proofs)
- Double-claiming (on-chain tracking)

**Not Protected Against:**
- Timing attacks (out of scope)
- Network analysis (future work)
- Compromised TEE hardware (assumes Intel SGX security)

### Trust Assumptions

1. **iExec TEE**: Intel SGX/TDX provides correct isolation
2. **DataProtector**: Encryption is secure
3. **Operator**: Honestly triggers distributions (can be decentralized)
4. **Smart Contracts**: Audited and verified

## Scalability

### Gas Costs

**Per Distribution:**
- Set Merkle root: ~50k gas
- Total: ~$0.10 @ 50 gwei (Arbitrum L2)

**Per Claim:**
- Merkle proof verification: ~40k gas
- Sponsored by Paymaster: FREE for users

### TEE Performance

**Tested with:**
- 100 holders: ~2 seconds
- 1,000 holders: ~5 seconds
- 10,000 holders: ~30 seconds (estimated)

**Bottleneck:** Merkle tree construction (O(n log n))

## Future Improvements

1. **Zero-Knowledge Proofs**: Use ZK-SNARKs for even stronger privacy
2. **Automated Distributions**: Cron-like scheduling on-chain
3. **Multi-Asset Support**: Distribute multiple tokens
4. **Cross-Chain**: Bridge dividends across chains
5. **DAO Governance**: Decentralize operator role

## References

- [iExec Documentation](https://docs.iex.ec/)
- [OpenZeppelin MerkleProof](https://docs.openzeppelin.com/contracts/4.x/api/utils#MerkleProof)
- [ERC-4337 Spec](https://eips.ethereum.org/EIPS/eip-4337)
- [Intel SGX](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)
