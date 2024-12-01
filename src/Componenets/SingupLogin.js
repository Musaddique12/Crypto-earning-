// src/components/AuthPage.js
import React, { useState } from "react";
import { auth } from "../FireBase"; // Import Firebase config
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { firestore_database } from "../FireBase"; // Make sure to import Firestore
import { useNavigate } from "react-router";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
const navigate=useNavigate()
  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccess("Account created successfully!");
      console.log("User:", user);

      // Add user data to Firestore
      try {
        await addDoc(collection(firestore_database, "user"), {
          coin: 100,
          energy_cost: 100,
          energy_per_sec: 1,
          pertap: 1,
          storage: 100,
          storage_cost: 100,
          tap_cost: 100,
          uid: user.uid,
          wallet_login: false,
          address:'',
          code:code,
          friends:0
        });
        localStorage.setItem('uid',user.uid)
        console.log("User data added to Firestore");
        navigate('/start/earn');
      } catch (e) {
        console.error("Error adding document to Firestore: ", e);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('uid',user.uid)
      setSuccess("Logged in successfully!");
      console.log("Logged in user:", user);
      navigate('/start/earn');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="ref-user-container">
      <h2 className="form-title">{isLogin ? "Login" : "Sign Up"}</h2>

      {/* Toggle button between Login and Signup */}
    

      <form onSubmit={isLogin ? handleLogin : handleSignup} className="ref-user-form">
      <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* Conditionally render the submit button text */}
        <button type="submit" className="submit-btn">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
        {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
      </button>
    </div>
  );
};

export default AuthPage;
