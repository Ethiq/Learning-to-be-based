// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Guestbook} from "../contracts/Guestbook.sol";

/// @notice Deploy the Guestbook contract to Base Sepolia or mainnet
/// @dev Usage:
///   # Dry run (simulate):
///   forge script scripts/DeployGuestbook.s.sol --rpc-url base_sepolia
///
///   # Deploy for real:
///   forge script scripts/DeployGuestbook.s.sol --rpc-url base_sepolia --broadcast --private-key $PRIVATE_KEY
///
///   # Deploy and verify on Basescan:
///   forge script scripts/DeployGuestbook.s.sol --rpc-url base_sepolia --broadcast --private-key $PRIVATE_KEY --verify
contract DeployGuestbook is Script {
    function run() external {
        vm.startBroadcast();

        Guestbook guestbook = new Guestbook();
        console.log("Guestbook deployed at:", address(guestbook));

        vm.stopBroadcast();
    }
}
