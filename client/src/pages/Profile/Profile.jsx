import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Shield, LogOut, LayoutList, Settings } from 'lucide-react';
import styles from './Profile.module.css';
import axios from 'axios';

import MyReviews from '../../components/Profile/MyReviews';
import ActivitySummary from '../../components/Profile/ActivitySummary';
import AccountSettings from '../../components/Profile/AccountSettings';

const Profile = () => {
    const { user: authUser, token, logout } = useAuth();
    const navigate = useNavigate();
    const { userId } = useParams(); // Get userId from URL/Route

    // State to hold the user being viewed (could be authUser or another user)
    const [profileUser, setProfileUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [activeTab, setActiveTab] = useState('reviews');
    const [error, setError] = useState(null);

    // Determine if we are viewing our own profile
    const isOwnProfile = !userId || (authUser && userId === authUser._id);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoadingReviews(true);
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                let currentUserData = authUser;

                // If viewing another user, fetch their details from public endpoint
                if (userId && userId !== authUser?._id) {
                    try {
                        // Use public endpoint instead of admin one
                        const userRes = await axios.get(`/api/users/${userId}`);
                        if (userRes.data.success) {
                            currentUserData = userRes.data.data;
                        }
                    } catch (err) {
                        console.error("Failed to fetch user details", err);
                        setError("Failed to load user profile");
                        setLoadingReviews(false);
                        return;
                    }
                }

                setProfileUser(currentUserData);

                // Fetch reviews for the profile user
                // If it's own profile, use /myreviews, else use public filter
                let reviewsUrl = '/api/reviews/myreviews';

                // If we have a general review search endpoint that filters by user, we should use that for others.
                // However, based on reviewController, we can fitler by user in general GetReviews?
                // The reviewController `getReviews` does: `if (req.query.search ...)`
                // It doesn't explicitly look like it filters by `user` query param in the `getReviews` (public) controller 
                // UNLESS we add that capability or use an admin endpoint.

                // The `getMyReviews` endpoint is specific to logged in user.

                // For this implementation, since only Admin can click to view profile, 
                // and Admin can view all reviews, we might need a way to get reviews by user ID.
                // Let's assume we can pass `?user=userId` to `getReviews` but `getReviews` logic 
                // in reviewController needed to support it. 
                // Looking at `reviewController.js`: 
                // `const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'category', 'brand', 'productType'];`
                // `user` is NOT in removeFields, so `reqQuery` will contain `user`.
                // `Review.find(reqQuery)` will work if `user` is in the schema!

                if (!isOwnProfile) {
                    reviewsUrl = `/api/reviews?user=${userId}`;
                }

                const { data } = await axios.get(reviewsUrl, isOwnProfile ? config : {});
                // Note: getReviews is public, but myreviews needs token. 
                // If using getReviews with ?user=ID, it's public so no strictly needed token 
                // unless we want to ensure we see everything.

                if (data.success) {
                    setReviews(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err);
                setError(err.response?.data?.message || 'Failed to load reviews');
            } finally {
                setLoadingReviews(false);
            }
        };

        if (token) {
            fetchProfileData();
        }
    }, [userId, authUser, token, isOwnProfile]);

    const handleDeleteReview = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                // Admin can delete any review, User can delete own.
                // The endpoint `api/reviews/:id` supports both (admin check in controller).
                await axios.delete(`/api/reviews/${id}`, config);
                setReviews(reviews.filter(review => review._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const handleUpdateReview = (updatedReview) => {
        setReviews(prevReviews => prevReviews.map(r => r._id === updatedReview._id ? { ...r, ...updatedReview } : r));
    };

    if (!profileUser) return <div className={styles.container}><div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div></div>;

    return (
        <div className={styles.container}>
            <div className={`glass-card ${styles.profileCard} animate-fade-in`}>
                <div className={styles.headerSection}>
                    <div className={styles.avatar}>
                        {profileUser.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className={styles.userName}>{profileUser.name}</h2>
                    <p className={styles.userEmail}>{profileUser.email}</p>
                    {isOwnProfile && (
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
                    )}
                </div>

                <ActivitySummary reviews={reviews} styles={styles} />

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <LayoutList size={18} />
                        Reviews
                    </button>
                    {isOwnProfile && (
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={18} />
                            Account Settings
                        </button>
                    )}
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
                            readOnly={!isOwnProfile && authUser.role !== 'admin'} // Example: only owner or admin can edit
                        />
                    ) : (
                        isOwnProfile && <AccountSettings styles={styles} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
