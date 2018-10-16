var mongoose = require('mongoose');
// var mongoolia =  require('mongoolia').default;
var mongooseAlgolia = require('mongoose-algolia');

var reviewSchema = new mongoose.Schema({
    username: String,
    text: String,
    stars: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

var ObjectId = mongoose.Schema.Types.ObjectId;

var booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // algoliaIndex: true
    },
    isbn: {
        type: String,
        required: true,
        // algoliaIndex: true
    },
    pageCount: {
        type: Number,
        min: 0,
        default: 0,
        // algoliaIndex: true
    },
    publishedDate: {
        date: {
            type: Date,
            // algoliaIndex: true
        }
    },
    thumbnailUrl: {
        type: String,
        // algoliaIndex: true
    },
    shortDescription: {
        type: String,
        required: true,
        // algoliaIndex: true
    },
    longDescription: {
        type: String,
        required: true,
        // algoliaIndex: true
    },
    //There are 2 status types - PUBLISH and MEAP
    status: {
        type: String,
        required: true,
        // algoliaIndex: true
    },
    authors:{
        type: [String],
        required: true,
        // algoliaIndex: true
    },
    categories: {
        type: [String],
        // algoliaIndex: true
    },
    reviews: [reviewSchema],
    review_count: Number,
    _id: {
        // algoliaIndex:true,
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
        // type: ObjectId,
    }

});

// booksSchema._id = mongoose.Types.ObjectId();

// booksSchema.plugin(mongoolia, {
//     appId: '78NYJ53UIA',
//     apiKey: '073c4cc9a3b932400599c3a664a6e340',
//     indexName: 'books'
// });

booksSchema.plugin(mongooseAlgolia,{
    appId: '78NYJ53UIA',
    apiKey: '073c4cc9a3b932400599c3a664a6e340',
    indexName: 'books',
    debug: true // Default: false -> If true operations are logged out in your console
});

mongoose.model('Books', booksSchema, 'books');
mongoose.model('Reviews', reviewSchema, 'books');

let Model = mongoose.model('Books', booksSchema);
Model.SyncToAlgolia();

const Book1 = mongoose.model('Books',booksSchema);

