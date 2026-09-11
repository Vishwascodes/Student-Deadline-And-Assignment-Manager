import { NavLink } from 'react-router-dom';
import { FiGrid, FiFileText, FiBookOpen, FiUser, FiX } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/assignments', label: 'Assignments', icon: FiFileText },
  { to: '/subjects', label: 'Subjects', icon: FiBookOpen },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5 lg:hidden">
          <span className="font-bold text-gray-800">Menu</span>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
