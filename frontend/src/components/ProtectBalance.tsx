'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { IAPP_ADDRESS } from '@/lib/contracts';

export default function ProtectBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState('');
  const [isProtecting, setIsProtecting] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [protectedDataAddress, setProtectedDataAddress] = useState('');

  const handleProtect = async () => {
    if (!balance || !address) return;

    setIsProtecting(true);

    try {
      // Import DataProtector SDK dynamically
      const { IExecDataProtector } = await import('@iexec/dataprotector');

      // Initialize DataProtector
      const dataProtector = new IExecDataProtector(window.ethereum as any);

      // Create protected data
      const protectedData = await dataProtector.protectData({
        data: {
          holder: address,
          balance: parseInt(balance) * 1000000, // Convert to 6 decimals
        },
        name: `Arcana Balance - ${address.slice(0, 8)}`,
      });

      setProtectedDataAddress(protectedData.address);
      setIsProtected(true);

      console.log('Protected data created:', protectedData);

    } catch (error) {
      console.error('Error protecting data:', error);
      alert('Error protecting data. Check console for details.');
    } finally {
      setIsProtecting(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!protectedDataAddress) return;

    try {
      const { IExecDataProtector } = await import('@iexec/dataprotector');
      const dataProtector = new IExecDataProtector(window.ethereum as any);

      // Grant access to iApp with bulk processing enabled
      const grantedAccess = await dataProtector.grantAccess({
        protectedData: protectedDataAddress,
        authorizedApp: IAPP_ADDRESS,
        authorizedUser: '0x0000000000000000000000000000000000000000', // Any user
        numberOfAccess: 1000, // Allow multiple distributions
      });

      console.log('Access granted:', grantedAccess);
      alert('Access granted! Your balance is ready for the next distribution.');

    } catch (error) {
      console.error('Error granting access:', error);
      alert('Error granting access. Check console for details.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Protect Your Balance</h3>
        <p className="text-gray-400 text-sm">
          Encrypt your token balance so it can be processed confidentially.
        </p>
      </div>

      {!isProtected ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your ARCANA Token Balance
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Enter balance (e.g., 1000)"
              className="w-full bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              This simulates your tokenized fund holdings
            </p>
          </div>

          <button
            onClick={handleProtect}
            disabled={!balance || isProtecting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition"
          >
            {isProtecting ? 'Protecting...' : '🔐 Protect Balance'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 font-medium">✓ Balance Protected!</p>
            <p className="text-gray-400 text-sm mt-1">
              Protected Data: {protectedDataAddress.slice(0, 10)}...{protectedDataAddress.slice(-8)}
            </p>
          </div>

          <button
            onClick={handleGrantAccess}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition"
          >
            📋 Grant Access for Distribution
          </button>

          <p className="text-gray-500 text-xs text-center">
            This allows the Arcana iApp to include your balance in bulk processing
          </p>
        </div>
      )}
    </div>
  );
}
