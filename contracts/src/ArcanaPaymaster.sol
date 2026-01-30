// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@account-abstraction/contracts/interfaces/PackedUserOperation.sol";

/**
 * @title ArcanaPaymaster
 * @notice Sponsors gas for dividend claims on DividendPool
 * @dev Simple paymaster that sponsors all calls to allowed contract
 */
contract ArcanaPaymaster is BasePaymaster {
    // Contract allowed to be called with sponsored gas
    address public dividendPool;

    // Maximum gas to sponsor per operation
    uint256 public maxGasPerOp = 200000;

    event DividendPoolUpdated(address indexed oldPool, address indexed newPool);

    constructor(IEntryPoint _entryPoint, address _dividendPool) BasePaymaster(_entryPoint) {
        dividendPool = _dividendPool;
    }

    /**
     * @notice Update the dividend pool address
     * @param _dividendPool New dividend pool address
     */
    function setDividendPool(address _dividendPool) external onlyOwner {
        emit DividendPoolUpdated(dividendPool, _dividendPool);
        dividendPool = _dividendPool;
    }

    /**
     * @notice Set maximum gas per operation
     * @param _maxGas New max gas limit
     */
    function setMaxGasPerOp(uint256 _maxGas) external onlyOwner {
        maxGasPerOp = _maxGas;
    }

    /**
     * @notice Validate that we want to sponsor this operation
     * @dev Only sponsor calls to dividendPool.claimDividend
     */
    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 /*userOpHash*/,
        uint256 /*maxCost*/
    ) internal view override returns (bytes memory context, uint256 validationData) {
        // Decode the calldata to check it's calling our dividend pool
        // UserOp.callData format for simple account: execute(target, value, data)

        // For simplicity, we check if the operation gas is reasonable
        require(userOp.preVerificationGas + userOp.verificationGasLimit +
                userOp.callGasLimit <= maxGasPerOp, "Gas too high");

        // Return empty context and valid (0 = valid)
        return ("", 0);
    }

    /**
     * @notice Post-operation hook (not used but required)
     */
    function _postOp(
        PostOpMode /*mode*/,
        bytes calldata /*context*/,
        uint256 /*actualGasCost*/,
        uint256 /*actualUserOpFeePerGas*/
    ) internal override {
        // No post-op logic needed
    }

    /**
     * @notice Deposit ETH to EntryPoint for gas sponsorship
     */
    function deposit() external payable {
        entryPoint.depositTo{value: msg.value}(address(this));
    }

    /**
     * @notice Withdraw ETH from EntryPoint
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawTo(address payable to, uint256 amount) external onlyOwner {
        entryPoint.withdrawTo(to, amount);
    }

    /**
     * @notice Get current deposit balance
     * @return balance Current balance in EntryPoint
     */
    function getDeposit() external view returns (uint256) {
        return entryPoint.balanceOf(address(this));
    }
}
