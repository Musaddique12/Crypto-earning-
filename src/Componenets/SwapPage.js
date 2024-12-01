import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { searchUser, update_user } from './Essential functios';

const coinNameToIdMap = {
  "Bitcoin": "bitcoin",
  "Ethereum": "ethereum",
  "Tether": "tether",
  "BNB": "binancecoin",
  "Solana": "solana",
  "USDC": "usd-coin",
  "XRP": "ripple",
  "Lido Staked Ether": "staked-ether",
  "Dogecoin": "dogecoin",
  "TRON": "tron",
  "Ton": "the-open-network",
  "Cardano": "cardano",
  "Avalanche": "avalanche-2",
  "Shiba Inu": "shiba-inu",
  "Wrapped stETH": "wrapped-steth",
  "Wrapped Bitcoin": "wrapped-bitcoin",
  "WETH": "weth",
  "Chainlink": "chainlink",
  "Bitcoin Cash": "bitcoin-cash",
  "Sui": "sui",
  "Uniswap": "uniswap",
  "Polkadot": "polkadot",
  "Dai": "dai",
  "NEAR Protocol": "near",
  "LEO Token": "leo-token",
  "Aptos": "aptos",
  "Litecoin": "litecoin",
  "Bittensor": "bittensor",
  "Pepe": "pepe",
  "Wrapped eETH": "wrapped-eeth",
  "Internet Computer": "internet-computer",
  "Artificial Superintelligence Alliance": "fetch-ai",
  "Kaspa": "kaspa",
  "First Digital USD": "first-digital-usd",
  "Monero": "monero",
  "POL": "polygon-ecosystem-token",
  "Ethereum Classic": "ethereum-classic",
  "Dogwifhat": "dogwifcoin",
  "Stellar": "stellar",
  "Stacks": "blockstack",
  "Immutable": "immutable-x",
  "OKB": "okb",
  "Ethena USDe": "ethena-usde",
  "Aave": "aave",
  "WhiteBIT Coin": "whitebit",
  "Optimism": "optimism",
  "Filecoin": "filecoin",
  "Render": "render-token",
  "Cronos": "crypto-com-chain",
  "Injective": "injective-protocol",
  "Mantle": "mantle",
  "Fantom": "fantom",
  "Arbitrum": "arbitrum",
  "Hedera": "hedera-hashgraph",
  "VeChain": "vechain",
  "Sei": "sei-network",
  "Cosmos Hub": "cosmos",
  "THORChain": "thorchain",
  "The Graph": "the-graph",
  "Bitget Token": "bitget-token",
  "Bonk": "bonk",
  "Binance-Peg WETH": "binance-peg-weth",
  "Popcat": "popcat",
  "Rocket Pool ETH": "rocket-pool-eth",
  "FLOKI": "floki",
  "Theta Network": "theta-token",
  "Celestia": "celestia",
  "Arweave": "arweave",
  "MANTRA": "mantra-dao",
  "Mantle Staked Ether": "mantle-staked-ether",
  "Maker": "maker",
  "Gate": "gatechain-token",
  "Pyth Network": "pyth-network",
  "Solv Protocol SolvBTC": "solv-btc",
  "Helium": "helium",
  "Worldcoin": "worldcoin-wld",
  "Jupiter": "jupiter-exchange-solana",
  "Ondo": "ondo-finance",
  "Algorand": "algorand",
  "Polygon": "matic-network",
  "KuCoin": "kucoin-shares",
  "Quant": "quant-network",
  "Brett": "based-brett",
  "Lido DAO": "lido-dao",
  "JasmyCoin": "jasmycoin",
  "Ethena": "ethena",
  "Bitcoin SV": "bitcoin-cash-sv",
  "BitTorrent": "bittorrent",
  "GALA": "gala",
  "Wormhole": "wormhole",
  "Neiro": "neiro-3",
  "Core": "coredaoorg",
  "Fasttoken": "fasttoken",
  "Flow": "flow",
  "Starknet": "starknet",
  "Ether.fi Staked ETH": "ether-fi-staked-eth",
  "Aerodrome Finance": "aerodrome-finance",
  "Beam": "beam-2",
  "Notcoin": "notcoin",
  "Renzo Restaked ETH": "renzo-restaked-eth"
};


