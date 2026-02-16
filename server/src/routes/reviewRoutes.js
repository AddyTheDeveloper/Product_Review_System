const express = require('express');
const {
    getReviews,
    getReview,
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
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview);

router.post('/standalone', protect, authorize('user', 'admin'), addReviewStandalone);

module.exports = router;
