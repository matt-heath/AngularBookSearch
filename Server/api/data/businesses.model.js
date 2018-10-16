var mongoose = require('mongoose');

var votesSchema = new mongoose.Schema({
    funny: Number,
    useful: Number,
    cool: Number
})
var reviewSchema = new mongoose.Schema({
    username: String,
    text: String,
    stars: Number,
    date: {
        type: Date,
        defalt: Date.now
    }
});

var businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    city: String,
    review_count: Number,
    categories: [String],
    reviews: [reviewSchema],
    location: {
        address: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
});

mongoose.model('Business', businessSchema, 'business');
