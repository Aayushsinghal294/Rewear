import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuIcon, XIcon, Shirt, PlusCircle, LogIn, ShirtIcon } from 'lucide-react'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import { assets } from '../assets/assets'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-yellow-200/80 via-white/80 to-yellow-100/80 backdrop-blur-lg shadow-xl px-6 py-4 md:px-12 border-b border-yellow-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/">
          <img src={assets.logo} alt="ReWear Logo" className="w-20 h-auto drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
          <Link to="/" className="relative group transition">
            <span className="hover:text-yellow-700 transition"> Home </span>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/browse" className="relative group transition">
            <span className="hover:text-yellow-700 transition">Browse Items</span>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/list-item" className="relative group transition">
            <span className="hover:text-yellow-700 transition">List an Item</span>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/swaps" className="relative group transition">
            <span className="hover:text-yellow-700 transition">My Swaps</span>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
          </Link>
          {user && (
            <Link to="/dashboard" className="relative group transition">
              <span className="hover:text-yellow-700 transition">Dashboard</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
            </Link>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {!user ? (
            <button onClick={openSignIn} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300">
              <LogIn size={18} /> <span className="font-semibold">Login</span>
            </button>
          ) : (
            <div className="rounded-full border-2 border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300">
              <UserButton />
            </div>
          )}
          <MenuIcon className="md:hidden w-8 h-8 cursor-pointer text-yellow-700 hover:scale-110 transition-transform duration-200" onClick={() => setIsOpen(true)} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-100 via-white to-yellow-200/90 z-50 flex flex-col items-center justify-center gap-8 text-xl font-semibold shadow-2xl animate-fade-in">
          <XIcon className="absolute top-6 right-6 w-8 h-8 cursor-pointer text-yellow-700 hover:scale-110 transition-transform duration-200" onClick={() => setIsOpen(false)} />
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-700 transition">Home</Link>
          <Link to="/browse" onClick={() => setIsOpen(false)} className="hover:text-yellow-700 transition">Browse Items</Link>
          <Link to="/list-item" onClick={() => setIsOpen(false)} className="hover:text-yellow-700 transition">List an Item</Link>
          <Link to="/swaps" onClick={() => setIsOpen(false)} className="hover:text-yellow-700 transition">My Swaps</Link>
          {user && <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-yellow-700 transition">Dashboard</Link>}
        </div>
      )}
    </nav>
  )
}

export default Navbar
