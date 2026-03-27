// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Guestbook — a minimal on-chain guestbook for learning Base development
/// @notice Anyone can sign the guestbook and leave a message. All entries are stored on-chain.
contract Guestbook {
    struct Entry {
        address signer;
        string message;
        uint256 timestamp;
    }

    Entry[] public entries;

    event Signed(address indexed signer, string message, uint256 timestamp);

    /// @notice Sign the guestbook with a message
    /// @param _message The message to leave (max 280 characters)
    function sign(string calldata _message) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_message).length <= 280, "Message too long (max 280 chars)");

        entries.push(Entry({
            signer: msg.sender,
            message: _message,
            timestamp: block.timestamp
        }));

        emit Signed(msg.sender, _message, block.timestamp);
    }

    /// @notice Get the total number of guestbook entries
    function getEntryCount() external view returns (uint256) {
        return entries.length;
    }

    /// @notice Get a specific entry by index
    function getEntry(uint256 _index) external view returns (address signer, string memory message, uint256 timestamp) {
        require(_index < entries.length, "Index out of bounds");
        Entry storage entry = entries[_index];
        return (entry.signer, entry.message, entry.timestamp);
    }

    /// @notice Get the most recent entries (up to `count`)
    function getRecentEntries(uint256 _count) external view returns (Entry[] memory) {
        uint256 total = entries.length;
        if (_count > total) {
            _count = total;
        }

        Entry[] memory recent = new Entry[](_count);
        for (uint256 i = 0; i < _count; i++) {
            recent[i] = entries[total - _count + i];
        }
        return recent;
    }
}
