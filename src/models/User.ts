import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  link: { type: String, required: true },
});

// User Schema == MAIN ==
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['super_admin', 'admin', 'user'], default: 'user' },
    phone: { type: String },
    photo_url: { type: String },
    isActive: { type: Boolean, default: true },
    social_links: { type: [socialLinkSchema], required: false, default: [] },
    provider: { type: String, enum: ['email', 'google', 'github', 'facebook'], required: true },
    verified_email: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
