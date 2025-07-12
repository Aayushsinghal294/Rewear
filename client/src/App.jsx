import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import {Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Browse from './pages/Browse'
import MySwaps from './pages/MySwaps'
import ListItem from './pages/ListItem'
import ItemDetail from './pages/ItemDetail'

const App = () => {


const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster/>
     {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/swaps" element={<MySwaps/>} />
        <Route path="/list-item" element={<ListItem/>} />
        <Route path="/items/:id" element={<ItemDetail/>} />
      </Routes>
    </>
  )
}

export default App
