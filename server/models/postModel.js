const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, 'A post must have a heading'],
      // maxlength: [100, 'A post heading cannot have more than 100 characters'],
      minLength: [1, 'A post heading must have atleast 1 character'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'A post must have a body'],
      trim: true,
      // maxlength: [2000, 'A post body cannot have more than 2000 characters'],
      minLength: [1, 'A post body must have atleast 1 character']
    },
    images: {
      type: [String],
      default: [
        'https://us.123rf.com/450wm/treety/treety2309/treety230900050/214313034-businessman-uses-pencil-write-complaint-paper-document-bad-review-from-client-consumer-made.jpg?ver=6'
      ]
    },
    imgRef: {
      type: [String],
      default: []
    },
    createdAt: {
      type: Date,
      default: () => {
        return Date.now();
      }
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    tags: {
      type: String,
      enum: ['Hostel', 'Academics', 'Mess', 'Finance', 'Others'],
      default: []
    },
    upvoters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    downvoters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: Number, // 0 - Fresh, 1 - Addressed, 2 - Resolved
      default: 0,
      required: [true, 'A post must have a status'],
      min: 0,
      max: 2
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// INDEXING
postSchema.index({ downvoters: 1 });
postSchema.index({ upvoters: 1 });

// VIRTUAL FIELDS
postSchema.virtual('upvoteCount').get(function() {
  return this.upvoters.length;
});

postSchema.virtual('downvoteCount').get(function() {
  return this.downvoters.length;
});

// VIRTUAL POPULATE

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

// VIRTUAL FIELDS

// QUERY MIDDLEWARE
postSchema.pre(/^find/, function(next) {
  this.start = Date.now();
  next();
});

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

postSchema.post(/^find/, function(docs, next) {
  //eslint-disable-next-line
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
