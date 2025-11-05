const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying ClaimAudit to Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  // Some ethers/provider combinations expose getBalance on signer differently;
  // use the provider to reliably fetch balance by address.
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  const ClaimAudit = await ethers.getContractFactory("ClaimAudit");
  const claimAudit = await ClaimAudit.deploy();
  
  await claimAudit.waitForDeployment();
  const address = await claimAudit.getAddress();
  
  console.log("ClaimAudit deployed to:", address);
  console.log("Transaction:", claimAudit.deploymentTransaction().hash);
  
  // Save for frontend/backend
  const data = {
    address: address,
    abi: claimAudit.interface.formatJson(true)  // Formatted ABI
  };
  
  fs.writeFileSync("./deployed-contract.json", JSON.stringify(data, null, 2));
  console.log("Saved to deployed-contract.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
