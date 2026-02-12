import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, MessageSquare, Users, BarChart2, Trash2, Search } from 'lucide-react';
import StarRating from '../../components/StarRating/StarRating';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Filters for reviews
    const [reviewFilters, setReviewFilters] = useState({
        search: '',
        rating: '',
        category: ''
    });



    // Initial Fetch
    useEffect(() => {
        fetchStats();
    }, []);

    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === 'analytics') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'reviews') fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Apply filters for reviews
    useEffect(() => {
        if (activeTab === 'reviews') {
            const timer = setTimeout(() => {
                fetchReviews();
            }, 500); // Debounce
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewFilters, activeTab]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReviews = async () => {
        try {
            let query = '/api/admin/reviews?';
            if (reviewFilters.search) query += `search=${reviewFilters.search}&`;
            if (reviewFilters.rating) query += `rating=${reviewFilters.rating}&`;
            if (reviewFilters.category) query += `category=${reviewFilters.category}&`;

            const res = await axios.get(query);
            setReviews(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };


    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            fetchUsers();
            fetchStats();
        } catch {
            alert('Failed to delete user');
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`/api/admin/reviews/${id}`);
            fetchReviews();
            fetchStats();
        } catch {
            alert('Failed to delete review');
        }
    };

    return (
        <div className={styles.container}>
            <aside className={`glass-panel ${styles.sidebar}`}>
                <div className={styles.sidebarHeader}>
                    <h3>Admin Panel</h3>
                </div>
                <nav className={styles.nav}>
                    <button className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`} onClick={() => setActiveTab('analytics')}>
                        <BarChart2 size={20} /> Analytics
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'reviews' ? styles.active : ''}`} onClick={() => setActiveTab('reviews')}>
                        <MessageSquare size={20} /> Review Moderation
                    </button>
                    <button className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={20} /> User Monitoring
                    </button>
                </nav>
            </aside>

            <main className={styles.content}>
                <header className={styles.header}>
                    <h2>
                        {activeTab === 'analytics' && 'Analytics & Insights'}
                        {activeTab === 'reviews' && 'Review Moderation'}
                        {activeTab === 'users' && 'User Monitoring'}
                    </h2>
                </header>

                {/* --- Analytics Tab --- */}
                {activeTab === 'analytics' && stats && (
                    <div className={styles.dashboardGrid}>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h4>Total Users</h4>
                            <span className={styles.statValue}>{stats.totalUsers}</span>
                        </div>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h4>Total Products</h4>
                            <span className={styles.statValue}>{stats.totalProducts}</span>
                        </div>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h4>Total Reviews</h4>
                            <span className={styles.statValue}>{stats.totalReviews}</span>
                        </div>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h4>Avg Rating</h4>
                            <span className={styles.statValue}>{stats.avgRating} / 5.0</span>
                        </div>
                        {/* Simple Distribution Chart Visualization */}
                        <div className={`glass-card ${styles.chartCard}`} style={{ gridColumn: '1 / -1' }}>
                            <h4>Rating Distribution</h4>
                            <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '1rem', marginTop: '1rem', paddingBottom: '1rem' }}>
                                {stats.ratingDistribution.map((count, index) => {
                                    const maxVal = Math.max(...stats.ratingDistribution) || 1;
                                    const percentage = (count / maxVal);
                                    // Max bar height is 120px
                                    const barHeight = Math.max(percentage * 120, 4); // Min 4px

                                    return (
                                        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                            <div style={{
                                                width: '100%',
                                                height: `${barHeight}px`,
                                                background: 'var(--color-primary)',
                                                borderRadius: '4px 4px 0 0',
                                                transition: 'height 0.3s ease'
                                            }}></div>
                                            <span style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{index + 1} ★</span>
                                            <span style={{ fontWeight: 'bold' }}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Reviews Tab --- */}
                {activeTab === 'reviews' && (
                    <div className={`glass-panel ${styles.tableContainer}`}>
                        <div className={styles.filters}>
                            <div className={styles.searchBox}>
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    value={reviewFilters.search}
                                    onChange={(e) => setReviewFilters({ ...reviewFilters, search: e.target.value })}
                                    className={styles.searchInput}
                                />
                            </div>
                            <select
                                value={reviewFilters.category}
                                onChange={(e) => setReviewFilters({ ...reviewFilters, category: e.target.value })}
                                className={styles.filterSelect}
                            >
                                <option value="">All Categories</option>
                                <option value="Technology">Technology</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Personal Care">Personal Care</option>
                                <option value="Food and Beverages">Food and Beverages</option>
                                <option value="Education">Education</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Vehicles">Vehicles</option>
                            </select>
                            <select
                                value={reviewFilters.rating}
                                onChange={(e) => setReviewFilters({ ...reviewFilters, rating: e.target.value })}
                                className={styles.filterSelect}
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Review</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(review => (
                                    <tr key={review._id}>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{review.product?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{review.product?.brand}</div>
                                        </td>
                                        <td>
                                            <div>{review.user?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{review.user?.email}</div>
                                        </td>
                                        <td><StarRating rating={review.rating} /></td>
                                        <td>
                                            <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {review.comment}
                                            </div>
                                        </td>
                                        <td>
                                            <button className={styles.iconButton} onClick={() => handleDeleteReview(review._id)}>
                                                <Trash2 size={18} color="var(--color-error)" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Users Tab --- */}
                {activeTab === 'users' && (
                    <div className={`glass-panel ${styles.tableContainer}`}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '12px',
                                                background: user.role === 'admin' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                                fontSize: '0.8rem'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.role !== 'admin' && (
                                                <button className={styles.iconButton} onClick={() => handleDeleteUser(user._id)}>
                                                    <Trash2 size={18} color="var(--color-error)" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
