const express = require('express');
const {
    getReviews,
    addReview,
    addReviewStandalone,
    getMyReviews,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(getReviews)
    .post(protect, authorize('user', 'admin'), addReview);

router.get('/myreviews', protect, getMyReviews);
router
    .route('/:id')
    .get(getReviews) // Optional: getting a single review if needed, but not implemented in controller yet
    .put(protect, updateReview)
    .delete(protect, deleteReview);

router.post('/standalone', protect, authorize('user', 'admin'), addReviewStandalone);

module.exports = router;
