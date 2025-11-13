import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConfirmDialog from './ConfirmDialog';

const navLinks = [
  {
    path: '/dashboard',
    label: 'Accueil',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
  },
  {
    path: '/stats',
    label: 'Statistiques',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
  },
  {
    path: '/user',
    label: 'Profil',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Réglages',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m8.66-12l-5.2 3M8.54 14l-5.2 3m13.86 0l-5.2-3M8.54 10l-5.2-3"/>
      </svg>
    ),
  },
];

function Header({ showLogout = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* Header Desktop */}
      <header className="dashboard-header-desktop">
        <div className="header-content">
          <h1 className="logo-desktop">
            Finance<span>Flow</span>
          </h1>

          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.path}
                className={`desktop-nav-item ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => navigate(link.path)}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {showLogout && (
            <div className="header-user">
              <span className="username-desktop">{user?.username}</span>
              <button
                onClick={handleLogoutClick}
                className="logout-btn"
                aria-label="Déconnexion"
                title="Déconnexion"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Header Mobile */}
      <header className="dashboard-header-mobile">
        <h1 className="logo-mobile">
          Finance <span>Flow</span>
        </h1>
        {showLogout && (
          <button
            onClick={handleLogoutClick}
            className="logout-btn logout-mobile"
            aria-label="Déconnexion"
            title="Déconnexion"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
      </header>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirmation de déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmText="Se déconnecter"
        cancelText="Annuler"
      />
    </>
  );
}

Header.propTypes = {
  showLogout: PropTypes.bool,
};

export default Header;
