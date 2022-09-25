const mongoose = require('mongoose')
const slugify = require("slugify");
const uniqueSlug = require("unique-slug");

let ArticleSchema = new mongoose.Schema(
    {
        slug: String,
        title: String,
        description: String,
        body: String,
        taglist: Array,
        createdAt: Date,
        updatedAt: Date,
        image: String,
        favourites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        favouritedCount: Number,        
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
        flags: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        timestamps: true
    }
);
ArticleSchema.pre("save", async function (next) {
    const unique = uniqueSlug(new Date().getTime().toString());
    this.slug = slugify(this.title, { lower: true }) + `.${unique}`;
    next();
});
ArticleSchema.pre("findOneAndUpdate", async function (next) {
    try {
      if (this._update.title) {
        const unique = uniqueSlug(new Date().getTime().toString());
        this._update.slug = slugify(this._update.title, { lower: true }) + `.${unique}`;
      }
      next();
    } catch (err) {
      return next(err);
    }
  });
module.exports = mongoose.model('Article', ArticleSchema)