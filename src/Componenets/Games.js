import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore_database } from '../FireBase'; // Adjust this to your file structure
import { searchUser, update_user } from './Essential functios';

const StonePaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(''); // Player's choice
  const [computerChoice, setComputerChoice] = useState(''); // Computer's choice
  const [result, setResult] = useState(''); // Result of the game
  const [canPlay, setCanPlay] = useState(true); // State to check if the user can play
  const [coins, setCoins] = useState(); // Set coins from fetched data
  const [fetchData,set_fetchData] = useState()
  // const [fetchData,set_FetchData] =useState()

  const choices = ['stone', 'paper', 'scissors']; // Possible choices

  useEffect(()=>{
    getData()
  })
  const getData = async () => {

    const data=await searchUser('user' ,'uid',localStorage.getItem('uid'))

    if (data.length > 0) {
        const userData = data[0];
        set_fetchData(userData)
          setCoins(userData.coin*0.3||10)
                  console.log("Fetched user data:", userData);
            } else {
        console.log("No user data found");
    }
  };
  // Function to handle player selection
  const handlePlayerChoice = (choice) => {
    if (!canPlay) return; // Prevent user from playing if not allowed

    setPlayerChoice(choice);

    // Generate a random choice for the computer
    const randomIndex = Math.floor(Math.random() * 3);
    const computerSelection = choices[randomIndex];
    setComputerChoice(computerSelection);

    // Determine the result
    determineWinner(choice, computerSelection);

    // Store the current timestamp in local storage to restrict playing for 24 hours
    const currentTime = new Date().getTime();
    localStorage.setItem('lastPlayTime', currentTime);

    // After the user plays, they cannot play again for 24 hours
    setCanPlay(false);
  };

  // Function to determine the winner
  const determineWinner = (player, computer) => {
    if (player === computer) {
      setResult('It\'s a tie!');
    } else if (
      (player === 'stone' && computer === 'scissors') ||
      (player === 'paper' && computer === 'stone') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setResult('You win!');
      updateCoins(1.5); // Add 1 coin if the player wins
    } else {
      setResult('You lose!');
    }
  };

  // Function to update the coin balance in Firestore
  const updateCoins = async (amount) => {
    const newCoinBalance = coins * amount;
    setCoins(parseInt(newCoinBalance)); // Update local state

    update_user('coin',fetchData.coin+parseInt(newCoinBalance),fetchData.id,'user')

    // try {
    //   const docRef = doc(firestore_database, 'user', fetchData.id);
    //   await updateDoc(docRef, {
    //     coin: fetchData.coin+parseInt(newCoinBalance), // Update the coin field in Firestore
    //   });
    // } catch (error) {
    //   console.log('Error updating coins:', error);
    // }
    
  };

  // Check if 24 hours have passed since the last play
  useEffect(() => {
    const lastPlayTime = localStorage.getItem('lastPlayTime');

    if (lastPlayTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastPlayTime;

      // 24 hours = 86400000 milliseconds
      if (timeDifference < 86400000) {
        setCanPlay(false);
      } else {
        setCanPlay(true);
      }
    }
  }, []); // Run this check on component mount

  return (
    <div className="sps-container">
    <h1>🪨📄✂️ Stone Paper Scissors</h1>
    <div className="stars">
    <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
  <div class="star"></div>
    </div>
  
    {/* Check if user can play or not */}
    {canPlay ? (
      <div className="sps-choices">
        <button className="sps-btn" onClick={() => handlePlayerChoice('stone')}>
          Stone
        </button>
        <button className="sps-btn" onClick={() => handlePlayerChoice('paper')}>
          Paper
        </button>
        <button className="sps-btn" onClick={() => handlePlayerChoice('scissors')}>
          Scissors
        </button>
      </div>
    ) : (
      <p className="sps-message">You have already played today! Please come back in 24 hours.</p>
    )}
  
    {/* Display Player and Computer Choices */}
    {playerChoice && (
      <div className="sps-results">
        <p>Your choice: <span className="highlight">{playerChoice}</span></p>
        <p>Computer's choice: <span className="highlight">{computerChoice}</span></p>
        <p className={`sps-result ${result.includes('win') ? 'win' : result.includes('lose') ? 'lose' : 'tie'}`}>
          {result}
        </p>
      </div>
    )}
  
    {/* Display Coin Balance */}
    <div className="sps-coins">
      <p>Current Coins: <span className="highlight">{coins}</span></p>
    </div>
  </div>
  
  );
};



export default StonePaperScissors;
