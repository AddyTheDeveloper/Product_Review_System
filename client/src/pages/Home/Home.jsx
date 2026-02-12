import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.heroContent}>
                <h1 className={`animate-fade-in ${styles.title}`}>
                    Real Users. <span className={styles.highlight}>Real Reviews.</span>
                </h1>
                <p className={`animate-fade-in delay-100 ${styles.subtitle}`}>
                    Discover the best products curated by our community. Unbiased, transparent, and trusted.
                </p>

                <div className={`animate-fade-in delay-200 ${styles.ctaGroup}`}>
                    <Link to="/write-review">
                        <button className="glass-button">Write a Review</button>
                    </Link>
                    <Link to="/products">
                        <button className="glass-button-secondary">
                            Browse Reviews
                        </button>
                    </Link>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
        </div>
    );
};

export default Home;
