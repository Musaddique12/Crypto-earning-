import React, { Children } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WalletPage from './Componenets/WalletPage';
import Earn from './Componenets/Earn';
import StonePaperScissors from './Componenets/Games';
import Transaction from './Componenets/Transaction';
import SwapPage from './Componenets/SwapPage';
import ReferralPage from './Componenets/ReferralPage';
import AuthPage from './Componenets/SingupLogin';
import './App.css'; // Import the CSS file
import Navbar from './Componenets/Nav';
import RefUser from './Componenets/RefUser';
import Dashboard from './Componenets/Dashboard';

const App = () => {
  const router = createBrowserRouter([
    // Routes for the main app
    {  path: '/', element: <AuthPage />},
    {
      path: '/start',
      element: <Dashboard />,
      children: [
        { path: 'earn', element: <Earn /> },
        { path: 'swap', element: <SwapPage /> },
        { path: 'wallet', element: <WalletPage /> },
        { path: 'transaction', element: <Transaction /> },
        { path: 'games', element: <StonePaperScissors /> },
        { path: 'ref', element: <ReferralPage /> },

      ]
    },
        { path: 'refuser', element: <RefUser /> }
  ]);

  return (
    <div>
      {/* Background Animation */}
      <div className="background-animation" />
      {/* Background Moon GIF */}
      <img
        src="https://i.makeagif.com/media/5-27-2017/MKjwbG.gif" // Moon GIF URL
        alt="Animated GIF of a 3D moon background"
        className="moon-background"
      />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
