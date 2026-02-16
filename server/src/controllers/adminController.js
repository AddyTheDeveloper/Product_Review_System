const User = require('../models/User');
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalReviews = await Review.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Calculate average rating across all reviews
        // Calculate average rating and distribution
        const reviews = await Review.find().select('rating');

        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
            : 0;

        // Rating distribution
        const ratingDistribution = [0, 0, 0, 0, 0]; // 1 to 5 stars
        reviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating - 1]++;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalReviews,
                totalProducts,
                avgRating: avgRating.toFixed(1),
                ratingDistribution
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
