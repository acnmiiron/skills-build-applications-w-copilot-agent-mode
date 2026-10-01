import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    age: { type: Number, min: 10, max: 120 },
    fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    goal: { type: String, trim: true, default: 'general fitness' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'strength-training', 'cycling', 'yoga'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0, default: 0 },
    caloriesBurned: { type: Number, min: 0, default: 0 },
    points: { type: Number, min: 0, default: 0 },
    completedAt: { type: Date, default: Date.now, index: true },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0, default: 0 },
    rank: { type: Number, required: true, min: 1 },
    period: { type: String, enum: ['weekly', 'monthly', 'all-time'], default: 'all-time' },
  },
  { timestamps: true },
);
leaderboardSchema.index({ user: 1, period: 1 }, { unique: true });

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'strength-training', 'cycling', 'yoga'],
      required: true,
    },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    goal: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const User = models.User ?? model('User', userSchema);
export const Team = models.Team ?? model('Team', teamSchema);
export const Activity = models.Activity ?? model('Activity', activitySchema);
export const Leaderboard = models.Leaderboard ?? model('Leaderboard', leaderboardSchema);
export const Workout = models.Workout ?? model('Workout', workoutSchema);