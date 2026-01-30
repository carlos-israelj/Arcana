'use client';

import { useReadContract } from 'wagmi';
import { DIVIDEND_POOL_ADDRESS, DIVIDEND_POOL_ABI } from '@/lib/contracts';

export default function DistributionStatus() {
  // Read current round
  const { data: currentRound } = useReadContract({
    address: DIVIDEND_POOL_ADDRESS,
    abi: DIVIDEND_POOL_ABI,
    functionName: 'currentRound',
  });

  // Read round info
  const { data: roundInfo } = useReadContract({
    address: DIVIDEND_POOL_ADDRESS,
    abi: DIVIDEND_POOL_ABI,
    functionName: 'getRoundInfo',
    args: currentRound ? [currentRound] : undefined,
  });

  const merkleRoot = roundInfo?.[0];
  const totalPool = roundInfo?.[1];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Distribution Status</h3>
        <p className="text-gray-400 text-sm">
          Current distribution round information
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Current Round</span>
            <span className="font-mono text-lg">{currentRound?.toString() || '0'}</span>
          </div>
        </div>

        {currentRound && currentRound > 0n ? (
          <>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="mb-2">
                <span className="text-gray-400 block mb-1">Merkle Root</span>
                <code className="text-xs font-mono break-all text-green-400">
                  {merkleRoot || 'Not set'}
                </code>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Pool</span>
                <span className="text-2xl font-bold text-purple-400">
                  ${totalPool ? (Number(totalPool) / 1_000_000).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-400 font-medium">✓ Distribution Active</p>
              <p className="text-gray-400 text-sm mt-1">
                You can now claim your dividend in the Claim tab
              </p>
            </div>
          </>
        ) : (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 text-center">
            <p className="text-yellow-400 font-medium">No Active Distribution</p>
            <p className="text-gray-400 text-sm mt-1">
              Waiting for the next distribution round to start
            </p>
          </div>
        )}
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>Distribution runs are processed confidentially using iExec TEE</p>
      </div>
    </div>
  );
}
