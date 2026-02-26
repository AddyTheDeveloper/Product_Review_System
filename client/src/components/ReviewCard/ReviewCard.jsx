import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import styles from './ReviewCard.module.css';
import { getConfidenceScore, highlightText, confidenceLabels } from '../../utils/reviewUtils';

const ReviewCard = ({ review, delay }) => {
    const confidenceScore = getConfidenceScore(review.comment, review.rating);

    return (
        <div
            className={`glass-panel ${styles.card} animate-fade-in`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={styles.header}>
                <div className={styles.avatar}>
                    {review.user.name.charAt(0)}
                </div>
                <div className={styles.userInfo}>
                    <Link to={`/profile/${review.user._id}`} className={styles.userLink}>
                        <span className={styles.userName}>{review.user.name}</span>
                    </Link>
                    <span className={styles.date}>
                        {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className={styles.rating}>
                    <div className={styles.brandRow}>
                        {review.product?.brand && (
                            <span className={styles.brandBadge}>{review.product.brand}</span>
                        )}
                        <StarRating rating={review.rating} />
                    </div>
                    {review.price > 0 && (
                        <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                            <span className={styles.priceTag}>₹{review.price}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.navigationRow}>
                <Link to="/products" className={styles.browseLink}>
                    &larr; Browse All Reviews
                </Link>
            </div>

            <div className={styles.confidenceContainer}>
                <span className={styles.confidenceLabel}>Confidence: </span>
                <div className={styles.meter}>
                    {[1, 2, 3, 4, 5].map((step) => (
                        <span
                            key={step}
                            className={`${styles.dot} ${step <= confidenceScore ? styles.active : ''}`}
                        ></span>
                    ))}
                </div>
                <span className={styles.confidenceText}>({confidenceLabels[confidenceScore - 1]})</span>
            </div>

            <p className={styles.comment}>{highlightText(review.comment, styles)}</p>
        </div>
    );
};

export default ReviewCard;
