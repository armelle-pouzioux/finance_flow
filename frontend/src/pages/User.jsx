import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import authService from '../services/authService';

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setSuccess('Mot de passe modifié avec succès !');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          setShowPasswordForm(false);
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="section-header">
        <h2 className="section-title">Mon Profil</h2>
      </div>

      <div className="transactions-section">
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Informations personnelles</h3>

        <div className="form-group">
          <label className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-input"
            value={user?.username || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Membre depuis</label>
          <input
            type="text"
            className="form-input"
            value={new Date().toLocaleDateString('fr-FR')}
            disabled
          />
        </div>
      </div>

      <div className="transactions-section" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Sécurité</h3>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="btn btn-secondary"
          >
            Modifier mon mot de passe
          </button>
        ) : (
          <form onSubmit={handleSubmitPassword}>
            <div className="form-group">
              <label className="form-label">Mot de passe actuel *</label>
              <input
                type="password"
                name="currentPassword"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nouveau mot de passe *</label>
              <input
                type="password"
                name="newPassword"
                className="form-input"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
              <small style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                Minimum 8 caractères
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le nouveau mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="8"
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                background: 'rgba(231, 76, 60, 0.1)',
                color: 'var(--danger)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                background: 'var(--success)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                {success}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setError('');
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="transactions-section" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: 'var(--danger)' }}>
          Déconnexion
        </h3>
        <button onClick={handleLogout} className="btn btn-danger">
          Se déconnecter
        </button>
      </div>
    </DashboardLayout>
  );
}

export default User;
