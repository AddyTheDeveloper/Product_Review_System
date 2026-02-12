const express = require('express');
const {
    getReviews,
    addReview,
    addReviewStandalone
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(getReviews)
    .post(protect, authorize('user', 'admin'), addReview);

router.post('/standalone', protect, authorize('user', 'admin'), addReviewStandalone);

module.exports = router;
