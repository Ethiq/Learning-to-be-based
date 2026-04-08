// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Guestbook — a minimal on-chain guestbook for learning Base development
/// @notice Anyone can sign the guestbook and leave a message. All entries are stored on-chain.
contract Guestbook {
    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    struct Entry {
        address signer;
        string message;
        uint256 timestamp;
    }

    Entry[] public entries;
    mapping(address => uint256[]) private signerToEntryIndexes;

    event Signed(address indexed signer, string message, uint256 timestamp, uint256 indexed entryIndex);

    /// @notice Sign the guestbook with a message
    /// @param _message The message to leave (max 280 characters)
    function sign(string calldata _message) external {
        _validateMessage(_message);

        uint256 entryIndex = entries.length;
        entries.push(Entry({signer: msg.sender, message: _message, timestamp: block.timestamp}));
        signerToEntryIndexes[msg.sender].push(entryIndex);

        emit Signed(msg.sender, _message, block.timestamp, entryIndex);
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

    /// @notice Get all entry indexes for a signer
    function getEntryIndexesBySigner(address _signer) external view returns (uint256[] memory) {
        return signerToEntryIndexes[_signer];
    }

    /// @notice Get recent entries for a single signer
    /// @param _signer Account whose entries to query
    /// @param _count Number of entries to return from most recent backwards
    function getRecentEntriesBySigner(address _signer, uint256 _count) external view returns (Entry[] memory) {
        uint256[] storage indexes = signerToEntryIndexes[_signer];
        uint256 total = indexes.length;

        if (_count > total) {
            _count = total;
        }

        Entry[] memory recent = new Entry[](_count);
        for (uint256 i = 0; i < _count; i++) {
            uint256 entryIndex = indexes[total - _count + i];
            recent[i] = entries[entryIndex];
        }

        return recent;
    }

    function _validateMessage(string calldata _message) private pure {
        bytes memory messageBytes = bytes(_message);
        require(messageBytes.length > 0, "Message cannot be empty");
        require(messageBytes.length <= MAX_MESSAGE_LENGTH, "Message too long (max 280 chars)");
    }
}
