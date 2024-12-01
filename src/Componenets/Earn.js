import { useEffect, useState } from "react";
import { searchUser, update_user } from "./Essential functios";
import './style.css';
import Navbar from "./Nav";

const Earn = () => {
  const [fetch_data, set_fetch_data] = useState([]);
  const [pertap, set_perTap] = useState();
  const [tap_cost, set_tap_cost] = useState();
  const [coin, setcoin] = useState();
  const [energy, setEnergy] = useState(null); // Set to null initially to wait for restoration
  const [energy_per_sec, set_energy_per_sec] = useState();
  const [energy_cost, set_energy_cost] = useState();
  const [storage, setStorage] = useState();
  const [storage_cost, set_storage_cost] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);

  const getData = async () => {
    const data = await searchUser("user", "uid", localStorage.getItem("uid"));
    if (data.length > 0) {
      const userData = data[0];
      set_fetch_data(userData);
      setcoin(userData.coin);
      set_energy_per_sec(userData.energy_per_sec);
      set_energy_cost(userData.energy_cost);
      setStorage(userData.storage);
      set_storage_cost(userData.storage_cost);
      set_tap_cost(userData.tap_cost);
      set_perTap(userData.pertap);
      localStorage.setItem('code',userData.code);
      restoreEnergy(userData);
    } else {
      console.log("No user data found");
    }
  };

  const restoreEnergy = (userData) => {
    const savedEnergy = parseInt(localStorage.getItem("energy")) || 10;
    const lastUpdate = parseInt(localStorage.getItem("lastUpdate")) || userData.date || new Date().getTime();

    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - lastUpdate) / 1000);
    const recoveredEnergy = elapsedSeconds * userData.energy_per_sec;

    const restoredEnergy = Math.min(savedEnergy + recoveredEnergy, userData.storage);
    setEnergy(restoredEnergy);

    localStorage.setItem("energy", restoredEnergy);
    localStorage.setItem("lastUpdate", currentTime);
  };

  const saveEnergyToLocalStorage = (newEnergy) => {
    const limitedEnergy = Math.min(newEnergy, storage);
    setEnergy(limitedEnergy);
    localStorage.setItem("energy", limitedEnergy);
    localStorage.setItem("lastUpdate", new Date().getTime());
    update_user("date", new Date().getTime(), fetch_data.id, "user");
  };

  const earn = () => {
    if (energy >= pertap) {
      saveEnergyToLocalStorage(energy - pertap);
      setcoin(coin + pertap);
      update_user("coin", coin + pertap, fetch_data.id, "user");
    }
  };

  const storage_upgrade = () => {
    if (storage_cost <= coin) {
      const newStorage = storage + 200;
      setStorage(newStorage);
      update_user("storage", newStorage, fetch_data.id, "user");

      const newCost = Math.floor(storage_cost + (storage_cost * 3) / 10);
      set_storage_cost(newCost);
      update_user("storage_cost", newCost, fetch_data.id, "user");
    }
  };

  const tap_per_sec = () => {
    if (coin >= tap_cost) {
      set_perTap(pertap + 1);
      update_user("pertap", pertap + 1, fetch_data.id, "user");

      const newCost = Math.floor(tap_cost + (tap_cost * 3) / 10);
      set_tap_cost(newCost);
      update_user("tap_cost", newCost, fetch_data.id, "user");
    }
  };

  const ennergy_recover = () => {
    if (coin >= energy_cost) {
      set_energy_per_sec(energy_per_sec + 1);
      update_user("energy_per_sec", energy_per_sec + 1, fetch_data.id, "user");

      const newCost = Math.floor(energy_cost + (energy_cost * 3) / 10);
      set_energy_cost(newCost);
      update_user("energy_cost", newCost, fetch_data.id, "user");
    }
  };

  useEffect(() => {
    if (storage && energy !== null) {
      const interval = setInterval(() => {
        if (energy < storage) {
          saveEnergyToLocalStorage(energy + energy_per_sec);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [energy, energy_per_sec, storage]);

  return energy !== null ? (
    <div>
      <div className="stars">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>

      <div className="earn-container">
        <div className="earn-header">
          <h1>💰 Earn Coins</h1>
          <p>Tap to earn coins and enhance your energy!</p>
        </div>

        <div className="earn-main">
          <div className="earn-coin-section">
            <p className="earn-coin">{coin} Coins</p>
            <img
              className="earn-image"
              src={require("../Assests/hpcimg1.png")}
              alt="Coin to earn"
              onClick={earn}
            />
            <p className="earn-energy">{energy}/{storage} Energy</p>
          </div>

          <div className="earn-controls">
            <button className="control-btn" onClick={storage_upgrade}>
              <i className="fas fa-database"></i> Upgrade Storage
            </button>
            <button className="control-btn" onClick={ennergy_recover}>
              <i className="fas fa-bolt"></i> Recover Energy
            </button>
            <button className="control-btn" onClick={tap_per_sec}>
              <i className="fas fa-hand-pointer"></i> Increase Per Tap
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Earn;