const SwapPage = () => {
  const [fetchData,set_fetchData]=useState([])
  const [coins, setCoins] = useState([]);
  const [fetch_data, set_fetch_data] = useState([]);
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [error, setError] = useState('');
  const [fee, setFee] = useState(0); 
  const [isSwapping, setIsSwapping] = useState(false);
  const feePercentage = 0.01;


  const customCoinRates = {
    hpc: 0.003,
  };

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);

  const getData = async () => {

    const user=await searchUser('user','uid',localStorage.getItem('uid'))
    const data = await searchUser('phase', 'address', user[0].address);
    if (data.length > 0) {
      const fetchData = data[0];
      console.log('Fetched user data:', fetchData);
      set_fetchData(user[0])
      set_fetch_data(fetchData);
    } else {
      console.log('No user data found');
    }
  };

  const fetchCoins = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
      setCoins(response.data);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setError('Failed to fetch coin data. Please try again later.');
    }
  };

  const fetchConversionRate = async () => {
    if (!amount || !fromCoin || !toCoin) return;

    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=' +
        coins.map((coin) => coin.id).join(',') +
        '&vs_currencies=usd'
      );
      const rates = {};

      for (const coin of coins) {
        rates[coin.id] = response.data[coin.id]?.usd || 0;
      }

      rates['hpc'] = coinNameToIdMap['hpc'];

      const fromRate = rates[coinNameToIdMap[fromCoin]] || customCoinRates[fromCoin.toLowerCase()];
      const toRate = rates[toCoin] || customCoinRates[toCoin.toLowerCase()];

      if (fromRate && toRate) {
        const rate = fromRate / toRate;
        const conversionAmount = (amount * rate).toFixed(6);
        setConvertedAmount(conversionAmount);

        // Calculate the fee and set it
        const calculatedFee = (amount * feePercentage).toFixed(6);
        setFee(calculatedFee);
      } else {
        setError('Rates not available for selected coins.');
      }
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
      setError('Failed to fetch conversion rates. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    fetchConversionRate();
  }, [fromCoin, toCoin, amount, coins]);

  const handleSwap = async () => {
    setError(''); // Clear any previous error messages

    // Validation: Check if user owns the fromCoin
   
    if ((!fetch_data.coins || !fetch_data.coins[fromCoin])&&(fromCoin.toLocaleLowerCase()!='hpc')) {
      setError(`You do not own any ${fromCoin}.`);
      console.log(fetchData.coin)
       return;
    }


    // Validation: Check if the entered amount is valid
    const userBalance =  fetch_data.coins[fromCoin];
    console.log(userBalance)
    console.log(amount)


  if ((amount <= 0 || amount > userBalance)&&(fromCoin.toLocaleLowerCase()!='hpc') ) {
      setError(`Invalid amount. You can only swap up to ${userBalance} ${fromCoin}.`);
      return;
    }
    else if((fetchData.coin<amount)&&(fromCoin.toLocaleLowerCase()==='hpc')){
      setError(`Invalid amount. You can only swap up to ${userBalance} ${fromCoin}.`);
      return;
    }

    // Validation: Ensure 'from' and 'to' coins are different
    if (fromCoin === toCoin) {
      setError('You cannot swap the same coin.');
      return;
    }

    // Get the key of the `toCoin` (e.g., 'bitcoin' instead of 'btc')
    const toCoinKey = Object.keys(coinNameToIdMap).find(key => coinNameToIdMap[key] === toCoin) || toCoin;
    console.log(toCoinKey)// Use map if available, otherwise use the selected value

    // Perform the swap

    const totalAmountAfterFee = (amount - fee).toFixed(6); // Calculate amount after fee

    try {
      setIsSwapping(true);

      // Update Firestore for the user
      if (fromCoin.toLowerCase() === 'hpc') {
        const updatedFromCoinBalance = (fetchData.coin - totalAmountAfterFee).toFixed(6); // Subtract swapped amount from user's balance 
        const updatedToCoinBalance = ((fetch_data.coins[toCoinKey] || 0) + parseFloat(convertedAmount)).toFixed(6); // Add the converted amount to the user's 'toCoin' balance

        await update_user(`coin`, parseFloat(updatedFromCoinBalance), fetchData.id, 'user');       
         console.log('ammount ubstracted')

        await update_user(`coins.${toCoinKey}`, parseFloat(updatedToCoinBalance), fetch_data.id, 'phase');
                console.log('ammount added')

      }
      else if (toCoin.toLowerCase() === 'hpc') {
        const updatedFromCoinBalance = (userBalance - totalAmountAfterFee).toFixed(6); // Subtract swapped amount from user's balance
        const updatedToCoinBalance = ((fetchData.coin || 0) + parseFloat(convertedAmount)).toFixed(6); // Add the converted amount to the user's 'toCoin' balance

        await update_user(`coins.${fromCoin}`, parseFloat(updatedFromCoinBalance), fetch_data.id, 'phase');
        await update_user(`coin`, parseFloat(updatedToCoinBalance), fetchData.id, 'user');
        
        alert(`Successfully swapped ${amount} ${fromCoin} for ${convertedAmount} ${toCoin}.`);
      }

      else {
        const updatedFromCoinBalance = (userBalance - totalAmountAfterFee).toFixed(6); // Subtract swapped amount from user's balance
        const updatedToCoinBalance = ((fetch_data.coins[toCoinKey] || 0) + parseFloat(convertedAmount)).toFixed(6); // Add the converted amount to the user's 'toCoin' balance

        // Update the balances for both coins
        await update_user(`coins.${fromCoin}`, parseFloat(updatedFromCoinBalance), fetch_data.id, 'phase');
        await update_user(`coins.${toCoinKey}`, parseFloat(updatedToCoinBalance), fetch_data.id, 'phase');
      }


      // Fetch updated data and log the hpc coin balance
      setTimeout(() => {
        setIsSwapping(false);
        alert(`Swapped ${amount} of ${fromCoin} to ${toCoin}`);
        setAmount("");
      }, 2000);
      getData()


     
      console.log(fetch_data.coins[toCoin])
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setError('Swap failed. Please try again.');
    }
  };


  return (
    <div className="swap-page">
      <h1>Swap {fromCoin} to {toCoin}</h1>
  
      {error && <p className="error">{error}</p>}
  
      <div className="form-group">
        <select value={fromCoin} onChange={(e) => setFromCoin(e.target.value)}>
          <option>Select from Coin</option>
          {Object.entries(fetch_data.coins || {}).map(([coin, balance]) => (
            <option key={coin} value={coin}>
              {coin} (Balance: {balance})
            </option>
          ))}
          <option value="hpc">HPC (HPC)</option>
        </select>
      </div>
  
      <div className="form-group">
        <select value={toCoin} onChange={(e) => setToCoin(e.target.value)}>
          <option>Select to Coin</option>
          {coins
            .filter((coin) => coin.id !== fromCoin)
            .map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          <option value="hpc">HPC (HPC)</option>
        </select>
      </div>
  
      <div className="form-group">
        <label>Amount of {fromCoin}:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Enter amount of ${fromCoin}`}
        />
      </div>
  
      <div className="conversion-result">
        <h3>{amount} {fromCoin} = {convertedAmount} {toCoin}</h3>
      </div>
  
      <div className="fee">
        <p>Transaction Fee: {fee} {fromCoin}</p>
      </div>
  
      <button className="swap-button" onClick={handleSwap} disabled={isSwapping}>
        {isSwapping ? "Swapping..." : "Swap"}
      </button>
    </div>
  );
  
};

export default SwapPage;
