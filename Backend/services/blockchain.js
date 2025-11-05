// src/services/blockchain.js
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractInfoPath = path.resolve(__dirname, '../ClaimAudit.json');
const contractInfo = JSON.parse(fs.readFileSync(contractInfoPath, 'utf8'));

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
export const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, wallet);

export const STATUS_CODE = {
  Created: 1,
  SubmittedToInsurer: 2,
  InReview: 3,
  Approved: 4,
  Rejected: 5,
  Paid: 6
};

export function sortKeysDeep(data) {
  if (Array.isArray(data)) return data.map(sortKeysDeep);
  if (data && typeof data === 'object') {
    return Object.keys(data).sort().reduce((acc, k) => {
      acc[k] = sortKeysDeep(data[k]);
      return acc;
    }, {});
  }
  return data;
}
export function keccak256(obj) {
  const json = JSON.stringify(sortKeysDeep(obj));
  return ethers.keccak256(ethers.toUtf8Bytes(json));
}
