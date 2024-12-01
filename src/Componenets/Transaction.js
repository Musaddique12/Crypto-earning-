import React, { useEffect, useState } from "react";
import { searchUser, update_user } from "./Essential functios";

const Transaction = () => {
  const [userAddress, setUserAddress] = useState("");
  const [coinType, setCoinType] = useState("");
  const [coinValue, setCoinValue] = useState(0);
  const [fetch_data, set_fetch_data] = useState([]);
  const [feeAmount, setFeeAmount] = useState(0);
  const [amountAfterFee, setAmountAfterFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // New state for button loading

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);

  const getData = async () => {
    const User_data = await searchUser('user', 'uid', localStorage.getItem('uid'));
    const data = await searchUser('phase', 'address', User_data[0].address);
    if (data.length > 0) {
      const userData = data[0];
      console.log("Fetched user data:", userData);
      set_fetch_data(userData);
    } else {
      console.log("No user data found");
    }
  };

  useEffect(() => {
    const calculateFee = () => {
      const feePercentage = 2;
      const calculatedFee = (feePercentage / 100) * coinValue;
      const calculatedAmountAfterFee = coinValue - calculatedFee;

      setFeeAmount(calculatedFee);
      setAmountAfterFee(calculatedAmountAfterFee);
    };

    if (coinValue > 0) {
      calculateFee();
    } else {
      setFeeAmount(0);
      setAmountAfterFee(0);
    }
  }, [coinValue]);

  const transaction = async () => {
    setIsLoading(true); // Set loading state to true
    const temp_user = await searchUser('phase', 'address', userAddress);

    if (temp_user.length > 0) {
      const temp_userData = temp_user[0];

      if ((fetch_data.coins && fetch_data.coins[coinType] !== undefined) && (fetch_data.coins[coinType] >= coinValue)) {
        if (temp_userData.coins && temp_userData.coins[coinType] !== undefined) {
          await update_user(`coins.${coinType}`, temp_userData.coins[coinType] + parseFloat(amountAfterFee), temp_userData.id, 'phase');
        } else {
          await update_user(`coins.${coinType}`, parseFloat(amountAfterFee), temp_userData.id, 'phase');
        }
        await update_user(`coins.${coinType}`, fetch_data.coins[coinType] - parseFloat(coinValue), fetch_data.id, 'phase');
        getData();
        console.log('Transaction successful');
      } else {
        console.log(`Sender does not have enough '${coinType}' coins.`);
      }
    } else {
      console.log("No user data found for recipient");
    }
    
    setIsLoading(false); // Reset loading state after transaction
  };

  return (
    <div className="transaction-container">
      <h2>Make a Transaction</h2>

      <input
        type="text"
        className="transaction-input"
        placeholder="Enter recipient address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />

      <select
        className="transaction-select"
        value={coinType}
        onChange={(e) => setCoinType(e.target.value)}
      >
        <option value="">Select coin</option>
        {fetch_data.coins && Object.keys(fetch_data.coins).map((coin, index) => (
          <option key={index} value={coin}>
            {coin} (Balance: {fetch_data.coins[coin]})
          </option>
        ))}
      </select>

      <input
        type="number"
        className="transaction-input"
        placeholder="Enter value"
        value={coinValue}
        onChange={(e) => setCoinValue(e.target.value)}
      />

      <div className="transaction-summary">
        <p>Transaction Fee: {feeAmount} {coinType}</p>
        <p>Amount after Fee: {amountAfterFee} {coinType}</p>
      </div>

      <button 
        className="transaction-button" 
        onClick={transaction}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? 'Processing...' : 'Confirm Transaction'}
      </button>
    </div>
  );
};

export default Transaction;
