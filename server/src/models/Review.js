const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
    },
    price: {
        type: Number,
        required: [true, 'Please add the price you paid'],
        min: [0, 'Price must be positive'],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
reviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 },
            },
        },
    ]);

    try {
        if (obj[0]) {
            await this.model('Product').findByIdAndUpdate(productId, {
                averageRating: obj[0].averageRating,
                reviewCount: obj[0].count,
            });
        } else {
            // No reviews left, delete the product
            await this.model('Product').findByIdAndDelete(productId);
            console.log(`Product ${productId} deleted because it has no reviews.`);
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.product);
});

// Call getAverageRating after remove
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
    this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
