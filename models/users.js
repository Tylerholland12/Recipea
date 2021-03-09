/* This module exports the user schema */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  password: { type: String, select: false },
  username: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  email: { type: String, required: true },
  content: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
}, { timestamps: { createdAt: 'created_at' } });


UserSchema.pre('save', function (next) {
  // password ecnryption
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(user.password, salt, (_errSecond, hash) => {
      user.password = hash;
      next();
    });
  });
  return null;
});


UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

// Export file
module.exports = mongoose.model('User', UserSchema);