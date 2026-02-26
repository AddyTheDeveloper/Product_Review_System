import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../../components/StarRating/StarRating';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import Loader from '../../components/Loader/Loader';
import styles from './ProductDetails.module.css';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Review form state
    const [rating, setRating] = useState(0);
    const [price, setPrice] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data.data);
            } catch {
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) return alert('Please select a rating');

        try {
            await axios.post(`/api/products/${id}/reviews`, {
                rating,
                price: Number(price),
                comment
            });

            // Reset form
            setRating(0);
            setPrice('');
            setComment('');

            // Refresh product data
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data.data);

            alert('Review submitted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <Loader />;

    if (error) return (
        <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h2 style={{ color: 'var(--color-error)' }}>{error}</h2>
        </div>
    );

    if (!product) return null;

    return (
        <div className={styles.container}>
            <div className={`${styles.productSection} glass-panel animate-fade-in`}>
                <div className={styles.imageCol}>
                    <img
                        src={product.image || 'https://via.placeholder.com/600'}
                        alt={product.name}
                        className={styles.image}
                    />
                </div>
                <div className={styles.infoCol}>
                    <div className={styles.headerInfo}>
                        <span className={styles.brandTag}>{product.brand}</span>
                        <h1 className={styles.title}>{product.name}</h1>
                        <span className={styles.typeTag}>{product.productType || 'General'}</span>
                    </div>

                    <div className={styles.meta}>
                        <span className={styles.price}>₹{product.price}</span>
                        <div className={styles.ratingRow}>
                            <StarRating rating={product.rating} />
                            <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    <p className={styles.description}>{product.description}</p>
                </div>
            </div>

            <div className={styles.reviewsSection}>
                <h2 className={styles.sectionTitle}>Reviews</h2>

                <div className={`glass-panel ${styles.writeReview} animate-fade-in delay-100`}>
                    <h3>Write a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className={styles.formGroup}>
                            <label>Your Rating</label>
                            <StarRating rating={rating} interactive onRate={setRating} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Price Paid (₹)</label>
                            <input
                                type="number"
                                className="glass-input"
                                placeholder="How much did you pay?"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Your Review</label>
                            <textarea
                                className="glass-input"
                                rows="4"
                                placeholder="Share your thoughts..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="glass-button">Submit Review</button>
                    </form>
                </div>

                <div className={styles.reviewList}>
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                            <ReviewCard key={review._id || index} review={review} delay={200 + (index * 100)} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
