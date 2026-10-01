import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const trailTeam = await Team.findOneAndUpdate(
      { name: 'Trailblazers' },
      { $set: { description: 'Steady miles and fresh air.', members: [] } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    const strengthTeam = await Team.findOneAndUpdate(
      { name: 'Power Crew' },
      { $set: { description: 'Building strength together.', members: [] } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    if (!trailTeam || !strengthTeam) throw new Error('Unable to create seed teams');

    const userSeeds = [
      { username: 'jordan.lee', name: 'Jordan Lee', email: 'jordan.lee@example.test', age: 16, fitnessLevel: 'intermediate', goal: 'improve endurance', team: trailTeam._id },
      { username: 'maya.chen', name: 'Maya Chen', email: 'maya.chen@example.test', age: 15, fitnessLevel: 'beginner', goal: 'build strength', team: strengthTeam._id },
      { username: 'sam.rivera', name: 'Sam Rivera', email: 'sam.rivera@example.test', age: 17, fitnessLevel: 'advanced', goal: 'stay active', team: trailTeam._id },
    ];
    const users = await Promise.all(
      userSeeds.map(async (userSeed) => {
        const user = await User.findOneAndUpdate(
          { username: userSeed.username },
          { $set: userSeed },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
        );
        if (!user) throw new Error(`Unable to create seed user ${userSeed.username}`);
        return user;
      }),
    );
    const usersByName = new Map(users.map((user) => [user.username, user]));

    await Team.findByIdAndUpdate(trailTeam._id, {
      $set: { members: [usersByName.get('jordan.lee')!._id, usersByName.get('sam.rivera')!._id] },
    });
    await Team.findByIdAndUpdate(strengthTeam._id, {
      $set: { members: [usersByName.get('maya.chen')!._id] },
    });

    const activitySeeds = [
      { username: 'jordan.lee', activityType: 'running', durationMinutes: 32, distanceKm: 4.8, caloriesBurned: 310, points: 48, completedAt: new Date('2026-09-29T16:30:00.000Z'), notes: 'Easy loop after school.' },
      { username: 'jordan.lee', activityType: 'cycling', durationMinutes: 40, distanceKm: 11.2, caloriesBurned: 360, points: 42, completedAt: new Date('2026-09-30T16:00:00.000Z'), notes: 'Neighborhood ride.' },
      { username: 'maya.chen', activityType: 'strength-training', durationMinutes: 28, distanceKm: 0, caloriesBurned: 190, points: 35, completedAt: new Date('2026-09-29T17:00:00.000Z'), notes: 'Full-body beginner circuit.' },
      { username: 'maya.chen', activityType: 'walking', durationMinutes: 35, distanceKm: 2.6, caloriesBurned: 145, points: 28, completedAt: new Date('2026-09-30T17:30:00.000Z'), notes: 'Walk with a friend.' },
      { username: 'sam.rivera', activityType: 'running', durationMinutes: 25, distanceKm: 5.1, caloriesBurned: 340, points: 52, completedAt: new Date('2026-10-01T15:30:00.000Z'), notes: 'Tempo run.' },
    ];
    const pointsByUser = new Map(users.map((user) => [user.username, 0]));
    for (const activitySeed of activitySeeds) {
      const user = usersByName.get(activitySeed.username);
      if (!user) throw new Error(`Missing seed user ${activitySeed.username}`);
      const { username, ...activityData } = activitySeed;
      await Activity.findOneAndUpdate(
        { user: user._id, activityType: activityData.activityType, completedAt: activityData.completedAt },
        { $set: { ...activityData, user: user._id } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      );
      pointsByUser.set(username, (pointsByUser.get(username) ?? 0) + activitySeed.points);
    }

    const standings = [...pointsByUser.entries()].sort((first, second) => second[1] - first[1]);
    for (const [index, [username, points]] of standings.entries()) {
      const user = usersByName.get(username);
      if (!user) throw new Error(`Missing seed user ${username}`);
      await Leaderboard.findOneAndUpdate(
        { user: user._id, period: 'all-time' },
        { $set: { points, rank: index + 1 } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      );
    }

    const workoutSeeds = [
      { title: 'First Five-Kilometer Run', description: 'Build a comfortable running base with an easy-paced route.', activityType: 'running', level: 'beginner', durationMinutes: 30, goal: 'improve endurance' },
      { title: 'Bodyweight Strength Circuit', description: 'Cycle through squats, push-ups, lunges, and planks with controlled form.', activityType: 'strength-training', level: 'beginner', durationMinutes: 25, goal: 'build strength' },
      { title: 'Recovery Walk', description: 'Take a brisk walk at a conversational pace and finish with gentle stretching.', activityType: 'walking', level: 'beginner', durationMinutes: 30, goal: 'general fitness' },
      { title: 'Tempo Ride', description: 'Alternate steady cycling with short efforts at a challenging pace.', activityType: 'cycling', level: 'intermediate', durationMinutes: 40, goal: 'improve endurance' },
      { title: 'Mobility and Balance', description: 'Practice a sequence of yoga poses focused on balance and full-body mobility.', activityType: 'yoga', level: 'intermediate', durationMinutes: 20, goal: 'improve mobility' },
    ];
    await Promise.all(
      workoutSeeds.map((workoutSeed) =>
        Workout.findOneAndUpdate(
          { title: workoutSeed.title },
          { $set: workoutSeed },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
        ),
      ),
    );

    console.log('Seeded users, teams, activities, leaderboard entries, and workouts.');
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
