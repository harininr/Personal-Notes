const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  tags:    { type: [String], default: [] },
  pinned:  { type: Boolean, default: false }
}, { timestamps: true });

// Text index for search
NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
