import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const navItems = [
  {
    id: 'home',
    path: '/dashboard',
    label: 'Accueil',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
  },
  {
    id: 'stats',
    path: '/stats',
    label: 'Stats',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
  },
  { id: 'fab', path: null, icon: null, label: 'Ajouter' },
  {
    id: 'profile',
    path: '/user',
    label: 'Profil',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Réglages',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m8.66-12l-5.2 3M8.54 14l-5.2 3m13.86 0l-5.2-3M8.54 10l-5.2-3"/>
      </svg>
    ),
  },
];

function BottomNav({ onFabClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        if (item.id === 'fab') {
          return (
            <button
              key="fab"
              className="fab fab-nav"
              onClick={onFabClick}
              aria-label="Ajouter une transaction"
            >
              <span className="fab-icon">+</span>
            </button>
          );
        }

        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.id}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  );
}

BottomNav.propTypes = {
  onFabClick: PropTypes.func.isRequired,
};

export default BottomNav;
