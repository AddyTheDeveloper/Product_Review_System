import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

const StarRating = ({ rating = 0, interactive = false, onRate }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className={styles.container}>
            {[...Array(5)].map((_, index) => {
                const value = index + 1;
                const filled = interactive ? (value <= (hover || rating)) : (value <= rating);

                return (
                    <Star
                        key={index}
                        size={interactive ? 24 : 16}
                        className={`${styles.star} ${filled ? styles.filled : ''} ${interactive ? styles.interactive : ''}`}
                        onMouseEnter={() => interactive && setHover(value)}
                        onMouseLeave={() => interactive && setHover(0)}
                        onClick={() => interactive && onRate && onRate(value)}
                        fill={filled ? "currentColor" : "none"}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
