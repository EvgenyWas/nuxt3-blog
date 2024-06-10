import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    title: { type: String, required: true, immutable: true },
    topic: { type: String, required: true, immutable: true },
    views: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const ArticleStats = model('article_stats', schema);

export default ArticleStats;
