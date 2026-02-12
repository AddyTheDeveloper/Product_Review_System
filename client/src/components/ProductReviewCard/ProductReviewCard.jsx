import React, { useState } from 'react';
import StarRating from '../StarRating/StarRating';
import styles from './ProductReviewCard.module.css';

const ProductReviewCard = ({ review, delay }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 200;
    const shouldTruncate = review.comment && review.comment.length > maxLength;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            className={`glass-panel ${styles.card} animate-fade-in`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={styles.header}>
                <div style={{ flex: 1 }}>
                    <h3 className={styles.productName}>{review.product?.name || 'Unknown Product'}</h3>
                    <span className={styles.categoryBadge}>
                        {review.product?.category || 'General'}
                    </span>
                </div>
                <div className={styles.ratingWrapper}>
                    <StarRating rating={review.rating} />
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.comment}>
                    {isExpanded || !shouldTruncate
                        ? review.comment
                        : `${review.comment.substring(0, maxLength)}...`}
                </p>
                {shouldTruncate && (
                    <button onClick={toggleExpand} className={styles.readMoreBtn}>
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </div>

            <div className={styles.footer}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {review.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className={styles.userName}>
                        {review.user?.name || 'Anonymous'}
                    </span>
                </div>
                <span className={styles.date}>
                    {new Date(review.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default ProductReviewCard;
