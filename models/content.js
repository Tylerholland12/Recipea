// This module exports the Content schema
const mongoose = require('mongoose');
const Populate = require('../utils/autopop');

const { Schema } = mongoose;

const ContentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
}, { timestamps: { createdAt: 'created_at' } });

ContentSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))
  .pre('findById', Populate('author'));

  // export file
module.exports = mongoose.model('Content', ContentSchema);