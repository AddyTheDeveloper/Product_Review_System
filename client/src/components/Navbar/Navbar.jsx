import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className={`glass-panel ${styles.navbar}`}>
      <Link to="/" className={styles.logo}>
        <ShoppingBag className={styles.icon} />
        <span>Reviewly</span>
      </Link>

      {/* Desktop Links */}
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/products" className={styles.link}>Products</Link>
        {isAdmin && <Link to="/admin" className={styles.link}>Admin</Link>}
      </div>

      <div className={styles.actions}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/profile" className={styles.profileLink}>
              <div className={styles.avatarSmall}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className={styles.welcomeText}>
                {user.name?.split(' ')[0]}
              </span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className={styles.loginBtn}>
              <button className="glass-button">Login</button>
            </Link>
            <Link to="/register" className={styles.loginBtn}>
              <button className="glass-button-secondary">Sign Up</button>
            </Link>
          </>
        )}

        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Products</Link>
          {isAdmin && <Link to="/admin" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}

          {user ? (
            <>
              <Link to="/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button className={styles.mobileLink} onClick={handleLogout} style={{ width: '100%', textAlign: 'center', background: 'none', border: 'none', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--color-error)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
