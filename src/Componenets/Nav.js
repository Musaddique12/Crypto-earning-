import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Outlet />
      {/* Hamburger Button */}
      <button className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Navbar */}
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="nav-item">
          <NavLink to="earn" activeClassName="active">
            <i className="fas fa-home"></i>
            Earn
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="games" activeClassName="active">
            <i className="fas fa-gamepad"></i>
            Games
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="wallet" activeClassName="active">
            <i className="fas fa-wallet"></i>
            Wallet
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="ref" activeClassName="active">
            <i className="fas fa-user-friends"></i>
            Referral
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
