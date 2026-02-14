import React from 'react';
import { BarChart2, Star, Tag } from 'lucide-react';

const ActivitySummary = ({ reviews, styles }) => {
    // Calculate stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / totalReviews).toFixed(1)
        : 0;

    // Find most reviewed category
    const categories = reviews.map(r => r.product?.category).filter(Boolean);
    const categoryCounts = categories.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});

    const mostReviewedCategory = Object.keys(categoryCounts).length > 0
        ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: color }}>
                <Icon size={24} color="white" />
            </div>
            <div className={styles.statInfo}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statValue}>{value}</span>
            </div>
        </div>
    );

    return (
        <div className={styles.statsGrid}>
            <StatCard
                icon={BarChart2}
                label="Total Reviews"
                value={totalReviews}
                color="rgba(59, 130, 246, 0.5)"
            />
            <StatCard
                icon={Star}
                label="Average Rating"
                value={avgRating}
                color="rgba(234, 179, 8, 0.5)"
            />
            <StatCard
                icon={Tag}
                label="Favorite Category"
                value={mostReviewedCategory}
                color="rgba(168, 85, 247, 0.5)"
            />
        </div>
    );
};

export default ActivitySummary;
