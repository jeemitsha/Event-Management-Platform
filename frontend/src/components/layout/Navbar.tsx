import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { fetchEvents } = useEvents();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = async () => {
    if (user) {
      await fetchEvents({
        searchQuery: '',
        category: '',
        startDate: '',
        endDate: '',
        isUpcoming: false,
        sortBy: 'date',
        sortOrder: 'asc'
      });
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleDashboardClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await fetchEvents({
      searchQuery: '',
      category: '',
      startDate: '',
      endDate: '',
      isUpcoming: false,
      sortBy: 'date',
      sortOrder: 'asc'
    });
    navigate('/dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button 
                onClick={handleLogoClick}
                className="text-lg sm:text-xl font-bold text-white hover:text-indigo-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg 
                  className="h-8 w-8" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <span>Event Manager</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={handleDashboardClick}
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Logout
                </button>
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium bg-indigo-700">
                  {user.name || user.email}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div 
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } sm:hidden bg-indigo-700 shadow-lg transition-all duration-200 ease-in-out`}
      >
        <div className="pt-2 pb-3 space-y-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={handleDashboardClick}
                className="block px-4 py-2 text-base font-medium text-indigo-100 hover:text-white hover:bg-indigo-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-indigo-100 hover:text-white hover:bg-indigo-600 transition-colors duration-200"
              >
                Logout
              </button>
              <div className="block px-4 py-2 text-base font-medium text-white bg-indigo-800">
                {user.name || user.email}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-indigo-100 hover:text-white hover:bg-indigo-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-white bg-indigo-800 hover:bg-indigo-900 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 