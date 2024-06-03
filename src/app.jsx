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

  useScrollToTop();

  useEffect(() => {
    const connectToWeb3 = async () => {
      try {
        const web3Instance = new Web3('http://localhost:8552');
        setWeb3(web3Instance);
      } catch (error) {
        console.error('Failed to connect to Web3:', error);
      }
    };

    connectToWeb3();
  }, []);


  useEffect(()=> {
    console.log('💥 web3', web3);
  } , [web3])

  return (
    <ThemeProvider>
      <Router web3={web3} />
    </ThemeProvider>
  );
}
