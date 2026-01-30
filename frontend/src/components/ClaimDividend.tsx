'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DIVIDEND_POOL_ADDRESS, DIVIDEND_POOL_ABI } from '@/lib/contracts';

export default function ClaimDividend() {
  const { address } = useAccount();
  const [claimData, setClaimData] = useState<{
    amount: string;
    proof: string[];
  } | null>(null);

  // Read current round
  const { data: currentRound } = useReadContract({
    address: DIVIDEND_POOL_ADDRESS,
    abi: DIVIDEND_POOL_ABI,
    functionName: 'currentRound',
  });

  // Check if already claimed
  const { data: hasClaimed } = useReadContract({
    address: DIVIDEND_POOL_ADDRESS,
    abi: DIVIDEND_POOL_ABI,
    functionName: 'hasClaimed',
    args: currentRound && address ? [currentRound, address] : undefined,
  });

  // Write contract for claim
  const { data: hash, writeContract, isPending } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Load claim data from local storage
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`arcana-claim-${address}`);
      if (stored) {
        setClaimData(JSON.parse(stored));
      }
    }
  }, [address]);

  const handleClaim = async () => {
    if (!claimData || !address || !currentRound) return;

    try {
      writeContract({
        address: DIVIDEND_POOL_ADDRESS,
        abi: DIVIDEND_POOL_ABI,
        functionName: 'claimDividend',
        args: [currentRound, BigInt(claimData.amount), claimData.proof as `0x${string}`[]],
      });
    } catch (error) {
      console.error('Claim error:', error);
      alert('Error claiming dividend. Check console for details.');
    }
  };

  // For demo: Allow manual entry of claim data
  const handleManualEntry = () => {
    const amount = prompt('Enter your dividend amount (from iApp result):');
    const proofStr = prompt('Enter your proof (comma-separated hashes):');

    if (amount && proofStr) {
      const proof = proofStr.split(',').map(p => p.trim());
      const data = { amount, proof };
      setClaimData(data);
      localStorage.setItem(`arcana-claim-${address}`, JSON.stringify(data));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Claim Your Dividend</h3>
        <p className="text-gray-400 text-sm">
          Claim your dividend using your Merkle proof. Gas is sponsored!
        </p>
      </div>

      {/* Current Round Info */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Current Round</span>
          <span className="font-mono">{currentRound?.toString() || '...'}</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-green-400 font-medium">✓ Dividend Claimed!</p>
          <p className="text-gray-400 text-sm mt-1">
            Your dividend has been successfully transferred to your wallet.
          </p>
        </div>
      ) : hasClaimed ? (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-green-400 font-medium">✓ Already Claimed!</p>
          <p className="text-gray-400 text-sm mt-1">
            You have already claimed your dividend for this round.
          </p>
        </div>
      ) : claimData ? (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Your Dividend</span>
              <span className="text-2xl font-bold text-green-400">
                ${(parseInt(claimData.amount) / 1000000).toFixed(2)}
              </span>
            </div>
            <p className="text-gray-500 text-xs">
              Proof: {claimData.proof.length} elements
            </p>
          </div>

          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition"
          >
            {isPending || isConfirming ? 'Claiming...' : '💰 Claim Dividend (Gasless)'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
            <p className="text-yellow-400 font-medium">No claim data found</p>
            <p className="text-gray-400 text-sm mt-1">
              Wait for the distribution to complete, or enter your claim data manually.
            </p>
          </div>

          <button
            onClick={handleManualEntry}
            className="w-full bg-gray-600 hover:bg-gray-500 py-3 rounded-lg font-medium transition"
          >
            📝 Enter Claim Data Manually
          </button>
        </div>
      )}

      {/* Gasless Info */}
      <div className="text-center text-gray-500 text-sm">
        <p>⛽ Gas fees sponsored by Arcana Paymaster</p>
      </div>
    </div>
  );
}
