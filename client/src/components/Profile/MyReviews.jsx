import React, { useState } from 'react';
import { Star, Edit2, Trash2, Calendar, Tag, ShoppingBag } from 'lucide-react';
import EditReviewModal from './EditReviewModal';

const MyReviews = ({ reviews, loading, error, onDelete, styles, onUpdate, readOnly = false }) => {
    const [editingReview, setEditingReview] = useState(null);

    const handleUpdateSuccess = (updatedReview) => {
        onUpdate(updatedReview);
        setEditingReview(null);
    };

    if (loading) return <div className="animate-pulse">Loading reviews...</div>;

    if (error) {
        return (
            <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                textAlign: 'center'
            }}>
                {error}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600', paddingLeft: '0.5rem' }}>
                Your Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
                <div className={styles.reviewCard} style={{ textAlign: 'center', color: '#aaa' }}>
                    <p>You haven't written any reviews yet. Go to a product page to share your experience!</p>
                </div>
            ) : (
                <div className={styles.reviewsList}>
                    {reviews.map(review => (
                        <div key={review._id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.productInfo}>
                                    <h4>{review.product?.name || 'Unknown Product'}</h4>
                                    <div className={styles.metaTags}>
                                        <span className={styles.metaTag}>
                                            <ShoppingBag size={12} /> {review.product?.brand}
                                        </span>
                                        <span className={styles.metaTag}>
                                            <Tag size={12} /> {review.product?.category}
                                        </span>
                                    </div>
                                </div>
                                {!readOnly && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className={styles.deleteBtn}
                                            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                                            onClick={() => setEditingReview(review)}
                                            title="Edit Review"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => onDelete(review._id)}
                                            title="Delete Review"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', color: '#ffd700' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                                    ))}
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>•</span>
                                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Calendar size={14} /> {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {editingReview && (
                <EditReviewModal
                    review={editingReview}
                    onClose={() => setEditingReview(null)}
                    onUpdate={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default MyReviews;
