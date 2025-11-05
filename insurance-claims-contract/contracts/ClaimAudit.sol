// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClaimAudit {
    // Status codes: 1=Created(FNOL), 2=Submitted, 3=InReview, 4=Approved, 5=Rejected, 6=Paid
    event ClaimCreated(
        bytes32 indexed claimIdHash,
        bytes32 fnolHash,
        address indexed actor,
        uint256 timestamp
    );
    
    event ClaimStatusUpdated(
        bytes32 indexed claimIdHash,
        uint8 status,
        bytes32 contentHash,
        address indexed actor,
        uint256 timestamp
    );

    mapping(bytes32 => uint8) public lastStatus;  // Optional: track latest status per claim

    function createClaim(bytes32 claimIdHash, bytes32 fnolHash) external {
        require(lastStatus[claimIdHash] == 0, "Claim already exists");
        lastStatus[claimIdHash] = 1;
        emit ClaimCreated(claimIdHash, fnolHash, msg.sender, block.timestamp);
    }

    function updateStatus(bytes32 claimIdHash, uint8 newStatus, bytes32 contentHash) external {
        require(newStatus > lastStatus[claimIdHash], "Status must advance");
        require(newStatus <= 6, "Invalid status");
        lastStatus[claimIdHash] = newStatus;
        emit ClaimStatusUpdated(claimIdHash, newStatus, contentHash, msg.sender, block.timestamp);
    }
}
