import React, { createContext, useState, useContext } from 'react';
import { ethers } from 'ethers';

// 1. IMPORT YOUR NEW ABI FILE
import ClaimAuditABI from '../utils/contract.json';

// 2. SET YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = 0x73C51E918887C0322eAe44E12075827804A4cC6c

// Create the context
const Web3Context = createContext(null);

// Create the provider component
export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const web3Signer = web3Provider.getSigner();
        setSigner(web3Signer);

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          ClaimAuditABI.abi, // <-- 3. USE THE IMPORTED ABI
          web3Signer
        );
        setContract(contractInstance);

        console.log("Wallet connected:", accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        connectWallet,
        ethers // <-- 4. EXPOSE ETHERS FOR UTILITIES
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Create a custom hook to use the context easily
export const useWeb3 = () => {
  return useContext(Web3Context);
};