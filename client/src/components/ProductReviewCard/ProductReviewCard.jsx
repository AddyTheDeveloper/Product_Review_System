import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import styles from './ProductReviewCard.module.css';
import { getConfidenceScore, highlightText, confidenceLabels } from '../../utils/reviewUtils';

const ProductReviewCard = ({ review, delay }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;
    const shouldTruncate = review.comment && review.comment.length > maxLength;
    const confidenceScore = getConfidenceScore(review.comment, review.rating);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const displayComment = isExpanded || !shouldTruncate
        ? review.comment
        : `${review.comment.substring(0, maxLength)}...`;

    return (
        <div
            className={`glass-panel ${styles.card} animate-fade-in`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={styles.header}>
                <div style={{ flex: 1 }}>
                    <Link to={`/products/${review.product?._id}`} className={styles.productLink}>
                        <h3 className={styles.productName}>{review.product?.name || 'Unknown Product'}</h3>
                    </Link>
                    <div className={styles.badgeRow}>
                        <span className={styles.brandBadge}>
                            {review.product?.brand || 'Generic'}
                        </span>
                        <span className={styles.categoryBadge}>
                            {review.product?.category || 'General'}
                        </span>
                        {review.price > 0 && (
                            <span className={styles.priceTag}>
                                ₹{review.price}
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.ratingWrapper}>
                    <StarRating rating={review.rating} />
                </div>
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

            <div className={styles.content}>
                <p className={styles.comment}>
                    {highlightText(displayComment, styles)}
                </p>
                {shouldTruncate && (
                    <button onClick={toggleExpand} className={styles.readMoreBtn}>
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
                <Link to={`/products/${review.product?._id}`} className={`glass-button ${styles.reviewPageBtn}`}>
                    Review Page
                </Link>
            </div>

            <div className={styles.footer}>
                <div className={styles.userInfo}>
                    <Link to={`/profile/${review.user?._id}`} className={styles.userLink}>
                        <div className={styles.avatar}>
                            {review.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.userName}>
                            {review.user?.name || 'Anonymous'}
                        </span>
                    </Link>
                </div>
                <span className={styles.date}>
                    {new Date(review.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default ProductReviewCard;
