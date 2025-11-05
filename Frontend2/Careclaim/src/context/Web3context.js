// Compatibility shim: re-export from the .jsx implementation so imports using
// './context/Web3context.js' continue to work while the real JSX lives in
// Web3context.jsx (which is parsed with the correct loader).
export { Web3Provider, useWeb3 } from './Web3context.jsx';

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
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Create Ethers provider, signer, and contract instance
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const web3Signer = web3Provider.getSigner();
        setSigner(web3Signer);

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          YourContractABI.abi, // Use the .abi property
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
        connectWallet
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