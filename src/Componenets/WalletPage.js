import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { searchUser, update_user } from "./Essential functios";
import { collection, addDoc } from "firebase/firestore";
import { firestore_database } from "../FireBase"; // Import your Firebase app config
import { useNavigate } from "react-router";
// import "./WalletPage.css"; // Import your CSS file

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState();
  const [add, set_add] = useState();
  const [fetch_data, set_fetch_data] = useState([]); // Sender data
  const [UserData, set_UserData] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);

  const getData = async () => {
    const User_data = await searchUser('user', 'uid', localStorage.getItem('uid'));
    set_UserData(User_data[0]);

    if (User_data[0].address !== "") {
      const data = await searchUser('phase', 'address', User_data[0].address); // Sender's address
      if (data.length > 0) {
        const userData = data[0];
        console.log("Fetched user data:", userData);
        set_fetch_data(userData); // Save the sender's data (including coins)
      } else {
        console.log("No user data found");
      }
    } else {
      alert('First create wallet'+User_data[0].address);
    }
  };

  const createWallet = () => {
    const newWallet = ethers.Wallet.createRandom(); // Generates wallet
    setWallet(newWallet);
    setMnemonic(newWallet.mnemonic.phrase); // Set the mnemonic phrase
    set_add(newWallet.address);
  };

  const enter = async () => {
    try {
      const docRef = await addDoc(collection(firestore_database, "phase"), {
        address: add,
        phase: mnemonic,
        coins: {},
      });

      await update_user('address', add, UserData.id, 'user');
      await update_user('wallet_login', true, UserData.id, 'user');

      console.log("Document written with ID: ", docRef.id);
      getData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const login = async () => {
    const data = await searchUser('phase', 'phase', mnemonic.toLowerCase());
    if (data.length > 0) {
      await update_user('wallet_login', true, UserData.id, 'user');
      await update_user('address', data[0].address, UserData.id, 'user');
      getData()
    } else {
      alert('Mnemonic invalid');
    }
  };


  const handleLoginWallet = () => {
    // Update the user data to mark the address as true
    set_UserData(prevState => ({
      ...prevState,
      address: "userLoggedIn" // or any appropriate flag to show user is logged in
    }));
    console.log("User logged in with address:", UserData);
  };

  return (
    <div className="wallet-container">
      {!UserData.address ? (
        <div className="wallet-section">
          <h1>Create a New Wallet</h1>
          <p>{UserData.address}</p>
          {!wallet && (
           <div>
             <button className="generate-button" onClick={createWallet}>
              Generate Wallet
            </button>
            <button className="generate-button" onClick={handleLoginWallet}>
                Login Wallet
              </button>

           </div>
            
          )}

          {wallet && (
            <div className="wallet-info">
              <p><strong>Wallet Address:</strong> {add}</p>
              <p><strong>12-Word Recovery Phrase:</strong> {mnemonic}</p>
              <button className="enter-button" onClick={enter}>Enter App</button>
            </div>
          )}
        </div>
      ) : (
        <div className="wallet-content">
          {UserData.wallet_login ? (
            <div>
              <h2>Your Coin Balance:</h2>
              <div className="coin-container">
                {fetch_data.coins &&
                  Object.keys(fetch_data.coins).map((coin, index) => (
                    <div className="coin-balance" key={index}>
                      <span className="coin-name">{coin}</span>
                      <span className="coin-amount">{fetch_data.coins[coin]}</span>
                    </div>
                  ))}
              </div>

              <div className="options-section">
                <button className="option-button" onClick={() => { navigate('/start/swap') }}>Swap</button>
                <button className="option-button" onClick={() => { navigate('/start/transaction') }}>Transactions</button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="text"
                required
                placeholder="Enter your mnemonic"
                onChange={(e) => { setMnemonic(e.target.value); }}
                className="mnemonic-input"
              />
              <button className="login-button" onClick={login}>Login to App</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletPage;
