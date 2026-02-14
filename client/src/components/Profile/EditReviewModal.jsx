import React, { useState } from 'react';
import { X, Star, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const EditReviewModal = ({ review, onClose, onUpdate }) => {
    const { token } = useAuth();
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.put(`http://localhost:5000/api/reviews/${review._id}`, {
                rating,
                comment
            }, config);

            onUpdate(res.data.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update review');
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="glass-card animate-fade-in" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '2rem',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Edit Review</h3>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            Rating
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        color: star <= rating ? '#ffd700' : 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            Comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="glass-button"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            color: 'black',
                            fontWeight: '600'
                        }}
                    >
                        {loading ? 'Saving...' : <><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditReviewModal;
