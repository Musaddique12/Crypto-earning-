import React, { useState } from "react";
import { auth } from "../FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { firestore_database } from "../FireBase";
import { searchUser, update_user } from "./Essential functios";
import { useNavigate } from "react-router";
import './style.css';

function RefUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refcode, setRefcode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate referral code
      const referrer = await searchUser("user", "code", refcode);
      if (referrer.length === 0) {
        setError("Referral code invalid.");
        return;
      }

      // Generate a unique referral code for the new user
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let newUserCode = "";
      for (let i = 0; i < 8; i++) {
        newUserCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      // Create the new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add the new user to Firestore
      await addDoc(collection(firestore_database, "user"), {
        email: email,
        coin: 100,
        energy_cost: 100,
        energy_per_sec: 1,
        pertap: 1,
        storage: 100,
        storage_cost: 100,
        tap_cost: 100,
        uid: user.uid,
        wallet_login: false,
        address: "",
        code: newUserCode,
        friends: 0,
      });

      // Update the referrer's coin balance
      update_user("coin", referrer[0].coin + 100, referrer[0].id, "user");
      update_user('friends', referrer[0].friends + 1, referrer[0].id, 'user');

      // Success message
      setSuccess("Account created successfully! Referral bonus added to referrer.");
      localStorage.setItem("uid", user.uid);

      navigate('/dashboard/earn');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("You have already created an account, please login.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="ref-user-container">
      <div className="rocket"></div> {/* Rocket Animation */}
      <h2 className="form-title">Sign Up</h2>

      <form className="ref-user-form" onSubmit={handleSignup}>
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

        <div className="input-group">
          <label className="input-label">Referral Code</label>
          <input
            type="text"
            value={refcode}
            onChange={(e) => setRefcode(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </div>
  );
}

export default RefUser;
