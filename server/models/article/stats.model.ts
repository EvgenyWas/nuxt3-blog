import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      immutable: true,
      maxLength: 2048,
    },
    topic: {
      type: String,
      required: true,
      immutable: true,
      maxLength: 48,
    },
    views: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

schema.set('toObject', {
  transform: function (_, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;

    return ret;
  },
});

const ArticleStats = model('article_stats', schema);

export default ArticleStats;
