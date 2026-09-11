import { Link } from 'react-router-dom';
import { FiMenu, FiLogOut, FiBell } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu size={20} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
            SD
          </div>
          <span className="hidden text-base font-bold text-gray-800 sm:block">Deadline Manager</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100"
        >
          {user?.profilePicture ? (
            <img
              src={`${SERVER_URL}${user.profilePicture}`}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-100"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{user?.name}</span>
        </Link>
        <button
          onClick={logout}
          title="Logout"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
