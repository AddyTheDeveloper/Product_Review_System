import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import Footer from '../../components/Footer/Footer';
import styles from './Home.module.css';

const Home = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch latest 3 reviews
                const res = await axios.get('/api/reviews?limit=3&sort=-createdAt');
                if (res.data.success) {
                    setReviews(res.data.data.slice(0, 3)); // Ensure max 3 if API limit param isn't strict
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const features = [
        { icon: '🛡️', title: 'Unbiased & Transparent', desc: 'Real reviews from verified users. No paid promotions or hidden agendas.' },
        { icon: '👥', title: 'Community Driven', desc: 'Join a growing community of tech enthusiasts and smart shoppers.' },
        { icon: '🔍', title: 'In-Depth Analysis', desc: 'Get detailed insights on performance, value, and long-term durability.' },
        { icon: '✨', title: 'Easy to Use', desc: 'Seamlessly browse, filter, and write reviews with our modern interface.' }
    ];



    const categories = [
        { name: 'Electronics', icon: '💻', slug: 'electronics' },
        { name: 'Books', icon: '📚', slug: 'books' },
        { name: 'Fashion', icon: '👕', slug: 'fashion' },
        { name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen' },
        { name: 'Beauty', icon: '💄', slug: 'beauty' },
        { name: 'Sports', icon: '⚽', slug: 'sports' },
        { name: 'Toys', icon: '🧸', slug: 'toys' },
        { name: 'Automotive', icon: '🚗', slug: 'automotive' },
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.trendingBadge}>
                        <span>✨</span>
                        <span>#1 Trusted Review Platform</span>
                    </div>

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
            </section>

            {/* Features Section */}
            <section className={styles.featuresSection}>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDesc}>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Stats removed as requested */}
            </section>

            {/* Recent Reviews Section */}
            {!loading && reviews.length > 0 && (
                <section className={styles.reviewsSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Fresh off the Press</h2>
                        <p className={styles.sectionSubtitle}>
                            See what people are saying right now.
                        </p>
                    </div>
                    <div className={styles.reviewsGrid}>
                        {reviews.map((review, index) => (
                            <ReviewCard key={review._id} review={review} delay={index * 100} />
                        ))}
                    </div>
                </section>
            )}

            {/* Categories Section */}
            <section className={styles.categoriesSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Explore Categories</h2>
                    <p className={styles.sectionSubtitle}>
                        Find exactly what you're looking for.
                    </p>
                </div>
                <div className={styles.categoriesGrid}>
                    {categories.map((cat, index) => (
                        <Link to={`/products?category=${cat.name}`} key={index} className={styles.categoryCard}>
                            <span className={styles.categoryIcon}>{cat.icon}</span>
                            <span className={styles.categoryName}>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className={styles.sectionTitle}>Ready to Share Your Experience?</h2>
                <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
                    Join thousands of users helping others make better decisions.
                </p>
                <Link to="/register">
                    <button className="glass-button" style={{ minWidth: '200px' }}>Join Now - It's Free</button>
                </Link>
            </section>

            {/* Decorative Elements */}
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
            <Footer />
        </div>
    );
};

export default Home;
