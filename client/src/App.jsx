import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import {Toaster } from 'react-hot-toast'

const App = () => {


const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster/>
     {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </>
  )
}

export default App
