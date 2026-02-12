import { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';

import styles from './ProductList.module.css';
import axios from 'axios';
import ProductReviewCard from '../../components/ProductReviewCard/ProductReviewCard';

const ProductList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const categories = ['All', 'Technology', 'Fashion', 'Personal Care', 'Food and Beverages', 'Education', 'Accessories', 'Vehicles', 'Other'];

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                let url = '/api/reviews?';
                if (category !== 'All') {
                    url += `category=${category}&`;
                }
                if (debouncedSearch) {
                    url += `search=${debouncedSearch}`;
                }

                const response = await axios.get(url);

                // Aggressive deduplication: Ensure only one review per user per product is shown
                const uniqueReviewsMap = new Map();
                response.data.data.forEach(review => {
                    if (review.user && review.product) {
                        const compositeKey = `${review.user._id || review.user.id}-${review.product._id || review.product.id}`;
                        if (!uniqueReviewsMap.has(compositeKey)) {
                            uniqueReviewsMap.set(compositeKey, review);
                        }
                    } else {
                        // If data is incomplete, fall back to _id
                        uniqueReviewsMap.set(review._id, review);
                    }
                });

                setReviews(Array.from(uniqueReviewsMap.values()));
                setError(null);
            } catch (err) {
                setError('Failed to fetch reviews');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [category, debouncedSearch]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="animate-fade-in">Latest Reviews</h1>

                <div className={styles.filterWrapper}>
                    <input
                        type="text"
                        placeholder="Search reviews or products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`glass-input ${styles.searchInput}`}
                        style={{ marginBottom: '1rem', width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text)', outline: 'none' }}
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`glass-input ${styles.categorySelect}`}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <div style={{ color: 'var(--color-error)', textAlign: 'center' }}>{error}</div>}

            {loading ? (
                <Loader />
            ) : (
                <>
                    {reviews.length === 0 && !error && (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                            <p>No reviews found for this category. Be the first to write one!</p>
                        </div>
                    )}

                    <div className={styles.grid}>
                        {reviews.map((review, index) => (
                            <ProductReviewCard key={review._id} review={review} delay={index * 100} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductList;
