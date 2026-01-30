// iExec Network Configuration for Arbitrum Sepolia

export const IEXEC_CONFIG = {
  chainId: 421614,
  name: 'arbitrum-sepolia-testnet',
  prodWorkerpoolAddress: '0xB967057a21dc6A66A29721d96b8Aa7454B7c383F',
  dataProtectorSubgraph: 'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/5YjRPLtjS6GH6bB4yY55Qg4HzwtRGQ8TaHtGf9UBWWd',
  ipfsGateway: 'https://ipfs-gateway.arbitrum-sepolia-testnet.iex.ec',
  ipfsUploadUrl: 'https://ipfs-upload.arbitrum-sepolia-testnet.iex.ec',
  isExperimental: true,
};

// Explorer URLs
export const EXPLORER_URLS = {
  arbitrumSepolia: 'https://explorer.iex.ec/arbitrum-sepolia-testnet',
  arbitrumSepoliaScan: 'https://sepolia.arbiscan.io',
};

// Faucet URLs
export const FAUCET_URLS = {
  iexecFaucet: 'https://explorer.iex.ec/arbitrum-mainnet/faucet',
  arbitrumBridge: 'https://portal.arbitrum.io/bridge?sourceChain=sepolia&destinationChain=arbitrum-sepolia&tab=bridge&sanitized=true',
};
