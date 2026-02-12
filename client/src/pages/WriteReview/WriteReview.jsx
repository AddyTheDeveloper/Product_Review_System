import { useState } from 'react';
import axios from 'axios';
import StarRating from '../../components/StarRating/StarRating';
import Input from '../../components/UI/Input';
import styles from './WriteReview.module.css';

const WriteReview = () => {
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        productName: '',
        productType: '',
        review: '',
        rating: 0
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRating = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (formData.rating === 0) {
            setMessage({ text: 'Please select a star rating.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/reviews/standalone', {
                category: formData.category,
                brand: formData.brand,
                productName: formData.productName,
                productType: formData.productType,
                rating: formData.rating,
                comment: formData.review
            });

            setMessage({ text: 'Review submitted successfully!', type: 'success' });
            setFormData({
                category: '',
                brand: '',
                productName: '',
                productType: '',
                review: '',
                rating: 0
            });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to submit review.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`glass-panel ${styles.card} animate-fade-in`}>
                <h1 className={styles.title}>Write a Review</h1>
                <p className={styles.subtitle}>Share your experience with the community.</p>

                {message.text && (
                    <div className={styles.message} style={{
                        color: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)',
                        textAlign: 'center',
                        marginBottom: '1rem'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`glass-input ${styles.select}`}
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Personal Care">Personal Care</option>
                            <option value="Food and Beverages">Food and Beverages</option>
                            <option value="Education">Education</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <Input
                        label="Product Type"
                        name="productType"
                        value={formData.productType}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Brand Name"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Product Name"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                    />

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Your Rating</label>
                        <StarRating rating={formData.rating} interactive onRate={handleRating} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Your Review</label>
                        <textarea
                            name="review"
                            className={`glass-input ${styles.textarea}`}
                            rows="4"
                            placeholder="Write your review here..."
                            value={formData.review}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="glass-button" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WriteReview;
