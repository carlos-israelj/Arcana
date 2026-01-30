# Arcana Smart Contracts

Solidity smart contracts for confidential dividend distribution.

## Contracts

### ArcanaToken.sol
Mock ERC-20 token simulating a tokenized treasury fund (like BlackRock's BUIDL).

**Features:**
- 6 decimal places (matches USDC)
- Mintable by owner
- Batch minting support

### DividendPool.sol
Main distribution contract with Merkle proof verification.

**Features:**
- Round-based distributions
- Merkle tree verification
- Prevents double-claiming
- Operator-controlled rounds

### ArcanaPaymaster.sol
ERC-4337 Paymaster for gasless claims.

**Features:**
- Sponsors gas for dividend claims
- Configurable gas limits
- EntryPoint integration

## Setup

### Install Dependencies

```bash
forge install
```

This installs:
- OpenZeppelin Contracts
- Account Abstraction (ERC-4337)

### Compile

```bash
forge build
```

### Test

```bash
forge test
```

Run with verbosity:
```bash
forge test -vvv
```

## Deployment

### 1. Set Environment Variables

Create `.env` file:

```bash
PRIVATE_KEY=your_private_key
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
ARBISCAN_API_KEY=your_arbiscan_key
ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
```

### 2. Deploy to Arbitrum Sepolia

```bash
forge script script/Deploy.s.sol --rpc-url $ARBITRUM_SEPOLIA_RPC --broadcast --verify
```

### 3. Save Contract Addresses

After deployment, save the contract addresses to update:
- Frontend environment variables
- iApp configuration
- Documentation

## Usage

### Mint Tokens

```bash
cast send <ARCANA_TOKEN_ADDRESS> "mint(address,uint256)" <HOLDER_ADDRESS> 1000000000 --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY
```

### Start Distribution Round

```bash
# First, approve payment tokens
cast send <PAYMENT_TOKEN_ADDRESS> "approve(address,uint256)" <DIVIDEND_POOL_ADDRESS> 1000000000 --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY

# Then start round
cast send <DIVIDEND_POOL_ADDRESS> "startDistributionRound(bytes32,uint256)" <MERKLE_ROOT> 1000000000 --rpc-url $ARBITRUM_SEPOLIA_RPC --private-key $PRIVATE_KEY
```

### Check Round Info

```bash
cast call <DIVIDEND_POOL_ADDRESS> "currentRound()" --rpc-url $ARBITRUM_SEPOLIA_RPC

cast call <DIVIDEND_POOL_ADDRESS> "getRoundInfo(uint256)" 1 --rpc-url $ARBITRUM_SEPOLIA_RPC
```

## Testing

### Unit Tests

Run all tests:
```bash
forge test
```

Run specific test:
```bash
forge test --match-test testStartDistributionRound
```

### Integration Testing

1. Deploy contracts locally:
```bash
anvil
```

2. Deploy to local network:
```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

3. Test full flow with scripts

## Security

### Auditing

Before mainnet deployment:
- [ ] Complete security audit
- [ ] Formal verification of Merkle proof logic
- [ ] Gas optimization review
- [ ] Reentrancy testing

### Known Considerations

1. **Merkle Root Security**: Operator must be trusted or decentralized
2. **Gas Limits**: Paymaster has configurable gas limits to prevent abuse
3. **Reentrancy**: Protected with OpenZeppelin's ReentrancyGuard
4. **Access Control**: Critical functions restricted to owner/operator

## Troubleshooting

### Issue: Deployment fails
- Check RPC URL is correct
- Ensure you have test ETH
- Verify private key is set

### Issue: Tests fail
- Run `forge clean`
- Rebuild with `forge build`
- Check Solidity version (0.8.20)

### Issue: Verification fails
- Ensure ARBISCAN_API_KEY is set
- Wait a few seconds after deployment
- Try manual verification on Arbiscan

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC-4337 Spec](https://eips.ethereum.org/EIPS/eip-4337)
- [Arbitrum Sepolia](https://sepolia.arbiscan.io/)
