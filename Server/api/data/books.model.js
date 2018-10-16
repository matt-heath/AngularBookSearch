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
    indexName: 'books', //The name of the index in Algolia, you can also pass in a function
    // selector: '-author', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
    // populate: {
    //     path: 'comments',
    //     select: 'author'
    // },
    // defaults: {
    //     author: 'unknown'
    // },
    // mappings: {
    //     title: function(value) {
    //         return `Book: ${value}`
    //     }
    // },
    // virtuals: {
    //     whatever: function(doc) {
    //         return `Custom data ${doc.title}`
    //     }
    // },
    // filter: function(doc) {
    //     return !doc.softdelete
    // },
    debug: true // Default: false -> If true operations are logged out in your console
});

// booksSchema.updateObjectToAlgolia();

// booksSchema.syncWithAlgolia();



mongoose.model('Books', booksSchema, 'books');
mongoose.model('Reviews', reviewSchema, 'books');

let Model = mongoose.model('Books', booksSchema);
Model.SyncToAlgolia();

// return AlgoliaMongooseModel;
const Book1 = mongoose.model('Books',booksSchema);

// Book1.syncWithAlgolia();
// async function updateObjectToAlgolia() {
//     const object = pick(this.toJSON(), booksSchema);
//
//     await index.saveObject({...object, objectID: this._algoliaObjectID});
// }

// Book.clearAlgoliaIndex();
// Book.syncWithAlgolia();

// updateObjectToAlgolia() {
//     await index.saveObject({ ...object, objectID: this._algoliaObjectID });
// }

