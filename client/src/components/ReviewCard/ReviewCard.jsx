import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ review, delay }) => {
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
                    <StarRating rating={review.rating} />
                </div>
            </div>

            <p className={styles.comment}>{review.comment}</p>
        </div>
    );
};

export default ReviewCard;
