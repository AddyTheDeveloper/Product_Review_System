const express = require('express');
const { getUsers, deleteUser, getAdminStats } = require('../controllers/adminController');
const { getReviews, deleteReview } = require('../controllers/reviewController'); // We'll add filter support to getReviews and implement deleteReview
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .delete(deleteUser);

router.route('/stats')
    .get(getAdminStats);

// Review management endpoints for Admin
// We can reuse getReviews but maybe we want a specific admin one if logic differs too much.
// For now, let's assume we use the general one but with more query powers, or we can map it here.
// Actually, let's map /admin/reviews to getReviews so we can pass filters.
router.route('/reviews')
    .get(getReviews);

router.route('/reviews/:id')
    .delete(deleteReview);

module.exports = router;
