# Arckana User Guide

## Getting Started

### Prerequisites
- MetaMask or compatible Web3 wallet
- Some test ETH on Arbitrum Sepolia (for testing)
- ARCANA test tokens (can be minted from the contract)

### Step 1: Connect Your Wallet

1. Visit the Arckana web app
2. Click "Connect Wallet" in the top-right corner
3. Select your wallet provider (MetaMask, WalletConnect, etc.)
4. Approve the connection request

### Step 2: Protect Your Balance

**What is "Protecting"?**
Protecting your balance means encrypting it using iExec's DataProtector so that it can be processed confidentially without revealing your holdings to anyone.

**How to Protect:**

1. Navigate to the "1. Protect Balance" tab
2. Enter your ARCANA token balance
   - Example: If you hold 1000 ARCANA tokens, enter `1000`
3. Click "🔐 Protect Balance"
4. Sign the transaction in your wallet
5. Wait for confirmation (usually 10-30 seconds)
6. You'll see a success message with your Protected Data address

**Important Notes:**
- You only need to protect your balance once
- Your balance is encrypted and stored securely on iExec
- No one can see your actual balance, not even node operators

### Step 3: Grant Access for Distribution

After protecting your balance, you need to grant the Arckana iApp permission to include your balance in bulk processing.

**How to Grant Access:**

1. After protecting, click "📋 Grant Access for Distribution"
2. Sign the transaction in your wallet
3. This gives the Arckana iApp permission to read your encrypted balance
4. You can grant access for multiple distribution rounds (default: 1000)

**Why is this needed?**
The iApp needs permission to decrypt and process your balance inside the secure TEE to calculate your dividend.

### Step 4: Wait for Distribution

Once you've protected your balance and granted access, you're all set! Now wait for the next distribution round.

**What happens during distribution:**

1. The admin triggers a distribution round
2. The iApp processes ALL holder balances in one secure execution
3. Dividends are calculated based on each holder's share
4. A Merkle tree is generated
5. Only the Merkle root is published on-chain

**Check Status:**

Navigate to the "2. Distribution" tab to see:
- Current round number
- Merkle root (proof of calculation)
- Total dividend pool
- Distribution status

### Step 5: Claim Your Dividend

After a distribution round completes, you can claim your dividend.

**How to Claim:**

1. Go to the "3. Claim" tab
2. You'll see your dividend amount (e.g., $25.00)
3. Click "💰 Claim Dividend (Gasless)"
4. Sign the transaction (NO GAS FEES!)
5. Wait for confirmation
6. Your dividend is transferred to your wallet

**Manual Claim (Advanced):**

If the automatic claim data isn't loaded, you can enter it manually:

1. Click "📝 Enter Claim Data Manually"
2. Enter your dividend amount (from the distribution result)
3. Enter your Merkle proof (comma-separated hashes)
4. Click "Claim"

**Important:**
- Claims are gasless! The Arckana Paymaster sponsors your gas fees
- You can only claim once per round
- If you already claimed, you'll see "Already Claimed"

## FAQ

### Q: Why do I need to "protect" my balance?
**A:** Protecting encrypts your balance so it can be processed confidentially. Without protection, your balance would be visible to everyone on-chain.

### Q: Can anyone see my protected balance?
**A:** No. Your balance is encrypted and only accessible inside the secure TEE. Not even iExec node operators can see your actual balance.

### Q: How much does it cost to claim?
**A:** Claims are completely FREE thanks to the Arckana Paymaster sponsoring gas fees.

### Q: What if I miss a distribution round?
**A:** No problem! You can still claim from previous rounds at any time. Just switch to the appropriate round in the claim interface.

### Q: How often are dividends distributed?
**A:** Distribution frequency depends on the fund administrator. Check the "Distribution" tab for the current schedule.

### Q: Is my data secure?
**A:** Yes! Your balance data is:
- Encrypted with iExec DataProtector
- Processed inside Intel SGX/TDX secure enclaves
- Never exposed in plaintext to node operators
- Verified with cryptographic attestation

### Q: What happens if I change my balance?
**A:** You'll need to protect your new balance again before the next distribution round.

### Q: Can I revoke access to my protected data?
**A:** Yes, you can revoke access through the iExec DataProtector interface.

## Troubleshooting

### Issue: "Error protecting data"
**Solution:**
- Make sure you're connected to the correct network (Arbitrum Sepolia)
- Check that you have enough test ETH for the transaction
- Try refreshing the page and reconnecting your wallet

### Issue: "No claim data found"
**Solution:**
- Wait for the distribution round to complete
- Check the "Distribution Status" tab
- Use manual entry if you have your proof from the admin

### Issue: "Already claimed"
**Solution:**
- You can only claim once per round
- Check your wallet for the transferred dividend
- Wait for the next distribution round

### Issue: Transaction fails
**Solution:**
- Ensure you have test ETH for gas (even though claims are sponsored, you need ETH for approval)
- Try increasing gas limit in MetaMask
- Check that the round is active

## Support

For additional help:
- Check the [GitHub Issues](https://github.com/carlos-israelj/Arckana/issues)
- Read the [Architecture Documentation](./architecture.md)
- Contact the team

---

**Happy dividend claiming! 🎉**
