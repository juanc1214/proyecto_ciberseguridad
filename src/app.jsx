/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useEffect, useState } from 'react';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import Web3 from 'web3';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useScrollToTop();

  useEffect(() => {
    const connectToWeb3 = async () => {
      try {
        const web3Instance = new Web3('http://localhost:8545'); // URL del nodo local
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Failed to connect to Web3:', error);
      }
    };

    connectToWeb3();
  }, []);

  useEffect(() => {
    if (web3 && account) {
      const contractAddress = '0xD32c889363039444d26ACE569968bf8117128F67';
      const contractABI = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "auctionId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "candidate",
              "type": "string"
            }
          ],
          "name": "bid",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            }
          ],
          "name": "createAuction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "auctionId",
              "type": "uint256"
            }
          ],
          "name": "withdrawBid",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "activeAuctions",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "auctionCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "auctions",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "finalDate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "currentBidAmount",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "currentWinner",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "issuer",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getActiveAuctions",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "auctionId",
              "type": "uint256"
            }
          ],
          "name": "getAuctionDetails",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      const auctionContract = new web3.eth.Contract(contractABI, contractAddress);
      setContract(auctionContract);
    }
  }, [web3, account]);

  useEffect(() => {
    if (web3 && account && contract) {
      console.log('💥 web3', web3);
      console.log('💥 account', account);
      console.log('💥 contract', contract);
    }
  }, [web3, account, contract]);

  return (
    <ThemeProvider>
      <Router web3={web3} account={account} contract={contract} />
    </ThemeProvider>
  );
}