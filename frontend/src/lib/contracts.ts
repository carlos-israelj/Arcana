// frontend/src/lib/contracts.ts

// Arbitrum Sepolia Testnet
export const CHAIN_ID = 421614;

// Contract Addresses (update after deployment)
export const ARCANA_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS || '0x0') as `0x${string}`;
export const DIVIDEND_POOL_ADDRESS = (process.env.NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS || '0x0') as `0x${string}`;
export const PAYMASTER_ADDRESS = (process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS || '0x0') as `0x${string}`;

// Payment token (USDC on Arbitrum Sepolia or custom)
export const PAYMENT_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || '0x0') as `0x${string}`;

// iExec iApp Address
export const IAPP_ADDRESS = process.env.NEXT_PUBLIC_IAPP_ADDRESS || '0x0';

// ABIs
export const ARCANA_TOKEN_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const DIVIDEND_POOL_ABI = [
  {
    "inputs": [],
    "name": "currentRound",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "merkleRoots",
    "outputs": [{"name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "", "type": "uint256"},
      {"name": "", "type": "address"}
    ],
    "name": "hasClaimed",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "round", "type": "uint256"},
      {"name": "amount", "type": "uint256"},
      {"name": "merkleProof", "type": "bytes32[]"}
    ],
    "name": "claimDividend",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "round", "type": "uint256"},
      {"name": "holder", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "merkleProof", "type": "bytes32[]"}
    ],
    "name": "canClaim",
    "outputs": [{"name": "valid", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "round", "type": "uint256"}],
    "name": "getRoundInfo",
    "outputs": [
      {"name": "root", "type": "bytes32"},
      {"name": "total", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "round", "type": "uint256"},
      {"indexed": true, "name": "holder", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"}
    ],
    "name": "DividendClaimed",
    "type": "event"
  }
] as const;
