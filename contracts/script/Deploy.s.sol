// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ArcanaToken.sol";
import "../src/DividendPool.sol";
import "../src/ArcanaPaymaster.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address entryPoint = vm.envAddress("ENTRYPOINT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy ArcanaToken (mock treasury token)
        ArcanaToken arcanaToken = new ArcanaToken();
        console.log("ArcanaToken deployed at:", address(arcanaToken));

        // Deploy payment token (for dividends) - in production, this would be USDC
        // For demo, we'll deploy another token to represent USDC
        ArcanaToken paymentToken = new ArcanaToken();
        console.log("PaymentToken deployed at:", address(paymentToken));

        // Deploy DividendPool
        DividendPool dividendPool = new DividendPool(address(paymentToken));
        console.log("DividendPool deployed at:", address(dividendPool));

        // Deploy ArcanaPaymaster
        ArcanaPaymaster paymaster = new ArcanaPaymaster(
            IEntryPoint(entryPoint),
            address(dividendPool)
        );
        console.log("ArcanaPaymaster deployed at:", address(paymaster));

        // Fund paymaster with some ETH for gas sponsorship
        paymaster.deposit{value: 0.1 ether}();
        console.log("Paymaster funded with 0.1 ETH");

        vm.stopBroadcast();

        // Output deployment info
        console.log("\n=== Deployment Summary ===");
        console.log("ArcanaToken:", address(arcanaToken));
        console.log("PaymentToken:", address(paymentToken));
        console.log("DividendPool:", address(dividendPool));
        console.log("ArcanaPaymaster:", address(paymaster));
    }
}
