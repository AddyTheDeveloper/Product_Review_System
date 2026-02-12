import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import styles from './Profile.module.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={`glass-card ${styles.profileCard} animate-fade-in`}>
                <div className={styles.avatar}>
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <h2>{user.name}</h2>

                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={18} className={styles.label} />
                            <span className={styles.label}>Email</span>
                        </div>
                        <span className={styles.value}>{user.email}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={18} className={styles.label} />
                            <span className={styles.label}>Role</span>
                        </div>
                        <span className={styles.value} style={{ textTransform: 'capitalize' }}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <button onClick={handleLogout} className={`glass-button ${styles.logoutBtn}`}>
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
