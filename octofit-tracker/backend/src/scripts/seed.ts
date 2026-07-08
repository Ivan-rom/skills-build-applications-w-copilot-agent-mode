import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const teams = await Team.insertMany([
      {
        name: 'North Stars',
        sport: 'Running',
        description: 'A fast-paced endurance team focused on marathon prep and community runs.',
        focus: 'endurance',
      },
      {
        name: 'River Riders',
        sport: 'Cycling',
        description: 'A mixed-ability cycling crew that loves weekend rides and recovery sessions.',
        focus: 'recovery',
      },
    ]);

    const users = await User.insertMany([
      {
        firstName: 'Maya',
        lastName: 'Chen',
        username: 'maya.chen',
        email: 'maya@example.com',
        goal: 'Complete a half marathon',
        fitnessLevel: 'advanced',
        teamId: teams[0]._id,
      },
      {
        firstName: 'Liam',
        lastName: 'Ortiz',
        username: 'liam.ortiz',
        email: 'liam@example.com',
        goal: 'Improve cycling endurance',
        fitnessLevel: 'intermediate',
        teamId: teams[1]._id,
      },
      {
        firstName: 'Nia',
        lastName: 'Patel',
        username: 'nia.patel',
        email: 'nia@example.com',
        goal: 'Build strength and mobility',
        fitnessLevel: 'beginner',
        teamId: teams[0]._id,
      },
    ]);

    await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'Run',
        durationMinutes: 45,
        distanceKm: 8.4,
        calories: 520,
        notes: 'Tempo run along the riverside trail.',
        date: new Date('2026-07-05T06:30:00.000Z'),
      },
      {
        userId: users[1]._id,
        type: 'Ride',
        durationMinutes: 90,
        distanceKm: 32,
        calories: 780,
        notes: 'Steady cadence ride with a hill repeat section.',
        date: new Date('2026-07-06T08:00:00.000Z'),
      },
      {
        userId: users[2]._id,
        type: 'Strength',
        durationMinutes: 35,
        calories: 240,
        notes: 'Full-body circuit with mobility work.',
        date: new Date('2026-07-07T18:15:00.000Z'),
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        userId: users[0]._id,
        rank: 1,
        points: 1240,
        streak: 7,
      },
      {
        userId: users[1]._id,
        rank: 2,
        points: 1080,
        streak: 4,
      },
      {
        userId: users[2]._id,
        rank: 3,
        points: 940,
        streak: 3,
      },
    ]);

    await Workout.insertMany([
      {
        title: 'HIIT Cardio',
        focus: 'cardio',
        durationMinutes: 20,
        difficulty: 'hard',
        equipment: ['mat', 'timer'],
        description: 'Short intervals to boost endurance and calorie burn.',
      },
      {
        title: 'Mobility Flow',
        focus: 'recovery',
        durationMinutes: 15,
        difficulty: 'easy',
        equipment: ['yoga mat'],
        description: 'Gentle mobility sequence for post-workout recovery.',
      },
      {
        title: 'Hill Strength Circuit',
        focus: 'strength',
        durationMinutes: 30,
        difficulty: 'moderate',
        equipment: ['dumbbells'],
        description: 'A balanced strength circuit for building power and stability.',
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

void seedDatabase();
