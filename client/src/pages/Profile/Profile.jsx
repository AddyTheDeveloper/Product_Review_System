import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, LayoutList, Settings } from 'lucide-react';
import styles from './Profile.module.css';
import axios from 'axios';

import MyReviews from '../../components/Profile/MyReviews';
import ActivitySummary from '../../components/Profile/ActivitySummary';
import AccountSettings from '../../components/Profile/AccountSettings';

const Profile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [activeTab, setActiveTab] = useState('reviews');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get('http://localhost:5000/api/reviews/myreviews', config);
                if (data.success) {
                    setReviews(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch user reviews", err);
                setError(err.response?.data?.message || 'Failed to load reviews');
            } finally {
                setLoadingReviews(false);
            }
        };

        if (user && token) {
            fetchReviews();
        } else if (!user) {
            setLoadingReviews(false);
        }
    }, [user, token]);

    const handleDeleteReview = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(`http://localhost:5000/api/reviews/${id}`, config);
                setReviews(reviews.filter(review => review._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const handleUpdateReview = (updatedReview) => {
        setReviews(prevReviews => prevReviews.map(r => r._id === updatedReview._id ? { ...r, ...updatedReview } : r));
    };

    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={`glass-card ${styles.profileCard} animate-fade-in`}>
                <div className={styles.headerSection}>
                    <div className={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className={styles.userName}>{user.name}</h2>
                    <p className={styles.userEmail}>{user.email}</p>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        style={{
                            marginTop: '0.5rem',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.6)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '100px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.borderColor = '#ef4444';
                            e.target.style.color = '#ef4444';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.target.style.color = 'rgba(255,255,255,0.6)';
                        }}
                    >
                        Sign Out
                    </button>
                </div>

                <ActivitySummary reviews={reviews} styles={styles} />

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <LayoutList size={18} />
                        My Reviews
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabBtnActive : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={18} />
                        Account Settings
                    </button>
                </div>

                <div className={styles.contentArea}>
                    {activeTab === 'reviews' ? (
                        <MyReviews
                            reviews={reviews}
                            loading={loadingReviews}
                            error={error}
                            onDelete={handleDeleteReview}
                            onUpdate={handleUpdateReview}
                            styles={styles}
                        />
                    ) : (
                        <AccountSettings styles={styles} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
