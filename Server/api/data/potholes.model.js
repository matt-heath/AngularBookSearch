var mongoose = require('mongoose');

var votesSchema = new mongoose.Schema({
    funny: Number,
    useful: Number,
    cool: Number
});

var reviewSchema = new mongoose.Schema({
    username: String,
    votes: votesSchema,
    text: String,
    stars: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

var potholesSchema = new mongoose.Schema({
    properties: {
        ENQUIRY_TYPE: {
            type: String,
            required: true
        },
        ENQUIRY_CATEGORY: {
            type: String,
            required: true
        },
        DATE_RECORDED: {
            type: Date,
            default: Date.now
        },
        ENQUIRY_SOURCE: {
            type: String,
            required: true
        },
        DIVISION: {
            type: String,
            required: true
        },
        CLIENT_OFFICE_NAME : {
            type: String,
            required: true
        },
        APPROVAL_STATUS_NAME: {
            type: String,
            required: true
        }
    },
    geometry: {
        // address: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
});

mongoose.model('Pothole', potholesSchema, 'potholes');