import React from 'react'
import { Outlet } from 'react-router'
import Navbar from './Nav'

const Dashboard = () => {
  return (
    <div>
      {/* <div><Outlet></Outlet></div> */}
        <div><Navbar/></div>
    </div>
  )
}

export default Dashboard