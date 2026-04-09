// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Guestbook} from "../contracts/Guestbook.sol";

contract GuestbookTest is Test {
    Guestbook public guestbook;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        guestbook = new Guestbook();
    }

    function test_sign_stores_entry() public {
        vm.prank(alice);
        guestbook.sign("Hello from Alice!");

        assertEq(guestbook.getEntryCount(), 1);

        (address signer, string memory message, uint256 timestamp) = guestbook.getEntry(0);
        assertEq(signer, alice);
        assertEq(message, "Hello from Alice!");
        assertEq(timestamp, block.timestamp);
    }

    function test_sign_emits_event() public {
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit Guestbook.Signed(alice, "Hello!", block.timestamp, 0);
        guestbook.sign("Hello!");
    }

    function test_sign_reverts_on_empty_message() public {
        vm.prank(alice);
        vm.expectRevert("Message cannot be empty");
        guestbook.sign("");
    }

    function test_sign_reverts_on_long_message() public {
        bytes memory longMsg = new bytes(281);
        for (uint256 i = 0; i < 281; i++) {
            longMsg[i] = "a";
        }

        vm.prank(alice);
        vm.expectRevert("Message too long (max 280 chars)");
        guestbook.sign(string(longMsg));
    }

    function test_multiple_signers() public {
        vm.prank(alice);
        guestbook.sign("First!");

        vm.prank(bob);
        guestbook.sign("Second!");

        assertEq(guestbook.getEntryCount(), 2);

        (address signer1,,) = guestbook.getEntry(0);
        (address signer2,,) = guestbook.getEntry(1);
        assertEq(signer1, alice);
        assertEq(signer2, bob);
    }

    function test_getRecentEntries_returns_latest() public {
        vm.prank(alice);
        guestbook.sign("Entry 1");

        vm.prank(bob);
        guestbook.sign("Entry 2");

        vm.prank(alice);
        guestbook.sign("Entry 3");

        Guestbook.Entry[] memory recent = guestbook.getRecentEntries(2);
        assertEq(recent.length, 2);
        assertEq(recent[0].message, "Entry 2");
        assertEq(recent[1].message, "Entry 3");
    }

    function test_getRecentEntries_clamps_to_total() public {
        vm.prank(alice);
        guestbook.sign("Only entry");

        Guestbook.Entry[] memory recent = guestbook.getRecentEntries(100);
        assertEq(recent.length, 1);
        assertEq(recent[0].message, "Only entry");
    }

    function test_getEntry_reverts_out_of_bounds() public {
        vm.expectRevert("Index out of bounds");
        guestbook.getEntry(0);
    }

    function test_getEntryIndexesBySigner_returns_ordered_indexes() public {
        vm.startPrank(alice);
        guestbook.sign("A-1");
        guestbook.sign("A-2");
        vm.stopPrank();

        vm.prank(bob);
        guestbook.sign("B-1");

        uint256[] memory aliceIndexes = guestbook.getEntryIndexesBySigner(alice);
        uint256[] memory bobIndexes = guestbook.getEntryIndexesBySigner(bob);

        assertEq(aliceIndexes.length, 2);
        assertEq(aliceIndexes[0], 0);
        assertEq(aliceIndexes[1], 1);

        assertEq(bobIndexes.length, 1);
        assertEq(bobIndexes[0], 2);
    }

    function test_getRecentEntriesBySigner_returns_latest_for_signer() public {
        vm.prank(alice);
        guestbook.sign("A-1");

        vm.prank(bob);
        guestbook.sign("B-1");

        vm.startPrank(alice);
        guestbook.sign("A-2");
        guestbook.sign("A-3");
        vm.stopPrank();

        Guestbook.Entry[] memory aliceRecent = guestbook.getRecentEntriesBySigner(alice, 2);
        assertEq(aliceRecent.length, 2);
        assertEq(aliceRecent[0].message, "A-2");
        assertEq(aliceRecent[1].message, "A-3");

        Guestbook.Entry[] memory bobRecent = guestbook.getRecentEntriesBySigner(bob, 5);
        assertEq(bobRecent.length, 1);
        assertEq(bobRecent[0].message, "B-1");
    }
}
