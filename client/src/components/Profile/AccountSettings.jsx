import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, Save } from 'lucide-react';

const AccountSettings = ({ styles }) => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put('/api/auth/updatepassword', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, config);

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Call backend logout to clear cookie
            // Note: Axios might need withCredentials: true if your backend serves cookies for auth
            // But here we might just be using the token from context.
            // If the backend sets a cookie, we should ideally call the logout endpoint.
            await axios.get('/api/auth/logout');
            logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
            // Force client-side logout anyway
            logout();
            navigate('/');
        }
    };

    return (
        <div className="animate-fade-in" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600', paddingLeft: '0.5rem', textAlign: 'center' }}>
                Or Update Your Password
            </h3>

            <form onSubmit={handleUpdatePassword} className={styles.settingsForm}>
                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                        color: message.type === 'error' ? '#fca5a5' : '#86efac',
                        border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} className={styles.inputIcon} />
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            className={styles.glassInput}
                            placeholder="Enter current password"
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>New Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} className={styles.inputIcon} />
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className={styles.glassInput}
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Confirm New Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} className={styles.inputIcon} />
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={passwords.confirmNewPassword}
                            onChange={handleChange}
                            className={styles.glassInput}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
                </button>
            </form>

            <div className={styles.dangerZone}>
                <h4 className={styles.dangerTitle}>Danger Zone</h4>
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutBtn}
                    >
                        <LogOut size={18} /> Logout from all devices
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
