const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters'],
    },
    description: {
        type: String,
        default: 'No description provided.',
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand'],
    },
    productType: {
        type: String,
        default: 'General',
    },
    image: {
        type: String,
        default: 'no-photo.jpg',
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must can not be more than 5'],
        default: 1, // Default to 1 to satisfy min validator
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

// Cascade delete reviews when a product is deleted
productSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(`Reviews being removed from product ${this._id}`);
    await this.model('Review').deleteMany({ product: this._id });
    next();
});

module.exports = mongoose.model('Product', productSchema);
