const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ClaimAudit", function () {
  it("Should emit ClaimCreated event", async function () {
    const ClaimAudit = await ethers.getContractFactory("ClaimAudit");
    const claimAudit = await ClaimAudit.deploy();
    await claimAudit.waitForDeployment();

    const [owner] = await ethers.getSigners();

    const claimIdHash = ethers.keccak256(ethers.toUtf8Bytes("test-claim"));
    const fnolHash = ethers.keccak256(ethers.toUtf8Bytes("fnol-data"));

    await expect(claimAudit.createClaim(claimIdHash, fnolHash))
      .to.emit(claimAudit, "ClaimCreated")
      .withArgs(claimIdHash, fnolHash, owner.address, anyValue);
  });
});
